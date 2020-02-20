import assert from '../utils/assert';

export default function validateActionType<T>(actionType: T) {
  assert(typeof actionType === 'string', 'Action types must be strings.');
  return true;
}
