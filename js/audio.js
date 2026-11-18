/**
 * Web Audio API Controller for Sorting Visualizer
 * Generates harmonic auditory feedback mapped to array values and operations.
 */

class SoundController {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.masterVolume = 0.06; // Soft, comfortable listening volume
    this.minFreq = 160;       // E3
    this.maxFreq = 920;       // A5
  }

  /**
   * Lazily initializes Web Audio context on the first user gesture
   */
  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } else if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Toggle mute state
   * @returns {boolean} New mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Plays a synthesized tone corresponding to an array bar value
   * @param {number} value - The numerical value of the bar
   * @param {number} maxValue - The maximum possible value in the array
   * @param {number} duration - Tone duration in milliseconds
   */
  playNote(value, maxValue = 100, duration = 40) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const normalized = Math.max(0, Math.min(1, value / maxValue));
      // Logarithmic pitch mapping for natural musical scaling
      const frequency = this.minFreq * Math.pow(this.maxFreq / this.minFreq, normalized);

      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = 'triangle'; // Smooth, warm timbre
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      const durationSec = Math.max(0.02, duration / 1000);

      // Smooth attack and exponential decay to prevent clicking
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(this.masterVolume, now + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + durationSec);
    } catch {
      // Audio errors are safely suppressed to avoid interrupting visual sorting
    }
  }

  /**
   * Plays a celebratory ascending melodic arpeggio upon sorting completion
   */
  async playVictorySweep(arraySize = 30) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    // Pentatonic scale frequency ratios
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99];
    const stepDelay = 60;

    for (let i = 0; i < notes.length; i++) {
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[i], this.audioCtx.currentTime);

        const now = this.audioCtx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 1.2, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      } catch {
        // Safe fallthrough
      }
      await new Promise(r => setTimeout(r, stepDelay));
    }
  }
}

// Export singleton instance to window
window.soundController = new SoundController();
