import { camelCase } from 'lodash';
import {
  Context,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Maybe, Scalars } from '../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { useMouseInElement } from '../../hooks/mouse-in-element.hook';
import { useMousePosition } from '../../hooks/mouse-position.hook';
import { FlatTag } from '../../types/additionalFlatTypes';
import { CanRunMultipleQuery, CanRunQuery, Mutation, Query } from '../../types/graphql';
import { PictureViewContext } from '../views/picture/PictureView';
import { AnchorTagData, TagDirection } from '../views/picture/anchor-tagging/AnchorTagTypes';
import { useImageRect } from '../views/picture/anchor-tagging/helpers/image-rect';
import { AnchorTagging } from './AnchorTaggingContext';

export const createAnchorTaggingProvider = <
  TagKey extends string,
  TagIdKey extends string,
  FlatAnchorTag extends {
    id: Scalars['ID'];
    x?: Maybe<number>;
    y?: Maybe<number>;
    tag_direction?: Maybe<number>;
  } & Partial<Record<TagKey, { id: Scalars['ID']; name?: Maybe<string> }>>
>({
  TaggingContext,
  anchorTagsKey,
  tagKey,
  tagIdKey,
  getAnchorTagsQueryName,
  useGetAnchorTagsQuery,
  useGetTagQuery,
  useCreateAnchorTagMutation,
  useCanRunCreateAnchorTagMutation,
  useDeleteAnchorTagMutation,
  useCanRunMultipleDeleteAnchorTagMutations,
  useUpdateAnchorTagDirectionMutation,
}: {
  TaggingContext: Context<AnchorTagging | null>;
  anchorTagsKey: string;
  tagKey: TagKey;
  tagIdKey: TagIdKey;
  getAnchorTagsQueryName: string;
  useGetAnchorTagsQuery: Query<{ pictureId: Scalars['ID'] }>;
  useGetTagQuery: Query<{ id: Scalars['ID'] }>;
  useCreateAnchorTagMutation: Mutation<
    {
      x?: Maybe<number>;
      y?: Maybe<number>;
      tag_direction?: Maybe<number>;
      pictureId: Scalars['ID'];
    } & Record<TagIdKey, Scalars['ID']>
  >;
  useCanRunCreateAnchorTagMutation: CanRunQuery<{ pictureId?: Scalars['ID'] }>;
  useDeleteAnchorTagMutation: Mutation<{
    id: Scalars['ID'];
  }>;
  useCanRunMultipleDeleteAnchorTagMutations: CanRunMultipleQuery<{ id?: Scalars['ID'] }>;
  useUpdateAnchorTagDirectionMutation: Mutation<{
    id: Scalars['ID'];
    tag_direction?: Maybe<number>;
  }>;
}) => {
  const AnchorTaggingProvider = ({
    children,
    pictureId,
  }: PropsWithChildren<{ pictureId: string }>) => {
    const [activeTagId, setActiveTagId] = useState<string | null>(null);
    const [hideTags, setHideTags] = useState(false);
    const [isAnchorTagging, setIsAnchorTagging] = useState(false);
    const [tagDirectionReferenceTagId, setTagDirectionReferenceTagId] = useState<string | null>(
      null
    );
    const isSettingTagDirection = tagDirectionReferenceTagId !== null;
    const [activeTagDirection, setActiveTagDirection] = useState<TagDirection | null>(null);

    useEffect(() => {
      setActiveTagId(null);
      setHideTags(false);
    }, [pictureId]);

    const { error, data } = useGetAnchorTagsQuery({
      variables: {
        pictureId,
      },
    });
    const anchorTags: FlatAnchorTag[] | undefined =
      useSimplifiedQueryResponseData(data)?.[anchorTagsKey];

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
      () => anchorTags?.find(tag => tag.id === tagDirectionReferenceTagId),
      [anchorTags, tagDirectionReferenceTagId]
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
        return TagDirection.UP;
      } else {
        return TagDirection.DOWN;
      }
    }, [referencedTag, clientMousePosition, imageRect]);

    const tags = useMemo(
      () =>
        anchorTags?.map(tag => ({
          x: tag.x ?? 0,
          y: tag.y ?? 0,
          name: tag[tagKey]?.name ?? '',
          tagId: tag[tagKey]?.id,
          id: tag.id,
          tagDirection:
            (tag.id === tagDirectionReferenceTagId ? newTagDirection : tag.tag_direction) ??
            TagDirection.DEFAULT,
        })),
      [anchorTags, tagDirectionReferenceTagId, newTagDirection]
    );

    const { data: activeData } = useGetTagQuery({
      variables: {
        id: activeTagId ?? '-1',
      },
    });
    const activeTag: FlatTag | undefined =
      useSimplifiedQueryResponseData(activeData)?.[camelCase(tagKey)];
    const activeTagName = activeTag?.name ?? 'Lädt';

    const [createTag] = useCreateAnchorTagMutation({
      refetchQueries: [getAnchorTagsQueryName],
    });

    const { canRun: canCreateTag } = useCanRunCreateAnchorTagMutation({
      variables: {
        pictureId,
      },
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
      // to convince TypeScript that this computed key covers "all" members of TagIdKey
      const tagId = {
        [tagIdKey]: activeTagId,
      } as Record<TagIdKey, Scalars['ID']>;
      createTag({
        variables: {
          x,
          y,
          tag_direction: activeTagDirection ? activeTagDirection : TagDirection.DEFAULT,
          ...tagId,
          pictureId,
        },
      });
      setActiveTagId(null);
      setActiveTagDirection(null);
    }, [createTag, positionRef, activeTagId, pictureId, activeTagDirection]);

    const [deleteTag] = useDeleteAnchorTagMutation({
      refetchQueries: [getAnchorTagsQueryName],
      awaitRefetchQueries: true,
    });
    const { canRunMultiple: canDeleteTags } = useCanRunMultipleDeleteAnchorTagMutations({
      variableSets:
        anchorTags?.map(tag => ({
          id: tag.id,
        })) ?? [],
    });
    const canDeleteSomeTag = useMemo(() => canDeleteTags.some(can => can), [canDeleteTags]);

    const canAnchorTag = canCreateTag || canDeleteSomeTag;

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

    const [updateAnchorTagDirection] = useUpdateAnchorTagDirectionMutation({
      refetchQueries: [getAnchorTagsQueryName],
    });

    const setAnchorTagDirection = useCallback(
      (id: string, tag_direction: TagDirection) => {
        if (isSettingTagDirection) {
          updateAnchorTagDirection({ variables: { id, tag_direction } });
        }
      },
      [updateAnchorTagDirection, isSettingTagDirection]
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
          setAnchorTagDirection(tagDirectionReferenceTagId, newTagDirection);
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
      setAnchorTagDirection,
      tagDirectionReferenceTagId,
      newTagDirection,
    ]);

    const activeTagData = useMemo<AnchorTagData | null>(() => {
      if (!position || activeTagId === null) {
        return null;
      }
      const [x, y] = position;
      return {
        id: undefined,
        tagId: activeTagId,
        name: activeTagName,
        x,
        y,
        noPointerEvents: true,
        tagDirection: activeTagDirection ? activeTagDirection : TagDirection.DEFAULT,
      };
    }, [position, activeTagName, activeTagId, activeTagDirection]);

    const value = useMemo<AnchorTagging | null>(
      () =>
        tags
          ? {
              canAnchorTag,
              canCreateTag,
              activeTagId,
              setActiveTagId,
              tags:
                imageRect?.width && imageRect.height
                  ? activeTagData
                    ? [
                        ...tags.map(tag => ({
                          ...tag,
                          noPointerEvents: true,
                        })),
                        activeTagData,
                      ]
                    : tags
                  : [],
              hideTags,
              setHideTags,
              removeTag,
              isAnchorTagging,
              setIsAnchorTagging,
              tagDirectionReferenceTagId,
              setTagDirectionReferenceTagId,
              activeTagDirection,
              setActiveTagDirection,
              imageRect,
            }
          : null,
      [
        tags,
        canAnchorTag,
        canCreateTag,
        activeTagId,
        setActiveTagId,
        imageRect,
        activeTagData,
        hideTags,
        removeTag,
        isAnchorTagging,
        setIsAnchorTagging,
        tagDirectionReferenceTagId,
        setTagDirectionReferenceTagId,
        activeTagDirection,
        setActiveTagDirection,
      ]
    );

    if (error) {
      console.error(error);
    }

    return <TaggingContext.Provider value={value}>{children}</TaggingContext.Provider>;
  };
  return AnchorTaggingProvider;
};
