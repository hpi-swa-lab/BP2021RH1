import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Modal,
} from '@mui/material';
import {
  useCreateExhibitionMutation,
  useDeleteExhibitionMutation,
  useGetExhibitionsQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { getPictureLinkFromFlatPicture } from '../../../hooks/get-pictureLink.hook';
import { FlatExhibition } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { useVisit } from '../../../helpers/history';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { Delete } from '@mui/icons-material';
import { t } from 'i18next';

const ExhibitionCard = ({
  exhibition,
  isCurator,
  refetch,
}: {
  exhibition: FlatExhibition;
  isCurator: boolean;
  refetch: any;
}) => {
  const { t } = useTranslation();
  const { visit } = useVisit();
  const titlePictureLink = exhibition.title_picture
    ? getPictureLinkFromFlatPicture(exhibition.title_picture.picture)
    : '/bad-harzburg-stiftung-logo.png';
  const link = `/exhibition/${exhibition.id}`;
  const editLink = `/exhibitiontool/${exhibition.id}`;
  const [deleteExhibition] = useDeleteExhibitionMutation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const deleteThisExhibition = async () => {
    await deleteExhibition({ variables: { id: exhibition.id } });
    refetch();
  };

  return (
    <div className='w-[20rem] p-4'>
      <Card
        className='relative'
        onClick={() => {
          !isCurator && visit(link);
        }}
      >
        <CardActionArea disableRipple={isCurator}>
          <CardMedia
            component='img'
            height='200'
            image={titlePictureLink}
            alt='exhibition picture'
          />
          <CardContent
            style={{
              height: 'auto',
            }}
          >
            <div className='text-xl font-bold'>{exhibition.title}</div>
            {isCurator && (
              <div className='flex gap-2 flex-row-reverse'>
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    visit(link);
                  }}
                >
                  {t('exhibition.overview.to-exhibition')}
                </Button>
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    visit(editLink);
                  }}
                >
                  {t('common.edit')}
                </Button>
              </div>
            )}
          </CardContent>
        </CardActionArea>
        {isCurator && (
          <div className='absolute top-2 right-2 bg-white rounded-full'>
            <IconButton onClick={() => setIsPopupOpen(true)}>
              <Delete />
            </IconButton>
          </div>
        )}
      </Card>
      <Modal open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <Box className='absolute w-[50vw] bg-white top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-8 flex flex-col items-center'>
          <h3>{t('exhibition.overview.delete-title', { exhibitionName: exhibition.title })}</h3>
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                deleteThisExhibition();
                setIsPopupOpen(false);
              }}
            >
              {t('common.yes')}
            </Button>
            <Button onClick={() => setIsPopupOpen(false)}>{t('common.no')}</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

const ExhibitionOverview = ({ archiveId }: { archiveId: string | undefined }) => {
  const { data: exhibitionsData, refetch } = useGetExhibitionsQuery({
    variables: archiveId ? { archiveId } : undefined,
  });
  const exhibitions: FlatExhibition[] | undefined =
    useSimplifiedQueryResponseData(exhibitionsData)?.exhibitions;
  const { visit } = useVisit();
  const { role } = useAuth();
  const isCurator = role >= AuthRole.CURATOR;
  const [showMore, setShowMore] = useState(false);
  const isOverflow = e => {
    if (!e) return false;
    return e.offsetWidth < e.scrollWidth;
  };

  const handleDiv = useCallback(
    (node: HTMLDivElement) => {
      isCurator;
      setShowMore(isOverflow(node));
    },
    [setShowMore, isCurator]
  );

  const [createExhibition] = useCreateExhibitionMutation();

  const newExhibition = async () => {
    const result = await createExhibition({
      variables: { archiveId: archiveId ?? '0', publishedAt: new Date().toISOString() },
    });
    const id = result.data?.createExhibition?.data?.id;
    id && visit(`/exhibitiontool/${id}`);
  };

  return (
    <>
      {exhibitions && (
        <div className='flex'>
          <div className='relative overflow-hidden'>
            <div
              ref={handleDiv}
              className={`grid grid-cols-autofit-card gap-2 grid-rows-1 auto-rows-fr grid-flow-col overflow-hidden whitespace-nowrap`}
            >
              {exhibitions
                .filter(exhibition => isCurator || exhibition.is_published)
                .map((exhibition, index) => (
                  <ExhibitionCard
                    key={index}
                    exhibition={exhibition}
                    isCurator={isCurator}
                    refetch={refetch}
                  />
                ))}
            </div>
            {showMore && (
              <div className='absolute bg-gradient-to-r from-transparent from-10% to-white to-90% w-[10rem] top-0 right-0 h-[20rem]' />
            )}
          </div>
          {showMore ? (
            <div className='grid place-content-center gap-2 p-8'>
              <Button variant='outlined'>{t('common.more')}</Button>
              {isCurator && archiveId && (
                <Button variant='contained' onClick={newExhibition}>
                  {t('exhibition.overview.new-exhibition')}
                </Button>
              )}
            </div>
          ) : (
            <div className='grid place-content-center p-8'>
              {isCurator && archiveId && (
                <Button variant='contained' onClick={newExhibition}>
                  {t('exhibition.overview.new-exhibition')}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

const ExhibitionFullOverview = ({ archiveId }: { archiveId: string }) => {};

export default ExhibitionOverview;