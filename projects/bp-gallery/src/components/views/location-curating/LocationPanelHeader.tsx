import { AccountTree, FilterAlt, TableRows } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconButtonWithTooltip from '../../common/IconButtonWithTooltip';
import './LocationEntry.scss';

const LocationPanelHeader = ({
  isOpen,
  setOpen,
  showFlat,
  setShowFlat,
  showFilter,
}: {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  showFlat: boolean;
  setShowFlat: (value: boolean) => void;
  showFilter: boolean;
}) => {
  const { t } = useTranslation();

  const [isHoveredName, setHoveredName] = useState<boolean>(false);

  return (
    <>
      <div className='location-header-container'>
        <div>
          <IconButtonWithTooltip
            title={showFlat ? 'Hierarchische Struktur' : 'Flache Struktur'}
            onClick={() => {
              setShowFlat(!showFlat);
            }}
            icon={showFlat ? <AccountTree /> : <TableRows />}
          />
        </div>
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
          <div
            className={`py-auto ml-auto ${isHoveredName || showFilter ? 'visible' : 'invisible'}`}
          >
            <IconButtonWithTooltip
              title={t('tag-panel.apply-filter')}
              onClick={() => {
                setOpen(!isOpen);
              }}
              icon={<FilterAlt />}
            />
          </div>
        </div>
        <div className='location-header-synonyms'>{t('curator.synonyms')}</div>
      </div>
    </>
  );
};

export default LocationPanelHeader;
