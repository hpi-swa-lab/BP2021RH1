import { useFeatureValue } from '@growthbook/growthbook-react';
import { AccessTime, ArrowForwardIos, AutoStories, ThumbUp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetAllArchiveTagsQuery,
  useGetArchivePictureCountsQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useFlag, useVariant } from '../../../helpers/growthbook';
import { useAuth, useMobile } from '../../../hooks/context-hooks';
import { FlatArchiveTag, PictureOverviewType } from '../../../types/additionalFlatTypes';
import OverviewContainer, {
  OverviewContainerPosition,
  OverviewContainerTab,
} from '../../common/OverviewContainer';
import PictureOverview from '../../common/PictureOverview';
import Footer from '../../common/footer/Footer';
import BrowseView from '../browse/BrowseView';
import { ExhibitionOverview } from '../exhibitions/ExhibitionOverview';
import { useVisit } from './../../../helpers/history';
import { ShowStats } from './../../provider/ShowStatsProvider';
import { ArchiveCard, ArchiveCardWithoutPicture } from './ArchiveCard';
import DailyPicture from './DailyPicture';
import './StartView.scss';

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
  const show_old_browse_view_on_start_page = useFlag('show_old_browse_view_on_start_page');

  const {
    clientId: paypalClientId,
    donationText: paypalDonationText,
    purposeText: paypalPurposeText,
  } = useVariant({
    id: 'paypal_mainpage',
    fallback: { clientId: '', donationText: '', purposeText: '' },
  });

  const archiveCards = archives?.map(archive => {
    const sharedProps = {
      archiveName: archive.name,
      archiveDescription: archive.shortDescription ?? '',
      archiveId: archive.id,
      archivePictureCount: pictureCounts?.find(pictureCount => pictureCount.id === archive.id)
        ?.count,
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

  const showStories = useFlag('showstories');
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
      ...(showStories
        ? [
            {
              title: t('exhibition.overview.our-exhibitions'),
              icon: <AutoStories key='2' />,
              content: <ExhibitionOverview backgroundColor='#efeae5' />,
            },
          ]
        : []),
    ];
  }, [t, showStories]);

  const defaultTabIndex = useFeatureValue('start_view_default_tab_index', 0);

  return (
    <div className='main-start-view'>
      <div className='welcome-container'>
        <div className='flex mb-4'>
          <div className='welcome px-8 my-auto'>
            <h1 className='mb-0 ml-0'>{t('startpage.welcome-title')}</h1>
            <p className='mt-2'>{t('startpage.welcome-text')}</p>
            <Button
              variant='contained'
              endIcon={<ArrowForwardIos />}
              onClick={() => {
                visit('/discover');
              }}
            >
              {t('discover.discover-button')}
            </Button>
          </div>
          <div>
            <DailyPicture />
          </div>
        </div>

        {/* <div className='flex place-content-center gap-2 m-4 flex-wrap'>
          <div className='flex basis-full' />
          <IfFeatureEnabled feature='paypal_mainpage'>
            {paypalClientId !== '' && (
              <DonateButton
                donationText={paypalDonationText}
                clientId={paypalClientId}
                purposeText={paypalPurposeText}
              />
            )}
          </IfFeatureEnabled>
        </div> */}

        <ShowStats>
          <OverviewContainer
            defaultTabIndex={defaultTabIndex < tabs.length ? defaultTabIndex : 0}
            tabs={tabs}
            overviewPosition={OverviewContainerPosition.START_VIEW}
          />
        </ShowStats>

        <div className='bg-[#C1E1C1] -mx-8 my-8'>
          <div className='flex max-h-[187px]'>
            <div className='ml-8 w-2/5 my-4'>
              <h2 className='ml-0 mb-0'>{t('geo.geo-game-button')}</h2>
              <p className='mt-2 pr-4'>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
                eos et accusam et
              </p>
              <Button
                variant='contained'
                endIcon={<ArrowForwardIos />}
                onClick={() => {
                  visit('/geo');
                }}
              >
                Jetzt spielen!
              </Button>
            </div>
            <div className='overflow-hidden -skew-x-[16deg]'>
              <img src='/bad-harzburg-stiftung-logo.png' alt='bh-logo' className='-mt-32' />
            </div>
          </div>
        </div>

        <h2 className='ml-0'>{t('startpage.our-archives')}</h2>
        <div className='archives'>{archiveCards}</div>
      </div>

      {(isLoggedIn || show_old_browse_view_on_start_page) && <BrowseView startpage={true} />}
      <Footer />
    </div>
  );
};

export default StartView;
