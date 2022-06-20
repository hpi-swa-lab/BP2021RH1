import { PictureFiltersInput } from '../../../../graphql/APIConnector';
import { SearchType } from '../SearchView';

const buildFilter = (value: string) => {
  return {
    name: {
      containsi: value,
    },
  };
};

const buildTimeRangeFilter = (startTime: string, endTime: string) => {
  return {
    start: {
      gte: startTime,
    },
    end: {
      lte: endTime,
    },
  };
};

/**
 * Convert a decade key to a time-range-related search term in form of '1950-1959',
 * which is compatible with our parsing before the ALL-Search.
 */
export const getDecadeSearchTermForAllSearch = (decadeKey: string) => {
  const numberedDecadeKey = parseInt(decadeKey);
  const startYear = numberedDecadeKey === 4 ? '1900' : `19${numberedDecadeKey}0`;
  const endYear = `19${numberedDecadeKey}9`;
  return `${startYear}-${endYear}`;
};

export const paramToTime = (timeParam: string) => {
  // Specification of year range e.g. '1970-1979'
  if (timeParam.includes('-')) {
    const yearParts = timeParam.split('-').map(yearPart => parseInt(yearPart.trim()));
    if (!isNaN(yearParts[0]) && !isNaN(yearParts[1])) {
      let startYear = yearParts[0];
      startYear = startYear >= 100 ? startYear : 1900 + startYear;
      const startTime = `${startYear}-01-01T00:00:00Z`;

      let endYear = yearParts[1];
      endYear = endYear >= 100 ? endYear : 1900 + endYear;
      const endTime = `${endYear}-12-31T23:59:59Z`;

      return { startTime, endTime, valid: true };
    }
  }

  // Simple year specification e.g. '1972'
  const year = parseInt(timeParam);
  let startTime = `${year}-01-01T00:00:00Z`;
  let endTime = `${year}-12-31T23:59:59Z`;
  if (!isNaN(year)) {
    if (year < 100) {
      startTime = `19${year}-01-01T00:00:00Z`;
      endTime = `19${year}-12-31T23:59:59Z`;
    }
    return { startTime, endTime, valid: true };
  }

  // Fallthrough if invalid time or time-range
  return { startTime: '', endTime: '', valid: false };
};

const searchYear = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const timeParams = searchParams.getAll(SearchType.TIME_RANGE);
  timeParams.forEach(timeParam => {
    const { startTime, endTime, valid } = paramToTime(timeParam);
    if (valid) {
      const time_range_tag_filter = buildTimeRangeFilter(startTime, endTime);
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
    }
  });
};

export const buildDecadeFilter = (decade: string) => {
  let startTime: string, endTime: string;
  const year = parseInt(decade);
  if (!isNaN(year)) {
    if (year === 4) {
      startTime = `1900-01-01T00:00:00Z`;
    } else {
      startTime = `19${year}0-01-01T00:00:00Z`;
    }
    endTime = `19${year}9-12-31T23:59:59Z`;

    const time_range_tag_filter = buildTimeRangeFilter(startTime, endTime);

    return {
      or: [
        {
          time_range_tag: time_range_tag_filter,
        },
        {
          verified_time_range_tag: time_range_tag_filter,
        },
      ],
    } as PictureFiltersInput;
  }
};

const searchDecade = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const timeParams = searchParams.getAll(SearchType.DECADE);
  timeParams.forEach(timeParam => {
    filters.and?.push(buildDecadeFilter(timeParam) ?? null);
  });
};

const searchKeyword = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const keywords = searchParams.getAll(SearchType.KEYWORD).map(decodeURIComponent);
  keywords.forEach((keyword: string) => {
    const keyword_tag_filter = buildFilter(keyword);
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

const searchCollection = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const collections = searchParams.getAll(SearchType.COLLECTION).map(decodeURIComponent);
  collections.forEach((collection: string) => {
    const collection_filter = buildFilter(collection);
    filters.and?.push({
      or: [
        {
          collections: collection_filter,
        },
      ],
    });
  });
};

const searchArchiveTag = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const archiveTags = searchParams.getAll(SearchType.ARCHIVE).map(decodeURIComponent);
  archiveTags.forEach((archiveTag: string) => {
    const archiveTagFilter = buildFilter(archiveTag);
    filters.and?.push({
      or: [
        {
          archive_tag: archiveTagFilter,
        },
      ],
    });
  });
};

const searchLocation = (searchParams: URLSearchParams, filters: PictureFiltersInput) => {
  const locations = searchParams.getAll(SearchType.LOCATION).map(decodeURIComponent);
  locations.forEach((location: string) => {
    const location_tag_filter = buildFilter(location);
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
    const person_tag_filter = buildFilter(person);
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

export const convertSearchParamsToPictureFilters = (searchParams: URLSearchParams) => {
  const filters: PictureFiltersInput = { and: [] };

  if (searchParams.has(SearchType.TIME_RANGE)) searchYear(searchParams, filters);
  if (searchParams.has(SearchType.KEYWORD)) searchKeyword(searchParams, filters);
  if (searchParams.has(SearchType.DESCRIPTION)) searchDescription(searchParams, filters);
  if (searchParams.has(SearchType.PERSON)) searchPerson(searchParams, filters);
  if (searchParams.has(SearchType.LOCATION)) searchLocation(searchParams, filters);
  if (searchParams.has(SearchType.DECADE)) searchDecade(searchParams, filters);
  if (searchParams.has(SearchType.COLLECTION)) searchCollection(searchParams, filters);
  if (searchParams.has(SearchType.ARCHIVE)) searchArchiveTag(searchParams, filters);

  return filters;
};
