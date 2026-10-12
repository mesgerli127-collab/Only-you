export class QuizManager {
  constructor(config, particleSystem, onComplete) {
    this.config = config;
    this.particles = particleSystem;
    this.onComplete = onComplete;
    this.currentIndex = 0;

    this.stepElem = document.getElementById('quiz-step');
    this.questionElem = document.getElementById('quiz-question');
    this.optionsElem = document.getElementById('quiz-options');
    this.feedbackElem = document.getElementById('quiz-feedback');
    this.progressBar = document.getElementById('quiz-progress');
  }

  start() {
    this.currentIndex = 0;
    this.renderQuestion();
  }

  renderQuestion() {
    const currentData = this.config.questions[this.currentIndex];
    const total = this.config.questions.length;

    this.stepElem.textContent = `Soru ${this.currentIndex + 1} / ${total}`;
    this.questionElem.textContent = currentData.question;
    this.feedbackElem.textContent = '';
    this.optionsElem.innerHTML = '';

    const progressPercent = ((this.currentIndex) / total) * 100;
    this.progressBar.style.width = `${progressPercent}%`;

    currentData.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-card';
      btn.textContent = opt.text;
      btn.addEventListener('click', (e) => this.handleSelect(opt, e));
      this.optionsElem.appendChild(btn);
    });
  }

  handleSelect(option, event) {
    const rect = event.target.getBoundingClientRect();
    this.particles.createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);

    this.feedbackElem.textContent = option.reaction;

    const allBtns = this.optionsElem.querySelectorAll('button');
    allBtns.forEach(b => b.disabled = true);

    setTimeout(() => {
      this.currentIndex++;
      if (this.currentIndex < this.config.questions.length) {
        this.renderQuestion();
      } else {
        this.progressBar.style.width = '100%';
        if (this.onComplete) this.onComplete();
      }
    }, 1800);
  }
}