/**
 * 디버깅 헬퍼
 * 브라우저 콘솔에서 window.debugDdakpilmo() 실행
 */

window.debugDdakpilmo = function() {
  console.log("=== 딱필모 디버깅 정보 ===\n");
  
  // 1. 상태 확인
  console.log("📊 State:");
  console.log("- sites 개수:", window.state?.sites?.length || 0);
  console.log("- currentAgeFilter:", window.state?.currentAgeFilter);
  console.log("- currentCategoryFilter:", window.state?.currentCategoryFilter);
  console.log("- currentSubjectFilter:", window.state?.currentSubjectFilter);
  console.log("- currentSearchQuery:", window.state?.currentSearchQuery);
  console.log("");
  
  // 2. 모듈 로드 확인
  console.log("📦 Modules:");
  console.log("- config:", !!window.ddakpilmoConfig);
  console.log("- state:", !!window.state);
  console.log("- themeManager:", !!window.themeManager);
  console.log("- searchManager:", !!window.searchManager);
  console.log("- filterManager:", !!window.filterManager);
  console.log("- renderManager:", !!window.renderManager);
  console.log("- eventManager:", !!window.eventManager);
  console.log("- ddakHighlight:", !!window.ddakHighlight);
  console.log("");
  
  // 3. 데이터 확인
  console.log("💾 Data:");
  const rawSites = window.state?.rawSites || window.dataLoader?.sites || [];
  const categories = window.state?.categories || window.dataLoader?.categories || {};
  console.log("- rawSites:", rawSites.length);
  console.log("- categories:", Object.keys(categories).length);
  console.log("");
  
  // 4. 필터링 결과
  if (window.filterManager?.getFiltered) {
    const filtered = window.filterManager.getFiltered();
    console.log("🔍 Filtered Sites:", filtered.length);
    
    // 카테고리별 개수
    const byCat = {};
    filtered.forEach(site => {
      byCat[site.category] = (byCat[site.category] || 0) + 1;
    });
    console.log("📁 By Category:", byCat);
  }
  console.log("");
  
  // 5. DOM 확인
  console.log("🖥️ DOM:");
  const container = document.getElementById("categoriesContainer");
  console.log("- categoriesContainer:", !!container);
  if (container) {
    console.log("  - sections:", container.querySelectorAll(".category-section").length);
    console.log("  - cards:", container.querySelectorAll(".link-card").length);
  }
  console.log("");
  
  // 6. 에러 확인
  if (window.__initReport) {
    console.log("🔄 Init Report:");
    console.log(window.__initReport);
  }
  
  // 7. 샘플 사이트 데이터
  if (window.state?.sites?.length > 0) {
    console.log("\n📝 Sample Site:");
    console.log(window.state.sites[0]);
  }
  
  console.log("\n=== 끝 ===");
  
  return {
    state: window.state,
    filtered: window.filterManager?.getFiltered(),
    modules: {
      config: !!window.ddakpilmoConfig,
      state: !!window.state,
      theme: !!window.themeManager,
      search: !!window.searchManager,
      filter: !!window.filterManager,
      render: !!window.renderManager,
      event: !!window.eventManager,
      highlight: !!window.ddakHighlight
    }
  };
};

// 자동 실행 (페이지 로드 5초 후)
setTimeout(() => {
  console.log("💡 디버깅 정보를 보려면 콘솔에서 'debugDdakpilmo()' 입력");
}, 5000);

// 렌더링 강제 실행 함수
window.forceRender = function() {
  console.log("🔄 강제 렌더링 시작...");
  
  try {
    // 1. 카테고리 섹션 생성
    if (window.renderManager?.renderCategorySections) {
      console.log("1️⃣ 카테고리 섹션 생성...");
      window.renderManager.renderCategorySections();
    } else {
      console.error("❌ renderManager.renderCategorySections를 찾을 수 없습니다");
    }
    
    // 2. 사이트 렌더링
    if (window.renderManager?.renderSites) {
      console.log("2️⃣ 사이트 렌더링...");
      window.renderManager.renderSites();
    } else {
      console.error("❌ renderManager.renderSites를 찾을 수 없습니다");
    }
    
    // 3. 결과 확인
    setTimeout(() => {
      const cards = document.querySelectorAll('.link-card');
      console.log(`✅ 렌더링 완료: ${cards.length}개 카드`);
      
      if (cards.length === 0) {
        console.error("⚠️ 카드가 생성되지 않았습니다!");
        console.log("디버깅 정보:");
        window.debugDdakpilmo();
      }
    }, 1000);
    
  } catch (error) {
    console.error("❌ 렌더링 오류:", error);
  }
};

// 특정 카테고리만 렌더링
window.renderCategory = function(categoryKey) {
  const filtered = window.filterManager?.getFiltered() || [];
  const sitesInCategory = filtered.filter(s => s.category === categoryKey);
  
  console.log(`🎯 ${categoryKey} 카테고리:`, sitesInCategory.length, "개");
  console.log(sitesInCategory);
  
  return sitesInCategory;
};

// 수동으로 카드 1개 테스트
window.testCard = function() {
  console.log("🧪 테스트 카드 생성...");
  
  const container = document.getElementById("categoriesContainer");
  if (!container) {
    console.error("❌ categoriesContainer를 찾을 수 없습니다");
    return;
  }
  
  // 테스트 사이트
  const testSite = {
    name: "테스트 사이트",
    url: "https://example.com",
    desc: "이것은 테스트 카드입니다",
    category: "learning",
    ages: ["adult"],
    subjects: ["general"],
    isGov: false
  };
  
  try {
    // createSiteCard가 전역에 있는지 확인
    if (typeof createSiteCard === 'function') {
      const card = createSiteCard(testSite);
      
      // 첫 번째 섹션의 content에 추가
      const firstContent = container.querySelector(".category-content");
      if (firstContent) {
        firstContent.appendChild(card);
        console.log("✅ 테스트 카드 추가됨");
      } else {
        console.error("❌ category-content를 찾을 수 없습니다");
      }
    } else {
      console.error("❌ createSiteCard 함수를 찾을 수 없습니다");
      console.log("window.renderManager:", window.renderManager);
    }
  } catch (error) {
    console.error("❌ 테스트 카드 생성 오류:", error);
  }
};