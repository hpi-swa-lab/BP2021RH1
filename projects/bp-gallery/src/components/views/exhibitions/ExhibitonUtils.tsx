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
import {
  useCreateExhibitionSectionMutation,
  useCreateExhibitionSourceMutation,
  useUpdateExhibitionMutation,
  useUpdateExhibitionPictureMutation,
  useUpdateExhibitionSectionMutation,
  useUpdateExhibitionSourceMutation,
} from '../../../graphql/APIConnector';

interface ExhibitionSource {
  id: string;
  source: string;
}

interface ExhibitionText {
  title: string;
  introduction: string;
  epilog: string;
  sources: ExhibitionSource[];
  isPublished: boolean;
}

interface DragElement {
  id: string;
  picture: FlatPicture;
  subtitle: string;
  order: number;
  element: JSX.Element;
  sortableElement: JSX.Element;
}

interface SectionState {
  id: string;
  title: string;
  text: string;
  nextOrder: number;
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
  getEpilog: () => string | undefined;
  setEpilog: (epilog: string) => void;
  getSources: () => ExhibitionSource[] | undefined;
  setSource: (source: string, sourceId: string) => void;
  addSource: () => void;
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
  setSource: () => {},
  addSource: () => {},
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
        order: exhibitionPicture.order,
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
      nextOrder: section.exhibition_pictures?.length ?? 0,
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
    sources: exhibition.exhibition_sources?.map(source => {
      return { id: source.id, source: source.source } as ExhibitionSource;
    }) as ExhibitionSource[],
    isPublished: exhibition.is_published,
  } as ExhibitionText;
};

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

  const [updateExhibitionPicture] = useUpdateExhibitionPictureMutation();

  const [updateExhibitionSection] = useUpdateExhibitionSectionMutation();

  const [updateExhibitionSource] = useUpdateExhibitionSourceMutation();

  const [updateExhibition] = useUpdateExhibitionMutation();

  const [createSource] = useCreateExhibitionSourceMutation();

  const [createSection] = useCreateExhibitionSectionMutation();

  const addToSection = (dragElement: DragElement, sectionId: string) => {
    const section = sections.find(section => section.id === sectionId);
    const exhibitionPictureIds = section?.dragElements
      .map(dragElem => dragElem.id)
      .flat()
      .concat(dragElement.id);
    section &&
      exhibitionPictureIds &&
      updateExhibitionSection({
        variables: {
          id: sectionId,
          title: section.title,
          text: section.text,
          exhibitionPictureIds: exhibitionPictureIds,
        },
      });

    // set GUI
    setSections(
      sections.map(section =>
        section.id === sectionId
          ? ({
              id: section.id,
              text: section.text,
              nextOrder: section.nextOrder + 1,
              dragElements: [...section.dragElements, { ...dragElement, order: section.nextOrder }],
            } as SectionState)
          : section
      )
    );
  };

  const removeFromSection = (dragElement: DragElement) => {
    const section = sections.find(section =>
      section.dragElements.some(elem => elem === dragElement)
    );
    const exhibitionPictureIds = section?.dragElements
      .map(dragElem => dragElem.id)
      .flat()
      .filter(id => id !== dragElement.id);
    section &&
      exhibitionPictureIds &&
      updateExhibitionSection({
        variables: {
          id: section.id,
          title: section.title,
          text: section.text,
          exhibitionPictureIds: exhibitionPictureIds,
        },
      });

    //Set GUI
    setSections(
      sections.map(section =>
        section.dragElements.some(elem => elem === dragElement)
          ? ({
              id: section.id,
              text: section.text,
              nextOrder: section.nextOrder - 1,
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
      let ideaLotPictureIds = idealot?.map(elem => elem.id).flat();
      if (titlePicture) {
        ideaLotPictureIds = ideaLotPictureIds?.concat(titlePicture.id);
      }
      updateExhibition({
        variables: {
          id: exhibition.id,
          data: {
            title_picture: dragElement.id,
            idealot_pictures: ideaLotPictureIds,
          },
        },
      });
      return;
    }
    if (isIdeaLot && idealot) {
      const ideaLotPictureIds = idealot
        .map(elem => elem.id)
        .flat()
        .concat(dragElement.id);
      updateExhibition({
        variables: {
          id: exhibition.id,
          data: {
            idealot_pictures: ideaLotPictureIds,
          },
        },
      });
      return setIdealot([...idealot, dragElement]);
    }
  };

  //TODO: remove from idealot doesnt work
  const removeDraggable = (dragElement: DragElement) => {
    console.log(dragElement.id + ' ' + titlePicture?.id);
    if (titlePicture && titlePicture.id === dragElement.id) {
      updateExhibition({
        variables: {
          id: exhibition.id,
          data: {
            title_picture: null,
          },
        },
      });
      setTitlePicture(undefined);
    }
    removeFromSection(dragElement);
    const idealotPictureIds = idealot
      ?.filter(elem => elem.id !== dragElement.id)
      .map(elem => elem.id);
    updateExhibition({
      variables: {
        id: exhibition.id,
        data: {
          idealot_pictures: idealotPictureIds,
        },
      },
    });
    setIdealot(idealot?.filter(elem => elem !== dragElement));
  };

  const swapSectionDraggables = (oldIndex: number, newIndex: number, sectionId: string) => {
    const currentDragElement = sections.find(section => section.id === sectionId)?.dragElements[
      oldIndex
    ];
    const otherDragElement = sections.find(section => section.id === sectionId)?.dragElements[
      newIndex
    ];
    currentDragElement &&
      updateExhibitionPicture({
        variables: {
          id: currentDragElement.id,
          order: newIndex,
          subtitle: currentDragElement.subtitle,
        },
      });
    otherDragElement &&
      updateExhibitionPicture({
        variables: {
          id: otherDragElement.id,
          order: oldIndex,
          subtitle: otherDragElement.subtitle,
        },
      });
    setSections(buildSectionState(exhibition.exhibition_sections));
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
    updateExhibitionSection({
      variables: {
        id: section.id,
        text: text,
      },
    });
    section.text = text;
    setSections([...sectionWithoutSection, section]);
  };

  const setSectionTitle = (sectionId: string, title: string) => {
    const sectionWithoutSection = sections.filter(section => section.id !== sectionId);
    const section = sections.find(section => section.id === sectionId);
    if (!section) return;
    updateExhibitionSection({
      variables: {
        id: section.id,
        title: title,
      },
    });
    section.title = title;
    setSections([...sectionWithoutSection, section]);
  };

  const addSection = async () => {
    const result = await createSection({ variables: { exhibitionId: exhibition.id } });
    const id = result.data?.createExhibitionSection?.data?.id;
    id &&
      setSections([
        ...sections,
        {
          id: id,
          title: '',
          text: '',
          nextOrder: sections.reduce((max, value) => Math.max(max, value.nextOrder), 0),
          dragElements: [],
        } as SectionState,
      ]);
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
    updateExhibition({
      variables: {
        id: exhibition.id,
        data: {
          title: title,
        },
      },
    });
    setTextExhibition({ ...exhibitionText, title: title });
  };

  //getter and setter for introduction in exhibitionText
  const getIntroduction = () => {
    return exhibitionText.introduction;
  };

  const setIntroduction = (introduction: string) => {
    updateExhibition({
      variables: {
        id: exhibition.id,
        data: {
          introduction: introduction,
        },
      },
    });
    setTextExhibition({ ...exhibitionText, introduction: introduction });
  };

  //getter and setter for epilog in exhibitionText
  const getEpilog = () => {
    return exhibitionText.epilog;
  };

  const setEpilog = (epilog: string) => {
    updateExhibition({
      variables: {
        id: exhibition.id,
        data: {
          epilog: epilog,
        },
      },
    });
    setTextExhibition({ ...exhibitionText, epilog: epilog });
  };

  //getter and setter for sources in exhibitionText
  const getSources = () => {
    return exhibitionText.sources;
  };

  const setSource = (source: string, sourceId: string) => {
    updateExhibitionSource({ variables: { id: sourceId, source: source } });
    setTextExhibition({
      ...exhibitionText,
      sources: exhibitionText.sources.map(s =>
        s.id === sourceId ? { id: s.id, source: source } : s
      ),
    });
  };

  const addSource = async () => {
    const result = await createSource({ variables: { exhibitionId: exhibition.id } });
    const id = result.data?.createExhibitionSource?.data?.id;
    id &&
      setTextExhibition({
        ...exhibitionText,
        sources: [...exhibitionText.sources.concat({ id: id, source: '' })],
      });
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
          setSource,
          addSource,
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
