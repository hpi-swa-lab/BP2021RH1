import { Maybe } from 'graphql/jsutils/Maybe';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import getLineBreaks from '../../../helpers/get-linebreaks';
import CollapsibleContainer from '../../common/CollapsibleContainer';
import RichText from '../../common/RichText';

const ArchiveDescription = ({ description }: { description: Maybe<string> | undefined }) => {
  const [open, setOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [long, setLong] = useState(false);

  useEffect(() => {
    const buffer = document.createElement('div');
    buffer.className = 'collection-description open';
    buffer.innerText = description ?? '';
    console.log(textRef.current);
    textRef.current?.appendChild(buffer);
    const split = getLineBreaks(buffer.childNodes[0]);
    console.log(split.length);
    buffer.remove();

    setLong(split.length > 13);
  }, [description]);

  return (
    <CollapsibleContainer
      collapsedHeight='23rem'
      defaultOpen={false}
      showButton={long}
      onToggle={open => setOpen(open)}
    >
      <div
        ref={textRef}
        className={`mb-1 p-1 pt-0 text-lg break-words ${
          !open ? 'line-clamp-[13] overflow-visible' : ''
        }`}
      >
        <RichText value={description ?? t('archives.defaultLongDescription')} />
      </div>
    </CollapsibleContainer>
  );
};

export default ArchiveDescription;
