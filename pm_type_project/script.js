const questions = [
  {
    text: "1단계. 번뜩이는 아이디어가 떠올랐다! 그 다음은?",
    a: { text: "이거 진짜예요? 우선 구글링한다.", score: { 아이디어: 1, 숫자: 2, 공감: 0, 일정: 1 } },
    b: { text: "주변 사람들에게 아이디어를 말하고 반응을 살핀다.", score: { 아이디어: 2, 숫자: 0, 공감: 2, 일정: 0 } }
  },
  {
    text: "2단계. 동료와 협업 중, 일정이 밀리고 있다.",
    a: { text: "퀄리티를 포기한다! 일단 마감부터 맞춰!", score: { 아이디어: 1, 숫자: 2, 공감: 0, 일정: 1 } },
    b: { text: "당신은 완벽해야 돼요! 퀄리티를 위해 팀을 설득히자", score: { 아이디어: 0, 숫자: 0, 공감: 2, 일정: 2 } }
  },
  {
    text: "3단계. 회의 중 의견 충돌이 생겼다!",
    a: { text: "이의있소! 정확한 가설과 데이터로 주장한다", score: { 아이디어: 0, 숫자: 2, 공감: 1, 일정: 2 } },
    b: { text: "사용자 입장에서 어느 쪽이 더 맞는지 감으로 판단한다", score: { 아이디어: 2, 숫자: 0, 공감: 2, 일정: 0 } }
  },
  {
    text: "4단계. 프로젝트를 리드하게 됐다! 팀을 어떻게 운영할까?",
    a: { text: "일정부터 짤까요? 칸반보드 만들고 시작하자!", score: { 아이디어: 1, 숫자: 2, 공감: 0, 일정: 2 } },
    b: { text: "PM은 자유에요! 브레인스토밍과 유연한 역할분배", score: { 아이디어: 2, 숫자: 0, 공감: 2, 일정: 1 } }
  },
  {
    text: "5단계. 서비스 기획을 맡게 된다면?",
    a: { text: "사용자 조사부터 시작!", score: { 아이디어: 1, 숫자: 2, 공감: 1, 일정: 1 } },
    b: { text: "먼저 MVP를 빠르게 만들고 볼까요?", score: { 아이디어: 2, 숫자: 0, 공감: 1, 일정: 2 } }
  }
];

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getScores() {
  const raw = localStorage.getItem("pm_score");
  if (!raw) return { 아이디어:0, 숫자:0, 공감:0, 일정:0 };
  try {
    return JSON.parse(raw);
  } catch {
    return { 아이디어:0, 숫자:0, 공감:0, 일정:0 };
  }
}

function saveScore(scoreObj) {
  const prev = getScores();
  for (const key in scoreObj) {
    if (typeof prev[key] !== "number") prev[key] = 0;
    prev[key] += scoreObj[key];
  }
  localStorage.setItem("pm_score", JSON.stringify(prev));
  console.log("누적 점수:", prev);
}

function renderQuestion() {
  const stepStr = getQueryParam("step");
  const step = stepStr ? parseInt(stepStr) : 1;
  const container = document.getElementById("question-container");

  if (!container) return;

  if (step > questions.length) {
    location.href = "result.html";
    return;
  }

  const q = questions[step - 1];

  container.innerHTML = `
    <div class="wrapper">
      <img src="/static/image/q${step}.webp" style="max-height: 180px;">
      <div class="card">
        <h2>${q.text}</h2>
        <button class="card__button" onclick='answer(${step}, "a")'>
          <span class="button-text">${q.a.text}</span>
        </button>
        <button class="card__button" onclick='answer(${step}, "b")'>
          <span class="button-text">${q.b.text}</span>
        </button>
      </div>
    </div>
  `;
}


function answer(step, choice) {
  const q = questions[step - 1];
  const selected = q[choice];
  saveScore(selected.score);
  location.href = `question.html?step=${step + 1}`;
}

function redirectToResultPage() {
  const score = getScores();
  if (!score || Object.keys(score).length === 0) {
    alert("점수 정보가 없습니다. 테스트를 먼저 진행해주세요.");
    location.href = "index.html"; // 테스트 시작 페이지로 리디렉션
    return;
  }

  const entries = Object.entries(score);
  const max = Math.max(...entries.map(([_, v]) => v));

  if (max === 0) {
    alert("결과를 도출할 수 없습니다. 테스트를 다시 진행해주세요.");
    location.href = "index.html";
    return;
  }

  const top = entries.filter(([_, v]) => v === max).map(([k]) => k);

  // 우선순위 정렬
  const priority = ['숫자', '공감', '일정', '아이디어'];
  const resultType = priority.find(type => top.includes(type)) || top[0];

  // 결과 페이지 이동
  location.href = `result/${resultType}.html`;
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.endsWith("question.html")) {
    renderQuestion();
  } else if (path.endsWith("result.html")) {
    redirectToResultPage();
  }
});
