import React from 'react';
import './StartView.scss';
import { useTranslation } from 'react-i18next';
import BrowseView from '../browse/BrowseView';
import ScrollContainer from '../../common/ScrollContainer';
import ArchiveCard from './ArchiveCard';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useGetAllArchiveTagsQuery } from '../../../graphql/APIConnector';

const StartView = () => {
  const { t } = useTranslation();

  const { data } = useGetAllArchiveTagsQuery();
  const archives: FlatArchiveTag[] | undefined = useSimplifiedQueryResponseData(data)?.archiveTags;
  let archiveCards: JSX.Element[];
  if (archives) {
    console.log(archives[0].showcasePicture?.id);
    archiveCards = archives.map(archive => (
      <div className='archive' key={archive.id}>
        <ArchiveCard
          pictureId={archive.showcasePicture?.id ?? ''}
          archiveName={archive.name}
          archiveDescription={archive.shortDescription ?? ''}
          archiveId={archive.id}
        />
      </div>
    ));
  }

  return (
    <ScrollContainer>
      {() => (
        <div className='main-start-view'>
          <div className='welcome-container'>
            <div className='welcome'>
              <h1>{t('startpage.welcome-title')}</h1>
              <p>{t('startpage.welcome-text')}</p>
            </div>
            <h3>Unsere Archive:</h3>
            <div className='archives'>{archiveCards}</div>
          </div>
          <BrowseView startpage={true} />
        </div>
      )}
    </ScrollContainer>
  );
};

export default StartView;
