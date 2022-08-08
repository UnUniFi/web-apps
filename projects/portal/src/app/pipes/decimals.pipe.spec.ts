import { DecimalsPipe } from './decimals.pipe';

describe('DecimalsPipe', () => {
  const pipe = new DecimalsPipe();

  it('It extracts the number from 1 decimal place to the entered digit', () => {
    expect(pipe.transform('123.456', 3)).toBe('.456');
  });

  it('It returns all numbers after the decimal point, when input a number with more than its decimal point', () => {
    expect(pipe.transform('123.456', 4)).toBe('.456');
  });

  it('It returns dot string, when input a number 0', () => {
    expect(pipe.transform('123.456', 0)).toBe('.');
  });

  it('It returns empty string, when input a integer', () => {
    expect(pipe.transform('123', 0)).toBe('');
  });

  it('It returns empty string, when input a string', () => {
    expect(pipe.transform('string', 0)).toBe('');
  });

  it('It returns null, when input null', () => {
    expect(pipe.transform(null, 0)).toBe(null);
  });
});
