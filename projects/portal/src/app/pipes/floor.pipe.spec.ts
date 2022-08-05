import { FloorPipe } from './floor.pipe';

describe('FloorPipe', () => {
  const pipe = new FloorPipe();

  it('Truncate to integer', () => {
    expect(pipe.transform('123.456')).toBe('123');
  });

  it('When input a string', () => {
    expect(pipe.transform('string')).toBe('0');
  });

  it('When input a integer', () => {
    expect(pipe.transform('123')).toBe('123');
  });

  it('When input null', () => {
    expect(pipe.transform(null)).toBe(null);
  });
});
