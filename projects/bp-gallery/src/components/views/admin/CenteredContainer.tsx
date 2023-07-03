import { PropsWithChildren, useMemo } from 'react';
import { useScroll } from '../../../hooks/context-hooks';
import './CenteredContainer.scss';

export const CenteredContainer = ({
  title,
  titleOnLeftSideOfScreenAfterScroll = false,
  children,
}: PropsWithChildren<{ title: string; titleOnLeftSideOfScreenAfterScroll?: boolean }>) => {
  const { scrollPos } = useScroll();
  const titleClassName = useMemo(() => {
    if (!titleOnLeftSideOfScreenAfterScroll) {
      return '';
    }
    const fadeIn = 50;
    if (scrollPos >= fadeIn) {
      return 'transform-to-left-side-of-screen';
    }
    return '';
  }, [titleOnLeftSideOfScreenAfterScroll, scrollPos]);

  return (
    <div className='w-[800px] mx-auto mt-4'>
      <h1 className={titleClassName}>{title}</h1>
      {children}
    </div>
  );
};
