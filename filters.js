/**
 * 필터링 로직
 * 연령대, 카테고리, 과목 필터 + 검색어 조합
 */

// 데이터 접근 함수
function getAllCategories() {
  const categories = window.state?.categories;
  return categories && typeof categories === 'object' ? categories : {};
}

function getCategoryName(key) {
  const c = getAllCategories()[key];
  return c ? c.name : key;
}

function getCategoryIcon(key) {
  const c = getAllCategories()[key];
  return c ? c.icon : "📁";
}

function normalizeSiteKey(site) {
  if (!site) return "";
  const urlRaw = (site.url || "").toString().trim();
  if (urlRaw) {
    try {
      const parsed = new URL(urlRaw);
      const host = parsed.hostname.replace(/^www\./i, "");
      const path = parsed.pathname.replace(/\/+$/, "");
      return `${host}${path}`.toLowerCase();
    } catch (err) {
      // URL 파싱이 실패하면 아래 이름 기반 정규화로 폴백
    }
    return urlRaw
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/[#?].*$/, "")
      .replace(/\/+$/, "");
  }

  const fallback = (site.name || "").toString().trim();
  if (!fallback) return "";
  return fallback
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function shouldDedupeAcrossCategories() {
  const query = (window.state?.currentSearchQuery || "").trim();
  if (!query) return false;
  const category = window.state?.currentCategoryFilter || "all";
  return category === "all" || category === "전체";
}

function dedupeSites(sites) {
  const aggregated = new Map();
  const result = [];

  for (const site of sites) {
    const key = normalizeSiteKey(site);
    if (!key) continue;

    const category = site.category;
    const existing = aggregated.get(key);

    if (existing) {
      const { target, categories } = existing;
      if (category && !categories.has(category)) {
        categories.add(category);
        target._allCategories = Array.from(categories);
        target._alsoIn = target._allCategories.slice(1);
      }

      if (site.desc) {
        if (!target.desc || site.desc.length > target.desc.length) {
          target.desc = site.desc;
        }
      }
      continue;
    }

    const clone = { ...site };
    const categories = new Set();
    if (category) categories.add(category);
    clone._allCategories = Array.from(categories);
    clone._alsoIn = clone._allCategories.slice(1);

    aggregated.set(key, { target: clone, categories });
    result.push(clone);
  }

  return result;
}

// 필터링 실행
function getFilteredSites() {
  const rawQ = window.state.currentSearchQuery || "";
  const q = rawQ.trim().toLowerCase();

  let filtered = window.state.sites.filter(site => {
    // 연령대 필터
    if (window.state.currentAgeFilter !== "all" &&
        !site.ages.includes(window.state.currentAgeFilter)) {
      return false;
    }
    
    // 카테고리 필터
    if (window.state.currentCategoryFilter !== "all" && 
        site.category !== window.state.currentCategoryFilter) {
      return false;
    }
    
    // 과목 필터
    if (window.state.currentSubjectFilter !== "all" && 
        !site.subjects.includes(window.state.currentSubjectFilter)) {
      return false;
    }
    
    // 검색어가 없으면 통과
    if (!q) return true;

    // 검색 대상 문자열
    const ageNames = window.ddakpilmoConfig?.ageNames || {};
    const subjectNames = window.ddakpilmoConfig?.subjectNames || {};
    
    const searchTarget = (
      site.name + " " + 
      (site.desc || "") + " " + 
      getCategoryName(site.category) + " " +
      site.ages.map(a => ageNames[a] || a).join(" ") + " " +
      site.subjects.map(sub => subjectNames[sub] || sub).join(" ") + " " +
      (site.chosung || "")
    ).toLowerCase();

    const tokens = q.split(/\s+/).filter(t => t.length > 0);

    // 모든 토큰이 매칭되어야 함
    return tokens.every(token => {
      const tokenChosung = getChosung(token).toLowerCase();
      const siteChosung = (site.chosung || "").toLowerCase();

      // 일반 문자열 포함
      if (searchTarget.includes(token)) return true;

      // 초성 검색
      if (siteChosung.includes(token)) return true;
      if (siteChosung.includes(tokenChosung)) return true;
      if (getChosung(site.name).toLowerCase().includes(tokenChosung)) return true;

      return false;
    });
  });

  return filtered;
}

function getDedupedUnifiedResults(baseList) {
  if (!shouldDedupeAcrossCategories()) return [];
  const source = Array.isArray(baseList) ? baseList : getFilteredSites();
  return dedupeSites(source);
}

// 캐싱된 필터링 (메모리 관리자 사용)
function getFilteredSitesWithCache() {
  const cacheManager = window.memoryManager?.cacheManager;
  
  const cacheKey = `filtered_${window.state.currentSearchQuery}_${window.state.currentAgeFilter}_${window.state.currentCategoryFilter}_${window.state.currentSubjectFilter}`;
  
  if (cacheManager) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      console.log(`💾 캐시 사용: ${cacheKey}`);
      return cached;
    }
  }
  
  const filtered = getFilteredSites();
  
  if (cacheManager) {
    cacheManager.set(cacheKey, filtered);
  }
  
  return filtered;
}

// 필터 초기화
function resetFilters() {
  window.state.currentAgeFilter = "all";
  window.state.currentCategoryFilter = "all";
  window.state.currentSubjectFilter = "all";
  window.state.currentSearchQuery = "";
  window.state.currentPageByCategory = {};
  
  // UI 초기화
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  
  // 연령대 필터 리셋
  document.querySelectorAll("#ageFilter .filter-btn").forEach(b => {
    b.classList.remove("active");
  });
  const allAgeBtn = document.querySelector("#ageFilter .filter-btn[data-age='all']");
  if (allAgeBtn) allAgeBtn.classList.add("active");
  
  // 과목 필터 리셋
  const subjectFilter = document.getElementById("subjectFilter");
  if (subjectFilter) subjectFilter.value = "all";
  
  // 카테고리 탭 리셋
  document.querySelectorAll("#filterTabs .tab-btn").forEach(b => {
    b.classList.remove("active");
  });
  const allTab = document.querySelector("#filterTabs .tab-btn[data-cat='all']");
  if (allTab) allTab.classList.add("active");
  
  // 렌더링
  if (typeof renderSites === 'function') {
    renderSites();
  }
  
  showToast("모든 필터가 초기화되었습니다");
}

// Export
window.filterManager = {
  getFiltered: getFilteredSites,
  getFilteredWithCache: getFilteredSitesWithCache,
  reset: resetFilters,
  getCategoryName,
  getCategoryIcon,
  getAllCategories,
  shouldDedupeAcrossCategories,
  getDedupedUnifiedResults
};
