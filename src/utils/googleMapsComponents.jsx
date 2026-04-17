import { useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

// Custom Polyline component because vis.gl/react-google-maps doesn't include one natively
export const Polyline = ({ path, options, onClick }) => {
  const map = useMap();
  const [polyline, setPolyline] = useState(null);

  useEffect(() => {
    if (!map) return;
    const p = new google.maps.Polyline({
      path,
      ...options
    });
    p.setMap(map);
    setPolyline(p);
    return () => {
      p.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (!polyline) return;
    polyline.setOptions(options);
    polyline.setPath(path);
  }, [polyline, path, options]);

  useEffect(() => {
    if (!polyline || !onClick) return;
    const listener = google.maps.event.addListener(polyline, 'click', (e) => {
      onClick(e);
    });
    return () => google.maps.event.removeListener(listener);
  }, [polyline, onClick]);

  return null;
};
