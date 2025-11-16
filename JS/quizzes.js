const originalQuestions = [
  {
    question: "O que afirma a 1ª Lei de Newton?",
    options: [
      "Todo corpo em movimento acelera constantemente",
      "Um corpo em repouso tende a permanecer em repouso, e um corpo em movimento tende a permanecer em movimento retílineo uniforme, a menos que uma força externa atue sobre ele",
      "A força é igual à massa vezes a aceleração",
      "Para toda ação há uma reação"
    ],
    correct: 1
  },
  {
    question: "Qual é o nome da 1ª Lei de Newton?",
    options: [
      "Lei da Força",
      "Lei da Ação e Reação",
      "Lei da Inércia",
      "Lei da Gravidade"
    ],
    correct: 2
  },
  {
    question: "O que afirma a 3ª Lei de Newton?",
    options: [
      "F = m × a",
      "Todo corpo atrai outro corpo",
      "Para toda ação, há sempre uma reação de força da mesma intensidade, mesma direção e sentido oposto",
      "A velocidade é constante"
    ],
    correct: 2
  },
  {
    question: "Quando você empurra uma parede, o que acontece?",
    options: [
      "A parede não exerce força sobre você",
      "Você exerce mais força que a parede",
      "A parede empurra você com a mesma força",
      "A parede quebra"
    ],
    correct: 2
  },
  {
    question: "Por que você é empurrado para frente quando um carro freia?",
    options: [
      "Devido da 3ª Lei de Newton",
      "Devido da inércia (1ª Lei de Newton)",
      "Devido da gravidade",
      "Devido da velocidade"
    ],
    correct: 1
  }
];

let questions = [...originalQuestions];
let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;

const quizCard = document.getElementById('quiz-card');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderQuestion() {
  if (currentQuestion >= questions.length) {
    renderResult();
    return;
  }

  const q = questions[currentQuestion];
  quizCard.innerHTML = `
    <div class="card-header">
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <div>Pergunta ${currentQuestion + 1} de ${questions.length}</div>
        <div>Pontuação: ${score}/${currentQuestion}</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width:${((currentQuestion+1)/questions.length)*100}%"></div></div>
    </div>

    <div class="question">
      <h2>${q.question}</h2>
      <div class="options">
        ${q.options.map((opt, i) => `<button class="option-btn" onclick="selectAnswer(${i})">${opt}</button>`).join('')}
      </div>
    </div>

    <button class="next-btn" id="next-btn" disabled>${currentQuestion < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}</button>
  `;

  selectedAnswer = null;
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
}

function selectAnswer(index) {
  selectedAnswer = index;
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });
  document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
  if (selectedAnswer === null) return;

  if (selectedAnswer === questions[currentQuestion].correct) {
    score++;
  }

  currentQuestion++;
  renderQuestion();
}

function renderResult() {
  let scoreClass = 'score-low';
  const percentage = (score / questions.length) * 100;
  if (percentage >= 80) scoreClass = 'score-high';
  else if (percentage >= 60) scoreClass = 'score-medium';

  quizCard.innerHTML = `
    <div class="result">
      <div style="font-size:4rem;">${score === questions.length ? '🏆' : score >= questions.length*0.7 ? '🎉' : '📚'}</div>
      <h2>Quiz Finalizado!</h2>
      <p class="${scoreClass}">Sua pontuação: ${score}/${questions.length}</p>
      <p>${score === questions.length
        ? 'Perfeito! Você domina as Leis de Newton!'
        : score >= questions.length*0.7
        ? 'Muito bem! Você tem um bom conhecimento das Leis de Newton!'
        : 'Continue estudando! Revise o conteúdo e tente novamente.'}
      </p>
      <div class="btn-group">
        <button class="btn-retry" onclick="retryQuiz()">Tentar Novamente</button>
        <button class="btn-home" onclick="goHome()">Voltar ao Início</button>
      </div>
    </div>
  `;
  if(score === questions.length) {
    soltarConfetes();
    settings.playCelebrationSound();
  }
}

function retryQuiz() {
  currentQuestion = 0;
  score = 0;
  questions = shuffleArray([...originalQuestions]); // embaralha novas perguntas
  renderQuestion();
}

function goHome() {
  window.location.href = 'index.html';
}

// Inicializa o quiz
questions = shuffleArray([...originalQuestions]);
renderQuestion();
