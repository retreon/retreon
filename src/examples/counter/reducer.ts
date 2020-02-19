import { createReducer } from '../../index';
import * as counter from './actions';

export default createReducer(0, handleAction => [
  handleAction(counter.increment, state => state + 1),
  handleAction(counter.decrement, state => state - 1),
]);
