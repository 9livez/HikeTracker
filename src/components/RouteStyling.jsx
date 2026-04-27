import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { PRESET_COLORS, resolveColor } from '../utils/colors';

export const RouteStyling = ({ activeRoute, updateRouteStyle, title = "Route Style" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!activeRoute) return null;

  const style = activeRoute.style || {};
  const weight = style.weight || 4;
  
  // Get active index for highlighting
  const activeIndex = style.colorIndex !== undefined ? parseInt(style.colorIndex) : PRESET_COLORS.indexOf(style.color);

  return (
    <div className="route-styling-container">
      <button 
        className={`fab ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)} 
        title="Route Style"
      >
        <Palette size={22} />
      </button>

      {isOpen && (
        <div className="route-styling-panel">
          <div className="styling-header">
            <Palette size={16} />
            <span>{title}</span>
          </div>
          
          <div className="styling-section">
            <label>Color</label>
            <div className="colors-grid">
              {PRESET_COLORS.map((c, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={index}
                    className={`color-btn ${isActive ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => updateRouteStyle({ colorIndex: index, color: c })}
                    title={`Color ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="styling-section">
            <label>Thickness ({weight}px)</label>
            <input 
              type="range" 
              min="2" 
              max="12" 
              step="1"
              value={weight}
              onChange={(e) => updateRouteStyle({ weight: parseInt(e.target.value) })}
              className="weight-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};
