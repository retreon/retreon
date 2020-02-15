import callOnce from '../call-once';

describe('callOnce(...)', () => {
  it('does not immediately call the function', () => {
    const effect = jest.fn();
    const fn = callOnce(effect);

    expect(effect).not.toHaveBeenCalled();
    fn();
    expect(effect).toHaveBeenCalled();
  });

  it('caches the function result', () => {
    const value = { mock: 'meaningful information' };
    const effect = jest.fn(() => value);
    const fn = callOnce(effect);

    expect(fn()).toBe(value);
    expect(fn()).toBe(value);
    expect(fn()).toBe(value);
    expect(effect).toHaveReturnedTimes(1);
  });
});
