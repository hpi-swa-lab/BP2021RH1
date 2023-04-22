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
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { useMouseInElement } from '../../hooks/mouse-in-element.hook';
import { useMousePosition } from '../../hooks/mouse-position.hook';
import { FlatFaceTag, FlatPersonTag } from '../../types/additionalFlatTypes';
import { FaceTagData } from '../views/picture/face-tagging/FaceTag';
import { useImageRect } from '../views/picture/face-tagging/helpers/image-rect';
import { PictureViewContext } from '../views/picture/PictureView';

export type FaceTagging = {
  activeTagId: string | null;
  setActiveTagId: Dispatch<SetStateAction<string | null>>;
  tags: FaceTagData[];
  hideTags: boolean | null;
  setHideTags: Dispatch<SetStateAction<boolean>>;
  removeTag: (id: string) => Promise<void>;
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
  const faceTags: FlatFaceTag[] | undefined = useSimplifiedQueryResponseData(data)?.faceTags;

  const tags = faceTags?.map(tag => ({
    x: tag.x ?? 0,
    y: tag.y ?? 0,
    name: tag.person_tag?.name ?? '',
    personTagId: tag.person_tag?.id,
    id: tag.id,
  }));

  const { data: activeData } = useGetPersonTagQuery({
    variables: {
      id: activeTagId ?? '-1',
    },
  });
  const activePersonTag: FlatPersonTag | undefined =
    useSimplifiedQueryResponseData(activeData)?.personTag;
  const activeTagName = activePersonTag?.name ?? 'Lädt';

  const { img } = useContext(PictureViewContext);

  const { client: clientMousePosition } = useMousePosition();
  const mouseInElement = useMouseInElement(img);
  const mousePosition = mouseInElement ? clientMousePosition : null;

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
    awaitRefetchQueries: true,
  });

  const removeTag = useCallback(
    async (id: string) => {
      if (!id) {
        return;
      }
      await deleteTag({
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

    const pointermove = () => {
      hasDragged = true;
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
    img.addEventListener('pointerdown', pointerdown);
    img.addEventListener('click', mouseclick);
    return () => {
      img.removeEventListener('pointermove', pointermove);
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
      personTagId: activeTagId,
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
      tags:
        imageRect?.width && imageRect.height
          ? activeTagData
            ? [...(tags ?? []).map(tag => ({ ...tag, noPointerEvents: true })), activeTagData]
            : tags ?? []
          : [],
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
      imageRect,
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
