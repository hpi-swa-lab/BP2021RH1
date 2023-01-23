import React from 'react';
import { IconButton, Stack, Pagination, OpenInNew } from 'mui';

interface GalleryProps {
  pictures: any[];
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  selectedPicture: any;
  onPictureSelect: (picture: any) => void;
  apiBase: string;
}

const Gallery = ({
  pictures,
  currentPage,
  pageCount,
  onPageChange,
  selectedPicture,
  onPictureSelect,
  apiBase,
}: GalleryProps) => (
  <>
    {pictures.length > 0 && (
      <Stack spacing={3} className='gallery-stack'>
        <div className='gallery'>
          {pictures.map((image: any, index: number) => (
            <div
              key={image.id}
              className={`picture${selectedPicture === image ? ' selected' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onPictureSelect(image)}
            >
              <img src={`${apiBase}${image.media.formats.thumbnail.url as string}`} alt='' />
              <div className='img-operations-overlay'>
                <IconButton
                  onClick={() => {
                    window.open(`${apiBase}${image.media.formats.large.url as string}`, '_blank');
                  }}
                >
                  <OpenInNew />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          page={currentPage}
          count={pageCount}
          onChange={(evt, page: number) => onPageChange(page)}
        />
      </Stack>
    )}
  </>
);

export default Gallery;
