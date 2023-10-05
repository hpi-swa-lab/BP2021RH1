import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
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
import { useSortable, arrayMove } from '@dnd-kit/sortable';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import {
  useCreateExhibitionPictureMutation,
  useCreateExhibitionSectionMutation,
  useDeleteExhibitionPictureMutation,
  useDeleteExhibitionSectionMutation,
  useUpdateExhibitionMutation,
  useUpdateExhibitionPictureMutation,
  useUpdateExhibitionSectionMutation,
} from '../../../graphql/APIConnector';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface ExhibitionText {
  title: string;
  introduction: string;
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
  order: number;
  nextOrder: number;
  dragElements: DragElement[];
}

export const ExhibitionGetContext = createContext<{
  getExhibitionId: () => string;
  getTitle: () => string;
  getIntroduction: () => string;
  getSectionTitle: (sectionId: string) => string | undefined;
  getSectionText: (sectionId: string) => string | undefined;
  getIsPublished: () => boolean;
  getSection: (sectionId: string) => SectionState | undefined;
  getAllSections: () => SectionState[] | undefined;
  getIdealot: () => DragElement[] | undefined;
  getTitlePicture: () => DragElement | undefined;
}>({
  getExhibitionId: () => '',
  getTitle: () => '',
  getIntroduction: () => '',
  getSectionTitle: () => '',
  getSectionText: () => '',
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
  toggleIsPublished: () => void;
  deleteExhibitionPicture: (exhibitionPictureId: string) => void;
}>({
  setTitle: () => {},
  setIntroduction: () => {},
  setSectionTitle: () => {},
  setSectionText: () => {},
  toggleIsPublished: () => {},
  deleteExhibitionPicture: () => {},
});

export const ExhibitionSectionUtilsContext = createContext<{
  moveSections: (oldSectionId: string, newSectionId: string) => void;
  swapSectionDraggables: (oldIndex: number, newIndex: number, sectionId: string) => void;
  getSorting: () => boolean;
  setSorting: (isSorting: boolean) => void;
  getDraggable: (dragElementId: string) => DragElement | undefined;
  addSection: () => void;
  deleteSection: (sectionId: string) => void;
}>({
  moveSections: () => {},
  swapSectionDraggables: () => {},
  getSorting: () => false,
  setSorting: () => {},
  getDraggable: () => undefined,
  addSection: () => {},
  deleteSection: () => {},
});

const DraggablePicture = ({
  id,
  exhibitionPicture,
}: {
  id: string;
  exhibitionPicture: FlatExhibitionPicture;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
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
  const { attributes, listeners, setNodeRef } = useSortable({
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
  const { deleteExhibitionPicture } = useContext(ExhibitionSetContext);
  return (
    <div className='relative'>
      <div className='z-[99] absolute top-0 right-0'>
        <IconButton
          style={{ backgroundColor: 'white' }}
          onClick={() => {
            console.log('press');
            deleteExhibitionPicture(exhibitionPicture.id);
          }}
        >
          <Delete />
        </IconButton>
      </div>
      <div className='z-[9]' ref={setNodeRef} {...listeners} {...attributes}>
        {picture && <PicturePreview height='9rem' picture={picture} onClick={() => {}} />}
      </div>
    </div>
  );
};

const buildDragElement = (exhibitionPicture: FlatExhibitionPicture | undefined) => {
  return exhibitionPicture
    ? {
        id: exhibitionPicture.id,
        picture: exhibitionPicture.picture ?? { id: '0' },
        order: exhibitionPicture.order ?? 0,
        subtitle: exhibitionPicture.subtitle ?? '',
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
      }
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
      title: section.title ?? '',
      order: section.order ?? 0,
      nextOrder: section.exhibition_pictures?.length ?? 0,
      text: section.text ?? '',
      dragElements: buildDragElements(section.exhibition_pictures),
    };
  }) as SectionState[];
};

const buildExhibitionTextState = (exhibition: FlatExhibition) => {
  return {
    title: exhibition.title ?? '',
    introduction: exhibition.introduction ?? '',
    isPublished: exhibition.is_published ?? false,
  };
};

export const ExhibitionStateGetter = ({
  exhibitionId,
  exhibitionText,
  titlePicture,
  idealot,
  sections,
  children,
}: PropsWithChildren<{
  exhibitionId: string;
  exhibitionText: ExhibitionText;
  titlePicture: DragElement | undefined;
  idealot: DragElement[] | undefined;
  sections: SectionState[];
}>) => {
  const getExhibitionId = () => {
    return exhibitionId;
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

  const getIsPublished = () => {
    return exhibitionText.isPublished;
  };

  return (
    <ExhibitionGetContext.Provider
      value={{
        getExhibitionId,
        getTitle,
        getIntroduction,
        getSectionTitle,
        getSectionText,
        getSection,
        getAllSections,
        getIdealot,
        getTitlePicture,
        getIsPublished,
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
  titlePicture,
  setTitlePicture,
  idealot,
  setIdealot,
  children,
}: PropsWithChildren<{
  exhibitionId: string;
  exhibitionText: ExhibitionText;
  setExhibitionText: Dispatch<SetStateAction<ExhibitionText>>;
  sections: SectionState[];
  setSections: Dispatch<SetStateAction<SectionState[]>>;
  databaseSaver: ReturnType<typeof useExhibitionDatabaseSaver>;
  titlePicture: DragElement | undefined;
  setTitlePicture: Dispatch<SetStateAction<DragElement | undefined>>;
  idealot: DragElement[] | undefined;
  setIdealot: Dispatch<SetStateAction<DragElement[]>>;
}>) => {
  const deleteExhibitionPicture = (exhibitionPictureId: string) => {
    databaseSaver.deletePicture(exhibitionPictureId);
    setSections(
      sections.map(section => ({
        ...section,
        dragElements: section.dragElements.filter(elem => elem.id !== exhibitionPictureId),
      }))
    );
    setTitlePicture(titlePicture =>
      titlePicture?.id === exhibitionPictureId ? undefined : titlePicture
    );
    setIdealot(idealot => idealot.filter(elem => elem.id !== exhibitionPictureId));
  };

  const setSectionText = (sectionId: string, text: string) => {
    databaseSaver.setSectionText(sectionId, text);
    setSections(
      sections.map(section => (section.id === sectionId ? { ...section, text: text } : section))
    );
  };

  const setSectionTitle = (sectionId: string, title: string) => {
    databaseSaver.setSectionTitle(sectionId, title);
    setSections(
      sections.map(section => (section.id === sectionId ? { ...section, title: title } : section))
    );
  };

  const setTitle = (title: string) => {
    databaseSaver.setTitle(exhibitionId, title);
    setExhibitionText({ ...exhibitionText, title: title });
  };

  const setIntroduction = (introduction: string) => {
    databaseSaver.setIntroduction(exhibitionId, introduction);
    setExhibitionText({ ...exhibitionText, introduction: introduction });
  };

  const toggleIsPublished = () => {
    databaseSaver.setIsPublished(!exhibitionText.isPublished, exhibitionId);
    setExhibitionText({ ...exhibitionText, isPublished: !exhibitionText.isPublished });
  };

  return (
    <ExhibitionSetContext.Provider
      value={{
        setTitle,
        setIntroduction,
        setSectionTitle,
        setSectionText,
        toggleIsPublished,
        deleteExhibitionPicture,
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
  setIdealot: Dispatch<SetStateAction<DragElement[]>>;
  sections: SectionState[];
  setSections: Dispatch<SetStateAction<SectionState[]>>;
  databaseSaver: ReturnType<typeof useExhibitionDatabaseSaver>;
  exhibitionId: string;
}>) => {
  const [isSorting, setIsSorting] = useState(false);

  const sectionMove = (oldIndex: string, newIndex: string) => {};
  const moveSections = (oldSectionId: string, newSectionId: string) => {
    const oldIndex = sections.indexOf(sections.find(section => section.id === oldSectionId)!);
    const newIndex = sections.indexOf(sections.find(section => section.id === newSectionId)!);
    const newSectionOrder = arrayMove(sections, oldIndex, newIndex);
    databaseSaver.updateSectionsOrder(newSectionOrder);
    setSections(newSectionOrder);
  };
  const deleteSection = (sectionId: string) => {
    databaseSaver.deleteSection(sectionId);
    setSections(sections => sections.filter(section => section.id !== sectionId));
  };
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
    if (idealot?.some(elem => elem.id === dragElementId))
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
        databaseSaver.addToIdealot(exhibitionId, idealot, dragElement.id);
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
    if (!idealot) return;
    databaseSaver.removeFromIdealot(exhibitionId, idealot, dragElement.id);
    setIdealot(idealot.filter(elem => elem !== dragElement));
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
    const order = sections.reduce((max, value) => Math.max(max, value.order), 0);
    const id = await databaseSaver.createNewSection(exhibitionId, order + 1);
    id &&
      setSections([
        ...sections,
        {
          id: id,
          title: '',
          text: '',
          order: order + 1,
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
        deleteSection,
        moveSections,
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

const useExhibitionDatabaseSaver = () => {
  const [updateExhibitionPicture] = useUpdateExhibitionPictureMutation({
    refetchQueries: ['getExhibition'],
  });

  const [updateExhibitionSection] = useUpdateExhibitionSectionMutation({
    refetchQueries: ['getExhibition'],
  });

  const [updateExhibition] = useUpdateExhibitionMutation({ refetchQueries: ['getExhibition'] });

  const [createSection] = useCreateExhibitionSectionMutation({ refetchQueries: ['getExhibition'] });

  const [createExhibitionPicture] = useCreateExhibitionPictureMutation({
    refetchQueries: ['getExhibition'],
  });

  const [deleteExhibitionPicture] = useDeleteExhibitionPictureMutation({
    refetchQueries: ['getExhibition'],
  });
  const [deleteExhibitionSection] = useDeleteExhibitionSectionMutation({
    refetchQueries: ['getExhibition'],
  });
  return {
    deleteSection: (id: string) => {
      deleteExhibitionSection({ variables: { id: id } });
    },
    deletePicture: (id: string) => {
      deleteExhibitionPicture({
        variables: { id: id },
      });
    },
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
    updateSectionsOrder: (sections: SectionState[]) => {
      sections.forEach((section, index) => {
        console.log(`${section.title} : ${index}`);
        updateExhibitionSection({
          variables: {
            id: section.id,
            order: index,
          },
        });
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

    createNewSection: async (exhibitionId: string, order: number) => {
      const result = await createSection({
        variables: {
          exhibitionId: exhibitionId,
          order: order,
          publishedAt: new Date().toISOString(),
        },
      });
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

    setIsPublished: (isPublished: boolean, exhibitionId: string) => {
      updateExhibition({
        variables: {
          id: exhibitionId,
          data: {
            is_published: isPublished,
          },
        },
      });
    },
    addExhibitionPicture: async (exhibitionId: string, pictureId: string) => {
      await createExhibitionPicture({
        variables: {
          exhibitionIdealotId: exhibitionId,
          pictureId: pictureId,
          publishedAt: new Date().toISOString(),
        },
        refetchQueries: ['getExhibition'],
      });
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
  const [idealot, setIdealot] = useState<DragElement[]>(
    buildDragElements(exhibition.idealot_pictures)
  );
  const [sections, setSections] = useState<SectionState[]>(
    buildSectionState(exhibition.exhibition_sections)
  );

  useEffect(() => {
    setIdealot(buildDragElements(exhibition.idealot_pictures));
  }, [setIdealot, exhibition]);

  const databaseSaver = useExhibitionDatabaseSaver();

  return (
    <ExhibitionStateGetter
      exhibitionId={exhibition.id}
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
        titlePicture={titlePicture}
        setTitlePicture={setTitlePicture}
        idealot={idealot}
        setIdealot={setIdealot}
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

export const ExhibitionStateViewer = ({
  exhibition,
  children,
}: PropsWithChildren<{ exhibition: FlatExhibition }>) => {
  const exhibitionText = buildExhibitionTextState(exhibition);
  const titlePicture = buildDragElement(exhibition.title_picture);

  const idealot = buildDragElements(exhibition.idealot_pictures);

  const sections = buildSectionState(exhibition.exhibition_sections);

  return (
    <ExhibitionStateGetter
      exhibitionId={exhibition.id}
      exhibitionText={exhibitionText}
      sections={sections}
      idealot={idealot}
      titlePicture={titlePicture}
    >
      {children}
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
    const { over } = event;
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
      <DragOverlay>{activeDraggable?.element}</DragOverlay>
      {children}
    </DndContext>
  );
};
