import { describe, it, expect } from 'vitest';
import { Stack } from '../src/stack';

describe('Stack', () => {
  it('should be empty when initialized', () => {
    const stack = new Stack<number>();
    expect(stack.isEmpty()).toBe(true);
  });

  it('should have empty=true when initialized', () => {
    const stack = new Stack<number>();
    expect(stack.empty).toBe(true);
  });

  it('should set empty to false after push', () => {
    const stack = new Stack<number>();
    stack.push(42);
    expect(stack.empty).toBe(false);
  });

  it('should set empty to true after push then pop', () => {
    const stack = new Stack<number>();
    stack.push(42);
    stack.pop();
    expect(stack.empty).toBe(true);
  });

  it('should push and pop values in LIFO order', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
  });

  it('should throw when popping from empty stack', () => {
    const stack = new Stack<number>();
    expect(() => stack.pop()).toThrowError('Stack is empty');
  });

  it('should empty to be true if values popped', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.pop();
    expect(stack.empty).toBe(true);
  });

  it('should return values in LIFO order', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
  });

  it('should have same value in the same order after each pop.', () => {
    const value1 = 3;
    const value2 = 55;
    const stack = new Stack<number>();

    stack.push(value1);
    stack.push(value2);
    expect(stack.pop()).toBe(value2);
    expect(stack.pop()).toBe(value1);
  });
}); 