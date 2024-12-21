import React from 'react';

interface ControlPanelProps {
  score: number;
  objectsPlaced: number;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  score,
  objectsPlaced,
  onReset,
}) => {
  return (
    <div
      style={{
        width: '20%',
        background: '#333',
        color: '#fff',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          margin: 0,
          textShadow: '2px 2px 0 #000',
        }}
      >
        Game Panel
      </h1>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ textShadow: '2px 2px 0 #000' }}>Score</h2>
        <p style={{ fontSize: '18px', margin: '10px 0', textShadow: '1px 1px 0 #000' }}>
          {score}
        </p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ textShadow: '2px 2px 0 #000' }}>Objects Placed</h2>
        <p style={{ fontSize: '18px', margin: '10px 0', textShadow: '1px 1px 0 #000' }}>
          {objectsPlaced}
        </p>
      </div>
      <button
        onClick={onReset}
        style={{
          padding: '10px',
          fontSize: '16px',
          backgroundColor: '#ff9900',
          color: '#000',
          border: 'none',
          cursor: 'pointer',
          textShadow: '1px 1px 0 #fff',
          fontWeight: 'bold',
        }}
      >
        Reset Game
      </button>
    </div>
  );
};

export default ControlPanel;
