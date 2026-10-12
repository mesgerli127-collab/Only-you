export class GamesManager {
  constructor(config, particleSystem, onComplete) {
    this.config = config;
    this.particles = particleSystem;
    this.onComplete = onComplete;

    this.game1Score = 0;
    this.game1Timer = null;
    this.game1TimeLeft = 15;

    this.setupTabs();
    this.setupGame1();
    this.setupGame2();
  }

  setupTabs() {
    const tab1 = document.getElementById('tab-game1');
    const tab2 = document.getElementById('tab-game2');
    const view1 = document.getElementById('game1-container');
    const view2 = document.getElementById('game2-container');

    tab1.addEventListener('click', () => {
      tab1.classList.add('active');
      tab2.classList.remove('active');
      tab1.setAttribute('aria-selected', 'true');
      tab2.setAttribute('aria-selected', 'false');
      view1.classList.add('active');
      view2.classList.remove('active');
    });

    tab2.addEventListener('click', () => {
      tab2.classList.add('active');
      tab1.classList.remove('active');
      tab2.setAttribute('aria-selected', 'true');
      tab1.setAttribute('aria-selected', 'false');
      view2.classList.add('active');
      view1.classList.remove('active');
    });
  }

  /* GAME 1: KALP AVCISI */
  setupGame1() {
    this.startBtn = document.getElementById('btn-start-game1');
    this.scoreElem = document.getElementById('game1-score');
    this.timerElem = document.getElementById('game1-timer');
    this.areaElem = document.getElementById('game1-area');
    document.getElementById('game1-target').textContent = this.config.gameTarget;

    this.startBtn.addEventListener('click', () => this.startGame1());
  }

  startGame1() {
    this.game1Score = 0;
    this.game1TimeLeft = 15;
    this.scoreElem.textContent = this.game1Score;
    this.timerElem.textContent = this.game1TimeLeft;
    this.areaElem.innerHTML = '';

    this.game1Timer = setInterval(() => {
      this.game1TimeLeft--;
      this.timerElem.textContent = this.game1TimeLeft;

      if (this.game1TimeLeft <= 0) {
        this.endGame1(false);
      }
    }, 1000);

    this.spawnHeart();
  }

  spawnHeart() {
    if (this.game1TimeLeft <= 0) return;

    this.areaElem.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'target-heart';
    btn.innerHTML = `<svg viewBox="0 0 100 100" width="36" height="36"><path d="M 50,30 A 20,20 0 0,0 10,50 C 10,70 35,85 50,95 C 65,85 90,70 90,50 A 20,20 0 0,0 50,30 Z" fill="#ff758c"/></svg>`;

    const maxX = this.areaElem.clientWidth - 50;
    const maxY = this.areaElem.clientHeight - 50;

    btn.style.left = `${Math.max(10, Math.floor(Math.random() * maxX))}px`;
    btn.style.top = `${Math.max(10, Math.floor(Math.random() * maxY))}px`;

    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      this.particles.createExplosion(rect.left + 20, rect.top + 20);

      this.game1Score++;
      this.scoreElem.textContent = this.game1Score;

      if (this.game1Score >= this.config.gameTarget) {
        this.endGame1(true);
      } else {
        this.spawnHeart();
      }
    });

    this.areaElem.appendChild(btn);
  }

  endGame1(won) {
    clearInterval(this.game1Timer);
    this.areaElem.innerHTML = '';

    const msg = document.createElement('p');
    msg.className = 'game-instruction';

    if (won) {
      msg.textContent = "Tebrikler Aşkım! Harika bir refleks!";
      document.getElementById('btn-arcade-next').classList.remove('hidden');
    } else {
      msg.textContent = "Zaman doldu! Tekrar denemek ister misin?";
      const retryBtn = document.createElement('button');
      retryBtn.className = 'btn btn-primary';
      retryBtn.style.marginTop = '10px';
      retryBtn.textContent = 'Tekrar Dene';
      retryBtn.addEventListener('click', () => this.startGame1());
      this.areaElem.appendChild(retryBtn);
    }

    this.areaElem.appendChild(msg);
  }

  /* GAME 2: SLIDING PUZZLE */
  setupGame2() {
    this.board = document.getElementById('puzzle-board');
    this.statusElem = document.getElementById('puzzle-status');
    this.tiles = [1, 2, 3, 4, 5, 6, 7, 8, null];
    this.renderPuzzle();
  }

  renderPuzzle() {
    this.board.innerHTML = '';
    this.tiles.forEach((tile, index) => {
      const div = document.createElement('div');
      div.className = `puzzle-tile ${tile === null ? 'empty' : ''}`;
      div.textContent = tile ? tile : '';
      div.addEventListener('click', () => this.moveTile(index));
      this.board.appendChild(div);
    });
  }

  moveTile(index) {
    const emptyIndex = this.tiles.indexOf(null);
    const validMoves = [index - 1, index + 1, index - 3, index + 3];

    if (validMoves.includes(emptyIndex)) {
      [this.tiles[index], this.tiles[emptyIndex]] = [this.tiles[emptyIndex], this.tiles[index]];
      this.renderPuzzle();
      this.checkPuzzleWin();
    }
  }

  checkPuzzleWin() {
    const winState = [1, 2, 3, 4, 5, 6, 7, 8, null];
    const isWin = this.tiles.every((val, i) => val === winState[i]);

    if (isWin) {
      this.statusElem.textContent = "Mükemmel! Kalbimin tüm parçalarını birleştirdin.";
      document.getElementById('btn-arcade-next').classList.remove('hidden');
    }
  }

  reset() {
    clearInterval(this.game1Timer);
    this.game1Score = 0;
    this.tiles = [1, 2, 3, 4, 5, 6, 7, 8, null];
    this.renderPuzzle();
  }
}