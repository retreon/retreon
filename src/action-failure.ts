const VALUE = Symbol('Failed action value');

// Used to represent errors in synchronous actions.
interface Exception<Value> {
  [VALUE]: Value;
}

export const isFailure = <Input>(data: Input) => VALUE in Object(data);
export const getValue = <Value>(error: Exception<Value>) => error[VALUE];
export const failure = <Value>(value: Value): Exception<Value> => ({
  [VALUE]: value,
});
