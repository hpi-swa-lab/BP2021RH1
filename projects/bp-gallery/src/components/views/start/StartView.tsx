import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useGetAllArchiveTagsQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';
import PrimaryButton from '../../common/PrimaryButton';
import ScrollContainer from '../../common/ScrollContainer';
import BrowseView from '../browse/BrowseView';
import { ArchiveCard, ArchiveCardWithoutPicture } from './ArchiveCard';
import DailyPicture from './DailyPicture';
import './StartView.scss';

const StartView = () => {
  const { t } = useTranslation();

  const { data } = useGetAllArchiveTagsQuery();
  const archives: FlatArchiveTag[] | undefined = useSimplifiedQueryResponseData(data)?.archiveTags;

  const history: History = useHistory();

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
            <div className='flex place-content-center gap-2'>
              <PrimaryButton
                text='Zu den Neuzugängen'
                onClickFn={() => {
                  history.push('/discover', { showBack: true });
                }}
                isShowMore={true}
              />
              <PrimaryButton
                text='Geoguessor'
                onClickFn={() => {
                  history.push('/geo', { showBack: true });
                }}
                isShowMore={true}
              />
            </div>
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
