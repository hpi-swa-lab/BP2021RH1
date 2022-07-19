# BP2021RH1

For our application we use React as a UI-framework and Strapi as a CMS. For the client-server communication we use GraphQL.

As an entry point we recommend reading our [bachelor theses](https://lilac-oriole-6ab.notion.site/21-22-Technical-Report-bachelor-theses-4cfeabb4033b4d038a4c651d00d96097), especially chapter 4-6 as they focus on the implementation.

To understand our code it is important to know the fundamentals of TypeScript (if you haven’t worked with TypeScript/JavaScript before), [React](https://reactjs.org/docs/hello-world.html) and [GraphQL](https://graphql.org/learn/) (also interesting: [Strapi GraphQL API](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/graphql-api.html)).

There are two main folders: bp-gallery and bp-strapi. bp-gallery includes the frontend code (React), bp-strapi the backend code (Strapi).

To start local development you first have to install [node](https://nodejs.org) (≥14, recommended: 16) and [yarn](https://yarnpkg.com/getting-started).

By using the command `yarn start` in the bp-gallery folder you now can start a local instance of the React application. By default this instance communicates with our production backend. How to setup a local backend instance and use it gets described [here](https://lilac-oriole-6ab.notion.site/How-to-setup-a-local-Strapi-instance-ffecc3d084e744dbb931715cc955ddfb).

The whole Documentation can be found [here](https://lilac-oriole-6ab.notion.site/1ac4cd0f3bc54968a87e24a63653322a?v=06ffdc8582af49d9a9e7a4a33603399a).

