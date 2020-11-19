import { mixin, isKnownError } from '../errors';

describe('Error utils', () => {
  describe('mixin', () => {
    it('throws if the base class is not a function', () => {
      const fail = () => (mixin as any)();

      expect(fail).toThrow(/error class/i);
    });

    it('throws if you try to extend the mixin directly', () => {
      class InvalidMixinUsage extends (mixin as any) {}
      const fail = () => new InvalidMixinUsage();

      expect(fail).toThrow(/mixin/);
    });

    it('correctly identifies custom errors', () => {
      class CustomError extends mixin(Error) {}
      class CustomTypeError extends mixin(TypeError) {}

      expect(isKnownError(new CustomError('known'))).toBe(true);
      expect(isKnownError(new CustomTypeError('known'))).toBe(true);

      expect(isKnownError(new Error('unknown'))).toBe(false);
      expect(isKnownError(new TypeError('unknown'))).toBe(false);

      expect(isKnownError(null)).toBe(false);
      expect(isKnownError(undefined)).toBe(false);
    });
  });
});
