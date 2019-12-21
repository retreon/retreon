export const VALUE = Symbol('Failed action value');

// Used to represent errors in synchronous actions.
export interface Exception<Value> {
  [VALUE]: Value;
}

export const isFailure = <Input>(data: Input) => VALUE in Object(data);
export const getValue = <Value>(error: Exception<Value>) => error[VALUE];

/**
 * Indicates that an action failed.
 * @param value Details about what went wrong. This becomes the action payload.
 * @example
 * createAction('notifications/vibrate', () => {
 *   return failure(ErrorTypes.ApiUnavailable)
 * })
 */
export const failure = <Value>(value: Value): Exception<Value> => ({
  [VALUE]: value,
});
