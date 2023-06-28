import { AccessTime, Edit, Link, Mail, ThumbUp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { useGetArchiveQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asUploadPath } from '../../../helpers/app-helpers';
import { useFlag } from '../../../helpers/growthbook';
import { useBlockImageContextMenu } from '../../../hooks/block-image-context-menu.hook';
import { useCanUseEditArchiveView } from '../../../hooks/can-do-hooks';
import {
  FlatArchiveTag,
  FlatPicture,
  PictureOverviewType,
  TagType,
} from '../../../types/additionalFlatTypes';
import DonateButton from '../../common/DonateButton';
import OverviewContainer, {
  OverviewContainerPosition,
  OverviewContainerTab,
} from '../../common/OverviewContainer';
import PictureOverview from '../../common/PictureOverview';
import TagOverview from '../../common/TagOverview';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import { ShowStats } from '../../provider/ShowStatsProvider';
import { ExhibitionOverview } from '../exhibitions/ExhibitionOverview';
import { useVisit } from './../../../helpers/history';
import { FALLBACK_PATH } from './../../routes';
import ArchiveDescription from './ArchiveDescription';
import './ArchiveView.scss';

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

  const onLogoContextMenu = useBlockImageContextMenu(archive?.restrictImageDownloading);

  const { canUseEditArchiveView } = useCanUseEditArchiveView(archiveId);

  const showStories = useFlag('showstories');

  if (!archive) {
    return !loading ? <Redirect to={FALLBACK_PATH} /> : <></>;
  }

  return (
    <div className='archive-container'>
      {canUseEditArchiveView && (
        <div className='flex justify-end mb-4'>
          <Button
            variant='contained'
            data-cy='archive-edit'
            endIcon={<Edit />}
            onClick={() => {
              visit(
                `${history.location.pathname}${
                  history.location.pathname.endsWith('/') ? '' : '/'
                }edit`
              );
            }}
          >
            {t('archives.view.edit')}
          </Button>
        </div>
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
                  onContextMenu={onLogoContextMenu}
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
        <div className='archive-showcase'>
          {showcasePicture && (
            <PicturePreview
              picture={showcasePicture}
              onClick={() => {}}
              allowClicks={false}
              highQuality={true}
            />
          )}
          {archive.email && (
            <Button
              fullWidth
              className='!mt-2'
              variant='contained'
              endIcon={<Mail />}
              onClick={() => {
                visit('/contact', { state: { archiveId: archive.id } });
              }}
            >
              {t('archives.view.contact')}
            </Button>
          )}
        </div>
      </div>

      {showStories && <ExhibitionOverview archiveId={archive.id} showTitle />}
      <ShowStats>
        <OverviewContainer
          tabs={tabs}
          overviewPosition={OverviewContainerPosition.ARCHIVE_VIEW}
          tabID={archiveId}
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
