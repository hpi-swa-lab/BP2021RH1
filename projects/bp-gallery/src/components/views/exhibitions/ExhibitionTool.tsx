import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DraggableAttributes,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, IconButton, Paper, TextField } from '@mui/material';
import { Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';
import { useGetExhibitionQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import {
  FlatExhibition,
  FlatExhibitionPicture,
  FlatExhibitionSection,
  FlatPicture,
} from '../../../types/additionalFlatTypes';
import TextEditor from '../../common/editors/TextEditor';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import { useTranslation } from 'react-i18next';
import { createContext } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { cloneDeep } from 'lodash';

const DragListContext = createContext<DragElement[]>([]);
const DropzoneContext = createContext<DropzoneContent[]>([]);
const DraggedItemContext = createContext<string>('');
const ExhibitionContext = createContext<FlatExhibition>({} as FlatExhibition);
const SwapDropzoneContentContext = createContext<
  (dropzoneId: string, oldIndex: number, newIndex: number) => void
>(() => {});
const exhibitonTextNull = {
  title: '',
  introduction: '',
  sections: [{ id: '', title: '', text: '' }],
  epilog: '',
  sources: [''],
  isPublished: false,
};
const ExhibitionTextContext = createContext<
  [ExhibitionText, Dispatch<SetStateAction<ExhibitionText>>]
>([exhibitonTextNull, () => {}]);

const ExhibitionStateContext = createContext<ExhibitionState>({} as ExhibitionState);

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
  return (
    <ExhibitionPicture
      exhibitionPicture={exhibitionPicture}
      setNodeRef={setNodeRef}
      listeners={listeners}
      attributes={attributes}
    />
  );
};

const SortablePicture = ({
  id,
  exhibitionPicture,
}: {
  id: string;
  exhibitionPicture: FlatExhibitionPicture;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id,
  });
  return (
    <ExhibitionPicture
      exhibitionPicture={exhibitionPicture}
      setNodeRef={setNodeRef}
      listeners={listeners}
      attributes={attributes}
    />
  );
};

const ExhibitionPicture = ({
  exhibitionPicture,
  setNodeRef,
  listeners,
  attributes,
}: {
  exhibitionPicture: FlatExhibitionPicture;
  setNodeRef: (element: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}) => {
  const picture = exhibitionPicture.picture;
  return (
    <div className='z-[9] relative' ref={setNodeRef} {...listeners} {...attributes}>
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
  const { t } = useTranslation();
  const { setNodeRef } = useDroppable({ id: id });
  const draggables = useContext(DragListContext);
  const dropzones = useContext(DropzoneContext);
  const dropzone = useContext(DropzoneContext).find(x => x.id === id);
  const swapDropzoneContent = useContext(SwapDropzoneContentContext);
  const items = dropzone?.dragIds.map(id => draggables.find(draggable => draggable.id === id));
  const itemIds = items?.map(item => item?.id);
  const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>(undefined);
  const [isSort, setIsSort] = useState<boolean>(false);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = dropzone?.dragIds.findIndex((x: UniqueIdentifier) => x === active.id);
      const newIndex = dropzone?.dragIds.findIndex(
        (x: UniqueIdentifier | undefined) => x === over?.id
      );
      if (oldIndex !== undefined && newIndex !== undefined) {
        swapDropzoneContent(id, oldIndex, newIndex);
      }
    }
    setActiveId(undefined);
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
  };
  return (
    <div
      ref={setNodeRef}
      className='min-h-[9rem] border-solid rounded-xl p-2 box-border flex flex-wrap gap-2 bg-gray-200'
    >
      <div className='relative w-full'>
        <div className='absolute right-0 z-[2000]'>
          <Button variant='contained' onClick={() => setIsSort(!isSort)}>
            {isSort
              ? t('exhibition.manipulator.section.exit-sort')
              : t('exhibition.manipulator.section.sort')}
          </Button>
        </div>
      </div>
      {isSort ? (
        <DndContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <DragOverlay>
            {activeId ? items?.find(item => item?.id === activeId)?.sortableElement : null}
          </DragOverlay>
          <SortableContext items={itemIds}>
            {items?.map(item =>
              item?.id === activeId ? (
                <div key={item?.id} className='opacity-25'>
                  {item?.sortableElement}
                </div>
              ) : (
                item?.sortableElement
              )
            )}
          </SortableContext>
        </DndContext>
      ) : (
        <>
          {items?.map(item => item?.element)}
          <div className='w-full' />
        </>
      )}
    </div>
  );
};

