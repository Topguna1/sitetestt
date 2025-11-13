/**
 * 이벤트 리스너 설정
 * 검색, 필터, 테마 전환 등 모든 사용자 인터랙션 처리
 */

// 카테고리 탭 생성
function buildCategoryTabs() {
  const tabs = document.getElementById("filterTabs");
  if (!tabs) return;
  
  tabs.innerHTML = "";
  const allCats = window.filterManager.getAllCategories();
  const keys = Object.keys(allCats);

  // 전체 탭
  const allBtn = document.createElement("button");
  allBtn.className = "tab-btn active";
  allBtn.dataset.cat = "all";
  allBtn.textContent = "전체";
  allBtn.setAttribute("role", "tab");
  allBtn.setAttribute("aria-selected", "true");
  allBtn.addEventListener("click", () => {
    updateActiveTab(allBtn);
    window.state.currentCategoryFilter = "all";
    window.state.currentPageByCategory = {};
    renderSites();
    updateCategoryPagingMode();
  });
  tabs.appendChild(allBtn);

  // 카테고리별 탭
  keys.forEach(key => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.dataset.cat = key;
    btn.textContent = `${allCats[key].icon} ${allCats[key].name}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", "false");
    btn.addEventListener("click", () => {
      updateActiveTab(btn);
      window.state.currentCategoryFilter = key;
      window.state.currentPageByCategory = {};
      renderSites();
      updateCategoryPagingMode();
    });
    tabs.appendChild(btn);
  });
}

function updateActiveTab(selectedTab) {
  document.querySelectorAll("#filterTabs .tab-btn").forEach(btn => {
    btn.classList.remove("active");
    btn.setAttribute("aria-selected", "false");
  });
  selectedTab.classList.add("active");
  selectedTab.setAttribute("aria-selected", "true");
}

function updateCategoryPagingMode() {
  const cur = window.state.currentCategoryFilter;
  const isAll = (cur === 'all' || cur === '전체');
  document.body.classList.toggle('category-nopaging', !isAll);
}

// 자동완성 항목에서 제목만 추출
function getAutocompleteTitle(el) {
  if (!el) return '';
  
  const byData = el.getAttribute('data-value') || el.getAttribute('data-title');
  if (byData) return byData.trim();

  const titleEl =
    el.querySelector('[data-role="title"]') ||
    el.querySelector('.title') ||
    el.querySelector('.item-title') ||
    el.querySelector('.name') ||
    el.firstElementChild;

  if (titleEl) return titleEl.textContent.trim();

  const clone = el.cloneNode(true);
  clone.querySelectorAll('.desc, .description, .meta, .subtitle, .extra, small').forEach(n => n.remove());
  return clone.textContent.trim();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  console.log("🔧 이벤트 리스너 설정 시작...");
  
  const manager = window.memoryManager?.eventManager;
  const searchInput = document.getElementById("searchInput");
  const autocompleteList = document.getElementById("autocomplete-list");
  
  if (!searchInput || !autocompleteList) {
    console.error("필수 검색 요소를 찾을 수 없습니다");
    return;
  }
  
  let currentFocus = -1;

  // 검색 입력 디바운스
  const debouncedSearch = debounce((value) => {
    try {
      window.state.currentSearchQuery = value;
      window.state.currentPageByCategory = {};
      renderSites();
    } catch (error) {
      console.error('검색 처리 오류:', error);
    }
  }, 300);

  // 검색 입력 이벤트
  const handleSearchInput = function() {
    const query = this.value.trim();
    autocompleteList.innerHTML = "";
    currentFocus = -1;

    debouncedSearch(query);

    if (!query) return;

    try {
      let matches = window.searchManager.search(query);
      
      matches.slice(0, 8).forEach(site => {
        if (!site || !site.name) return;
        
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.setAttribute("role", "option");
        
        const siteName = window.searchManager?.highlight 
          ? window.searchManager.highlight(site.name, query)
          : escapeHtml(site.name);

        const siteDesc = window.searchManager?.highlight 
          ? window.searchManager.highlight(site.desc || "", query)
          : escapeHtml(site.desc || "");

        item.innerHTML = `
          <strong>${siteName}</strong><br>
          <span class="autocomplete-desc">${siteDesc}</span>
        `;

        item.addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
  
          searchInput.value = site.name;
          window.state.currentSearchQuery = site.name;
          window.state.currentPageByCategory = {};
          autocompleteList.innerHTML = "";
          currentFocus = -1;
          renderSites();
        });

        autocompleteList.appendChild(item);
      });
      
    } catch (error) {
      console.error('자동완성 처리 오류:', error);
    }
  };

  // 키보드 네비게이션
  const handleSearchKeydown = function(e) {
    const items = autocompleteList.querySelectorAll(".autocomplete-item");
    const hasItems = items && items.length > 0;

    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && hasItems) {
      e.preventDefault();
      if (e.key === "ArrowDown") {
        currentFocus = (currentFocus + 1) % items.length;
      } else {
        currentFocus = (currentFocus - 1 + items.length) % items.length;
      }

      items.forEach(item => item.classList.remove("active"));
      items[currentFocus].classList.add("active");
      items[currentFocus].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });

      const val = getAutocompleteTitle(items[currentFocus]);
      this.value = val;
      debouncedSearch(val);

    } else if (e.key === "Enter") {
      if (hasItems && currentFocus > -1 && items[currentFocus]) {
        e.preventDefault();
        const val = getAutocompleteTitle(items[currentFocus]);
        this.value = val;
        debouncedSearch(val);
        autocompleteList.innerHTML = "";
        currentFocus = -1;
      }
    } else if (e.key === "Escape") {
      autocompleteList.innerHTML = "";
      currentFocus = -1;
      this.blur();
    }
  };

  // 외부 클릭 시 자동완성 닫기
  const handleDocumentClick = function(e) {
    if (e.target !== searchInput && !autocompleteList.contains(e.target)) {
      autocompleteList.innerHTML = "";
      currentFocus = -1;
    }
  };

  // 이벤트 등록
  if (manager) {
    manager.add(searchInput, "input", handleSearchInput);
    manager.add(searchInput, "keydown", handleSearchKeydown);
    manager.add(document, "click", handleDocumentClick);
  } else {
    searchInput.addEventListener("input", handleSearchInput);
    searchInput.addEventListener("keydown", handleSearchKeydown);
    document.addEventListener("click", handleDocumentClick);
  }

  // 연령대 필터
  document.querySelectorAll("#ageFilter .filter-btn").forEach(btn => {
    const handler = (e) => {
      document.querySelectorAll("#ageFilter .filter-btn").forEach(b => {
        b.classList.remove("active");
      });
      e.currentTarget.classList.add("active");
      window.state.currentAgeFilter = e.currentTarget.dataset.age;
      window.state.currentPageByCategory = {};
      renderSites();
    };
    
    if (manager) {
      manager.add(btn, "click", handler);
    } else {
      btn.addEventListener("click", handler);
    }
  });

  // 과목 필터
  const subjectFilter = document.getElementById("subjectFilter");
  if (subjectFilter) {
    const handler = (e) => {
      window.state.currentSubjectFilter = e.target.value;
      window.state.currentPageByCategory = {};
      renderSites();
    };
    
    if (manager) {
      manager.add(subjectFilter, "change", handler);
    } else {
      subjectFilter.addEventListener("change", handler);
    }
  }

  // 다크 모드 토글
  const darkToggle = document.getElementById("darkToggle");
  if (darkToggle) {
    const handler = () => {
      if (window.themeManager) {
        window.themeManager.toggle();
      }
    };
    
    if (manager) {
      manager.add(darkToggle, "click", handler);
    } else {
      darkToggle.addEventListener("click", handler);
    }
  }

  // 필터 초기화 버튼
  const resetBtn = document.getElementById("resetBtn");
  const viewAllBtn = document.getElementById("viewAllBtn");
  
  if (resetBtn) {
    const handler = () => window.filterManager.reset();
    if (manager) {
      manager.add(resetBtn, "click", handler);
    } else {
      resetBtn.addEventListener("click", handler);
    }
  }
  
  if (viewAllBtn) {
    const handler = () => window.filterManager.reset();
    if (manager) {
      manager.add(viewAllBtn, "click", handler);
    } else {
      viewAllBtn.addEventListener("click", handler);
    }
  }

  // 페이지당 개수 변경
  const itemsPerPage = document.getElementById("itemsPerPage");
  if (itemsPerPage) {
    const handler = (e) => {
      window.state.ITEMS_PER_PAGE = parseInt(e.target.value, 10);
      window.state.currentPageByCategory = {};
      renderSites();
    };
    
    if (manager) {
      manager.add(itemsPerPage, "change", handler);
    } else {
      itemsPerPage.addEventListener("change", handler);
    }
  }

  // Ctrl+K 단축키 (검색창 포커스)
  const handleCtrlK = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  };
  
  if (manager) {
    manager.add(document, "keydown", handleCtrlK);
  } else {
    document.addEventListener("keydown", handleCtrlK);
  }

  console.log("✅ 이벤트 리스너 설정 완료");
}

// Export
window.eventManager = {
  setup: setupEventListeners,
  buildCategoryTabs
};