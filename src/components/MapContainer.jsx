import React, { useState, useEffect, useRef } from 'react';
import { Map, useMap, useMapsLibrary, Marker } from '@vis.gl/react-google-maps';
import { Polyline } from '../utils/googleMapsComponents';
import { mapStyles } from '../utils/mapStyles';

export const MapContainer = ({ activeTool, showToast, activeRouteId, setActiveRouteId, mapStyleKey, routes, setRoutes, isGlobalView, globalStyle, resetTrigger }) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const geometryLib = useMapsLibrary('geometry');

  const isDraggingMarker = useRef(false);
  const [currentZoom, setCurrentZoom] = useState(13);

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('zoom_changed', () => {
      setCurrentZoom(map.getZoom());
    });
    return () => google.maps.event.removeListener(listener);
  }, [map]);

  useEffect(() => {
    if (resetTrigger > 0 && map) {
      map.setZoom(13);
      map.panTo({ lat: 35.6764, lng: 139.6500 });
      setCurrentZoom(13);
    }
  }, [resetTrigger, map]);

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setCurrentZoom(newZoom);
    if (map) map.setZoom(newZoom);
  };

  // When tool changes, reset active route to null if we go to adjust/erase to allow selection?
  // Actually, we can keep it. But if erasing, we don't necessarily select first.
  
  const getDirections = async (origin, destination) => {
    if (!routesLib) return [origin, destination];
    const svc = new routesLib.DirectionsService();
    try {
      const res = await svc.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.WALKING,
      });
      if (res.routes && res.routes.length > 0) {
        const path = res.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));
        return path;
      }
    } catch (err) {
      console.error("Directions error", err);
    }
    return [origin, destination]; // fallback to straight line
  };

  const handleMapClick = async (event) => {
    if (isDraggingMarker.current) return;
    if (activeTool !== 'draw') return;
    const clickedLat = event.detail.latLng.lat;
    const clickedLng = event.detail.latLng.lng;
    const newAnchor = { lat: clickedLat, lng: clickedLng };

    if (!activeRouteId) {
      // Create new route
      const newRoute = {
        id: 'route-' + Date.now(),
        style: { color: '#4F46E5', weight: 4 },
        anchors: [newAnchor],
        paths: []
      };
      setRoutes([...routes, newRoute]);
      setActiveRouteId(newRoute.id);
      showToast("Started new route");
      return;
    }

    // Extend active route
    const targetRoute = routes.find(r => r.id === activeRouteId);
    if (!targetRoute) return;

    showToast("Calculating route...");
    let newAnchors = [...targetRoute.anchors];
    let newPaths = [...targetRoute.paths];

    const lastAnchor = newAnchors[newAnchors.length - 1];
    const path = await getDirections(lastAnchor, newAnchor);
    newAnchors.push(newAnchor);
    newPaths.push(path);

    setRoutes(routes.map(r => r.id === activeRouteId ? { ...r, anchors: newAnchors, paths: newPaths } : r));
    showToast("Route extended");
  };

  const handleDragEnd = async (routeId, anchorIndex, event) => {
    if (activeTool !== 'draw') {
      setTimeout(() => { isDraggingMarker.current = false; }, 200);
      return;
    }
    const newPos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    
    const targetRoute = routes.find(r => r.id === routeId);
    if (!targetRoute) return;

    showToast("Recalculating route...");
    let newAnchors = [...targetRoute.anchors];
    newAnchors[anchorIndex] = newPos;
    let newPaths = [...targetRoute.paths];

    // Re-calculate previous segment if exists
    if (anchorIndex > 0) {
      const path = await getDirections(newAnchors[anchorIndex - 1], newPos);
      newPaths[anchorIndex - 1] = path;
    }
    // Re-calculate next segment if exists
    if (anchorIndex < newAnchors.length - 1) {
      const path = await getDirections(newPos, newAnchors[anchorIndex + 1]);
      newPaths[anchorIndex] = path;
    }

    setRoutes(routes.map(r => r.id === routeId ? { ...r, anchors: newAnchors, paths: newPaths } : r));
    showToast("Route adjusted");
    
    setTimeout(() => { isDraggingMarker.current = false; }, 200);
  };

  const getMapCursor = () => {
    switch (activeTool) {
      case 'draw':
        return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="%234F46E5" stroke-width="2"/><circle cx="8" cy="8" r="1.5" fill="%234F46E5"/></svg>') 8 8, crosshair`;
      case 'erase':
        return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" fill="%23EF4444" fill-opacity="0.15" stroke="%23EF4444" stroke-width="2"/><line x1="5" y1="5" x2="13" y2="13" stroke="%23EF4444" stroke-width="2" stroke-linecap="round"/><line x1="13" y1="5" x2="5" y2="13" stroke="%23EF4444" stroke-width="2" stroke-linecap="round"/></svg>') 9 9, cell`;
      default:
        return 'default';
    }
  };

  const handleAnchorClick = async (routeId, anchorIndex) => {
    if (activeTool === 'draw') {
      if (routeId !== activeRouteId) {
        setActiveRouteId(routeId);
      }
      return;
    }

    if (activeTool !== 'erase') return;
    
    const targetRoute = routes.find(r => r.id === routeId);
    if (!targetRoute) return;

    let newAnchors = [...targetRoute.anchors];
    let newPaths = [...targetRoute.paths];

    if (newAnchors.length <= 1) {
      setRoutes(routes.filter(r => r.id !== routeId));
      if (activeRouteId === routeId) setActiveRouteId(null);
      showToast("Route deleted");
      return;
    }

    // No window confirmation, instantly remove the anchor now.

    showToast("Removing anchor and recalculating...");
    newAnchors.splice(anchorIndex, 1);

    if (anchorIndex === 0) {
      newPaths.splice(0, 1);
    } else if (anchorIndex === targetRoute.anchors.length - 1) {
      newPaths.splice(newPaths.length - 1, 1);
    } else {
      const newSegment = await getDirections(newAnchors[anchorIndex - 1], newAnchors[anchorIndex]);
      newPaths.splice(anchorIndex - 1, 2, newSegment);
    }

    setRoutes(routes.map(r => r.id === routeId ? { ...r, anchors: newAnchors, paths: newPaths } : r));
    showToast("Anchor removed, route updated");
  };

  const handePolylineClick = async (routeId, e) => {
    if (isGlobalView) return;
    if (isDraggingMarker.current) return;

    if (activeTool === 'erase') {
      setActiveRouteId(routeId);
      return;
    }

    if (activeTool === 'draw' && routeId !== activeRouteId) {
      setActiveRouteId(routeId);
      return;
    }

    // Now active tool is draw, and routeId is activeRouteId -> Proceed with split
    const targetRoute = routes.find(r => r.id === routeId);
    if (!targetRoute || targetRoute.paths.length === 0) return;

    if (!e || !e.latLng) return;
    const clickPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    let closestSegmentIndex = 0;
    let minDistance = Infinity;
    let isTooCloseToAnchor = false;

    if (geometryLib) {
      targetRoute.anchors.forEach(a => {
        if (geometryLib.spherical.computeDistanceBetween(clickPos, a) < 20) {
          isTooCloseToAnchor = true;
        }
      });

      targetRoute.paths.forEach((segment, i) => {
        segment.forEach(p => {
          const d = geometryLib.spherical.computeDistanceBetween(clickPos, p);
          if (d < minDistance) {
            minDistance = d;
            closestSegmentIndex = i;
          }
        });
      });
    }

    if (isTooCloseToAnchor || minDistance === Infinity) return;

    showToast("Inserting anchor...");
    let newAnchors = [...targetRoute.anchors];
    let newPaths = [...targetRoute.paths];

    const newAnchorIndex = closestSegmentIndex + 1;
    newAnchors.splice(newAnchorIndex, 0, clickPos);

    const p1 = newAnchors[newAnchorIndex - 1];
    const p2 = clickPos;
    const p3 = newAnchors[newAnchorIndex + 1];

    const seg1 = await getDirections(p1, p2);
    const seg2 = await getDirections(p2, p3);

    newPaths.splice(closestSegmentIndex, 1, seg1, seg2);

    setRoutes(routes.map(r => r.id === routeId ? { ...r, anchors: newAnchors, paths: newPaths } : r));
    showToast("Anchor inserted");
  };

  let currentStyles = undefined;
  let currentMapTypeId = 'roadmap';
  
  if (mapStyleKey === 'light') currentStyles = mapStyles.light;
  if (mapStyleKey === 'dark') currentStyles = mapStyles.dark;
  if (mapStyleKey === 'terrain') currentMapTypeId = 'terrain';

  return (
    <div className="map-container">
      {isGlobalView && (
        <div className="precision-zoom-control">
          <label>Zoom: {currentZoom.toFixed(2)}x</label>
          <input 
            type="range" 
            min="3" 
            max="20" 
            step="0.05" 
            value={currentZoom} 
            onChange={handleZoomChange}
            className="precision-zoom-slider" 
            title="Fine-tune map zoom level"
          />
        </div>
      )}

      <Map
        mapTypeId={currentMapTypeId}
        defaultZoom={13}
        defaultCenter={{ lat: 35.6764, lng: 139.6500 }}
        disableDefaultUI={true}
        gestureHandling="greedy"
        onClick={handleMapClick}
        style={{ width: '100vw', height: '100vh' }}
        styles={currentStyles}
        draggableCursor={getMapCursor()}
        isFractionalZoomEnabled={true}
      >
        {routes.map(route => {
          const isActive = route.id === activeRouteId;
          const flatPath = [];
          route.paths.forEach(segment => flatPath.push(...segment));
          
          const routeColor = isGlobalView ? globalStyle.color : (route.style?.color || '#4F46E5');
          const routeWeight = isGlobalView ? globalStyle.weight : (route.style?.weight || 4);
          
          return (
            <React.Fragment key={route.id}>
              {/* Path */}
              {flatPath.length > 0 && (
                <Polyline
                  path={flatPath}
                  options={{
                    strokeColor: routeColor,
                    strokeWeight: isGlobalView ? routeWeight : (isActive ? routeWeight + 2 : routeWeight),
                    strokeOpacity: isGlobalView ? 0.9 : (isActive ? 1.0 : 0.6),
                    clickable: !isGlobalView,
                    zIndex: isGlobalView ? 2 : (isActive ? 10 : 1)
                  }}
                  onClick={(e) => handePolylineClick(route.id, e)}
                />
              )}

              {/* Render points */}
              {!isGlobalView && (activeTool === 'draw' || activeTool === 'erase') && route.anchors.map((anchor, i) => (
                <Marker
                  key={`${route.id}-anchor-${i}`}
                  position={anchor}
                  draggable={isActive && activeTool === 'draw'}
                  onDragStart={() => { isDraggingMarker.current = true; }}
                  onDrag={() => { isDraggingMarker.current = true; }}
                  onDragEnd={(e) => handleDragEnd(route.id, i, e)}
                  onClick={() => handleAnchorClick(route.id, i)}
                  title={`Point ${i}`}
                  zIndex={isActive ? 20 : 5}
                  cursor={(isActive && activeTool === 'draw') ? 'grab' : getMapCursor()}
                  icon={{
                    path: 0, // google.maps.SymbolPath.CIRCLE
                    fillColor: routeColor,
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2,
                    scale: 6
                  }}
                />
              ))}
            </React.Fragment>
          );
        })}
      </Map>
    </div>
  );
};
