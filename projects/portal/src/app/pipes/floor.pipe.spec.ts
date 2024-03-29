import { FloorPipe } from './floor.pipe';

describe('FloorPipe', () => {
  const pipe = new FloorPipe();

  it('truncates string numbers with decimal points to integer', () => {
    expect(pipe.transform('123.456')).toBe('123');
  });

  it('returns 0, When input a string that is not a number.', () => {
    expect(pipe.transform('string')).toBe('0');
  });

  it('returns the entered value, when enter a number with no decimal point, ', () => {
    expect(pipe.transform('123')).toBe('123');
  });

  it('returns null, when input null', () => {
    expect(pipe.transform(null)).toBe(null);
  });
});
