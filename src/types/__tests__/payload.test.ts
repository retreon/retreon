import createAction from '../../actions/create-action';
import { SuccessPayload, OptimisticPayload } from '../payload';
import { expectType } from '../assertions';

describe('Payload type inference', () => {
  describe('SuccessPayload', () => {
    it('infers void action payloads', () => {
      const voidAction = createAction('void');

      expectType<SuccessPayload<typeof voidAction>>(undefined);
    });

    it('infers synchronous action payloads', () => {
      const plainAction = createAction<string>('plain');

      expectType<SuccessPayload<typeof plainAction>>('input');
    });

    it('infers synchronous action effect payloads', () => {
      const effectAction = createAction('effect', () => true);

      expectType<SuccessPayload<typeof effectAction>>(true);
    });

    it('infers payload types from action factories', () => {
      const factory = createAction.factory<string, number>('type');

      expectType<SuccessPayload<typeof factory>>('string');
    });
  });

  describe('OptimisticPayload', () => {
    it('infers async action creator payloads with no parameters', () => {
      const effectAction = createAction.async('async', async () => true);

      expectType<OptimisticPayload<typeof effectAction>>(undefined);
    });

    it('infers async action creator payloads from the effect parameter', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const effectAction = createAction.async('type', async (_t: string) => {});

      expectType<OptimisticPayload<typeof effectAction>>('string');
    });

    it('infers payload types from action factories', () => {
      const factory = createAction.factory<number, string>('optimistic');

      expectType<OptimisticPayload<typeof factory>>('string');
    });
  });
});
