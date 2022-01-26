import { PictureNavigationTarget } from './components/PictureViewUI';

const TRANSITION_LENGTH = 500;

export const zoomIntoPicture = (pictureId: string, element: HTMLDivElement) => {
  const startSize = element.parentElement?.getBoundingClientRect();
  if (startSize) {
    element.style.top = `${startSize.y}px`;
    element.style.left = `${startSize.x}px`;
    element.style.width = `${startSize.width}px`;
    element.style.height = `${startSize.height}px`;
  }
  return new Promise<void>(resolve => {
    window.setTimeout(() => {
      const placeholder = document.createElement('div');
      element.parentNode?.insertBefore(placeholder, element);
    }, 0);
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
      resolve();
    }, TRANSITION_LENGTH + 20);
  });
};

export const zoomOutOfPicture = (element: HTMLDivElement) => {
  const targetSize = element.parentElement?.getBoundingClientRect();
  if (targetSize) {
    element.style.top = `${targetSize.y}px`;
    element.style.left = `${targetSize.x}px`;
    element.style.width = `${targetSize.width}px`;
    element.style.height = `${targetSize.height}px`;
  }
  return new Promise<void>(resolve => {
    window.setTimeout(() => {
      element.style.top = '';
      element.style.left = '';
      element.style.width = '';
      element.style.height = '';
      resolve();
    }, TRANSITION_LENGTH + 20);
  });
};

export const nextImageAnimation = (
  currentElement: HTMLDivElement,
  target: PictureNavigationTarget
) => {
  return new Promise<void>(resolve => {
    if (!currentElement.parentElement) {
      resolve();
      return;
    }
    const image: HTMLImageElement = currentElement.querySelector(
      'img:not(.blur-background)'
    ) as HTMLImageElement;
    const allImages = Array.from(
      (document.querySelector('.picture-grid') as HTMLDivElement).querySelectorAll(
        '.picture-view-container'
      )
    );
    const slideClass = target === PictureNavigationTarget.NEXT ? 'slide-left' : 'slide-right';
    const currentIndex = allImages.indexOf(currentElement.parentElement);
    const newImage =
      allImages.at(currentIndex + (target === PictureNavigationTarget.NEXT ? 1 : -1)) ??
      currentElement.parentElement;
    const thumbnailLink = newImage.querySelector('img')?.src as string;
    const nextImage = document.createElement('img');
    nextImage.src = thumbnailLink;
    image.classList.add(slideClass);
    nextImage.className = `another-image ${slideClass}`;
    currentElement.querySelector('.picture-container')?.appendChild(nextImage);
    window.setTimeout(() => {
      nextImage.remove();
      image.classList.remove(slideClass);
      resolve();
    }, TRANSITION_LENGTH);
  });
};
