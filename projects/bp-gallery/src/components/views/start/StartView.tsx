import { useTranslation } from 'react-i18next';
import {
  useGetAllArchiveTagsQuery,
  useGetAllPicturesByArchiveQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';
import DonateButton from '../../common/DonateButton';
import PictureOverview from '../../common/PictureOverview';
import BrowseView from '../browse/BrowseView';
import { useVisit } from './../../../helpers/history';
import { ShowStats } from './../../provider/ShowStatsProvider';
import { ArchiveCard, ArchiveCardWithoutPicture } from './ArchiveCard';
import DailyPicture from './DailyPicture';
import './StartView.scss';

const StartView = () => {
  const { visit } = useVisit();
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
    <div className='main-start-view'>
      <div className='welcome-container'>
        <div className='welcome'>
          <h1>{t('startpage.welcome-title')}</h1>
          <p>{t('startpage.welcome-text')}</p>
        </div>
        <DailyPicture />
        <DonateButton clientId='Af995AL7EAaDJugFaepw6fajUE_oBrrrMFePYbGpPMGPb9FdmI01TUIlfLtln6y8M7AjIvxnIsSvw6b8' />

        <ShowStats>
          <PictureOverview
            title={t('discover.latest-pictures')}
            queryParams={{}}
            onClick={() => visit('/show-more/latest')}
          />
        </ShowStats>
        <h2 className='archives-title'>{t('startpage.our-archives')}</h2>
        <div className='archives'>{archiveCards}</div>
      </div>
      <BrowseView startpage={true} />
    </div>
  );
};

export default StartView;
