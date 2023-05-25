import { OperationName } from 'bp-graphql/build';
import { useMemo } from 'react';
import {
  useCanRunAcceptCommentMutation,
  useCanRunAddArchiveTagMutation,
  useCanRunBulkEditMutation,
  useCanRunCreateSubCollectionMutation,
  useCanRunDeclineCommentMutation,
  useCanRunDeleteCollectionMutation,
  useCanRunGetAllKeywordTagsQuery,
  useCanRunGetAllLocationTagsQuery,
  useCanRunGetAllPersonTagsQuery,
  useCanRunGetCollectionInfoByIdQuery,
  useCanRunGetMultiplePictureInfoQuery,
  useCanRunGetRootCollectionQuery,
  useCanRunGetUnverifiedCommentsQuery,
  useCanRunMergeCollectionsMutation,
  useCanRunMultipleCreatePictureMutations,
  useCanRunMultipleUploadMutation,
  useCanRunRemoveUploadMutation,
  useCanRunUpdateArchiveMutation,
  useCanRunUpdateCollectionMutation,
  useCanRunUpdatePictureMutation,
  useGetAllArchiveTagsQuery,
  useGetParameterizedPermissionsQuery,
} from '../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../graphql/queryUtils';
import { FlatArchiveTag, FlatParameterizedPermission } from '../types/additionalFlatTypes';
import { useAuth } from './context-hooks';

export const useHasPermissions = (permissionNames: OperationName[]) => {
  const { userId } = useAuth();
  const { data } = useGetParameterizedPermissionsQuery({
    variables: {
      userId: userId ?? null,
    },
  });
  const permissions: FlatParameterizedPermission[] | undefined =
    useSimplifiedQueryResponseData(data)?.parameterizedPermissions;
  const permissionsSet = useMemo(
    () =>
      new Set(
        permissions
          ?.map(permission => permission.operation_name)
          .filter((name): name is string => !!name) ?? []
      ),
    [permissions]
  );
  const hasPermissions = useMemo(
    () => permissionNames.every(name => permissionsSet.has(name)),
    [permissionNames, permissionsSet]
  );
  return hasPermissions;
};

export const useCanAddArchive = () => {
  const { canRun, loading } = useCanRunAddArchiveTagMutation();
  return { canAddArchive: canRun, loading };
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
  const { data: archivesData, loading: archivesLoading } = useGetAllArchiveTagsQuery();
  const archives: FlatArchiveTag[] | undefined =
    useSimplifiedQueryResponseData(archivesData)?.archiveTags;

  const { canRun: canUpload, loading: canUploadLoading } = useCanRunMultipleUploadMutation();

  const { canRunMultiple: canCreatePicturePerArchive, loading: canCreatePicturePerArchiveLoading } =
    useCanRunMultipleCreatePictureMutations({
      variableSets:
        archives?.map(archive => ({
          data: {
            archive_tag: archive.id,
          },
        })) ?? [],
    });

  return {
    canUploadPicture: canUpload && canCreatePicturePerArchive.some(can => can),
    loading: archivesLoading || canUploadLoading || canCreatePicturePerArchiveLoading,
  };
};

export const useCanEditPicture = (pictureId: string, mediaId: string) => {
  const { canRun: canUpload, loading: canUploadLoading } = useCanRunMultipleUploadMutation();
  const { canRun: canUpdatePicture, loading: canUpdatePictureLoading } =
    useCanRunUpdatePictureMutation({
      variables: {
        pictureId,
      },
    });
  const { canRun: canRemoveUpload, loading: canRemoveUploadLoading } =
    useCanRunRemoveUploadMutation({
      variables: {
        id: mediaId,
      },
    });
  return {
    canEditPicture: canUpload && canUpdatePicture && canRemoveUpload,
    loading: canUploadLoading || canUpdatePictureLoading || canRemoveUploadLoading,
  };
};

export const useCanUseUploadsView = () => {
  const { canAddArchive, loading: canAddArchiveLoading } = useCanAddArchive();
  const { canUploadPicture, loading: canUploadPictureLoading } = useCanUploadPicture();
  return {
    canUseUploadsView: canAddArchive || canUploadPicture,
    loading: canAddArchiveLoading || canUploadPictureLoading,
    canAddArchive,
    canAddArchiveLoading,
    canUploadPicture,
    canUploadPictureLoading,
  };
};

