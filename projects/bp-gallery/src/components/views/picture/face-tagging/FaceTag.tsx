import { Cancel, OpenWith } from '@mui/icons-material';
import { CSSProperties, useContext, useMemo } from 'react';
import { useCanRunDeleteFaceTagMutation } from '../../../../graphql/APIConnector';
import { useFaceTagging } from '../../../../hooks/context-hooks';
import '../../../../shared/style.scss';
import { PictureViewContext } from '../PictureView';
import { useImageRect } from './helpers/image-rect';

const triangleHeight = 10;
const triangleWidth = 20;
const boundary = 0.9;

export type FaceTagData = {
  id: string | undefined;
  personTagId: string | undefined | null;
  name: string;
  x: number;
  y: number;
  noPointerEvents?: boolean;
};

export const FaceTag = ({
  data: { id, personTagId, name, x, y, noPointerEvents },
}: {
  data: FaceTagData;
}) => {
  const context = useFaceTagging();
  const isFaceTagging = context?.isFaceTagging;

  const handleDelete = async () => {
    if (id === undefined) {
      return;
    }
    await context?.removeTag(id);
  };

  const { canRun: canDelete } = useCanRunDeleteFaceTagMutation({
    variables: {
      id,
    },
  });

  const handleMove = async () => {
    if (personTagId === undefined) {
      return;
    }
    await handleDelete();
    context?.setActiveTagId(personTagId);
  };

  const canMove = (canDelete && context?.canCreateTag) ?? false;

  const { img } = useContext(PictureViewContext);
  const imageRect = useImageRect(img);

  const position = useMemo<CSSProperties>(() => {
    if (!imageRect) {
      return { display: 'none' };
    }
    const { x: ix, y: iy, width, height } = imageRect;
    return {
      left: x * width + ix,
      top: y * height + iy,
    };
  }, [imageRect, x, y]);

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

    if (x > boundary) {
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
    if (x < 1 - boundary) {
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
    if (y > boundary) {
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
  }, [x, y, position, noPointerEvents]);

  return (
    <div className='fixed z-[999] hover:z-[9999] flex items-center facetag' style={style}>
      <svg width={triangle.width} height={triangle.height}>
        <polygon fill='#404173bb' points={triangle.points} />
      </svg>
      <div className='flex flex-row items-center space-x-1 bg-[#404173bb] p-2 rounded-md text-white'>
        <span>{name}</span>
        {id !== undefined && isFaceTagging && (
          <>
            {canMove && <OpenWith className='hover:text-[#00000066]' onClick={handleMove} />}
            {canDelete && <Cancel className='hover:text-[#00000066]' onClick={handleDelete} />}
          </>
        )}
      </div>
    </div>
  );
};
