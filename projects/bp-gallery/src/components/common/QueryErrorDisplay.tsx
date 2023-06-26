import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { translateErrorMessage } from '../../i18n';

const QueryErrorDisplay = ({ error }: { error: ApolloError }) => {
  const { t } = useTranslation();
  return <div>{translateErrorMessage(error.message, t)}</div>;
};

export default QueryErrorDisplay;
