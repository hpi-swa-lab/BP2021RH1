import { PropsWithChildren, createContext, useState } from 'react';
import {
  FlatExhibition,
  FlatExhibitionPicture,
  FlatExhibitionSection,
  FlatPicture,
} from '../../../types/additionalFlatTypes';
import {
  useDraggable,
  DraggableAttributes,
  DragEndEvent,
  DndContext,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useSortable } from '@dnd-kit/sortable';
import PicturePreview from '../../common/picture-gallery/PicturePreview';

interface ExhibitionText {
  title: string;
  introduction: string;
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

export const ExhibitionTextContext = createContext<{
  getTitle: () => string;
  setTitle: (title: string) => void;
  getIntroduction: () => string;
  setIntroduction: (introduction: string) => void;
  getSectionTitle: (sectionId: string) => string | undefined;
  setSectionTitle: (sectionId: string, title: string) => void;
  getSectionText: (sectionId: string) => string | undefined;
  setSectionText: (sectionId: string, text: string) => void;
  getEpilog: () => string;
  setEpilog: (epilog: string) => void;
  getSources: () => string[];
  setSources: (sources: string[]) => void;
  getIsPublished: () => boolean;
  setIsPublished: (isPublished: boolean) => void;
}>({
  getTitle: () => '',
  setTitle: () => {},
  getIntroduction: () => '',
  setIntroduction: () => {},
  getSectionTitle: () => '',
  setSectionTitle: () => {},
  getSectionText: () => '',
  setSectionText: () => {},
  getEpilog: () => '',
  setEpilog: () => {},
  getSources: () => [],
  setSources: () => {},
  getIsPublished: () => false,
  setIsPublished: () => {},
});

export const ExhibitionTitlePictureContext = createContext<() => DragElement | undefined>(
  () => undefined
);

export const ExhibitionIdealotContext = createContext<() => DragElement[] | undefined>(
  () => undefined
);

export const ExhibitionSectionsContext = createContext<{
  getSection: (sectionId: string) => SectionState | undefined;
  getAllSections: () => SectionState[] | undefined;
  swapSectionDraggables: (oldIndex: number, newIndex: number, sectionId: string) => void;
  getSorting: () => boolean;
  setSorting: (isSorting: boolean) => void;
  getDraggable: (dragElementId: string) => DragElement | undefined;
}>({
  getSection: () => undefined,
  getAllSections: () => undefined,
  swapSectionDraggables: () => {},
  getSorting: () => false,
  setSorting: () => {},
  getDraggable: () => undefined,
});

export const ExhibitionSectionSwapContext = createContext<
  (oldIndex: number, newIndex: number, sectionId: string) => void
>(() => {});

const DraggablePicture = ({
  id,
  exhibitionPicture,
}: {
  id: string;
  exhibitionPicture: FlatExhibitionPicture;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      type: 'draggable',
    },
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
    data: {
      type: 'sortable',
    },
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

const buildDragElement = (exhibitionPicture: FlatExhibitionPicture | undefined) => {
  return exhibitionPicture
    ? ({
        id: exhibitionPicture.id,
        picture: exhibitionPicture.picture,
        subtitle: exhibitionPicture.subtitle,
        element: (
          <DraggablePicture
            id={exhibitionPicture.id}
            exhibitionPicture={exhibitionPicture}
            key={exhibitionPicture.id}
          />
        ),
        sortableElement: (
          <SortablePicture
            id={exhibitionPicture.id}
            exhibitionPicture={exhibitionPicture}
            key={exhibitionPicture.id}
          />
        ),
      } as DragElement)
    : undefined;
};
const buildDragElements = (exhibitionPictures: FlatExhibitionPicture[] | undefined) => {
  return exhibitionPictures?.map(exhibitionPicture =>
    buildDragElement(exhibitionPicture)
  ) as DragElement[];
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

const buildExhibitionTextState = (exhibition: FlatExhibition) => {
  return {
    title: exhibition.title,
    introduction: exhibition.introduction,
    epilog: exhibition.epilog,
    sources: exhibition.exhibition_sources?.map(source => source.source),
    isPublished: exhibition.is_published,
  } as ExhibitionText;
};

//TODO: addDraggable und removeDraggable sind beide sehr buggy, cloneDeep nicht verwenden
export const ExhibitionStateManager = ({
  exhibition,
  children,
}: PropsWithChildren<{ exhibition: FlatExhibition }>) => {
  const [exhibitionText, setTextExhibition] = useState<ExhibitionText>(
    buildExhibitionTextState(exhibition)
  );
  const [titlePicture, setTitlePicture] = useState<DragElement | undefined>(
    buildDragElement(exhibition.title_picture)
  );
  const [idealot, setIdealot] = useState<DragElement[] | undefined>(
    buildDragElements(exhibition.idealot_pictures)
  );
  const [sections, setSections] = useState<SectionState[]>(
    buildSectionState(exhibition.exhibition_sections)
  );

  const [isSorting, setIsSorting] = useState(false);

  const addToSection = (dragElement: DragElement, sectionId: string) => {
    setSections(
      sections.map(section =>
        section.id === sectionId
          ? ({
              id: section.id,
              text: section.text,
              dragElements: [...section.dragElements, dragElement],
            } as SectionState)
          : section
      )
    );
  };

  const removeFromSection = (dragElement: DragElement) => {
    setSections(
      sections.map(section =>
        section.dragElements.some(elem => elem === dragElement)
          ? ({
              id: section.id,
              text: section.text,
              dragElements: section.dragElements.filter(elem => elem !== dragElement),
            } as SectionState)
          : section
      )
    );
  };

  const getDraggable = (dragElementId: string) => {
    if (titlePicture?.id === dragElementId) return titlePicture;
    if (idealot && idealot.some(elem => elem.id === dragElementId))
      return idealot.find(elem => elem.id === dragElementId);
    return sections
      .find(section => section.dragElements.some(elem => elem.id === dragElementId))
      ?.dragElements.find(elem => elem.id === dragElementId);
  };

  const addDraggable = (
    dragElement: DragElement,
    sectionId: string | undefined,
    isTitle: boolean = false,
    isIdeaLot: boolean = false
  ) => {
    if (sectionId) return addToSection(dragElement, sectionId);
    if (isTitle) {
      if (idealot && titlePicture) setIdealot([...idealot, titlePicture]);
      setTitlePicture(dragElement);
    }
    if (isIdeaLot && idealot) return setIdealot([...idealot, dragElement]);
  };

  const removeDraggable = (dragElement: DragElement) => {
    if (titlePicture === dragElement) return setTitlePicture(undefined);
    removeFromSection(dragElement);
    setIdealot(idealot?.filter(elem => elem !== dragElement));
  };

  const swapSectionDraggables = (oldIndex: number, newIndex: number, sectionId: string) => {
    setSections(
      sections.map(section =>
        section.id === sectionId
          ? ({
              id: section.id,
              text: section.text,
              dragElements: section.dragElements.map((elem, index) => {
                if (index === oldIndex) return section.dragElements[newIndex];
                if (index === newIndex) return section.dragElements[oldIndex];
                return elem;
              }),
            } as SectionState)
          : section
      )
    );
  };

  const getSection = (sectionId: string) => {
    return sections.find(section => section.id === sectionId);
  };

  const getAllSections = () => {
    return sections;
  };

  const getSectionTitle = (sectionId: string) => {
    const section = sections.find(section => section.id === sectionId);
    return section?.title;
  };

  const getSectionText = (sectionId: string) => {
    const section = sections.find(section => section.id === sectionId);
    return section?.text;
  };

  const setSectionText = (sectionId: string, text: string) => {
    const sectionWithoutSection = sections.filter(section => section.id !== sectionId);
    const section = sections.find(section => section.id === sectionId);
    if (!section) return;
    section.text = text;
    setSections([...sectionWithoutSection, section]);
  };

  const setSectionTitle = (sectionId: string, title: string) => {
    const sectionWithoutSection = sections.filter(section => section.id !== sectionId);
    const section = sections.find(section => section.id === sectionId);
    if (!section) return;
    section.title = title;
    setSections([...sectionWithoutSection, section]);
  };

  const getIdealot = () => {
    return idealot;
  };

  const getTitlePicture = () => {
    return titlePicture;
  };

  const getSorting = () => {
    return isSorting;
  };

  const setSorting = (isSorting: boolean) => {
    setIsSorting(isSorting);
  };
  //getter and setter for title in exhibitionText
  const getTitle = () => {
    return exhibitionText.title;
  };

  const setTitle = (title: string) => {
    setTextExhibition({ ...exhibitionText, title: title });
  };

  //getter and setter for introduction in exhibitionText
  const getIntroduction = () => {
    return exhibitionText.introduction;
  };

  const setIntroduction = (introduction: string) => {
    setTextExhibition({ ...exhibitionText, introduction: introduction });
  };

  //getter and setter for epilog in exhibitionText
  const getEpilog = () => {
    return exhibitionText.epilog;
  };

  const setEpilog = (epilog: string) => {
    setTextExhibition({ ...exhibitionText, epilog: epilog });
  };

  //getter and setter for sources in exhibitionText
  const getSources = () => {
    return exhibitionText.sources;
  };

  const setSources = (sources: string[]) => {
    setTextExhibition({ ...exhibitionText, sources: sources });
  };

  return (
    <DragNDropHandler
      getDraggable={getDraggable}
      addDraggable={addDraggable}
      removeDraggable={removeDraggable}
      isSorting={isSorting}
    >
      <ExhibitionTextContext.Provider
        value={{
          getTitle,
          setTitle,
          getIntroduction,
          setIntroduction,
          getSectionText,
          setSectionText,
          getSectionTitle,
          setSectionTitle,
          getEpilog,
          setEpilog,
          getSources,
          setSources,
        }}
      >
        <ExhibitionTitlePictureContext.Provider value={getTitlePicture}>
          <ExhibitionIdealotContext.Provider value={getIdealot}>
            <ExhibitionSectionsContext.Provider
              value={{
                getSection,
                getAllSections,
                swapSectionDraggables,
                getDraggable,
                setSorting,
                getSorting,
              }}
            >
              {children}
            </ExhibitionSectionsContext.Provider>
          </ExhibitionIdealotContext.Provider>
        </ExhibitionTitlePictureContext.Provider>
      </ExhibitionTextContext.Provider>
    </DragNDropHandler>
  );
};

const DragNDropHandler = ({
  getDraggable,
  addDraggable,
  removeDraggable,
  isSorting,
  children,
}: PropsWithChildren<{
  getDraggable: (dragElementId: string) => DragElement | undefined;
  addDraggable: (
    dragElement: DragElement,
    sectionId: string | undefined,
    isTitle?: boolean,
    isIdeaLot?: boolean
  ) => void;
  removeDraggable: (dragElement: DragElement) => void;
  isSorting: boolean;
}>) => {
  const [activeDraggable, setActiveDraggable] = useState<DragElement | undefined>(undefined);

  const dragHandleEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!activeDraggable) return;
    console.log(active.id);
    removeDraggable(activeDraggable);
    if (over) {
      if (over.id === 'titleDropzone') {
        addDraggable(activeDraggable, undefined, true, false);
      } else {
        addDraggable(activeDraggable, String(over.id));
      }
    } else {
      addDraggable(activeDraggable, undefined, false, true);
    }
    setActiveDraggable(undefined);
  };

  const dragHandleStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggable = getDraggable(String(active.id));
    if (!draggable) return;
    setActiveDraggable(draggable);
    removeDraggable(draggable);
  };

  return (
    <DndContext
      onDragEnd={!isSorting ? dragHandleEnd : () => {}}
      onDragStart={!isSorting ? dragHandleStart : () => {}}
    >
      <DragOverlay>{activeDraggable && activeDraggable.element}</DragOverlay>
      {children}
    </DndContext>
  );
};
