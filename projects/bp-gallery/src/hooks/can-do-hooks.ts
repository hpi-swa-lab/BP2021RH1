import { useMemo } from 'react';
import { parseUserId } from '../components/views/admin/user/helper';
import {
  useCanRunAcceptCommentMutation,
  useCanRunAddArchiveTagMutation,
  useCanRunAddPermissionMutation,
  useCanRunAddUserMutation,
  useCanRunBulkEditMutation,
  useCanRunChangePasswordMutation,
  useCanRunCreatePictureSequenceMutation,
  useCanRunCreateSubCollectionMutation,
  useCanRunDeclineCommentMutation,
  useCanRunDeleteCollectionMutation,
  useCanRunDeleteParameterizedPermissionMutation,
  useCanRunForgotPasswordMutation,
  useCanRunGetAllArchiveTagsQuery,
  useCanRunGetAllKeywordTagsQuery,
  useCanRunGetAllLocationTagsQuery,
  useCanRunGetAllPersonTagsQuery,
  useCanRunGetCollectionInfoByIdQuery,
  useCanRunGetMultiplePictureInfoQuery,
  useCanRunGetParameterizedPermissionsQuery,
  useCanRunGetRootCollectionQuery,
  useCanRunGetUnverifiedCommentsQuery,
  useCanRunGetUserQuery,
  useCanRunGetUsersQuery,
  useCanRunMergeCollectionsMutation,
  useCanRunMultipleCreatePictureMutations,
  useCanRunMultipleRemoveArchiveTagMutations,
  useCanRunMultipleUpdateArchiveMutations,
  useCanRunMultipleUpdateExhibitionMutations,
  useCanRunMultipleUpdatePictureSequenceDataMutations,
  useCanRunMultipleUploadMutation,
  useCanRunRemoveArchiveTagMutation,
  useCanRunRemoveUploadMutation,
  useCanRunRemoveUserMutation,
  useCanRunUpdateArchiveMutation,
  useCanRunUpdateCollectionMutation,
  useCanRunUpdateCollectionParentsMutation,
  useCanRunUpdateExhibitionMutation,
  useCanRunUpdatePictureMutation,
  useCanRunUpdateUserMutation,
  useGetAllArchiveTagsQuery,
} from '../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../graphql/queryUtils';
import { FlatArchiveTag } from '../types/additionalFlatTypes';
import { useAuth } from './context-hooks';

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

