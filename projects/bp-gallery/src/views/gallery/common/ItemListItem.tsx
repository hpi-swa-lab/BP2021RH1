import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import getColorSchema from '../../helpers/color-schema';

export interface ItemListItemModel {
  name: string;
  background: string;
  color?: string;
  target?: string;
  onClick?: () => void;
}

export const ItemListItem = ({ item }: { item: ItemListItemModel }) => {
  const [fontSize, setFontSize] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const updateFontSize = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const maxWidth = containerRef.current.getBoundingClientRect().width;
    setFontSize(1.25 * Math.min(Math.max(maxWidth / item.name.length, 0.02 * maxWidth), 28));
  }, [containerRef, item.name]);

  useLayoutEffect(() => {
    if (!containerRef.current || !item.name) {
      return;
    }
    updateFontSize();
  });

  return (
    <div className='item' ref={containerRef} onClick={item.onClick ? item.onClick : undefined}>
      <div className='image-container'>
        <img src={item.background} alt={item.name} />
      </div>
      <div
        className='color-overlay'
        style={{ backgroundColor: item.color ?? getColorSchema(item.name) }}
      />
      <div className='text-container'>
        <span style={{ fontSize: `${fontSize}px` }}>{item.name.toUpperCase()}</span>
      </div>
    </div>
  );
};
