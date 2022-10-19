export function peek(heap) {
  return heap.length === 0 ? null : heap[0];
}

export function push(heap, node) {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

function siftUp(heap, node, i) {
  let index = i;
  while (index > 0) {
    const parentIndex = (index - 1) >> 1;
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      // parent > node 需要调整
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      return;
    }
  }
}

export function pop(heap) {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  const last = heap.pop();
  if (first !== last) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  return first;
}

function siftDown(heap, node, i) {
  let index = i;
  const len = heap.length;
  const halfLen = len >> 1;
  while (index < halfLen) {
    const leftIndex = (index + 1) * 2 - 1;
    const rightIndex = leftIndex + 1;
    const left = heap[leftIndex];
    const right = heap[rightIndex];
    if (compare(node, left) > 0) {
      // node > left 需要调整
      if (rightIndex < len && compare(right, left) < 0) {
        // 右边比左边小  右边是最小的 需要🈶右边移到父节点
        heap[rightIndex] = node;
        heap[index] = right;
        index = rightIndex;
      } else {
        // 没有右节点  或者右边比左边大 直接移动左边
        heap[leftIndex] = node;
        heap[index] = left;
        index = leftIndex;
      }
    } else if (rightIndex < len && compare(node, right) > 0) {
      // node 大于右节点 需要移动右节点
      heap[rightIndex] = node;
      heap[index] = right;
      index = rightIndex;
    } else {
      return;
    }
  }
}

function compare(a, b) {
  // return a - b;
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

//  