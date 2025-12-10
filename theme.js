/**
 * 테마 및 표시 설정 관리
 * - 라이트/다크/시스템 테마
 * - 폰트 크기 미세 조절
 */

const THEME_KEY = 'siteTheme';
const FONT_SCALE_KEY = 'siteFontScale';
const FONT_SCALE_DEFAULT = 1;
const FONT_SCALE_MIN = 0.9;
const FONT_SCALE_MAX = 1.1;
const FONT_SCALE_STEP = 0.05;

let currentThemeMode = 'system';
let systemMediaQuery = null;
let systemChangeHandler = null;
let initialized = false;
const themeChangeListeners = [];

let currentFontScale = FONT_SCALE_DEFAULT;
const fontScaleListeners = [];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getStoredTheme() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch (error) {
    console.warn('테마 저장값 읽기 실패:', error);
  }
  return null;
}

function saveThemePreference(mode) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(THEME_KEY, mode);
  } catch (error) {
    console.warn('테마 저장 실패:', error);
  }
}

function getSystemTheme() {
  if (typeof window.matchMedia !== 'function') return 'light';
  if (!systemMediaQuery) {
    systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }
  return systemMediaQuery.matches ? 'dark' : 'light';
}

function addMediaQueryChangeListener(mql, handler) {
  if (!mql || typeof handler !== 'function') return;

  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', handler);
    return;
  }

  if (typeof mql.addListener === 'function') {
    mql.addListener(handler);
  }
}

function removeMediaQueryChangeListener(mql, handler) {
  if (!mql || typeof handler !== 'function') return;

  if (typeof mql.removeEventListener === 'function') {
    mql.removeEventListener('change', handler);
    return;
  }

  if (typeof mql.removeListener === 'function') {
    mql.removeListener(handler);
  }
}

function updateDarkToggleLabel(effectiveTheme, mode) {
  const darkToggle = document.getElementById('darkToggle');
  if (!darkToggle) return;

  const suffix = mode === 'system' ? ' (시스템)' : '';
  darkToggle.textContent = effectiveTheme === 'dark'
    ? `☀️ 라이트 모드${suffix}`
    : `🌙 다크 모드${suffix}`;
}

function notifyThemeChange(mode, effectiveTheme) {
  themeChangeListeners.forEach((listener) => {
    try {
      listener({ mode, effectiveTheme });
    } catch (error) {
      console.warn('테마 변경 리스너 오류:', error);
    }
  });
}

function manageSystemListener(mode) {
  if (!systemMediaQuery && typeof window.matchMedia === 'function') {
    systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }

  if (mode === 'system' && systemMediaQuery) {
    if (!systemChangeHandler) {
      systemChangeHandler = () => applyTheme('system', { skipSave: true });
      addMediaQueryChangeListener(systemMediaQuery, systemChangeHandler);
    }
    return;
  }

  if (systemMediaQuery && systemChangeHandler) {
    removeMediaQueryChangeListener(systemMediaQuery, systemChangeHandler);
    systemChangeHandler = null;
  }
}

function applyTheme(mode, options = {}) {
  const normalized = (mode === 'light' || mode === 'dark' || mode === 'system') ? mode : 'system';
  const effectiveTheme = normalized === 'system' ? getSystemTheme() : normalized;
  const root = document.documentElement;
  const body = document.body;

  currentThemeMode = normalized;
  manageSystemListener(normalized);

  root.setAttribute('data-theme', effectiveTheme);
  root.dataset.themeMode = normalized;

  if (normalized === 'system') {
    delete root.dataset.userTheme;
  } else {
    root.dataset.userTheme = '1';
  }

  const applyBodyClass = () => {
    if (body) {
      body.classList.toggle('dark', effectiveTheme === 'dark');
    }
  };

  if (body) {
    applyBodyClass();
  } else {
    document.addEventListener('DOMContentLoaded', applyBodyClass, { once: true });
  }

  updateDarkToggleLabel(effectiveTheme, normalized);

  if (!options.skipSave) {
    saveThemePreference(normalized);
  }

  notifyThemeChange(normalized, effectiveTheme);
  return effectiveTheme;
}

function toggleTheme() {
  const effective = currentThemeMode === 'system' ? getSystemTheme() : currentThemeMode;
  const nextMode = effective === 'dark' ? 'light' : 'dark';
  setTheme(nextMode);
}

function setTheme(mode) {
  applyTheme(mode);
}

function addThemeChangeListener(listener) {
  if (typeof listener === 'function') {
    themeChangeListeners.push(listener);
  }
}

function getThemeState() {
  return {
    mode: currentThemeMode,
    effectiveTheme: currentThemeMode === 'system' ? getSystemTheme() : currentThemeMode,
    fontScale: currentFontScale,
  };
}

function getStoredFontScale() {
  try {
    if (typeof localStorage === 'undefined') return FONT_SCALE_DEFAULT;
    const saved = parseFloat(localStorage.getItem(FONT_SCALE_KEY));
    if (!Number.isNaN(saved)) {
      return clamp(saved, FONT_SCALE_MIN, FONT_SCALE_MAX);
    }
  } catch (error) {
    console.warn('폰트 크기 로드 실패:', error);
  }
  return FONT_SCALE_DEFAULT;
}

function saveFontScale(scale) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(FONT_SCALE_KEY, String(scale));
  } catch (error) {
    console.warn('폰트 크기 저장 실패:', error);
  }
}

function notifyFontScaleChange(scale) {
  fontScaleListeners.forEach((listener) => {
    try {
      listener(scale);
    } catch (error) {
      console.warn('폰트 크기 리스너 오류:', error);
    }
  });
}

function setFontScale(scale, options = {}) {
  const clamped = clamp(scale, FONT_SCALE_MIN, FONT_SCALE_MAX);
  currentFontScale = clamped;
  document.documentElement.style.setProperty('--font-scale', clamped);

  if (!options.skipSave) {
    saveFontScale(clamped);
  }

  notifyFontScaleChange(clamped);
}

function adjustFontScale(delta) {
  setFontScale(currentFontScale + delta);
}

function resetFontScale() {
  setFontScale(FONT_SCALE_DEFAULT);
}

function addFontScaleListener(listener) {
  if (typeof listener === 'function') {
    fontScaleListeners.push(listener);
  }
}

function initializeTheme() {
  if (initialized) {
    // 이미 초기화된 경우 현재 상태만 알림
    const effective = currentThemeMode === 'system' ? getSystemTheme() : currentThemeMode;
    updateDarkToggleLabel(effective, currentThemeMode);
    notifyThemeChange(currentThemeMode, effective);
    notifyFontScaleChange(currentFontScale);
    return;
  }

  const storedTheme = getStoredTheme();
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme('system', { skipSave: true });
  }

  const storedFontScale = getStoredFontScale();
  setFontScale(storedFontScale, { skipSave: true });

  initialized = true;
}

initializeTheme();

window.themeManager = {
  toggle: toggleTheme,
  setTheme,
  addThemeChangeListener,
  getState: getThemeState,
  initialize: initializeTheme,
  setFontScale,
  adjustFontScale,
  resetFontScale,
  addFontScaleListener,
};
