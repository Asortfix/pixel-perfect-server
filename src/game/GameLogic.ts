export const OBJ_WIDTH = 50;
export const OBJ_HEIGHT = 50;
export const gravity = 0.5;
export const floorHeight = 20;
export const wallThickness = 20;

export interface MaskPixel {
  x: number;
  y: number;
}

export interface ImageAsset {
  src: string;
  image: HTMLImageElement;
}

export interface Images {
  [key: string]: ImageAsset;
}

export class Gem {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  mask: MaskPixel[];
  stable: boolean;
  img: HTMLImageElement;

  constructor(x: number, y: number, img: HTMLImageElement, mask: MaskPixel[]) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.width = OBJ_WIDTH;
    this.height = OBJ_HEIGHT;
    this.mask = mask; 
    this.stable = false;  
    this.img = img; 
  }

  applyGravity() {
    this.vy += gravity;
  }

  aabbCollide(other: Gem) {
    return !(
      this.x + this.width <= other.x ||
      this.x >= other.x + other.width ||
      this.y + this.height <= other.y ||
      this.y >= other.y + other.height
    );
  }

  pixelPerfectCollide(other: Gem) {
    for (let { x, y } of this.mask) {
      const globalX = (this.x | 0) + x;
      const globalY = (this.y | 0) + y;
      for (let { x: ox, y: oy } of other.mask) {
        const otherX = (other.x | 0) + ox;
        const otherY = (other.y | 0) + oy;
        if (globalX === otherX && globalY === otherY) return true;
      }
    }
    return false;
  }

  checkCollisions(objects: Gem[]) {
    for (const other of objects) {
      if (other === this) continue;
      if (this.aabbCollide(other)) {
        if (this.pixelPerfectCollide(other)) {
          return true;
        }
      }
    }
    return false;
  }

  checkCollisionsAt(yPos: number, objects: Gem[], canvasHeight: number) {
    const oldY = this.y;
    this.y = yPos;
    const collides = this.checkCollisions(objects) || this.causesFloorCollision(yPos, canvasHeight);
    this.y = oldY;
    return collides;
  }

  causesFloorCollision(yPos: number, canvasHeight: number) {
    return yPos + this.height > canvasHeight - floorHeight;
  }

  resolveCollisions(oldY: number, newY: number, objects: Gem[], canvasHeight: number) {
    if (!this.checkCollisionsAt(newY, objects, canvasHeight)) {
      return newY; 
    }
    if (this.checkCollisionsAt(oldY, objects, canvasHeight)) {
      return oldY; 
    }

    let low = oldY;
    let high = newY;
    let finalPos = oldY;

    for (let i = 0; i < 20; i++) {
      let mid = (low + high) / 2;
      if (this.checkCollisionsAt(mid, objects, canvasHeight)) {
        high = mid;
      } else {
        finalPos = mid;
        low = mid;
      }
    }

    return Math.floor(finalPos);
  }

  update(objects: Gem[], canvasHeight: number) {
    if (this.stable) return;

    const oldY = this.y;
    this.applyGravity();
    const newY = this.y + this.vy;

    const resolvedY = this.resolveCollisions(oldY, newY, objects, canvasHeight);
    this.y = resolvedY;

    if (this.checkCollisionsAt(this.y, objects, canvasHeight) || resolvedY !== newY) {
      this.y = Math.floor(this.y);
      this.vy = 0;
      this.stable = true; 
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

export function createMask(img: HTMLImageElement, width: number, height: number): MaskPixel[] {
  const offscreen = document.createElement("canvas");
  const offCtx = offscreen.getContext("2d")!;
  offscreen.width = width;
  offscreen.height = height;

  offCtx.drawImage(img, 0, 0, width, height);
  const imgData = offCtx.getImageData(0, 0, width, height);

  const mask: MaskPixel[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = imgData.data[(y * width + x) * 4 + 3];
      if (alpha > 0) mask.push({ x, y });
    }
  }
  return mask;
}
