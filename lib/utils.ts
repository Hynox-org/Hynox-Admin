import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidCurrencyCode(code: string): boolean {
  try {
    // Attempt to create a NumberFormat instance with the given currency code
    // If the code is invalid, it will throw a RangeError
    new Intl.NumberFormat(undefined, { style: 'currency', currency: code });
    return true;
  } catch (e) {
    return false;
  }
}
