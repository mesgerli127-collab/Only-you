export class LetterManager {
  constructor(config, onComplete) {
    this.config = config;
    this.onComplete = onComplete;

    this.envelope = document.getElementById('envelope');
    this.letterTextElem = document.getElementById('letter-text');
    this.skipBtn = document.getElementById('btn-skip-letter');
    this.nextBtn = document.getElementById('btn-letter-next');

    this.typeInterval = null;
    this.isOpen = false;

    this.envelope.addEventListener('click', () => this.openEnvelope());
    this.skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.skipTyping();
    });
  }

  openEnvelope() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.envelope.classList.add('open');

    setTimeout(() => {
      this.startTyping();
    }, 600);
  }

  startTyping() {
    const text = this.config.letterText;
    let index = 0;
    this.letterTextElem.textContent = '';

    this.typeInterval = setInterval(() => {
      if (index < text.length) {
        this.letterTextElem.textContent += text.charAt(index);
        index++;
      } else {
        this.finishTyping();
      }
    }, 40);
  }

  skipTyping() {
    clearInterval(this.typeInterval);
    this.letterTextElem.textContent = this.config.letterText;
    this.finishTyping();
  }

  finishTyping() {
    clearInterval(this.typeInterval);
    this.skipBtn.classList.add('hidden');
    this.nextBtn.classList.remove('hidden');
  }

  reset() {
    clearInterval(this.typeInterval);
    this.isOpen = false;
    this.envelope.classList.remove('open');
    this.letterTextElem.textContent = '';
    this.skipBtn.classList.remove('hidden');
    this.nextBtn.classList.add('hidden');
  }
}