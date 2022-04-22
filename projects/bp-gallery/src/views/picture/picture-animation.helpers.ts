const TRANSITION_LENGTH = 500;

export const zoomIntoPicture = (elementId: string) => {
  const element: HTMLDivElement | null = document.querySelector(`#${elementId}`);
  if (!element) {
    return Promise.resolve();
  }
  const startSize = element.getBoundingClientRect();
  const placeholder = document.createElement('div');
  placeholder.style.width = `${startSize.width}px`;
  placeholder.style.height = `${startSize.height}px`;
  element.parentNode?.insertBefore(placeholder, element);
  element.classList.add('transitioning');
  element.style.top = `${startSize.y}px`;
  element.style.left = `${startSize.x}px`;
  element.style.width = `${startSize.width}px`;
  element.style.height = `${startSize.height}px`;
  return new Promise<void>(resolve => {
    window.setTimeout(() => {
      element.style.top = '0px';
      element.style.left = '0px';
      element.style.width = `${window.innerWidth}px`;
      element.style.height = `${window.innerHeight}px`;
    }, 20);
    window.setTimeout(() => {
      element.style.top = '';
      element.style.left = '';
      element.style.width = '';
      element.style.height = '';

      element.classList.remove('transitioning');
      placeholder.remove();
      resolve();
    }, TRANSITION_LENGTH + 20);
  });
};

export const zoomOutOfPicture = (elementId: string) => {
  const element: HTMLDivElement | null = document.querySelector(`#${elementId}`);
  if (!element) {
    return Promise.resolve();
  }
  const targetSize = element.getBoundingClientRect();
  const placeholder = document.createElement('div');
  placeholder.style.width = `${targetSize.width}px`;
  placeholder.style.height = `${targetSize.height}px`;
  element.parentNode?.insertBefore(placeholder, element);
  element.style.top = '0px';
  element.style.left = '0px';
  element.style.width = `${window.innerWidth}px`;
  element.style.height = `${window.innerHeight}px`;
  element.classList.add('transitioning');
  return new Promise<void>(resolve => {
    window.setTimeout(() => {
      element.style.top = `${targetSize.y}px`;
      element.style.left = `${targetSize.x}px`;
      element.style.width = `${targetSize.width}px`;
      element.style.height = `${targetSize.height}px`;
    }, 0);
    window.setTimeout(() => {
      element.style.top = '';
      element.style.left = '';
      element.style.width = '';
      element.style.height = '';
      element.classList.remove('transitioning');
      placeholder.remove();
      resolve();
    }, TRANSITION_LENGTH + 20);
  });
};
