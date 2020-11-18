import { AsyncActionSequence } from '../actions/create-async-action';
import { ActionSequence } from '../actions/create-action';
import { VoidAction, ActionSuccess, ActionFailure } from './actions';
import { ActionFactory } from '../actions/action-factory';

/**
 * These types are what power the reducer's type inference. They answer the
 * question "given this action creator, what payload can we expect?"
 * Because there are many ways to write an action creator, there are many
 * ways to answer that question. This file tries to enumerate all of them.
 *
 * See the test file for a more human-readable overview.
 */

export type SuccessPayload<
  Factory extends ActionFactory<any, any> | ((...args: any[]) => any)
> = Factory extends ActionFactory<infer Payload, any>
  ? Payload
  : Factory extends (...args: any[]) => any
  ? ReturnType<Factory> extends ActionSequence<
      ActionFailure<unknown> | ActionSuccess<infer Payload>
    >
    ? Payload
    : ReturnType<Factory> extends ActionSequence<ActionSuccess<infer Payload>>
    ? Payload
    : ReturnType<Factory> extends ActionSequence<VoidAction>
    ? VoidAction
    : ReturnType<Factory> extends AsyncActionSequence<any, infer Payload>
    ? Payload
    : never
  : never;

export type OptimisticPayload<
  Factory extends
    | ActionFactory<any, any>
    | ((...args: any[]) => AsyncGenerator<any>)
> = Factory extends ActionFactory<any, infer Payload>
  ? Payload
  : Factory extends (...args: any[]) => AsyncActionSequence<infer Payload, any>
  ? Payload
  : never;
