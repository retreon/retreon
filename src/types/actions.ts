export type ActionConstant = string | symbol;

export type Action<Payload> = {
  type: ActionConstant;
  payload?: Payload;
  error?: boolean;
};

export interface ActionTypeCoercible {
  [Symbol.toPrimitive](hint: string): ActionConstant;
  toString(): ActionConstant;
}

export interface CoercibleAction<Args extends Array<any>, RetVal>
  extends ActionTypeCoercible {
  (...args: Args): RetVal;
}
