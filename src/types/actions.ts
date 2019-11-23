/* eslint-disable @typescript-eslint/no-explicit-any */
export type ActionConstant = string | symbol;

// Return the type of the parameter, or void if none is accepted. Effects
// can't take more than one argument.
export type InputType<Effect extends Function> = Effect extends (
  input: infer Input,
) => any
  ? Input
  : void;

// Same as `ReturnType<...>` but enforces a single parameter limit.
export type PayloadType<
  Effect extends Function
> = Effect extends () => infer Payload
  ? Payload
  : Effect extends (input: any) => infer Payload
  ? Payload
  : never;

export type Action<Payload> = {
  type: ActionConstant;
  payload?: Payload;
  error?: boolean;
};

export type CoercibleAction = {
  [Symbol.toPrimitive](hint: string): ActionConstant;
  toString(): ActionConstant;
  (...args: any): any;
};
