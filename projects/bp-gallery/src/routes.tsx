import { RouteConfig } from "react-router-config";
import App from "./App";
import Home from "./Home";
import Demo from "./prototypes/demo";

const routes: RouteConfig[] = [
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
      },
      {
        // fallback component for unmatched routes
        component: Home
      }
    ]	
  }
];

export default routes;
