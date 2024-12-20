import React, { useEffect, useRef, useState } from 'react';
import { Gem, createMask, Images, OBJ_WIDTH, OBJ_HEIGHT, floorHeight, wallThickness } from '../game/GameLogic';

interface CanvasViewProps {
  images: Images;
}

const CanvasView: React.FC<CanvasViewProps> = ({ images }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objects, setObjects] = useState<Gem[]>([]);
  const [masks, setMasks] = useState<{[key: string]: {x:number,y:number}[]}>({});
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Once images are loaded, create masks
    const loadedMasks: {[key: string]: {x:number,y:number}[]} = {};
    for (let key in images) {
      loadedMasks[key] = createMask(images[key].image, OBJ_WIDTH, OBJ_HEIGHT);
    }
    setMasks(loadedMasks);
  }, [images]);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || Object.keys(masks).length === 0) return;
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
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      
      // Draw floor and walls
      drawBoundaries(ctx, width, height);

      // Update objects
      objects.forEach(obj => {
        obj.update(objects, height);
      });

      // Draw objects
      objects.forEach(obj => {
        obj.draw(ctx);
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('click', handleClick);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masks, objects]);

  const placeObject = (x: number, y: number) => {
    const keys = Object.keys(images);
    const choice = keys[Math.floor(Math.random() * keys.length)];
    const newObj = new Gem(x, y, images[choice].image, masks[choice]);
    // Adjust position if collides
    let attempts = 100;
    const canvas = canvasRef.current;
    if (!canvas) return;
    while ((newObj.checkCollisions(objects) || newObj.causesFloorCollision(newObj.y, canvas.height)) && attempts > 0) {
      newObj.y -= 1;
      attempts--;
    }

    if (attempts > 0) {
      setObjects(prev => [...prev, newObj]);
    }
  };

  return (
    <canvas 
      ref={canvasRef} 
      width={window.innerWidth * 0.8} 
      height={window.innerHeight} 
      style={{display: 'block', backgroundColor: '#f0f0f0'}} 
    />
  );
};

function drawBoundaries(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Floor
  ctx.fillStyle = "#666";
  ctx.fillRect(0, height - floorHeight, width, floorHeight);

  // Walls
  ctx.fillStyle = "#666";
  ctx.fillRect(0, 0, wallThickness, height); // left wall
  ctx.fillRect(width - wallThickness, 0, wallThickness, height); // right wall
}

export default CanvasView;