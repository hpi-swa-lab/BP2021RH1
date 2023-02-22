import { useTranslation } from 'react-i18next';
import { useGetAllArchiveTagsQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';
import ScrollContainer from '../../common/ScrollContainer';
import BrowseView from '../browse/BrowseView';
import { ArchiveCard, ArchiveCardWithoutPicture } from './ArchiveCard';
import DailyPicture from './DailyPicture';
import './StartView.scss';

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
          archivePictureCount={archive.pictures?.length ?? 0}
        />
      ) : (
        <ArchiveCardWithoutPicture
          archiveName={archive.name}
          archiveDescription={archive.shortDescription ?? ''}
          archiveId={archive.id}
          archivePictureCount={archive.pictures?.length ?? 0}
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
            <DailyPicture />
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
