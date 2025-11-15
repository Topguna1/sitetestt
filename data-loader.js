import { state } from './state.js';

const DATA_PATHS = {
  categories: 'data/categories.json',
  sites: 'data/sites.json'
};

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function validateCategories(data) {
  if (!isPlainObject(data)) {
    throw new Error('카테고리 데이터가 올바른 형식이 아닙니다.');
  }

  const entries = Object.entries(data);
  if (!entries.length) {
    throw new Error('카테고리 데이터가 비어 있습니다.');
  }

  entries.forEach(([key, value]) => {
    if (!isPlainObject(value)) {
      throw new Error(`카테고리 "${key}" 정보가 올바르지 않습니다.`);
    }
    if (typeof value.name !== 'string' || value.name.trim() === '') {
      throw new Error(`카테고리 "${key}"의 이름이 없습니다.`);
    }
    if (typeof value.icon !== 'string' || value.icon.trim() === '') {
      throw new Error(`카테고리 "${key}"의 아이콘이 없습니다.`);
    }
  });

  return data;
}

function validateSite(site, contextLabel) {
  if (!isPlainObject(site)) {
    throw new Error(`${contextLabel} 사이트 정보가 객체가 아닙니다.`);
  }

  const normalized = { ...site };

  const requiredStringFields = ['name', 'url', 'desc', 'category'];
  requiredStringFields.forEach(field => {
    if (typeof normalized[field] !== 'string' || normalized[field].trim() === '') {
      throw new Error(`${contextLabel} 사이트의 ${field}가 비어 있습니다.`);
    }
    normalized[field] = normalized[field].trim();
  });

  if (!Array.isArray(normalized.ages) || normalized.ages.length === 0) {
    throw new Error(`${contextLabel} 사이트의 연령 정보가 누락되었습니다.`);
  }
  normalized.ages = normalized.ages.map(value => {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`${contextLabel} 사이트의 연령 값이 올바르지 않습니다.`);
    }
    return value.trim();
  });

  if (!Array.isArray(normalized.subjects) || normalized.subjects.length === 0) {
    throw new Error(`${contextLabel} 사이트의 과목 정보가 누락되었습니다.`);
  }
  normalized.subjects = normalized.subjects.map(value => {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`${contextLabel} 사이트의 과목 값이 올바르지 않습니다.`);
    }
    return value.trim();
  });

  normalized.isGov = normalized.isGov === true;

  return normalized;
}

function validateSites(data) {
  if (!isPlainObject(data) || Object.keys(data).length === 0) {
    throw new Error('사이트 데이터가 비어 있거나 올바른 객체 형식이 아닙니다.');
  }

  const aggregated = [];

  Object.entries(data).forEach(([categoryKey, sites]) => {
    if (!Array.isArray(sites) || sites.length === 0) {
      throw new Error(`카테고리 "${categoryKey}"의 사이트 목록이 비어 있습니다.`);
    }

    sites.forEach((site, index) => {
      const contextLabel = `"${categoryKey}" 카테고리의 ${index + 1}번째`;
      const candidate = { ...site };
      if (candidate.category == null || candidate.category === '') {
        candidate.category = categoryKey;
      }
      const validated = validateSite(candidate, contextLabel);

      if (validated.category !== categoryKey) {
        throw new Error(`${contextLabel} 사이트의 category 값이 파일 구조와 일치하지 않습니다.`);
      }

      aggregated.push(validated);
    });
  });

  return aggregated;
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`${path} 파일을 불러오지 못했습니다 (${response.status}).`);
  }
  return response.json();
}

const dataLoader = {
  categories: null,
  sites: null,
  error: null,
  _promise: null,
  async load() {
    if (this._promise) {
      return this._promise;
    }

    this._promise = Promise.all([
      fetchJson(DATA_PATHS.categories).then(validateCategories),
      fetchJson(DATA_PATHS.sites)
    ])
      .then(([categories, siteGroups]) => {
        const sites = validateSites(siteGroups);

        this.categories = categories;
        this.siteGroups = siteGroups;
        this.sites = sites;
        this.error = null;

        state.categories = categories;
        state.rawSites = sites.slice();

        return { categories, sites };
      })
      .catch(error => {
        this.error = error;
        throw error;
      });

    return this._promise;
  }
};

export { dataLoader };

if (typeof window !== 'undefined') {
  window.dataLoader = dataLoader;
}

