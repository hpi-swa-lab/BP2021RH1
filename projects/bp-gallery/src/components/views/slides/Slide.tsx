import { useGetSlideByIdQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture, FlatSlide } from '../../../types/additionalFlatTypes';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import './Slide.scss';

const Slide = ({ slideId }: { slideId: string }) => {
  const { data } = useGetSlideByIdQuery({
    variables: { slideId: slideId },
  });

  const slide: FlatSlide | undefined = useSimplifiedQueryResponseData(data)?.slide;
  const picture: FlatPicture | undefined = slide?.picture;

  if (picture) {
    switch (slide?.layout) {
      case 'picture':
        return (
          <div className='slide-container'>
            <div className='picture-container-full-width'>
              <PicturePreview picture={picture} onClick={() => {}} allowClicks={false} />
            </div>
          </div>
        );
      case 'side_by_side':
        return (
          <div className='slide-container'>
            <div className='picture-container'>
              <PicturePreview picture={picture} onClick={() => {}} allowClicks={false} />
            </div>
            <div className='text-container'>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        );
      case 'picture_with_caption':
        return (
          <div className='slide-container'>
            <div className='picture-container'>
              <PicturePreview picture={picture} onClick={() => {}} allowClicks={false} />
            </div>
            <div className='text-container'>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        );
      default:
        return <div></div>;
    }
  } else {
    return <div></div>;
  }
};

export default Slide;
