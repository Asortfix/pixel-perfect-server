import React, { useEffect, useRef, useState } from 'react';
import {
  Gem,
  createMask,
  Images,
  OBJ_WIDTH,
  OBJ_HEIGHT,
  floorHeight,
  wallThickness,
} from '../game/GameLogic';

interface CanvasViewProps {
  images: Images;
  onObjectPlaced: (points: number) => void;
  shouldReset: boolean; // New prop to trigger reset
  onResetComplete: () => void; // Callback to tell App the reset is done
}

const CanvasView: React.FC<CanvasViewProps> = ({
  images,
  onObjectPlaced,
  shouldReset,
  onResetComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objects, setObjects] = useState<Gem[]>([]);
  const [masks, setMasks] = useState<{ [key: string]: { x: number; y: number }[] }>({});
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  const animationFrameRef = useRef<number | null>(null);

  /** Preload background once to avoid blinking */
  useEffect(() => {
    const bgImage = new Image();
    bgImage.src = '/background.png'; // or wherever your background image is
    bgImage.onload = () => setBackgroundImage(bgImage);
  }, []);

  /** Create masks once images are fully loaded */
  useEffect(() => {
    const loadedMasks: { [key: string]: { x: number; y: number }[] } = {};
    for (let key in images) {
      loadedMasks[key] = createMask(images[key].image, OBJ_WIDTH, OBJ_HEIGHT);
    }
    setMasks(loadedMasks);
  }, [images]);

  /**
   *  Watch for `shouldReset`.
   *  If true, clear the objects array, then notify App that reset is done.
   */
  useEffect(() => {
    if (shouldReset) {
      setObjects([]);
      onResetComplete(); 
    }
  }, [shouldReset, onResetComplete]);

  /**
   *  Main animation loop
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !backgroundImage || !Object.keys(masks).length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;
      placeObject(centerX - 25, centerY - 25);
    };

    canvas.addEventListener('click', handleClick);

    const animate = () => {
      if (!ctx || !backgroundImage) return;

      const { width, height } = canvas;
      // Clear screen
      ctx.clearRect(0, 0, width, height);

      // Draw background once loaded
      ctx.drawImage(backgroundImage, 0, 0, width, height);

      // Draw floor and walls
      drawBoundaries(ctx, width, height);

      // Update objects
      objects.forEach((obj) => {
        obj.update(objects, height);
      });

      // Draw objects
      objects.forEach((obj) => {
        obj.draw(ctx);
      });

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener('click', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masks, objects, backgroundImage]);

  /**
   * Creates a new Gem and adds it to the objects array
   */
  const placeObject = (x: number, y: number) => {
    const keys = Object.keys(images);
    const choice = keys[Math.floor(Math.random() * keys.length)];
    const newObj = new Gem(x, y, images[choice].image, masks[choice]);

    let attempts = 100;
    const canvas = canvasRef.current;
    if (!canvas) return;

    while (
      (newObj.checkCollisions(objects) || newObj.causesFloorCollision(newObj.y, canvas.height)) &&
      attempts > 0
    ) {
      newObj.y -= 1;
      attempts--;
    }

    if (attempts > 0) {
      setObjects((prev) => [...prev, newObj]);
      onObjectPlaced(10); // e.g., +10 points
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth * 0.8}
      height={window.innerHeight}
      style={{ display: 'block', backgroundColor: '#f0f0f0' }}
    />
  );
};

function drawBoundaries(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = '#666';
  // Floor
  ctx.fillRect(0, height - floorHeight, width, floorHeight);
  // Walls
  ctx.fillRect(0, 0, wallThickness, height);
  ctx.fillRect(width - wallThickness, 0, wallThickness, height);
}

export default CanvasView;
