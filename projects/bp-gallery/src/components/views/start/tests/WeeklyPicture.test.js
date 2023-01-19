import { choosePictureId } from '../WeeklyPicture';

const pictureIds = ['1', '2', '3'];
describe('correct picture for each week is chosen', () => {
  beforeAll(() => jest.useFakeTimers('modern'));
  it('should select first item on first week of january', () => {
    jest.setSystemTime(new Date('2023-01-01'));
    expect(choosePictureId(pictureIds)).toEqual('1');
  });

  it('should select second item on second week of january', () => {
    jest.setSystemTime(new Date('2023-01-02'));
    expect(choosePictureId(pictureIds)).toEqual('2');
  });

  it('should select third item on third week of january', () => {
    jest.setSystemTime(new Date('2023-01-09'));
    expect(choosePictureId(pictureIds)).toEqual('3');
  });

  it('should select first item on forth week of january', () => {
    jest.setSystemTime(new Date('2023-01-16'));
    expect(choosePictureId(pictureIds)).toEqual('1');
  });
});
