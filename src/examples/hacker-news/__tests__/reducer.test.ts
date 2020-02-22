import forgeAction from '../../../utils/forge-action';
import * as news from '../actions';
import reducer, { initialState, NewsResult } from '../reducer';

/**
 * Note: async action creators are still a work in progress. Testing tools
 * aren't ready yet. Consider this a sneak peak.
 */

let id = 0;
const uuid = () => id++;

describe('News reducer', () => {
  const createResult = <T>(patch?: T): NewsResult => ({
    headline: 'Microsoft ruled trustworthy again',
    url: 'http://microsoft.net/developers/developers/developers.aspx',
    upvotes: 0,
    id: uuid(),
    ...patch,
  });

  describe('optimistic(loadPage)', () => {
    it('sets a loading flag', () => {
      const action = forgeAction.optimistic(news.loadPage, 5);
      const state = reducer(undefined, action);

      expect(state).toMatchObject({
        loading: true,
        results: [],
        currentPage: 5,
      });
    });
  });

  describe('loadPage(...)', () => {
    it('sets the list of news results', () => {
      const results = [createResult()];
      const action = forgeAction(news.loadPage, results);
      const state = reducer(undefined, action);

      expect(state).toMatchObject({ results });
    });
  });

  describe('optimistic(upvote)', () => {
    it('increments the vote count', () => {
      const result = createResult();
      const startingPoint = { ...initialState, results: [result] };

      const action = forgeAction.optimistic(news.upvote, { id: result.id });
      const state = reducer(startingPoint, action);

      expect(state.results[0]).toMatchObject({
        upvotes: result.upvotes + 1,
      });
    });
  });
});
