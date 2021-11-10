import { stringify } from 'qs';

class APIConnector {
  private apiBase = 'https://bp.bad-harzburg-stiftung.de/api/';

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

  queryImages(): Promise<any> {
    throw new Error('Not implemented yet.');
  }

  getPicture(pictureId: number): Promise<any> {
    // Return all data to a picture
    const endpoint = 'pictures';
    const query = JSON.parse(JSON.stringify({ id: pictureId }));
    return this.fetch(endpoint, query);
  }

  getCommentsForImage(): Promise<any> {
    // Return comments for image
    throw new Error('Not implemented yet.');
  }

  addComment(comment: any): Promise<any> {
    // Add new comment to an image
    throw new Error('Not implemented yet.');
  }
}
const apiConnector = new APIConnector();
export default apiConnector;
