import { ReducerDefinition } from './types/create-reducer';
import { ActionConstant } from './types/actions';

// Maps action types to their corresponding reducers. There are different
// lists of reducers to handle different action states, such as errors.
type ActionReducerMapping = Map<
  ActionConstant,
  {
    synchronous: Array<Function>;
    error: Array<Function>;
  }
>;

export default function mapActionsToReducers(
  reducerDefinitions: Array<ReducerDefinition>,
): ActionReducerMapping {
  const mapping: ActionReducerMapping = new Map();

  reducerDefinitions.forEach(({ actionType, reducer, reducerType }) => {
    if (!mapping.has(actionType)) {
      mapping.set(actionType, {
        synchronous: [],
        error: [],
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const handlers = mapping.get(actionType)!;

    if (reducerType === 'synchronous') {
      handlers.synchronous.push(reducer);
    } else if (reducerType === 'error') {
      handlers.error.push(reducer);
    }
  });

  return mapping;
}
