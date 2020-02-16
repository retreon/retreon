/**
 * `ReducerType` represents a different mode of the same action, such as
 * failed actions or optimistic types.
 * @private
 */
enum ReducerType {
  Optimistic = 'optimistic',
  Success = 'success',
  Error = 'error',
}

export default ReducerType;
