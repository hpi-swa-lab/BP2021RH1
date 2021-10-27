import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderRoute } from "./testUtils";

test("Route mechanism renders our app component", () => {
  const { container } = renderRoute("/");

  expect(container.firstChild).toHaveClass("App");
});

const HomeMock = () => <div>Home-Mock</div>;
jest.mock("./Home", () => HomeMock);

test("Route mechanism renders the home component", () => {
  renderRoute("/");

  const element = screen.getByText(/Home-Mock/);

  expect(element).toBeInTheDocument();
});

const DemoMock = () => <div>Demo-Mock</div>;
jest.mock("./prototypes/demo", () => DemoMock);

test("Route mechanism renders the demo component", () => {
  renderRoute("/prototypes/demo");

  const element = screen.getByText(/Demo-Mock/);

  expect(element).toBeInTheDocument();
});
