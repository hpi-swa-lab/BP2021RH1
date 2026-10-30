import type { Attribute, Schema } from '@strapi/strapi';

export interface CommonSynonyms extends Schema.Component {
  collectionName: 'components_common_synonyms';
  info: {
    description: '';
    displayName: 'synonym';
    icon: 'layer-group';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
  };
}

export interface LocationCoordinates extends Schema.Component {
  collectionName: 'components_location_coordinates';
  info: {
    displayName: 'Coordinates';
    icon: 'map-marked-alt';
  };
  attributes: {
    latitude: Attribute.Float &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          max: 90;
          min: -90;
        },
        number
      >;
    longitude: Attribute.Float &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          max: 180;
          min: -180;
        },
        number
      >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'common.synonyms': CommonSynonyms;
      'location.coordinates': LocationCoordinates;
    }
  }
}
