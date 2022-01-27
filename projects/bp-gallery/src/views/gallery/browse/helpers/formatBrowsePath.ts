export const encodeBrowsePathComponent = (folder: string): string => {
  return encodeURIComponent(folder.replace(/ /gm, '_'));
};

export const decodeBrowsePathComponent = (folder: string): string => {
  return decodeURIComponent(folder).replace(/_/gm, ' ');
};

export const formatBrowsePath = (
  previousPath?: string[],
  toCommunityView: boolean = false,
  newPathSegment: string = ''
) => {
  let browsePathBase = '/browse/';
  if (toCommunityView) {
    browsePathBase = '/browse/latest/';
  }

  let newPath = `${
    previousPath
      ?.map(pathSegment => {
        return encodeBrowsePathComponent(pathSegment);
      })
      .join('/') ?? ''
  }`;
  if (newPathSegment) {
    newPath = `${newPath}/${encodeBrowsePathComponent(newPathSegment)}`;
  }

  return `${browsePathBase}${newPath}`.replace(/\/+/gm, '/');
};
