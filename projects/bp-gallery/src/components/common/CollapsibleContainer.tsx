import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Property } from 'csstype';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type CollapsibleContainerProps = PropsWithChildren<{
  collapsedHeight: Property.Height<string | number>;
  onToggle?: (open: boolean) => void;
  long?: boolean;
  showText?: boolean;
  className?: string;
}>;

const CollapsibleContainer = ({
  children,
  collapsedHeight,
  onToggle,
  long = true,
  showText = true,
  className,
}: CollapsibleContainerProps) => {
  const [open, setOpen] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (fullHeight !== measureRef.current?.clientHeight)
      setFullHeight(measureRef.current?.clientHeight ?? 0);
  }, [fullHeight, open]);

  return (
    <>
      <div
        className={`overflow-hidden transition-[height] duration-1000`}
        style={long ? (open ? { height: `${fullHeight}px` } : { height: collapsedHeight }) : {}}
      >
        <div ref={measureRef}>{children}</div>
      </div>
      {long && (
        <label className='w-full flex justify-center mb-4 cursor-pointer box-border'>
          <IconButton
            className={`hover:bg-slate-100 !text-sky-600 ${className ?? '!w-full'}`}
            onClick={event => {
              event.preventDefault();
              setOpen(!open);
              onToggle?.(!open);
            }}
          >
            {open ? <KeyboardArrowUp className='icon' /> : <KeyboardArrowDown className='icon' />}
            <div className='uppercase text-sm text-sky-600'>
              {showText && (open ? t('common.showLess') : t('common.showMore'))}
            </div>
          </IconButton>
        </label>
      )}
    </>
  );
};

export default CollapsibleContainer;
