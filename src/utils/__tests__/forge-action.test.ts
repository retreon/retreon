import { createAction, failure } from '../../index';
import forgeAction from '../forge-action';
import {
  isActionSuccess,
  isActionFailure,
  isOptimisticAction,
} from '../action-variant';
import Phase from '../../constants/phase';

describe('forgeAction', () => {
  it('returns an action', () => {
    const creator = createAction('potato');
    const action = forgeAction(creator, undefined);

    expect(isActionSuccess(action)).toBe(true);
    expect(action).toEqual({
      type: String(creator),
    });
  });

  it('sets the payload if one was given', () => {
    const payload = 'given';
    const creator = createAction<string>('potato');
    const action = forgeAction(creator, payload);

    expect(action.payload).toBe(payload);
  });

  describe('.error(...)', () => {
    it('returns an error action', () => {
      const creator = createAction('creator', () => failure(5));
      const action = forgeAction.error(creator, 10);

      expect(isActionFailure(action)).toBe(true);
      expect(action).toEqual({
        type: String(creator),
        error: true,
        payload: 10,
      });
    });
  });

  describe('.optimistic(...)', () => {
    it('returns an optimistic action', () => {
      const creator = createAction.async('async', async () => {});
      const payload = 'like and subscribe';
      const action = forgeAction.optimistic(creator, payload);

      expect(isOptimisticAction(action)).toBe(true);
      expect(action).toEqual({
        type: String(creator),
        payload,
        meta: {
          phase: Phase.Optimistic,
        },
      });
    });
  });
});
