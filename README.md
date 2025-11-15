# 🌟 딱필모 (Ddakpilmo)

딱필모는 학습 목적에 맞는 교육·정보 사이트를 한곳에서 탐색할 수 있도록 돕는 웹 애플리케이션입니다. 연령, 과목, 카테고리 필터와 검색, 다크 모드 등을 지원하여 필요한 자료를 빠르게 찾을 수 있습니다.

## 주요 기능

- **다차원 필터링**: 연령·과목·카테고리 조건을 조합하여 원하는 사이트만 골라볼 수 있습니다.
- **자동완성 검색**: 초성 검색과 하이라이트가 적용된 자동완성으로 빠르게 탐색할 수 있습니다.
- **접근성 친화 UI**: 키보드 포커스 스타일, aria 속성, 다크 모드 등을 지원합니다.
- **안정적인 초기화**: initRunner가 각 모듈 초기화를 순차적으로 관리하여 오류를 최소화합니다.

## 프로젝트 구조

```
.
├── data/
│   ├── categories.json   # 카테고리 메타데이터
│   └── sites.json        # 사이트 목록 데이터
├── main.js               # ES 모듈 진입점 (모든 스크립트 로드 순서 관리)
├── data-loader.js        # JSON 데이터를 불러와 상태에 주입
├── qwer.html             # 애플리케이션 진입점
├── styles.css            # 전역 스타일
├── state.js              # 전역 상태 관리
├── render.js             # 사이트 카드 렌더링
├── filters.js            # 필터링 로직
├── search.js             # 검색 및 자동완성
├── events.js             # 사용자 이벤트 처리
└── ...                   # 기타 유틸리티 및 초기화 스크립트
```

`main.js`는 ES 모듈을 통해 각 스크립트의 의존성을 명시적으로 불러옵니다. 새로운 기능 모듈을 추가할 때는 `main.js`에 `import` 라인을 추가하면 로딩 순서를 안전하게 유지할 수 있습니다.

## 실행 방법

1. 정적 서버(예: `npx serve`, `python -m http.server`)로 프로젝트 디렉터리를 호스팅합니다.
2. 브라우저에서 `qwer.html`을 열면 애플리케이션이 자동으로 초기화됩니다.

> ⚠️ `fetch` API를 사용해 JSON 데이터를 로드하므로 파일 시스템에서 직접(`file://`) 열 경우 동작하지 않을 수 있습니다. 반드시 정적 서버를 통해 접근하세요.

## GitHub Pages로 배포하기

GitHub Pages는 정적 파일만으로 서비스를 제공하므로 별도 빌드 과정 없이 바로 배포할 수 있습니다. 아래 단계를 따르면 `https://<사용자명>.github.io/<저장소명>/qwer.html` 주소에서 앱을 사용할 수 있습니다.

1. GitHub에 저장소를 푸시합니다.
2. 저장소 **Settings → Pages**에서 **Build and deployment** 섹션을 찾아 **Source**를 `Deploy from a branch`로 설정합니다.
3. **Branch**를 `main`(또는 기본 브랜치)과 `/ (root)`로 지정하고 **Save**를 누르면 배포가 시작됩니다.
4. 몇 분 후 Pages가 활성화되면 안내되는 URL에 접속합니다. 첫 화면은 기본적으로 `index.html`을 찾으므로 `/qwer.html`을 붙여 접속하세요.
5. 만약 루트 경로(`/`)에 바로 접근하기를 원한다면 저장소 루트에 간단한 `index.html` 파일을 추가해 `<meta http-equiv="refresh" content="0; url=qwer.html" />` 형태로 리다이렉트하도록 설정할 수 있습니다.

> GitHub Pages는 HTTPS에서 `fetch` 호출을 허용하므로 별도 설정 없이 JSON 데이터를 불러올 수 있습니다.

## 데이터 구조

### 카테고리 (`data/categories.json`)

```json
{
  "coding": { "name": "코딩/IT", "icon": "💻" },
  "exam": { "name": "시험/기출", "icon": "📝" }
}
```

### 사이트 (`data/sites.json`)

각 사이트는 다음 필드를 포함합니다.

| 필드 | 타입 | 설명 |
| ---- | ---- | ---- |
| `name` | string | 사이트 이름 |
| `url` | string | 이동할 URL |
| `desc` | string | 간단한 설명 |
| `category` | string | `categories.json`의 키 |
| `ages` | string[] | `ddakpilmoConfig.ageNames`에서 사용하는 연령 키 |
| `subjects` | string[] | 지원 과목 키 |
| `isGov` | boolean | (선택) 정부 운영 사이트 여부 |

데이터는 `data-loader.js`가 유효성 검사를 수행하며, 오류 발생 시 초기화가 중단되고 화면에 안내 메시지가 표시됩니다.

## 개발 가이드

- **코딩 컨벤션**: 프로젝트 루트의 `.editorconfig`를 통해 들여쓰기, 문자 인코딩, 말미 줄바꿈 등을 통일합니다.
- **모듈 로딩**: 모든 스크립트는 `main.js`를 통해 로드되므로 새 파일을 추가하면 반드시 `main.js`에 `import './새파일.js';`를 등록하세요. 개발 중 특정 모듈만 비활성화하고 싶다면 `main.js`에서 해당 라인을 주석 처리하면 됩니다.
- **데이터 추가**: `data/sites.json`에 항목을 추가한 뒤 정적 서버를 재시작하면 브라우저에서 자동으로 반영됩니다. JSON 문법과 필수 필드를 준수하세요.
- **디버깅**: 브라우저 콘솔에서 `debugDdakpilmo()`를 실행하면 로딩된 데이터와 상태를 요약해 줍니다.

기여나 개선 아이디어가 있다면 이슈를 등록하거나 PR을 보내 주세요! 🎉
