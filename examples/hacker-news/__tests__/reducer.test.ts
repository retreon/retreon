import { Store } from 'redux';

import * as news from '../actions';
import { initialState, NewsResult } from '../reducer';
import { initializeStore } from '../redux-store';
import * as mockedEffects from '../effects';

jest.mock('../effects');

const effects: jest.Mocked<typeof mockedEffects> = mockedEffects as any;

/**
 * Note: async action testing patterns are still under experimentation.
 * Consider this a "sneak peak".
 */
const record = <State, T extends Store<State>>(store: T) => {
  const states: State[] = [];

  store.subscribe(() => {
    states.push(store.getState());
  });

  return () => states;
};

describe('News reducer', () => {
  let id = 0;
  const uuid = () => id++;

  const createResult = <T>(patch?: T): NewsResult => ({
    headline: 'Microsoft ruled trustworthy again',
    url: 'http://microsoft.net/developers/developers/developers.aspx',
    upvotes: 0,
    id: uuid(),
    ...patch,
  });

  beforeEach(() => {
    effects.loadPage.mockResolvedValue([]);
  });

  describe('loadPage', () => {
    it('sets a flag while loading', async () => {
      const store = initializeStore();

      const snapshot = record(store);
      await store.dispatch(news.loadPage(5));
      const [optimistic, done] = snapshot();

      expect(optimistic).toHaveProperty('loading', true);
      expect(done).toHaveProperty('loading', false);
    });

    it('sets the list of news results', async () => {
      const results = [createResult()];
      effects.loadPage.mockResolvedValue(results);

      const store = initializeStore();
      await store.dispatch(news.loadPage(5));

      expect(store.getState()).toMatchObject({ results });
    });
  });

  describe('upvote', () => {
    it('increments the vote count', async () => {
      const result = createResult();
      const store = initializeStore({
        ...initialState,
        results: [result],
      });

      const snapshot = record(store);
      jest.spyOn(store, 'dispatch');
      await store.dispatch(news.upvote({ id: result.id }));
      const [state] = snapshot();

      expect(state).toMatchObject({
        results: [{ upvotes: result.upvotes + 1 }],
      });
    });
  });
});
