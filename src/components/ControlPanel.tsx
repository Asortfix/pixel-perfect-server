import React, { useEffect, useState } from 'react';

const ControlPanel: React.FC = () => {
  const [panelImage, setPanelImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    // Preload the panel background image
    const img = new Image();
    img.src = '/control-panel-bg.png'; // Replace with your image path in the public folder
    img.onload = () => setPanelImage(img);
  }, []);

  return (
    <div
      style={{
        width: '20%',
        background: panelImage ? `url('${panelImage.src}') no-repeat center/cover` : '#333',
        color: '#fff',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ fontSize: '18px', marginTop: 0 }}>Game Panel</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Instructions</h2>
        <p>Click inside the canvas area to place a gem. Gems will fall and stack.</p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Player Info</h2>
        <p><strong>Score:</strong> 1230</p>
        <p><strong>Objects Placed:</strong> 5</p>
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
