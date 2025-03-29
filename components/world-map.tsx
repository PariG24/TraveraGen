import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchLocations } from '@/data/locations'; // Import fetchLocations function
import { Tables } from '@/database.types';

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
  shadowSize: [41, 41]
});

// Custom hook to track user location
const TrackUserLocation = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  const initialZoom = useRef(true);
  const userZoomLevel = useRef<number | null>(null);

  useEffect(() => {
    if (position) {
      if (initialZoom.current) {
        map.setView(position, 18, { animate: true });
        userZoomLevel.current = map.getZoom();
        initialZoom.current = false;
      } else {
        const zoomLevel = userZoomLevel.current || map.getZoom();
        map.panTo(position, { animate: true, duration: 1.5, easeLinearity: 0.25 });
      }
    }
  }, [position, map]);

  return null;
};

export type Location = Tables<'Locations'>;

const WorldMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [locations, setLocations] = useState<Location[]>([]); // Store locations data
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState<number>(2);

  // Fetch locations when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const locationsData = await fetchLocations();
      setLocations(locationsData); // Set locations from Supabase
    };

    fetchData();
  }, []);

  // Handle map cleanup and re-initialization
  useEffect(() => {
    if (mapRef.current) {
      // Remove the previous map before creating a new one
      mapRef.current.off()
      mapRef.current.remove();
    }
  }, [center, zoom]); // Re-run cleanup when center or zoom changes

  const handleMarkerClick = (coordinates: [number, number]) => {
    if (mapRef.current) {
      mapRef.current.flyTo(coordinates, 18); // Set to maximum zoom level
    }
    setCenter(coordinates);
    setZoom(18); // Set to maximum zoom level
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      ref={mapRef}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
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
