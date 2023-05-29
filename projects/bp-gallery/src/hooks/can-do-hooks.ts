import { OperationName } from 'bp-graphql/build';
import { useMemo } from 'react';
import { parseUserId } from '../components/views/admin/user/helper';
import {
  useCanRunAcceptCommentMutation,
  useCanRunAddArchiveTagMutation,
  useCanRunAddUserMutation,
  useCanRunBulkEditMutation,
  useCanRunChangePasswordMutation,
  useCanRunCreateSubCollectionMutation,
  useCanRunDeclineCommentMutation,
  useCanRunDeleteCollectionMutation,
  useCanRunGetAllArchiveTagsQuery,
  useCanRunGetAllKeywordTagsQuery,
  useCanRunGetAllLocationTagsQuery,
  useCanRunGetAllPersonTagsQuery,
  useCanRunGetCollectionInfoByIdQuery,
  useCanRunGetMultiplePictureInfoQuery,
  useCanRunGetParameterizedPermissionsQuery,
  useCanRunGetRootCollectionQuery,
  useCanRunGetUnverifiedCommentsQuery,
  useCanRunGetUsersPermissionsUserQuery,
  useCanRunGetUsersPermissionsUsersQuery,
  useCanRunMergeCollectionsMutation,
  useCanRunMultipleCreatePictureMutations,
  useCanRunMultipleUploadMutation,
  useCanRunRemoveArchiveTagMutation,
  useCanRunRemoveUploadMutation,
  useCanRunRemoveUserMutation,
  useCanRunUpdateArchiveMutation,
  useCanRunUpdateCollectionMutation,
  useCanRunUpdatePictureMutation,
  useCanRunUpdateUsersPermissionsUserMutation,
  useGetAllArchiveTagsQuery,
  useGetParameterizedPermissionsQuery,
} from '../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../graphql/queryUtils';
import { FlatArchiveTag, FlatParameterizedPermission } from '../types/additionalFlatTypes';
import { useAuth } from './context-hooks';