export const useCanUseMultipleEditArchiveViews = () => {
  const { data, loading: archivesLoading } = useGetAllArchiveTagsQuery();
  const archives: FlatArchiveTag[] | undefined = useSimplifiedQueryResponseData(data)?.archiveTags;
  const { canRunMultiple: canEditMultipleArchives, loading: canEditMultipleArchivesLoading } =
    useCanRunMultipleUpdateArchiveMutations({
      variableSets:
        archives?.map(archive => ({
          archiveId: archive.id,
        })) ?? [],
    });
  const { canRunMultiple: canRemoveMultipleArchives, loading: canRemoveMultipleArchivesLoading } =
    useCanRunMultipleRemoveArchiveTagMutations({
      variableSets:
        archives?.map(archive => ({
          id: archive.id,
        })) ?? [],
    });
  const canUseMultipleEditArchiveViews = useMemo(
    () =>
      Object.fromEntries(
        archives?.map((archive, index) => [
          archive.id,
          (canEditMultipleArchives[index] ?? false) || (canRemoveMultipleArchives[index] ?? false),
        ]) ?? []
      ),
    [archives, canEditMultipleArchives, canRemoveMultipleArchives]
  );
  return {
    canUseMultipleEditArchiveViews,
    loading: archivesLoading || canEditMultipleArchivesLoading || canRemoveMultipleArchivesLoading,
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

export const useCanCreatePictureSequence = (pictureIds: string[] | undefined) => {
  const { canRun: canCreatePictureSequence, loading: canCreatePictureSequenceLoading } =
    useCanRunCreatePictureSequenceMutation({
      variables: {
        pictures: pictureIds ?? [],
      },
    });
  const {
    canRunMultiple: canUpdateMultiplePictureSequenceData,
    loading: canUpdateMultiplePictureSequenceDataLoading,
  } = useCanRunMultipleUpdatePictureSequenceDataMutations({
    variableSets:
      pictureIds?.map(pictureId => ({
        pictureId,
      })) ?? [],
  });
  const canUpdatePictureSequenceData = canUpdateMultiplePictureSequenceData.every(can => can);
  return {
    canCreatePictureSequence: canCreatePictureSequence && canUpdatePictureSequenceData,
    loading: canCreatePictureSequenceLoading || canUpdateMultiplePictureSequenceDataLoading,
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
  const { canRun: canGetSomeMultiplePictures, loading: canGetSomeMultiplePicturesLoading } =
    useCanRunGetMultiplePictureInfoQuery({
      withSomeVariables: true,
    });
  const { canRun: canBulkEditSomePictures, loading: canBulkEditSomePicturesLoading } =
    useCanRunBulkEditMutation({
      withSomeVariables: true,
    });
  return {
    canBulkEditSomePictures: canGetSomeMultiplePictures && canBulkEditSomePictures,
    loading: canGetSomeMultiplePicturesLoading || canBulkEditSomePicturesLoading,
  };
};

export const useCanEditSomePictures = () => {
  const { canRun: canEditSomePictures, loading } = useCanRunUpdatePictureMutation({
    withSomeVariables: true,
  });
  return { canEditSomePictures, loading };
};

export const useCanUseCollectionCuratingView = () => {
  const { canRun: canGetRootCollection, loading: canGetRootCollectionLoading } =
    useCanRunGetRootCollectionQuery();
  const { canRun: canGetCollectionInfoById, loading: canGetCollectionInfoByIdLoading } =
    useCanRunGetCollectionInfoByIdQuery();

  const { canRun: canUpdateCollection, loading: canUpdateCollectionLoading } =
    useCanRunUpdateCollectionMutation();
  const { canRun: canUpdateCollectionParents, loading: canUpdateCollectionParentsLoading } =
    useCanRunUpdateCollectionParentsMutation();
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
      (canUpdateCollection ||
        canUpdateCollectionParents ||
        canDeleteCollection ||
        canMergeCollections ||
        canCreateSubCollection),
    loading:
      canGetRootCollectionLoading ||
      canGetCollectionInfoByIdLoading ||
      canUpdateCollectionLoading ||
      canUpdateCollectionParentsLoading ||
      canDeleteCollectionLoading ||
      canMergeCollectionsLoading ||
      canCreateSubCollectionLoading,
  };
};

export const useCanEditExhibition = (id: string | null | undefined) => {
  // Use updateExhibitionMutation as a representative for all mutations
  // used in exhibition editing, since they all ultimately check the
  // exhibition that is edited, but take ids for other entities such as
  // ExhibitionPicture, which aren't available here.
  const { canRun: canEditExhibition, loading } = useCanRunUpdateExhibitionMutation({
    variables: {
      id: id ?? undefined,
    },
  });
  return { canEditExhibition, loading };
};

export const useCanEditMultipleExhibitions = (ids: (string | null | undefined)[]) => {
  // same as in useCanEditExhibition
  const { canRunMultiple: canEditExhibitions, loading } =
    useCanRunMultipleUpdateExhibitionMutations({
      variableSets: ids.map(id => ({ id: id ?? undefined })),
    });
  return {
    canEditExhibitions,
    loading,
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

export const useCanUpdateUser = (id: string | null | undefined) => {
  const { canRun: canUpdateUser, loading } = useCanRunUpdateUserMutation({
    variables: {
      id: id ?? undefined,
    },
  });
  return { canUpdateUser, loading };
};

export const useCanUseForgotPasswordView = () => {
  const { canRun: canUseForgotPasswordView, loading } = useCanRunForgotPasswordMutation();
  return { canUseForgotPasswordView, loading };
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

  const { canRun: canGetUser, loading: canGetUserLoading } = useCanRunGetUserQuery({
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
  const { canRun: canAddPermission, loading: canAddPermissionLoading } =
    useCanRunAddPermissionMutation({
      withSomeVariables: true,
    });
  const { canRun: canDeletePermission, loading: canDeletePermissionLoading } =
    useCanRunDeleteParameterizedPermissionMutation({
      withSomeVariables: true,
    });
  return {
    canUsePermissionsView:
      (isPublic || canGetUser) &&
      canGetParameterizedPermissions &&
      canGetAllArchiveTags &&
      (canAddPermission || canDeletePermission),
    loading:
      canGetUserLoading ||
      canGetParameterizedPermissionsLoading ||
      canGetAllArchiveTagsLoading ||
      canAddPermissionLoading ||
      canDeletePermissionLoading,
  };
};

export const useCanUseUserByIdView = (userId: string) => {
  const { parsedUserId, isPublic } = parseUserId(userId);

  const { canRun: canGetUser, loading: canGetUsersLoading } = useCanRunGetUserQuery({
    variables: {
      id: parsedUserId ?? undefined,
    },
  });

  return {
    canUseUserView: isPublic || canGetUser,
    loading: canGetUsersLoading,
  };
};

export const useCanUseMyAccountView = () => {
  const { userId, loading } = useAuth();
  return {
    canUseMyAccountView: !!userId,
    loading,
  };
};

export const useCanAddUser = () => {
  const { canRun: canAddUser, loading } = useCanRunAddUserMutation();
  return { canAddUser, loading };
};

export const useCanUseUsersView = () => {
  const { canRun: canGetUsers, loading: canGetLoading } = useCanRunGetUsersQuery();
  return {
    canUseUsersView: canGetUsers,
    loading: canGetLoading,
  };
};

export const useCanUseArchivesView = () => {
  const { canUseMultipleEditArchiveViews, loading: canUseMultipleEditArchiveViewsLoading } =
    useCanUseMultipleEditArchiveViews();
  const { canAddArchive, loading: canAddArchiveLoading } = useCanAddArchive();

  const canUseSomeEditArchiveView =
    !canUseMultipleEditArchiveViewsLoading &&
    Object.values(canUseMultipleEditArchiveViews).some(can => can);

  return {
    canUseArchivesView: canUseSomeEditArchiveView || canAddArchive,
    canUseMultipleEditArchiveViews,
    loading: canUseMultipleEditArchiveViewsLoading || canAddArchiveLoading,
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
