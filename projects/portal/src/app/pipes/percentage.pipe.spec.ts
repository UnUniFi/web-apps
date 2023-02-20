import { PercentagePipe } from './percentage.pipe';

describe('PercentagePipe', () => {
  const pipe = new PercentagePipe();

  it('converts string number into percentages', () => {
    expect(pipe.transform('0.00000')).toBe('0%');
    expect(pipe.transform('0.2')).toBe('20%');
    expect(pipe.transform('1')).toBe('100%');
  });

  it('returns empty string, when input a string that is not a number.', () => {
    expect(pipe.transform('string')).toBe('0');
  });

  it('truncates string percentage with decimal points to integer, ', () => {
    expect(pipe.transform('0.123')).toBe('12.3%');
  });

  it('returns null, when input null', () => {
    expect(pipe.transform(null)).toBe(null);
  });
});
