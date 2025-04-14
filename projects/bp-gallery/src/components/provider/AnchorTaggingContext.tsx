import { Dispatch, SetStateAction, createContext } from 'react';
import { AnchorTagData, TagDirection } from '../views/picture/anchor-tagging/AnchorTagTypes';
import { Rect } from '../views/picture/anchor-tagging/helpers/image-rect';

export type AnchorTagging = {
  canAnchorTag: boolean;
  canCreateTag: boolean;
  activeTagId: string | null;
  setActiveTagId: Dispatch<SetStateAction<string | null>>;
  tags: AnchorTagData[];
  hideTags: boolean | null;
  setHideTags: Dispatch<SetStateAction<boolean>>;
  removeTag: (id: string) => Promise<void>;
  isAnchorTagging: boolean;
  setIsAnchorTagging: Dispatch<SetStateAction<boolean>>;
  tagDirectionReferenceTagId: string | null;
  setTagDirectionReferenceTagId: Dispatch<SetStateAction<string | null>>;
  activeTagDirection: TagDirection | null;
  setActiveTagDirection: Dispatch<SetStateAction<TagDirection | null>>;
  imageRect: Rect | null;
};

export const FaceTaggingContext = createContext<AnchorTagging | null>(null);

export const OrientationTaggingContext = createContext<AnchorTagging | null>(null);
