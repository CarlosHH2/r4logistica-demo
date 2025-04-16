
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { AddressAutofill } from '@mapbox/search-js-react';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

// Set your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zaDIiLCJhIjoiY203aWxlNHU5MXNwNjJzcTNmZGZscThqaSJ9.mt9vzXHbWRtOj6rqrpSD5g';

type MapDisplayProps = {
  onAddressSelect: (address: {
    street: string;
    number: string;
    neighborhood: string;
    postal_code: string;
    administrative_area: string;
    sub_administrative_area: string;
    lat?: number;
    lng?: number;
  }) => void;
};

const MapDisplay: React.FC<MapDisplayProps> = ({ onAddressSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [addressQuery, setAddressQuery] = useState('');
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-99.1332, 19.4326], // Mexico City center
      zoom: 10
    });
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());
    
    // Create a marker that will be updated on address selection
    marker.current = new mapboxgl.Marker({ color: '#FF0000' });

    // Cleanup on unmount
    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  // Handle address selection
  const handleAddressSelection = async (e: any) => {
    if (!e.features || !e.features.length || !map.current || !marker.current) return;
    
    const feature = e.features[0];
    const coordinates = feature.geometry.coordinates;
    
    // Update map view
    map.current.flyTo({
      center: coordinates,
      zoom: 16
    });
    
    // Update marker
    marker.current.setLngLat(coordinates).addTo(map.current);
    
    // Extract address components
    const address = {
      street: feature.properties.address_line1?.split(' ').slice(1).join(' ') || '',
      number: feature.properties.address_line1?.split(' ')[0] || '',
      neighborhood: feature.properties.neighborhood || feature.properties.locality || '',
      postal_code: feature.properties.postcode || '',
      administrative_area: feature.properties.region || '',
      sub_administrative_area: feature.properties.place || '',
      lat: coordinates[1],
      lng: coordinates[0]
    };
    
    // Pass the address back to the parent component
    onAddressSelect(address);
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <div id="address-autofill-container">
              {/* Fixed: Use a render function pattern for AddressAutofill */}
              <AddressAutofill accessToken={mapboxgl.accessToken} onRetrieve={handleAddressSelection}>
                <Input
                  placeholder="Buscar dirección..."
                  className="pl-8"
                  autoComplete="street-address"
                  value={addressQuery}
                  onChange={(e) => setAddressQuery(e.target.value)}
                />
              </AddressAutofill>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Busca una dirección o selecciona un punto en el mapa
          </p>
        </div>
      </div>
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
    </Card>
  );
};

export default MapDisplay;
