
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Trash } from 'lucide-react';
import { Order } from '@/types/order';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zaDIiLCJhIjoiY203aWxlNHU5MXNwNjJzcTNmZGZscThqaSJ9.mt9vzXHbWRtOj6rqrpSD5g';

interface DrawableMapProps {
  onPolygonComplete?: (coordinates: number[][]) => void;
  orders?: Order[];
  onError?: (error: string) => void;
}

const DrawableMap: React.FC<DrawableMapProps> = ({ onPolygonComplete, orders = [], onError }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Limpiar marcadores existentes
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  // Agregar marcadores para las órdenes
  const addOrderMarkers = () => {
    if (!map.current) return;
    
    clearMarkers();

    try {
      orders.forEach(order => {
        if (order.lat && order.lng) {
          const marker = new mapboxgl.Marker()
            .setLngLat([order.lng, order.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(
                  `<div>
                    <p><strong>Dirección:</strong> ${order.street} ${order.number}</p>
                    <p><strong>Código Postal:</strong> ${order.postal_code}</p>
                  </div>`
                )
            )
            .addTo(map.current);
          
          markersRef.current.push(marker);
        }
      });
    } catch (err) {
      console.error('Error adding markers:', err);
      onError?.('Error al agregar marcadores al mapa');
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-99.1332, 19.4326], // Ciudad de México
        zoom: 11
      });

      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        }
      });

      map.current.addControl(draw.current);
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('draw.create', (e: any) => {
        if (e.features && e.features.length > 0 && e.features[0].geometry && e.features[0].geometry.coordinates) {
          const coordinates = e.features[0].geometry.coordinates[0];
          onPolygonComplete?.(coordinates);
          setIsDrawing(false);
        }
      });

      map.current.on('draw.delete', () => {
        setIsDrawing(false);
      });

      map.current.on('load', () => {
        addOrderMarkers();
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        onError?.('Error en el mapa: ' + e.error?.message || 'Error desconocido');
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      onError?.('Error al inicializar el mapa');
    }

    return () => {
      clearMarkers();
      if (map.current) {
        map.current.remove();
      }
    };
  }, []); // Initial map setup

  // Efecto para actualizar marcadores cuando cambien las órdenes
  useEffect(() => {
    addOrderMarkers();
  }, [orders]);

  const handleStartDrawing = () => {
    if (draw.current && !isDrawing) {
      draw.current.changeMode('draw_polygon');
      setIsDrawing(true);
    }
  };

  const handleClearDrawing = () => {
    if (draw.current) {
      draw.current.deleteAll();
      setIsDrawing(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Button
            onClick={handleStartDrawing}
            disabled={isDrawing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            Dibujar Zona
          </Button>
          <Button
            onClick={handleClearDrawing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Borrar
          </Button>
        </div>
      </div>
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
    </Card>
  );
};

export default DrawableMap;
