import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type CollapsibleContainerProps = PropsWithChildren<{
  collapsedHeight: string;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  showButton?: boolean;
  showText?: boolean;
  buttonStyle?: string;
}>;

const CollapsibleContainer = ({
  children,
  collapsedHeight,
  defaultOpen,
  onToggle,
  showButton = true,
  showText,
  buttonStyle,
}: CollapsibleContainerProps) => {
  const [open, setOpen] = useState(defaultOpen);
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
        style={
          showButton
            ? !open
              ? { height: collapsedHeight }
              : { height: `${measureRef.current?.clientHeight ?? 0}px` }
            : {}
        }
      >
        <div ref={measureRef}>{children}</div>
      </div>
      {showButton && (
        <label className='w-full flex justify-center mb-4 cursor-pointer box-border'>
          <IconButton
            className={`hover:bg-slate-100 !text-sky-600 ${buttonStyle ?? '!w-40 '}`}
            onClick={event => {
              event.preventDefault();
              setOpen(!open);
              onToggle?.(!open);
            }}
          >
            {open ? (
              <>
                <KeyboardArrowUp className='icon' />
              </>
            ) : (
              <>
                <KeyboardArrowDown className='icon' />
              </>
            )}
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
