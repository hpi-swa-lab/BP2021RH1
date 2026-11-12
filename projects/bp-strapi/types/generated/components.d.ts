import type { Schema, Struct } from '@strapi/strapi';

export interface CommonSynonyms extends Struct.ComponentSchema {
  collectionName: 'components_common_synonyms';
  info: {
    description: '';
    displayName: 'synonym';
    icon: 'layer-group';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LocationCoordinates extends Struct.ComponentSchema {
  collectionName: 'components_location_coordinates';
  info: {
    displayName: 'Coordinates';
    icon: 'map-marked-alt';
  };
  attributes: {
    latitude: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 90;
          min: -90;
        },
        number
      >;
    longitude: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 180;
          min: -180;
        },
        number
      >;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'common.synonyms': CommonSynonyms;
      'location.coordinates': LocationCoordinates;
    }
  }
}
