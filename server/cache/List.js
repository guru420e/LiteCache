class List {
  constructor() {
    this.head = null; // The head of the doubly linked list
    this.tail = null; // The tail of the doubly linked list
    this.size = 0; // The size of the list
  }

  addToHead(node) {
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this.size++;
  }

  remove(node) {
    if (!node) return;

    if (node === this.head) {
      this.head = node.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null; // If the list is now empty
      }
    } else if (node === this.tail) {
      this.tail = node.prev;
      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null; // If the list is now empty
      }
    } else {
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }

    node.next = null;
    node.prev = null;
    this.size--;
  }

  removeLast() {
    if (!this.tail) return null;

    const lastNode = this.tail;
    this.remove(lastNode);
    return lastNode;
  }
}
export default List;
