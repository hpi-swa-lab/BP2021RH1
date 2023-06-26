import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, IconButton, Paper, TextField } from '@mui/material';
import { UIEventHandler, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetExhibitionQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { channelFactory } from '../../../helpers/channel-helpers';
import { useCanEditExhibition } from '../../../hooks/can-do-hooks';
import { FlatExhibition } from '../../../types/additionalFlatTypes';
import ProtectedRoute from '../../common/ProtectedRoute';
import TextEditor from '../../common/editors/TextEditor';
import {
  ExhibitionGetContext,
  ExhibitionSectionUtilsContext,
  ExhibitionSetContext,
  ExhibitionStateManager,
} from './ExhibitonUtils';

const Idealot = () => {
  const { t } = useTranslation();
  const idealot = useContext(ExhibitionGetContext).getIdealot();

  return (
    <div className='flex flex-col items-stretch h-full w-full relative'>
      <div className='absolute z-[999] right-0 top-[-1rem]'>
        <AddPicturesButton />
      </div>
      <div className='text-xl'>{t('exhibition.idealot')}</div>
      <div className='border-solid overflow-auto flex-1 h-full'>
        <div className='flex gap-2 flex-wrap items-start'>
          {idealot?.map(picture => picture.element)}
        </div>
      </div>
    </div>
  );
};

const DropZone = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { setNodeRef } = useDroppable({ id });
  const section = useContext(ExhibitionGetContext).getSection(id);
  const { getSorting, setSorting, swapSectionDraggables } = useContext(
    ExhibitionSectionUtilsContext
  );
  const itemIds = section?.dragElements.map(elem => elem.id);
  const dragItems = section?.dragElements;
  const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>(undefined);
  const activeSortable = section?.dragElements.find(elem => elem.id === activeId)?.sortableElement;

  const dragHandleEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return setActiveId(undefined);
    if (active.id !== over.id) {
      const oldIndex = section?.dragElements.findIndex(x => x.id === active.id);
      const newIndex = section?.dragElements.findIndex(x => x.id === over.id);
      if (oldIndex !== undefined && newIndex !== undefined)
        swapSectionDraggables(oldIndex, newIndex, id);
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
      className='min-h-[9rem] border-solid rounded-xl p-2 box-border flex flex-wrap gap-2 bg-gray-200 relative'
    >
      <div className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-slate-500'>
        {t('exhibition.manipulator.section.dropzone')}
      </div>
      <div className='relative w-full'>
        <div className='absolute right-0 z-[2000]'>
          <Button variant='contained' onClick={() => setSorting(!getSorting())}>
            {getSorting()
              ? t('exhibition.manipulator.section.exit-sort')
              : t('exhibition.manipulator.section.sort')}
          </Button>
        </div>
      </div>
      {getSorting() && itemIds ? (
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
        <>{dragItems?.map(item => item.element)}</>
      )}
    </div>
  );
};

const TitleDropzone = () => {
  const { t } = useTranslation();
  const titlePicture = useContext(ExhibitionGetContext).getTitlePicture();
  const { setNodeRef } = useDroppable({ id: 'titleDropzone' });
  return (
    <div
      ref={setNodeRef}
      className='h-[10rem] min-w-[10rem] border-solid rounded-xl p-2 box-border flex flex-wrap gap-2 bg-gray-200 relative'
    >
      <div className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-slate-500'>
        {t('exhibition.manipulator.intro.title-picture')}
      </div>
      {titlePicture?.element}
    </div>
  );
};

const ExhibitionManipulator = () => {
  const { t } = useTranslation();
  const sections = useContext(ExhibitionGetContext).getAllSections();
  const addSection = useContext(ExhibitionSectionUtilsContext).addSection;
  const scroll = useRef(0);
  const scrollDivRef = useRef<HTMLDivElement | null>(null);

  const handleScroll: UIEventHandler<HTMLDivElement> = node => {
    if (node.currentTarget.scrollTop !== 0) scroll.current = Number(node.currentTarget.scrollTop);
  };

  useEffect(() => scrollDivRef.current?.scrollTo(0, scroll.current));
  return (
    <div className='flex flex-col items-stretch h-full w-full'>
      <div className='absolute z-[999] right-7 top-[6rem]'>
        <PublishButton />
      </div>
      <div className='text-xl'>{t('exhibition.tool')}</div>
      <div
        className='border-solid flex-1 p-2 overflow-y-auto'
        ref={scrollDivRef}
        onScroll={handleScroll}
      >
        <Introduction />
        {sections?.map(section => (
          <Section key={section.id} id={section.id} />
        ))}
        <div className='grid place-content-center'>
          <Button onClick={addSection} variant='outlined'>
            {t('exhibition.manipulator.section.add-section')}
          </Button>
        </div>
        <EndCard />
      </div>
    </div>
  );
};

