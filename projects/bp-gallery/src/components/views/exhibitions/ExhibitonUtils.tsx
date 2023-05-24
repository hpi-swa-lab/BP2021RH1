import { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from 'react';
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

export const ExhibitionGetContext = createContext<{
  getTitle: () => string;
  getIntroduction: () => string;
  getSectionTitle: (sectionId: string) => string | undefined;
  getSectionText: (sectionId: string) => string | undefined;
  getEpilog: () => string | undefined;
  getSources: () => ExhibitionSource[] | undefined;
  getIsPublished: () => boolean;
  getSection: (sectionId: string) => SectionState | undefined;
  getAllSections: () => SectionState[] | undefined;
  getIdealot: () => DragElement[] | undefined;
  getTitlePicture: () => DragElement | undefined;
}>({
  getTitle: () => '',
  getIntroduction: () => '',
  getSectionTitle: () => '',
  getSectionText: () => '',
  getEpilog: () => '',
  getSources: () => [],
  getIsPublished: () => false,
  getSection: () => undefined,
  getAllSections: () => undefined,
  getIdealot: () => undefined,
  getTitlePicture: () => undefined,
});

export const ExhibitionSetContext = createContext<{
  setTitle: (title: string) => void;
  setIntroduction: (introduction: string) => void;
  setSectionTitle: (sectionId: string, title: string) => void;
  setSectionText: (sectionId: string, text: string) => void;
  setEpilog: (epilog: string) => void;
  setSource: (source: string, sourceId: string) => void;
  addSource: () => void;
  setIsPublished: (isPublished: boolean) => void;
}>({
  setTitle: () => {},
  setIntroduction: () => {},
  setSectionTitle: () => {},
  setSectionText: () => {},
  setEpilog: () => {},
  setSource: () => {},
  addSource: () => {},
  setIsPublished: () => {},
});

export const ExhibitionSectionUtilsContext = createContext<{
  swapSectionDraggables: (oldIndex: number, newIndex: number, sectionId: string) => void;
  getSorting: () => boolean;
  setSorting: (isSorting: boolean) => void;
  getDraggable: (dragElementId: string) => DragElement | undefined;
  addSection: () => void;
}>({
  swapSectionDraggables: () => {},
  getSorting: () => false,
  setSorting: () => {},
  getDraggable: () => undefined,
  addSection: () => {},
});

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

export const ExhibitionStateGetter = ({
  exhibitionText,
  titlePicture,
  idealot,
  sections,
  children,
}: PropsWithChildren<{
  exhibitionText: ExhibitionText;
  titlePicture: DragElement | undefined;
  idealot: DragElement[] | undefined;
  sections: SectionState[];
}>) => {
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

  const getIdealot = () => {
    return idealot;
  };

  const getTitlePicture = () => {
    return titlePicture;
  };

  const getTitle = () => {
    return exhibitionText.title;
  };

  //getter and setter for introduction in exhibitionText
  const getIntroduction = () => {
    return exhibitionText.introduction;
  };

  //getter and setter for epilog in exhibitionText
  const getEpilog = () => {
    return exhibitionText.epilog;
  };

  //getter and setter for sources in exhibitionText
  const getSources = () => {
    return exhibitionText.sources;
  };

  return (
    <ExhibitionGetContext.Provider
      value={{
        getTitle,
        getIntroduction,
        getSectionTitle,
        getSectionText,
        getEpilog,
        getSources,
        getSection,
        getAllSections,
        getIdealot,
        getTitlePicture,
      }}
    >
      {children}
    </ExhibitionGetContext.Provider>
  );
};

export const ExhibitionStateChanger = ({
  exhibitionId,
  exhibitionText,
  setExhibitionText,
  sections,
  setSections,
  databaseSaver,
  children,
}: PropsWithChildren<{
  exhibitionId: string;
  exhibitionText: ExhibitionText;
  setExhibitionText: Dispatch<SetStateAction<ExhibitionText>>;
  sections: SectionState[];
  setSections: Dispatch<SetStateAction<SectionState[]>>;
  databaseSaver: any; //welcher typ ist das?
}>) => {
  const setSectionText = (sectionId: string, text: string) => {
    const sectionWithoutSection = sections.filter(section => section.id !== sectionId);
    const section = sections.find(section => section.id === sectionId);
    if (!section) return;
    databaseSaver.setSectionText(sectionId, text);
    section.text = text;
    setSections([...sectionWithoutSection, section]);
  };

  const setSectionTitle = (sectionId: string, title: string) => {
    const sectionWithoutSection = sections.filter(section => section.id !== sectionId);
    const section = sections.find(section => section.id === sectionId);
    if (!section) return;
    databaseSaver.setSectionTitle(sectionId, title);
    section.title = title;
    setSections([...sectionWithoutSection, section]);
  };

  const setTitle = (title: string) => {
    databaseSaver.setTitle(exhibitionId, title);
    setExhibitionText({ ...exhibitionText, title: title });
  };

  const setIntroduction = (introduction: string) => {
    databaseSaver.setIntroduction(exhibitionId, introduction);
    setExhibitionText({ ...exhibitionText, introduction: introduction });
  };

  const setEpilog = (epilog: string) => {
    databaseSaver.setEpilog(exhibitionId, epilog);
    setExhibitionText({ ...exhibitionText, epilog: epilog });
  };

  const setSource = (source: string, sourceId: string) => {
    setExhibitionText({
      ...exhibitionText,
      sources: exhibitionText.sources.map(s =>
        s.id === sourceId ? { id: s.id, source: source } : s
      ),
    });
  };

  const addSource = async () => {
    const id = await databaseSaver.addSource(exhibitionId);
    id &&
      setExhibitionText({
        ...exhibitionText,
        sources: [...exhibitionText.sources.concat({ id: id, source: '' })],
      });
  };

  return (
    <ExhibitionSetContext.Provider
      value={{
        setTitle,
        setIntroduction,
        setSectionTitle,
        setSectionText,
        setEpilog,
        setSource,
        addSource,
      }}
    >
      {children}
    </ExhibitionSetContext.Provider>
  );
};

const ExhibitionDragNDrop = ({
  sections,
  setSections,
  databaseSaver,
  children,
  titlePicture,
  setTitlePicture,
  idealot,
  setIdealot,
  exhibitionId,
}: PropsWithChildren<{
  titlePicture: DragElement | undefined;
  setTitlePicture: Dispatch<SetStateAction<DragElement | undefined>>;
  idealot: DragElement[] | undefined;
  setIdealot: Dispatch<SetStateAction<DragElement[] | undefined>>;
  sections: SectionState[];
  setSections: Dispatch<SetStateAction<SectionState[]>>;
  databaseSaver: any; //welcher typ ist das?
  exhibitionId: string;
}>) => {
  const [isSorting, setIsSorting] = useState(false);

  const swapSectionDraggables = (oldIndex: number, newIndex: number, sectionId: string) => {
    databaseSaver.swapOrderInExhibitionPicture(sections, oldIndex, newIndex, sectionId);
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

  const getSorting = () => {
    return isSorting;
  };

  const setSorting = (isSorting: boolean) => {
    setIsSorting(isSorting);
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
      if (titlePicture) {
        databaseSaver.setIdealot(exhibitionId, idealot, dragElement.id);
      }
      databaseSaver.setTitlePicture(exhibitionId, dragElement.id);
      return;
    }
    if (isIdeaLot && idealot) {
      databaseSaver.addToIdealot(exhibitionId, idealot, dragElement.id);
      return setIdealot([...idealot, dragElement]);
    }
  };

  const removeDraggable = (dragElement: DragElement) => {
    if (titlePicture && titlePicture.id === dragElement.id) {
      databaseSaver.removeTitlePicture(exhibitionId);
      setTitlePicture(undefined);
    }
    removeFromSection(dragElement);
    databaseSaver.removeFromIdealot(exhibitionId, idealot, dragElement.id);
    setIdealot(idealot?.filter(elem => elem !== dragElement));
  };

  const addToSection = (dragElement: DragElement, sectionId: string) => {
    databaseSaver.addToSection(sections, dragElement, sectionId);
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
    databaseSaver.removeFromSection(sections, dragElement);
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

  const addSection = async () => {
    const id = await databaseSaver.createNewSection(exhibitionId);
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

  return (
    <ExhibitionSectionUtilsContext.Provider
      value={{
        swapSectionDraggables,
        setSorting,
        getSorting,
        getDraggable,
        addSection,
      }}
    >
      <DragNDropHandler
        getDraggable={getDraggable}
        addDraggable={addDraggable}
        removeDraggable={removeDraggable}
        isSorting={isSorting}
      >
        {children}
      </DragNDropHandler>
    </ExhibitionSectionUtilsContext.Provider>
  );
};

const ExhibitionDatabaseSaver = (
  updateExhibitionSection,
  updateExhibitionPicture,
  updateExhibitionSource,
  updateExhibition,
  createSection,
  createSource
) => {
  return {
    setSectionText: (id: string, text: string) => {
      updateExhibitionSection({
        variables: {
          id: id,
          text: text,
        },
      });
    },
    addToSection: (sections: SectionState[], dragElement: DragElement, sectionId: string) => {
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
    },
    removeFromSection: (sections: SectionState[], dragElement: DragElement) => {
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
    },
    setTitlePicture: (exhibitionId: string, pictureId: string) => {
      updateExhibition({
        variables: {
          id: exhibitionId,
          data: {
            title_picture: pictureId,
          },
        },
      });
    },
    addToIdealot: (exhibitionId: string, idealot: DragElement[] | undefined, itemId: string) => {
      const ideaLotPictureIds = idealot
        ? idealot
            .map(elem => elem.id)
            .flat()
            .concat(itemId)
        : [itemId];
      updateExhibition({
        variables: {
          id: exhibitionId,
          data: {
            idealot_pictures: ideaLotPictureIds,
          },
        },
      });
    },
    removeTitlePicture: (exhibitionId: string) => {
      updateExhibition({
        variables: {
          id: exhibitionId,
          data: {
            title_picture: null,
          },
        },
      });
    },
    removeFromIdealot: (exhibitionId: string, idealot: DragElement[], itemId: string) => {
      const idealotPictureIds = idealot.filter(elem => elem.id !== itemId).map(elem => elem.id);
      updateExhibition({
        variables: {
          id: exhibitionId,
          data: {
            idealot_pictures: idealotPictureIds,
          },
        },
      });
    },
    swapOrderInExhibitionPicture: (
      sections: SectionState[],
      oldIndex: number,
      newIndex: number,
      sectionId: string
    ) => {
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
            data: {
              order: newIndex,
              subtitle: currentDragElement.subtitle,
            },
          },
        });
      otherDragElement &&
        updateExhibitionPicture({
          variables: {
            id: otherDragElement.id,
            data: {
              order: oldIndex,
              subtitle: otherDragElement.subtitle,
            },
          },
        });
    },

    setSectionTitle: (sectionId: string, title: string) => {
      updateExhibitionSection({
        variables: {
          id: sectionId,
          title: title,
        },
      });
    },

    createNewSection: async (exhibitionId: string) => {
      const result = await createSection({ variables: { exhibitionId: exhibitionId } });
      const id = result.data?.createExhibitionSection?.data?.id;
      return id;
    },

    setTitle: (exhibitionId: string, title: string) => {
      updateExhibition({
        variables: {
          id: exhibitionId,
          data: {
            title: title,
          },
        },
      });
    },

    setIntroduction: (exhibitionId: string, introduction: string) => {
      updateExhibition({
        variables: {
          id: exhibitionId,
          data: {
            introduction: introduction,
          },
        },
      });
    },

    setEpilog: (exhibitionId: string, epilog: string) => {
      updateExhibition({
        variables: {
          id: exhibitionId,
          data: {
            epilog: epilog,
          },
        },
      });
    },

    setSource: (source: string, sourceId: string) => {
      updateExhibitionSource({ variables: { id: sourceId, source: source } });
    },

    addSource: async (exhibitionId: string) => {
      const result = await createSource({ variables: { exhibitionId: exhibitionId } });
      const id = result.data?.createExhibitionSource?.data?.id;
      return id;
    },
  };
};

