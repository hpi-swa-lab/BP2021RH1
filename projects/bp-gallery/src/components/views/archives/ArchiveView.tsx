import { AccessTime, Edit, Link, ThumbUp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Redirect } from 'react-router-dom';
import { useGetArchiveQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asUploadPath } from '../../../helpers/app-helpers';
import {
  FlatArchiveTag,
  FlatPicture,
  PictureOverviewType,
  TagType,
} from '../../../types/additionalFlatTypes';
import PictureOverview from '../../common/PictureOverview';
import TagOverview from '../../common/TagOverview';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { ShowStats } from '../../provider/ShowStatsProvider';
import { useVisit } from './../../../helpers/history';
import { FALLBACK_PATH } from './../../routes';
import ArchiveDescription from './ArchiveDescription';
import './ArchiveView.scss';
import DonateButton from '../../common/DonateButton';
import { useTranslation } from 'react-i18next';
import OverviewContainer, { OverviewContainerPosition } from '../../common/OverviewContainer';
import { useMemo } from 'react';
import { OverviewContainerTab } from '../../common/OverviewContainer';
import { ExhibitionOverview } from '../exhibitions/ExhibitionOverview';

interface ArchiveViewProps {
  archiveId: string;
}

const addUrlProtocol = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}/`;
};

const ArchiveView = ({ archiveId }: ArchiveViewProps) => {
  const { visit, history } = useVisit();
  const { role } = useAuth();
  const { t } = useTranslation();

  const { data, loading } = useGetArchiveQuery({ variables: { archiveId } });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const showcasePicture: FlatPicture | undefined = archive?.showcasePicture;

  const tabs: OverviewContainerTab[] = useMemo(() => {
    return [
      {
        title: t('discover.our-pictures'),
        icon: <AccessTime key='0' />,
        content: (
          <PictureOverview
            queryParams={{ archive_tag: { id: { eq: archiveId } } }}
            onClick={() => {
              visit('/archives/' + archiveId + '/show-more/pictures');
            }}
          />
        ),
      },
      {
        title: t('discover.most-liked'),
        icon: <ThumbUp key='1' />,
        content: (
          <PictureOverview
            type={PictureOverviewType.MOST_LIKED}
            queryParams={{
              archive_tag: { id: { eq: archiveId } },
            }}
            onClick={() => {
              visit('/archives/' + archiveId + '/show-more/most-liked');
            }}
          />
        ),
      },
    ];
  }, [archiveId, t, visit]);

  if (!archive) {
    return !loading ? <Redirect to={FALLBACK_PATH} /> : <></>;
  }

  return (
    <div className='archive-container'>
      {role >= AuthRole.CURATOR && (
        <p className='edit-button-wrapper'>
          <Button
            className='archive-edit-button'
            startIcon={<Edit />}
            onClick={() => {
              visit(
                `${history.location.pathname}${
                  history.location.pathname.endsWith('/') ? '' : '/'
                }edit`
              );
            }}
          >
            Archiv editieren
          </Button>
        </p>
      )}
      <h1>{archive.name}</h1>
      <div className='archive-data'>
        <div className='archive-info'>
          <ArchiveDescription description={archive.longDescription} />

          <div className='archive-socials'>
            {archive.logo && (
              <div className='archive-logo-container'>
                <img
                  className='archive-logo'
                  src={asUploadPath(archive.logo, { highQuality: false })}
                />
              </div>
            )}
            <div className='archive-links'>
              {archive.links?.map(link => (
                <div className='archive-link' key={link.id}>
                  <Link className='link-icon' />
                  <a href={addUrlProtocol(link.url)}>{link.title ? link.title : link.url}</a>
                </div>
              ))}
              {archive.paypalClient && archive.paypalClient !== '' && (
                <DonateButton
                  clientId={archive.paypalClient}
                  donationText={
                    archive.paypalDonationText ?? t('archives.edit.paypal.donation-default')
                  }
                  purposeText={archive.paypalPurpose ?? ''}
                />
              )}
            </div>
          </div>
        </div>
        {showcasePicture && (
          <div className='archive-showcase'>
            <PicturePreview
              picture={showcasePicture}
              onClick={() => {}}
              allowClicks={false}
              highQuality={true}
            />
          </div>
        )}
      </div>
      <ExhibitionOverview archiveId={archive.id} />
      <ShowStats>
        <OverviewContainer
          tabs={tabs}
          overviewPosition={OverviewContainerPosition.ARCHIVE_VIEW}
          archiveID={archiveId}
        />
      </ShowStats>

      <TagOverview
        title='Unsere Kategorien'
        type={TagType.KEYWORD}
        onClick={() => {
          visit('/archives/' + archiveId + '/show-more/keyword');
        }}
        rows={2}
        queryParams={{
          and: [
            { verified_pictures: { archive_tag: { id: { eq: archiveId } } } },
            { visible: { eq: true } },
          ],
        }}
        thumbnailQueryParams={{ archive_tag: { id: { eq: archiveId } } }}
        archiveId={archiveId}
      />
    </div>
  );
};

export default ArchiveView;
