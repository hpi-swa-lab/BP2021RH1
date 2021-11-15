import { stringify } from 'qs';

export const apiBase = 'https://bp.bad-harzburg-stiftung.de/api/';

class APIConnector {
  get _apiBase() {
    return apiBase;
  }

  private fetch(endpoint: string, query: { [key: string]: any }): Promise<any> {
    return new Promise((resolve, reject) => {
      const stringified = stringify(query);
      fetch(apiBase + `${endpoint}?${stringified}`).then(
        resp => {
          if (resp.ok) {
            resolve(resp.json());
          } else {
            reject();
          }
        },
        () => {
          reject();
        }
      );
    });
  }

  async getCategories(query: { [key: string]: any }): Promise<any> {
    const cats = await this.fetch('category-tags', query);
    return cats;
  }

  async queryPictures(query: { [key: string]: any }): Promise<any> {
    const images = await this.fetch('pictures', query);
    return images;
  }

  async getPicture(pictureId: number): Promise<any> {
    // Return all data to a picture
    const query: { [key: string]: any } = JSON.parse(JSON.stringify({ id: pictureId }));
    const pictureArray = await this.queryPictures(query);
    const pictureInfo = {
      url: pictureArray[0].media.url,
      details: {
        title: {
          text: pictureArray[0].title.text,
          id: pictureArray[0].title.id,
        },
        // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
        descriptions: pictureArray[0].descriptions.map((desc: any) => {
          return {
            text: desc.text,
            id: desc.id,
          };
        }),
      },
      comments: pictureArray[0].comment,
    };

    return pictureInfo;
  }

  getCommentsForPicture(): Promise<any> {
    // Return comments for image
    throw new Error('Not implemented yet.');
  }

  addComment(comment: any): Promise<any> {
    // Add new comment to an image
    throw new Error('Not implemented yet.');
  }
}

const apiConnector: APIConnector = new APIConnector();
export default apiConnector;
