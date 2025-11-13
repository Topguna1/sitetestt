// ======================= 경량 검색 엔진 =======================

class LightweightSearch {
  constructor(sites) {
    this.rows = [];
    this.tmp = [];
    this.setSites(sites || []);
  }

  setSites(sites) {
    this.rows.length = 0;
    if (!Array.isArray(sites)) return;

    for (let i = 0; i < sites.length; i++) {
      const s = sites[i] || {};

      const name = (s.name ?? s.title ?? "").toString();
      const desc = (s.desc ?? s.description ?? "").toString();
      const category = (s.category ?? s.cat ?? "").toString();
      const subjects = Array.isArray(s.subjects)
        ? s.subjects
        : Array.isArray(s.tags)
        ? s.tags
        : [];

      const chosung = (s.chosung ?? "").toString();

      const nameN = name.toLowerCase().trim();

      this.rows.push({
        ref: s,
        nameN,
        nameWords: nameN ? nameN.split(/\s+/) : [],
        descN: desc.toLowerCase().trim(),
        categoryN: category.toLowerCase().trim(),
        subjectsN: subjects.map(v =>
          (v ?? "").toString().toLowerCase().trim()
        ),
        chosungN: chosung.toLowerCase().trim()
      });
    }
  }

  scoreRow(q, row) {
    let sc = 0;
    const n = row.nameN;

    if (n.startsWith(q)) sc += 5;

    for (let i = 0; i < row.nameWords.length; i++) {
      if (row.nameWords[i].startsWith(q)) {
        sc += 4;
        break;
      }
    }

    if (n.indexOf(q) !== -1) sc += 3;

    if (row.descN.indexOf(q) !== -1) sc += 1;
    if (row.categoryN.indexOf(q) !== -1) sc += 1;

    for (let i = 0; i < row.subjectsN.length; i++) {
      if (row.subjectsN[i].indexOf(q) !== -1) {
        sc += 2;
        break;
      }
    }

    if (row.chosungN && row.chosungN.indexOf(q) !== -1) sc += 1;

    return sc;
  }

  search(query, limit = 50) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();

    const rows = this.rows;
    const out = this.tmp;
    out.length = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const sc = this.scoreRow(q, row);
      if (sc <= 0) continue;

      if (out.length < limit) {
        out.push({ sc, ref: row.ref });

        let j = out.length - 1;
        while (j > 0 && out[j].sc > out[j - 1].sc) {
          const t = out[j];
          out[j] = out[j - 1];
          out[j - 1] = t;
          j--;
        }
      } else if (sc > out[out.length - 1].sc) {
        out[out.length - 1] = { sc, ref: row.ref };

        let j = out.length - 1;
        while (j > 0 && out[j].sc > out[j - 1].sc) {
          const t = out[j];
          out[j] = out[j - 1];
          out[j - 1] = t;
          j--;
        }
      }
    }

    return out.map(x => x.ref);
  }

  quickSearch(query) {
    return this.search(query, 8);
  }

  updateSites(sites) {
    this.setSites(sites);
  }
}

// ======================= 전역 검색 엔진 =======================

let _engine = null;

function ensureEngine() {
  if (!_engine) {
    const sites =
      (window.state && window.state.sites) ||
      window.sitesData ||
      [];
    _engine = new LightweightSearch(sites);
  }
}

function performSearch(query, limit) {
  ensureEngine();
  return _engine.search(query, limit);
}

function performQuickSearch(query) {
  ensureEngine();
  return _engine.quickSearch(query);
}

// ======================= 하이라이트 함수 =======================

// escapeHtml 이 utils.js 쪽에 전역으로 있으면 그거 쓰고,
// 없으면 여기서 간단히 하나 만들어 쓴다.
function _localEscapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function _getEscape() {
  if (typeof window !== "undefined" && typeof window.escapeHtml === "function") {
    return window.escapeHtml;
  }
  return _localEscapeHtml;
}

// 예전 search.js 에 있던 것과 같은 역할: 검색어 부분에 span 붙여줌
function highlightSearchTerms(text, query) {
  const escapeHtml = _getEscape();

  if (!text || !query) return escapeHtml(text || "");

  const raw = String(text);
  const q = String(query).trim();
  if (!q) return escapeHtml(raw);

  const parts = q.split(/\s+/).filter(Boolean);
  if (!parts.length) return escapeHtml(raw);

  const isSpacedSingles = parts.length > 1 && parts.every(p => p.length === 1);

  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pattern = isSpacedSingles
    ? parts.map(esc).join("\\s*")
    : parts.map(esc).join("|");

  const re = new RegExp("(" + pattern + ")", "gi");

  const safe = escapeHtml(raw);

  return safe.replace(
    re,
    '<span class="search-highlight">$1</span>'
  );
}

// 통계는 안 쓰면 빈 함수로 두면 됨(호출돼도 에러만 안 나게)
function showSearchStats(matchesCount, totalCount) {
  // 필요하면 여기서 DOM에 "n / m 개" 같은 걸 그려줄 수 있음.
  // 지금은 아무것도 안 해도 괜찮게 놔둔다.
  void matchesCount;
  void totalCount;
}

// ======================= 예전 API 호환 래퍼 =======================

window.searchManager = {
  init: ensureEngine,
  search: performSearch,
  quickSearch: performQuickSearch,
  highlight: highlightSearchTerms,
  showStats: showSearchStats
};
