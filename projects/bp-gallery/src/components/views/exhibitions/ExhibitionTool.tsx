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
import { Button, IconButton, Paper, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { useGetIdeaLotContentQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatExhibitionPicture } from '../../../types/additionalFlatTypes';
import TextEditor from '../../common/editors/TextEditor';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import { useTranslation } from 'react-i18next';
import { createContext } from 'react';

const DraggablePicture = ({
  id,
  exhibitionPicture,
}: {
  id: string;
  exhibitionPicture: FlatExhibitionPicture;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const picture = exhibitionPicture.picture;
  return (
    <div className='z-[1000] relative' ref={setNodeRef} {...listeners} {...attributes}>
      {picture && <PicturePreview height='9rem' picture={picture} onClick={() => {}} />}
    </div>
  );
};

const IdeaLot = () => {
  const draggableList = useContext(DragListContext);
  const dropzones = useContext(DropzoneContext);
  const draggedItem = useContext(DraggedItemContext);
  return (
    <div className='flex flex-col items-stretch h-full w-full relative'>
      <div className='text-xl'>Ideenparkplatz</div>
      <div className='border-solid flex-1 flex gap-2 '>
        {draggableList.map(drag =>
          drag.id !== draggedItem && !dropzones.some(x => x.dragIds.includes(drag.id))
            ? drag.element
            : null
        )}
      </div>
    </div>
  );
};

const DropZone = ({ id }: { id: string }) => {
  const { setNodeRef } = useDroppable({ id: id });
  const draggables = useContext(DragListContext);
  const dropzone = useContext(DropzoneContext).find(x => x.id === id);
  const items = draggables.filter(draggable => dropzone?.dragIds.includes(draggable.id));
  const itemIds = items.map(item => item.id);
  const itemElements = items.map(item => item.element);

  return (
    <div
      ref={setNodeRef}
      className='h-40 border-solid rounded-xl p-2 box-border flex flex-wrap gap-2 bg-gray-200'
    >
      {/* <DndContext>
        <SortableContext items={itemIds}>{itemElements}</SortableContext>
      </DndContext> */}
      {itemElements}
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

const ExhibitionManipulator = () => {
  const dropzones = useContext(DropzoneContext);
  return (
    <div className='flex flex-col items-stretch h-full w-full'>
      <div className='text-xl'>Ausstellungstool</div>
      <div className='border-solid flex-1 p-2 overflow-auto'>
        <Introduction />
        {dropzones.map(dropzone => (
          <Section key={dropzone.id} id={dropzone.id} />
        ))}
      </div>
    </div>
  );
};

const editorOptions = ({ placeholder }: { placeholder: string }) => {
  return {
    preset: undefined,
    placeholder: placeholder,
    statusbar: false,
    tabIndex: 0,
    className: 'z-0',
  };
};

const Introduction = () => {
  const { t } = useTranslation();
  const extraOptions = {
    preset: undefined,
    placeholder: t('exhibition.manipulator.intro-text-placeholder'),
    statusbar: false,
    tabIndex: 0,
    className: 'z-0',
  };
  return (
    <div className='flex flex-col gap-2'>
      <TextField
        className='flex-1'
        variant='standard'
        placeholder={t('exhibition.manipulator.intro-title-placeholder')}
      />
      <TextEditor value='' extraOptions={extraOptions} />
    </div>
  );
};

const Section = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const dropzone = useContext(DropzoneContext).find(x => x.id === id);
  const extraOptions = {
    preset: undefined,
    placeholder: t('exhibition.manipulator.intro-text-placeholder'),
    statusbar: false,
    tabIndex: 0,
    className: 'z-0',
  };
  return (
    <Paper elevation={3}>
      <div className='flex flex-col gap-2 p-2 m-2'>
        <div className='flex'>
          <TextField className='flex-1' placeholder='Abschnittstitel' variant='standard' />
          <IconButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
        {isOpen && dropzone && (
          <>
            <TextEditor value='' extraOptions={extraOptions} />
            <DropZone key={dropzone.id} id={dropzone.id} />
          </>
        )}
      </div>
    </Paper>
  );
};

const DragListContext = createContext<DragElement[]>([]);
const DropzoneContext = createContext<DropzoneContent[]>([]);
const DraggedItemContext = createContext<string>('');

const getDraggableList = (ideaLotPictures: FlatExhibitionPicture[]): DragElement[] => {
  return ideaLotPictures.map(picture => ({
    id: picture.id,
    element: <DraggablePicture id={picture.id} exhibitionPicture={picture} />,
  }));
};

const ExhibitionTool = ({ exhibitionId }: { exhibitionId: string }) => {
  const [dropzones, setDropzones] = useState<DropzoneContent[]>([
    { id: '1', dragIds: [] },
    { id: '2', dragIds: [] },
  ]);
  const [draggedItem, setDraggedItem] = useState('');
  const { data: ideaLotData } = useGetIdeaLotContentQuery({ variables: { exhibitionId: '1' } });
  const ideaLotPictures: FlatExhibitionPicture[] | undefined =
    useSimplifiedQueryResponseData(ideaLotData)?.exhibition.idealot_pictures;

  const draggableList = getDraggableList(ideaLotPictures ?? []);
  // const { data: pictureOne } = useGetPictureInfoQuery({ variables: { pictureId: '6' } });
  // const picture1: FlatPicture | undefined = useSimplifiedQueryResponseData(pictureOne)?.picture;
  // const { data: pictureTwo } = useGetPictureInfoQuery({ variables: { pictureId: '5' } });
  // const picture2: FlatPicture | undefined = useSimplifiedQueryResponseData(pictureTwo)?.picture;
  // const draggable = <DraggablePicture key='1' id='draggable' picture={picture1} />;
  // const draggable2 = <DraggablePicture key='2' id='draggable2' picture={picture2} />;
  // const draggableList = [
  //   { id: 'draggable', element: draggable },
  //   { id: 'draggable2', element: draggable2 },
  // ];

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
    setDraggedItem('');
    setDropzones(
      dropzones.map(dropzone => {
        if (over) {
          return addToDropzone(removeFromDropzone(dropzone), over);
        }
        return removeFromDropzone(dropzone);
      })
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDropzones(
      dropzones.map(dropzone => ({
        ...dropzone,
        dragIds: dropzone.dragIds.filter(x => x !== active.id),
      }))
    );
    setDraggedItem(String(active.id));
  };
  return (
    <>
      <div className='absolute z-[999] right-7 top-[6rem]'>
        <Button variant='contained'>Veröffentlichen</Button>
      </div>
      <div className='flex gap-7 items-stretch h-full w-full p-7 box-border overflow-hidden'>
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <DragListContext.Provider value={draggableList}>
            <DropzoneContext.Provider value={dropzones}>
              <DraggedItemContext.Provider value={draggedItem}>
                <DragOverlay>
                  {draggableList.map(drag => (drag.id === draggedItem ? drag.element : null))}
                </DragOverlay>
                <IdeaLot />
                <ExhibitionManipulator />
              </DraggedItemContext.Provider>
            </DropzoneContext.Provider>
          </DragListContext.Provider>
        </DndContext>
      </div>
    </>
  );
};

export default ExhibitionTool;
