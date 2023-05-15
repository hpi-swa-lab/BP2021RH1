import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, IconButton, Paper, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { useGetExhibitionQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatExhibition } from '../../../types/additionalFlatTypes';
import TextEditor from '../../common/editors/TextEditor';
import { useTranslation } from 'react-i18next';
import {
  ExhibitionIdealotContext,
  ExhibitionIntroductionContext,
  ExhibitionSectionsContext,
  ExhibitionStateManager,
  ExhibitionTitleContext,
} from './ExhibitonUtils';
import {
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

const IdeaLot = () => {
  const idealot = useContext(ExhibitionIdealotContext)();

  return (
    <div className='flex flex-col items-stretch h-full w-full relative'>
      <div className='text-xl'>Ideenparkplatz</div>
      <div className='border-solid flex-1 flex gap-2 '>
        {idealot?.map(picture => picture.element)}
      </div>
    </div>
  );
};

const DropZone = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { setNodeRef } = useDroppable({ id });
  const swapDropzoneContent = useContext(ExhibitionSectionsContext).swapSectionDraggables;
  const section = useContext(ExhibitionSectionsContext).getSection(id);
  const itemIds = section?.dragElements.map(elem => elem.id);
  const dragItems = section?.dragElements;
  const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>(undefined);
  const activeSortable = section?.dragElements.find(elem => elem.id === activeId)?.sortableElement;
  const [isSort, setIsSort] = useState<boolean>(false);

  const dragHandleEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = section?.dragElements.findIndex(x => x.id === active.id);
      const newIndex = section?.dragElements.findIndex(x => x.id === over?.id);
      if (oldIndex !== undefined && newIndex !== undefined)
        swapDropzoneContent(oldIndex, newIndex, id);
      setActiveId(undefined);
    }
  };

  const dragHandleStart = (event: DragStartEvent) => {
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
      {isSort && itemIds ? (
        <DndContext onDragEnd={dragHandleEnd} onDragStart={dragHandleStart}>
          <DragOverlay>{activeId && activeSortable}</DragOverlay>
          <SortableContext items={itemIds}>
            {dragItems?.map(item =>
              item.id === activeId ? (
                <div key={item.id} className='opacity-25'>
                  {item.sortableElement}
                </div>
              ) : (
                item.sortableElement
              )
            )}
          </SortableContext>
        </DndContext>
      ) : (
        <>
          {dragItems?.map(item => item.element)}
          <div className='w-full' />
        </>
      )}
    </div>
  );
};

const ExhibitionManipulator = () => {
  const sections = useContext(ExhibitionSectionsContext).getAllSections();
  return (
    <div className='flex flex-col items-stretch h-full w-full'>
      <div className='text-xl'>Ausstellungstool</div>
      <div className='border-solid flex-1 p-2 overflow-y-auto'>
        <Introduction />
        {sections?.map(section => (
          <Section key={section.id} id={section.id} />
        ))}
      </div>
    </div>
  );
};

const Introduction = () => {
  const { t } = useTranslation();
  const { getTitle, setTitle } = useContext(ExhibitionTitleContext);
  const { getIntroduction, setIntroduction } = useContext(ExhibitionIntroductionContext);

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
        value={getTitle()}
        onChange={event => setTitle(event.target.value)}
      />
      <TextEditor
        value={getIntroduction()}
        extraOptions={extraOptions}
        onBlur={value => setIntroduction(value)}
      />
    </div>
  );
};

const Section = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const section = useContext(ExhibitionSectionsContext).getSection(id);

  const extraOptions = {
    preset: undefined,
    placeholder: t('exhibition.manipulator.section.text-placeholder'),
    statusbar: false,
    tabIndex: 0,
    className: 'z-0',
  };

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
        {isOpen && section && (
          <>
            <TextEditor value={section.text} extraOptions={extraOptions} />
            <DropZone key={section.id} id={section.id} />
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
            <ExhibitionStateManager exhibition={exhibition}>
              <IdeaLot />
              <ExhibitionManipulator />
            </ExhibitionStateManager>
          </div>
        </>
      )}
    </>
  );
};

export default ExhibitionTool;
