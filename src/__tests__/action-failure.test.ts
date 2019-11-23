import { failure, isFailure, getValue } from '../action-failure';

describe('action-failure', () => {
  describe('failure()', () => {
    it('includes the value in the returned structure', () => {
      const error = failure('some value');

      expect(getValue(error)).toBe('some value');
    });
  });

  describe('isFailure', () => {
    it('returns true for failures', () => {
      expect(isFailure(failure(5))).toBe(true);
      expect(isFailure(failure(true))).toBe(true);
      expect(isFailure(failure(undefined))).toBe(true);
      expect(isFailure(failure(false))).toBe(true);
      expect(isFailure(failure(NaN))).toBe(true);
    });

    it('returns for non-failures', () => {
      expect(isFailure(5)).toBe(false);
      expect(isFailure(true)).toBe(false);
      expect(isFailure(undefined)).toBe(false);
      expect(isFailure(false)).toBe(false);
      expect(isFailure(NaN)).toBe(false);
      expect(isFailure([])).toBe(false);
      expect(isFailure({})).toBe(false);
    });
  });
});
