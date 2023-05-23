import { useTranslation } from 'react-i18next';
import './LocationEntry.scss';

const LocationPanelHeader = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className='location-header-container'>
        <div className='location-header-name'>{t('common.name')}</div>
        <div className='location-header-synonyms'>{t('curator.synonyms')}</div>
      </div>
    </>
  );
};

export default LocationPanelHeader;
