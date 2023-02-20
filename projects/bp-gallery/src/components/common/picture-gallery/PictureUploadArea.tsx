import { Close, ExpandCircleDown, Upload } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useCreatePictureMutation } from '../../../graphql/APIConnector';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import uploadMediaFiles from './helpers/upload-media-files';
import PicturePreview, { PictureOrigin } from './PicturePreview';
import './PictureUploadArea.scss';
import ScannerInput from './ScannerInput';

export interface PictureUploadAreaProps {
  folderName?: string;
  preprocessPictures?: (pictures: FlatPicture[]) => FlatPicture[];
  onUploaded?: () => void;
}

const PictureUploadArea = ({
  folderName,
  preprocessPictures,
  onUploaded,
}: PictureUploadAreaProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg,image/png',
  });
  const { t } = useTranslation();
  const { role } = useAuth();
  const dialog = useDialog();

  const [newFiles, setNewFiles] = useState<{ file: File; preview: FlatPicture }[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [createPicture] = useCreatePictureMutation();

  const asFlatPicture = (file: File): FlatPicture => {
    return {
      id: file.name,
      media: {
        formats: {
          small: {
            url: URL.createObjectURL(file),
          },
        },
      } as any,
    };
  };

  useEffect(() => {
    const filesWithPreviews = acceptedFiles.map(file => ({ preview: asFlatPicture(file), file }));
    setNewFiles(fileList => [...fileList, ...filesWithPreviews]);
  }, [acceptedFiles]);

  const uploadPictures = useCallback(async () => {
    if (!preprocessPictures) {
      return;
    }

    const targetArchiveTag = await dialog({
      preset: DialogPreset.SELECT_ARCHIVE_TAG,
    });
    if (!targetArchiveTag) {
      return;
    }

    const initializePictureFromFile = (fileId: any) =>
      ({
        media: fileId,
        publishedAt: new Date().toISOString(),
        archive_tag: targetArchiveTag.id,
      } as unknown as FlatPicture);

    setLoading(true);
    uploadMediaFiles(newFiles.map(f => f.file)).then(async fileIds => {
      const initialPictures = fileIds.map(initializePictureFromFile);
      const pictures = preprocessPictures(initialPictures);
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
  }, [newFiles, createPicture, preprocessPictures, onUploaded, setLoading, dialog]);

  const onScan = useCallback((file: File) => {
    setNewFiles(fileList => [...fileList, { file, preview: asFlatPicture(file) }]);
  }, []);

  // Do we really want to allow uploading only when preprocessing is enabled?
  if (role < AuthRole.CURATOR || !preprocessPictures) {
    return null;
  }

  return (
    <div className='add-pictures'>
      <div className='upload-area'>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>
            <Upload sx={{ mr: '10px' }} />
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
                icon: <Close />,
                onClick: () => {
                  setNewFiles(fileList => {
                    const clone = cloneDeep(fileList);
                    clone.splice(index, 1);
                    return clone;
                  });
                },
              },
            ]}
            picture={file.preview}
            onClick={() => {}}
            pictureOrigin={PictureOrigin.LOCAL}
          />
        ))}
      </div>
      {Boolean(newFiles.length) && (
        <Button disabled={loading} className='add-to-collection' onClick={uploadPictures}>
          {loading ? (
            <CircularProgress sx={{ mr: '10px' }} />
          ) : (
            <ExpandCircleDown sx={{ mr: '10px' }} />
          )}
          <p>{t('curator.addPictures')}</p>
        </Button>
      )}
    </div>
  );
};

export default PictureUploadArea;
