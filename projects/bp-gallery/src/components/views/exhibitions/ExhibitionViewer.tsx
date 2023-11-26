import { Portal } from '@mui/material';
import { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useGetExhibitionQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asUploadPath, root } from '../../../helpers/app-helpers';
import { useCanEditExhibition } from '../../../hooks/can-do-hooks';
import { FlatExhibition } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import ProtectedRoute from '../../common/ProtectedRoute';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import RichText from '../../common/RichText';
import { FALLBACK_PATH } from '../../routes';
import PictureView from '../picture/PictureView';
import { ExhibitionGetContext, ExhibitionStateViewer } from './ExhibitonUtils';
import { Gallery } from 'react-grid-gallery';
import { pushHistoryWithoutRouter } from '../../../helpers/history';

const Title = () => {
  const { getTitlePicture, getTitle, getIntroduction } = useContext(ExhibitionGetContext);
  const titlePicture = getTitlePicture()?.picture;
  const titlePictureLink = asUploadPath(titlePicture?.media);
  return (
    <div className='flex-1'>
      {titlePicture ? (
        <div
          style={{ backgroundImage: `url(${titlePictureLink})` }}
          className='relative h-[40rem] bg-cover bg-center'
        >
          <div
            className={`absolute z-[999] bottom-0 w-full bg-white/60 shadow-inner dropbackdrop-contrast-122 flex flex-col gap-4 p-11 box-border`}
          >
            <div className='text-6xl font-bold'>{getTitle()}</div>
          </div>
        </div>
      ) : (
        <div className='p-11 text-6xl font-bold'>{getTitle()}</div>
      )}
      <div className='p-11'>
        <RichText value={getIntroduction()} />
      </div>
    </div>
  );
};

const Section = ({ sectionId }: { sectionId: string }) => {
  const { getSection } = useContext(ExhibitionGetContext);
  const mySection = getSection(sectionId);
  const [focusedPicture, setFocusedPicture] = useState<string>();
  const images = mySection?.dragElements.map(elem => ({
    src: asUploadPath(elem.picture.media),
    width: elem.picture.media?.width ?? 0,
    height: elem.picture.media?.height ?? 0,
    id: elem.picture.id,
  }));
  return (
    <>
      {focusedPicture && (
        <Portal container={root}>
          <PictureView
            initialPictureId={focusedPicture}
            siblingIds={mySection?.dragElements
              .map(drag => drag.picture.id)
              .filter((value, index, self) => self.indexOf(value) === index)}
            onBack={() => setFocusedPicture(undefined)}
          />
        </Portal>
      )}
      {mySection && (
        <div className='flex flex-col gap-4'>
          <div className='text-4xl font-semibold'>{mySection.title}</div>
          <RichText value={mySection.text} />
          <Gallery
            images={images ?? []}
            enableImageSelection={false}
            rowHeight={360}
            onClick={(index, item) => {
              setFocusedPicture(item.id);
              pushHistoryWithoutRouter(`/picture/${item.id}`);
            }}
          />
        </div>
      )}
    </>
  );
};

const MainPart = () => {
  const { getAllSections } = useContext(ExhibitionGetContext);
  const sectionsWithContent = getAllSections()?.filter(
    section => section.title || section.text || section.dragElements
  );
  const sections = sectionsWithContent?.map((section, index) => (
    <Section key={index} sectionId={section.id} />
  ));
  return <div className='p-11 box-border flex flex-col gap-16'>{sections}</div>;
};

const ExhibitionViewer = ({ exhibitionId }: { exhibitionId: string }) => {
  const {
    data: exhibitionData,
    error,
    loading,
  } = useGetExhibitionQuery({
    variables: { exhibitionId },
  });
  const exhibition: FlatExhibition | undefined =
    useSimplifiedQueryResponseData(exhibitionData)?.exhibition;
  const { canEditExhibition, loading: canEditExhibitionLoading } =
    useCanEditExhibition(exhibitionId);

  return (
    <ProtectedRoute
      canUse={!!exhibition && (canEditExhibition || (exhibition.is_published ?? false))}
      canUseLoading={canEditExhibitionLoading || loading}
    >
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else if (exhibition) {
          return (
            <ExhibitionStateViewer exhibition={exhibition}>
              <div className='flex justify-center'>
                <div className='flex flex-col max-w-screen-lg w-full min-w-screen-sm bg-white drop-shadow shadow-gray-700 text-xl'>
                  <Title />
                  <MainPart />
                </div>
              </div>
            </ExhibitionStateViewer>
          );
        } else {
          return <Redirect to={FALLBACK_PATH} />;
        }
      }}
    </ProtectedRoute>
  );
};

export default ExhibitionViewer;
