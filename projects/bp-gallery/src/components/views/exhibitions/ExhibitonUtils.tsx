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

export const ExhibitionTitleContext = createContext<{
  getTitle: () => string;
  setTitle: (title: string) => void;
}>({
  getTitle: () => '',
  setTitle: () => {},
});

export const ExhibitionIntroductionContext = createContext<{
  getIntroduction: () => string;
  setIntroduction: (introduction: string) => void;
}>({
  getIntroduction: () => '',
  setIntroduction: () => {},
});

export const ExhibitionEpilogContext = createContext<{
  getEpilog: () => string;
  setEpilog: (epilog: string) => void;
}>({
  getEpilog: () => '',
  setEpilog: () => {},
});

export const ExhibitionSourcesContext = createContext<{
  getSources: () => string[];
  setSources: (sources: string[]) => void;
}>({
  getSources: () => [],
  setSources: () => {},
});

export const ExhibitionIsPublishedContext = createContext<{
  getIsPublished: () => boolean;
  setIsPublished: (isPublished: boolean) => void;
}>({
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
  getDraggable: (dragElementId: string) => DragElement | undefined;
}>({
  getSection: () => undefined,
  getAllSections: () => undefined,
  swapSectionDraggables: () => {},
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

const buildDragElement = (exhibitionPicture: FlatExhibitionPicture | undefined) => {
  return exhibitionPicture
    ? ({
        id: exhibitionPicture.id,
        picture: exhibitionPicture.picture,
        subtitle: exhibitionPicture.subtitle,
        element: (
          <DraggablePicture id={exhibitionPicture.id} exhibitionPicture={exhibitionPicture} />
        ),
        sortableElement: (
          <SortablePicture id={exhibitionPicture.id} exhibitionPicture={exhibitionPicture} />
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
    if (isTitle) return setTitlePicture(dragElement);
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
    >
      <ExhibitionTitleContext.Provider value={{ getTitle, setTitle }}>
        <ExhibitionIntroductionContext.Provider value={{ getIntroduction, setIntroduction }}>
          <ExhibitionEpilogContext.Provider value={{ getEpilog, setEpilog }}>
            <ExhibitionSourcesContext.Provider value={{ getSources, setSources }}>
              <ExhibitionTitlePictureContext.Provider value={getTitlePicture}>
                <ExhibitionIdealotContext.Provider value={getIdealot}>
                  <ExhibitionSectionsContext.Provider
                    value={{ getSection, getAllSections, swapSectionDraggables, getDraggable }}
                  >
                    {children}
                  </ExhibitionSectionsContext.Provider>
                </ExhibitionIdealotContext.Provider>
              </ExhibitionTitlePictureContext.Provider>
            </ExhibitionSourcesContext.Provider>
          </ExhibitionEpilogContext.Provider>
        </ExhibitionIntroductionContext.Provider>
      </ExhibitionTitleContext.Provider>
    </DragNDropHandler>
  );
};

const DragNDropHandler = ({
  getDraggable,
  addDraggable,
  removeDraggable,
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
}>) => {
  const [activeDraggable, setActiveDraggable] = useState<DragElement | undefined>(undefined);

  const dragHandleEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!activeDraggable) return;
    removeDraggable(activeDraggable);
    if (over) {
      addDraggable(activeDraggable, String(over.id));
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
    <DndContext onDragEnd={dragHandleEnd} onDragStart={dragHandleStart}>
      <DragOverlay>{activeDraggable && activeDraggable.element}</DragOverlay>
      {children}
    </DndContext>
  );
};
