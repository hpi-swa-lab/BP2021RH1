import GeoMap from './GeoMap';
import './GeoView.scss';
import { useGetAllArchiveTagsQuery, useGetPictureInfoQuery } from '../../../graphql/APIConnector';
import { FlatArchiveTag, FlatPicture } from '../../../types/additionalFlatTypes';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asApiPath } from '../../../helpers/app-helpers';
import ZoomWrapper from '../picture/overlay/ZoomWrapper';
import { useState } from 'react';

const getAllPictureIds = (archives: FlatArchiveTag[]) => {
  //let list = archives.reduce((elem, curr) => elem.pictures?.reduce(elem, curr => ))
  for (let archive in archives) {
  }
};
const GeoView = () => {
  const [pictureId, setPictureId] = useState<string>('70');
  let archive_data = useGetAllArchiveTagsQuery().data;
  const archives: FlatArchiveTag[] | undefined =
    useSimplifiedQueryResponseData(archive_data)?.archiveTags;
  let { data } = useGetPictureInfoQuery({ variables: { pictureId: '70' } });
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
