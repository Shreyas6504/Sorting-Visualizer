/**
 * Sorting Algorithm Implementations & Educational Metadata
 * All algorithms are async and yield to the Visualizer controller
 * to produce smooth visual animations and sound.
 */

const ALGORITHM_DATA = {
  bubble: {
    title: 'Bubble Sort',
    category: 'Elementary / Comparison',
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Pass-throughs continue until no swaps are needed.',
    bestTime: 'Ω(N)',
    avgTime: 'Θ(N²)',
    worstTime: 'O(N²)',
    space: 'O(1)',
    stable: 'Yes',
    inPlace: 'Yes',
    method: 'Exchanging',
    bestFor: 'Nearly sorted arrays & educational concepts'
  },
  selection: {
    title: 'Selection Sort',
    category: 'Elementary / Comparison',
    description: 'Selection Sort divides the list into sorted and unsorted regions. It repeatedly finds the smallest element from the unsorted region and swaps it into the beginning of the sorted region.',
    bestTime: 'Ω(N²)',
    avgTime: 'Θ(N²)',
    worstTime: 'O(N²)',
    space: 'O(1)',
    stable: 'No',
    inPlace: 'Yes',
    method: 'Selection',
    bestFor: 'Minimizing the total number of swaps (O(N) memory writes)'
  },
  insertion: {
    title: 'Insertion Sort',
    category: 'Elementary / Comparison',
    description: 'Insertion Sort builds the final sorted array one item at a time. It iterates consuming one input element each repetition and growing a sorted output list by inserting the element in its proper place.',
    bestTime: 'Ω(N)',
    avgTime: 'Θ(N²)',
    worstTime: 'O(N²)',
    space: 'O(1)',
    stable: 'Yes',
    inPlace: 'Yes',
    method: 'Insertion',
    bestFor: 'Small datasets or streaming real-time data'
  },
  merge: {
    title: 'Merge Sort',
    category: 'Divide & Conquer',
    description: 'Merge Sort recursively splits the array into two halves, sorts both halves, and then merges them back together in linear time. It guarantees O(N log N) time regardless of input distribution.',
    bestTime: 'Ω(N log N)',
    avgTime: 'Θ(N log N)',
    worstTime: 'O(N log N)',
    space: 'O(N)',
    stable: 'Yes',
    inPlace: 'No',
    method: 'Merging',
    bestFor: 'Predictable performance, linked lists, & external sorting'
  },
  quick: {
    title: 'Quick Sort',
    category: 'Divide & Conquer',
    description: 'Quick Sort chooses a "pivot" element and partitions the array such that elements smaller than the pivot go to the left and larger elements go to the right, then recurses on both sides.',
    bestTime: 'Ω(N log N)',
    avgTime: 'Θ(N log N)',
    worstTime: 'O(N²)',
    space: 'O(log N)',
    stable: 'No',
    inPlace: 'Yes',
    method: 'Partitioning',
    bestFor: 'General in-memory sorting with exceptional cache locality'
  },
  heap: {
    title: 'Heap Sort',
    category: 'Selection / Tree-based',
    description: 'Heap Sort transforms the array into a Binary Max-Heap, then repeatedly extracts the maximum element (root) and places it at the end of the array, rebuilding the heap after each extraction.',
    bestTime: 'Ω(N log N)',
    avgTime: 'Θ(N log N)',
    worstTime: 'O(N log N)',
    space: 'O(1)',
    stable: 'No',
    inPlace: 'Yes',
    method: 'Selection via Max-Heap',
    bestFor: 'Systems with strict memory bounds requiring guaranteed O(N log N)'
  }
};

/**
 * 1. Bubble Sort with Early Exit Optimization
 */
async function bubbleSort(vis) {
  const n = vis.array.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      vis.setStatus(`Comparing index ${j} and ${j + 1}`, 'active');
      await vis.compare(j, j + 1);

      if (vis.array[j] > vis.array[j + 1]) {
        vis.setStatus(`Swapping index ${j} and ${j + 1}`, 'active');
        await vis.swap(j, j + 1);
        swapped = true;
      }
    }
    vis.markSorted(n - 1 - i);
    // Early exit if array is already sorted
    if (!swapped) {
      for (let k = 0; k < n - i - 1; k++) {
        vis.markSorted(k);
      }
      break;
    }
  }
  vis.markSorted(0);
}

/**
 * 2. Selection Sort
 */
async function selectionSort(vis) {
  const n = vis.array.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    vis.setPivot(minIdx, true);

    for (let j = i + 1; j < n; j++) {
      vis.setStatus(`Scanning for minimum from index ${i}: comparing with ${j}`, 'active');
      await vis.compare(minIdx, j);

      if (vis.array[j] < vis.array[minIdx]) {
        vis.setPivot(minIdx, false);
        minIdx = j;
        vis.setPivot(minIdx, true);
      }
    }

    if (minIdx !== i) {
      vis.setStatus(`Swapping current index ${i} with new minimum at ${minIdx}`, 'active');
      await vis.swap(i, minIdx);
    }

    vis.setPivot(minIdx, false);
    vis.markSorted(i);
  }
}

