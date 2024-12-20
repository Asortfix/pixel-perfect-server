import React, { useEffect, useState } from 'react';
import ControlPanel from './components/ControlPanel';
import CanvasView from './components/CanvasView';
import { Images } from './game/GameLogic';

// Example image imports: 
// Make sure these images are accessible (if placed in public folder, you can just reference '/diamond.png', etc.)
// If imported directly, ensure the bundler handles them correctly.
const diamondSrc = '/diamond.png';
const emeraldSrc = '/emerald.png';
const rubySrc = '/ruby.png';

function App() {
  const [images, setImages] = useState<Images>({
    diamond: { src: diamondSrc, image: new Image() },
    emerald: { src: emeraldSrc, image: new Image() },
    ruby: { src: rubySrc, image: new Image() }
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let count = 0;
    const keys = Object.keys(images);
    keys.forEach(key => {
      images[key].image.src = images[key].src;
      images[key].image.onload = () => {
        count++;
        if (count === keys.length) {
          setLoaded(true);
        }
      };
    });
  }, [images]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
      <ControlPanel />
      <div style={{ width: '80%', position: 'relative' }}>
        {loaded ? <CanvasView images={images} /> : <div>Loading...</div>}
      </div>
    </div>
  );
}

export default App;