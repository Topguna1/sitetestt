/**
 * 전역 설정 파일
 * 상수, 매핑 객체, 아이콘 URL 등을 정의
 */

// 정부 기관 아이콘
const GOV_ICON_DATA_URL = 
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Emblem_of_the_Government_of_the_Republic_of_Korea.svg/250px-Emblem_of_the_Government_of_the_Republic_of_Korea.svg.png";

// 연령대 이름 매핑
const ageNames = {
  elem: "초등학생", 
  mid: "중학생", 
  high: "고등학생", 
  adult: "성인"
};

// 과목 이름 매핑
const subjectNames = {
  korean: "국어",
  math: "수학",
  english: "영어",
  science: "과학", 
  social: "사회",
  history: "역사",
  art: "예술",
  music: "음악", 
  pe: "체육",
  tech: "기술",
  coding: "코딩",
  language: "외국어", 
  general: "종합",
  exam: "시험대비",
  career: "진로"
};

// 초성 목록 (한글 자모)
const CHOSUNG_LIST = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ",
  "ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
];

// 초기화 러너 설정
const INIT_RUNNER_CONFIG = {
  maxPasses: 20,
  maxRetries: 1,
  stepTimeoutMs: 8000
};

// Export to window
window.ddakpilmoConfig = {
  GOV_ICON_DATA_URL,
  ageNames,
  subjectNames,
  CHOSUNG_LIST,
  INIT_RUNNER_CONFIG
};