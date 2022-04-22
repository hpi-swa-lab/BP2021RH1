import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import PictureInfo from '../../shared/picture-info/PictureInfo';
import { PictureOverviewContext } from './PictureOverview';
import PicturePreview from './PicturePreview';
import './PictureTable.scss';

const PictureTable = () => {
  const { pictures } = useContext(PictureOverviewContext);
  const { t } = useTranslation();
  return (
    <div className='table'>
      <div className='row header'>
        <div></div>
        <div>{t('pictureFields.time')}</div>
        <div>{t('pictureFields.descriptions')}</div>
        <div>{t('pictureFields.locations')}</div>
        <div>{t('pictureFields.people')}</div>
        <div>{t('pictureFields.keywords')}</div>
        <div>{t('pictureFields.archiveId')}</div>
      </div>
      {pictures.map(picture => (
        <PictureTableRow key={picture.id} picture={picture} />
      ))}
    </div>
  );
};

const PictureTableRow = ({ picture }: { picture: FlatPicture }) => {
  const { navigateToPicture } = useContext(PictureOverviewContext);

  return (
    <div className='row'>
      <div className='picture-col'>
        <PicturePreview picture={picture} onClick={() => navigateToPicture(picture.id)} />
      </div>
      <PictureInfo picture={picture} onSaveStatusChange={() => {}} />
      <div>{picture.archive_identifier}</div>
    </div>
  );
};

export default PictureTable;
