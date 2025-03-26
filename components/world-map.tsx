import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchLocations, Location } from '@/data/locations'; // Import fetchLocations function

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

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
          position={location.coordinates}
          eventHandlers={{ click: () => handleMarkerClick(location.coordinates) }}
        >
          <Popup>
            <div>
              <h3>{location.name}</h3>
              <p>{location.address}</p>
              <a href={location.instagramLink} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default WorldMap;
