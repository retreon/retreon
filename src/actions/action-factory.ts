import Phase from '../constants/phase';
import {
  ActionConstant,
  ActionSuccess,
  ActionFailure,
  OptimisticAction,
} from '../types/actions';

/**
 * ADVANCED: Create plain actions without binding effects. Allows explicitly
 * dispatching actions while preserving type signatures in reducers.
 * @param actionType The redux action type.
 *
 * @example
 * createAction.factory<SuccessType, OptimisticType>('load')
 */
export default function createActionFactory<
  SuccessPayload = never,
  OptimisticPayload = never,
>(
  actionType: ActionConstant,
): ActionFactory<SuccessPayload, OptimisticPayload> {
  return {
    [ACTION_TYPE]: actionType,

    /**
     * Signifies success and the end of the action.
     */
    success: (payload) => ({
      type: actionType,
      payload,
    }),

    /**
     * Signifies permanent failure. The payload type is always unknown because
     * anything can go wrong.
     */
    failure: (error) => ({
      type: actionType,
      error: true,
      payload: error,
    }),

    /**
     * Signifies the start of a long-running task. Can be emitted multiple
     * times to provide progress updates.
     */
    optimistic: (payload) => ({
      type: actionType,
      payload,
      meta: {
        phase: Phase.Optimistic,
      },
    }),
  };
}

export const ACTION_TYPE = Symbol('retreon:action-type');

export interface ActionFactory<SuccessPayload, OptimisticPayload> {
  /**
   * Signifies success and the end of the action.
   */
  success(payload: SuccessPayload): ActionSuccess<SuccessPayload>;

  /**
   * Signifies permanent failure. The payload type is always unknown because
   * anything can go wrong.
   */
  failure(error: unknown): ActionFailure<unknown>;

  /**
   * Signifies the start of a long-running task. Can be emitted multiple
   * times to provide progress updates.
   */
  optimistic(payload: OptimisticPayload): OptimisticAction<OptimisticPayload>;

  [ACTION_TYPE]: string;
}
