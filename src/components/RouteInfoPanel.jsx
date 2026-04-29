import React from 'react';
import { X, Info, Type, MessageSquare, Ruler, Calendar, Star } from 'lucide-react';

export const RouteInfoPanel = ({ route, distance, onUpdate, onClose }) => {
  if (!route) return null;

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="route-info-panel">
      <div className="info-panel-header">
        <div className="info-panel-title">
          <Info size={16} className="info-icon" />
          <span>Route Information</span>
        </div>
        <button className="info-close-btn" onClick={onClose} title="Close Panel">
          <X size={16} />
        </button>
      </div>

      <div className="info-panel-content">
        <div className="info-field">
          <label><Type size={14} /> Title</label>
          <input 
            type="text" 
            placeholder="Untitled Route" 
            value={route.title || ''} 
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div className="info-field">
          <label><Ruler size={14} /> Distance</label>
          <div className="info-distance-value">{distance || '0 m'}</div>
        </div>

        <div className="info-field">
          <label><Calendar size={14} /> Date</label>
          <input 
            type="date" 
            value={route.date || ''} 
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>

        <div className="info-field">
          <label><Star size={14} /> Rating</label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                size={18} 
                className={`star-icon ${route.rating >= star ? 'filled' : ''}`}
                onClick={() => handleChange('rating', star === route.rating ? 0 : star)}
                fill={route.rating >= star ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        </div>

        <div className="info-field">
          <label><MessageSquare size={14} /> Remarks</label>
          <textarea 
            placeholder="Add notes about this hike..." 
            value={route.remarks || ''} 
            onChange={(e) => handleChange('remarks', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
