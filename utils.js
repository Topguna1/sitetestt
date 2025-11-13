/**
 * 유틸리티 함수 모음
 * HTML 이스케이프, 디바운스, 토스트, 스크롤 등
 */

// HTML 이스케이프
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 디바운스 함수
function debounce(func, wait) {
  let timeoutId;
  const timerManager = window.memoryManager?.timerManager;
  
  return function executedFunction(...args) {
    const later = () => {
      if (timerManager && timeoutId) {
        timerManager.clearTimeout(timeoutId);
      }
      func(...args);
    };
    
    if (timerManager && timeoutId) {
      timerManager.clearTimeout(timeoutId);
    } else if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (timerManager) {
      timeoutId = timerManager.setTimeout(later, wait);
    } else {
      timeoutId = setTimeout(later, wait);
    }
  };
}

// 토스트 알림
function showToast(message, type = 'info', duration = 3000) {
  try {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const styles = {
      info: { bg: '#667eea', icon: 'ℹ️' },
      success: { bg: '#2ed573', icon: '✅' },
      warning: { bg: '#ffa502', icon: '⚠️' },
      error: { bg: '#ff4757', icon: '❌' }
    };
    
    const style = styles[type] || styles.info;
    
    toast.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: ${style.bg}; color: white;
      padding: 12px 16px; border-radius: 8px; font-size: 14px; z-index: 10000;
      transform: translateX(100%); transition: all 0.3s ease; max-width: 350px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px;
    `;
    
    toast.innerHTML = `<span>${style.icon}</span><span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => toast.style.transform = 'translateX(0)');
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
    
  } catch (error) {
    console.error('Toast 오류:', error);
    alert(message);
  }
}

// 초성 추출
function getChosung(str) {
  const CHOSUNG_LIST = window.ddakpilmoConfig?.CHOSUNG_LIST || [
    "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ",
    "ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
  ];
  
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code >= 0 && code <= 11171) {
      result += CHOSUNG_LIST[Math.floor(code / 588)];
    } else {
      result += str[i];
    }
  }
  return result;
}

// 부드러운 스크롤
function smoothScrollToTop(duration = 800) {
  const timerManager = window.memoryManager?.timerManager;
  let scrollAnimationId = null;
  
  if (scrollAnimationId) {
    if (timerManager) {
      timerManager.cancelAnimationFrame(scrollAnimationId);
    } else {
      cancelAnimationFrame(scrollAnimationId);
    }
    scrollAnimationId = null;
  }

  const start = window.scrollY;
  const startTime = performance.now();
  let cancelled = false;

  function cancelOnUserScroll() {
    cancelled = true;
    removeCancelListeners();
  }

  function addCancelListeners() {
    window.addEventListener("wheel", cancelOnUserScroll, { passive: true });
    window.addEventListener("touchstart", cancelOnUserScroll, { passive: true });
    window.addEventListener("keydown", cancelOnUserScroll, { passive: true });
  }

  function removeCancelListeners() {
    window.removeEventListener("wheel", cancelOnUserScroll);
    window.removeEventListener("touchstart", cancelOnUserScroll);
    window.removeEventListener("keydown", cancelOnUserScroll);
  }

  addCancelListeners();

  function scroll() {
    if (cancelled) return;

    const now = performance.now();
    const time = Math.min(1, (now - startTime) / duration);

    const ease = time < 0.5
      ? 4 * time * time * time
      : 1 - Math.pow(-2 * time + 2, 3) / 2;

    window.scrollTo(0, start * (1 - ease));

    if (time < 1) {
      if (timerManager) {
        scrollAnimationId = timerManager.requestAnimationFrame(scroll);
      } else {
        scrollAnimationId = requestAnimationFrame(scroll);
      }
    } else {
      scrollAnimationId = null;
      removeCancelListeners();
    }
  }

  if (timerManager) {
    scrollAnimationId = timerManager.requestAnimationFrame(scroll);
  } else {
    scrollAnimationId = requestAnimationFrame(scroll);
  }
}

// 카테고리까지 부드럽게 스크롤
function smoothScrollToCategory(category, duration = 800) {
  const targetEl = document.getElementById(`${category}-section`);
  if (!targetEl) return;

  const targetY = targetEl.getBoundingClientRect().top + window.scrollY;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();
  let cancelled = false;

  function cancelOnUserScroll() {
    cancelled = true;
    removeCancelListeners();
  }

  function addCancelListeners() {
    window.addEventListener("wheel", cancelOnUserScroll, { passive: true });
    window.addEventListener("touchstart", cancelOnUserScroll, { passive: true });
    window.addEventListener("keydown", cancelOnUserScroll, { passive: true });
  }

  function removeCancelListeners() {
    window.removeEventListener("wheel", cancelOnUserScroll);
    window.removeEventListener("touchstart", cancelOnUserScroll);
    window.removeEventListener("keydown", cancelOnUserScroll);
  }

  addCancelListeners();

  function scroll() {
    if (cancelled) return;

    const now = performance.now();
    const time = Math.min(1, (now - startTime) / duration);

    const ease = time < 0.5
      ? 4 * time * time * time
      : 1 - Math.pow(-2 * time + 2, 3) / 2;

    window.scrollTo(0, startY + distance * ease);

    if (time < 1) {
      requestAnimationFrame(scroll);
    } else {
      removeCancelListeners();
    }
  }

  requestAnimationFrame(scroll);
}

// 공유 기능
function shareSite(siteName, url) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("링크가 복사되었습니다!");
    }).catch(() => {
      fallbackCopy(url);
    });
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(url) {
  const ta = document.createElement("textarea");
  ta.value = url;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  
  try {
    document.execCommand("copy");
    showToast("링크가 복사되었습니다!");
  } catch (e) {
    showToast("링크 복사에 실패했습니다", "error");
  }
  
  document.body.removeChild(ta);
}

// 전역 노출
window.shareSite = shareSite;