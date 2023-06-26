import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Loading = ({ label }: { label?: string }) => {
  const { t } = useTranslation();

  return (
    <div className='grid w-full h-full place-content-center justify-items-center gap-4'>
      <CircularProgress />
      {label ?? t('common.loading')}
    </div>
  );
};

export default Loading;
