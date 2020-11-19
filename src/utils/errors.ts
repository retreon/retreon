import assert from './assert';

/**
 * Expected errors and unexpected errors are differentiated using a class
 * mixin. See ADR-0001 for reasoning.
 *
 * @example
 * class ApiUnavailableError extends mixin(Error) {}
 * throw new ApiUnavailableError('browser not supported')
 */

type ErrorType = new (...args: any[]) => Error;

// The only way you get an error marker is by explicitly subclassing the
// mixin. The marker helps retreon distinguish between known errors and
// unexpected failures.
const KNOWN_ERROR_MARKER = Symbol.for('retreon:error');

export function mixin<T extends ErrorType>(this: unknown, ErrorClass: T): T {
  assert(this instanceof mixin === false, 'mixin(...) is not a class.');
  assert(typeof ErrorClass === 'function', 'Expected an error class.');

  return class RetreonErrorMixin extends ErrorClass {
    [KNOWN_ERROR_MARKER] = true;
  };
}

export function isKnownError(input: unknown): boolean {
  return typeof input === 'object' && input
    ? KNOWN_ERROR_MARKER in input
    : false;
}