const ExhibitionManipulator = () => {
  const exhibition = useContext(ExhibitionContext);
  // const scrollDivRef = useRef(null);
  // const scroll = useRef(0)

  return (
    <div className='flex flex-col items-stretch h-full w-full'>
      <div className='text-xl'>Ausstellungstool</div>
      <div className='border-solid flex-1 p-2 overflow-y-auto'>
        <Introduction />
        {exhibition.exhibition_sections?.map(section => (
          <Section key={section.id} id={section.id} />
        ))}
      </div>
    </div>
  );
};

const Introduction = () => {
  const { t } = useTranslation();
  const [exhibitionText, setExhibitionText] = useContext(ExhibitionTextContext);
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
        placeholder={t('exhibition.manipulator.intro.title-placeholder')}
        value={exhibitionText.title}
      />
      <TextEditor value={exhibitionText.introduction} extraOptions={extraOptions} />
    </div>
  );
};

const Section = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const dropzone = useContext(DropzoneContext).find(x => x.id === id);
  const extraOptions = {
    preset: undefined,
    placeholder: t('exhibition.manipulator.section.text-placeholder'),
    statusbar: false,
    tabIndex: 0,
    className: 'z-0',
  };
  const [exhibitionText, setExhibitionText] = useContext(ExhibitionTextContext);
  const section = exhibitionText.sections.find(x => x.id === id);

  return (
    <Paper elevation={3}>
      <div className='flex flex-col gap-2 p-2 m-2'>
        <div className='flex'>
          <TextField
            className='flex-1'
            placeholder={t('exhibition.manipulator.section.title-placeholder')}
            variant='standard'
            value={section?.title}
          />
          <IconButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
        {isOpen && dropzone && (
          <>
            <TextEditor value={section?.text ?? ''} extraOptions={extraOptions} />
            <DropZone key={dropzone.id} id={dropzone.id} />
          </>
        )}
      </div>
    </Paper>
  );
};

interface DropzoneContent {
  id: string;
  dragIds: string[];
}

interface ExhibitionText {
  title: string;
  introduction: string;
  sections: {
    id: string;
    title: string;
    text: string;
  }[];
  epilog: string;
  sources: string[];
  isPublished: boolean;
}

interface DragElement {
  id: string;
  picture: FlatPicture;
  subtitle: string;
  element: JSX.Element;
  sortableElement: JSX.Element;
}

interface SectionState {
  id: string;
  title: string;
  text: string;
  dragElements: DragElement[];
}

interface ExhibitionState {
  title: string;
  introduction: string;
  titlePicture: DragElement;
  ideaPictures: DragElement[];
  sections: SectionState[];
  epilog: string;
  sources: string[];
  isPublished: boolean;
}

