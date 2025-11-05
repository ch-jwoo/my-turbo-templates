/**
 * Adds two numbers together
 */
export const add = (a: number, b: number): number => a + b;

/**
 * Subtracts the second number from the first
 */
export const subtract = (a: number, b: number): number => a - b;

/**
 * Multiplies two numbers
 */
export const multiply = (a: number, b: number): number => a * b;

/**
 * Divides the first number by the second
 * @throws {Error} If divisor is zero
 */
export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
};

/**
 * Calculates the sum of an array of numbers
 */
export const sum = (numbers: number[]): number => {
  return numbers.reduce((acc, num) => acc + num, 0);
};

/**
 * Calculates the average of an array of numbers
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) {
    throw new Error('Cannot calculate average of empty array');
  }
  return sum(numbers) / numbers.length;
};