const Introduction = () => {
  const { t } = useTranslation();
  const { getTitle, getIntroduction } = useContext(ExhibitionGetContext);

  const { setTitle, setIntroduction } = useContext(ExhibitionSetContext);

  const extraOptions = {
    height: 300,
    allowReziseX: false,
    allowReziseY: false,
    preset: undefined,
    placeholder: t('exhibition.manipulator.intro.text-placeholder'),
    statusbar: false,
    tabIndex: 0,
    className: 'z-0',
  };
  return (
    <div className='flex flex-col flex-1 gap-2'>
      <TextField
        className='flex-1'
        variant='standard'
        placeholder={t('exhibition.manipulator.intro.title-placeholder')}
        defaultValue={getTitle()}
        onBlur={event => setTitle(event.target.value)}
      />
      <div className='flex gap-2'>
        <div className='flex-1'>
          <TextEditor
            value={getIntroduction()}
            extraOptions={extraOptions}
            onBlur={value => setIntroduction(value)}
          />
        </div>
        <TitleDropzone />
      </div>
    </div>
  );
};

const Section = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const section = useContext(ExhibitionGetContext).getSection(id);
  const { getSectionTitle, getSectionText } = useContext(ExhibitionGetContext);

  const { setSectionTitle, setSectionText } = useContext(ExhibitionSetContext);

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
            defaultValue={getSectionTitle(id)}
            onBlur={event => setSectionTitle(id, event.target.value)}
          />
          <IconButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
        {isOpen && section && (
          <>
            <TextEditor
              value={getSectionText(id) ?? ''}
              extraOptions={extraOptions}
              onBlur={text => setSectionText(id, text)}
            />
            <DropZone key={section.id} id={section.id} />
          </>
        )}
      </div>
    </Paper>
  );
};

const EndCard = () => {
  const { t } = useTranslation();
  const { getEpilog, getSources } = useContext(ExhibitionGetContext);

  const { setEpilog, setSource, addSource } = useContext(ExhibitionSetContext);

  const extraOptions = {
    height: 300,
    allowReziseX: false,
    allowReziseY: false,
    preset: undefined,
    placeholder: t('exhibition.manipulator.epilog.text-placeholder'),
    statusbar: false,
    tabIndex: 0,
    className: 'z-0',
  };

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-xl'>{t('exhibition.manipulator.epilog.title')}</label>
      <TextEditor
        value={getEpilog() ?? ''}
        extraOptions={extraOptions}
        onBlur={text => setEpilog(text)}
      />
      <label className='text-xl'>{t('exhibition.manipulator.epilog.sources')}</label>
      {getSources()?.map((source, index) => (
        <TextField
          key={index}
          defaultValue={source.source}
          onChange={event => event.target.value}
          onBlur={event => setSource(event.target.value, source.id)}
        />
      ))}
      <div className='grid place-content-center'>
        <Button onClick={addSource} variant='outlined'>
          {t('exhibition.manipulator.epilog.add-source')}
        </Button>
      </div>
    </div>
  );
};

const PublishButton = () => {
  const { t } = useTranslation();
  const { getIsPublished } = useContext(ExhibitionGetContext);
  const { toggleIsPublished } = useContext(ExhibitionSetContext);
  return (
    <Button variant='contained' onClick={() => toggleIsPublished()}>
      {!getIsPublished() ? t('exhibition.buttons.publish') : t('exhibition.buttons.unPublish')}
    </Button>
  );
};

const AddPicturesButton = () => {
  const { t } = useTranslation();
  const { getExhibitionId } = useContext(ExhibitionGetContext);
  return (
    <Button
      variant='contained'
      onClick={() => {
        localStorage.setItem('currentExhibition', getExhibitionId());
        window.open(`/search?exhibitionId=${getExhibitionId()}`, '_blank');
      }}
    >
      {t('exhibition.buttons.addPictures')}
    </Button>
  );
};

const ExhibitionTool = ({ exhibitionId }: { exhibitionId: string }) => {
  const { data: exhibitionData, refetch } = useGetExhibitionQuery({
    variables: { exhibitionId },
  });
  const exhibition: FlatExhibition | undefined =
    useSimplifiedQueryResponseData(exhibitionData)?.exhibition;

  useEffect(() => {
    const exhibitionChannel = channelFactory(`exhibition-${exhibition?.id ?? ''}`);
    exhibitionChannel.onmessage = async () => {
      refetch();
    };

    return () => exhibitionChannel.close();
  });

  const { canEditExhibition, loading: canEditExhibitionLoading } =
    useCanEditExhibition(exhibitionId);

  return (
    <ProtectedRoute canUse={canEditExhibition} canUseLoading={canEditExhibitionLoading}>
      {exhibition && (
        <>
          <ExhibitionStateManager exhibition={exhibition}>
            <div className='flex gap-7 items-stretch h-full w-full p-7 box-border overflow-hidden'>
              <Idealot />
              <ExhibitionManipulator />
            </div>
          </ExhibitionStateManager>
        </>
      )}
    </ProtectedRoute>
  );
};

export default ExhibitionTool;
