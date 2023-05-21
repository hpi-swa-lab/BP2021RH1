import { OperationName } from 'bp-graphql/build';
import { useMemo } from 'react';
import {
  useCanRunAcceptCommentMutation,
  useCanRunBulkEditMutation,
  useCanRunCreateArchiveTagMutation,
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
  useCanRunUpdateArchiveMutation,
  useCanRunUpdateCollectionMutation,
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
