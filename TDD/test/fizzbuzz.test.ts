import { describe, it, expect } from 'vitest';
import { fizzBuzz } from '../src/fizzbuzz';

describe('fizzBuzz', () => {
  it('should return 1 for input 1', () => {
    expect(fizzBuzz(1)).toBe('1');
  });

  it('should return 2 for input 2', () => {
    expect(fizzBuzz(2)).toBe('2');
  });

  it('should return "Fizz" for multiples of 3', () => {
    expect(fizzBuzz(3)).toBe('Fizz');
    expect(fizzBuzz(6)).toBe('Fizz');
  });

  it('should return "Buzz" for multiples of 5', () => {
    expect(fizzBuzz(5)).toBe('Buzz');
    expect(fizzBuzz(10)).toBe('Buzz');
  });

  it('should return "FizzBuzz" for multiples of 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
    expect(fizzBuzz(30)).toBe('FizzBuzz');
  });
}); 