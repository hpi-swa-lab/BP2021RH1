import React from 'react';
import { ApolloError } from '@apollo/client';

const QueryErrorDisplay = ({ error }: { error: ApolloError }) => {
  return <div>{error.message}</div>;
};

export default QueryErrorDisplay;
