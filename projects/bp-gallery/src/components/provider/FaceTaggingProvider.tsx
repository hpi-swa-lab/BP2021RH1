import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useCreateFaceTagMutation,
  useDeleteFaceTagMutation,
  useGetFaceTagsQuery,
  useGetPersonTagQuery,
} from '../../graphql/APIConnector';
import { PictureViewContext } from '../views/picture/PictureView';
import { FaceTagData } from '../views/picture/face-tagging/FaceTag';
import { useImageRect } from '../views/picture/face-tagging/helpers/image-rect';

export type FaceTagging = {
  activeTagId: string | null;
  setActiveTagId: Dispatch<SetStateAction<string | null>>;
  tags: FaceTagData[];
  hideTags: boolean | null;
  setHideTags: Dispatch<SetStateAction<boolean>>;
  removeTag: (id: string) => void;
  isFaceTagging: boolean;
  setIsFaceTagging: Dispatch<SetStateAction<boolean>>;
};

export const FaceTaggingContext = createContext<FaceTagging | null>(null);

export const FaceTaggingProvider = ({
  children,
  pictureId,
}: PropsWithChildren<{ pictureId: string }>) => {
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [hideTags, setHideTags] = useState(false);
  const [isFaceTagging, setIsFaceTagging] = useState(false);
  useEffect(() => {
    setActiveTagId(null);
  }, [pictureId]);

  const { error, data } = useGetFaceTagsQuery({
    variables: {
      pictureId,
    },
  });
  const tags = data?.faceTags?.data.map(tag => ({
    x: tag.attributes?.x ?? 0,
    y: tag.attributes?.y ?? 0,
    name: tag.attributes?.person_tag?.data?.attributes?.name ?? '',
    personTagId: tag.attributes?.person_tag?.data?.id,
    id: tag.id ?? '-1',
  }));

  const { data: activeData } = useGetPersonTagQuery({
    variables: {
      id: activeTagId ?? '-1',
    },
  });
  const activeTagName = activeData?.personTag?.data?.attributes?.name ?? 'Lädt';

  const [mousePosition, setMousePosition] = useState<null | [number, number]>(null);

  const { img } = useContext(PictureViewContext);
  const imageRect = useImageRect(img);

  const position = useMemo(() => {
    if (!mousePosition || !imageRect) {
      return null;
    }
    const [mx, my] = mousePosition;
    const { x: ix, y: iy, width, height } = imageRect;
    const x = (mx - ix) / width;
    const y = (my - iy) / height;
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      return null;
    }
    return [x, y];
  }, [mousePosition, imageRect]);

  const [createTag] = useCreateFaceTagMutation({
    refetchQueries: ['getFaceTags'],
  });

  // used to remove the position dependency from placeTag,
  // which prevents the events-useEffect from firing on position changes
  const positionRef = useRef(position);
  positionRef.current = position;

  const placeTag = useCallback(() => {
    const position = positionRef.current;
    if (!position || activeTagId === null) {
      return;
    }
    const [x, y] = position;
    createTag({
      variables: {
        x,
        y,
        personTagId: activeTagId,
        pictureId,
      },
    });
    setActiveTagId(null);
  }, [createTag, positionRef, activeTagId, pictureId]);

  const [deleteTag] = useDeleteFaceTagMutation({
    refetchQueries: ['getFaceTags'],
  });

  const removeTag = useCallback(
    (id: string) => {
      if (!id) {
        return;
      }
      deleteTag({
        variables: {
          id,
        },
      });
    },
    [deleteTag]
  );

  useEffect(() => {
    if (!img) {
      return;
    }
    let hasDragged = false;

    const pointermove = (event: MouseEvent) => {
      hasDragged = true;
      const { clientX, clientY } = event;
      setMousePosition([clientX, clientY]);
    };
    const pointerleave = () => {
      setMousePosition(null);
    };
    const pointerdown = () => {
      hasDragged = false;
    };
    const mouseclick = () => {
      if (hasDragged) {
        return;
      }
      placeTag();
    };
    img.addEventListener('pointermove', pointermove);
    img.addEventListener('pointerleave', pointerleave);
    img.addEventListener('pointerdown', pointerdown);
    img.addEventListener('click', mouseclick);
    return () => {
      img.removeEventListener('pointermove', pointermove);
      img.removeEventListener('pointerleave', pointerleave);
      img.removeEventListener('pointerdown', pointerdown);
      img.removeEventListener('click', mouseclick);
    };
  }, [img, placeTag]);

  const activeTagData = useMemo<FaceTagData | null>(() => {
    if (!position || activeTagId === null) {
      return null;
    }
    const [x, y] = position;
    return {
      id: undefined,
      personTagId: undefined,
      name: activeTagName,
      x,
      y,
      noPointerEvents: true,
    };
  }, [position, activeTagName, activeTagId]);

  const value = useMemo<FaceTagging>(
    () => ({
      activeTagId,
      setActiveTagId,
      tags: activeTagData
        ? [...(tags ?? []).map(tag => ({ ...tag, noPointerEvents: true })), activeTagData]
        : tags ?? [],
      hideTags,
      setHideTags,
      removeTag,
      isFaceTagging,
      setIsFaceTagging,
    }),
    [
      activeTagId,
      setActiveTagId,
      tags,
      activeTagData,
      hideTags,
      removeTag,
      isFaceTagging,
      setIsFaceTagging,
    ]
  );

  if (!tags) {
    if (error) {
      console.error(error);
    }
    return <>{children}</>;
  }

  return <FaceTaggingContext.Provider value={value}>{children}</FaceTaggingContext.Provider>;
};

/*export const useFaceTagging = () => {
  return useContext(FaceTaggingContext);
};


export const FaceTags = () => {
  const FaceTaggingContext = useFaceTagging();

  if (!FaceTaggingContext || FaceTaggingContext.hideTags) {
    return null;
  }
  return (
    <>
      {FaceTaggingContext.tags.map(data => (
        <FaceTag data={data} key={data.name} />
      ))}
    </>
  );
};
*/
