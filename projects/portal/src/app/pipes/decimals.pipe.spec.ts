import { DecimalsPipe } from './decimals.pipe';

describe('DecimalsPipe', () => {
  const pipe = new DecimalsPipe();

  it('Extract 3 decimal place', () => {
    expect(pipe.transform('123.456', 3)).toBe('.456');
  });

  it('Set a number with more than a decimal point', () => {
    expect(pipe.transform('123.456', 4)).toBe('.456');
  });

  it('When input a string', () => {
    expect(pipe.transform('string', 0)).toBe('');
  });

  it('When input a integer', () => {
    expect(pipe.transform('123', 0)).toBe('');
  });

  it('When input null', () => {
    expect(pipe.transform(null, 0)).toBe(null);
  });
});
