import {
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useUpdateLinkMutation,
} from '../../../../graphql/APIConnector';
import { LinkInfo } from '../ArchiveEditView';

const useLinks = (archiveId: string) => {
  const [createLink] = useCreateLinkMutation();
  const [updateLink] = useUpdateLinkMutation();
  const [deleteLink] = useDeleteLinkMutation();

  const simpleCreate = (link: LinkInfo) => {
    createLink({
      variables: {
        title: link.title ?? '',
        url: link.url,
        archive_tag: archiveId,
      },
    });
  };

  const simpleUpdate = (link: LinkInfo) => {
    updateLink({
      variables: {
        id: link.id,
        data: {
          title: link.title,
          url: link.url,
        },
      },
    });
  };

  const simpleDelete = (link: LinkInfo) => {
    deleteLink({
      variables: {
        id: link.id,
      },
    });
  };

  return { createLink: simpleCreate, updateLink: simpleUpdate, deleteLink: simpleDelete };
};

export const sanitizeLink = (url: string) => {
  url = url.replace(/^https?:\/\//, '');
  if (url.endsWith('/')) url = url.substring(0, url.length - 1);
  return url;
};

export default useLinks;
