import { GpsFixed } from '@mui/icons-material';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  useCanRunCreateLocationTagMutation,
  useCanRunDeleteOrientationTagMutation,
  useCreateLocationTagMutation,
  useDeleteOrientationTagMutation,
} from '../../../../graphql/APIConnector';
import { FlatTagWithoutRelations, TagType } from '../../../../types/additionalFlatTypes';
import { OrientationTaggingContext } from '../../../provider/AnchorTaggingContext';
import { createAnchorTaggingUI } from './AnchorTaggingUI';

const BaseOrientationTaggingUI = createAnchorTaggingUI({
  Context: OrientationTaggingContext,
  Icon: GpsFixed,
  tagType: TagType.LOCATION,
  tagTypeName: 'location',
  translationNamespace: 'orientation-tagging',
  titleTranslationKey: 'pictureFields.orientation-tags',
  noTagsTranslationKey: 'pictureFields.noLocations',
});

export const OrientationTaggingUI = ({
  allLocations,
}: {
  allLocations: FlatTagWithoutRelations[];
}) => {
  const context = useContext(OrientationTaggingContext);

  const [pendingTags, setPendingTags] = useState<FlatTagWithoutRelations[]>([]);

  const existingTags = useMemo(
    () => context?.tags.map(({ name, tagId }) => ({ id: tagId ?? '', name, verified: true })) ?? [],
    [context]
  );

  const withoutExistingTags = useCallback(
    (pendingTags: FlatTagWithoutRelations[]) =>
      pendingTags.filter(pending => !existingTags.find(existing => existing.id === pending.id)),
    [existingTags]
  );

  useEffect(() => {
    setPendingTags(pendingTags => withoutExistingTags(pendingTags));
  }, [withoutExistingTags]);

  const tags = useMemo(
    () => [...existingTags, ...withoutExistingTags(pendingTags)],
    [existingTags, withoutExistingTags, pendingTags]
  );

  const [deleteOrientationTag] = useDeleteOrientationTagMutation({
    refetchQueries: ['getOrientationTags'],
  });
  const { canRun: canDeleteOrientationTag } = useCanRunDeleteOrientationTagMutation({
    withSomeVariables: true,
  });

  const setTags = useCallback(
    (wantedTags: FlatTagWithoutRelations[]) => {
      const deletedPendingTags = new Map(pendingTags.map(tag => [tag.id, tag]));
      const deletedExistingTags = new Map(context?.tags.map(tag => [tag.tagId, tag]));
      const newTags = [];
      for (const wantedTag of wantedTags) {
        if (deletedPendingTags.delete(wantedTag.id)) {
          continue;
        }
        if (deletedExistingTags.delete(wantedTag.id)) {
          continue;
        }
        newTags.push(wantedTag);
      }
      setPendingTags([...pendingTags.filter(tag => !deletedPendingTags.has(tag.id)), ...newTags]);
      if (!canDeleteOrientationTag) {
        return;
      }
      for (const [_, deletedExistingTag] of Array.from(deletedExistingTags.entries())) {
        if (!deletedExistingTag.id) {
          continue;
        }
        deleteOrientationTag({
          variables: {
            id: deletedExistingTag.id,
          },
        });
      }
    },
    [pendingTags, context?.tags, canDeleteOrientationTag, deleteOrientationTag]
  );

  const [createLocationTagMutation] = useCreateLocationTagMutation({
    refetchQueries: ['getAllLocationTags'],
    awaitRefetchQueries: true,
  });
  const { canRun: canCreateLocationTag } = useCanRunCreateLocationTagMutation();

  if (!context || !(context.canAnchorTag || existingTags.length > 0)) {
    return null;
  }

  return (
    <BaseOrientationTaggingUI
      tags={tags}
      allTags={allLocations}
      createMutation={canCreateLocationTag ? createLocationTagMutation : undefined}
      onChange={context.canAnchorTag ? setTags : undefined}
    />
  );
};
