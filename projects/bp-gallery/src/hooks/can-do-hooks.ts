import { useCanRunUpdateArchiveMutation } from '../graphql/APIConnector';

export const useCanEditArchive = (id: string) => {
  const { canRun: canEditArchive, loading } = useCanRunUpdateArchiveMutation({
    variables: {
      archiveId: id,
    },
  });
  return { canEditArchive, loading };
};
