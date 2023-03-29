import { Maybe } from 'graphql/jsutils/Maybe';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import CollapsibleContainer from '../../common/CollapsibleContainer';
import RichText from '../../common/RichText';
import { getIsLong } from './../../../helpers/get-linebreaks';

const ArchiveDescription = ({ description }: { description: Maybe<string> | undefined }) => {
  const [open, setOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [long, setLong] = useState(false);

  useEffect(() => {
    setLong(getIsLong(textRef.current, description ?? '', 13));
  }, [description]);

  return (
    <CollapsibleContainer
      collapsedHeight='23rem'
      long={long}
      className='w-52'
      onToggle={open => setOpen(open)}
    >
      <div
        ref={textRef}
        className={`mb-1 p-1 pt-0 text-lg break-words ${
          !open ? 'line-clamp-[13] !overflow-visible' : ''
        }`}
      >
        <RichText value={description ?? t('archives.defaultLongDescription')} />
      </div>
    </CollapsibleContainer>
  );
};

export default ArchiveDescription;