const ExhibitionStateManager = ({
  exhibition,
  children,
}: PropsWithChildren<{ exhibition: FlatExhibition }>) => {
  const buildDragElements = (exhibitionPictures: FlatExhibitionPicture[] | undefined) => {
    return exhibitionPictures?.map(exhibitionPicture => {
      return {
        id: exhibitionPicture.id,
        picture: exhibitionPicture.picture,
        subtitle: exhibitionPicture.subtitle,
        element: (
          <DraggablePicture id={exhibitionPicture.id} exhibitionPicture={exhibitionPicture} />
        ),
        sortableElement: (
          <SortablePicture id={exhibitionPicture.id} exhibitionPicture={exhibitionPicture} />
        ),
      } as DragElement;
    }) as DragElement[];
  };

  const buildSectionState = (sections: FlatExhibitionSection[] | undefined) => {
    return sections?.map(section => {
      return {
        id: section.id,
        title: section.title,
        text: section.text,
        dragElements: buildDragElements(section.exhibition_pictures),
      } as SectionState;
    }) as SectionState[];
  };
  const buildExhibitionState = (() => {
    return {
      title: exhibition.title,
      introduction: exhibition.introduction,
      titlePicture: exhibition.title_picture,
      ideaPictures: buildDragElements(exhibition.idealot_pictures),
      sections: buildSectionState(exhibition.exhibition_sections),
      epilog: exhibition.epilog,
      sources: exhibition.exhibition_sources?.map(source => source.source),
      isPublished: exhibition.is_published,
    } as ExhibitionState;
  })();

  const [exhibitionState, setExhibitionState] = useState<ExhibitionState>(buildExhibitionState);

  const getDragElement = (dragElementId: string) => {
    if (exhibitionState.ideaPictures.some(dragElement => dragElement.id === dragElementId)) {
      return exhibitionState.ideaPictures.find(dragElement => dragElement.id === dragElementId);
    }
    let dragElement;
    exhibitionState.sections.forEach(section => {
      if (section.dragElements.some(dragElement => dragElement.id === dragElementId)) {
        dragElement = section.dragElements.find(dragElement => dragElement.id === dragElementId);
      }
    });
    return dragElement;
  };

  const addDraggables = (
    dragElement: DragElement,
    exhibitionClone: ExhibitionState,
    sectionId: string | undefined
  ) => {
    if (sectionId) {
      return exhibitionClone.sections
        .find(section => section.id === sectionId)
        ?.dragElements.splice(0, 0, dragElement);
    }
    return exhibitionClone.ideaPictures.splice(0, 0, dragElement);
  };

  const removeDraggables = (dragElementId: string, exhibitionClone: ExhibitionState) => {
    exhibitionClone.sections.map(section => {
      section.dragElements.splice(
        section.dragElements.findIndex(value => value.id === dragElementId),
        1
      );
    });
    return exhibitionClone.ideaPictures.splice(
      exhibitionClone.ideaPictures.findIndex(value => value.id === dragElementId)
    );
  };

  const updateDraggables = (dragElementId: string, overId: string | undefined) => {
    //find dragElement
    const dragElement = getDragElement(dragElementId);
    if (!dragElement) return;
    const exhibitionClone = cloneDeep(exhibitionState);
    removeDraggables(dragElementId, exhibitionClone);
    addDraggables(dragElement, exhibitionClone, overId);
    setExhibitionState(exhibitionClone);
  };

  return (
    <ExhibitionStateContext.Provider value={exhibitionState}>
      <Button onClick={() => updateDraggables('2', '1')}>Test</Button>
      {children}
    </ExhibitionStateContext.Provider>
  );
};

// const DragNDropHandler = ({
//   exhibition,
//   children,
// }: PropsWithChildren<{ exhibition: FlatExhibition }>) => {
//   const buildDropzones = ((): DropzoneContent[] => {
//     return exhibition.exhibition_sections
//       ? exhibition.exhibition_sections.map(section => ({
//           id: section.id,
//           dragIds: section.exhibition_pictures?.map(picture => picture.id) || [],
//         }))
//       : [];
//   })();

//   const buildDraggableList = ((): DragElement[] => {
//     const sections: FlatExhibitionSection[] = exhibition.exhibition_sections || [];
//     const sectionItems: DragElement[] = sections
//       .map(section =>
//         section.exhibition_pictures!.map(picture => ({
//           id: picture.id,
//           subtitle: picture.subtitle,
//           picture: picture.picture,
//           element: <DraggablePicture id={picture.id} exhibitionPicture={picture} />,
//           sortableElement: <SortablePicture id={picture.id} exhibitionPicture={picture} />,
//         }))
//       )
//       .flat();

//     const idealot: FlatExhibitionPicture[] = exhibition.idealot_pictures || [];
//     const idealotItems = idealot.map(picture => ({
//       id: picture.id,
//       element: <DraggablePicture id={picture.id} exhibitionPicture={picture} />,
//       sortableElement: <SortablePicture id={picture.id} exhibitionPicture={picture} />,
//     }));
//     omitBy(idealotItems, isUndefined);
//     return sectionItems.concat(idealotItems);
//   })();

//   const [dropzones, setDropzones] = useState<DropzoneContent[]>(buildDropzones);
//   const [draggableList, setDraggableList] = useState<DragElement[]>(buildDraggableList);
//   const [draggedItem, setDraggedItem] = useState('');

