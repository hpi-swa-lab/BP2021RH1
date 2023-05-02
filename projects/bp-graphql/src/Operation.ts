export enum OperationType {
  query = 'query',
  mutation = 'mutation',
}

type GraphQLDocument = {
  source: string;
  name: string;
  type: OperationType;
};

const operationTypeAndName = (source: string): { type: OperationType; name: string } => {
  const match = source.match(/\s*(query|mutation) ([a-zA-Z]+)/);
  if (!match) {
    throw new Error('unknown operation type');
  }
  return {
    type: match[1] as OperationType,
    name: match[2],
  };
};

export const graphql = (parts: TemplateStringsArray): GraphQLDocument => {
  // signature disallows interpolation
  const source = parts[0];
  const { type, name } = operationTypeAndName(source);
  return {
    source,
    name,
    type,
  };
};

export type Operation = {
  document: GraphQLDocument;
};
