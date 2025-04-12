import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchLocations } from '@/data/locations'; // Import fetchLocations function
import { Tables } from '@/database.types';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

// Custom yellow icon for current location
const yellowHumanIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Custom hook to track user location
const TrackUserLocation = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  const initialZoom = useRef(true);
  const userZoomLevel = useRef<number | null>(null);

  useEffect(() => {
    if (position) {
      console.log('User Location:', position);
      if (initialZoom.current) {
        map.setView(position, 18, { animate: true });
        userZoomLevel.current = map.getZoom();
        initialZoom.current = false;
      } else {
        const zoomLevel = userZoomLevel.current || map.getZoom();
        map.setView(position, zoomLevel, { animate: true });
      }
    }
  }, [position, map]);

  return null;
};

// Use the Location type from Tables<'Locations'>
export type Location = Tables<'Locations'>;

const WorldMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Fetch locations from the database
  useEffect(() => {
    const fetchData = async () => {
      const locationsData = await fetchLocations();
      setLocations(locationsData);
    };

    fetchData();
  }, []);

  // Track user's location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation: [number, number] = [latitude, longitude];
          console.log('New user coordinates:', newLocation);
          setCurrentLocation(newLocation);
          setMapReady(true);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleMarkerClick = (coordinates: [number, number]) => {
    if (mapRef.current) {
      mapRef.current.flyTo(coordinates, 18, { animate: true }); // Fly to the clicked marker
    }
  };

  return (
    <MapContainer
      center={currentLocation || [0, 0]}
      zoom={2}
      ref={mapRef}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Add TrackUserLocation to track and center on the user's location */}
      {mapReady && currentLocation && <TrackUserLocation position={currentLocation} />}
      {/* Add a marker for the user's current location */}
      {currentLocation && (
        <Marker position={currentLocation} icon={yellowHumanIcon}>
          <Popup>
            <div>
              <h3>You're Currently Here</h3>
            </div>
          </Popup>
        </Marker>
      )}
      {/* Add markers for other locations */}
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.Latitude ?? 0, location.Longitude ?? 0]}
          eventHandlers={{ click: () => handleMarkerClick([location.Latitude ?? 0, location.Longitude ?? 0]) }}
        >
          <Popup>
            <div>
              <h3>{location.Location_Name}</h3>
              <p>{location.Address}</p>
              <a href={location.URL ?? ''} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default WorldMap;