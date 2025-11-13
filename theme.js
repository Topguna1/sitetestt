/**
 * 테마 관리 (다크 모드)
 * localStorage 안전 처리 포함
 */

// 테마 로드 (페이지 로드 시 즉시 실행)
(function loadTheme() {
  try {
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage를 사용할 수 없습니다');
      return;
    }
    
    const saved = localStorage.getItem('siteTheme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
      document.documentElement.dataset.userTheme = '1';
      
      document.addEventListener('DOMContentLoaded', function () {
        document.body.classList.toggle('dark', saved === 'dark');
        const btn = document.getElementById('darkToggle');
        if (btn) {
          btn.textContent = saved === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드';
        }
      });
    }
  } catch (e) {
    console.warn('테마 로드 실패:', e);
  }
})();

// 테마 저장
function saveTheme(theme) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('siteTheme', theme);
    }
  } catch (e) {
    console.warn('테마 저장 실패:', e);
  }
}

// 테마 전환
function toggleTheme() {
  const willDark = !document.body.classList.contains("dark");
  
  document.body.classList.toggle("dark", willDark);
  document.documentElement.setAttribute("data-theme", willDark ? "dark" : "light");
  document.documentElement.dataset.userTheme = "1";
  
  saveTheme(willDark ? "dark" : "light");
  
  const darkToggle = document.getElementById("darkToggle");
  if (darkToggle) {
    darkToggle.textContent = willDark ? "☀️ 라이트 모드" : "🌙 다크 모드";
  }
}

// 자동 다크 모드 감지
function initializeTheme() {
  // 사용자가 수동으로 설정하지 않았으면 시스템 설정 따라가기
  if (!document.documentElement.dataset.userTheme) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 초기 설정
    if (mediaQuery.matches) {
      document.body.classList.add('dark');
      const darkToggle = document.getElementById('darkToggle');
      if (darkToggle) darkToggle.textContent = '☀️ 라이트 모드';
    }
    
    // 변경 감지
    mediaQuery.addEventListener('change', (e) => {
      // 사용자가 수동 설정했으면 무시
      if (document.documentElement.dataset.userTheme) return;
      
      const darkToggle = document.getElementById('darkToggle');
      if (e.matches) {
        document.body.classList.add('dark');
        if (darkToggle) darkToggle.textContent = '☀️ 라이트 모드';
      } else {
        document.body.classList.remove('dark');
        if (darkToggle) darkToggle.textContent = '🌙 다크 모드';
      }
    });
  }
}

// Export
window.themeManager = {
  toggle: toggleTheme,
  save: saveTheme,
  initialize: initializeTheme
};