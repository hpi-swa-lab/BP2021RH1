import { useContext, useState } from 'react';
import { useGetExhibitionQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatExhibition } from '../../../types/additionalFlatTypes';
import { ExhibitionGetContext, ExhibitionStateViewer } from './ExhibitonUtils';
import { getPictureLinkFromFlatPicture } from '../../../hooks/get-pictureLink.hook';
import RichText from '../../common/RichText';
import { root } from '../../../helpers/app-helpers';
import { Portal } from '@mui/material';
import PictureView from '../picture/PictureView';
import { pushHistoryWithoutRouter } from '../../../helpers/history';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import { useTranslation } from 'react-i18next';

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
  const [focusedPicture, setFocusedPicture] = useState<string | undefined>(undefined);

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
          <div className='flex flex-row gap-4 flex-wrap justify-center'>
            {mySection.dragElements.map((drag, index) => (
              <div key={index} className='w-max'>
                <PicturePreview
                  picture={drag.picture}
                  height='15rem'
                  onClick={() => {
                    setFocusedPicture(drag.picture.id);
                    pushHistoryWithoutRouter(`/picture/${drag.picture.id}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const EndCard = () => {
  const { t } = useTranslation();
  const { getEpilog, getSources } = useContext(ExhibitionGetContext);
  return (
    <div className='p-11 box-border gap-4 flex flex-col'>
      {getEpilog() && (
        <div className='flex flex-col gap-4'>
          <div className='text-4xl font-semibold'>{t('exhibition.viewer.epilog')}</div>
          <RichText value={getEpilog() ?? ''} />
        </div>
      )}
      {getSources() && (
        <div>
          <div className='text-4xl font-semibold'>{t('exhibition.viewer.sources')}</div>
          <ul>
            {getSources()?.map(
              (source, key) => source.source && <li key={key}>{source.source}</li>
            )}
          </ul>
        </div>
      )}
    </div>
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
          <div className='flex flex-col max-w-screen-lg w-full min-w-screen-sm bg-white drop-shadow shadow-gray-700 text-xl'>
            <Title />
            <MainPart />
            <EndCard />
          </div>
        </div>
      </ExhibitionStateViewer>
    )
  );
};

export default ExhibitionViewer;