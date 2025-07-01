class Node {
  constructor(obj) {
    this.key = obj.key; // Unique identifier for the node
    this.value = obj.value; // The value associated with the key
    this.expiresAt = obj.expiresAt; // Expiration time in milliseconds
    this.prev = null; // Pointer to the previous node in the doubly linked list
    this.next = null; // Pointer to the next node in the doubly linked listk
  }
}

export default Node;
