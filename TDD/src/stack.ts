export class Stack<T> {
  public get empty() {
    return this._items.length === 0;
  }

  private _items: T[] = [];

  constructor() {}

  public push(value: T) {
    this._items.push(value);
  }

  public pop(): T {
    if (this.empty) {
      throw new Error('Stack is empty');
    }
    return this._items.pop() as T;
  }

  public isEmpty(): boolean {
    return this.empty;
  }
} 