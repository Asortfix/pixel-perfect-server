import React, { useEffect, useState } from 'react';
import ControlPanel from './components/ControlPanel';
import CanvasView from './components/CanvasView';
import { Images } from './game/GameLogic';

// Include all gem image paths
const diamondSrc = '/images/gems/diamond.png';
const emeraldSrc = '/images/gems/emerald.png';
const rubySrc = '/images/gems/ruby.png';
const blackGemSrc = '/images/gems/black-gem.png';
const orangeGemSrc = '/images/gems/orange-gem.png';
const pinkGemSrc = '/images/gems/pink-gem.png';
const purpleGemSrc = '/images/gems/purple-gem.png';
const yellowGemSrc = '/images/gems/yellow-gem.png';

function App() {
  const [images, setImages] = useState<Images>({
    diamond: { src: diamondSrc, image: new Image() },
    emerald: { src: emeraldSrc, image: new Image() },
    ruby: { src: rubySrc, image: new Image() },
    // black: { src: blackGemSrc, image: new Image() },
    // orange: { src: orangeGemSrc, image: new Image() },
    // pink: { src: pinkGemSrc, image: new Image() },
    // purple: { src: purpleGemSrc, image: new Image() },
    yellow: { src: yellowGemSrc, image: new Image() },
  });

  const [loaded, setLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const [objectsPlaced, setObjectsPlaced] = useState(0);

  // This state controls reset logic
  const [shouldReset, setShouldReset] = useState(false);

  // Preload images
  useEffect(() => {
    let count = 0;
    const keys = Object.keys(images);
    keys.forEach((key) => {
      images[key].image.src = images[key].src;
      images[key].image.onload = () => {
        count++;
        if (count === keys.length) {
          setLoaded(true);
        }
      };
    });
  }, [images]);

  /**
   * Called by CanvasView every time an object is successfully placed
   */
  const handleObjectPlaced = (points: number) => {
    setScore((prev) => prev + points);
    setObjectsPlaced((prev) => prev + 1);
  };

  /**
   * Reset game state and trigger CanvasView to clear objects
   */
  const resetGame = () => {
    setScore(0);
    setObjectsPlaced(0);
    setShouldReset(true); // Triggers reset in CanvasView
  };

  /**
   * Called by CanvasView once it finishes resetting
   */
  const handleResetComplete = () => {
    setShouldReset(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
      }}
    >
      <ControlPanel
        score={score}
        objectsPlaced={objectsPlaced}
        onReset={resetGame}
      />
      <div style={{ width: '80%', position: 'relative' }}>
        {loaded ? (
          <CanvasView
            images={images}
            onObjectPlaced={handleObjectPlaced}
            shouldReset={shouldReset}
            onResetComplete={handleResetComplete}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default App;
