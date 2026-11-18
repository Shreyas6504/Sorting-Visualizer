/**
 * Visualizer Core Controller
 * Manages array state, DOM bar rendering, operation counters, timing,
 * and asynchronous execution controls (sleep, pause, resume, cancel).
 */

class Visualizer {
  constructor() {
    this.container = document.getElementById('visualizerContainer');
    this.comparisonBadge = document.getElementById('comparisonCount');
    this.swapBadge = document.getElementById('swapCount');
    this.timerBadge = document.getElementById('timeElapsed');
    this.statusMessage = document.getElementById('statusMessage');
    this.statusPulse = document.getElementById('statusPulse');

    this.array = [];
    this.bars = [];
    this.size = 40;
    this.speed = 65;

    // Execution state flags
    this.isSorting = false;
    this.isPaused = false;
    this.shouldStop = false;

    // Metrics
    this.comparisons = 0;
    this.swaps = 0;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timerInterval = null;

    // Pause-resume resolver
    this.pausePromiseResolve = null;
  }

  /**
   * Calculates dynamic delay in milliseconds based on speed slider value (1 - 100)
   */
  getDelay() {
    // 1 (slowest) -> 350ms, 50 -> 25ms, 100 (fastest) -> 1ms
    const factor = (100 - this.speed) / 99;
    return Math.floor(Math.pow(factor, 2.2) * 350) + 1;
  }

  /**
   * Generates a new dataset based on pattern type and size
   * @param {string} pattern - 'random', 'nearlySorted', 'reversed', 'fewUnique'
   */
  generateArray(pattern = 'random', size = this.size) {
    this.size = size;
    this.array = [];

    // Min height 8%, Max height 98%
    const minVal = 8;
    const maxVal = 98;

    if (pattern === 'nearlySorted') {
      const step = (maxVal - minVal) / size;
      for (let i = 0; i < size; i++) {
        this.array.push(Math.round(minVal + i * step));
      }
      // Shuffle ~8% of elements
      const swaps = Math.max(2, Math.floor(size * 0.08));
      for (let k = 0; k < swaps; k++) {
        const i = Math.floor(Math.random() * size);
        const j = Math.floor(Math.random() * size);
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
      }
    } else if (pattern === 'reversed') {
      const step = (maxVal - minVal) / size;
      for (let i = 0; i < size; i++) {
        this.array.push(Math.round(maxVal - i * step));
      }
    } else if (pattern === 'fewUnique') {
      const uniqueBuckets = [15, 35, 55, 75, 95];
      for (let i = 0; i < size; i++) {
        const picked = uniqueBuckets[Math.floor(Math.random() * uniqueBuckets.length)];
        this.array.push(picked);
      }
    } else {
      // Default: Pure Random
      for (let i = 0; i < size; i++) {
        this.array.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
      }
    }

    this.renderBars();
    this.resetMetrics();
    this.setStatus('New array generated. Ready to sort.', 'idle');
  }

  /**
   * Re-renders the bar DOM elements in the visualizer container
   */
  renderBars() {
    this.container.innerHTML = '';
    this.bars = [];

    // Toggle fast mode CSS class if size is high or speed is fast
    if (this.size > 50 || this.speed > 75) {
      this.container.classList.add('fast-mode');
    } else {
      this.container.classList.remove('fast-mode');
    }

    const showLabels = this.size <= 28;

    this.array.forEach((val) => {
      const bar = document.createElement('div');
      bar.className = 'array-bar';
      bar.style.height = `${val}%`;

      if (showLabels) {
        const label = document.createElement('span');
        label.className = 'bar-label';
        label.innerText = val;
        bar.appendChild(label);
      }

      this.container.appendChild(bar);
      this.bars.push(bar);
    });
  }

  /**
   * Updates an individual bar's height and label
   */
  updateBar(index, val) {
    if (!this.bars[index]) return;
    this.bars[index].style.height = `${val}%`;
    const label = this.bars[index].querySelector('.bar-label');
    if (label) {
      label.innerText = val;
    }
  }

  /**
   * Resets operation counters and timers
   */
  resetMetrics() {
    this.comparisons = 0;
    this.swaps = 0;
    this.elapsedTime = 0;
    this.comparisonBadge.innerText = '0';
    this.swapBadge.innerText = '0';
    this.timerBadge.innerText = '0.00 s';
    clearInterval(this.timerInterval);
  }