export const useHasPermissions = (permissionNames: OperationName[]) => {
  const { userId } = useAuth();

  const { data, loading } = useGetParameterizedPermissionsQuery({
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
  return { hasPermissions, loading };
};

export const useCanAddArchive = () => {
  const { canRun: canAddArchive, loading } = useCanRunAddArchiveTagMutation();
  return { canAddArchive, loading };
};

export const useCanRemoveArchive = (id: string) => {
  const { canRun: canRemoveArchive, loading } = useCanRunRemoveArchiveTagMutation({
    variables: {
      id,
    },
  });
  return { canRemoveArchive, loading };
};

export const useCanUseEditArchiveView = (id: string) => {
  const { canRun: canEditArchive, loading: canEditArchiveLoading } = useCanRunUpdateArchiveMutation(
    {
      variables: {
        archiveId: id,
      },
    }
  );
  const { canRemoveArchive, loading: canRemoveArchiveLoading } = useCanRemoveArchive(id);
  return {
    canUseEditArchiveView: canEditArchive || canRemoveArchive,
    loading: canEditArchiveLoading || canRemoveArchiveLoading,
  };
};

export const useCanUseSomeEditArchiveView = () => {
  const { hasPermissions: canEditSomeArchive, loading: canEditSomeArchiveLoading } =
    useHasPermissions(['updateArchive']);
  const { hasPermissions: canRemoveSomeArchive, loading: canRemoveSomeArchiveLoading } =
    useHasPermissions(['removeArchiveTag']);
  return {
    canUseSomeEditArchiveView: canEditSomeArchive || canRemoveSomeArchive,
    loading: canEditSomeArchiveLoading || canRemoveSomeArchiveLoading,
  };
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
  const { canUploadPicture, loading: canUploadPictureLoading } = useCanUploadPicture();
  const { canAddArchive, loading: canAddArchiveLoading } = useCanAddArchive();
  return {
    canUseUploadsView: canUploadPicture || canAddArchive,
    loading: canUploadPictureLoading || canAddArchiveLoading,
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
  const { hasPermissions: canBulkEditSomePictures, loading } = useHasPermissions([
    'getMultiplePictureInfo',
    'bulkEdit',
  ]);
  return { canBulkEditSomePictures, loading };
};

export const useCanEditSomePictures = () => {
  const { hasPermissions: canEditSomePictures, loading } = useHasPermissions(['updatePicture']);
  return { canEditSomePictures, loading };
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

export const useCanRemoveUser = (id: string | null | undefined) => {
  const { canRun: canRemoveUser, loading } = useCanRunRemoveUserMutation({
    variables: {
      id: id ?? undefined,
    },
  });
  return { canRemoveUser, loading };
};

export const useCanUpdateUsersPermissionsUser = (id: string | null | undefined) => {
  const { canRun: canUpdateUsersPermissionsUser, loading } =
    useCanRunUpdateUsersPermissionsUserMutation({
      variables: {
        id: id ?? undefined,
      },
    });
  return { canUpdateUsersPermissionsUser, loading };
};

export const useCanChangePassword = () => {
  const { canRun: canChangePassword, loading } = useCanRunChangePasswordMutation();
  return { canChangePassword, loading };
};

export const useCanChangePasswordForUser = (userId: string) => {
  const { isPublic, parsedUserId } = parseUserId(userId);
  const { userId: loggedInUserId, loading: authLoading } = useAuth();
  const { canChangePassword, loading: canChangePasswordLoading } = useCanChangePassword();
  return {
    canChangePassword: !isPublic && parsedUserId === loggedInUserId && canChangePassword,
    loading: authLoading || canChangePasswordLoading,
  };
};

export const useCanUsePermissionsView = (userId: string) => {
  const { parsedUserId, isPublic } = parseUserId(userId);

  const { canRun: canGetUsersPermissionsUser, loading: canGetUsersPermissionsUserLoading } =
    useCanRunGetUsersPermissionsUserQuery({
      variables: {
        id: parsedUserId ?? undefined,
      },
    });
  const { canRun: canGetParameterizedPermissions, loading: canGetParameterizedPermissionsLoading } =
    useCanRunGetParameterizedPermissionsQuery({
      variables: {
        userId,
      },
    });
  const { canRun: canGetAllArchiveTags, loading: canGetAllArchiveTagsLoading } =
    useCanRunGetAllArchiveTagsQuery();
  const { hasPermissions: canAddPermission, loading: canAddPermissionLoading } = useHasPermissions([
    'addPermission',
  ]);
  const { hasPermissions: canDeletePermission, loading: canDeletePermissionLoading } =
    useHasPermissions(['deleteParameterizedPermission']);
  return {
    canUsePermissionsView:
      (isPublic || canGetUsersPermissionsUser) &&
      canGetParameterizedPermissions &&
      canGetAllArchiveTags &&
      (canAddPermission || canDeletePermission),
    loading:
      canGetUsersPermissionsUserLoading ||
      canGetParameterizedPermissionsLoading ||
      canGetAllArchiveTagsLoading ||
      canAddPermissionLoading ||
      canDeletePermissionLoading,
  };
};

export const useCanUseUserView = (userId: string) => {
  const { parsedUserId, isPublic } = parseUserId(userId);

  const { canRun: canGetUsersPermissionsUser, loading: canGetUsersPermissionsUserLoading } =
    useCanRunGetUsersPermissionsUserQuery({
      variables: {
        id: parsedUserId ?? undefined,
      },
    });

  return {
    canUseUserView: isPublic || canGetUsersPermissionsUser,
    loading: canGetUsersPermissionsUserLoading,
  };
};

export const useCanAddUser = () => {
  const { canRun: canAddUser, loading } = useCanRunAddUserMutation();
  return { canAddUser, loading };
};

export const useCanUseUsersView = () => {
  const { canRun: canGetUsersPermissionsUsers, loading: canGetUsersPermissionsUsersLoading } =
    useCanRunGetUsersPermissionsUsersQuery();
  return {
    canUseUsersView: canGetUsersPermissionsUsers,
    loading: canGetUsersPermissionsUsersLoading,
  };
};

export const useCanUseArchivesView = () => {
  const { canRun: canGetAllArchiveTags, loading: canGetAllArchiveTagsLoading } =
    useCanRunGetAllArchiveTagsQuery();
  const { canUseSomeEditArchiveView, loading: canUseSomeEditArchiveViewLoading } =
    useCanUseSomeEditArchiveView();
  const { canAddArchive, loading: canAddArchiveLoading } = useCanAddArchive();

  return {
    canUseArchivesView: canGetAllArchiveTags && (canUseSomeEditArchiveView || canAddArchive),
    loading:
      canGetAllArchiveTagsLoading || canUseSomeEditArchiveViewLoading || canAddArchiveLoading,
  };
};

export const useCanUseAdminView = () => {
  const { canUseUsersView, loading: canUseUsersViewLoading } = useCanUseUsersView();
  const { canUseArchivesView, loading: canUseArchivesViewLoading } = useCanUseArchivesView();
  return {
    canUseAdminView: canUseUsersView || canUseArchivesView,
    loading: canUseUsersViewLoading || canUseArchivesViewLoading,
    canUseUsersView,
    canUseUsersViewLoading,
    canUseArchivesView,
    canUseArchivesViewLoading,
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
  const { canEditSomePictures, loading: canEditSomePicturesLoading } = useCanEditSomePictures();
  const { canBulkEditSomePictures, loading: canBulkEditSomePicturesLoading } =
    useCanBulkEditSomePictures();

  return {
    needsClipboard: canEditSomePictures || canBulkEditSomePictures,
    loading: canEditSomePicturesLoading || canBulkEditSomePicturesLoading,
  };
};
