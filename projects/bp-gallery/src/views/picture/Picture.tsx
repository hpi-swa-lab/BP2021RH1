import React from 'react';

const Picture = ({ pictureInfo }: { pictureInfo: string }) => {
  const imageLink = 'https://bp.bad-harzburg-stiftung.de/api/' + pictureInfo;
  return (
    <div>
      <img src={imageLink} alt={'test'} />
    </div>
  );
};

export default Picture;
