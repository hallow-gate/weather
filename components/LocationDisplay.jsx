// components/LocationDisplay.js
import React from 'react';
import './LocationDisplay.css';

const LocationDisplay = ({ placeName, location }) => {
  return (
    <div className="location-display">
      <div className="location-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
      <h2 className="place-name">{placeName}</h2>
      {location && (
        <p className="coordinates">
          {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
        </p>
      )}
    </div>
  );
};

export default LocationDisplay;
