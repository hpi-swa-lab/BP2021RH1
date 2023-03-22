import { Edit, Link } from '@mui/icons-material';
import { Button } from '@mui/material';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import { useGetArchiveQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asApiPath } from '../../../helpers/app-helpers';
import { FlatArchiveTag, FlatPicture, TagType } from '../../../types/additionalFlatTypes';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import PictureOverview from '../../common/PictureOverview';
import ScrollContainer from '../../common/ScrollContainer';
import TagOverview from '../../common/TagOverview';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
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
  const history: History = useHistory();
  const { role } = useAuth();
  const { t } = useTranslation();

  const { data, loading } = useGetArchiveQuery({ variables: { archiveId } });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const showcasePicture: FlatPicture | undefined = archive?.showcasePicture;
  const src = archive?.logo?.formats?.thumbnail.url ?? '';

  if (!archive) {
    return !loading ? <Redirect to={FALLBACK_PATH} /> : <></>;
  }

  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div className='archive-container'>
          {role >= AuthRole.CURATOR && (
            <p className='edit-button-wrapper'>
              <Button
                className='archive-edit-button'
                startIcon={<Edit />}
                onClick={() => {
                  history.push(
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
                      src={asApiPath(
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        `/${src as string}?updatedAt=${
                          (archive.logo.updatedAt ?? 'unknown') as string
                        }`
                      )}
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

          <PictureOverview
            title='Unsere Bilder'
            queryParams={{ archive_tag: { id: { eq: archiveId } } }}
            onClick={() => {
              history.push('/archives/' + archiveId + '/show-more/pictures', {
                showBack: true,
              });
            }}
          />

          <TagOverview
            title='Unsere Kategorien'
            type={TagType.KEYWORD}
            onClick={() => {
              history.push('/archives/' + archiveId + '/show-more/keyword', {
                showBack: true,
              });
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
      )}
    </ScrollContainer>
  );
};

export default ArchiveView;
