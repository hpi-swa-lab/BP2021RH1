import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className='grid w-full h-full place-content-center gap-4'>
      <CircularProgress />
      {t('common.loading')}
    </div>
  );
};

export default Loading;
