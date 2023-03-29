import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useCreateFaceTagMutation,
  useDeleteFaceTagMutation,
  useGetFaceTagsQuery,
  useGetPersonTagQuery,
} from '../../../../graphql/APIConnector';
import { PictureViewContext } from '../PictureView';
import { FaceTag, FaceTagData } from './FaceTag';
import { useImageRect } from './helpers/image-rect';

type FaceTagging = {
  activeTagId: string | null;
  setActiveTagId: Dispatch<SetStateAction<string | null>>;
  tags: FaceTagData[];
  hideTags: boolean | null;
  setHideTags: Dispatch<SetStateAction<boolean>>;
  removeTag: (id: string) => void;
};

const Context = createContext<FaceTagging | null>(null);

export const FaceTaggingProvider = ({
  children,
  pictureId,
}: PropsWithChildren<{ pictureId: string }>) => {
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [hideTags, setHideTags] = useState(false);
  useEffect(() => {
    setActiveTagId(null);
  }, [pictureId]);

  const { error, loading, data } = useGetFaceTagsQuery({
    variables: {
      pictureId,
    },
  });
  const tags = data?.faceTags?.data.map(tag => ({
    x: tag.attributes?.x ?? 0,
    y: tag.attributes?.y ?? 0,
    name: tag.attributes?.person_tag?.data?.attributes?.name ?? '',
    personTagId: tag.attributes?.person_tag?.data?.id,
    id: tag.id ?? '-1',
  }));

  const { data: activeData } = useGetPersonTagQuery({
    variables: {
      id: activeTagId ?? '-1',
    },
  });
  const activeTagName = activeData?.personTag?.data?.attributes?.name ?? 'Lädt';

  const [mousePosition, setMousePosition] = useState<null | [number, number]>(null);

  const { img } = useContext(PictureViewContext);
  const imageRect = useImageRect(img);

  const position = useMemo(() => {
    if (!mousePosition || !imageRect) {
      return null;
    }
    const [mx, my] = mousePosition;
    const { x: ix, y: iy, width, height } = imageRect;
    const x = (mx - ix) / width;
    const y = (my - iy) / height;
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      return null;
    }
    return [x, y];
  }, [mousePosition, imageRect]);

  const [createTag] = useCreateFaceTagMutation({
    refetchQueries: ['getFaceTags'],
  });

  const placeTag = useCallback(() => {
    if (!position || activeTagId === null) {
      return;
    }
    const [x, y] = position;
    createTag({
      variables: {
        x,
        y,
        personTagId: activeTagId,
        pictureId,
      },
    });
    setActiveTagId(null);
  }, [createTag, position, activeTagId, pictureId]);

  const [deleteTag] = useDeleteFaceTagMutation({
    refetchQueries: ['getFaceTags'],
  });

  const removeTag = useCallback(
    (id: string) => {
      if (!id) {
        return;
      }
      deleteTag({
        variables: {
          id,
        },
      });
    },
    [deleteTag]
  );

  useEffect(() => {
    if (!img) {
      return;
    }
    const mousemove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      setMousePosition([clientX, clientY]);
    };
    const mouseleave = () => {
      setMousePosition(null);
    };
    const mouseclick = () => {
      placeTag();
    };
    img.addEventListener('mousemove', mousemove);
    img.addEventListener('mouseleave', mouseleave);
    img.addEventListener('click', mouseclick);
    return () => {
      img.removeEventListener('mousemove', mousemove);
      img.removeEventListener('mouseleave', mouseleave);
      img.removeEventListener('click', mouseclick);
    };
  }, [img, placeTag]);

  const activeTagData = useMemo<FaceTagData | null>(() => {
    if (!position || activeTagId === null) {
      return null;
    }
    const [x, y] = position;
    return {
      id: undefined,
      personTagId: undefined,
      name: activeTagName,
      x,
      y,
      noPointerEvents: true,
    };
  }, [position, activeTagName, activeTagId]);

  const value = useMemo<FaceTagging>(
    () => ({
      activeTagId,
      setActiveTagId,
      tags: activeTagData
        ? [...(tags ?? []).map(tag => ({ ...tag, noPointerEvents: true })), activeTagData]
        : tags ?? [],
      hideTags,
      setHideTags,
      removeTag,
    }),
    [activeTagId, setActiveTagId, tags, activeTagData, hideTags, removeTag]
  );

  if (!tags) {
    if (error) {
      console.log(error);
    }
    return <>{children}</>;
  }

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useFaceTagging = () => {
  return useContext(Context);
};

export const FaceTags = () => {
  const context = useFaceTagging();

  if (!context || context.hideTags) {
    return null;
  }
  return (
    <>
      {context.tags.map(data => (
        <FaceTag data={data} key={data.name} />
      ))}
    </>
  );
};
