import { createStore, applyMiddleware } from 'redux';
import { middleware } from 'retreon';

import reducer, { initialState } from './reducer';

// Create a redux store using the retreon middleware. Optionally, hydrate the
// store with initial state.
//
// This is used to instantiate a new store for each unit test.
export function initializeStore(hydratedState?: typeof initialState) {
  const enhancer = applyMiddleware(middleware);
  return createStore(reducer, hydratedState, enhancer);
}

// Canonical store used by the application.
export default initializeStore();
