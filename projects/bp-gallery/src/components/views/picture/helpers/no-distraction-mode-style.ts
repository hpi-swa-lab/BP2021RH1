import { useContext } from 'react';
import { PictureViewContext } from '../PictureView';

export const useNoDistractionModeStyle = () => {
  const { noDistractionMode } = useContext(PictureViewContext);
  return `transition-opacity ${noDistractionMode ? 'opacity-0' : 'opacity-100'}`;
};
