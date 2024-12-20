import React, { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import CanvasView from './components/CanvasView';
import { Images } from './game/GameLogic';

const App: React.FC = () => {
  // State for score and objects
  const [score, setScore] = useState<number>(0);
  const [objectCount, setObjectCount] = useState<number>(0);

  // Example images initialization (adjust as needed)
  const [images, setImages] = useState<Images>({
    diamond: { src: '/diamond.png', image: new Image() },
    emerald: { src: '/emerald.png', image: new Image() },
    ruby: { src: '/ruby.png', image: new Image() },
  });
  
  // Load images (as before)
  React.useEffect(() => {
    let loaded = 0;
    const keys = Object.keys(images);
    keys.forEach((key) => {
      images[key].image.src = images[key].src;
      images[key].image.onload = () => {
        loaded++;
        if (loaded === keys.length) {
          // All images loaded, you could do something if needed
        }
      };
    });
  }, [images]);

  // Callback to update object count when CanvasView places an object
  const handleObjectPlaced = () => {
    setObjectCount((prev) => prev + 1);
    // Maybe update score as well
    setScore((prev) => prev + 10); // For example, add 10 points per object
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
      <ControlPanel score={score} objectCount={objectCount} />
      <div style={{ width: '80%', position: 'relative' }}>
        {/* Pass images and callback to CanvasView */}
        <CanvasView images={images} onObjectPlaced={handleObjectPlaced} />
      </div>
    </div>
  );
};

export default App;
