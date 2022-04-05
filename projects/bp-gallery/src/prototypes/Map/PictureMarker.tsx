import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const PictureMarker = ({
  fileName,
  description,
  draggable,
  latitude,
  longitude,
  showPicture,
  onPosChange,
}: {
  fileName: string;
  description?: string;
  draggable: boolean;
  latitude: number;
  longitude: number;
  showPicture: boolean;
  onPosChange: (latitude: number, longitude: number) => void;
}) => {
  const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });
  L.Marker.prototype.options.icon = DefaultIcon;
  const markerIcon = new L.Icon({
    iconUrl: fileName,
    iconRetinaUrl: fileName,
    iconAnchor: new L.Point(32, 32),
    popupAnchor: new L.Point(0, -32),
    iconSize: new L.Point(64, 64),
    className: 'leaflet-div-icon',
  });

  return (
    <Marker
      position={[latitude, longitude]}
      icon={showPicture ? markerIcon : DefaultIcon}
      eventHandlers={{
        dragend: event => {
          onPosChange(event.target.getLatLng().lat, event.target.getLatLng().lng);
        },
      }}
      draggable={draggable}
    >
      <Popup>
        <img src={fileName} alt={''} width='200' height='200' />
        <div> {description} </div>
      </Popup>
    </Marker>
  );
};

export default PictureMarker;
