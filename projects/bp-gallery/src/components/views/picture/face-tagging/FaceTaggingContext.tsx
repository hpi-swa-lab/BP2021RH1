import {
  createContext,
  Dispatch,
  PropsWithChildren,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FaceTag, FaceTagData } from './FaceTag';

type FaceTagging = {
  activeTagId: string | null;
  setActiveTagId: Dispatch<SetStateAction<string | null>>;
  tags: FaceTagData[];
};

const Context = createContext<FaceTagging | null>(null);

export const FaceTaggingProvider = ({
  children,
  imgRef,
}: PropsWithChildren<{ imgRef: RefObject<HTMLImageElement> }>) => {
  const [activeTagId, setActiveTagId] = useState<string | null>(null);

  const tags = useMemo(
    () => [
      { name: 'Links', x: 0.05, y: 0.5 },
      { name: 'Unten', x: 0.5, y: 0.95 },
      { name: 'Rechts', x: 0.95, y: 0.5 },
      { name: 'Oben', x: 0.5, y: 0.05 },
    ],
    []
  );

  const [position, setPosition] = useState<null | [number, number]>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) {
      return;
    }
    const mousemove = (event: MouseEvent) => {
      const { width, height } = img.getBoundingClientRect();
      const { offsetX, offsetY } = event;
      setPosition([offsetX / width, offsetY / height]);
    };
    const mouseleave = () => {
      setPosition(null);
    };
    img.addEventListener('mousemove', mousemove);
    img.addEventListener('mouseleave', mouseleave);
    return () => {
      img.removeEventListener('mousemove', mousemove);
      img.removeEventListener('mouseleave', mouseleave);
    };
  }, [imgRef]);

  const activeTagData = useMemo<FaceTagData | null>(() => {
    if (!position) {
      return null;
    }
    const [x, y] = position;
    return {
      name: 'Neu',
      x,
      y,
      noPointerEvents: true,
    };
  }, [position]);

  const value = useMemo<FaceTagging>(
    () => ({
      activeTagId,
      setActiveTagId,
      tags: activeTagData
        ? [...tags.map(tag => ({ ...tag, noPointerEvents: true })), activeTagData]
        : tags,
    }),
    [activeTagId, setActiveTagId, tags, activeTagData]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useFaceTagging = () => {
  return useContext(Context);
};

export const FaceTags = () => {
  const context = useFaceTagging();
  if (!context) {
    return null;
  }
  return (
    <>
      {context.tags.map(data => (
        <FaceTag data={data} key={data.name} />
      ))}
    </>
  );
};
