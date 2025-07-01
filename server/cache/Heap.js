class Heap {
  constructor() {
    this.tree = [];
    this.map = new Map(); // key -> index
  }

  getSize() {
    return this.tree.length;
  }

  swap(i, j) {
    const temp = this.tree[i];
    this.tree[i] = this.tree[j];
    this.tree[j] = temp;

    this.map.set(this.tree[i].key, i);
    this.map.set(this.tree[j].key, j);
  }

  heapify(index) {
    let smallestIdx = index;
    let leftChildIdx = 2 * index + 1;
    let rightChildIdx = 2 * index + 2;

    if (
      leftChildIdx < this.tree.length &&
      this.tree[leftChildIdx].expiresAt < this.tree[smallestIdx].expiresAt
    ) {
      smallestIdx = leftChildIdx;
    }

    if (
      rightChildIdx < this.tree.length &&
      this.tree[rightChildIdx].expiresAt < this.tree[smallestIdx].expiresAt
    ) {
      smallestIdx = rightChildIdx;
    }

    if (smallestIdx !== index) {
      this.swap(index, smallestIdx);
      this.heapify(smallestIdx);
    }
  }

  siftUp(index) {
    while (index > 0) {
      let parIdx = Math.floor((index - 1) / 2);
      if (this.tree[index].expiresAt < this.tree[parIdx].expiresAt) {
        this.swap(index, parIdx);
        index = parIdx;
      } else break;
    }
  }

  add(node) {
    this.tree.push(node);
    let index = this.tree.length - 1;
    this.map.set(node.key, index);
    this.siftUp(index);
  }

  peek() {
    if (this.tree.length === 0) return null;
    return this.tree[0];
  }

  pop() {
    if (this.tree.length === 0) return null;

    const min = this.tree[0];
    this.map.delete(min.key);

    if (this.tree.length === 1) {
      this.tree.pop();
      return min;
    }

    const last = this.tree.pop();
    this.tree[0] = last;
    this.map.set(last.key, 0);
    this.heapify(0);

    return min;
  }

  remove(node) {
    const key = node.key;
    if (!this.map.has(key)) return false;

    const index = this.map.get(key);
    this.map.delete(key);

    const last = this.tree.pop();

    if (index < this.tree.length) {
      this.tree[index] = last;
      this.map.set(last.key, index);
      this.heapify(index);
      this.siftUp(index);
    }

    return true;
  }
}

export default Heap;
