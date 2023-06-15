import { Box, Button, Card, CardContent, CardMedia, IconButton, Modal } from '@mui/material';
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
import { Dispatch, SetStateAction, useCallback, useContext, useState } from 'react';
import { Delete } from '@mui/icons-material';
import { t } from 'i18next';
import { asUploadPath } from '../../../helpers/app-helpers';
import RichText from '../../common/RichText';
import { MobileContext } from '../../provider/MobileProvider';

const ExhibitionCard = ({
  exhibition,
  isCurator,
  isBig,
}: {
  exhibition: FlatExhibition;
  isCurator: boolean;
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
      <img
        height='200'
        width='250'
        style={{ objectFit: 'cover' }}
        src={titlePictureLink}
        alt='exhibition picture'
      />
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
  const { isMobile } = useContext(MobileContext);
  return (
    <div className={`${isMobile ? 'w-full' : 'w-[20rem] p-4'}`}>
      <Card
        className='relative cursor-pointer'
        onClick={() => {
          !isCurator && visit(link);
        }}
      >
        <CardMedia component='img' height='200' image={titlePictureLink} alt='exhibition picture' />
        <CardContent
          sx={{ height: isCurator ? '4rem !important' : '2rem !important' }}
          className='flex flex-col justify-between'
        >
          <div className='text-xl font-bold line-clamp-1'>{exhibitionTitle}</div>
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
}: {
  isPopupOpen: boolean;
  setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
  exhibitionTitle: string;
  exhibitionId: string;
}) => {
  const [deleteExhibition] = useDeleteExhibitionMutation();
  const deleteThisExhibition = async () => {
    await deleteExhibition({ variables: { id: exhibitionId }, refetchQueries: ['getExhibitions'] });
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

const ExhibitionOverview = ({
  archiveId,
  showTitle,
  margin,
  backgroundColor,
}: {
  archiveId?: string;
  showTitle?: boolean;
  margin?: boolean;
  backgroundColor?: string;
}) => {
  const { data: exhibitionsData } = useGetExhibitionsQuery({
    variables: archiveId ? { archiveId } : undefined,
  });
  const exhibitions: FlatExhibition[] | undefined =
    useSimplifiedQueryResponseData(exhibitionsData)?.exhibitions;
  const { role } = useAuth();
  const { visit } = useVisit();
  const { t } = useTranslation();
  const { isMobile } = useContext(MobileContext);
  const isCurator = role >= AuthRole.CURATOR;
  const [showMore, setShowMore] = useState(false);
  const isOverflow = (node: HTMLDivElement | null) => {
    if (!node) return false;
    return node.offsetWidth < node.scrollWidth;
  };

  const handleDiv = useCallback(
    (node: HTMLDivElement | null) => {
      setShowMore(isOverflow(node) && (exhibitions?.length ?? 0) > 1);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setShowMore, isCurator, exhibitions]
  );

  const [createExhibition] = useCreateExhibitionMutation();

  const newExhibition = async () => {
    const result = await createExhibition({
      variables: { archiveId: archiveId ?? '0', publishedAt: new Date().toISOString() },
    });
    const id = result.data?.createExhibition?.data?.id;
    id && visit(`/exhibitiontool/${id}`);
  };

  const filteredExhibitions = exhibitions?.filter(
    exhibition => isCurator || exhibition.is_published
  );

  return (
    <>
      {exhibitions && (
        <div className={margin ? 'mt-8' : ''}>
          {showTitle && (filteredExhibitions?.length ?? 0) > 0 && (
            <h2 className='m-2'>{t('exhibition.overview.our-exhibitions')}</h2>
          )}
          <div className={`flex ${isMobile ? 'flex-col' : ''}`}>
            <div className='relative overflow-hidden'>
              <div
                ref={handleDiv}
                className={`grid grid-cols-autofit-card gap-2 grid-rows-1 auto-rows-fr grid-flow-col overflow-hidden whitespace-nowrap`}
              >
                {filteredExhibitions?.map((exhibition, index) => (
                  <ExhibitionCard
                    isBig={false}
                    key={index}
                    exhibition={exhibition}
                    isCurator={isCurator && !isMobile}
                  />
                ))}
              </div>
              {showMore && !isMobile && (
                <div
                  className={`absolute bg-gradient-to-r from-transparent from-10% to-${
                    backgroundColor ? `[${backgroundColor}]` : 'white'
                  } to-90% w-[10rem] top-0 right-0 h-[20rem]`}
                />
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
                {isCurator && archiveId && !isMobile && (
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
        </div>
      )}
    </>
  );
};

const ExhibitionFullOverview = ({ archiveId }: { archiveId: string | undefined }) => {
  const { t } = useTranslation();
  const { data: exhibitionsData } = useGetExhibitionsQuery({
    variables: archiveId ? { archiveId } : undefined,
  });
  const exhibitions: FlatExhibition[] | undefined =
    useSimplifiedQueryResponseData(exhibitionsData)?.exhibitions;
  const { role } = useAuth();
  const isCurator = role >= AuthRole.CURATOR;
  const { isMobile } = useContext(MobileContext);
  return (
    <div className='max-w-[1200px] bg-white m-auto min-h-main'>
      <div className='text-4xl p-4 font-bold'>{t('exhibition.overview.our-exhibitions')}</div>
      {exhibitions && (
        <div className='flex flex-col divide-y-1 divide-x-0 divide-solid divide-slate-300 p-2'>
          {exhibitions
            .filter(exhibition => isCurator || exhibition.is_published)
            .map((exhibition, index) => (
              <ExhibitionCard
                key={index}
                isBig={!isMobile}
                exhibition={exhibition}
                isCurator={isCurator && !isMobile}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export { ExhibitionOverview };

export default ExhibitionFullOverview;
