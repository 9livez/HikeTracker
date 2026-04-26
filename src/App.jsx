import React, { useState, useEffect, useRef } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MapContainer } from './components/MapContainer';
import { Toolbar } from './components/Toolbar';
import { MapStylePicker } from './components/MapStylePicker';
import { RouteStyling } from './components/RouteStyling';
import { RouteInfoPanel } from './components/RouteInfoPanel';
import { Map as MapIcon, Download, Upload, Eye, Trash2, FileJson, MapPin, Ruler } from 'lucide-react';
import { downloadKML } from './utils/kmlExport';
import { calculateRouteLength, formatDistance } from './utils/distance';
import './index.css';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function App() {
  const [activeTool, setActiveTool] = useState('draw'); // 'draw', 'erase'
  const [activeRouteId, setActiveRouteId] = useState(null);
  const [mapStyleKey, setMapStyleKey] = useState('light');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isGlobalView, setIsGlobalView] = useState(false);
  const [globalStyle, setGlobalStyle] = useState({ color: '#4F46E5', weight: 4 });
  const [showClearModal, setShowClearModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const prevActiveRouteId = useRef(null);
  const fileInputRef = useRef(null);

  const [routes, setRoutes] = useState(() => {
    const saved = localStorage.getItem('hiking_routes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('hiking_routes', JSON.stringify(routes));
  }, [routes]);

  const displayToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeRouteId && activeRouteId !== prevActiveRouteId.current) {
      setShowInfoPanel(true);
    }
    if (!activeRouteId) {
      setShowInfoPanel(false);
    }
    prevActiveRouteId.current = activeRouteId;
  }, [activeRouteId]);

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return (
      <div className="loading-overlay" style={{ flexDirection: 'column', gap: '16px' }}>
        <MapIcon size={48} color="var(--primary)" />
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <h2>API Key Required</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '400px' }}>
            Please set your <code>VITE_GOOGLE_MAPS_API_KEY</code> in the <code>.env</code> file at the root of the project to continue.
          </p>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(routes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `HikeTracker_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setShowExportMenu(false);
    displayToast("Backup exported successfully!");
  };

  const handleExportKML = () => {
    downloadKML(routes);
    setShowExportMenu(false);
    displayToast("KML exported for Google Maps!");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (Array.isArray(parsed)) {
          if (window.confirm("Overwrite existing map routes? Click 'Cancel' to combine them instead.")) {
            setRoutes(parsed);
          } else {
            setRoutes([...routes, ...parsed]);
          }
          displayToast("Backup restored seamlessly!");
          setActiveRouteId(null);
        } else {
           displayToast("Invalid backup format.");
        }
      } catch(err) {
        displayToast("Failed to parse backup.");
      }
      e.target.value = null;
    };
    reader.readAsText(file);
  };

  const executeClear = () => {
    setRoutes([]);
    setActiveRouteId(null);
    setMapStyleKey('light');
    setActiveTool('draw');
    setIsGlobalView(false);
    setResetTrigger(prev => prev + 1);
    setShowClearModal(false);
    displayToast("Map cleared and reset");
  };

  const activeRoute = routes.find(r => r.id === activeRouteId);
  const updateRouteStyle = (styleObj) => {
    setRoutes(routes.map(r => r.id === activeRouteId ? { ...r, style: { ...(r.style || {}), ...styleObj } } : r));
  };
  
  const updateRouteData = (dataObj) => {
    setRoutes(routes.map(r => r.id === activeRouteId ? { ...r, ...dataObj } : r));
  };

  // Calculate distance display
  let displayDistance = null;
  if (isGlobalView) {
    const totalMeters = routes.reduce((acc, r) => acc + calculateRouteLength(r), 0);
    displayDistance = formatDistance(totalMeters);
  } else if (activeRouteId) {
    const routeMeters = calculateRouteLength(activeRoute);
    displayDistance = formatDistance(routeMeters);
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="ui-layer">
        <header className="app-header" style={{ justifyContent: 'flex-start', gap: '24px' }}>
          <div className="brand">
            <MapIcon className="brand-icon" size={24} />
            <h1>HikeTracker</h1>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
            <button className="tool-btn" style={{ background: 'var(--surface)', padding: '10px 16px' }} onClick={() => fileInputRef.current?.click()} title="Import Backup JSON">
              <Upload size={16} />
              <span>Import</span>
            </button>
            <input type="file" accept=".json" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImport} />
            
            <div className="dropdown-container">
              <button 
                className={`tool-btn ${showExportMenu ? 'active' : ''}`} 
                style={{ background: 'var(--surface)', padding: '10px 16px' }} 
                onClick={() => setShowExportMenu(!showExportMenu)} 
                title="Export Routes"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              
              {showExportMenu && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleExport}>
                    <FileJson size={16} />
                    <span>Backup (JSON)</span>
                  </button>
                  <button className="dropdown-item" onClick={handleExportKML}>
                    <MapPin size={16} />
                    <span>Google Maps (KML)</span>
                  </button>
                </div>
              )}
            </div>
            
            <button className="tool-btn" style={{ background: 'var(--surface)', padding: '10px 16px', color: 'var(--danger)' }} onClick={() => setShowClearModal(true)} title="Clear Map">
              <Trash2 size={16} />
              <span>Clear</span>
            </button>
          </div>
        </header>

        <div className={`toast ${showToast ? 'show' : ''}`}>
          {toastMessage}
        </div>

        {!isGlobalView && (
          <Toolbar 
            activeTool={activeTool} 
            setActiveTool={setActiveTool} 
            activeRouteId={activeRouteId}
            setActiveRouteId={setActiveRouteId}
          />
        )}

        <div className="right-floating-panel">
          <button 
            className={`fab ${isGlobalView ? 'active' : ''}`} 
            onClick={() => {
              setIsGlobalView(!isGlobalView);
              setActiveRouteId(null);
            }} 
            title="Global View Mode"
          >
            <Eye size={22} />
          </button>

          <MapStylePicker 
            currentStyle={mapStyleKey} 
            onChangeStyle={setMapStyleKey} 
          />

          <RouteStyling 
            activeRoute={isGlobalView ? { style: globalStyle } : activeRoute} 
            updateRouteStyle={isGlobalView ? (styleObj) => setGlobalStyle(prev => ({...prev, ...styleObj})) : updateRouteStyle} 
            title={isGlobalView ? "Global Settings" : "Route Style"}
          />
        </div>

        {displayDistance && (
          <div className="distance-display">
            <Ruler className="distance-icon" size={18} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="distance-label">{isGlobalView ? "Total Distance" : "Route Distance"}</span>
              <span className="distance-value">{displayDistance}</span>
            </div>
          </div>
        )}

        {showClearModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirm Clear</h2>
              <p>Do you want to export your routes before clearing the map? This action cannot be undone.</p>
              <div className="modal-buttons">
                <button className="modal-btn primary" onClick={() => {
                  handleExport();
                  executeClear();
                }}>
                  Yes, Export &amp; Clear
                </button>
                <button className="modal-btn danger" onClick={executeClear}>
                  No, Just Clear
                </button>
                <button className="modal-btn secondary" onClick={() => setShowClearModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showInfoPanel && activeRoute && (
          <RouteInfoPanel 
            route={activeRoute} 
            distance={displayDistance}
            onUpdate={updateRouteData}
            onClose={() => setShowInfoPanel(false)}
          />
        )}
      </div>

      <MapContainer 
        activeTool={activeTool} 
        showToast={displayToast} 
        activeRouteId={activeRouteId}
        setActiveRouteId={setActiveRouteId}
        mapStyleKey={mapStyleKey}
        routes={routes}
        setRoutes={setRoutes}
        isGlobalView={isGlobalView}
        globalStyle={globalStyle}
        resetTrigger={resetTrigger}
      />
    </APIProvider>
  );
}

export default App;
