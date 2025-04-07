import { ComponentType, Context, useContext } from 'react';
import { AnchorTagging } from '../../../provider/AnchorTaggingContext';
import { AnchorTagData } from './AnchorTagTypes';

export const createAnchorTags = ({
  TaggingContext,
  AnchorTag,
}: {
  TaggingContext: Context<AnchorTagging | null>;
  AnchorTag: ComponentType<{ data: AnchorTagData }>;
}) => {
  const AnchorTags = () => {
    const anchorTaggingContext = useContext(TaggingContext);

    if (anchorTaggingContext?.hideTags) {
      return null;
    }
    return (
      <>
        {anchorTaggingContext?.tags.map(data => (
          <AnchorTag data={data} key={data.name} />
        ))}
      </>
    );
  };
  return AnchorTags;
};
