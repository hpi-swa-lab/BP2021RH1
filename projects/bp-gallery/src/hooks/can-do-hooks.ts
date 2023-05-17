import {
  useCanRunMultipleCreatePictureMutations,
  useCanRunUpdateArchiveMutation,
  useGetAllArchiveTagsQuery,
} from '../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../graphql/queryUtils';
import { FlatArchiveTag } from '../types/additionalFlatTypes';

export const useCanEditArchive = (id: string) => {
  const { canRun: canEditArchive, loading } = useCanRunUpdateArchiveMutation({
    variables: {
      archiveId: id,
    },
  });
  return { canEditArchive, loading };
};

export const useCanUploadPicture = () => {
  const { data: archivesData } = useGetAllArchiveTagsQuery();
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

  return canCreatePicturePerArchive.some(can => can);
};
