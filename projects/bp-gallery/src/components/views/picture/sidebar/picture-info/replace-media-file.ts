import { asApiPath } from '../../../../../helpers/app-helpers';

// Using fetch (REST) because upload with GraphQL is a lot more difficult
const replaceMediaFile = (file: File, uploadId: string): Promise<void> => {
  const jwt = sessionStorage.getItem('jwt') ?? '';
  const fd = new FormData();
  fd.append(`files`, file, file.name);

  return new Promise<void>((resolve, reject) => {
    fetch(asApiPath(`/upload?id=${uploadId}`), {
      body: fd,
      method: 'post',
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    }).then(resp => {
      if (resp.ok) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

export default replaceMediaFile;
