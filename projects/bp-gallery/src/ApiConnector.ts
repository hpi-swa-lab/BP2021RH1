import { stringify } from 'qs';
import { ApolloClient, DocumentNode, gql, InMemoryCache } from '@apollo/client';
import { decodeBrowsePathComponent } from './views/gallery/browse/BrowseView';

export const apiBase = 'https://bp.bad-harzburg-stiftung.de/api/';

class APIConnector {
  get _apiBase() {
    return apiBase;
  }

  apolloClient: ApolloClient<any> = new ApolloClient({
    uri: `${apiBase}/graphql`,
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

  private async categoryQuery(path: string[], innerQuery: string): Promise<any> {
    const p = path.slice().reverse();
    const query = `
    query {
      categoryTags (where: {priority: 1}){
        ${p.reduce((accumulator, folder) => {
          return `
            related_tags (where: {name: "${decodeBrowsePathComponent(folder)}"}){
              ${accumulator}
            }`;
        }, innerQuery)}
      }
    }`;
    let cats = (
      await this.fetchGraphQL(
        gql`
          ${query}
        `
      )
    ).categoryTags;
    for (const _ of p) {
      if (!cats.length) {
        cats = [];
      } else {
        cats = cats ? cats[0].related_tags : [];
      }
    }
    return cats ? cats[0] : null;
  }

  async getCategories(path: string[]): Promise<any> {
    return (
      (
        await this.categoryQuery(
          path,
          `
            related_tags{
                name
                thumbnail: pictures(limit: 1){
                    media{
                    formats
                    }
                }
            }
            `
        )
      )?.related_tags ?? []
    );
  }

  async getCategoryInfo(path: string[]): Promise<any> {
    return this.categoryQuery(
      path,
      `
        id,
        name,
        description
    `
    );
  }

  async queryPicturesGraphQL(where: string, limit = 100, start = 0): Promise<any> {
    const query = `query {
        pictures (limit: ${limit}, start: ${start}, where: ${where}) {
            id,
            media {
                width,
                height,
                formats
            }
        }
    }`;
    const images = await this.fetchGraphQL(
      gql`
        ${query}
      `
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return images.pictures.reduce((acc: any, pic: any, index: number) => {
      acc[start + index] = pic;
      return acc;
    }, {});
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
      comments: pictureArray[0].Comment,
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
