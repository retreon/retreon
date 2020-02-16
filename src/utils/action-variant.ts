import {
  Action,
  ActionSuccess,
  ActionFailure,
  OptimisticAction,
} from '../types/actions';
import Phase from '../constants/phase';

/**
 * A set of utilities to determine the FSA "variant" (error, success,
 * optimistic) while making sure TypeScript stays up to speed.
 */

export const isActionSuccess = (
  action: Action<unknown>,
): action is ActionSuccess<unknown> => {
  const { error, meta } = action;
  return error !== true && (!meta || meta.phase !== Phase.Optimistic);
};

export const isActionFailure = (
  action: Action<unknown>,
): action is ActionFailure<unknown> => {
  return action.error === true;
};

export const isOptimisticAction = (
  action: Action<unknown>,
): action is OptimisticAction<unknown> => {
  return Boolean(
    action.error !== true &&
      action.meta &&
      action.meta.phase === Phase.Optimistic,
  );
};
