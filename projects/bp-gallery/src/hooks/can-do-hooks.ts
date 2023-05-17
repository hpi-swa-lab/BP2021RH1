import {
  useCanRunCreateArchiveTagMutation,
  useCanRunMultipleCreatePictureMutations,
  useCanRunUpdateArchiveMutation,
  useGetAllArchiveTagsQuery,
} from '../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../graphql/queryUtils';
import { FlatArchiveTag } from '../types/additionalFlatTypes';

export const useCanCreateArchive = () => {
  const { canRun, loading } = useCanRunCreateArchiveTagMutation();
  return { canCreateArchive: canRun, loading };
};

export const useCanEditArchive = (id: string) => {
  const { canRun: canEditArchive, loading } = useCanRunUpdateArchiveMutation({
    variables: {
      archiveId: id,
    },
  });
  return { canEditArchive, loading };
};

export const useCanUploadPicture = () => {
  const { data: archivesData, loading } = useGetAllArchiveTagsQuery();
  const archives: FlatArchiveTag[] | undefined =
    useSimplifiedQueryResponseData(archivesData)?.archiveTags;

  const { canRunMultiple: canCreatePicturePerArchive } = useCanRunMultipleCreatePictureMutations({
    variableSets:
      archives?.map(archive => ({
        data: {
          archive_tag: archive.id,
        },
      })) ?? [],
  });

  return { canUploadPicture: canCreatePicturePerArchive.some(can => can), loading };
};

export const useCanUseUploadsView = () => {
  const { canCreateArchive, loading: canCreateArchiveLoading } = useCanCreateArchive();
  const { canUploadPicture, loading: canUploadPictureLoading } = useCanUploadPicture();
  return {
    canUseUploadsView: canCreateArchive || canUploadPicture,
    loading: canCreateArchiveLoading || canUploadPictureLoading,
    canCreateArchive,
    canCreateArchiveLoading,
    canUploadPicture,
    canUploadPictureLoading,
  };
};