export const ExhibitionStateManager = ({
  exhibition,
  children,
}: PropsWithChildren<{ exhibition: FlatExhibition }>) => {
  const [exhibitionText, setExhibitionText] = useState<ExhibitionText>(
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

  const [updateExhibitionPicture] = useUpdateExhibitionPictureMutation();

  const [updateExhibitionSection] = useUpdateExhibitionSectionMutation();

  const [updateExhibitionSource] = useUpdateExhibitionSourceMutation();

  const [updateExhibition] = useUpdateExhibitionMutation();

  const [createSource] = useCreateExhibitionSourceMutation();

  const [createSection] = useCreateExhibitionSectionMutation();

  const databaseSaver = ExhibitionDatabaseSaver(
    updateExhibitionSection,
    updateExhibitionPicture,
    updateExhibitionSource,
    updateExhibition,
    createSection,
    createSource
  );
  return (
    <ExhibitionStateGetter
      exhibitionText={exhibitionText}
      titlePicture={titlePicture}
      idealot={idealot}
      sections={sections}
    >
      <ExhibitionStateChanger
        exhibitionId={exhibition.id}
        exhibitionText={exhibitionText}
        setExhibitionText={setExhibitionText}
        sections={sections}
        setSections={setSections}
        databaseSaver={databaseSaver}
      >
        <ExhibitionDragNDrop
          sections={sections}
          setSections={setSections}
          databaseSaver={databaseSaver}
          titlePicture={titlePicture}
          setTitlePicture={setTitlePicture}
          idealot={idealot}
          setIdealot={setIdealot}
          exhibitionId={exhibition.id}
        >
          {children}
        </ExhibitionDragNDrop>
      </ExhibitionStateChanger>
    </ExhibitionStateGetter>
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
