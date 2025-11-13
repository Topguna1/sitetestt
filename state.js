/**
 * 애플리케이션 상태 관리
 * 모든 필터, 검색어, 페이지 상태를 중앙에서 관리
 */

const state = {
  // 사이트 데이터
  sites: [],
  
  // 필터 상태
  currentAgeFilter: "all",
  currentCategoryFilter: "all",
  currentSubjectFilter: "all",
  
  // 검색 상태
  currentSearchQuery: "",
  
  // 페이지네이션
  ITEMS_PER_PAGE: 5,
  currentPageByCategory: {},
  
  // 확장된 카테고리
  expandedCategories: {}
};

// 상태 변경 감지 (디버깅용)
if (typeof Proxy !== 'undefined') {
  window.state = new Proxy(state, {
    set(target, property, value) {
      const oldValue = target[property];
      target[property] = value;
      
      // 디버그 모드에서만 로그
      if (window.DEBUG_MODE) {
        console.log(`[State] ${property}: ${oldValue} → ${value}`);
      }
      
      return true;
    }
  });
} else {
  window.state = state;
}

// 상태 초기화 함수
function resetState() {
  state.currentAgeFilter = "all";
  state.currentCategoryFilter = "all";
  state.currentSubjectFilter = "all";
  state.currentSearchQuery = "";
  state.currentPageByCategory = {};
  state.expandedCategories = {};
}