import { useContext } from 'react';
import { ClipboardEditorContext } from '../components/provider/ClipboardEditorProvider';
import { FaceTaggingContext } from '../components/provider/FaceTaggingProvider';
import { MobileContext } from '../components/provider/MobileProvider';
import { ScrollContext, ScrollRefContext } from '../components/provider/ScrollProvider';
import { ShowStatsContext } from '../components/provider/ShowStatsProvider';
import { StorageContext } from '../components/provider/StorageProvider';

export const useStorage = () => {
  const value = useContext(StorageContext);
  if (!value) {
    throw new Error('missing storage context');
  }
  return value;
};

export const useClipboard = () => {
  const value = useContext(StorageContext)?.clipboardState;
  if (!value) {
    throw new Error('missing clipboard context');
  }
  return value;
};

export const useStats = () => {
  return useContext(ShowStatsContext);
};

export const useClipboardEditorButtons = () => {
  return useContext(ClipboardEditorContext)?.[0];
};

export const useSetClipboardEditorButtons = () => {
  return useContext(ClipboardEditorContext)?.[1];
};

export const useScroll = () => {
  const value = useContext(ScrollContext);
  if (!value) {
    throw new Error('missing scroll context');
  }
  return value;
};

export const useScrollRef = () => {
  const value = useContext(ScrollRefContext);
  if (!value) {
    throw new Error('missing scroll ref context');
  }
  return value;
};

export const useFaceTagging = () => {
  return useContext(FaceTaggingContext);
};

export const useMobile = () => {
  return useContext(MobileContext);
};
