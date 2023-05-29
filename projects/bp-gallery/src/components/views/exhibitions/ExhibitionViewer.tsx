import { useContext } from 'react';
import { useGetExhibitionQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatExhibition } from '../../../types/additionalFlatTypes';
import { ExhibitionGetContext, ExhibitionStateViewer } from './ExhibitonUtils';
import { getPictureLinkFromFlatPicture } from '../../../hooks/get-pictureLink.hook';
import RichText from '../../common/RichText';
import PictureGrid from '../../common/picture-gallery/PictureGrid';

const Title = () => {
  const { getTitlePicture, getTitle, getIntroduction } = useContext(ExhibitionGetContext);
  const titlePicture = getTitlePicture()?.picture;
  const titlePictureLink = getPictureLinkFromFlatPicture(titlePicture);
  return (
    <div className='flex-1'>
      <div
        style={{ backgroundImage: `url(${titlePictureLink})` }}
        className='h-[40rem] bg-cover bg-center relative'
      >
        <div className='absolute bottom-0 w-full bg-white/60 shadow-inner dropbackdrop-contrast-125 flex flex-col gap-4 p-11 box-border'>
          <div className='text-6xl font-bold'>{getTitle()}</div>
          <RichText value={getIntroduction()} />
        </div>
      </div>
    </div>
  );
};

const Section = ({ sectionId }: { sectionId: string }) => {
  const { getSection } = useContext(ExhibitionGetContext);
  const mySection = getSection(sectionId);
  return (
    <>
      {mySection && (
        <div className='flex flex-col gap-4 p-11 box-border'>
          <div className='text-4xl font-semibold'>{mySection.title}</div>
          <RichText value={mySection.text} />
          <div className='flex flex-row gap-4 flex-wrap justify-center'>
            {/* {mySection.dragElements.map((drag, index) => (
              <div key={index} className='w-max'>
                <PicturePreview picture={drag.picture} height='15rem' onClick={() => {}} />
              </div>
            ))} */}
            {
              <PictureGrid
                pictures={mySection.dragElements.map(drag => drag.picture)}
                hashBase='249'
                loading={false}
                refetch={() => {}}
              />
            }
          </div>
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
  return <>{sections}</>;
};

const ExhibitionViewer = ({ exhibitionId }: { exhibitionId: string }) => {
  const { data: exhibitionData } = useGetExhibitionQuery({
    variables: { exhibitionId },
  });
  const exhibition: FlatExhibition | undefined =
    useSimplifiedQueryResponseData(exhibitionData)?.exhibition;

  return (
    exhibition &&
    exhibition.is_published && (
      <ExhibitionStateViewer exhibition={exhibition}>
        <div className='flex justify-center'>
          <div className='flex flex-col max-w-screen-lg w-full min-w-screen-sm bg-white drop-shadow shadow-gray-700'>
            <Title />
            <MainPart />
          </div>
        </div>
      </ExhibitionStateViewer>
    )
  );
};

export default ExhibitionViewer;
