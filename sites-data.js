

//  info: {name:"참고자료", icon:"🔍"},
//  exam: {name:"시험/기출", icon:"📝"},
//  assignment: {name:"과제/리포트", icon:"📄"},
//  gpt: {name:"GPT 활용", icon:"🤖"},
//  coding: {name:"코딩/IT", icon:"💻"},
//  career: {name:"취업/대학", icon:"🎓"},
//  productivity: {name:"생산성/도구", icon:"🛠️"},
//  highschool: {name:"고입/고교학점제", icon:"📓"},
//  reading: {name:"독서/문해력", icon:"📖"},
//  art {name:"창의/예술", icon:"🎨"},
//  explore {name:"체험/탐구" icon:"🔬"
//  ppt: {name:"PPT/프레젠테이션", icon:"📊"}

//  <option value="korean">국어</option>
//  <option value="math">수학</option>
//  <option value="english">영어</option>
//  <option value="science">과학</option>
//  <option value="social">사회</option>
//  <option value="history">역사</option>
//  <option value="art">예술</option>
//  <option value="music">음악</option>
//  <option value="pe">체육</option>
//  <option value="tech">기술</option>
//  <option value="coding">코딩</option>
//  <option value="language">외국어</option>
//  <option value="general">종합</option>
//  <option value="exam">시험대비</option>
//  <option value="career">진로</option>

// 초등 elem 중등 mid 고등 high 성인 adult

