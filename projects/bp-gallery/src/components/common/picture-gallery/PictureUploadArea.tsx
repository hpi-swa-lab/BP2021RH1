import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { Close, ExpandCircleDown, Upload } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { cloneDeep, sortBy } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useCreatePictureMutation } from '../../../graphql/APIConnector';
import { PictureOrigin } from '../../../helpers/app-helpers';
import { useObjectIds } from '../../../hooks/object-ids.hook';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import SortableItem from '../SortableItem';
import PicturePreview from './PicturePreview';
import './PictureUploadArea.scss';
import uploadMediaFiles from './helpers/upload-media-files';

export interface PictureUploadAreaProps {
  folderName?: string;
  preprocessPictures?: (pictures: FlatPicture[]) => FlatPicture[];
  onUploaded?: () => void;
}

type NewFile = {
  file: File;
  preview: FlatPicture;
};

const PictureUploadArea = ({
  folderName,
  preprocessPictures,
  onUploaded,
}: PictureUploadAreaProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg,image/png',
  });
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );
  const { t } = useTranslation();
  const { role } = useAuth();
  const dialog = useDialog();
  const { getObjectId } = useObjectIds<NewFile>();

  const [newFiles, setNewFiles] = useState<NewFile[]>([]);

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
    if (!acceptedFiles.length) return;
    const filesWithPreviews = acceptedFiles.map(file => ({ preview: asFlatPicture(file), file }));
    const sortedFiles = sortBy(filesWithPreviews, f => f.file.name);
    setNewFiles(fileList => [...fileList, ...sortedFiles]);
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
  }, [preprocessPictures, dialog, newFiles, onUploaded, createPicture]);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    setNewFiles(newFiles => arrayMove(newFiles, Number(active.id), Number(over.id)));
  }

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
      </div>
      <div className='uploaded-pictures'>
        <DndContext onDragEnd={onDragEnd} sensors={sensors}>
          <SortableContext items={newFiles.map((_, i) => `${i}`)}>
            {newFiles.map((file, index) => (
              <SortableItem id={`${index}`} key={getObjectId(file)}>
                <PicturePreview
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
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
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
