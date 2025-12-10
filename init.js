/**
 * 애플리케이션 초기화
 * 모든 모듈을 순차적으로 초기화하고 에러 처리
 */

// 초기화 러너 설정
(function setupInitRunner() {
  const rIC = window.requestIdleCallback || (cb => setTimeout(() => cb({ timeRemaining: () => 0 }), 1));
  const REGISTRY = new Map();
  const RESULT = new Map();
  const DEP = new Map();
  const CONFIG = window.ddakpilmoConfig?.INIT_RUNNER_CONFIG || {
    maxPasses: 20,
    maxRetries: 1,
    stepTimeoutMs: 8000
  };

  function add(name, fn, opts = {}) {
    if (!name || typeof fn !== 'function') throw new Error('addInitStep invalid');
    if (REGISTRY.has(name)) throw new Error('duplicate init step: ' + name);
    REGISTRY.set(name, { name, fn, opts });
    DEP.set(name, {
      after: new Set([].concat(opts.after || [])),
      before: new Set([].concat(opts.before || []))
    });
  }

  function depsOK(name) {
    const d = DEP.get(name);
    if (!d) return true;
    for (const a of d.after) {
      const r = RESULT.get(a);
      if (REGISTRY.has(a) && (!r || r.ok !== true)) return false;
    }
    for (const b of d.before) {
      const r = RESULT.get(b);
      if (r && r.ok === true) return false;
    }
    return true;
  }

  async function runStep(step) {
    const { name, fn, opts } = step;
    const res = RESULT.get(name) || { ok: null, tries: 0 };
    res.startedAt = performance.now();
    res.tries += 1;
    RESULT.set(name, res);
    
    const timeout = opts.timeoutMs ?? CONFIG.stepTimeoutMs;
    let to;
    
    try {
      const p = Promise.resolve().then(() => fn());
      const t = new Promise((_, rej) => to = setTimeout(() => rej(new Error('timeout')), timeout));
      await Promise.race([p, t]);
      res.ok = true;
      res.error = null;
    } catch (e) {
      res.ok = false;
      res.error = e;
    } finally {
      clearTimeout(to);
      res.endedAt = performance.now();
      RESULT.set(name, res);
    }
    
    return res.ok;
  }

  async function run() {
    const pending = new Set(REGISTRY.keys());
    let pass = 0;
    
    while (pending.size && pass < CONFIG.maxPasses) {
      pass++;
      const runnable = [];
      pending.forEach(n => {
        if (depsOK(n)) runnable.push(n);
      });
      
      if (!runnable.length) break;
      
      for (const n of runnable) {
        const s = REGISTRY.get(n);
        const r = RESULT.get(n) || { tries: 0 };
        const left = (s.opts.maxRetries ?? CONFIG.maxRetries) - r.tries;
        const ok = await runStep(s);
        if (ok || left <= 0) pending.delete(n);
        await new Promise(res => rIC(res));
      }
    }
    
    const done = [], failed = [], skipped = [];
    REGISTRY.forEach((_, n) => {
      const r = RESULT.get(n);
      if (!r) skipped.push(n);
      else (r.ok ? done : failed).push(n);
    });
    
    window.__initReport = {
      done,
      failed,
      skipped,
      passes: pass,
      total: REGISTRY.size
    };
    
    return window.__initReport;
  }

  function status() {
    const o = {};
    RESULT.forEach((r, k) => {
      o[k] = {
        ok: r.ok,
        tries: r.tries,
        ms: r.endedAt && r.startedAt ? +(r.endedAt - r.startedAt).toFixed(1) : null,
        error: r.error ? String(r.error) : null
      };
    });
    return o;
  }

  window.initRunner = { add, run, status, config: CONFIG };
})();

