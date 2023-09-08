import { FilterAlt } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LocationEntry.scss';

const LocationPanelHeader = ({ setOpen }: { setOpen: (value: boolean) => void }) => {
  const { t } = useTranslation();

  const [isHoveredName, setHoveredName] = useState<boolean>(false);

  return (
    <>
      <div className='location-header-container'>
        <div
          className='flex'
          onMouseEnter={() => {
            setHoveredName(true);
          }}
          onMouseLeave={() => {
            setHoveredName(false);
          }}
        >
          <div className='location-header-name'>{t('common.name')}</div>
          <FilterAlt
            sx={{ color: '#808080' }}
            className={`my-auto ml-auto ${isHoveredName ? 'visible' : 'invisible'} cursor-pointer`}
            onClick={() => {
              setOpen(true);
            }}
          />
        </div>
        <div className='location-header-synonyms'>{t('curator.synonyms')}</div>
      </div>
    </>
  );
};

export default LocationPanelHeader;
