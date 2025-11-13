/* render.js (fixed) — 카드가 생성되지 않던 이슈를 해결한 렌더링 전용 스크립트
 * 핵심 수정:
 * 1) state/start 변수 충돌로 slice가 NaN 되던 문제 수정(startIdx/endIdx)
 * 2) RAF/shallowEqualArray/siteKeyOf 미정의 보완
 * 3) filterManager 의존 제거하고 getAllCategories()로 통일
 * 4) 전역 내보내기 충돌(clean) 및 renderSites 한 번만 덮어쓰기
 * 5) 하이라이트 전역명 불일치(ddakHighlight) 안전 처리
 */
(function(){
  'use strict';

  // ========= 안전 유틸 =========
  const RAF = (typeof window !== 'undefined' && (window.requestAnimationFrame || (cb=>setTimeout(cb,16)))) || (cb=>setTimeout(cb,16));

  function shallowEqualArray(a, b) {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
  function siteKeyOf(site){ return (site && (site.url || site.name)) || ''; }

  // ========= 전역 의존(있으면 사용, 없으면 안전 폴백) =========
  const getAllCategoriesSafe = (typeof getAllCategories === 'function') ? getAllCategories : () => ({}) ;
  const getCategoryNameSafe  = (typeof getCategoryName  === 'function') ? getCategoryName  : (k)=>k ;
  const getFilteredSitesSafe = (typeof getFilteredSitesWithCache === 'function') ? getFilteredSitesWithCache : ((typeof getFilteredSites === 'function') ? getFilteredSites : () => []);
  const shareSiteSafe        = (typeof shareSite === 'function') ? shareSite : function(){};
  const state                = (typeof window !== 'undefined' && window.state) ? window.state : { sites: [], ITEMS_PER_PAGE: 5, currentPageByCategory: {}, currentCategoryFilter: 'all' };
  const GOV_ICON             = (typeof GOV_ICON_DATA_URL !== 'undefined') ? GOV_ICON_DATA_URL : '';
  const HL                   = (typeof window !== 'undefined' && window.ddakHighlight) ? window.ddakHighlight : { apply(){}, clear(){} };

  function normalizeUrlKey(url='') {
    try {
      const u = new URL(url);
      let host = u.hostname.replace(/^www\./i, '');
      let path = u.pathname.replace(/\/+$/, ''); // trailing slash 제거
      return host + path; // 쿼리/해시는 보통 제외
    } catch {
      return String(url).replace(/^https?:\/\//i, '').replace(/^www\./i,'').replace(/\/+$/,'');
    }
  }

  
  // ========= DOM 빌더 =========
  function createSiteCard(site){
    const card = document.createElement('div');
    card.className = 'link-card';
    card.setAttribute('data-site', site.name || '');

    // 왼쪽: favicon
    const left = document.createElement('div');
    left.className = 'card-left';
    const img = document.createElement('img');
    img.src = 'https://www.google.com/s2/favicons?sz=64&domain_url=' + encodeURIComponent(site.url || '');
    img.alt = (site.name || '') + ' favicon';
    img.className = 'site-favicon';
    img.onerror = function(){
      const fallback = document.createElement('div');
      fallback.className = 'fallback-icon';
      fallback.textContent = site.name && site.name.length ? site.name.charAt(0).toUpperCase() : '?';
      img.replaceWith(fallback);
    };
    left.appendChild(img);

    // 오른쪽
    const right = document.createElement('div');
    right.className = 'card-right';

    const header = document.createElement('div');
    header.className = 'link-card-header';

    const a = document.createElement('a');
    a.href = site.url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'site-title';
    a.textContent = site.name || '이름 없음';

    // 정부 배지
    if (site.isGov === true && GOV_ICON){
      const govIcon = document.createElement('img');
      govIcon.className = 'gov-flag korea-gov';
      govIcon.src = GOV_ICON;
      govIcon.alt = '대한민국정부 로고';
      govIcon.title = '대한민국 정부 운영';
      a.appendChild(govIcon);
    }

    // 공유 버튼
    const shareBtn = document.createElement('button');
    shareBtn.className = 'share-btn';
    shareBtn.type = 'button';
    shareBtn.textContent = '📤';
    shareBtn.setAttribute('aria-label','공유');
    shareBtn.addEventListener('click', (e)=>{ e.stopPropagation(); shareSiteSafe(site.name || '', site.url || ''); });
    card.appendChild(shareBtn);

    header.appendChild(a);

    const desc = document.createElement('p');
    desc.className = 'site-desc';
    desc.textContent = site.desc || '설명이 없습니다.';

    const tags = document.createElement('div');
    tags.className = 'link-card-tags';

    // 카테고리 태그
    const catTag = document.createElement('span');
    catTag.className = 'tag category-tag';
    catTag.textContent = getCategoryNameSafe(site.category);
    tags.appendChild(catTag);


    // 연령 태그
    const ageNames = window.ddakpilmoConfig?.ageNames || {
      elem: "초등학생",
      mid: "중학생", 
      high: "고등학생",
      adult: "성인"
    };
    (site.ages || []).forEach(age => {
      const t = document.createElement("span");
      t.className = "tag age-tag";
      t.textContent = ageNames[age] || age;  // 🔥 한글 이름으로 표시
      tags.appendChild(t);
    });
    
    if (Array.isArray(site._alsoIn) && site._alsoIn.length > 0) {
      const also = document.createElement('div');
      also.className = 'also-in';
      also.textContent = '또 포함: ';
      site._alsoIn.forEach((ck, i) => {
        const b = document.createElement('span');
        b.className = 'tag also-tag';
        b.textContent = getCategoryNameSafe(ck);
        also.appendChild(b);
      });
      tags.appendChild(also);
    }

    right.appendChild(header);
    right.appendChild(desc);
    right.appendChild(tags);

    card.appendChild(left);
    card.appendChild(right);

    const i2 = card.querySelector('img');
    if (i2 && !i2.loading) i2.loading = 'lazy';

    return card;
  }

  function ensureGovMarkers(card, site){
    try {
      const header = card.querySelector('.link-card-header');
      if (!header) return;
      card.querySelectorAll('.gov-badge, .gov-tag, .gov-flag').forEach(el=>el.remove());
      if (!site || site.isGov !== true || !GOV_ICON) return;
      const title = header.querySelector('.site-title');
      if (!title) return;
      const govIcon = document.createElement('img');
      govIcon.className = 'gov-flag korea-gov';
      govIcon.src = GOV_ICON;
      govIcon.alt = '대한민국정부 로고';
      govIcon.title = '대한민국 정부 운영';
      title.appendChild(govIcon);
    } catch(e){ console.warn('ensureGovMarkers failed', e); }
  }

  function buildCardsFragment(sitesSlice){
    const frag = document.createDocumentFragment();
    for (const site of sitesSlice){
      const card = createSiteCard(site);
      try { ensureGovMarkers(card, site); } catch(_){}
      frag.appendChild(card);
    }
    return frag;
  }

  // ========= 카테고리 섹션 =========
  function createCategorySection(categoryKey){
    const all = getAllCategoriesSafe();
    const info = all[categoryKey];
    if (!info) return null;
    const section = document.createElement('div');
    section.className = 'category-section';
    section.id = `${categoryKey}-section`;
    section.innerHTML = `
      <div class="category-header">
        <div class="category-info">
          <span class="category-icon">${info.icon}</span>
          <div>
            <div class="category-title">${info.name}</div>
            <div class="category-subtitle">${categoryKey}</div>
          </div>
        </div>
        <div class="category-count" id="${categoryKey}-count">0</div>
      </div>
      <div class="category-content" id="${categoryKey}-content"></div>
      <div class="pagination" id="${categoryKey}-pagination"></div>
    `;
    return section;
  }

  function renderCategorySections(){
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
    container.innerHTML = '';
    const keys = Object.keys(getAllCategoriesSafe());
    keys.forEach(k=>{
      const sec = createCategorySection(k);
      if (sec) container.appendChild(sec);
    });
  }

  // ========= 페이지네이션 =========
  function renderPagination(category, totalItems){
    const container = document.getElementById(`${category}-pagination`);
    if (!container) return;
    container.innerHTML = '';

    const perPage = state.ITEMS_PER_PAGE || 5;
    const totalPages = Math.ceil(totalItems / perPage);
    if (totalPages <= 1) return;

    const currentPage = (state.currentPageByCategory && state.currentPageByCategory[category]) || 1;

    function createBtn(label, page, disabled=false, active=false, isEllipsis=false){
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.className = 'page-btn' + (active ? ' active' : '');
      btn.disabled = !!disabled;
      btn.addEventListener('click', ()=>{
        if (isEllipsis){
          const input = prompt(`이동할 페이지 번호를 입력하세요 (1 ~ ${totalPages})`);
          const target = parseInt(input, 10);
          if (!isNaN(target) && target>=1 && target<=totalPages){
            state.currentPageByCategory[category] = target;
            requestRenderSites();
            smoothScrollToCategory(category, 800);
          }
        } else {
          state.currentPageByCategory[category] = page;
          requestRenderSites();
          smoothScrollToCategory(category, 800);
        }
      });
      return btn;
    }

    container.appendChild(createBtn('◀', currentPage-1, currentPage===1));

    let start = Math.max(1, currentPage-2);
    let end   = Math.min(totalPages, currentPage+2);

    if (start > 1){
      container.appendChild(createBtn('1', 1, false, currentPage===1));
      if (start > 2) container.appendChild(createBtn('...', null, false, false, true));
    }
    for (let i=start; i<=end; i++) container.appendChild(createBtn(String(i), i, false, i===currentPage));
    if (end < totalPages){
      if (end < totalPages-1) container.appendChild(createBtn('...', null, false, false, true));
      container.appendChild(createBtn(String(totalPages), totalPages, false, currentPage===totalPages));
    }

    container.appendChild(createBtn('▶', currentPage+1, currentPage===totalPages));
  }

  // ========= 레이아웃/통계 =========
  function updateResultColumnsByVisibleCategories(){
    const container = document.querySelector('.categories-container');
    if (!container) return;
    const visible = [...container.querySelectorAll('.category-section')].filter(sec => (sec.style.display || getComputedStyle(sec).display) !== 'none');
    let n = visible.length;
    if (n <= 0) n = 0; else if (n === 1) n = 1; else if (n === 2) n = 2; else n = 3;
    container.classList.remove('results-cols-0','results-cols-1','results-cols-2','results-cols-3','results-cols-4');
    container.classList.add(`results-cols-${n}`);
  }

  function updateStats(totalFiltered){
    const total = (state.sites && state.sites.length) || 0;
    const filtered = (typeof totalFiltered === 'number') ? totalFiltered : (getFilteredSitesSafe().length || 0);
    const totalCountEl = document.getElementById('totalCount');
    const filteredCountEl = document.getElementById('filteredCount');
    const paginationInfo = document.getElementById('paginationInfo');
    if (totalCountEl) totalCountEl.textContent = String(total);
    if (filteredCountEl) filteredCountEl.textContent = String(filtered);
    if (paginationInfo){
      const perPage = state.ITEMS_PER_PAGE || 5;
      const totalPages = Math.ceil(filtered / perPage) || 1;
      paginationInfo.textContent = `📄 ${perPage}개씩 보기 · 1/${totalPages} 페이지`;
    }
  }

  // ========= 스크롤 =========
  function smoothScrollToCategory(category, duration=800){
    const targetEl = document.getElementById(`${category}-section`);
    if (!targetEl) return;
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();
    let cancelled = false;
    function cancelOnUserScroll(){ cancelled = true; removeCancelListeners(); }
    function addCancelListeners(){
      window.addEventListener('wheel', cancelOnUserScroll, { passive: true });
      window.addEventListener('touchstart', cancelOnUserScroll, { passive: true });
      window.addEventListener('keydown', cancelOnUserScroll, { passive: true });
    }
    function removeCancelListeners(){
      window.removeEventListener('wheel', cancelOnUserScroll);
      window.removeEventListener('touchstart', cancelOnUserScroll);
      window.removeEventListener('keydown', cancelOnUserScroll);
    }
    addCancelListeners();
    function step(){
      if (cancelled) return;
      const now = performance.now();
      const t = Math.min(1, (now - startTime)/duration);
      const ease = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
      window.scrollTo(0, startY + distance*ease);
      if (t < 1) RAF(step); else removeCancelListeners();
    }
    RAF(step);
  }

  // ========= 최적화 렌더 코어 =========
  const renderState = {
    scheduled: false,
    prevKeysByCategory: Object.create(null),
    prevCountByCategory: Object.create(null),
    prevStats: { total: -1, filtered: -1, perPage: -1, totalPages: -1 },
  };

  function renderSitesOptimizedCore(){
    try {
      const filtered = getFilteredSitesSafe();
      const categories = Object.keys(getAllCategoriesSafe());
      const hasResults = filtered.length > 0;

      for (const category of categories){
        const section = document.getElementById(`${category}-section`);
        const content = document.getElementById(`${category}-content`);
        const countEl = document.getElementById(`${category}-count`);
        if (!section || !content) continue;

        const list = filtered.filter(s => s.category === category);
        const totalCount = list.length;

        if (countEl && renderState.prevCountByCategory[category] !== totalCount){
          countEl.textContent = String(totalCount);
          renderState.prevCountByCategory[category] = totalCount;
        }

        if (totalCount === 0){
          section.style.display = 'none';
          renderState.prevKeysByCategory[category] = [];
          const pager = document.getElementById(`${category}-pagination`);
          if (pager) pager.innerHTML = '';
          continue;
        }

        section.style.display = 'block';

        const cur = state.currentCategoryFilter || 'all';
        const isAllView = (cur === 'all' || cur === '전체');
        const isSelectedCategory = (!isAllView && cur === category);

        section.classList.toggle('expanded-category', isSelectedCategory);

        let slice;
        if (isSelectedCategory){
          slice = list; // 선택 카테고리는 전체 노출
        } else {
          const currentPage = (state.currentPageByCategory && state.currentPageByCategory[category]) || 1;
          const perPage     = state.ITEMS_PER_PAGE || 20;
          const startIdx    = (currentPage - 1) * perPage;
          const endIdx      = startIdx + perPage;
          slice = list.slice(startIdx, endIdx);
        }

        const visibleKeys = slice.map(siteKeyOf);
        const prevKeys = renderState.prevKeysByCategory[category] || [];

        if (!shallowEqualArray(prevKeys, visibleKeys)){
          const frag = buildCardsFragment(slice);
          content.replaceChildren(frag);
          const pager = document.getElementById(`${category}-pagination`);
          if (pager){
            if (isSelectedCategory){
              pager.innerHTML = '';
              pager.style.display = 'none';
            } else {
              pager.style.display = '';
              renderPagination(category, totalCount);
            }
          }
          renderState.prevKeysByCategory[category] = visibleKeys;
        }
      }

      const noResults = document.getElementById('noResults');
      if (noResults) noResults.style.display = hasResults ? 'none' : 'block';

      updateResultColumnsByVisibleCategories();

      const total = (state.sites && state.sites.length) || 0;
      const filteredLen = filtered.length;
      const perPage = state.ITEMS_PER_PAGE || 20;
      const totalPages = Math.ceil(filteredLen / perPage) || 1;
      const statsChanged = (
        renderState.prevStats.total !== total ||
        renderState.prevStats.filtered !== filteredLen ||
        renderState.prevStats.perPage !== perPage ||
        renderState.prevStats.totalPages !== totalPages
      );
      if (statsChanged){
        const totalCountEl = document.getElementById('totalCount');
        const filteredCountEl = document.getElementById('filteredCount');
        const paginationInfo = document.getElementById('paginationInfo');
        if (totalCountEl) totalCountEl.textContent = String(total);
        if (filteredCountEl) filteredCountEl.textContent = String(filteredLen);
        if (paginationInfo) paginationInfo.textContent = `📄 ${perPage}개씩 보기 · 1/${totalPages} 페이지`;
        renderState.prevStats = { total, filtered: filteredLen, perPage, totalPages };
      }

      try {
        const q = (state.currentSearchQuery || '').trim();
        const scope = document.getElementById('main') || document;
        if (q) HL.apply(q, scope); else HL.clear(scope);
      } catch(e){ console.warn('highlight skipped', e); }

    } catch(err){
      console.error('renderSitesOptimizedCore 오류:', err);
    } finally {
      renderState.scheduled = false;
    }
  }

  function requestRenderSites(){
    if (renderState.scheduled) return;
    renderState.scheduled = true;
    RAF(renderSitesOptimizedCore);
  }

  // ========= 공개 API / 전역 바인딩 =========
  window.renderManager = {
    renderSites: requestRenderSites,
    renderCategorySections,
    updateStats,
    createSiteCard,
    ensureGovMarkers,
    buildCardsFragment
  };
  if (!window.updateStats) {
    window.updateStats = updateStats;
  }
  // 하위 호환: 전역 renderSites 를 예약 렌더로 1회만 설정
  window.renderSites = requestRenderSites;

})();