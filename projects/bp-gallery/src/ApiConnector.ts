import { stringify } from 'qs';
import { ApolloClient, DocumentNode, gql, InMemoryCache } from '@apollo/client';

export const apiBase = 'https://bp.bad-harzburg-stiftung.de/api/';

class APIConnector {
  get _apiBase() {
    return apiBase;
  }

  apolloClient: ApolloClient<any> = new ApolloClient<any>({
    uri: 'https://bp.bad-harzburg-stiftung.de/api/graphql',
    cache: new InMemoryCache(),
  });

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

  private async fetchGraphQL(query: DocumentNode) {
    const { data } = await this.apolloClient.query({ query, variables: {} });
    return data;
  }

  async getCategories(path: string[]): Promise<any> {
    // const cats = (
    //   await this.fetchGraphQL(gql`
    //     query {
    //       categoryTags(where: { priority: 2 }) {
    //         name
    //         thumbnail: pictures(limit: 1) {
    //           media {
    //             formats
    //           }
    //         }
    //       }
    //     }
    //   `)
    // ).categoryTags;
    path.reverse();
    const query = `
    query {
      categoryTags (where: {priority: 1}){
        ${path.reduce(
          (accumulator, folder) => {
            return `
            related_tags (where: {name: "${decodeURIComponent(folder)}"}){
              ${accumulator}
            }`;
          },
          `
            related_tags{
              name
              thumbnail: pictures(limit: 1){
                media{
                  formats
                }
             }
            }`
        )} 
      }
    }`;
    let cats = (
      await this.fetchGraphQL(
        gql`
          ${query}
        `
      )
    ).categoryTags;
    for (const _ of path) {
      if (!cats.length) {
        cats = [];
      } else {
        cats = cats ? cats[0].related_tags : [];
      }
    }
    return cats ? cats[0]?.related_tags || [] : [];
  }

  async queryPictures(query: { [key: string]: any }): Promise<any> {
    const images = await this.fetch('pictures', query);
    return images;
  }

  getPicture(pictureId: number): Promise<any> {
    // Return all data to a picture
    const endpoint = 'pictures';
    const query: { [key: string]: any } = JSON.parse(JSON.stringify({ id: pictureId }));
    return this.fetch(endpoint, query);
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
