export enum TagDirection {
  UP,
  RIGHT,
  LEFT,
  DOWN,
  DEFAULT,
}

export type AnchorTagData = {
  id: string | undefined;
  tagId: string | undefined | null;
  name: string;
  x: number;
  y: number;
  noPointerEvents?: boolean;
  tagDirection: TagDirection | null;
};
