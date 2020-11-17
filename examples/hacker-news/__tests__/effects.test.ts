import http from '../http';
import * as news from '../effects';

jest.mock('../http');

describe('News actions', () => {
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
      await news.loadPage(6);

      expect(http.get).toHaveBeenCalledWith(`/news/?page=6`);
    });

    it('resolves with the page data', async () => {
      const pageData = mockGetResponse({ mock: 'page-data' });

      await expect(news.loadPage(20)).resolves.toEqual(pageData);
    });
  });

  describe('upvote(...)', () => {
    it('upvotes the news listing', async () => {
      await news.upvote({ id: 45 });

      expect(http.post).toHaveBeenCalledWith('/news/article/45/upvote/');
    });
  });
});
