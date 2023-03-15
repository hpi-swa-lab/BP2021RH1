import GeoMap from './GeoMap';
import './GeoView.scss';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asApiPath } from '../../../helpers/app-helpers';
import ZoomWrapper from '../picture/overlay/ZoomWrapper';
import { useState } from 'react';

const GeoView = () => {
  const [pictureId, setPictureId] = useState<string>('70');
  const { data } = useGetPictureInfoQuery({ variables: { pictureId } });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  const pictureLink = picture?.media?.url
    ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
    : '';
  return (
    <div className='guess-picture-view'>
      <ZoomWrapper blockScroll={true} pictureId={picture?.id ?? ''}>
        <div className='picture-wrapper'>
          <div className='picture-container'>
            <img src={pictureLink} alt={pictureLink} />
          </div>
        </div>
      </ZoomWrapper>
      <GeoMap onNextPicture={() => {}} pictureId={pictureId} />
    </div>
  );
};

export default GeoView;
