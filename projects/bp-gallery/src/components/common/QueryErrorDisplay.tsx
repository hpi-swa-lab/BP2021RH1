import { useTranslation } from 'react-i18next';
import { errorToTranslatedString } from '../../helpers/app-helpers';

const QueryErrorDisplay = ({ error }: { error: unknown }) => {
  const { t } = useTranslation();
  return <div>{errorToTranslatedString(error, t)}</div>;
};

export default QueryErrorDisplay;
