import { useTranslation } from 'react-i18next';
import {
  useGetAllArchiveTagsQuery,
  useGetAllPicturesByArchiveQuery,
} from '../../../graphql/APIConnector';
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

  const { data: picturesData } = useGetAllPicturesByArchiveQuery();
  const archivePictures: FlatArchiveTag[] | undefined =
    useSimplifiedQueryResponseData(picturesData)?.archiveTags;

  const archiveCards = archives?.map(archive => {
    const sharedProps = {
      archiveName: archive.name,
      archiveDescription: archive.shortDescription ?? '',
      archiveId: archive.id,
      archivePictureCount: archivePictures?.find(a => a.id === archive.id)?.pictures?.length,
    };

    return (
      <div className='archive' key={archive.id}>
        {archive.showcasePicture ? (
          <ArchiveCard picture={archive.showcasePicture} {...sharedProps} />
        ) : (
          <ArchiveCardWithoutPicture {...sharedProps} />
        )}
      </div>
    );
  });

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
            <h3>{t('startpage.our-archives')}</h3>
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
