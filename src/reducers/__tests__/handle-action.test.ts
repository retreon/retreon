import handleAction from '../handle-action';
import { createAction } from '../../index';

describe('handleAction', () => {
  const increment = createAction('increment', () => undefined);

  it('throws if the action creator is undefined', () => {
    const fail = () => handleAction(undefined as any, () => {});

    expect(fail).toThrow(/action/i);
  });

  it('throws if the reducer is invalid', () => {
    const fail = () => handleAction(increment, null as any);

    expect(fail).toThrow(/reducer/i);
  });

  it('returns an action definition', () => {
    const def = handleAction(increment, () => {});

    expect(def).toMatchObject({
      actionType: 'increment',
    });
  });

  describe('.error(...)', () => {
    const die = createAction('die');

    it('returns an action definition', () => {
      const def = handleAction.error(die, () => {});

      expect(def).toMatchObject({
        actionType: 'die',
      });
    });
  });

  describe('.optimistic(...)', () => {
    it('returns an action definition', () => {
      const action = createAction.async('later', async () => {});
      const def = handleAction.optimistic(action, () => {});

      expect(def).toMatchObject({
        actionType: 'later',
      });
    });
  });
});