/**
 * 3. Insertion Sort
 */
async function insertionSort(vis) {
  const n = vis.array.length;
  vis.markSorted(0);

  for (let i = 1; i < n; i++) {
    const currentVal = vis.array[i];
    let j = i - 1;

    vis.setPivot(i, true);
    vis.setStatus(`Inserting element at index ${i} (${currentVal}) into sorted partition`, 'active');

    while (j >= 0) {
      await vis.compare(j, j + 1);
      if (vis.array[j] > currentVal) {
        await vis.overwrite(j + 1, vis.array[j]);
        j--;
      } else {
        break;
      }
    }

    await vis.overwrite(j + 1, currentVal);
    vis.setPivot(i, false);

    for (let k = 0; k <= i; k++) {
      vis.markSorted(k);
    }
  }
}

/**
 * 4. Merge Sort (Recursive with Visual In-Place Overwrites)
 */
async function mergeSort(vis) {
  async function mergeSortRecursive(start, end) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSortRecursive(start, mid);
    await mergeSortRecursive(mid + 1, end);
    await merge(start, mid, end);
  }

  async function merge(start, mid, end) {
    vis.setStatus(`Merging sub-arrays [${start}..${mid}] and [${mid + 1}..${end}]`, 'active');

    // Create temporary copy of elements in the range
    const leftPart = vis.array.slice(start, mid + 1);
    const rightPart = vis.array.slice(mid + 1, end + 1);

    let i = 0;
    let j = 0;
    let k = start;

    while (i < leftPart.length && j < rightPart.length) {
      await vis.checkPauseAndAbort();
      vis.comparisons++;
      vis.comparisonBadge.innerText = vis.comparisons.toLocaleString();

      if (leftPart[i] <= rightPart[j]) {
        await vis.overwrite(k, leftPart[i]);
        i++;
      } else {
        await vis.overwrite(k, rightPart[j]);
        j++;
      }
      k++;
    }

    while (i < leftPart.length) {
      await vis.overwrite(k, leftPart[i]);
      i++;
      k++;
    }

    while (j < rightPart.length) {
      await vis.overwrite(k, rightPart[j]);
      j++;
      k++;
    }

    // Highlight merged range
    if (start === 0 && end === vis.array.length - 1) {
      for (let idx = start; idx <= end; idx++) {
        vis.markSorted(idx);
      }
    }
  }

  await mergeSortRecursive(0, vis.array.length - 1);
}

/**
 * 5. Quick Sort (Lomuto Partition Scheme)
 */
async function quickSort(vis) {
  async function quickSortRecursive(low, high) {
    if (low < high) {
      const pi = await partition(low, high);
      await quickSortRecursive(low, pi - 1);
      await quickSortRecursive(pi + 1, high);
    } else if (low >= 0 && low < vis.array.length) {
      vis.markSorted(low);
    }
  }

  async function partition(low, high) {
    const pivotValue = vis.array[high];
    vis.setPivot(high, true);
    vis.setStatus(`Partitioning [${low}..${high}] with Pivot at index ${high} (${pivotValue})`, 'active');

    let i = low - 1;

    for (let j = low; j < high; j++) {
      await vis.compare(j, high);
      if (vis.array[j] < pivotValue) {
        i++;
        if (i !== j) {
          await vis.swap(i, j);
        }
      }
    }

    await vis.swap(i + 1, high);
    vis.setPivot(high, false);
    vis.markSorted(i + 1);

    return i + 1;
  }

  await quickSortRecursive(0, vis.array.length - 1);
}

/**
 * 6. Heap Sort (Max-Heap Construction & Sift-Down)
 */
async function heapSort(vis) {
  const n = vis.array.length;

  // Build Max Heap
  vis.setStatus('Building initial Max-Heap...', 'active');
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  // Extract elements one by one from heap
  for (let i = n - 1; i > 0; i--) {
    vis.setStatus(`Extracting maximum root element to index ${i}`, 'active');
    await vis.swap(0, i);
    vis.markSorted(i);
    await heapify(i, 0);
  }
  vis.markSorted(0);

  async function heapify(length, rootIndex) {
    let largest = rootIndex;
    const left = 2 * rootIndex + 1;
    const right = 2 * rootIndex + 2;

    if (left < length) {
      await vis.compare(left, largest);
      if (vis.array[left] > vis.array[largest]) {
        largest = left;
      }
    }

    if (right < length) {
      await vis.compare(right, largest);
      if (vis.array[right] > vis.array[largest]) {
        largest = right;
      }
    }

    if (largest !== rootIndex) {
      await vis.swap(rootIndex, largest);
      await heapify(length, largest);
    }
  }
}

// Map algorithms to runner functions
const ALGORITHMS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort
};
