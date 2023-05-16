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
