// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// we need this to test components that are using i18nex
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

// Mocks necessary for item list item tests
document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = jest.fn(() => {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      toJSON: () => {},
    };
  });

  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn(),
    };
  };

  return range;
};

// needs to be done here because the list item tests as well as
// the app tests need this behavior
(window.SVGElement.prototype as any).getBBox = () => ({
  x: 0,
  y: 0,
});

(window.HTMLDivElement.prototype as any).scroll = () => {};
