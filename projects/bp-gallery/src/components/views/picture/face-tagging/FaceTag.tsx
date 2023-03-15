import { CSSProperties, useMemo } from 'react';

const triangleHeight = 10;
const triangleWidth = 20;
const boundary = 0.9;

export const FaceTag = ({ name, x, y }: { name: string; x: number; y: number }) => {
  const { style, triangle } = useMemo<{
    style: CSSProperties;
    triangle: { points: string; width: number; height: number };
  }>(() => {
    const w = triangleWidth;
    const h = triangleHeight;
    if (x > boundary) {
      return {
        style: {
          right: `${(1 - x) * 100}%`,
          top: `${y * 100}%`,
          flexDirection: 'row-reverse',
          transform: 'translateY(-50%)',
        },
        triangle: {
          points: `0,0 ${h},${w / 2} 0,${w}`,
          width: h,
          height: w,
        },
      };
    }
    if (x < 1 - boundary) {
      return {
        style: {
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          flexDirection: 'row',
          transform: 'translateY(-50%)',
        },
        triangle: {
          points: `${h},0 0,${w / 2} ${h},${w}`,
          width: h,
          height: w,
        },
      };
    }
    if (y > boundary) {
      return {
        style: {
          left: `${x * 100}%`,
          bottom: `${(1 - y) * 100}%`,
          flexDirection: 'column-reverse',
          transform: 'translateX(-50%)',
        },
        triangle: {
          points: `0,0 ${w / 2},${h} ${w},0`,
          width: w,
          height: h,
        },
      };
    }
    return {
      style: {
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        flexDirection: 'column',
        transform: 'translateX(-50%)',
      },
      triangle: {
        points: `0,${h} ${w / 2},0 ${w},${h}`,
        width: w,
        height: h,
      },
    };
  }, [x, y]);
  return (
    <div className='absolute z-[9999] flex items-center' style={style}>
      <svg width={triangle.width} height={triangle.height}>
        <polygon fill='#404173bb' points={triangle.points} />
      </svg>
      <div className='bg-[#404173bb] p-2 rounded-md text-white'>{name}</div>
    </div>
  );
};