  /**
   * Starts timer tracking
   */
  startTimer() {
    this.startTime = performance.now() - this.elapsedTime * 1000;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isPaused && this.isSorting) {
        this.elapsedTime = (performance.now() - this.startTime) / 1000;
        this.timerBadge.innerText = `${this.elapsedTime.toFixed(2)} s`;
      }
    }, 40);
  }

  /**
   * Stops timer tracking
   */
  stopTimer() {
    clearInterval(this.timerInterval);
  }

  /**
   * Set status message and pulse state
   */
  setStatus(message, state = 'idle') {
    this.statusMessage.innerText = message;
    this.statusPulse.className = 'status-indicator';
    if (state === 'active') this.statusPulse.classList.add('active');
    else if (state === 'paused') this.statusPulse.classList.add('paused');
    else if (state === 'completed') this.statusPulse.classList.add('completed');
  }

  /**
   * Sleep helper aware of pause, resume, and cancellation
   */
  async sleep(customMs = null) {
    await this.checkPauseAndAbort();
    const delay = customMs !== null ? customMs : this.getDelay();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    await this.checkPauseAndAbort();
  }

  /**
   * Halts or pauses the async loop if user pressed pause or reset
   */
  async checkPauseAndAbort() {
    if (this.shouldStop) {
      throw new Error('SORT_ABORTED');
    }

    if (this.isPaused) {
      await new Promise(resolve => {
        this.pausePromiseResolve = resolve;
      });
    }

    if (this.shouldStop) {
      throw new Error('SORT_ABORTED');
    }
  }

  /**
   * Pause execution
   */
  pause() {
    if (!this.isSorting || this.isPaused) return;
    this.isPaused = true;
    this.setStatus('Execution paused. Click Resume or press Space to continue.', 'paused');
  }

  /**
   * Resume execution
   */
  resume() {
    if (!this.isSorting || !this.isPaused) return;
    this.isPaused = false;
    this.startTime = performance.now() - this.elapsedTime * 1000;
    this.setStatus('Sorting in progress...', 'active');
    if (this.pausePromiseResolve) {
      this.pausePromiseResolve();
      this.pausePromiseResolve = null;
    }
  }

  /**
   * Abort and reset visualizer
   */
  abort() {
    this.shouldStop = true;
    this.isSorting = false;
    this.isPaused = false;
    if (this.pausePromiseResolve) {
      this.pausePromiseResolve();
      this.pausePromiseResolve = null;
    }
    this.stopTimer();
    this.clearAllHighlights();
    this.setStatus('Sorting cancelled.', 'idle');
  }

  /**
   * Compares two elements: highlights bars, plays audio, updates counters
   */
  async compare(i, j) {
    await this.checkPauseAndAbort();
    if (this.bars[i]) this.bars[i].classList.add('compare');
    if (this.bars[j]) this.bars[j].classList.add('compare');

    this.comparisons++;
    this.comparisonBadge.innerText = this.comparisons.toLocaleString();

    if (window.soundController) {
      window.soundController.playNote(this.array[i], 100, Math.min(40, this.getDelay()));
    }

    await this.sleep();

    if (this.bars[i]) this.bars[i].classList.remove('compare');
    if (this.bars[j]) this.bars[j].classList.remove('compare');
  }

  /**
   * Swaps elements at index i and j: highlights bars, swaps in array & DOM
   */
  async swap(i, j) {
    await this.checkPauseAndAbort();
    if (this.bars[i]) this.bars[i].classList.add('swap');
    if (this.bars[j]) this.bars[j].classList.add('swap');

    // Swap internal array values
    const temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;

    // Update DOM heights
    this.updateBar(i, this.array[i]);
    this.updateBar(j, this.array[j]);

    this.swaps++;
    this.swapBadge.innerText = this.swaps.toLocaleString();

    if (window.soundController) {
      window.soundController.playNote(this.array[j], 100, Math.min(50, this.getDelay()));
    }

    await this.sleep();

    if (this.bars[i]) this.bars[i].classList.remove('swap');
    if (this.bars[j]) this.bars[j].classList.remove('swap');
  }

  /**
   * Directly overwrites index with a value (used in Merge Sort & Heap Sort)
   */
  async overwrite(index, value) {
    await this.checkPauseAndAbort();
    if (this.bars[index]) this.bars[index].classList.add('swap');

    this.array[index] = value;
    this.updateBar(index, value);

    this.swaps++;
    this.swapBadge.innerText = this.swaps.toLocaleString();

    if (window.soundController) {
      window.soundController.playNote(value, 100, Math.min(40, this.getDelay()));
    }

    await this.sleep();

    if (this.bars[index]) this.bars[index].classList.remove('swap');
  }

  /**
   * Mark pivot or boundary element
   */
  setPivot(index, enable = true) {
    if (!this.bars[index]) return;
    if (enable) {
      this.bars[index].classList.add('pivot');
    } else {
      this.bars[index].classList.remove('pivot');
    }
  }

  /**
   * Mark a single element as sorted
   */
  markSorted(index) {
    if (this.bars[index]) {
      this.bars[index].classList.remove('compare', 'swap', 'pivot');
      this.bars[index].classList.add('sorted');
    }
  }

  /**
   * Clears all highlights across all bars
   */
  clearAllHighlights() {
    this.bars.forEach(bar => {
      bar.classList.remove('compare', 'swap', 'pivot', 'sorted');
    });
  }

  /**
   * Celebratory cascading victory sweep animation
   */
  async victoryPass() {
    this.clearAllHighlights();
    const delay = Math.max(12, Math.min(45, 1200 / this.size));

    for (let i = 0; i < this.size; i++) {
      if (this.shouldStop) break;
      if (this.bars[i]) {
        this.bars[i].classList.add('sorted');
      }
      if (window.soundController) {
        window.soundController.playNote(this.array[i], 100, delay * 1.5);
      }
      await new Promise(r => setTimeout(r, delay));
    }

    if (!this.shouldStop && window.soundController) {
      window.soundController.playVictorySweep(this.size);
    }
  }
}

// Attach singleton to window
window.visualizer = new Visualizer();
