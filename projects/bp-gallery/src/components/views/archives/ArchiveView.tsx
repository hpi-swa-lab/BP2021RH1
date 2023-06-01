import { Edit, Link } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Redirect } from 'react-router-dom';
import { useGetArchiveQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asUploadPath } from '../../../helpers/app-helpers';
import { FlatArchiveTag, FlatPicture, TagType } from '../../../types/additionalFlatTypes';
import PictureOverview from '../../common/PictureOverview';
import TagOverview from '../../common/TagOverview';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { ShowStats } from '../../provider/ShowStatsProvider';
import { useVisit } from './../../../helpers/history';
import { FALLBACK_PATH } from './../../routes';
import ArchiveDescription from './ArchiveDescription';
import './ArchiveView.scss';
import ExhibitionOverview from '../exhibitions/ExhibitionOverview';

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

  const { data, loading } = useGetArchiveQuery({ variables: { archiveId } });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const showcasePicture: FlatPicture | undefined = archive?.showcasePicture;

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
        <PictureOverview
          title='Unsere Bilder'
          queryParams={{ archive_tag: { id: { eq: archiveId } } }}
          onClick={() => {
            visit('/archives/' + archiveId + '/show-more/pictures');
          }}
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
