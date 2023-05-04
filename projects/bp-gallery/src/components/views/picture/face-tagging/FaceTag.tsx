import { Cancel, Label, OpenWith } from '@mui/icons-material';
import { CSSProperties, useContext, useMemo } from 'react';
import { useFaceTagging } from '../../../../hooks/context-hooks';
import '../../../../shared/style.scss';
import { AuthRole, useAuth } from '../../../provider/AuthProvider';
import { PictureViewContext } from '../PictureView';

const triangleHeight = 10;
const triangleWidth = 20;
const boundary = 0.9;

export enum TagDirection {
  UP,
  RIGHT,
  LEFT,
  DOWN,
  DEFAULT,
}

export type FaceTagData = {
  id: string | undefined;
  personTagId: string | undefined | null;
  name: string;
  x: number;
  y: number;
  noPointerEvents?: boolean;
  tagDirection: TagDirection | null;
};

export const FaceTag = ({
  data: { id, personTagId, name, x, y, noPointerEvents, tagDirection },
}: {
  data: FaceTagData;
}) => {
  const { role } = useAuth();
  const context = useFaceTagging();
  const isFaceTagging = context?.isFaceTagging;

  const handleDelete = async () => {
    if (id === undefined) {
      return;
    }
    await context?.removeTag(id);
  };

  const handleMove = async () => {
    if (personTagId === undefined) {
      return;
    }
    await handleDelete();
    context?.setActiveTagId(personTagId);
  };

  const toggleSetDirectionMode = () => {
    context?.setTagDirectionReferenceTagId(context.tagDirectionReferenceTagId ? null : id ?? null);
  };

  const { img } = useContext(PictureViewContext);

  const position = useMemo<CSSProperties>(() => {
    if (!context?.imageRect) {
      return { display: 'none' };
    }
    const { x: ix, y: iy, width, height } = context.imageRect;
    return {
      left: x * width + ix,
      top: y * height + iy,
    };
  }, [context?.imageRect, x, y]);

  const { style, triangle } = useMemo<{
    style: CSSProperties;
    triangle: { points: string; width: number; height: number };
  }>(() => {
    const w = triangleWidth;
    const h = triangleHeight;

    const commonStyle = {
      pointerEvents: noPointerEvents ? 'none' : undefined,
      ...position,
    } satisfies CSSProperties;

    if (
      (tagDirection === TagDirection.DEFAULT && x > boundary) ||
      tagDirection === TagDirection.RIGHT
    ) {
      return {
        style: {
          ...commonStyle,
          flexDirection: 'row-reverse',
          transform: `translate(-100%, -50%)`,
        },
        triangle: {
          points: `0,0 ${h},${w / 2} 0,${w}`,
          width: h,
          height: w,
        },
      };
    }
    if (
      (tagDirection === TagDirection.DEFAULT && x < 1 - boundary) ||
      tagDirection === TagDirection.LEFT
    ) {
      return {
        style: {
          ...commonStyle,
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
    if (
      (tagDirection === TagDirection.DEFAULT && y > boundary) ||
      tagDirection === TagDirection.UP
    ) {
      return {
        style: {
          ...commonStyle,
          flexDirection: 'column-reverse',
          transform: 'translate(-50%, -100%)',
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
        flexDirection: 'column',
        transform: 'translateX(-50%)',
      },
      triangle: {
        points: `0,${h} ${w / 2},0 ${w},${h}`,
        width: w,
        height: h,
      },
    };
  }, [x, y, position, noPointerEvents, tagDirection]);

  return (
    <div className='fixed z-[999] hover:z-[9999] flex items-center facetag' style={style}>
      <svg width={triangle.width} height={triangle.height}>
        <polygon fill='#404173bb' points={triangle.points} />
      </svg>
      <div className='flex flex-row items-center space-x-1 bg-[#404173bb] p-2 rounded-md text-white'>
        <span>{name}</span>
        {role >= AuthRole.CURATOR && id !== undefined && isFaceTagging && (
          <>
            <OpenWith className='hover:text-[#00000066]' onClick={handleMove} />
            <Label
              className={
                id === context.tagDirectionReferenceTagId
                  ? 'text-[#00000066]'
                  : 'hover:text-[#00000066]'
              }
              onClick={toggleSetDirectionMode}
            />
            <Cancel className='hover:text-[#00000066]' onClick={handleDelete} />
          </>
        )}
      </div>
    </div>
  );
};
