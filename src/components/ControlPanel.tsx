import React from 'react';

interface ControlPanelProps {
  score: number;
  objectCount: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ score, objectCount }) => {
  return (
    <div style={{
      width: '20%',
      background: '#333',
      color: '#fff',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ fontSize: '18px', marginTop: 0 }}>Game Panel</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Instructions</h2>
        <p>Click inside the canvas area to place a gem. Gems will fall and stack.</p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Player Info</h2>
        <p><strong>Score:</strong> {score}</p>
        <p><strong>Objects Placed:</strong> {objectCount}</p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Controls</h2>
        <p>Click: Place an object</p>
        <p>More controls to come...</p>
      </div>
    </div>
  );
};

export default ControlPanel;
