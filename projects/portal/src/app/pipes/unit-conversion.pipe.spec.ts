import { UnitConversionPipe } from './unit-conversion.pipe';

describe('UnitConversionPipe', () => {
  const pipe = new UnitConversionPipe();

  it('transform string number to K units', () => {
    expect(pipe.transform('1234')).toBe('1.23K');
  });

  it('transform number to M units', () => {
    expect(pipe.transform(1234567)).toBe('1.23M');
  });

  it('transform string number to G units', () => {
    expect(pipe.transform('123456789012')).toBe('123.45G');
  });

  it('transform number to T units', () => {
    expect(pipe.transform(1200000000000)).toBe('1.2T');
  });

  it('When input a string', () => {
    expect(pipe.transform('string')).toBe('');
  });

  it('When input null', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
