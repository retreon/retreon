import { ActionConstant } from '../types/actions';

export default function bindActionType<Fn extends Function>(
  actionType: ActionConstant,
  fn: Fn,
) {
  Object.defineProperty(fn, 'toString', {
    value: () => actionType,
    configurable: false,
    writable: false,
  });

  return fn;
}
