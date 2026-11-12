import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getExhibition($exhibitionId: ID!) {
      exhibition(documentId: $exhibitionId) {
        data {
          id
          attributes {
            title
            introduction
            is_published
            title_picture {
              data {
                id
                attributes {
                  subtitle
                  picture {
                    data {
                      id
                      attributes {
                        media {
                          data {
                            id
                            attributes {
                              width
                              height
                              formats
                              url
                              updatedAt
                              provider
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            idealot_pictures: idealot_pictures_connection {
              data {
                id
                attributes {
                  subtitle
                  picture {
                    data {
                      id
                      attributes {
                        media {
                          data {
                            id
                            attributes {
                              width
                              height
                              formats
                              url
                              updatedAt
                              provider
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            exhibition_sections: exhibition_sections_connection(sort: "order:asc") {
              data {
                id
                attributes {
                  title
                  text
                  order
                  exhibition_pictures: exhibition_pictures_connection(sort: "order:asc") {
                    data {
                      id
                      attributes {
                        order
                        subtitle
                        picture {
                          data {
                            id
                            attributes {
                              media {
                                data {
                                  id
                                  attributes {
                                    width
                                    height
                                    formats
                                    url
                                    updatedAt
                                    provider
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
