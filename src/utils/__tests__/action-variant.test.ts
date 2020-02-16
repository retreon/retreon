import {
  ActionSuccess,
  ActionFailure,
  OptimisticAction,
} from '../../types/actions';
import Phase from '../../phase-constants';
import {
  isActionSuccess,
  isActionFailure,
  isOptimisticAction,
} from '../action-variant';

const actionSuccess: ActionSuccess<string> = {
  type: 'succeed',
  payload: 'yey',
};

const actionFailure: ActionFailure<string> = {
  type: 'fail',
  error: true,
  payload: 'rando mcfailure',
};

const optimisticAction: OptimisticAction<string> = {
  type: 'later',
  payload: 'hi',
  meta: {
    phase: Phase.Optimistic,
  },
};

describe('Action type narrowing', () => {
  describe('isActionSuccess', () => {
    it.each([
      ['success', actionSuccess, true],
      ['failure', actionFailure, false],
      ['optimistic', optimisticAction, false],
    ])('detects %s action types', (_, action, expected) => {
      expect(isActionSuccess(action)).toBe(expected);
    });
  });

  describe('isActionFailure', () => {
    it.each([
      ['success', actionSuccess, false],
      ['failure', actionFailure, true],
      ['optimistic', optimisticAction, false],
    ])('detects %s action types', (_, action, expected) => {
      expect(isActionFailure(action)).toBe(expected);
    });
  });

  describe('isOptimisticAction', () => {
    it.each([
      ['success', actionSuccess, false],
      ['failure', actionFailure, false],
      ['optimistic', optimisticAction, true],
    ])('detects %s action types', (_, action, expected) => {
      expect(isOptimisticAction(action)).toBe(expected);
    });
  });
});
