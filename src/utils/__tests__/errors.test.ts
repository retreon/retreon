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

    it('automatically assigns an error name', () => {
      class CustomError extends mixin(Error) {}

      expect(new CustomError('testing custom errors')).toMatchObject({
        name: 'CustomError',
      });
    });

    it('defaults to the current error name when anonymous', () => {
      const error = new (class extends mixin(TypeError) {})();

      expect(error).toMatchObject({
        name: TypeError.name,
      });
    });

    it('uses the given name if explicitly provided', () => {
      class CustomError extends mixin(Error) {
        name = 'NamedError';
      }

      expect(new CustomError('testing named errors')).toMatchObject({
        name: 'NamedError',
      });
    });
  });
});
