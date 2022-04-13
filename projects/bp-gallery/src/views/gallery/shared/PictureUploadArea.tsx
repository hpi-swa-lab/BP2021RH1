import { Button, Icon, CircularProgress } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { asApiPath } from '../../../App';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';
import { useCreatePictureMutation } from '../../../graphql/APIConnector';
import { asFlatPicture } from './helpers/as-flat-picture';
import PicturePreview from './PicturePreview';
import './PictureUploadArea.scss';
import ScannerInput from './ScannerInput';

export interface PictureUploadAreaProps {
  folderName?: string;
  beforeAddPictures?: (pictures: FlatPicture[]) => FlatPicture[];
  onUploaded?: () => void;
}

// Using fetch (REST) because upload with GraphQL is a lot more difficult
const uploadFiles = (files: File[]): Promise<string[]> => {
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

const PictureUploadArea = ({
  folderName,
  beforeAddPictures,
  onUploaded,
}: PictureUploadAreaProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg,image/png',
  });
  const { t } = useTranslation();
  const [newFiles, setNewFiles] = useState<
    {
      file: File;
      preview: FlatPicture;
    }[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [createPicture] = useCreatePictureMutation();

  useEffect(() => {
    const filesWithPreviews = acceptedFiles.map(file => ({ preview: asFlatPicture(file), file }));
    setNewFiles(fileList => [...fileList, ...filesWithPreviews]);
  }, [acceptedFiles]);

  const uploadPictures = useCallback(() => {
    if (!beforeAddPictures) {
      return;
    }
    setLoading(true);
    uploadFiles(newFiles.map(f => f.file)).then(async fileIds => {
      const pictures = beforeAddPictures(
        fileIds.map(f => ({ media: f } as unknown as FlatPicture))
      );
      for (const picture of pictures) {
        await createPicture({
          variables: {
            data: picture as any,
          },
        });
      }
      setNewFiles([]);
      if (onUploaded) {
        onUploaded();
      }
      setLoading(false);
    });
  }, [newFiles, createPicture, beforeAddPictures, onUploaded, setLoading]);

  const onScan = useCallback((file: File) => {
    setNewFiles(fileList => [
      ...fileList,
      {
        file,
        preview: asFlatPicture(file),
      },
    ]);
  }, []);

  return (
    <div className='add-pictures'>
      <div className='upload-area'>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>
            <Icon sx={{ mr: '10px' }}>upload</Icon>
            {t('curator.uploadHere', { folderName })}
          </p>
        </div>
        <span className='or-label'>{t('common.or')}</span>
        <ScannerInput onScan={onScan} />
      </div>
      <div className='uploaded-pictures'>
        {newFiles.map((file, index) => (
          <PicturePreview
            key={`${file.file.name}-${index}`}
            adornments={[
              {
                position: 'top-right',
                icon: 'close',
                onClick: () => {
                  setNewFiles(fileList => {
                    fileList.splice(index, 1);
                    return [...fileList];
                  });
                },
              },
            ]}
            picture={file.preview}
            onClick={() => {}}
            local={true}
          />
        ))}
      </div>
      {Boolean(newFiles.length) && (
        <Button disabled={loading} className='add-to-collection' onClick={uploadPictures}>
          {loading ? (
            <CircularProgress sx={{ mr: '10px' }} />
          ) : (
            <Icon sx={{ mr: '10px' }}>expand_circle_down</Icon>
          )}
          <p>{t('curator.addPictures')}</p>
        </Button>
      )}
    </div>
  );
};

export default PictureUploadArea;
