# Crowd-Sourced Picture Archive for Bad Harzburg / BP2021RH1

For our web application we use React as a UI-framework and Strapi as a CMS. For the client-server communication we use GraphQL.

As an entry point we recommend reading our [bachelor theses](https://lilac-oriole-6ab.notion.site/21-22-Technical-Report-bachelor-theses-4cfeabb4033b4d038a4c651d00d96097), especially chapter 4-6 as they focus on the implementation.

To understand our code it is important to know the fundamentals of TypeScript (if you haven’t worked with TypeScript/JavaScript before), [React](https://reactjs.org/docs/hello-world.html) and [GraphQL](https://graphql.org/learn/) (also interesting: [Strapi GraphQL API](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/graphql-api.html)).

There are two main projects: [`bp-gallery`](/projects/bp-gallery) and [`bp-strapi`](/projects/bp-strapi). The [`bp-gallery`](/projects/bp-gallery) project includes the frontend code (React), [`bp-strapi`](/projects/bp-strapi) the backend code (Strapi).

To start local development you

1. install [node](https://nodejs.org) (≥14, recommended: 16) and [yarn](https://yarnpkg.com/getting-started)
2. execute `yarn` in the [`bp-gallery`](/projects/bp-gallery) directory to install the dependencies
3. execute `yarn simple-generate-api` to generate API definitions
4. execute `yarn start` in `projects/bp-gallery`
5. in `projects/bp-strapi`, execute `yarn test-db` to launch a docker container running postgres
6. same folder, run `yarn develop` to start the backend
7. visit [http://localhost:3000/]()

The whole Documentation can be found [here](https://lilac-oriole-6ab.notion.site/1ac4cd0f3bc54968a87e24a63653322a?v=06ffdc8582af49d9a9e7a4a33603399a).