// 메인 초기화 함수
function init() {
  console.log("🌟 딱필모 초기화 시작...");

  try {
    // 데이터 확인
    const siteSource = getSiteSource();
    const sourceSites = siteSource.sites;

    const ageNames = window.ddakpilmoConfig?.ageNames || {};
    const subjectNames = window.ddakpilmoConfig?.subjectNames || {};

    function buildSearchBlob(site) {
      const categoryName = typeof getCategoryName === 'function'
        ? getCategoryName(site.category)
        : (site.category || '');

      const ageLabels = Array.isArray(site.ages)
        ? site.ages.map(a => ageNames[a] || a).join(' ')
        : '';
      const subjectLabels = Array.isArray(site.subjects)
        ? site.subjects.map(sub => subjectNames[sub] || sub).join(' ')
        : '';

      return [
        site.name || '',
        site.desc || '',
        categoryName,
        ageLabels,
        subjectLabels,
        site.chosung || '',
        site.url || ''
      ].join(' ').toLowerCase();
    }

    // 사이트 데이터 처리
    window.state.sites = sourceSites.map(site => {
      try {
        const url = site.url || "";
        let isGovAuto = false;

        try {
          const host = new URL(url).hostname || "";
          isGovAuto = /(^|\.)gov\.kr$/i.test(host) || /(^|\.)[a-z0-9-]+\.go\.kr$/i.test(host);
        } catch (e) {
          isGovAuto = /(\.go\.kr|gov\.kr)(\/|$)/i.test(url);
        }

        const enriched = {
          ...site,
          isGov: typeof site.isGov === "boolean" ? site.isGov : isGovAuto,
          chosung: getChosung(site.name) + " " + getChosung(site.desc || "")
        };
        enriched.searchBlob = buildSearchBlob(enriched);
        return enriched;
      } catch (error) {
        console.warn('사이트 데이터 처리 오류:', site, error);
        const fallback = {
          name: site.name || "알 수 없는 사이트",
          url: site.url || "#",
          desc: site.desc || "설명 없음",
          category: site.category || "general",
          ages: Array.isArray(site.ages) ? site.ages : ["adult"],
          subjects: Array.isArray(site.subjects) ? site.subjects : ["general"],
          isGov: false,
          chosung: getChosung(site.name || "") + " " + getChosung(site.desc || "")
        };
        fallback.searchBlob = buildSearchBlob(fallback);
        return fallback;
      }
    });
    
    console.log(`✅ ${window.state.sites.length}개 사이트 로드 완료 (source: ${siteSource.source})`);

    // 초기화 단계
    const initSteps = [
      { name: '테마 초기화', func: () => window.themeManager?.initialize() },
      { name: '카테고리 섹션', func: () => window.renderManager?.renderCategorySections() },
      { name: '카테고리 탭', func: () => window.eventManager?.buildCategoryTabs() },
      { name: '이벤트 리스너', func: () => window.eventManager?.setup() },
      { name: '검색 엔진', func: () => window.searchManager?.init() },
      { name: '사이트 렌더링', func: () => window.renderManager?.renderSites() }
    ];

    let successCount = 0;
    initSteps.forEach(step => {
      try {
        if (step.func) step.func();
        console.log(`✅ ${step.name} 완료`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${step.name} 실패:`, error);
        showToast(`⚠️ ${step.name}에 문제가 발생했습니다`, 'warning');
      }
    });

    console.log(`🎯 초기화 완료: ${successCount}/${initSteps.length} 성공`);
    
    if (successCount >= 4 && window.state.sites.length > 0) {
      setTimeout(() => {
        showToast("🌟 딱필모에 오신 것을 환영합니다!", 'success');
      }, 1000);
    }
    
  } catch (error) {
    console.error("❌ 초기화 중 심각한 오류:", error);
    handleInitializationFailure(error);
  }
}

function getSiteSource() {
  const sources = [
    { source: 'initialSites', sites: typeof initialSites !== 'undefined' ? initialSites : undefined },
    { source: 'dataLoader.sites', sites: window.dataLoader?.sites }
  ];

  for (const candidate of sources) {
    if (Array.isArray(candidate.sites) && candidate.sites.length > 0) {
      return candidate;
    }
  }

  const details = sources
    .map(entry => {
      if (!entry.sites) return `${entry.source}:missing`;
      if (!Array.isArray(entry.sites)) return `${entry.source}:not-array`;
      return `${entry.source}:empty`;
    })
    .join(', ');

  throw new Error(`사이트 데이터를 찾을 수 없습니다 (${details})`);
}

function getSiteSource() {
  const sources = [
    { source: 'initialSites', sites: typeof initialSites !== 'undefined' ? initialSites : undefined },
    { source: 'dataLoader.sites', sites: window.dataLoader?.sites }
  ];

  for (const candidate of sources) {
    if (Array.isArray(candidate.sites) && candidate.sites.length > 0) {
      return candidate;
    }
  }

  const details = sources
    .map(entry => {
      if (!entry.sites) return `${entry.source}:missing`;
      if (!Array.isArray(entry.sites)) return `${entry.source}:not-array`;
      return `${entry.source}:empty`;
    })
    .join(', ');

  throw new Error(`사이트 데이터를 찾을 수 없습니다 (${details})`);
}

function getSiteSource() {
  const sources = [
    { source: 'initialSites', sites: typeof initialSites !== 'undefined' ? initialSites : undefined },
    { source: 'dataLoader.sites', sites: window.dataLoader?.sites }
  ];

  for (const candidate of sources) {
    if (Array.isArray(candidate.sites) && candidate.sites.length > 0) {
      return candidate;
    }
  }

  const details = sources
    .map(entry => {
      if (!entry.sites) return `${entry.source}:missing`;
      if (!Array.isArray(entry.sites)) return `${entry.source}:not-array`;
      return `${entry.source}:empty`;
    })
    .join(', ');

  throw new Error(`사이트 데이터를 찾을 수 없습니다 (${details})`);
}

function getSiteSource() {
  const sources = [
    { source: 'initialSites', sites: typeof initialSites !== 'undefined' ? initialSites : undefined },
    { source: 'dataLoader.sites', sites: window.dataLoader?.sites }
  ];

  for (const candidate of sources) {
    if (Array.isArray(candidate.sites) && candidate.sites.length > 0) {
      return candidate;
    }
  }

  const details = sources
    .map(entry => {
      if (!entry.sites) return `${entry.source}:missing`;
      if (!Array.isArray(entry.sites)) return `${entry.source}:not-array`;
      return `${entry.source}:empty`;
    })
    .join(', ');

  throw new Error(`사이트 데이터를 찾을 수 없습니다 (${details})`);
}

function getSiteSource() {
  const sources = [
    { source: 'initialSites', sites: typeof initialSites !== 'undefined' ? initialSites : undefined },
    { source: 'dataLoader.sites', sites: window.dataLoader?.sites }
  ];

  for (const candidate of sources) {
    if (Array.isArray(candidate.sites) && candidate.sites.length > 0) {
      return candidate;
    }
  }

  const details = sources
    .map(entry => {
      if (!entry.sites) return `${entry.source}:missing`;
      if (!Array.isArray(entry.sites)) return `${entry.source}:not-array`;
      return `${entry.source}:empty`;
    })
    .join(', ');

  throw new Error(`사이트 데이터를 찾을 수 없습니다 (${details})`);
}

function getSiteSource() {
  const sources = [
    {
      source: 'initialSites',
      sites: typeof initialSites !== 'undefined' ? initialSites : undefined
    },
    {
      source: 'dataLoader.sites',
      sites: window.dataLoader?.sites
    },
    {
      source: 'state.rawSites',
      sites: window.state?.rawSites
    }
  ];

  for (const candidate of sources) {
    if (Array.isArray(candidate.sites) && candidate.sites.length > 0) {
      return candidate;
    }
  }

  const details = sources
    .map(entry => {
      if (!entry.sites) return `${entry.source}:missing`;
      if (!Array.isArray(entry.sites)) return `${entry.source}:not-array`;
      return `${entry.source}:empty`;
    })
    .join(', ');

  throw new Error(`사이트 데이터를 찾을 수 없습니다 (${details})`);
}

// 초기화 실패 처리
function handleInitializationFailure(error) {
  const container = document.getElementById("categoriesContainer");
  if (container) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px;color:#666;">
        <h3>💥 초기화 실패</h3>
        <p>브라우저를 새로고침하거나 캐시를 초기화해보세요.</p>
        <div style="margin:20px 0;padding:16px;background:#f8f9fa;border-radius:8px;font-family:monospace;font-size:12px;color:#e74c3c;">
          ${escapeHtml(error.message || String(error))}
        </div>
        <button onclick="location.reload()" style="padding:12px 24px;background:#e74c3c;color:white;border:none;border-radius:8px;cursor:pointer;margin:8px;">🔄 새로고침</button>
        <button onclick="localStorage.clear();location.reload()" style="padding:12px 24px;background:#f39c12;color:white;border:none;border-radius:8px;cursor:pointer;margin:8px;">🗑️ 캐시 초기화</button>
      </div>
    `;
  }
}

let initRegistered = false;

function startInitRunner() {
  if (initRegistered) {
    return;
  }

  initRegistered = true;

  window.initRunner.add('legacy:init', () => {
    try {
      init();
    } catch (e) {
      console.warn('[init] legacy/init error:', e);
      throw e;
    }
  });

  window.initRunner.add('ui:highlight', () => {
    try {
      const q = (window.state?.currentSearchQuery ||
                 document.getElementById('searchInput')?.value || '').trim();
      if (q && window.ddakHighlight) {
        const scope = document.getElementById('categoriesContainer') || document;
        window.ddakHighlight.apply(q, scope);
      }
    } catch (e) {
      console.debug('highlight skipped', e);
    }
  }, { after: ['legacy:init'] });

  window.initRunner.run().then(rep => {
    console.log('[init] report:', rep, window.initRunner.status());
  });
}

// DOMContentLoaded 이벤트
document.addEventListener('DOMContentLoaded', () => {
  const loader = window.dataLoader;

  if (!loader || typeof loader.load !== 'function') {
    const error = new Error('데이터 로더를 찾을 수 없습니다.');
    console.error(error);
    handleInitializationFailure(error);
    showToast('⚠️ 필수 데이터를 불러오지 못했습니다', 'error', 5000);
    return;
  }

  loader.load()
    .then(() => {
      startInitRunner();
    })
    .catch(error => {
      console.error('데이터 로드 실패:', error);
      handleInitializationFailure(error);
      showToast('⚠️ 데이터를 불러오는 중 문제가 발생했습니다', 'error', 5000);
    });
});

// 윈도우 이벤트
window.addEventListener('resize', debounce(() => {
  const container = document.querySelector('.categories-container');
  if (container && window.innerWidth <= 768) {
    container.style.gridTemplateColumns = '1fr';
  } else if (container) {
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(380px, 1fr))';
  }
}, 250));

window.addEventListener('online', () => showToast('🌐 인터넷이 연결되었습니다'));
window.addEventListener('offline', () => showToast('📴 인터넷 연결이 끊어졌습니다'));

window.addEventListener('error', (e) => {
  console.error('JavaScript 오류:', e.error);
  showToast('⚠️ 일시적인 오류가 발생했습니다');
});

console.log("🎉 딱필모 스크립트 로드 완료!");