import { describe, it, expect } from 'vitest';
import { isPalindrome } from '../src/palindrome';

describe('isPalindrome', () => {
  it('should return true for a single character', () => {
    expect(isPalindrome('a')).toBe(true);
  });

  it('should return true for an empty string', () => {
    expect(isPalindrome('')).toBe(true);
  });

  it('should return true for a simple palindrome', () => {
    expect(isPalindrome('madam')).toBe(true);
  });

  it('should return false for a non-palindrome', () => {
    expect(isPalindrome('hello')).toBe(false);
  });

  it('should return true for a palindrome with spaces', () => {
    expect(isPalindrome('nurses run')).toBe(true);
  });

  it('should be case insensitive', () => {
    expect(isPalindrome('RaceCar')).toBe(true);
  });
}); 