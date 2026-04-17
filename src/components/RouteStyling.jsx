import React, { useState } from 'react';
import { Palette } from 'lucide-react';

const PRESET_COLORS = [
  '#4F46E5', // Indigo (Default)
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6'  // Teal
];

export const RouteStyling = ({ activeRoute, updateRouteStyle, title = "Path Style" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!activeRoute) return null;

  const color = activeRoute.style?.color || '#4F46E5';
  const weight = activeRoute.style?.weight || 4;

  return (
    <div className="route-styling-container">
      <button 
        className={`fab ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)} 
        title="Path Style"
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
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  className={`color-btn ${color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => updateRouteStyle({ color: c })}
                  title={c}
                />
              ))}
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
