import { Autorenew, Cancel, OpenWith } from '@mui/icons-material';
import { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFaceTagging } from '../../../../hooks/context-hooks';
import '../../../../shared/style.scss';
import { AuthRole, useAuth } from '../../../provider/AuthProvider';
import { FaceTagData, TagDirection } from './FaceTagTypes';

const triangleHeight = 10;
const triangleWidth = 20;
const boundary = 0.9;

export const FaceTag = ({
  data: { id, personTagId, name, x, y, noPointerEvents, tagDirection },
}: {
  data: FaceTagData;
}) => {
  const { t } = useTranslation();
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
    context?.setActiveTagDirection(tagDirection);
    await handleDelete();
    context?.setActiveTagId(personTagId);
  };

  const toggleSetDirectionMode = () => {
    context?.setTagDirectionReferenceTagId(context.tagDirectionReferenceTagId ? null : id ?? null);
  };

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
    triangle: { points: string; width: number; height: number; testid: string };
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
          testid: 'tag direction: right',
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
          testid: 'tag direction: left',
        },
      };
    }
    if (
      (tagDirection === TagDirection.DEFAULT && y > boundary) ||
      tagDirection === TagDirection.DOWN
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
          testid: 'tag direction: down',
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
        testid: 'tag direction: up',
      },
    };
  }, [x, y, position, noPointerEvents, tagDirection]);

  return (
    <div className='fixed z-[999] hover:z-[9999] flex items-center facetag' style={style}>
      <svg width={triangle.width} height={triangle.height} data-testid={triangle.testid}>
        <polygon fill='#404173bb' points={triangle.points} />
      </svg>
      <div className='flex flex-row items-center space-x-1 bg-[#404173bb] p-2 rounded-md text-white'>
        <span>{name}</span>
        {role >= AuthRole.CURATOR && id !== undefined && isFaceTagging && (
          <>
            <OpenWith
              titleAccess={t('facetag.move')}
              className='hover:text-[#00000066]'
              onClick={handleMove}
            />
            <Autorenew
              titleAccess={t('facetag.rotate')}
              className={
                id === context.tagDirectionReferenceTagId
                  ? 'text-[#00000066]'
                  : 'hover:text-[#00000066]'
              }
              onClick={toggleSetDirectionMode}
            />
            <Cancel
              titleAccess={t('facetag.delete')}
              className='hover:text-[#00000066]'
              onClick={handleDelete}
            />
          </>
        )}
      </div>
    </div>
  );
};
