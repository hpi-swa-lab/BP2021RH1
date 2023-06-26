import { MouseEventHandler, useCallback } from 'react';
import { useGetPictureInfoQuery } from '../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../graphql/queryUtils';
import { FlatPicture } from '../types/additionalFlatTypes';

export const useBlockImageContextMenu = (block: boolean | null | undefined) => {
  const onContextMenu: MouseEventHandler<HTMLImageElement> = useCallback(
    event => {
      // `undefined` means `block` isn't loaded yet, treat it as true
      if (block || block === undefined) {
        event.preventDefault();
      }
    },
    [block]
  );
  return onContextMenu;
};

export const useBlockImageContextMenuByPicture = (picture: FlatPicture | undefined) => {
  const block =
    picture && !picture.archive_tag ? false : picture?.archive_tag?.restrictImageDownloading;
  return useBlockImageContextMenu(block);
};

export const useBlockImageContextMenuByPictureId = (pictureId: string | null) => {
  const { data } = useGetPictureInfoQuery({
    variables: {
      pictureId: pictureId ?? '-1',
    },
  });
  const picture: FlatPicture | undefined = useSimplifiedQueryResponseData(data)?.picture;
  return useBlockImageContextMenuByPicture(picture);
};
