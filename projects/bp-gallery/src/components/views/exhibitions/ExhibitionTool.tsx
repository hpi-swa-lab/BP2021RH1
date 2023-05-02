import { Button } from '@mui/material';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { PropsWithChildren, useState } from 'react';
import { DndContext, DragEndEvent, Over, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const DraggablePicture = ({ id, picture }: { id: string; picture?: FlatPicture }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div
      className='border-solid w-14 h-16'
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    ></div>
  );
};

const IdeaLot = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className='flex flex-col items-stretch h-full w-full'>
      <div className='text-xl'>Ideenparkplatz</div>
      <div className='border-solid flex-1 '>{children}</div>
    </div>
  );
};

const DropZone = ({ id, children }: PropsWithChildren<{ id: string }>) => {
  const { setNodeRef } = useDroppable({ id: id });
  return (
    <div ref={setNodeRef} className='w-40 h-40 border-solid'>
      {children}
    </div>
  );
};

// const DnDExample = () => {
//   return (
//     <DndContext onDragEnd={handleDragEnd}>
//       {!parent ? draggable : null}
//       <DropZone id='1'>{parent === '1' && draggable}</DropZone>
//     </DndContext>
//   );
// };

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
    <div className='flex flex-col items-stretch h-full w-full'>
      <div className='text-xl'>Ausstellungstool</div>
      <div className='border-solid flex-1'>
        {dropzones.map(dropzone => (
          <DropZone key={dropzone.id} id={dropzone.id}>
            {draggables.map(draggable =>
              dropzone.dragIds.includes(draggable.id) ? draggable.element : null
            )}
          </DropZone>
        ))}
      </div>
    </div>
  );
};

const ExhibitionTool = ({ exhibitionId }: { exhibitionId: string }) => {
  const [dropzones, setDropzones] = useState<DropzoneContent[]>([
    { id: '1', dragIds: [] },
    { id: '2', dragIds: [] },
  ]);
  const draggable = <DraggablePicture id='draggable' />;
  const draggable2 = <DraggablePicture id='draggable2' />;

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
    console.log(dropzones);
  };
  const draggableList = [
    { id: 'draggable', element: draggable },
    { id: 'draggable2', element: draggable2 },
  ];
  return (
    <>
      <div className='absolute z-[999] right-7 top-[6rem]'>
        <Button variant='contained'>Veröffentlichen</Button>
      </div>
      <div className='flex gap-7 items-stretch h-full w-full p-7 box-border'>
        <DndContext onDragEnd={handleDragEnd}>
          <IdeaLot>
            {draggableList.map(drag =>
              !dropzones.some(x => x.dragIds.includes(drag.id)) ? drag.element : null
            )}
          </IdeaLot>
          <ExhibitionManipulator dropzones={dropzones} draggables={draggableList} parent={parent} />
        </DndContext>
      </div>
    </>
  );
};

export default ExhibitionTool;
