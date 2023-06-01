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
import { FlatExhibition } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { useVisit } from '../../../helpers/history';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Delete } from '@mui/icons-material';
import { t } from 'i18next';
import { asUploadPath } from '../../../helpers/app-helpers';
import RichText from '../../common/RichText';

const ExhibitionCard = ({
  exhibition,
  isCurator,
  refetch,
  isBig,
}: {
  exhibition: FlatExhibition;
  isCurator: boolean;
  refetch: any;
  isBig: boolean;
}) => {
  const titlePictureLink = exhibition.title_picture
    ? asUploadPath(exhibition.title_picture.picture?.media)
    : '/bad-harzburg-stiftung-logo.png';
  const link = `/exhibition/${exhibition.id}`;
  const editLink = `/exhibitiontool/${exhibition.id}`;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <>
      {isBig ? (
        <ExhibitionBigCard
          isCurator={isCurator}
          titlePictureLink={titlePictureLink}
          link={link}
          editLink={editLink}
          exhibitionTitle={exhibition.title ?? ''}
          setIsPopupOpen={setIsPopupOpen}
          exhibitionIntroduction={exhibition.introduction ?? ''}
        />
      ) : (
        <ExhibitionSmallCard
          isCurator={isCurator}
          titlePictureLink={titlePictureLink}
          link={link}
          editLink={editLink}
          exhibitionTitle={exhibition.title ?? ''}
          setIsPopupOpen={setIsPopupOpen}
        />
      )}
      <DeleteModal
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        exhibitionTitle={exhibition.title ?? ''}
        exhibitionId={exhibition.id}
        refetch={refetch}
      />
    </>
  );
};

const ExhibitionBigCard = ({
  isCurator,
  link,
  editLink,
  titlePictureLink,
  exhibitionTitle,
  exhibitionIntroduction,
  setIsPopupOpen,
}: {
  isCurator: boolean;
  link: string;
  editLink: string;
  titlePictureLink: string;
  exhibitionIntroduction: string;
  exhibitionTitle: string;
  setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const { visit } = useVisit();
  return (
    <div className='relative flex gap-4 p-4'>
      <img height='200' src={titlePictureLink} alt='exhibition picture' />
      <div className='flex flex-col justify-between'>
        <div className='flex flex-col gap-2'>
          <div className='text-xl font-bold'>{exhibitionTitle}</div>
          <RichText value={exhibitionIntroduction} className='line-clamp-5' />
        </div>

        <div className='flex gap-2 flex-row-reverse w-max'>
          <Button
            onClick={e => {
              e.stopPropagation();
              visit(link);
            }}
          >
            {t('exhibition.overview.to-exhibition')}
          </Button>
          {isCurator && (
            <Button
              onClick={e => {
                e.stopPropagation();
                visit(editLink);
              }}
            >
              {t('common.edit')}
            </Button>
          )}
        </div>
      </div>
      {isCurator && (
        <div className='absolute top-2 right-2 bg-white rounded-full'>
          <IconButton onClick={() => setIsPopupOpen(true)}>
            <Delete />
          </IconButton>
        </div>
      )}
    </div>
  );
};

const ExhibitionSmallCard = ({
  isCurator,
  link,
  editLink,
  titlePictureLink,
  exhibitionTitle,
  setIsPopupOpen,
}: {
  isCurator: boolean;
  link: string;
  editLink: string;
  titlePictureLink: string;
  exhibitionTitle: string;
  setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const { visit } = useVisit();
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
            <div className='text-xl font-bold'>{exhibitionTitle}</div>
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
    </div>
  );
};

const DeleteModal = ({
  isPopupOpen,
  setIsPopupOpen,
  exhibitionTitle,
  exhibitionId,
  refetch,
}: {
  isPopupOpen: boolean;
  setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
  exhibitionTitle: string;
  exhibitionId: string;
  refetch: any;
}) => {
  const [deleteExhibition] = useDeleteExhibitionMutation();
  const deleteThisExhibition = async () => {
    await deleteExhibition({ variables: { id: exhibitionId } });
    refetch();
  };
  return (
    <Modal open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
      <Box className='absolute w-[50vw] bg-white top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-8 flex flex-col items-center'>
        <h3>{t('exhibition.overview.delete-title', { exhibitionName: exhibitionTitle })}</h3>
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
                    isBig={false}
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
              <Button
                variant='outlined'
                onClick={() => visit(`/exhibitionOverview/${archiveId ?? ''}`)}
              >
                {t('common.more')}
              </Button>
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

const ExhibitionFullOverview = ({ archiveId }: { archiveId: string | undefined }) => {
  const { data: exhibitionsData, refetch } = useGetExhibitionsQuery({
    variables: archiveId ? { archiveId } : undefined,
  });
  const exhibitions: FlatExhibition[] | undefined =
    useSimplifiedQueryResponseData(exhibitionsData)?.exhibitions;
  const { role } = useAuth();
  const isCurator = role >= AuthRole.CURATOR;
  return (
    <>
      {exhibitions && (
        <div className='flex flex-col'>
          {exhibitions
            .filter(exhibition => isCurator || exhibition.is_published)
            .map((exhibition, index) => (
              <ExhibitionCard
                isBig={true}
                key={index}
                exhibition={exhibition}
                isCurator={isCurator}
                refetch={refetch}
              />
            ))}
        </div>
      )}
    </>
  );
};

export { ExhibitionOverview };

export default ExhibitionFullOverview;
