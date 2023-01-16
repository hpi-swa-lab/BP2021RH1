import { GraphQLError } from 'graphql';
import {
  CommentEntity,
  DescriptionEntity,
  GetPictureInfoDocument,
  KeywordTagEntity,
  LocationTagEntity,
  PersonTagEntity,
  PictureEntity,
  TimeRangeTagEntity,
} from '../../../../graphql/APIConnector';

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
  id: '1',
  attributes: {
    start: '1955-10-10T00:00:00Z',
    end: '1955-10-12T00:00:00Z',
    isEstimate: false,
  },
};

export const KeywordTagsMock: KeywordTagEntity[] = [
  {
    id: '1',
    attributes: {
      name: 'keyword_tag',
    },
  },
];

export const PersonTagsMock: PersonTagEntity[] = [
  {
    id: '1',
    attributes: {
      name: 'Person test',
    },
  },
];

export const LocationTagsMock: LocationTagEntity[] = [
  {
    id: '1',
    attributes: {
      name: 'A place in Bad Harzburg',
    },
  },
];

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

export const PictureMocks: PictureEntity = {
  id: '1',
  attributes: {
    media: {
      data: {
        id: '1',
        attributes: {
          url: 'test-image.jpg',
          hash: '',
          mime: 'image/jpeg',
          name: 'Test Image',
          provider: '',
          size: -1,
          updatedAt: '21042022',
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
    verified_time_range_tag: {
      data: null,
    },
    keyword_tags: {
      data: KeywordTagsMock,
    },
    verified_keyword_tags: {
      data: [],
    },
    person_tags: {
      data: PersonTagsMock,
    },
    verified_person_tags: {
      data: [],
    },
    location_tags: {
      data: LocationTagsMock,
    },
    verified_location_tags: {
      data: [],
    },
    collections: {
      data: [],
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
        picture: {
          data: PictureMocks,
        },
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
