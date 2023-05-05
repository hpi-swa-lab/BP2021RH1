import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  Over,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, IconButton, TextField } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import { useGetPictureInfoQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import TextEditor from '../../common/editors/TextEditor';
import PicturePreview from '../../common/picture-gallery/PicturePreview';

const DraggablePicture = ({ id, picture }: { id: string; picture?: FlatPicture }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  return (
    <div className='z-[1000] relative' ref={setNodeRef} {...listeners} {...attributes}>
      {picture && <PicturePreview height='9rem' picture={picture} onClick={() => {}} />}
    </div>
  );
};

const IdeaLot = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className='flex flex-col items-stretch h-full w-full relative'>
      <div className='text-xl'>Ideenparkplatz</div>
      <div className='border-solid flex-1 flex gap-2 '>{children}</div>
    </div>
  );
};

const DropZone = ({ id, children }: PropsWithChildren<{ id: string }>) => {
  const { setNodeRef } = useDroppable({ id: id });
  return (
    <div
      ref={setNodeRef}
      className='h-40 border-solid rounded-xl p-2 box-border flex flex-wrap gap-2 bg-gray-200'
    >
      {children}
    </div>
  );
};

interface DropzoneContent {
  id: string;
  dragIds: string[];
}

interface DragElement {
  id: string;
  element: JSX.Element;
}

const ExhibitionManipulator = ({
  dropzones,
  draggables,
}: {
  dropzones: DropzoneContent[];
  draggables: DragElement[];
}) => {
  return (
    <div className='flex flex-col items-stretch h-full w-full overflow-auto'>
      <div className='text-xl'>Ausstellungstool</div>
      <div className='border-solid flex-1'>
        {dropzones.map(dropzone => (
          <Section key={dropzone.id} dropzone={dropzone} draggables={draggables} />
        ))}
      </div>
    </div>
  );
};

const Section = ({
  dropzone,
  draggables,
}: {
  dropzone: DropzoneContent;
  draggables: DragElement[];
}) => {
  const extraOptions = {
    preset: undefined,
    placeholder: 'Abschnittsbeschreibung',
    statusbar: false,
    tabIndex: 0,
    className: 'z-0',
  };

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='flex flex-col gap-2 p-2 border-solid rounded-3xl m-2'>
      <div className='flex'>
        <TextField className='flex-1' placeholder='Abschnittstitel' />
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>
      {isOpen && (
        <>
          <TextEditor value='' extraOptions={extraOptions} />
          <DropZone key={dropzone.id} id={dropzone.id}>
            {draggables.map(draggable =>
              dropzone.dragIds.includes(draggable.id) ? draggable.element : null
            )}
          </DropZone>
        </>
      )}
    </div>
  );
};

const ExhibitionTool = ({ exhibitionId }: { exhibitionId: string }) => {
  const [dropzones, setDropzones] = useState<DropzoneContent[]>([
    { id: '1', dragIds: [] },
    { id: '2', dragIds: [] },
  ]);
  const { data: pictureOne } = useGetPictureInfoQuery({ variables: { pictureId: '6' } });
  const picture1: FlatPicture | undefined = useSimplifiedQueryResponseData(pictureOne)?.picture;
  const { data: pictureTwo } = useGetPictureInfoQuery({ variables: { pictureId: '5' } });
  const picture2: FlatPicture | undefined = useSimplifiedQueryResponseData(pictureTwo)?.picture;
  const draggable = <DraggablePicture id='draggable' picture={picture1} />;
  const draggable2 = <DraggablePicture id='draggable2' picture={picture2} />;

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    const addToDropzone = (dropzone: DropzoneContent, over: Over) => {
      return dropzone.id === over.id
        ? ({ id: dropzone.id, dragIds: [...dropzone.dragIds, active.id] } as DropzoneContent)
        : dropzone;
    };

    const removeFromDropzone = (dropzone: DropzoneContent) => {
      return dropzone.dragIds.some(x => x === active.id)
        ? ({
            id: dropzone.id,
            dragIds: dropzone.dragIds.filter(x => x !== active.id),
          } as DropzoneContent)
        : dropzone;
    };
    setDropzones(
      dropzones.map(dropzone => {
        if (over) {
          return addToDropzone(removeFromDropzone(dropzone), over);
        }
        return removeFromDropzone(dropzone);
      })
    );
  };
  const [draggableList, setDraggableList] = useState([
    { id: 'draggable', element: draggable },
    { id: 'draggable2', element: draggable2 },
  ]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDraggableList(
      draggableList.map(drag => (drag.id === active.id ? { ...drag, isDragged: true } : drag))
    );
  };
  return (
    <>
      <div className='absolute z-[999] right-7 top-[6rem]'>
        <Button variant='contained'>Veröffentlichen</Button>
      </div>
      <div className='flex gap-7 items-stretch h-full w-full p-7 box-border overflow-hidden'>
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <DragOverlay>{draggable}</DragOverlay>
          <IdeaLot>
            {draggableList.map(drag =>
              !dropzones.some(x => x.dragIds.includes(drag.id)) ? drag.element : null
            )}
          </IdeaLot>
          <ExhibitionManipulator dropzones={dropzones} draggables={draggableList} />
        </DndContext>
      </div>
    </>
  );
};

export default ExhibitionTool;