const initialSites = [
  /* ================== 온라인강의 💻 ================== */
  {name:"EBS", url:"https://www.ebs.co.kr/", desc:"전 국민의 평생학교 EBS", category:"learning", ages:["elem","mid","high"], subjects:["korean","math","science","social"]},
  {name:"EBS 중학프리미엄", url:"https://mid.ebs.co.kr/", desc:"중학생 대상 전 과목 온라인 강의", category:"learning", ages:["mid"], subjects:["korean","math","science","social"]},
  {name:"EBSi", url:"https://www.ebsi.co.kr/", desc:"EBS 고등 온라인 강의", category:"learning", ages:["high"], subjects:["korean","math","english","science"]},
  {name:"KOCW", url:"http://www.kocw.net/", desc:"국내 대학 공개강의 서비스", category:"learning", ages:["high","adult"], subjects:["general"], isGov: true},
  {name:"K-MOOC", url:"https://www.kmooc.kr/", desc:"한국형 온라인 공개강좌", category:"learning", ages:["high","adult"], subjects:["general"], isGov: true},
  {name:"Khan Academy", url:"https://ko.khanacademy.org/", desc:"무료 온라인 교육 플랫폼", category:"learning", ages:["elem","mid","high"], subjects:["korean","math","science","history"]},
  {name:"메가스터디", url:"https://www.megastudy.net/", desc:"중고등 학생 대상 강의", category:"learning", ages:["mid","high"], subjects:["korean","math","english","science"]},
  {name:"야나두", url:"http://yanadoo.co.kr/", desc:"영어 학습", category:"learning", ages:["mid","high","adult"], subjects:["english","language"]},
  {name:"Coursera", url:"https://www.coursera.org/", desc:"전 세계 대학 및 기업의 온라인 강좌", category:"learning", ages:["high","adult"], subjects:["general","language"]},
  {name:"edX", url:"https://www.edx.org/", desc:"무료 및 유료 대학 온라인 강의 제공", category:"learning", ages:["high","adult"], subjects:["general"]},
  {name:"MIT OpenCourseWare", url:"https://ocw.mit.edu/", desc:"MIT 공개 강의 자료", category:"learning", ages:["high","adult"], subjects:["science","tech"]},
  {name:"Skillshare", url:"https://www.skillshare.com/", desc:"디자인, 코딩, 영상 등 실무 학습", category:"learning", ages:["high","adult"], subjects:["art","tech"]},
  {name:"스터디채널", url:"http://studych.co.kr/", desc:"수능 및 내신 강의 플랫폼", category:"learning", ages:["mid","high"], subjects:["korean","math","english"]},
  {name:"에듀윌", url:"https://www.eduwill.net/", desc:"자격증·공무원 시험 대비 강의", category:"learning", ages:["high","adult"], subjects:["exam","career"]},
  {name:"클래스101", url:"https://class101.net/", desc:"취미 및 실무 온라인 클래스", category:"learning", ages:["mid","high","adult"], subjects:["art","tech","general"]},
  {name:"탈잉", url:"https://taling.me/", desc:"1:1 맞춤형 온라인 클래스", category:"learning", ages:["mid","high","adult"], subjects:["general","art","tech"]},
  {name:"Udemy", url:"https://www.udemy.com/", desc:"다양한 주제의 온라인 강의", category:"learning", ages:["high","adult"], subjects:["general","tech","art"]},
  /* ================== 참고자료 🔍 ================== */
  {name:"RISS", url:"http://www.riss.kr/", desc:"학술 자료 및 논문 검색", category:"info", ages:["high","adult"], subjects:["general"], isGov: true},
  {name:"공공데이터포털", url:"https://www.data.go.kr/", desc:"정부 및 공공기관 데이터 제공", category:"info", ages:["high","adult"], subjects:["social","tech"], isGov: true},
  {name:"국립중앙도서관", url:"https://www.nl.go.kr/", desc:"디지털 자료 및 자료 검색", category:"info", ages:["mid","high","adult"], subjects:["general"], isGov: true},
  {name:"국가과학기술지식정보서비스(NTIS)", url:"https://www.ntis.go.kr/", desc:"과학/기술 자료 검색", category:"info", ages:["mid","high","adult"], subjects:["science","tech"], isGov: true},
  {name:"국사편찬위원회", url:"https://www.history.go.kr/", desc:"한국사 관련 사료와 자료 제공", category:"info", ages:["mid","high","adult"], subjects:["history"], isGov: true},
  {name:"한국교육학술정보원(KERIS)", url:"https://www.keris.or.kr/", desc:"교육 연구 및 정보 제공", category:"info", ages:["mid","high","adult"], subjects:["general"], isGov: true},
  {name:"국가통계포털(KOSIS)", url:"https://kosis.kr/", desc:"통계청 공식 통계 데이터", category:"info", ages:["high","adult"], subjects:["social","math"], isGov: true},
  {name:"서울열린데이터광장", url:"https://data.seoul.go.kr/", desc:"서울시 공공데이터 포털", category:"info", ages:["high","adult"], subjects:["social","tech"], isGov: true},
  {name:"위키백과", url:"https://ko.wikipedia.org/", desc:"자유 백과사전", category:"info", ages:["mid","high","adult"], subjects:["general"], isGov: true},
  {name:"나무위키", url:"https://namu.wiki/", desc:"다양한 주제를 다루는 한국어 위키", category:"info", ages:["mid","high","adult"], subjects:["general"]},
  {name:"국립중앙과학관", url:"https://www.science.go.kr/", desc:"과학 체험 및 교육 정보", category:"info", ages:["elem","mid","high"], subjects:["science"], isGov: true},
  {name:"에듀넷", url:"https://www.edunet.net/", desc:"교사·학생용 참고자료", category:"info", ages:["elem","mid","high"], subjects:["general"], isGov: true},
  {name:"네이버 지식백과", url:"https://terms.naver.com/", desc:"한국어 전문 지식 콘텐츠", category:"info", ages:["mid","high","adult"], subjects:["general"]},
  {name:"브리태니커 백과사전", url:"https://www.britannica.com/", desc:"영어권 대표 백과사전", category:"info", ages:["mid","high","adult"], subjects:["general"]},
  {name:"ScienceDirect", url:"https://www.sciencedirect.com/", desc:"과학 및 기술 논문 검색", category:"info", ages:["high","adult"], subjects:["science","tech"]},
  {name:"Google Scholar", url:"https://scholar.google.com/", desc:"학술 논문 및 자료 검색", category:"info", ages:["high","adult"], subjects:["general"]},
  {name:"PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/", desc:"의학 및 생명과학 논문 검색", category:"info", ages:["high","adult"], subjects:["science"]},
  {name:"오픈국회정보포털", url:"https://open.assembly.go.kr/", desc:"국회 자료·법안 검색", category:"info", ages:["high","adult"], subjects:["social","history"], isGov: true},
  {name:"국가기록원", url:"https://www.archives.go.kr/", desc:"역사/행정 과제 자료 제공", category:"info", ages:["high","adult"], subjects:["history","social"], isGov: true},
  {name:"E나라지표", url:"https://www.index.go.kr/", desc:"국가 주요 지표 통계", category:"info", ages:["high","adult"], subjects:["social","math"], isGov: true},

  
  /* ================== 과제/리포트 📄 ================== */
  {name:"네이버 학술정보", url:"https://academic.naver.com/", desc:"논문 및 연구자료 검색", category:"assignment", ages:["high","adult"], subjects:["general"]},
  {name:"국립중앙도서관 학술정보", url:"https://www.nl.go.kr/", desc:"리포트 참고자료 제공", category:"assignment", ages:["mid","high","adult"], subjects:["general"], isGov: true},
  {name:"RISS", url:"http://www.riss.kr/", desc:"논문 및 레포트 자료", category:"assignment", ages:["high","adult"], subjects:["general"], isGov: true},
  {name:"KISS 학술정보", url:"https://kiss.kstudy.com/", desc:"국내 학술 논문 자료", category:"assignment", ages:["high","adult"], subjects:["general","social"], isGov: true},
  {name:"DBpia", url:"https://www.dbpia.co.kr/", desc:"학술 논문 및 자료 검색", category:"assignment", ages:["high","adult"], subjects:["general","science","social"], isGov: true},
  {name:"국가기록원", url:"https://www.archives.go.kr/", desc:"역사/행정 과제 자료 제공", category:"assignment", ages:["high","adult"], subjects:["history","social"], isGov: true},
  {name:"법제처 국가법령정보센터", url:"https://www.law.go.kr/", desc:"법률 및 과제 참고자료", category:"assignment", ages:["high","adult"], subjects:["social"], isGov: true},
  {name:"국토연구원", url:"https://www.krihs.re.kr/", desc:"도시·환경 관련 연구자료", category:"assignment", ages:["high","adult"], subjects:["social","science"], isGov: true},
  {name:"한국교육학술정보원(KERIS)", url:"https://www.keris.or.kr/", desc:"교육 연구 및 자료 제공", category:"assignment", ages:["mid","high","adult"], subjects:["general"], isGov: true},
  {name:"서울열린데이터광장", url:"https://data.seoul.go.kr/", desc:"서울시 공공데이터 포털", category:"assignment", ages:["high","adult"], subjects:["social","tech"], isGov: true},
  {name:"국가통계포털(KOSIS)", url:"https://kosis.kr/", desc:"통계청 공식 통계 데이터", category:"assignment", ages:["high","adult"], subjects:["social","math"], isGov: true},
  {name:"Google Scholar", url:"https://scholar.google.com/", desc:"학술 논문 및 자료 검색", category:"assignment", ages:["high","adult"], subjects:["general"]},
  {name:"PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/", desc:"의학 및 생명과학 논문 검색", category:"assignment", ages:["high","adult"], subjects:["science"]},
  {name:"오픈국회정보포털", url:"https://open.assembly.go.kr/", desc:"국회 자료·법안 검색", category:"assignment", ages:["high","adult"], subjects:["social","history"]},
  {name:"ScienceDirect", url:"https://www.sciencedirect.com/", desc:"과학 및 기술 논문 검색", category:"assignment", ages:["high","adult"], subjects:["science","tech"]},
  {name:"E나라지표", url:"https://www.index.go.kr/", desc:"국가 주요 지표 통계", category:"assignment", ages:["high","adult"], subjects:["social","math"]},
  {name:"에듀넷", url:"https://www.edunet.net/", desc:"학교 과제 자료 및 학습 자료", category:"assignment", ages:["elem","mid","high"], subjects:["general","korean","math"], isGov: true},

/* ================== 고입/고교학점제 📌 ================== */
  {name:"교육부", url:"https://www.moe.go.kr/", desc:"교육부 공식 사이트", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"고입정보포털", url:"https://www.hischool.go.kr", desc:"고등학교 유형벌 입학정보(대부분의 지역이 다 있음)", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"경기도교육청 고등 입학전학 포털", url:"https://satp.goe.go.kr/", desc:"경기도 고입 및 전학 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"서울특별시교육청", url:"https://www.sen.go.kr/", desc:"서울시 고입 및 전학 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"인천광역시교육청 고입학전학포털", url:"https://isatp.ice.go.kr/", desc:"인천시 고입 및 전학 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"경상남도교육청 고입 포털", url:"https://highschool.gne.go.kr/", desc:"경상남도 고입 및 전학 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"경상북도교육청 고입전형포털", url:"https://hischoolgbe.kr/", desc:"경상북도 고입 및 전학 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"충청남도교육청 고입전형포털", url:"https://satp.cne.go.kr/", desc:"충남 고입 및 전학 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"충청북도교육청 고입전형포털", url:"https://hsap.cbe.go.kr/", desc:"충북 고입 및 전학 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"전북특별자치도교육청 고입전형포털",url:"https://satp.jbe.go.kr/", desc:"전북특별자치도 고입 및 전학 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"교육정보 Modoo", url:"https://www.jne.go.kr/modoo/main.do", desc:"전라남도교육청의 교육정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"부산광역시교육청 고입포털", url:"https://home.pen.go.kr/", desc:"부산광역시 고입 및 전학 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"강원특별자치도교육청 - 고입자료실", url:"https://hsap.cbe.go.kr/", desc:"강원특별자치도 고입 및 전학 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"대구광역시교육청", url:"https://www.dge.go.kr/", desc:"대구광역시 교육 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"대전광역시교육청", url:"https://www.dje.go.kr/", desc:"대전광역시 교육 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"울산광역시교육청 진로진학지원센터", url:"https://use.go.kr/jinhak/index.do", desc:"울산광역시 진로진학지원 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"세종특별자치시교육청", url:"https://www.sje.go.kr/", desc:"세종특별자치시 교육 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"제주특별자치도교육청", url:"https://www.jje.go.kr/", desc:"제주특별자치도 교육 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"광주광역시교육청", url:"https://www.gen.go.kr/", desc:"광주광역시 교육 정보", category:"highschool", ages:["mid","high"], subjects:["general"]},
  {name:"학교알리미", url:"https://www.schoolinfo.go.kr", desc:"고등학교 학교정보 및 평가", category:"highschool", ages:["mid","high"], subjects:["general"]},

    /* ================== 취업/대학 🎓 ================== */
  {name:"커리어넷", url:"https://www.career.go.kr/", desc:"진로 상담 및 직업 정보", category:"career", ages:["high","adult"], subjects:["career"], isGov: true},
  {name:"대학알리미", url:"https://www.academyinfo.go.kr/", desc:"대학 입학 정보", category:"career", ages:["high","adult"], subjects:["career"], isGov: true},
  {name:"에듀윌 진로", url:"https://www.eduwill.net/", desc:"진로·자격증 정보", category:"career", ages:["high","adult"], subjects:["career"]},
  {name:"진학사", url:"https://www.jinhak.com/", desc:"대입 정보 및 상담", category:"career", ages:["high"], subjects:["career"]},
  {name:"유웨이", url:"https://www.uway.com/", desc:"대입 원서접수 및 진학 정보", category:"career", ages:["high"], subjects:["career"]},
  {name:"종로학원", url:"https://www.jongro.co.kr/", desc:"입시 분석 및 진학 상담", category:"career", ages:["high"], subjects:["career"]},
  {name:"한국장학재단", url:"https://www.kosaf.go.kr/", desc:"장학금 및 학자금 대출 정보", category:"career", ages:["high","adult"], subjects:["career"]},
  {name:"잡코리아", url:"https://www.jobkorea.co.kr/", desc:"취업 정보 및 채용 공고", category:"career", ages:["high","adult"], subjects:["career"]},
  {name:"사람인", url:"https://www.saramin.co.kr/", desc:"취업 정보 및 채용 공고", category:"career", ages:["high","adult"], subjects:["career"]},
  {name:"어디가", url:"https://www.adiga.kr/", desc:"대입 정보 포털(한국대학교육협의회)", category:"career", ages:["high"], subjects:["career"]},

  /* ================== GPT 활용 🤖 ================== */
  {name:"ChatGPT", url:"https://chat.com/", desc:"아무튼 현존 최강", category:"gpt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Gemini", url:"https://gemini.google.com/", desc:"잼미니", category:"gpt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Claude", url:"https://claude.ai/", desc:"코딩 잘함", category:"gpt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Grok", url:"https://grok.com/", desc:"요즘뜨고 있는거", category:"gpt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Gamma", url:"https://gamma.app/", desc:"PPT 제작 노예", category:"gpt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Perplexity", url:"https://www.perplexity.ai/", desc:"정보 찾는 GPT", category:"gpt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Notion AI", url:"https://www.notion.so/product/ai", desc:"노션 내장형 GPT", category:"gpt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Jasper", url:"https://www.jasper.ai/", desc:"마케팅에 특화된 GPT", category:"gpt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Writesonic", url:"https://writesonic.com/", desc:"글쓰기 도우미 GPT", category:"gpt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"QuillBot", url:"https://quillbot.com/", desc:"문장 재구성 및 교정 GPT", category:"gpt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Grammarly", url:"https://www.grammarly.com/", desc:"영어 글쓰기 교정 도구", category:"gpt", ages:["mid","high","adult"], subjects:["english","language"]},
  {name:"Socratic by Google", url:"https://socratic.org/", desc:"학생용 학습 도우미 GPT", category:"gpt", ages:["mid","high"], subjects:["general"]},
  
  /* ================== PPT/프레젠테이션 ================== */
  {name:"Gamma", url:"https://gamma.app/", desc:"PPT 제작 노예", category:"ppt", ages:["mid","high","adult"], subjects:["general"]},
  {name:"slidesgo", url:"https://slidesgo.com/", desc:"AI + 다양한 PPT 템플릿 제공", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"google slides", url:"https://www.google.com/slides/about/", desc:"구글의 프레젠테이션 도구", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"Powerpoint", url:"https://www.microsoft.com/ko-kr/microsoft-365/powerpoint", desc:"MS의 프레젠테이션 도구", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"Canva", url:"https://www.canva.com/", desc:"간편한 디자인 및 프레젠테이션 도구", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"미리캔버스", url:"https://www.miricanvas.com/ko", desc:"한국형 디자인 도구", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"망고보드", url:"https://www.mangoboard.net/", desc:"온라인 디자인 및 프레젠테이션", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"파랑펭귄", url:"https://paranpenguin.co.kr/", desc:"아이콘, 이미지 ,PNG 제공", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"pngimg", url:"https://pngimg.com/", desc:"무료 PNG 이미지 제공", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"manypixels", url:"https://www.manypixels.co/gallery", desc:"ppt 사용에 좋은 무료 일러스트 및 아이콘 제공", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"storyset", url:"https://storyset.com/", desc:"ppt 사용에 좋은 일러스트 제공", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"Visme", url:"https://www.visme.co/", desc:"시각적 콘텐츠 제작 도구", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"Prezi", url:"https://prezi.com/", desc:"동적 프레젠테이션 도구", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"allppt", url:"https://www.allppt.com/", desc:"무료 PPT 템플릿 제공", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},
  {name:"slidescarnival", url:"https://www.slidescarnival.com/", desc:"무료 프레젠테이션 템플릿", category:"ppt", ages:["mid","high","adult"], subjects:["general","art"]},

  /* ================== 시험/기출 📝 ================== */
  {name:"토익 공식 사이트", url:"https://www.toeic.co.kr/", desc:"토익 시험 자료", category:"exam", ages:["high","adult"], subjects:["exam"], isGov: true},
  {name:"컴퓨터 활용능력 기출", url:"https://www.q-net.or.kr", desc:"컴퓨터 활용능력 시험 기출 문제", category:"exam", ages:["high","adult"], subjects:["exam"], isGov: true},
  {name:"한국사 능력검정시험", url:"https://www.historyexam.go.kr/", desc:"한국사 시험 대비 자료", category:"exam", ages:["mid","high"], subjects:["exam"], isGov: true},
  {name:"수능 모의고사 자료", url:"https://www.kice.re.kr/", desc:"수능 기출 및 모의고사 자료", category:"exam", ages:["high"], subjects:["exam"], isGov: true},
  {name:"SAT Practice", url:"https://collegereadiness.collegeboard.org/sat/practice", desc:"SAT 시험 연습 사이트", category:"exam", ages:["high","adult"], subjects:["exam","english"]},
  {name:"NEIS", url:"https://neis.go.kr/", desc:"학교 시험 관련 자료", category:"exam", ages:["mid","high"], subjects:["exam"], isGov: true},
  {name:"대성마이맥", url:"https://www.mimacstudy.com/", desc:"수능 기출 및 모의고사 자료", category:"exam", ages:["high"], subjects:["exam","korean","math","english"]},
  {name:"EBSi 수능특강", url:"https://www.ebsi.co.kr/", desc:"수능 대비 강의 및 자료", category:"exam", ages:["high"], subjects:["exam","korean","math","english"]},
  {name:"YBM 시사영어사", url:"https://www.ybmbooks.com/", desc:"영어 시험 대비 자료", category:"exam", ages:["high","adult"], subjects:["exam","english"]},
  {name:"에듀넷", url:"https://www.edunet.net/nedu/digitaltextbook/", desc:"교육부 디지털 교과서", category:"exam", ages:["elem","mid","high"], subjects:["general"], isGov: true},
  {name:"서울시 교육청 기출자료", url:"https://www.sen.go.kr/", desc:"중·고등학교 기출 문제 제공", category:"exam", ages:["mid","high"], subjects:["exam"], isGov: true},

  /* ================== 코딩/IT 💻 ================== */
  {name:"Inflearn", url:"https://www.inflearn.com/", desc:"국내 온라인 IT/코딩 강의", category:"coding", ages:["mid","high","adult"], subjects:["coding","tech"]},
  {name:"CodeUp", url:"https://codeup.kr/", desc:"코딩 테스트 및 알고리즘 연습", category:"coding", ages:["mid","high","adult"], subjects:["coding"]},
  {name:"Programmers", url:"https://programmers.co.kr/", desc:"개발자 실습/스터디", category:"coding", ages:["high","adult"], subjects:["coding","tech"]},
  {name:"생활코딩", url:"https://opentutorials.org/", desc:"무료 코딩 학습", category:"coding", ages:["elem","mid","high","adult"], subjects:["coding"]},
  {name:"Fast Campus Coding", url:"https://fastcampus.co.kr/dev_online", desc:"실무 코딩 강의", category:"coding", ages:["high","adult"], subjects:["coding","tech"]},
  {name:"코드잇", url:"https://www.codeit.kr/", desc:"실무형 온라인 코딩 강의", category:"coding", ages:["mid","high","adult"], subjects:["coding"]},
  {name:"엘리스 AI 트랙", url:"https://elice.io/", desc:"AI/코딩 온라인 학습", category:"coding", ages:["high","adult"], subjects:["coding","tech"]},
  {name:"Codecademy", url:"https://www.codecademy.com/", desc:"인터랙티브 코딩 학습", category:"coding", ages:["mid","high","adult"], subjects:["coding"]},
  {name:"LeetCode", url:"https://leetcode.com/", desc:"코딩 인터뷰 준비 및 문제 풀이", category:"coding", ages:["high","adult"], subjects:["coding"]},
  {name:"HackerRank", url:"https://www.hackerrank.com/", desc:"코딩 챌린지 및 연습", category:"coding", ages:["high","adult"], subjects:["coding"]},
  {name:"GitHub", url:"https://github.com/", desc:"코드 저장소 및 협업 플랫폼", category:"coding", ages:["high","adult"], subjects:["coding","tech"]},
  {name:"Stack Overflow", url:"https://stackoverflow.com/", desc:"개발자 Q&A 커뮤니티", category:"coding", ages:["high","adult"], subjects:["coding","tech"]},
  
  /* ================== 생산성/도구 🛠️ ================== */
  {name:"Notion", url:"https://www.notion.so/", desc:"노트, 학습 계획 및 자료 정리", category:"productivity", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Google Workspace", url:"https://workspace.google.com/", desc:"문서, 스프레드시트 등 학습 도구", category:"productivity", ages:["mid","high","adult"], subjects:["general"]},
  {name:"카카오워크", url:"https://www.kakaowork.com/", desc:"협업 및 자료 공유 도구", category:"productivity", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Todoist", url:"https://todoist.com/", desc:"할 일 관리 및 학습 계획", category:"productivity", ages:["mid","high","adult"], subjects:["general"]},
  {name:"에버노트", url:"https://evernote.com/intl/ko", desc:"학습 노트 및 정리 도구", category:"productivity", ages:["mid","high","adult"], subjects:["general"]},
  {name:"한컴독스", url:"https://www.hancomdocs.com/ko/", desc:"한글 기반 클라우드 협업 툴", category:"productivity", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Trello", url:"https://trello.com/", desc:"칸반 방식 일정 관리", category:"productivity", ages:["high","adult"], subjects:["general"]},
  {name:"Microsoft OneNote", url:"https://www.onenote.com/", desc:"디지털 노트 작성 및 정리", category:"productivity", ages:["mid","high","adult"], subjects:["general"]},
  {name:"Grammarly", url:"https://www.grammarly.com/", desc:"영어 글쓰기 교정 도구", category:"productivity", ages:["mid","high","adult"], subjects:["english","language"]},
 
  /* ================== 독서/문해력 📖 ================== */
  {name:"국립어린이청소년도서관", url:"https://www.nlcy.go.kr/", desc:"어린이·청소년 독서자료 제공", category:"reading", ages:["elem","mid"], subjects:["korean","general"], isGov: true},
  {name:"리딩게이트", url:"https://www.readinggate.com/", desc:"온라인 영어 독서 프로그램", category:"reading", ages:["elem","mid"], subjects:["english","language"]},
  {name:"교보문고 eBook", url:"https://www.kyobobook.co.kr/ebook/", desc:"전자책 및 학습용 도서", category:"reading", ages:["elem","mid","high"], subjects:["korean","general"]},
  {name:"Yes24 독서교육", url:"https://www.yes24.com/Books/Edu", desc:"청소년 맞춤 독서 자료", category:"reading", ages:["mid","high"], subjects:["korean","general"]},
  {name:"서울도서관", url:"https://lib.seoul.go.kr/", desc:"전자책 및 자료 대출 서비스", category:"reading", ages:["mid","high","adult"], subjects:["general","korean"], isGov: true},
  {name:"교보스콜라", url:"https://scholar.kyobobook.co.kr/", desc:"학술 도서 및 논문 검색", category:"reading", ages:["high","adult"], subjects:["general"]},
  {name:"Open Library", url:"https://openlibrary.org/", desc:"무료 전자책 및 도서관", category:"reading", ages:["mid","high","adult"], subjects:["general","korean"]},
  {name:"Project Gutenberg", url:"https://www.gutenberg.org/", desc:"무료 전자책 제공", category:"reading", ages:["mid","high","adult"], subjects:["general","korean"]},
  {name:"LibriVox", url:"https://librivox.org/", desc:"무료 오디오북 제공", category:"reading", ages:["mid","high","adult"], subjects:["general","korean"]},

  /* ================== 창의/예술 🎨 ================== */
  {name:"구글 아트 앤 컬처", url:"https://artsandculture.google.com/", desc:"전 세계 예술 작품 탐험", category:"art", ages:["mid","high","adult"], subjects:["art","history"]},
  {name:"국립현대미술관", url:"https://www.mmca.go.kr/", desc:"현대미술 전시 및 교육 자료", category:"art", ages:["mid","high","adult"], subjects:["art"], isGov: true},
  {name:"한국문화예술위원회", url:"https://www.arko.or.kr/", desc:"문화예술 자료와 연구 지원", category:"art", ages:["high","adult"], subjects:["art"], isGov: true},
  {name:"서울문화재단", url:"https://www.sfac.or.kr/", desc:"문화예술 교육 및 체험", category:"art", ages:["mid","high"], subjects:["art","music"], isGov: true},
  {name:"예술경영지원센터", url:"https://www.gokams.or.kr/", desc:"예술 관련 연구 및 자료", category:"art", ages:["high","adult"], subjects:["art","music"], isGov: true},
  {name:"K-Arts 한국예술종합학교", url:"https://www.karts.ac.kr/", desc:"예술 전문 교육 자료", category:"art", ages:["high","adult"], subjects:["art","design","music"]},
  {name:"뮤직메이트", url:"https://www.musicmate.co.kr/", desc:"온라인 음악 교육 플랫폼", category:"art", ages:["elem","mid","high"], subjects:["music"]},
  {name:"클래스101 예술", url:"https://class101.net/categories/art", desc:"온라인 예술 클래스", category:"art", ages:["mid","high","adult"], subjects:["art","design"]},
  {name:"Behance", url:"https://www.behance.net/", desc:"디자인 및 예술 작품 공유 플랫폼", category:"art", ages:["high","adult"], subjects:["art","design"]},
  {name:"DeviantArt", url:"https://www.deviantart.com/", desc:"예술가 커뮤니티 및 작품 공유", category:"art", ages:["high","adult"], subjects:["art"]},
  /* ================== 체험/탐구 🔬 ================== */
  {name:"NASA Kids Club", url:"https://www.nasa.gov/kidsclub/index.html", desc:"우주 과학 체험 학습", category:"explore", ages:["elem","mid"], subjects:["science"]},
  {name:"국립과천과학관", url:"https://www.sciencecenter.go.kr/", desc:"과학 실험·전시·탐구 활동", category:"explore", ages:["elem","mid","high"], subjects:["science"], isGov: true},
  {name:"서울대공원 동물원", url:"https://grandpark.seoul.go.kr/", desc:"생물학 및 환경학 학습 체험", category:"explore", ages:["elem","mid"], subjects:["science","social"], isGov: true},
  {name:"국립민속박물관", url:"https://www.nfm.go.kr/", desc:"한국 전통 문화 체험", category:"explore", ages:["elem","mid","high"], subjects:["history","social"], isGov: true},
  {name:"국립중앙박물관", url:"https://www.museum.go.kr/", desc:"역사·문화 체험 자료", category:"explore", ages:["elem","mid","high"], subjects:["history","social"], isGov: true},
  {name:"국립생태원", url:"https://www.nie.re.kr/", desc:"생태 체험 학습 자료", category:"explore", ages:["elem","mid","high"], subjects:["science"], isGov: true},
  {name:"국립해양생물자원관", url:"https://www.mabik.re.kr/", desc:"해양 생물 탐구 및 자료 제공", category:"explore", ages:["elem","mid","high"], subjects:["science"], isGov: true}
];
for (const s of initialSites) {
  if (typeof s.isGov === 'boolean' && s.isgov == null) {
    s.isgov = s.isGov;
  }
}