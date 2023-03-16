import { useCallback, useMemo } from 'react';
import {
  useGetSlideByIdQuery,
  useUpdateSlideTitleAndDescriptionMutation,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture, FlatSlide } from '../../../types/additionalFlatTypes';
import TextEditor from '../../common/editors/TextEditor';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import RichText from '../../common/RichText';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import './Slide.scss';

const Slide = ({ slideId }: { slideId: string }) => {
  const { data } = useGetSlideByIdQuery({
    variables: { slideId: slideId },
  });

  const { role } = useAuth();

  const slide: FlatSlide | undefined = useSimplifiedQueryResponseData(data)?.slide;
  const picture: FlatPicture | undefined = slide?.picture;

  const extraOptions = useMemo(
    () => ({
      readonly: false,
      showPlaceholder: true,
      placeholder: 'Platzhalter',
    }),
    []
  );

  const [updateSlide] = useUpdateSlideTitleAndDescriptionMutation();

  const onBlurTitle = useCallback(
    (newTitle: string) => {
      updateSlide({
        variables: {
          slideId: slideId,
          title: newTitle,
          description: slide?.description ?? '',
        },
      });
    },
    [slideId, updateSlide, slide?.description]
  );

  const onBlurDescription = useCallback(
    (newDescription: string) => {
      updateSlide({
        variables: {
          slideId: slideId,
          title: slide?.title ?? '',
          description: newDescription,
        },
      });
    },
    [slideId, updateSlide, slide?.title]
  );

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
              {role >= AuthRole.CURATOR ? (
                <h2>
                  <TextEditor
                    value={slide.title && slide.title.length > 0 ? slide.title : 'Platzhalter'}
                    extraOptions={extraOptions}
                    onBlur={onBlurTitle}
                    onChange={newText => {
                      slide.title = newText;
                    }}
                  />
                </h2>
              ) : (
                <h2>
                  <RichText
                    value={slide.title && slide.title.length > 0 ? slide.title : 'Platzhalter'}
                  />
                </h2>
              )}
              {role >= AuthRole.CURATOR ? (
                <TextEditor
                  value={slide.description ?? ''}
                  extraOptions={extraOptions}
                  onBlur={onBlurDescription}
                  onChange={newText => {
                    slide.description = newText;
                  }}
                />
              ) : (
                <RichText value={slide.description ?? ''} />
              )}
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