//   const swapDropzoneContent = (dropzoneId: string, oldIndex: number, newIndex: number) => {
//     setDropzones(
//       dropzones.map(dropzone =>
//         dropzone.id === dropzoneId
//           ? ({
//               id: dropzone.id,
//               //swaps old with new array
//               dragIds: dropzone.dragIds.map((id, index) => {
//                 if (index === oldIndex) return dropzone.dragIds[newIndex];
//                 if (index === newIndex) return dropzone.dragIds[oldIndex];
//                 return id;
//               }),
//             } as DropzoneContent)
//           : dropzone
//       )
//     );
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { over, active } = event;

//     const addToDropzone = (dropzone: DropzoneContent, over: Over) => {
//       return dropzone.id === over.id
//         ? ({ id: dropzone.id, dragIds: [...dropzone.dragIds, active.id] } as DropzoneContent)
//         : dropzone;
//     };

//     const removeFromDropzone = (dropzone: DropzoneContent) => {
//       return dropzone.dragIds.some(x => x === active.id)
//         ? ({
//             id: dropzone.id,
//             dragIds: dropzone.dragIds.filter(x => x !== active.id),
//           } as DropzoneContent)
//         : dropzone;
//     };
//     setDraggedItem('');
//     setDropzones(
//       dropzones.map(dropzone => {
//         if (over) {
//           return addToDropzone(removeFromDropzone(dropzone), over);
//         }
//         return removeFromDropzone(dropzone);
//       })
//     );
//   };

//   const handleDragStart = (event: DragStartEvent) => {
//     const { active } = event;
//     setDropzones(
//       dropzones.map(dropzone => ({
//         ...dropzone,
//         dragIds: dropzone.dragIds.filter(x => x !== active.id),
//       }))
//     );
//     setDraggedItem(String(active.id));
//   };

//   return (
//     <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
//       <DragListContext.Provider value={draggableList}>
//         <DropzoneContext.Provider value={dropzones}>
//           <DraggedItemContext.Provider value={draggedItem}>
//             <SwapDropzoneContentContext.Provider value={swapDropzoneContent}>
//               {createPortal(
//                 <DragOverlay>
//                   {draggableList.map(drag => (drag.id === draggedItem ? drag.element : null))}
//                 </DragOverlay>,
//                 document.body
//               )}
//               {children}
//             </SwapDropzoneContentContext.Provider>
//           </DraggedItemContext.Provider>
//         </DropzoneContext.Provider>
//       </DragListContext.Provider>
//     </DndContext>
//   );
// };

const ExhibitionSaver = ({ children }: PropsWithChildren<{}>) => {
  const dropzones = useContext(DropzoneContext);
  const draggableList = useContext(DragListContext);
  const exhibition = useContext(ExhibitionContext);
  const buildExhibitionText = ((): ExhibitionText => {
    return {
      title: exhibition.title,
      introduction: exhibition.introduction,
      sections:
        exhibition.exhibition_sections?.map(section => ({
          id: section.id,
          title: section.title,
          text: section.text,
        })) || [],
      epilog: exhibition.epilog,
      sources: exhibition.exhibition_sources?.map(source => source.source) || [],
      isPublished: exhibition.is_published,
    } as ExhibitionText;
  })();

  const [exhibitionText, setExhibitionText] = useState<ExhibitionText>(buildExhibitionText);

  return (
    <ExhibitionTextContext.Provider value={[exhibitionText, setExhibitionText]}>
      {children}
    </ExhibitionTextContext.Provider>
  );
};

const ExhibitionTool = ({ exhibitionId }: { exhibitionId: string }) => {
  const { data: exhibitionData } = useGetExhibitionQuery({ variables: { exhibitionId } });
  const exhibition: FlatExhibition | undefined =
    useSimplifiedQueryResponseData(exhibitionData)?.exhibition;
  return (
    <>
      {exhibition && (
        <>
          <div className='absolute z-[999] right-7 top-[6rem]'>
            <Button variant='contained'>Veröffentlichen</Button>
          </div>
          <div className='flex gap-7 items-stretch h-full w-full p-7 box-border overflow-hidden'>
            <ExhibitionContext.Provider value={exhibition}>
              <ExhibitionStateManager exhibition={exhibition}>
                <ExhibitionSaver>
                  <IdeaLot />
                  <ExhibitionManipulator />
                </ExhibitionSaver>
              </ExhibitionStateManager>
            </ExhibitionContext.Provider>
          </div>
        </>
      )}
    </>
  );
};

export default ExhibitionTool;
