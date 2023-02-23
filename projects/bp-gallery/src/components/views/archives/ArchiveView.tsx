import { Edit, Link, Star } from '@mui/icons-material';
import { Button } from '@mui/material';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import { useGetArchiveQuery, useUpdateArchiveMutation } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asApiPath } from '../../../helpers/app-helpers';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { FlatArchiveTag, FlatPicture } from '../../../types/additionalFlatTypes';
import PicturePreview, {
  PicturePreviewAdornment,
} from '../../common/picture-gallery/PicturePreview';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import RichText from '../../common/RichText';
import ScrollContainer from '../../common/ScrollContainer';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { FALLBACK_PATH } from './../../routes';
import './ArchiveView.scss';

interface ArchiveViewProps {
  archiveId: string;
}

const ArchiveView = ({ archiveId }: ArchiveViewProps) => {
  const { t } = useTranslation();
  const history: History = useHistory();
  const { role } = useAuth();

  const { data, loading } = useGetArchiveQuery({ variables: { archiveId } });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const [updateArchive] = useUpdateArchiveMutation({
    refetchQueries: ['getArchive'],
  });

  const showcasePicture: FlatPicture | undefined = archive?.showcasePicture;
  const src = archive?.logo?.formats?.thumbnail.url ?? '';

  const showcaseAdornment: PicturePreviewAdornment = {
    position: 'top-left',
    icon: picture =>
      picture.id === archive?.showcasePicture?.id ? <Star className='star-selected' /> : <Star />,
    title: t('pictureAdornments.showcase'),
    onClick: picture => {
      if (showcasePicture?.id === picture.id) return;
      updateArchive({
        variables: {
          archiveId,
          data: {
            showcasePicture: picture.id,
          },
        },
      });
    },
  };

  const { bulkEdit } = useBulkOperations();

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
              <div className='archive-info-container'>
                <RichText value={archive.longDescription ?? t('archives.defaultLongDescription')} />
              </div>
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

          <PictureScrollGrid
            queryParams={{ archive_tag: { id: { eq: archiveId } } }}
            scrollPos={scrollPos}
            scrollHeight={scrollHeight}
            hashbase={'archive'}
            extraAdornments={role >= AuthRole.CURATOR ? [showcaseAdornment] : []}
            bulkOperations={[bulkEdit]}
          />
        </div>
      )}
    </ScrollContainer>
  );
};

export default ArchiveView;
