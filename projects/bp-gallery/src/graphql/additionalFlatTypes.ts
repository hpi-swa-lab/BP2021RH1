import { Description, Comment, Picture, Scalars } from './APIConnector';

type ID = { id: Scalars['ID'] };

export type FlatDescription = ID & Description;

export type FlatComment = ID & Comment;

export type FlatPicture = ID & Picture;
