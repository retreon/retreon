import createActionFactory, { ACTION_TYPE } from '../action-factory';
import { expectType } from '../../types/assertions';
import {
  isActionSuccess,
  isActionFailure,
  isOptimisticAction,
} from '../../utils/action-variant';

describe('createActionFactory', () => {
  it('attaches the action type to a secret field', () => {
    const factory = createActionFactory('action-type');

    expect(factory[ACTION_TYPE]).toBe('action-type');
  });

  it('returns the correct action type', () => {
    const actionType = 'pod-bay-doors/open';
    const fire = createActionFactory<void, void>(actionType);

    expect(fire.optimistic()).toHaveProperty('type', actionType);
    expect(fire.success()).toHaveProperty('type', actionType);
    expect(fire.failure(null)).toHaveProperty('type', actionType);
  });

  describe('success', () => {
    it('returns a plain action with a payload', () => {
      const fire = createActionFactory<string>('fire');
      const action = fire.success('payload');

      expect(isActionSuccess(action)).toBe(true);
      expect(action.payload).toBe('payload');
      expectType<string>(action.payload);
    });
  });

  describe('failure', () => {
    it('returns an unknown payload type', () => {
      const fire = createActionFactory<string>('fire');
      const error = new Error('testing factory errors');
      const action = fire.failure(error);

      expect(isActionFailure(action)).toBe(true);
      expect(action.payload).toBe(error);
      expectType<unknown>(action.payload);
    });
  });

  describe('optimistic', () => {
    it('returns the right payload and meta type', () => {
      const fire = createActionFactory<string, number>('fire');
      const action = fire.optimistic(500);

      expect(isOptimisticAction(action)).toBe(true);
      expect(action.payload).toBe(500);
      expectType<number>(action.payload);
    });
  });
});
