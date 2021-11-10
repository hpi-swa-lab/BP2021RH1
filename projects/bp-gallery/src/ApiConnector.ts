import { stringify } from 'qs';

export class APIConnector {
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

  getImage(): Promise<any> {
    // Return image, tags and details
    throw new Error('Not implemented yet.');
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
