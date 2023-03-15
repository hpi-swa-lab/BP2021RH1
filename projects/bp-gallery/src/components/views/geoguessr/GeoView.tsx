import GeoMap from './GeoMap';
import './GeoView.scss';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asApiPath } from '../../../helpers/app-helpers';

const GeoView = () => {
  const { data } = useGetPictureInfoQuery({ variables: { pictureId: '70' } });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  const pictureLink = picture?.media?.url
    ? asApiPath(`${picture.media.url}?updatedAt=${picture.media.updatedAt as string}`)
    : '';
  return (
    <div className='map-container'>
      <img src={pictureLink} />
      <GeoMap />
    </div>
  );
};

export default GeoView;