// in the TagTableView hooks, don't rename canRun since they are used in useGenericTagEndpoints

export const useCanUsePersonTagTableView = () => {
  return useCanRunGetAllPersonTagsQuery();
};

export const useCanUseLocationTagTableView = () => {
  return useCanRunGetAllLocationTagsQuery();
};

export const useCanUseKeywordTagTableView = () => {
  return useCanRunGetAllKeywordTagsQuery();
};

export const useCanUseUnverifiedCommentsView = () => {
  const { canRun: canUseUnverifiedCommentsView, loading } = useCanRunGetUnverifiedCommentsQuery();
  return {
    canUseUnverifiedCommentsView,
    loading,
  };
};

export const useCanUseBulkEditView = (pictureIds: string[]) => {
  const { canRun: canRunGetMultiplePictureInfo, loading: canRunGetMultiplePictureInfoLoading } =
    useCanRunGetMultiplePictureInfoQuery({
      variables: {
        pictureIds,
      },
    });
  const { canRun: canRunBulkEdit, loading: canRunBulkEditLoading } = useCanRunBulkEditMutation({
    variables: {
      pictureIds,
    },
  });
  return {
    canUseBulkEditView: canRunGetMultiplePictureInfo && canRunBulkEdit,
    loading: canRunGetMultiplePictureInfoLoading || canRunBulkEditLoading,
  };
};

export const useCanBulkEditSomePictures = () => {
  return useHasPermissions(['getMultiplePictureInfo', 'bulkEdit']);
};

export const useCanEditSomePictures = () => {
  return useHasPermissions(['updatePicture']);
};

export const useCanUseCollectionCuratingView = () => {
  const { canRun: canGetRootCollection, loading: canGetRootCollectionLoading } =
    useCanRunGetRootCollectionQuery();
  const { canRun: canGetCollectionInfoById, loading: canGetCollectionInfoByIdLoading } =
    useCanRunGetCollectionInfoByIdQuery();

  const { canRun: canUpdateCollection, loading: canUpdateCollectionLoading } =
    useCanRunUpdateCollectionMutation();
  const { canRun: canDeleteCollection, loading: canDeleteCollectionLoading } =
    useCanRunDeleteCollectionMutation();
  const { canRun: canMergeCollections, loading: canMergeCollectionsLoading } =
    useCanRunMergeCollectionsMutation();
  const { canRun: canCreateSubCollection, loading: canCreateSubCollectionLoading } =
    useCanRunCreateSubCollectionMutation();

  return {
    canUseCollectionCuratingView:
      canGetRootCollection &&
      canGetCollectionInfoById &&
      (canUpdateCollection || canDeleteCollection || canMergeCollections || canCreateSubCollection),
    loading:
      canGetRootCollectionLoading ||
      canGetCollectionInfoByIdLoading ||
      canUpdateCollectionLoading ||
      canDeleteCollectionLoading ||
      canMergeCollectionsLoading ||
      canCreateSubCollectionLoading,
  };
};

export const useCanAcceptOrDeclineComment = (commentId: string | undefined) => {
  const { canRun: canAcceptComment, loading: canAcceptCommentLoading } =
    useCanRunAcceptCommentMutation({
      variables: {
        commentId: commentId,
      },
    });
  const { canRun: canDeclineComment, loading: canDeclineCommentLoading } =
    useCanRunDeclineCommentMutation({
      variables: {
        commentId: commentId,
      },
    });
  return {
    canAcceptOrDeclineComment: canAcceptComment || canDeclineComment,
    loading: canAcceptCommentLoading || canDeclineCommentLoading,
    canAcceptComment,
    canAcceptCommentLoading,
    canDeclineComment,
    canDeclineCommentLoading,
  };
};

export const useNeedsClipboard = () => {
  // for LinkedInfoField
  const canEditSomePictures = useCanEditSomePictures();
  const canBulkEditSomePictures = useCanBulkEditSomePictures();

  return canEditSomePictures || canBulkEditSomePictures;
};
