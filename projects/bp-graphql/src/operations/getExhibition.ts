import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getExhibition($exhibitionId: ID!) {
      exhibition(id: $exhibitionId) {
        data {
          id
          attributes {
            title
            introduction
            epilog
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
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            idealot_pictures {
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
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            exhibition_sections(sort: "order:asc") {
              data {
                id
                attributes {
                  title
                  text
                  order
                  exhibition_pictures(sort: "order:asc") {
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
            exhibition_sources {
              data {
                id
                attributes {
                  source
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
