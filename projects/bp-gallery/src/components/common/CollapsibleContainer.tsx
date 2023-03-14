import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';

const CollapsibleContainer = ({
  children,
  collapsedHeight,
  defaultOpen,
}: {
  children: ((open: boolean) => ReactNode | undefined) | (ReactNode | undefined);
  collapsedHeight: string;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [fullHeight, setFullHeight] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);

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
        <div ref={measureRef}>
          {typeof children === 'function' ? children(open ?? true) : children}
        </div>
      </div>
      {!defaultOpen && (
        <IconButton
          className='icon-button hover:bg-slate-100'
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open ? <KeyboardArrowUp className='icon' /> : <KeyboardArrowDown className='icon' />}
        </IconButton>
      )}
    </>
  );
};

export default CollapsibleContainer;
