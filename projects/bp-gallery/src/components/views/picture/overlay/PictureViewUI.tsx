import PictureNavigationButtons from './PictureNavigationButtons';
import { PictureToolbar } from './PictureToolbar';
import { PresentationModeButton } from './PresentationModeButton';

export const PictureViewUI = ({
  calledViaLink,
  pictureId,
  sessionId,
}: {
  calledViaLink: boolean;
  pictureId: string;
  sessionId: string;
}) => {
  return (
    <div className='picture-ui'>
      <PictureNavigationButtons />
      <PictureToolbar calledViaLink={calledViaLink} />
      <PresentationModeButton pictureId={pictureId} sessionId={sessionId} />
    </div>
  );
};

export default PictureViewUI;
