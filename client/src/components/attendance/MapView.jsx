const MapView = ({ location }) => (
  <div className="map-view">
    <p>GPS location: {location || 'Unknown'}</p>
  </div>
);

export default MapView;
