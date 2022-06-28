import React from "react";
import { ImageList, ImageListItem } from "@material-ui/core";

function Banner() {
  return (
    <div className="mt-1 h-screen w-full border-gray-primary flex flex-col items-center sticky">
      <ImageList rowHeight={330} cols={1}>
        <ImageListItem>
          <img
            src="https://i.ibb.co/cTCB75P/Blank-Template-Instagram-Stories-1.jpg"
            alt="Blank-Template-Instagram-Stories-1"
            border="0"
          />
        </ImageListItem>
        <ImageListItem>
          <img
            src="https://i.ibb.co/Z83n6Qx/Blank-Template-Instagram-Stories.jpg"
            alt="Blank-Template-Instagram-Stories"
            border="0"
          />
        </ImageListItem>
      </ImageList>
    </div>
  );
}

export default Banner;
