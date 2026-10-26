import { AccessTime, ArrowForwardIos, AutoStories, ThumbUp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetAllArchiveTagsQuery,
  useGetArchivePictureCountsQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useAuth, useMobile } from '../../../hooks/context-hooks';
import { FlatArchiveTag, PictureOverviewType } from '../../../types/additionalFlatTypes';
import DonateButton from '../../common/DonateButton';
import OverviewContainer, {
  OverviewContainerPosition,
  OverviewContainerTab,
} from '../../common/OverviewContainer';
import PictureOverview from '../../common/PictureOverview';
import BrowseView from '../browse/BrowseView';
import { ExhibitionOverview } from '../exhibitions/ExhibitionOverview';
import { useVisit } from './../../../helpers/history';
import { ShowStats } from './../../provider/ShowStatsProvider';
import { ArchiveCard, ArchiveCardWithoutPicture } from './ArchiveCard';
import DailyPicture from './DailyPicture';
import './StartView.scss';

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const StartView = () => {
  const { visit } = useVisit();
  const { t } = useTranslation();
  const { isMobile } = useMobile();
  const { data } = useGetAllArchiveTagsQuery();
  const archives: FlatArchiveTag[] | undefined = useSimplifiedQueryResponseData(data)?.archiveTags;
  const { data: countData } = useGetArchivePictureCountsQuery();
  const pictureCounts: { id: string; count: number }[] | undefined =
    useSimplifiedQueryResponseData(countData)?.archivePictureCounts;
  const authContext = useAuth();
  const isLoggedIn = authContext.loggedIn;

  const archiveCards = useMemo(
    () =>
      archives
        ?.filter(archive => isLoggedIn || !archive.hidden)
        ?.map(archive => {
          const sharedProps = {
            archiveName: archive.name,
            archiveDescription: archive.shortDescription ?? '',
            archiveId: archive.id,
            archivePictureCount: pictureCounts?.find(pictureCount => pictureCount.id === archive.id)
              ?.count,
          };

          return (
            <div
              className={archive.hidden ? 'brightness-90 opacity-50' : ''}
              key={archive.id}
              data-testid='archive'
            >
              {archive.showcasePicture ? (
                <ArchiveCard picture={archive.showcasePicture} {...sharedProps} />
              ) : (
                <ArchiveCardWithoutPicture {...sharedProps} />
              )}
            </div>
          );
        }),
    [archives, isLoggedIn, pictureCounts]
  );

  const tabs: OverviewContainerTab[] = useMemo(() => {
    return [
      {
        title: t('discover.latest-pictures'),
        icon: <AccessTime key='0' />,
        content: <PictureOverview queryParams={{}} showMoreUrl='/show-more/latest' />,
      },
      {
        title: t('discover.most-liked'),
        icon: <ThumbUp key='1' />,
        content: (
          <PictureOverview
            type={PictureOverviewType.MOST_LIKED}
            queryParams={{}}
            showMoreUrl='/show-more/most-liked'
          />
        ),
      },
      {
        title: t('exhibition.overview.our-exhibitions'),
        icon: <AutoStories key='2' />,
        content: <ExhibitionOverview backgroundColor='#efeae5' />,
      },
    ];
  }, [t]);

  return (
    <div className='main-start-view'>
      <div className='welcome-container'>
        <div className='welcome'>
          <h1>{t('startpage.welcome-title')}</h1>
          <p>{t('startpage.welcome-text')}</p>
        </div>
        <DailyPicture />

        <div className='flex place-content-center gap-2 m-4 flex-wrap'>
          <Button
            variant='contained'
            endIcon={<ArrowForwardIos />}
            onClick={() => {
              visit('/discover');
            }}
          >
            {t('discover.discover-button')}
          </Button>
          {!isMobile && (
            <Button
              variant='contained'
              endIcon={<ArrowForwardIos />}
              onClick={() => {
                visit('/geo');
              }}
            >
              {t('geo.geo-game-button')}
            </Button>
          )}
          <div className='flex basis-full' />
          {paypalClientId && (
            <DonateButton
              donationText={t('startpage.donation-text')}
              clientId={paypalClientId}
              purposeText={t('startpage.donation-purpose')}
            />
          )}
        </div>

        <ShowStats>
          <OverviewContainer
            defaultTabIndex={1}
            tabs={tabs}
            overviewPosition={OverviewContainerPosition.START_VIEW}
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
