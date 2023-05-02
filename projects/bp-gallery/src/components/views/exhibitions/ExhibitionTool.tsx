import { Button } from '@mui/material';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { PropsWithChildren, useState } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
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

interface DragChildren {
  id: string;
  children: string[];
}

const ExhibitionManipulator = ({
  dropZone,
  draggables,
  parent,
}: {
  dropZone: DragChildren[];
  draggables: { id: string; element: JSX.Element }[];
  parent: any;
}) => {
  return (
    <div className='flex flex-col items-stretch h-full w-full'>
      <div className='text-xl'>Ausstellungstool</div>
      <div className='border-solid flex-1'>
        {dropZone.map(x => (
          <DropZone key={x.id} id={x.id}>
            {/*  Todo: rendere die draggables, die die gleiche Id wie x.children haben*/}
          </DropZone>
        ))}
      </div>
    </div>
  );
};

const ExhibitionTool = ({ exhibitionId }: { exhibitionId: string }) => {
  const [parent, setParent] = useState<any>(null);
  const [children, setChildren] = useState<DragChildren[]>([
    { id: '1', children: [] },
    { id: '2', children: [] },
  ]);
  const draggable = <DraggablePicture id='draggable' />;
  const draggable2 = <DraggablePicture id='draggable2' />;
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    setParent(over ? over.id : null);
    setChildren(
      children.map(x => {
        if (over) {
          return x.id === over.id
            ? ({ id: x.id, children: [...x.children, active.id] } as DragChildren)
            : x;
        }
        return x.children.some(x => x === active.id)
          ? ({ id: x.id, children: x.children.filter(x => x !== active.id) } as DragChildren)
          : x;
      })
    );
    console.log(children);
  };
  return (
    <>
      <div className='absolute z-[999] right-7 top-[6rem]'>
        <Button variant='contained'>Veröffentlichen</Button>
      </div>
      <div className='flex gap-7 items-stretch h-full w-full p-7 box-border'>
        <DndContext onDragEnd={handleDragEnd}>
          <IdeaLot>{!parent ? draggable : null}</IdeaLot>
          <ExhibitionManipulator
            dropZone={children}
            draggables={[
              { id: 'draggable', element: draggable },
              { id: 'draggable2', element: draggable2 },
            ]}
            parent={parent}
          />
        </DndContext>
      </div>
    </>
  );
};

export default ExhibitionTool;
