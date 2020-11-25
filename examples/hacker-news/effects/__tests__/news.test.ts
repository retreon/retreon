import mockedHttp from '../http';
import * as news from '../news';

jest.mock('../http');

const http: jest.Mocked<typeof mockedHttp> = mockedHttp as any;

describe('News actions', () => {
  const mockGetResponse = <T>(data: T) => {
    http.get.mockResolvedValue({ data });
    return data;
  };

  const mockPostRequest = <T>(data: T) => {
    http.post.mockResolvedValue({ data });
    return data;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetResponse(null);
    mockPostRequest(null);
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

    it('includes the post ID in request failures', async () => {
      http.post.mockRejectedValue(new Error('Testing http.post rejections'));
      const postId = 16;

      await expect(news.upvote({ id: postId })).rejects.toThrow(
        expect.objectContaining({ postId }),
      );
    });
  });
});
