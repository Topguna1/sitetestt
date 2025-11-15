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

function validateSite(site, index) {
  if (!isPlainObject(site)) {
    throw new Error(`${index + 1}번째 사이트 정보가 객체가 아닙니다.`);
  }

  const requiredStringFields = ['name', 'url', 'desc', 'category'];
  requiredStringFields.forEach(field => {
    if (typeof site[field] !== 'string' || site[field].trim() === '') {
      throw new Error(`${index + 1}번째 사이트의 ${field}가 비어 있습니다.`);
    }
  });

  if (!Array.isArray(site.ages) || site.ages.length === 0) {
    throw new Error(`${index + 1}번째 사이트의 연령 정보가 누락되었습니다.`);
  }

  if (!Array.isArray(site.subjects) || site.subjects.length === 0) {
    throw new Error(`${index + 1}번째 사이트의 과목 정보가 누락되었습니다.`);
  }

  return site;
}

function validateSites(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('사이트 데이터가 비어 있거나 배열이 아닙니다.');
  }

  return data.map((site, index) => {
    const validated = validateSite(site, index);
    const hasCamel = typeof validated.isGov === 'boolean';
    const hasLower = typeof validated.isgov === 'boolean';

    if (hasCamel && !hasLower) {
      validated.isgov = validated.isGov;
    } else if (!hasCamel && hasLower) {
      validated.isGov = validated.isgov;
    }

    return validated;
  });
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
      fetchJson(DATA_PATHS.sites).then(validateSites)
    ])
      .then(([categories, sites]) => {
        this.categories = categories;
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

