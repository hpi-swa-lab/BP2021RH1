import { Dispatch, SetStateAction, createContext } from 'react';
import { FaceTagData, TagDirection } from '../views/picture/face-tagging/FaceTagTypes';
import { Rect } from '../views/picture/face-tagging/helpers/image-rect';

export type FaceTagging = {
  activeTagId: string | null;
  setActiveTagId: Dispatch<SetStateAction<string | null>>;
  tags: FaceTagData[];
  hideTags: boolean | null;
  setHideTags: Dispatch<SetStateAction<boolean>>;
  removeTag: (id: string) => Promise<void>;
  isFaceTagging: boolean;
  setIsFaceTagging: Dispatch<SetStateAction<boolean>>;
  tagDirectionReferenceTagId: string | null;
  setTagDirectionReferenceTagId: Dispatch<SetStateAction<string | null>>;
  activeTagDirection: TagDirection | null;
  setActiveTagDirection: Dispatch<SetStateAction<TagDirection | null>>;
  imageRect: Rect | null;
};

export const FaceTaggingContext = createContext<FaceTagging | null>(null);
