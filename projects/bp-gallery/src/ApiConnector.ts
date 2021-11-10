import { stringify } from 'qs';

class APIConnector {
  private apiBase = 'https://bp.bad-harzburg-stiftung.de/api/';

  get _apiBase() {
    return this.apiBase;
  }

  private fetch(endpoint: string, query: { [key: string]: any }): Promise<any> {
    return new Promise((resolve, reject) => {
      const stringified = stringify(query);
      fetch(this.apiBase + `${endpoint}?${stringified}`).then(
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

  getPicture(): Promise<any> {
    // Return image, tags and details
    throw new Error('Not implemented yet.');
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
