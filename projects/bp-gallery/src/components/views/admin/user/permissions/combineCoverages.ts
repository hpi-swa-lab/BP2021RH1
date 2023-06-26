import { Coverage } from './Coverage';

export const combineCoverages = (coverages: Coverage[]) => {
  if (coverages.every(coverage => coverage === Coverage.ALL)) {
    return Coverage.ALL;
  }
  if (coverages.every(coverage => coverage === Coverage.NONE)) {
    return Coverage.NONE;
  }
  return Coverage.SOME;
};
