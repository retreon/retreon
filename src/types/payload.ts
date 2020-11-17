import { AsyncActionSequence } from '../actions/create-async-action';
import { ActionSequence } from '../actions/create-action';
import { VoidAction, ActionSuccess, ActionFailure } from './actions';

export type SuccessPayload<
  Factory extends (...args: any[]) => any
> = ReturnType<Factory> extends ActionSequence<
  ActionFailure<unknown> | ActionSuccess<infer Payload>
>
  ? Payload
  : ReturnType<Factory> extends ActionSequence<ActionSuccess<infer Payload>>
  ? Payload
  : ReturnType<Factory> extends ActionSequence<VoidAction>
  ? VoidAction
  : ReturnType<Factory> extends AsyncActionSequence<any, infer Payload>
  ? Payload
  : never;

export type OptimisticPayload<
  Factory extends (...args: any[]) => AsyncGenerator<any>
> = ReturnType<Factory> extends AsyncActionSequence<infer Payload, any>
  ? Payload
  : never;
