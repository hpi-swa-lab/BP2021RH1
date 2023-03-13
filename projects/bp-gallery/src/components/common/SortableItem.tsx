import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PropsWithChildren } from 'react';

const SortableItem = ({
  id,
  children,
}: PropsWithChildren<{
  id: UniqueIdentifier;
}>) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {children}
    </div>
  );
};

export default SortableItem;
