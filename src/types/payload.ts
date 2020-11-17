import { AsyncActionSequence } from '../actions/create-async-action';
import { ActionSequence } from '../actions/create-action';
import { VoidAction, ActionSuccess, ActionFailure } from './actions';

export type SuccessPayload<A extends (...args: any[]) => any> = ReturnType<
  A
> extends AsyncActionSequence<any, infer Payload>
  ? Payload
  : ReturnType<A> extends ActionSequence<infer Yield>
  ? Yield extends VoidAction
    ? Yield
    : Yield extends ActionSuccess<infer Payload>
    ? Payload
    : Yield extends ActionFailure<any> | ActionSuccess<infer Payload>
    ? Payload
    : never
  : never;

export type OptimisticPayload<
  A extends (...args: any[]) => AsyncGenerator<any>
> = ReturnType<A> extends AsyncActionSequence<infer Payload, any>
  ? Payload
  : never;
