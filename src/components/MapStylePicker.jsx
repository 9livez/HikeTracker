import React, { useState } from 'react';
import { Layers } from 'lucide-react';

export const MapStylePicker = ({ currentStyle, onChangeStyle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="map-styles-container">
      <button 
        className={`fab ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)} 
        title="Map Layers"
      >
        <Layers size={22} />
      </button>

      {isOpen && (
        <div className="styles-menu">
          <div className="styles-menu-title">Map Style</div>
          <button 
            className={`style-item ${currentStyle === 'normal' ? 'active' : ''}`} 
            onClick={() => { onChangeStyle('normal'); setIsOpen(false); }}
          >
            Normal
          </button>
          <button 
            className={`style-item ${currentStyle === 'light' ? 'active' : ''}`} 
            onClick={() => { onChangeStyle('light'); setIsOpen(false); }}
          >
            Light (Route Focus)
          </button>
          <button 
            className={`style-item ${currentStyle === 'dark' ? 'active' : ''}`} 
            onClick={() => { onChangeStyle('dark'); setIsOpen(false); }}
          >
            Dark (Route Focus)
          </button>
          <button 
            className={`style-item ${currentStyle === 'terrain' ? 'active' : ''}`} 
            onClick={() => { onChangeStyle('terrain'); setIsOpen(false); }}
          >
            Terrain
          </button>
          <button 
            className={`style-item ${currentStyle === 'satellite' ? 'active' : ''}`} 
            onClick={() => { onChangeStyle('satellite'); setIsOpen(false); }}
          >
            Satellite
          </button>
        </div>
      )}
    </div>
  );
};
