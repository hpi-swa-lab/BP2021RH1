import App from "./App";
import Home from "./Home";
import Demo from "./prototypes/demo/Demo";

const routes = [
  {
    component: App,
    routes: [
      {
        path: "/",
        exact: true,
        component: Home
      },
      {
        path: "/prototypes/demo",
        component: Demo
      }
    ]	
  }
];

export default routes;
