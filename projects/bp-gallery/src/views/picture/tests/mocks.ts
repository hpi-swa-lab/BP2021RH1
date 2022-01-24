import { GraphQLError } from 'graphql';
import {
  CommentEntity,
  DescriptionEntity,
  GetPictureInfoDocument,
  TimeRangeTagEntity,
} from '../../../graphql/APIConnector';

export const CommentMocks: CommentEntity[] = [
  {
    id: '1',
    attributes: {
      text: 'My fancy comment',
      author: 'Onkel Pelle',
      date: new Date('2021-04-21'),
    },
  },
  {
    id: '2',
    attributes: {
      text: 'My fancy comment yeah',
      author: 'Onkel Pelle',
      date: new Date('2021-04-22'),
    },
  },
];

export const TimeRangeTagMocks: TimeRangeTagEntity = {
  attributes: {
    start: new Date('1955-10-10'),
    end: new Date('1955-10-12'),
  },
};

export const DescriptionMocks: DescriptionEntity[] = [
  {
    id: '1',
    attributes: {
      text: 'My fancy description',
    },
  },
  {
    id: '2',
    attributes: {
      text: 'My fancy description yeah',
    },
  },
];

export const PictureMocks: any = {
  data: {
    attributes: {
      title: {
        data: {
          id: '1',
          attributes: {
            text: 'Picture with comments and descriptions',
          },
        },
      },
      media: {
        data: {
          attributes: {
            url: 'test-image.jpg',
          },
        },
      },
      descriptions: {
        data: DescriptionMocks,
      },
      comments: {
        data: CommentMocks,
      },
      time_range_tag: {
        data: TimeRangeTagMocks,
      },
    },
  },
};

export const GetPictureInfoDocumentMocks = [
  {
    request: {
      query: GetPictureInfoDocument,
      variables: {
        pictureId: '1',
      },
    },
    result: {
      data: {
        picture: PictureMocks,
      },
    },
  },
  {
    request: {
      query: GetPictureInfoDocument,
      variables: {
        pictureId: '2',
      },
    },
    error: new Error('mocked network error'),
  },
  {
    request: {
      query: GetPictureInfoDocument,
      variables: {
        pictureId: '3',
      },
    },
    result: {
      errors: [new GraphQLError('mocked api error')],
    },
  },
];
