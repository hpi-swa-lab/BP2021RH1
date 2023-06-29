import { createContext, useContext } from 'react';

export const LocationPanelPermissionsContext = createContext({
  canUseTagTableView: false,
  canGetAllTags: false,
  canUpdateTagName: false,
  canUpdateSynonyms: false,
  canUpdateVisibility: false,
  canUpdateTagParent: false,
  canUpdateTagAcceptance: false,
  canUpdateTagChild: false,
  canUpdateRoot: false,
  canMergeTags: false,
  canDeleteTag: false,
  canCreateTag: false,
});

export const useLocationPanelPermissions = () => {
  return useContext(LocationPanelPermissionsContext);
};
