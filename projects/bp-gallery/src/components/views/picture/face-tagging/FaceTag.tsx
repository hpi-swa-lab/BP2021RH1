import { Cancel } from '@mui/icons-material';
import { CSSProperties, useMemo } from 'react';
import { AuthRole, useAuth } from '../../../provider/AuthProvider';
import { useFaceTagging } from './FaceTaggingContext';
import '../../../../shared/style.scss';

const triangleHeight = 10;
const triangleWidth = 20;
const boundary = 0.9;

export type FaceTagData = {
  id: string | undefined;
  name: string;
  x: number;
  y: number;
  noPointerEvents?: boolean;
};

export const FaceTag = ({ data: { id, name, x, y, noPointerEvents } }: { data: FaceTagData }) => {
  const { role } = useAuth();
  const context = useFaceTagging();
  const handleDelete = () => {
    if (id === undefined) {
      return;
    }
    context?.removeTag(id);
  };

  const { style, triangle } = useMemo<{
    style: CSSProperties;
    triangle: { points: string; width: number; height: number };
  }>(() => {
    const w = triangleWidth;
    const h = triangleHeight;

    const commonStyle: CSSProperties = {
      pointerEvents: noPointerEvents ? 'none' : undefined,
    };

    if (x > boundary) {
      return {
        style: {
          ...commonStyle,
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
          ...commonStyle,
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
          ...commonStyle,
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
        ...commonStyle,
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
  }, [x, y, noPointerEvents]);
  return (
    <div className='absolute z-[9999] flex items-center' style={style}>
      <svg width={triangle.width} height={triangle.height}>
        <polygon fill='#404173bb' points={triangle.points} />
      </svg>
      <div className='flex flex-row items-center space-x-1 bg-[#404173bb] p-2 rounded-md text-white'>
        <span>{name}</span>
        {role >= AuthRole.CURATOR && id !== undefined && (
          <Cancel className='hover:text-[#00000066]' onClick={handleDelete} />
        )}
      </div>
    </div>
  );
};
