import React from 'react';
import { useGetArchiveQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';

interface ArchiveViewProps {
  archiveId: string;
}

const ArchiveView = ({ archiveId }: ArchiveViewProps) => {
  const { data, loading, error } = useGetArchiveQuery({ variables: { archiveId } });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;
  console.log(data);
  console.log(archive);

  return <>{archive?.name}</>;
};

export default ArchiveView;
