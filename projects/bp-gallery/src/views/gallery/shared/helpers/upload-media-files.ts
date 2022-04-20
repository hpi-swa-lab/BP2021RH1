import { asApiPath } from '../../../../App';

// Using fetch (REST) because upload with GraphQL is a lot more difficult
const uploadMediaFiles = (files: File[]): Promise<string[]> => {
  const jwt = sessionStorage.getItem('jwt') ?? '';
  const fd = new FormData();
  files.forEach((file, i) => {
    fd.append(`files`, file, file.name);
  });

  return new Promise<string[]>(resolve => {
    fetch(asApiPath('/upload'), {
      body: fd,
      method: 'post',
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
      .then(resp => resp.json())
      .then(json => {
        const ids: string[] = (json as any[]).map(mediaFile => mediaFile.id);
        resolve(ids);
      });
  });
};

export default uploadMediaFiles;
