/* eslint-disable @typescript-eslint/no-explicit-any */

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

export type ActionType<Type, Payload> = {
  type: Type;
  payload: Payload;
};
