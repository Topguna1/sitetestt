/**
 * 필터링 로직
 * 연령대, 카테고리, 과목 필터 + 검색어 조합
 */

// 데이터 접근 함수
function getAllCategories() { 
  return typeof defaultCategories !== 'undefined' ? defaultCategories : {}; 
}

function getCategoryName(key) { 
  const c = getAllCategories()[key]; 
  return c ? c.name : key; 
}

function getCategoryIcon(key) { 
  const c = getAllCategories()[key]; 
  return c ? c.icon : "📁"; 
}

// 필터링 실행
function getFilteredSites() {
  const rawQ = window.state.currentSearchQuery || "";
  const q = rawQ.trim().toLowerCase();

  return window.state.sites.filter(site => {
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
  getAllCategories
};