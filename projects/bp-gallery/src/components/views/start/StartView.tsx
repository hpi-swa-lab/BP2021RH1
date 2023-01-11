import React from 'react';
import './StartView.scss';
import { useTranslation } from 'react-i18next';
import BrowseView from '../browse/BrowseView';
import { ArchiveCard, ArchiveCardWithoutPicture } from './ArchiveCard';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useGetAllArchiveTagsQuery } from '../../../graphql/APIConnector';
import ScrollContainer from '../../common/ScrollContainer';
import WeeklyPicture from './WeeklyPicture';

const StartView = () => {
  const { t } = useTranslation();

  const { data } = useGetAllArchiveTagsQuery();
  const archives: FlatArchiveTag[] | undefined = useSimplifiedQueryResponseData(data)?.archiveTags;

  const archiveCards = archives?.map(archive => (
    <div className='archive' key={archive.id}>
      {archive.showcasePicture ? (
        <ArchiveCard
          picture={archive.showcasePicture}
          archiveName={archive.name}
          archiveDescription={archive.shortDescription ?? ''}
          archiveId={archive.id}
        />
      ) : (
        <ArchiveCardWithoutPicture
          archiveName={archive.name}
          archiveDescription={archive.shortDescription ?? ''}
          archiveId={archive.id}
        />
      )}
    </div>
  ));

  return (
    <ScrollContainer>
      {(scrollPos, scrollHeight) => (
        <div className='main-start-view'>
          <div className='welcome-container'>
            <div className='welcome'>
              <h1>{t('startpage.welcome-title')}</h1>
              <p>{t('startpage.welcome-text')}</p>
            </div>
            <WeeklyPicture />
            <h3>Unsere Archive:</h3>
            <div className='archives'>{archiveCards}</div>
          </div>
          <BrowseView
            startpage={true}
            parentScrollPos={scrollPos}
            parentScrollHeight={scrollHeight}
          />
        </div>
      )}
    </ScrollContainer>
  );
};

export default StartView;
