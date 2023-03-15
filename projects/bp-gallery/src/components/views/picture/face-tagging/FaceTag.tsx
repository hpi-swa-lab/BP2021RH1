export const FaceTag = ({ name, x, y }: { name: string; x: number; y: number }) => {
  const triangleHeight = 10;
  const triangleWidth = 20;
  return (
    <div
      className='absolute translate-x-[-50%] z-[9999] flex flex-col items-center'
      style={{
        top: `${y * 100}%`,
        left: `${x * 100}%`,
      }}
    >
      <svg
        width={triangleWidth}
        height={triangleHeight}
        viewBox={`0 0 ${triangleWidth} ${triangleHeight}`}
      >
        <polygon
          fill='#404173bb'
          points={`0,${triangleHeight} ${triangleWidth / 2},0 ${triangleWidth},${triangleHeight}`}
        />
      </svg>{' '}
      <div className='bg-[#404173bb] p-2 rounded-md text-white'>{name}</div>
    </div>
  );
};
