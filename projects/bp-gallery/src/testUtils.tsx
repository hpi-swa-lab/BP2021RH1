import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { createMemoryHistory, MemoryHistory } from "history";
import routes from "./routes";

/**
 * Enables test-rendering of components based on our prior defined routes
 * @see https://testing-library.com/docs/example-react-router/
 */
export const renderRoute = (route: string) => {
  const history: MemoryHistory = createMemoryHistory();
  history.push(route);
  return render(
    <Router history={ history }>
      { renderRoutes(routes) }
    </Router>
  );
}
