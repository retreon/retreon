import * as news from '../actions';
import http from '../http';
import { initializeStore } from '../redux-store';

jest.mock('../http');

describe('News actions', () => {
  const dispatch = <T extends AsyncIterator<any>>(iterator: T) => {
    const store = initializeStore();
    return store.dispatch(iterator);
  };

  const mockGetResponse = <T>(data: T) => {
    (http.get as any).mockResolvedValue({ data });
    return data;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetResponse(null);
  });

  describe('loadPage(...)', () => {
    it('requests the page', async () => {
      const page = 6;
      const iterator = news.loadPage(page);
      await dispatch(iterator);

      expect(http.get).toHaveBeenCalledWith(`/news/?page=${page}`);
    });

    it('resolves with the page data', async () => {
      const pageData = mockGetResponse({ mock: 'page-data' });
      const iterator = news.loadPage(20);

      await expect(dispatch(iterator)).resolves.toEqual(pageData);
    });
  });

  describe('upvote(...)', () => {
    it('upvotes the news listing', async () => {
      await dispatch(news.upvote({ id: 45 }));

      expect(http.post).toHaveBeenCalledWith('/news/article/45/upvote/');
    });
  });
});
