const ContentBanner = ({
  color,
  title,
  text,
  actionButton,
  imgSrc,
}: {
  color: string;
  title?: string;
  text?: string;
  actionButton?: JSX.Element;
  imgSrc?: string;
}) => {
  return (
    <div className='-mx-8 overflow-hidden relative' style={{ background: color }}>
      <div className='flex'>
        <div className='z-20 ml-8 w-2/5 my-auto py-4 pr-8' style={{ background: color + 'aa' }}>
          <h2 className='ml-0 mb-0'>{title}</h2>
          <p className='mt-2 pr-4'>{text}</p>
          {actionButton}
        </div>
        <img
          src={imgSrc}
          alt='bh-logo'
          className='z-10 -skew-x-[16deg] absolute left-[50%] bottom-[-9999px] top-[-9999px] m-auto'
        />
      </div>
    </div>
  );
};

export default ContentBanner;
