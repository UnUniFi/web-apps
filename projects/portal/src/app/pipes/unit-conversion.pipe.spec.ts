import { UnitConversionPipe } from './unit-conversion.pipe';

describe('UnitConversionPipe', () => {
  const pipe = new UnitConversionPipe();

  it('It returns K units when input a string number with 4 or more digits', () => {
    expect(pipe.transform('1234')).toBe('1.23K');
  });

  it('It returns M units when input a number with 7 or more digits', () => {
    expect(pipe.transform(1234567)).toBe('1.23M');
  });

  it('It returns G units when input a string number with 10 or more digits', () => {
    expect(pipe.transform('1234567890')).toBe('1.23G');
  });

  it('It returns T units when input a number with 13 or more digits', () => {
    expect(pipe.transform(1200000000000)).toBe('1.2T');
  });

  it('It returns original value when input a string number with less than 4 digits', () => {
    expect(pipe.transform('123')).toBe('123');
  });

  it('It returns empty string, when input a string', () => {
    expect(pipe.transform('string')).toBe('');
  });

  it('It returns null, when input null', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
