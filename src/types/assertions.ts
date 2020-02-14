/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @private
 *
 * A lighter version of the 'tsd' package. The point of these functions is to
 * generate compile errors.
 */

export const expectType = <T>(_: T) => {};
export const expectNotType = <T, A>(_: A extends T ? never : A) => {};
