# 📊 Sorting Algorithm Visualizer

A modern, responsive, web-based **Sorting Algorithm Visualizer** built with **HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript**. It visually and aurally demonstrates the step-by-step inner mechanics of classic comparison and divide-and-conquer sorting algorithms through high-frame-rate visual animations and real-time auditory synthesis.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)
![JavaScript ES6+](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 🌟 Key Features

- **6 Core Sorting Algorithms**:
  - **Bubble Sort** (with early exit optimization)
  - **Selection Sort**
  - **Insertion Sort**
  - **Merge Sort** (visual divide-and-conquer with recursive in-place overwrite)
  - **Quick Sort** (Lomuto partitioning scheme with pivot indicators)
  - **Heap Sort** (Max-Heap construction and iterative root extraction)
- **Interactive Controls**:
  - Adjustable **Array Size** (10 to 100 bars) with real-time scaling
  - Adjustable **Speed Slider** (from educational slow-motion to instantaneous 60fps ultra-fast)
  - 4 **Array Distribution Presets**: Random, Nearly Sorted, Reversed (worst-case), and Few Unique (duplicate testing)
  - **Play, Pause, Resume, and Cancel/Reset** capabilities at any moment during execution
- **Harmonic Auditory Feedback (Web Audio API)**:
  - Generates warm synthesizer tones mathematically mapped to each bar's numerical magnitude.
  - Distinct auditory patterns for comparisons, swaps, and victory arpeggios.
  - One-click mute toggle (`M`).
- **Live Operation Metrics**:
  - Comparison counter
  - Array writes & swaps counter
  - High-precision elapsed time tracker (in seconds)
  - Real-time step status badge (e.g., *"Partitioning [0..39] with Pivot at index 39"*)
- **Educational Complexity Matrix**:
  - Live asymptotic complexity breakdowns: Best $\Omega$, Average $\Theta$, Worst $O$, and Space complexity.
  - Flags for **Stability**, **In-Place execution**, and algorithmic paradigm.
- **Modern UI & Design**:
  - Dark glassmorphism interface styled with Bootstrap 5.3 and custom CSS properties.
  - Dynamic responsive bar rendering with optional value labels for small arrays ($\le 28$ items).
- **Comprehensive Keyboard Shortcuts**:
  - Full hotkey support for frictionless presentation and experimentation.

---

## 🎨 Color Coding Legend

| Color | CSS Class | Meaning / Operation |
| :--- | :--- | :--- |
| **Cyan / Electric Blue** | `.array-bar` | Default unsorted array element |
| **Amber / Golden Yellow** | `.compare` | Elements currently being inspected / compared |
| **Coral / Bright Red** | `.swap` | Elements being swapped or overwritten |
| **Purple / Violet** | `.pivot` | Active pivot element or boundary pointer |
| **Neon Emerald Green** | `.sorted` | Element confirmed in its final sorted position |

---

## ⏱️ Algorithm Complexity Reference

| Algorithm | Best Time | Average Time | Worst Time | Space Complexity | Stable? | In-Place? |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Bubble Sort** | $\Omega(N)$ | $\Theta(N^2)$ | $O(N^2)$ | $O(1)$ | Yes | Yes |
| **Selection Sort** | $\Omega(N^2)$ | $\Theta(N^2)$ | $O(N^2)$ | $O(1)$ | No | Yes |
| **Insertion Sort** | $\Omega(N)$ | $\Theta(N^2)$ | $O(N^2)$ | $O(1)$ | Yes | Yes |
| **Merge Sort** | $\Omega(N \log N)$ | $\Theta(N \log N)$ | $O(N \log N)$ | $O(N)$ | Yes | No |
| **Quick Sort** | $\Omega(N \log N)$ | $\Theta(N \log N)$ | $O(N^2)$ | $O(\log N)$ | No | Yes |
| **Heap Sort** | $\Omega(N \log N)$ | $\Theta(N \log N)$ | $O(N \log N)$ | $O(1)$ | No | Yes |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Start sorting (when idle) / Toggle Pause & Resume (when running) |
| <kbd>R</kbd> | Generate new array with current size and distribution pattern |
| <kbd>M</kbd> | Toggle audio tone feedback (Mute / Unmute) |
| <kbd>Esc</kbd> | Halt and reset active sorting execution |

---

## 📂 Project Directory Structure

```plaintext
sorting-visualizer/
│
├── index.html              # Main HTML5 layout & Bootstrap markup
├── css/
│   └── style.css           # Glassmorphism theme, bar animations & responsive rules
├── js/
│   ├── audio.js            # Web Audio API sound generator & musical pitch mapper
│   ├── visualizer.js       # Core Visualizer class (state, DOM, delay, pause/stop)
│   ├── algorithms.js       # Asynchronous sorting algorithms & educational data
│   └── main.js             # Event listeners, UI binding & keyboard controllers
└── README.md               # Project documentation & GitHub guide
```

---

## 🚀 Getting Started

No build tools, Node modules, or external dependencies required! The project uses standard web technologies and loads Bootstrap via CDN.

### Option 1: Open Directly in Browser
Simply double-click `index.html` or open it with your favorite modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Option 2: Run with a Local Static Server

Using Python:
```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

Using VS Code:
- Install the **Live Server** extension.
- Right-click `index.html` and select **"Open with Live Server"**.

---

## 🛠️ Built With

- **HTML5**: Semantic document structure and accessible components.
- **CSS3**: Custom variables, glassmorphism blur filters, flexbox, and CSS keyframe animations.
- **Bootstrap 5.3**: Modern UI grid, buttons, dropdowns, and modal dialogs.
- **Bootstrap Icons**: Lightweight vector iconography.
- **Vanilla JavaScript (ES6+)**: Async/Await animation queues, DOM manipulation, and modular architecture.
- **Web Audio API**: Real-time frequency synthesis for harmonic auditory feedback.

---

## 🤝 Contributing

Contributions, feedback, and algorithm additions are welcome!
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/radix-sort`).
3. Commit your changes (`git commit -m "Add Radix Sort algorithm"`).
4. Push to the branch (`git push origin feature/radix-sort`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for personal, educational, or commercial purposes.
