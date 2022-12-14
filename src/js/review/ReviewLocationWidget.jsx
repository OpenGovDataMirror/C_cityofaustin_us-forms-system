import React from 'react';

export default function ReviewLocationWidget(props) {
  const valueJSON = props.value ? props.value : props.schema.formData;
  const location = JSON.parse(valueJSON);
  // mapbox static map styles
  const MAPBOX_TOKEN = 'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw';
  const markerColor = '0050d7';
  const markerOverlay = `pin-l+${markerColor}(${location.position.lng},${location.position.lat})`;
  const zoom = 15;
  const width = 680;
  const height = 400;
  // eslint-disable-next-line max-len
  const staticMap = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${markerOverlay}/${location.position.lng},${location.position.lat},${zoom}/${width}x${height}?access_token=${MAPBOX_TOKEN}`;

  return (
    <div>
      <img src={staticMap} alt={location.address}/>
      <div>{location.address}</div>
    </div>
  );
}
