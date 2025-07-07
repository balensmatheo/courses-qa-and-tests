export function isPalindrome(str: string): boolean {
  const normalized = str.replace(/\s+/g, '').toLowerCase();
  return normalized === normalized.split('').reverse().join('');
} 