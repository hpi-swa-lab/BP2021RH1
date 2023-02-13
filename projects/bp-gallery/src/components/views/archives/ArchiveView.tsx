import { Edit, Link } from '@mui/icons-material';
import { Button } from '@mui/material';
import { History } from 'history';
import { Redirect, useHistory } from 'react-router-dom';
import { useGetArchiveQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asApiPath } from '../../../helpers/app-helpers';
import { FlatArchiveTag, FlatPicture, TagType } from '../../../types/additionalFlatTypes';
import Carousel from '../../common/Carousel';
import CategoryCarousel from '../../common/CategoryCarousel';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import ScrollContainer from '../../common/ScrollContainer';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { FALLBACK_PATH } from './../../routes';
import ArchiveInfo from './ArchiveInfo';
import './ArchiveView.scss';

interface ArchiveViewProps {
  archiveId: string;
}

const ArchiveView = ({ archiveId }: ArchiveViewProps) => {
  const history: History = useHistory();
  const { role } = useAuth();

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
              <ArchiveInfo description={archive.longDescription ?? ''} />
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
                      <a href={`http://${link.url}/`}>{link.title ? link.title : link.url}</a>
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

          <Carousel
            title='Unsere Bilder'
            queryParams={{ archive_tag: { id: { eq: archiveId } } }}
            onClick={() => {
              history.push('/show-more/' + archiveId + '/pictures', {
                showBack: true,
              });
            }}
          />

          <Carousel
            title='Wissen Sie mehr über diese Bilder?'
            queryParams={{ collections: { name: { eq: 'Fragezeichen' } } }}
            onClick={() => {
              history.push('/show-more/0/pictures/Fragezeichen', {
                showBack: true,
              });
            }}
            rows={1}
          />

          <CategoryCarousel
            title='Unsere Kategorien'
            separator={true}
            type={TagType.KEYWORD}
            onClick={() => {
              history.push('/show-more/' + archiveId + '/keyword', {
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
