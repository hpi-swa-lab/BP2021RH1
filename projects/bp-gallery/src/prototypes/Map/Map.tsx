import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './Map.scss';
import PictureMarker from './PictureMarker';
// import L from 'leaflet';
import metadata from './metadata.json';

export interface PictureDescriptionText {
  text: string;
}

export interface PictureDescription {
  attributes: PictureDescriptionText;
}

export interface PictureTimeRange {
  start: string;
  end: string;
}

export interface Position {
  latitude: number;
  longitude: number;
}

export interface PictureInfo {
  id: number;
  descriptions: PictureDescription[];
  time: PictureTimeRange;
  position?: Position;
}

export interface Marker {
  fileName: string;
  description?: string;
  longitude: number;
  latitude: number;
}

const Map = () => {
  const pictureInfos: { [key: string]: PictureInfo } = metadata as unknown as {
    [key: string]: PictureInfo;
  };

  const saveMarkersPosition = () => {
    const url = window.URL.createObjectURL(new Blob([JSON.stringify(pictureInfos)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.json');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <MapContainer center={[51.871020514341126, 10.562439542954966]} zoom={13}>
      {/* <Button className='marker-save-button' onClick={saveMarkersPosition}>
        save marker
      </Button> */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {Object.values(pictureInfos).map((pictureInfo: any, index: number) => {
        if (
          index === 5 ||
          index === 32 ||
          index === 22 ||
          index === 26 ||
          index === 28 ||
          index === 39 ||
          index === 18
        )
          return '';
        console.log(pictureInfo, index);
        return (
          <PictureMarker
            key={index}
            fileName={`/pictures/picture${index}.jpg`}
            description={pictureInfo.descriptions[0].attributes.text || ''}
            draggable={false}
            latitude={pictureInfo.position.latitude}
            longitude={pictureInfo.position.longitude}
            showPicture={true}
            onPosChange={(latitude: number, longitude: number) => {
              console.log(latitude, longitude);

              pictureInfo.position = {
                latitude: latitude,
                longitude: longitude,
              };
              pictureInfos[index.toString()] = pictureInfo;
            }}
          />
        );
      })}
      <PictureMarker
        key={18}
        fileName={`/pictures/picture18.jpg`}
        description={pictureInfos['18'].descriptions[0].attributes.text || ''}
        draggable={true}
        latitude={51.883786080679336 + 0.0005}
        longitude={10.527830221435579}
        showPicture={true}
        onPosChange={(latitude: number, longitude: number) => {
          pictureInfos['18'].position = {
            latitude: latitude,
            longitude: longitude,
          };
        }}
      />
    </MapContainer>
  );
};
export default Map;
