import { IfFeatureEnabled } from '@growthbook/growthbook-react';
import { useTranslation } from 'react-i18next';
import {
  useGetAllArchiveTagsQuery,
  useGetAllPicturesByArchiveQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useVariant } from '../../../helpers/growthbook';
import { useMobile } from '../../../hooks/context-hooks';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';
import DonateButton from '../../common/DonateButton';
import { IfFlagEnabled } from '../../common/IfFlagEnabled';
import PictureOverview from '../../common/PictureOverview';
import PrimaryButton from '../../common/PrimaryButton';
import BrowseView from '../browse/BrowseView';
import { useVisit } from './../../../helpers/history';
import { ShowStats } from './../../provider/ShowStatsProvider';
import { ArchiveCard, ArchiveCardWithoutPicture } from './ArchiveCard';
import DailyPicture from './DailyPicture';
import './StartView.scss';
import { AccessTime, ThumbUp } from '@mui/icons-material';
import OverviewContainer from '../../common/OverviewContainer';

const StartView = () => {
  const { visit } = useVisit();
  const { t } = useTranslation();
  const { isMobile } = useMobile();
  const { data } = useGetAllArchiveTagsQuery();
  const archives: FlatArchiveTag[] | undefined = useSimplifiedQueryResponseData(data)?.archiveTags;
  const {
    clientId: paypalClientId,
    donationText: paypalDonationText,
    purposeText: paypalPurposeText,
  } = useVariant({
    id: 'paypal_mainpage',
    fallback: { clientId: '', donationText: '', purposeText: '' },
  });
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
        <IfFlagEnabled feature='dummy_experiment'>
          <div className='welcome'>
            <h1>{t('startpage.welcome-title')}</h1>
            <p>{t('startpage.welcome-text')}</p>
          </div>
        </IfFlagEnabled>
        <DailyPicture />

        <div className='flex place-content-center gap-2 m-4 flex-wrap'>
          <PrimaryButton
            onClickFn={() => {
              visit('/discover');
            }}
            isShowMore
          >
            {t('discover.discover-button')}
          </PrimaryButton>
          {!isMobile && (
            <PrimaryButton
              onClickFn={() => {
                visit('/geo');
              }}
              isShowMore
            >
              {t('geo.geo-game-button')}
            </PrimaryButton>
          )}
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
        </div>

        <ShowStats>
          <OverviewContainer
            tabs={[
              {
                title: t('discover.latest-pictures'),
                icon: <AccessTime key='0' />,
                content: (
                  <PictureOverview
                    queryParams={{}}
                    onClick={() => {
                      visit('/show-more/latest');
                    }}
                  />
                ),
              },
              {
                title: t('discover.most-liked'),
                icon: <ThumbUp key='1' />,
                content: (
                  <PictureOverview
                    queryParams={{}}
                    onClick={() => {
                      visit('/show-more/most-liked');
                    }}
                    sortBy={['likes:asc']}
                  />
                ),
              },
            ]}
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
