import {
  PropsWithChildren,
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
  useUpdateFaceTagDirectionMutation,
} from '../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { useMouseInElement } from '../../hooks/mouse-in-element.hook';
import { useMousePosition } from '../../hooks/mouse-position.hook';
import { FlatFaceTag, FlatPersonTag } from '../../types/additionalFlatTypes';
import { PictureViewContext } from '../views/picture/PictureView';
import { FaceTagData, TagDirection } from '../views/picture/face-tagging/FaceTag';
import { useImageRect } from '../views/picture/face-tagging/helpers/image-rect';
import { FaceTagging, FaceTaggingContext } from './FaceTaggingContext';

export const FaceTaggingProvider = ({
  children,
  pictureId,
}: PropsWithChildren<{ pictureId: string }>) => {
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [hideTags, setHideTags] = useState(false);
  const [isFaceTagging, setIsFaceTagging] = useState(false);
  const [tagDirectionReferenceTagId, setTagDirectionReferenceTagId] = useState<string | null>(null);
  const isSettingTagDirection = tagDirectionReferenceTagId !== null;

  useEffect(() => {
    setActiveTagId(null);
    setHideTags(false);
  }, [pictureId]);

  const { error, data } = useGetFaceTagsQuery({
    variables: {
      pictureId,
    },
  });
  const faceTags: FlatFaceTag[] | undefined = useSimplifiedQueryResponseData(data)?.faceTags;

  const { img } = useContext(PictureViewContext);

  const { client: clientMousePosition } = useMousePosition();
  const mouseInElement = useMouseInElement(img);
  const mousePosition = mouseInElement ? clientMousePosition : null;

  const imageRect = useImageRect(img, img?.parentElement ?? null);

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

  const referencedTag = useMemo(
    () => faceTags?.find(tag => tag.id === tagDirectionReferenceTagId),
    [faceTags, tagDirectionReferenceTagId]
  );

  const newTagDirection = useMemo(() => {
    if (
      !referencedTag ||
      typeof referencedTag.x !== 'number' ||
      typeof referencedTag.y !== 'number' ||
      !imageRect
    ) {
      return null;
    }
    const [mx, my] = clientMousePosition;
    const tx = referencedTag.x * imageRect.width + imageRect.x;
    const ty = referencedTag.y * imageRect.height + imageRect.y;
    const angle = Math.atan2(my - ty, mx - tx);
    const angleAbs = Math.abs(angle);
    if (angleAbs < Math.PI / 4) {
      return TagDirection.RIGHT;
    } else if (angleAbs > (Math.PI * 3) / 4) {
      return TagDirection.LEFT;
    } else if (my - ty < 0) {
      return TagDirection.DOWN;
    } else {
      return TagDirection.UP;
    }
  }, [referencedTag, clientMousePosition, imageRect]);

  const tags = useMemo(
    () =>
      faceTags?.map(tag => ({
        x: tag.x ?? 0,
        y: tag.y ?? 0,
        name: tag.person_tag?.name ?? '',
        personTagId: tag.person_tag?.id,
        id: tag.id,
        tagDirection:
          (tag.id === tagDirectionReferenceTagId ? newTagDirection : tag.tag_direction) ??
          TagDirection.DEFAULT,
      })),
    [faceTags, tagDirectionReferenceTagId, newTagDirection]
  );

  const { data: activeData } = useGetPersonTagQuery({
    variables: {
      id: activeTagId ?? '-1',
    },
  });
  const activePersonTag: FlatPersonTag | undefined =
    useSimplifiedQueryResponseData(activeData)?.personTag;
  const activeTagName = activePersonTag?.name ?? 'Lädt';

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
        tag_direction: TagDirection.DEFAULT,
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

  const [updateFaceTagDirection] = useUpdateFaceTagDirectionMutation({
    refetchQueries: ['getFaceTags'],
  });

  const setFaceTagDirection = useCallback(
    (faceTagId: string, tag_direction: TagDirection) => {
      if (isSettingTagDirection) {
        updateFaceTagDirection({ variables: { faceTagId, tag_direction } });
      }
    },
    [updateFaceTagDirection, isSettingTagDirection]
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
      if (activeTagId) {
        if (hasDragged) {
          return;
        }
        placeTag();
        return;
      }

      if (tagDirectionReferenceTagId !== null && newTagDirection !== null) {
        setFaceTagDirection(tagDirectionReferenceTagId, newTagDirection);
        setTagDirectionReferenceTagId(null);
      }
    };
    img.addEventListener('pointermove', pointermove);
    img.addEventListener('pointerdown', pointerdown);
    img.addEventListener('click', mouseclick);
    return () => {
      img.removeEventListener('pointermove', pointermove);
      img.removeEventListener('pointerdown', pointerdown);
      img.removeEventListener('click', mouseclick);
    };
  }, [
    img,
    placeTag,
    activeTagId,
    setFaceTagDirection,
    tagDirectionReferenceTagId,
    newTagDirection,
  ]);

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
      tagDirection: TagDirection.DEFAULT,
    };
  }, [position, activeTagName, activeTagId]);

  const value = useMemo<FaceTagging | null>(
    () =>
      tags
        ? {
            activeTagId,
            setActiveTagId,
            tags:
              imageRect?.width && imageRect.height
                ? activeTagData
                  ? [...tags.map(tag => ({ ...tag, noPointerEvents: true })), activeTagData]
                  : tags
                : [],
            hideTags,
            setHideTags,
            removeTag,
            isFaceTagging,
            setIsFaceTagging,
            tagDirectionReferenceTagId,
            setTagDirectionReferenceTagId,
            imageRect,
          }
        : null,
    [
      activeTagId,
      setActiveTagId,
      tags,
      activeTagData,
      hideTags,
      removeTag,
      isFaceTagging,
      setIsFaceTagging,
      tagDirectionReferenceTagId,
      setTagDirectionReferenceTagId,
      imageRect,
    ]
  );

  if (error) {
    console.error(error);
  }

  return <FaceTaggingContext.Provider value={value}>{children}</FaceTaggingContext.Provider>;
};
