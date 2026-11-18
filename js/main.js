/**
 * Application Entry Point & UI Event Coordinator
 * Binds UI inputs, controls execution lifecycle, and updates educational cards.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const algorithmSelect = document.getElementById('algorithmSelect');
  const arrayTypeSelect = document.getElementById('arrayTypeSelect');
  const sizeSlider = document.getElementById('sizeSlider');
  const sizeValue = document.getElementById('sizeValue');
  const speedSlider = document.getElementById('speedSlider');
  const speedValue = document.getElementById('speedValue');

  const generateBtn = document.getElementById('generateBtn');
  const startBtn = document.getElementById('startBtn');
  const startBtnText = document.getElementById('startBtnText');
  const pauseBtn = document.getElementById('pauseBtn');
  const pauseBtnIcon = document.getElementById('pauseBtnIcon');
  const pauseBtnText = document.getElementById('pauseBtnText');
  const resetBtn = document.getElementById('resetBtn');

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const soundStatusText = document.getElementById('soundStatusText');

  // Educational Card References
  const algoTitle = document.getElementById('algoTitle');
  const algoCategoryBadge = document.getElementById('algoCategoryBadge');
  const algoPillBadge = document.getElementById('algoPillBadge');
  const algoInPlaceBadge = document.getElementById('algoInPlaceBadge');
  const algoDescription = document.getElementById('algoDescription');
  const algoStableText = document.getElementById('algoStableText');
  const algoInPlaceText = document.getElementById('algoInPlaceText');
  const algoMethodText = document.getElementById('algoMethodText');
  const algoBestForText = document.getElementById('algoBestForText');
  const algoBestTime = document.getElementById('algoBestTime');
  const algoAvgTime = document.getElementById('algoAvgTime');
  const algoWorstTime = document.getElementById('algoWorstTime');
  const algoSpace = document.getElementById('algoSpace');

  // Initialize Visualizer with default dataset
  const vis = window.visualizer;
  vis.size = parseInt(sizeSlider.value, 10);
  vis.speed = parseInt(speedSlider.value, 10);
  vis.generateArray(arrayTypeSelect.value, vis.size);

  updateSpeedBadge(vis.speed);
  updateAlgorithmInfo(algorithmSelect.value);

  // =========================================================================
  // UI Helpers & State Controllers
  // =========================================================================

  function updateSpeedBadge(val) {
    if (val < 25) speedValue.innerText = 'Slow';
    else if (val < 60) speedValue.innerText = 'Normal';
    else if (val < 85) speedValue.innerText = 'Fast';
    else speedValue.innerText = 'Ultra';
  }

  function updateAlgorithmInfo(algoKey) {
    const data = ALGORITHM_DATA[algoKey];
    if (!data) return;

    algoTitle.innerText = data.title;
    algoCategoryBadge.innerText = data.category;
    algoDescription.innerText = data.description;
    algoStableText.innerText = data.stable;
    algoInPlaceText.innerText = data.inPlace;
    algoMethodText.innerText = data.method;
    algoBestForText.innerText = data.bestFor;
    algoBestTime.innerText = data.bestTime;
    algoAvgTime.innerText = data.avgTime;
    algoWorstTime.innerText = data.worstTime;
    algoSpace.innerText = data.space;

    algoPillBadge.innerText = data.stable === 'Yes' ? 'Stable' : 'Not Stable';
    algoPillBadge.className = data.stable === 'Yes'
      ? 'badge bg-primary-subtle text-primary border border-primary-subtle'
      : 'badge bg-warning-subtle text-warning border border-warning-subtle';

    algoInPlaceBadge.innerText = data.inPlace === 'Yes' ? 'In-Place' : 'Out-of-Place';
    algoInPlaceBadge.className = data.inPlace === 'Yes'
      ? 'badge bg-success-subtle text-success border border-success-subtle'
      : 'badge bg-info-subtle text-info border border-info-subtle';
  }

  function setControlsRunning(isRunning) {
    algorithmSelect.disabled = isRunning;
    arrayTypeSelect.disabled = isRunning;
    sizeSlider.disabled = isRunning;
    generateBtn.disabled = isRunning;
    startBtn.disabled = isRunning;

    pauseBtn.disabled = !isRunning;
    resetBtn.disabled = !isRunning;

    if (!isRunning) {
      pauseBtn.classList.remove('btn-warning');
      pauseBtn.classList.add('btn-outline-warning');
      pauseBtnIcon.className = 'bi bi-pause-fill';
      pauseBtnText.innerText = 'Pause';
      startBtnText.innerText = 'Sort';
    }
  }

  // =========================================================================
  // Core Actions
  // =========================================================================

  async function handleStart() {
    if (vis.isSorting) return;

    const algoKey = algorithmSelect.value;
    const algoFn = ALGORITHMS[algoKey];
    if (!algoFn) return;

    vis.clearAllHighlights();
    vis.resetMetrics();
    vis.isSorting = true;
    vis.isPaused = false;
    vis.shouldStop = false;

    setControlsRunning(true);
    vis.startTimer();
    vis.setStatus(`Sorting using ${ALGORITHM_DATA[algoKey].title}...`, 'active');

    try {
      await algoFn(vis);
      vis.stopTimer();
      vis.setStatus(`Sorted with ${ALGORITHM_DATA[algoKey].title} in ${vis.elapsedTime.toFixed(2)}s!`, 'completed');
      await vis.victoryPass();
    } catch (err) {
      if (err.message === 'SORT_ABORTED') {
        vis.setStatus('Sorting halted by user.', 'idle');
      } else {
        console.error('Sorting visualization error:', err);
        vis.setStatus('Sorting error encountered.', 'idle');
      }
    } finally {
      vis.isSorting = false;
      vis.isPaused = false;
      setControlsRunning(false);
    }
  }

  function handlePauseToggle() {
    if (!vis.isSorting) return;

    if (vis.isPaused) {
      vis.resume();
      pauseBtnIcon.className = 'bi bi-pause-fill';
      pauseBtnText.innerText = 'Pause';
      pauseBtn.classList.remove('btn-warning');
      pauseBtn.classList.add('btn-outline-warning');
    } else {
      vis.pause();
      pauseBtnIcon.className = 'bi bi-play-fill';
      pauseBtnText.innerText = 'Resume';
      pauseBtn.classList.remove('btn-outline-warning');
      pauseBtn.classList.add('btn-warning');
    }
  }

  function handleReset() {
    vis.abort();
    setControlsRunning(false);
    vis.generateArray(arrayTypeSelect.value, vis.size);
  }

  function handleSoundToggle() {
    if (!window.soundController) return;
    const muted = window.soundController.toggleMute();

    if (muted) {
      soundIcon.className = 'bi bi-volume-mute-fill text-danger';
      soundStatusText.innerText = 'Muted';
    } else {
      soundIcon.className = 'bi bi-volume-up-fill text-success';
      soundStatusText.innerText = 'Sound On';
    }
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================

  algorithmSelect.addEventListener('change', (e) => {
    updateAlgorithmInfo(e.target.value);
  });

  arrayTypeSelect.addEventListener('change', () => {
    if (!vis.isSorting) {
      vis.generateArray(arrayTypeSelect.value, vis.size);
    }
  });

  sizeSlider.addEventListener('input', (e) => {
    const newSize = parseInt(e.target.value, 10);
    sizeValue.innerText = newSize;
    vis.size = newSize;
    if (!vis.isSorting) {
      vis.generateArray(arrayTypeSelect.value, newSize);
    }
  });

  speedSlider.addEventListener('input', (e) => {
    const newSpeed = parseInt(e.target.value, 10);
    vis.speed = newSpeed;
    updateSpeedBadge(newSpeed);

    if (newSpeed > 75 || vis.size > 50) {
      vis.container.classList.add('fast-mode');
    } else {
      vis.container.classList.remove('fast-mode');
    }
  });

  generateBtn.addEventListener('click', () => {
    if (!vis.isSorting) {
      vis.generateArray(arrayTypeSelect.value, vis.size);
    }
  });

  startBtn.addEventListener('click', handleStart);
  pauseBtn.addEventListener('click', handlePauseToggle);
  resetBtn.addEventListener('click', handleReset);
  soundToggleBtn.addEventListener('click', handleSoundToggle);

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Avoid interfering if focus is in an input or modal is open
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
      if (e.code === 'Space') return; // allow normal interaction
    }

    if (e.code === 'Space') {
      e.preventDefault();
      if (!vis.isSorting) {
        handleStart();
      } else {
        handlePauseToggle();
      }
    } else if (e.key === 'r' || e.key === 'R') {
      if (!vis.isSorting) {
        vis.generateArray(arrayTypeSelect.value, vis.size);
      }
    } else if (e.key === 'm' || e.key === 'M') {
      handleSoundToggle();
    } else if (e.code === 'Escape') {
      if (vis.isSorting) {
        handleReset();
      }
    }
  });
});
