export function getPreviousPictureId(id: string, siblings?: string[]): string | undefined {
  if (!siblings?.includes(id)) {
    return undefined;
  }
  const currentIndex = siblings.indexOf(id);
  if (currentIndex > 0) {
    return siblings[currentIndex - 1];
  }
  return undefined;
}

export function getNextPictureId(id: string, siblings?: string[]): string | undefined {
  if (!siblings?.includes(id)) {
    return undefined;
  }
  const currentIndex = siblings.indexOf(id);
  if (currentIndex < siblings.length - 1) {
    return siblings[currentIndex + 1];
  }
  return undefined;
}
