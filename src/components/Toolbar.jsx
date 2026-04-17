import React from 'react';
import { PenTool, Eraser, CheckCircle } from 'lucide-react';

export const Toolbar = ({ activeTool, setActiveTool, activeRouteId, setActiveRouteId }) => {
  return (
    <div className="toolbar-container">
      <button 
        className={`tool-btn ${activeTool === 'draw' ? 'active' : ''}`}
        onClick={() => setActiveTool('draw')}
        title="Draw Route"
      >
        <PenTool size={18} />
        <span>Draw</span>
      </button>
      
      <button 
        className={`tool-btn danger ${activeTool === 'erase' ? 'active' : ''}`}
        onClick={() => setActiveTool('erase')}
        title="Erase Route"
      >
        <Eraser size={18} />
        <span>Erase</span>
      </button>

      {activeRouteId && (
        <>
          <div style={{ width: '1px', background: 'var(--border)', margin: '4px' }} />
          <button 
            className="tool-btn"
            style={{ color: '#10B981' }}
            onClick={() => setActiveRouteId(null)}
            title="Done Editing"
          >
            <CheckCircle size={18} />
            <span>Done</span>
          </button>
        </>
      )}
    </div>
  );
};
