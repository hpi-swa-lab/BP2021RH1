import React from "react";
import { IconButton, Stack, Pagination } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";

const Gallery = ({ pictures, currentPage, pageCount, onPageChange, selectedPicture, onPictureSelect, apiBase }) => (
  pictures && pictures.length > 0 &&
    <Stack spacing={ 3 } className="gallery-stack">
      <div className="gallery">
        {
          pictures.map((image: any, index: number) => (
            <div
              key={ image.id }
              className={ `picture${ selectedPicture === image ? " selected" : "" }` }
              style={ { animationDelay: `${ index * 0.1 }s` } }
              onClick={ () => onPictureSelect(image) }
            >
              <img src={ `${ apiBase }${ image.media.formats.thumbnail.url }` } alt=""/>
              <div className="img-operations-overlay">
                <IconButton
                  onClick={ () => {
                    window.open(`${ apiBase }${ image.media.formats.large.url }`, "_blank");
                  } }
                >
                  <OpenInNew/>
                </IconButton>
              </div>
            </div>
          ))
        }
      </div>
      <Pagination
        page={ currentPage }
        count={ pageCount }
        onChange={ (evt, page: number) => onPageChange(page) }
      />
    </Stack>
);

export default Gallery;
