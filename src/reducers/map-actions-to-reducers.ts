import { produce } from 'immer';

import { ReducerDefinition } from '../types/create-reducer';
import { ActionConstant } from '../types/actions';
import ReducerType from '../constants/reducer-type';

type Fn = (...args: any) => any;

// Maps action types to their corresponding reducers. There are different
// lists of reducers to handle different action states, such as errors.
type ActionReducerMapping = Map<
  ActionConstant,
  {
    success: Array<Fn>;
    error: Array<Fn>;
  }
>;

export default function mapActionsToReducers(
  reducerDefinitions: Array<ReducerDefinition>,
): ActionReducerMapping {
  const mapping: ActionReducerMapping = new Map();

  reducerDefinitions.forEach(({ actionType, reducer, reducerType }) => {
    if (!mapping.has(actionType)) {
      mapping.set(actionType, {
        success: [],
        error: [],
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const handlers = mapping.get(actionType)!;
    const immutableReducer = produce(reducer);

    if (reducerType === ReducerType.Success) {
      handlers.success.push(immutableReducer);
    } else if (reducerType === ReducerType.Error) {
      handlers.error.push(immutableReducer);
    }
  });

  return mapping;
}
