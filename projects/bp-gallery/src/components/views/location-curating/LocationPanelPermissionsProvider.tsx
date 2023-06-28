import { ContextType, PropsWithChildren, useMemo } from 'react';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { TagType } from '../../../types/additionalFlatTypes';
import { LocationPanelPermissionsContext } from './LocationPanelPermissionsContext';

// hoist these queries into a context to reduce the load on the batch link
// and thus improve performance
export const LocationPanelPermissionsProvider = ({ children }: PropsWithChildren<{}>) => {
  const {
    canUseTagTableViewQuery,
    canGetAllTagsQuery,
    canUpdateTagNameQuery,
    canUpdateSynonymsQuery,
    canUpdateVisibilityQuery,
    canUpdateTagParentQuery,
    canUpdateTagAcceptanceQuery,
    canUpdateTagChildQuery,
    canUpdateRootQuery,
    canMergeTagsQuery,
    canDeleteTagQuery,
    canCreateTagQuery,
  } = useGenericTagEndpoints(TagType.LOCATION);
  const { canRun: canUseTagTableView } = canUseTagTableViewQuery();
  const { canRun: canGetAllTags } = canGetAllTagsQuery();
  const { canRun: canUpdateTagName } = canUpdateTagNameQuery();
  const { canRun: canUpdateSynonyms } = canUpdateSynonymsQuery();
  const { canRun: canUpdateVisibility } = canUpdateVisibilityQuery();
  const { canRun: canUpdateTagParent } = canUpdateTagParentQuery();
  const { canRun: canUpdateTagAcceptance } = canUpdateTagAcceptanceQuery();
  const { canRun: canUpdateTagChild } = canUpdateTagChildQuery();
  const { canRun: canUpdateRoot } = canUpdateRootQuery();
  const { canRun: canMergeTags } = canMergeTagsQuery();
  const { canRun: canDeleteTag } = canDeleteTagQuery();
  const { canRun: canCreateTag } = canCreateTagQuery();

  const value = useMemo<ContextType<typeof LocationPanelPermissionsContext>>(
    () => ({
      canUseTagTableView,
      canGetAllTags,
      canUpdateTagName,
      canUpdateSynonyms,
      canUpdateVisibility,
      canUpdateTagParent,
      canUpdateTagAcceptance,
      canUpdateTagChild,
      canUpdateRoot,
      canMergeTags,
      canDeleteTag,
      canCreateTag,
    }),
    [
      canUseTagTableView,
      canGetAllTags,
      canUpdateTagName,
      canUpdateSynonyms,
      canUpdateVisibility,
      canUpdateTagParent,
      canUpdateTagAcceptance,
      canUpdateTagChild,
      canUpdateRoot,
      canMergeTags,
      canDeleteTag,
      canCreateTag,
    ]
  );

  return (
    <LocationPanelPermissionsContext.Provider value={value}>
      {children}
    </LocationPanelPermissionsContext.Provider>
  );
};
