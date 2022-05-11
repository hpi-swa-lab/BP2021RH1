import { PictureFiltersInput } from '../../../../graphql/APIConnector';
import { SearchType } from '../SearchView';

const paramToTimefilter = (timeParam: string) => {
  if (timeParam === 'pre50') timeParam = '49';
  const year = parseInt(timeParam);

  if (!isNaN(year)) {
    let startTime = `${year}-01-01T00:00:00Z`;
    let endTime = `${year}-12-31T23:59:59Z`;
    if (year < 100) {
      startTime = year === 49 ? '1900-01-01T00:00:00Z' : `19${year}-01-01T00:00:00Z`;
      endTime = `19${year}-12-31T23:59:59Z`;
    }

    const time_range_tag_filter = {
      start: {
        gte: startTime,
      },
      end: {
        lte: endTime,
      },
    };

    return time_range_tag_filter;
  }
};

const searchDecade = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const timeParams = searchParams.getAll(SearchType.DECADE);
  timeParams.forEach(timeParam => {
    const time_range_tag_filter = paramToTimefilter(timeParam);
    filters.and?.push({
      or: [
        {
          time_range_tag: time_range_tag_filter,
        },
        {
          verified_time_range_tag: time_range_tag_filter,
        },
      ],
    });
  });
};

const searchKeyword = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const keywords = searchParams.getAll(SearchType.KEYWORD).map(decodeURIComponent);
  keywords.forEach((keyword: string) => {
    const keyword_tag_filter = {
      name: {
        containsi: keyword,
      },
    };
    filters.and?.push({
      or: [
        {
          keyword_tags: keyword_tag_filter,
        },
        {
          verified_keyword_tags: keyword_tag_filter,
        },
      ],
    });
  });
};

const searchLocation = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const locations = searchParams.getAll(SearchType.LOCATION).map(decodeURIComponent);
  locations.forEach((location: string) => {
    const location_tag_filter = {
      name: {
        containsi: location,
      },
    };
    filters.and?.push({
      or: [
        {
          location_tags: location_tag_filter,
        },
        {
          verified_location_tags: location_tag_filter,
        },
      ],
    });
  });
};

const searchPerson = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const persons = searchParams.getAll(SearchType.PERSON).map(decodeURIComponent);
  persons.forEach((person: string) => {
    const person_tag_filter = {
      name: {
        containsi: person,
      },
    };
    filters.and?.push({
      or: [
        {
          person_tags: person_tag_filter,
        },
        {
          verified_person_tags: person_tag_filter,
        },
      ],
    });
  });
};

const searchDescription = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const q = searchParams.getAll(SearchType.DESCRIPTION).map(decodeURIComponent);
  q.forEach((param: string) => {
    filters.and?.push({
      descriptions: {
        text: {
          containsi: param,
        },
      },
    });
  });
};

const searchAll = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const params = searchParams.getAll(SearchType.ALL).map(decodeURIComponent);
  params.forEach(function (value) {
    if (value === 'pre50') {
      value = '40';
    }

    const value_number = parseInt(value);
    let time_range_tag_filter = {};
    if (!isNaN(value_number)) {
      if (value_number.toString().startsWith('19') && value_number.toString().length === 4) {
        const startTime = `19${parseInt(value_number.toString().substring(2))}-01-01T00:00:00Z`;
        const endTime = `19${parseInt(value_number.toString().substring(2))}-12-31T23:59:59Z`;

        time_range_tag_filter = {
          start: {
            gte: startTime,
          },
          end: {
            lte: endTime,
          },
        };
      } else if (value_number.toString().length === 2) {
        const startTime =
          value_number === 40 ? '1900-01-01T00:00:00Z' : `19${value_number}-01-01T00:00:00Z`;
        const endTime = `19${value_number}-12-31T23:59:59Z`;

        time_range_tag_filter = {
          start: {
            gte: startTime,
          },
          end: {
            lte: endTime,
          },
        };
      }
    }

    const keyword_tag_filter = {
      name: {
        containsi: value,
      },
    };
    const location_tag_filter = {
      name: {
        containsi: value,
      },
    };
    const person_tag_filter = {
      name: {
        containsi: value,
      },
    };

    const collection_filter = {
      name: {
        containsi: value,
      },
    };

    filters.and?.push({
      or: [
        {
          keyword_tags: keyword_tag_filter,
        },
        {
          verified_keyword_tags: keyword_tag_filter,
        },
        {
          time_range_tag: time_range_tag_filter,
        },
        {
          verified_time_range_tag: time_range_tag_filter,
        },
        {
          person_tags: person_tag_filter,
        },
        {
          verified_person_tags: person_tag_filter,
        },
        {
          collections: collection_filter,
        },
        {
          location_tags: location_tag_filter,
        },
        {
          verified_location_tags: location_tag_filter,
        },
        {
          descriptions: {
            text: {
              containsi: value,
            },
          },
        },
      ],
    });
  });
};

export const convertSearchParamsToPictureFilters = (searchParams: URLSearchParams) => {
  const filters: PictureFiltersInput = { and: [] };

  if (searchParams.has(SearchType.ALL)) searchAll(searchParams, filters);
  if (searchParams.has(SearchType.DECADE)) searchDecade(searchParams, filters);
  if (searchParams.has(SearchType.KEYWORD)) searchKeyword(searchParams, filters);
  if (searchParams.has(SearchType.DESCRIPTION)) searchDescription(searchParams, filters);
  if (searchParams.has(SearchType.PERSON)) searchPerson(searchParams, filters);
  if (searchParams.has(SearchType.LOCATION)) searchLocation(searchParams, filters);

  return filters;
};
