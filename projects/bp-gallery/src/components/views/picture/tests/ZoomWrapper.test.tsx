import { useMoveView } from '../picture-overlay/ZoomWrapper';
import React, { useState } from 'react';
import { render } from '@testing-library/react';

const ZoomWrapperMock = ({ pos }: { pos?: { x: number; y: number } }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [viewport, setViewport] = useState<{ x: number; y: number }>(pos ?? { x: 0, y: 0 });

  const imageRef = {
    current: {
      parentElement: {
        getBoundingClientRect: () => ({
          width: 500,
          height: 800,
        }),
      },
      getBoundingClientRect: () => ({
        width: 1000,
        height: 1200,
      }),
    },
  };
  const prevPos = { current: { x: 0, y: 0 } };

  const moveView = useMoveView({
    prevPos,
    imageRef: imageRef as unknown as any,
    setViewport,
    setZoomLevel,
  });

  return (
    <div
      onClick={() => moveView({ x: 15, y: 20 })}
      data-pos-x={viewport.x}
      data-pos-y={viewport.y}
      data-zoom={zoomLevel}
    ></div>
  );
};

describe('ZoomWrapper', () => {
  it('should correctly calculate movement', async () => {
    const { container } = render(<ZoomWrapperMock />);
    const div = container.querySelector('div');
    expect(div?.getAttribute('data-pos-x')).toBe('0');
    expect(div?.getAttribute('data-pos-y')).toBe('0');

    div?.click();
    expect(div?.getAttribute('data-pos-x')).toBe('15');
    expect(div?.getAttribute('data-pos-y')).toBe('20');
  });

  it('should cap image movement', async () => {
    const { container } = render(<ZoomWrapperMock pos={{ x: 500, y: 0 }} />);
    const div = container.querySelector('div');
    expect(div?.getAttribute('data-pos-x')).toBe('500');
    expect(div?.getAttribute('data-pos-y')).toBe('0');

    div?.click();
    expect(div?.getAttribute('data-pos-x')).toBe('250');
    expect(div?.getAttribute('data-pos-y')).toBe('20');
  });
});
