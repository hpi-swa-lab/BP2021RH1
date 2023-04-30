type GraphQLDocument = {
  source: string;
};

export const graphql = (parts: TemplateStringsArray): GraphQLDocument => {
  // signature disallows interpolation
  return {
    source: parts[0],
  };
};

export type Operation = {
  document: GraphQLDocument;
};
