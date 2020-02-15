import { ActionConstant } from '../types/actions';

export default function bindActionType<Fn extends Function>(
  actionType: ActionConstant,
  fn: Fn,
) {
  Object.assign(fn, {
    [Symbol.toPrimitive]: () => actionType,
    toString: () => actionType,
  });

  return fn;
}
