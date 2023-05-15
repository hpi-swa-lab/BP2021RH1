import { Context, useContext } from 'react';
import { AuthContext } from '../components/provider/AuthProvider';
import { ClipboardEditorContext } from '../components/provider/ClipboardEditorProvider';
import { FaceTaggingContext } from '../components/provider/FaceTaggingProvider';
import { MobileContext } from '../components/provider/MobileProvider';
import { ShowStatsContext } from '../components/provider/ShowStatsProvider';
import { StorageContext } from '../components/provider/StorageProvider';
import { ScrollContext, ScrollRefContext } from '../components/provider/contexts';

const useErrorContext = <T>(context: Context<T>, title: string) => {
  const value = useContext(context);
  if (!value) throw new Error(`missing ${title} context`);
  return value;
};

export const useStorage = () => useErrorContext(StorageContext, 'storage');

export const useClipboard = () => useErrorContext(StorageContext, 'clipboard').clipboardState;

export const useScroll = () => useErrorContext(ScrollContext, 'scroll');

export const useScrollRef = () => useErrorContext(ScrollRefContext, 'scroll ref');

export const useStats = () => {
  return useContext(ShowStatsContext);
};

export const useClipboardEditorButtons = () => {
  return useContext(ClipboardEditorContext)?.[0];
};

export const useSetClipboardEditorButtons = () => {
  return useContext(ClipboardEditorContext)?.[1];
};

export const useFaceTagging = () => {
  return useContext(FaceTaggingContext);
};

export const useMobile = () => {
  return useContext(MobileContext);
};

export const useAuth = () => {
  return useContext(AuthContext);
};
