export class Stack {
  constructor(capacity = 5) {
    this._data = [];
    this.capacity = capacity;
  }
  push(item) {
    if (this._data.length >= this.capacity) throw new Error("full");
    this._data.push(item);
    return item;
  }
  pop() {
    if (this._data.length === 0) throw new Error("empty");
    return this._data.pop();
  }
  peek() { return this._data[this._data.length - 1]; }
  isEmpty() { return this._data.length === 0; }
  size() { return this._data.length; }
}