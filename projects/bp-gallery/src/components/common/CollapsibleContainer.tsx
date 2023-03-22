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
          !open ? { height: collapsedHeight } : { height: `${measureRef.current!.clientHeight}px` }
        }
      >
        <div ref={measureRef}>{children}</div>
      </div>
      {showButton && (
        <label className='w-full flex justify-center mb-4 cursor-pointer'>
          <IconButton
            className={`icon-button hover:bg-slate-100 ${buttonStyle ?? '!w-40'}`}
            onClick={event => {
              event.preventDefault();
              setOpen(!open);
              onToggle?.(!open);
            }}
          >
            {open ? (
              <>
                <KeyboardArrowUp className='icon' />
                {showText && t('common.showLess')}
              </>
            ) : (
              <>
                <KeyboardArrowDown className='icon' />
                {showText && t('common.showMore')}
              </>
            )}
          </IconButton>
        </label>
      )}
    </>
  );
};

export default CollapsibleContainer;
