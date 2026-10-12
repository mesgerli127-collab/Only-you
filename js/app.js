import { CONFIG } from './config.js';
import { ParticleSystem } from './particles.js';
import { SceneManager } from './sceneManager.js';
import { QuizManager } from './quiz.js';
import { GamesManager } from './games.js';
import { LetterManager } from './letter.js';

class App {
  constructor() {
    this.particles = new ParticleSystem('particle-canvas');
    this.scenes = new SceneManager();

    this.initUI();
    this.initManagers();
    this.bindEvents();
  }

  initUI() {
    document.getElementById('awakening-subtitle').textContent = CONFIG.openingText;
    document.getElementById('awakening-title').textContent = CONFIG.greeting;
    document.getElementById('forever-title').textContent = CONFIG.finalTitle;
    document.getElementById('forever-message').textContent = CONFIG.finalMessage;
    document.getElementById('forever-signature').textContent = CONFIG.signature;
  }

  initManagers() {
    this.particles.init();

    this.quiz = new QuizManager(CONFIG, this.particles, () => {
      this.scenes.goToScene('scene-arcade');
    });

    this.games = new GamesManager(CONFIG, this.particles, () => {
      this.scenes.goToScene('scene-letter');
    });

    this.letter = new LetterManager(CONFIG, () => {
      this.scenes.goToScene('scene-forever');
    });
  }

  bindEvents() {
    // Sahne 1 -> Sahne 2
    const triggerAwakening = (e) => {
      const rect = e.target.getBoundingClientRect();
      this.particles.createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
      this.scenes.goToScene('scene-quiz');
      this.quiz.start();
    };

    document.getElementById('heart-trigger').addEventListener('click', triggerAwakening);
    document.getElementById('btn-awakening').addEventListener('click', triggerAwakening);

    // Sahne 3 -> Sahne 4
    document.getElementById('btn-arcade-next').addEventListener('click', () => {
      this.scenes.goToScene('scene-letter');
    });

    // Sahne 4 -> Sahne 5
    document.getElementById('btn-letter-next').addEventListener('click', () => {
      this.scenes.goToScene('scene-forever');
    });

    // Reset / Restart
    document.getElementById('btn-restart').addEventListener('click', () => {
      this.games.reset();
      this.letter.reset();
      this.scenes.goToScene('scene-awakening');
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});