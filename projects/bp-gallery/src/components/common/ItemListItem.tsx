import React, { useCallback, useEffect, useRef, useState } from 'react';
import getLineBreaks from '../../helpers/get-linebreaks';

export interface ItemListItemModel {
  name: string;
  background: string;
  color?: string;
  target?: string;
  onClick?: () => void;
}

export const ItemListItem = ({ item, compact }: { item: ItemListItemModel; compact?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textDimensions, setTextDimensions] = useState<DOMRect>();
  const [splitText, setSplitText] = useState<string[]>();

  // Based on font-size 50
  const MAXIMUM_TEXT_WIDTH = 200;

  // Abridged from: https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const measuredRef = useCallback((node: any) => {
    if (node !== null) {
      const bbox = (node as SVGSVGElement).getBBox();
      bbox.height = Math.max(bbox.height, MAXIMUM_TEXT_WIDTH);
      setTextDimensions(bbox);
    }
  }, []);

  const checkLineBreaks = () => {
    // The following uses in-browser means to determine where a line-break should be set
    const buffer = document.createElement('p');
    buffer.className = `_buffer_for_line_breaks_${compact ? ' compact' : ''}`;
    buffer.innerHTML = item.name;
    document.body.appendChild(buffer);
    let split = getLineBreaks(buffer.childNodes[0]);
    buffer.remove();
    if (split.length > 2) {
      split = [split[0], `${split[1]}...`];
    }
    setSplitText(split);
  };

  useEffect(checkLineBreaks, [item.name, compact]);

  const getColorSchema = (from: string, dark = false) => {
    let hash = 0;
    for (let i = 0; i < from.length; i++) {
      hash = from.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${(hash % 90) - 45}deg, 40%, 50%)`;
    return color;
  };

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
        <svg
          viewBox={`0 -${textDimensions?.height ?? 0} ${textDimensions?.width ?? 0} ${
            textDimensions?.height ?? 0
          }`}
          dominantBaseline='ideographic'
          preserveAspectRatio='xMinYMax meet'
          xmlns='http://www.w3.org/2000/svg'
        >
          {splitText?.length && (
            <text x='0' y='0' ref={measuredRef}>
              <tspan x='0'>
                {splitText.length > 1 ? splitText[1].toUpperCase() : splitText[0].toUpperCase()}
              </tspan>
              {splitText.length > 1 && (
                <tspan x='0' dy='-1.2em'>
                  {splitText[0].toUpperCase()}
                </tspan>
              )}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};
