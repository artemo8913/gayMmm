import React from "react";

interface IGameObject {
  id: string;
  width: number;
  height: number;
  color: string;
  pos: {
    x: number;
    y: number;
  };
  delta?: number;
  direction?: { x: 1 | -1 | 0; y: 1 | -1 | 0 };
  isAnimated?: boolean;
}
interface ICanvasSettings extends IGameObject {}
interface IBullet extends IGameObject {}
interface IUnit extends IGameObject {
  type: "enemy" | "player";
}
const canvasSettings: ICanvasSettings = {
  id: "canvas",
  width: 600,
  height: 300,
  color: "green",
  pos: {
    x: 0,
    y: 0,
  },
};
const myUnitDefault: IUnit = {
  id: "player",
  type: "player",
  width: 40,
  height: 40,
  color: "blue",
  pos: {
    x: 40,
    y: 100,
  },
  delta: 15,
  direction: { x: 0, y: 0 },
};
const enemyDefault: IUnit = {
  id: "enemy",
  type: "enemy",
  width: 40,
  height: 40,
  color: "red",
  pos: {
    x: 250,
    y: 100,
  },
  delta: 5,
};
const bulletSettingsDefault: IBullet = {
  id: "bullet",
  height: 10,
  width: 10,
  color: "purple",
  pos: {
    x: 5,
    y: 5,
  },
  delta: 1,
  direction: { x: 1, y: 0 },
};
export function GaymPage() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const bullets: Array<IBullet> = [];
  const myUnit = JSON.parse(JSON.stringify(myUnitDefault)) as IUnit;
  const enemy = JSON.parse(JSON.stringify(enemyDefault)) as IUnit;
  useKey("KeyW", () => move({ ...myUnit, direction: { x: 0, y: -1 } }));
  useKey("KeyA", () => move({ ...myUnit, direction: { x: -1, y: 0 } }));
  useKey("KeyD", () => move({ ...myUnit, direction: { x: 1, y: 0 } }));
  useKey("KeyS", () => move({ ...myUnit, direction: { x: 0, y: 1 } }));
  useKey("Space", () =>
    createBullet(bullets, {
      ...bulletSettingsDefault,
      id: String(new Date().getTime()),
      pos: { x: myUnit.pos.x + bulletSettingsDefault.width / 2 + myUnit.width / 2, y: myUnit.pos.y },
    }),
  );
  React.useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvasSettings.width;
      canvas.height = canvasSettings.height;
      const ctx = canvas.getContext("2d")!;
      drawGame(ctx, myUnit, enemy, bullets);
    }
  }, []);
  return <canvas ref={canvasRef}></canvas>;
}

function drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
function drawGame(ctx: CanvasRenderingContext2D, myUnit: IUnit, enemy: IUnit, bullets: Array<IBullet>) {
  drawBg(ctx, canvasSettings);
  drawUnit(ctx, myUnit);
  drawUnit(ctx, enemy);
  verticalMovementAI(ctx, enemy);
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    move(bullet);
    if (isCollision(bullet, enemy)) {
      hitFlashAnimation(enemy, 100, 500);
    }
    if (isCollision(bullet, enemy) || isOutSide(ctx, bullet)) {
      removeBullet(bullets, i);
      i--;
    }
  }
  drawBullets(ctx, bullets);
  requestAnimationFrame(() => drawGame(ctx, myUnit, enemy, bullets));
}
function drawBg(ctx: CanvasRenderingContext2D, canvas: ICanvasSettings): void {
  drawRect(ctx, 0, 0, canvas.width, canvas.height, canvas.color);
}
function drawUnit(ctx: CanvasRenderingContext2D, unit: IUnit): void {
  const pos = {
    x: unit.pos.x - unit.width / 2,
    y: unit.pos.y - unit.height / 2,
  };
  drawRect(ctx, pos.x, pos.y, unit.width, unit.height, unit.color);
}
function drawBullets(ctx: CanvasRenderingContext2D, bullets: Array<IBullet>) {
  bullets.forEach((bullet: IBullet) => {
    const pos = {
      x: bullet.pos.x - bullet.width / 2,
      y: bullet.pos.y - bullet.height / 2,
    };
    drawRect(ctx, pos.x, pos.y, bullet.width, bullet.height, bullet.color);
  });
}
function createBullet(bullets: Array<IBullet>, bullet: IBullet) {
  bullets.push({ ...bullet });
}
function isCollision(firstGO: IGameObject, secondGO: IGameObject): boolean {
  let result = false;
  const topCheck = firstGO.pos.y - firstGO.height / 2 <= secondGO.pos.y + secondGO.height / 2;
  const bottomCheck = firstGO.pos.y + firstGO.height / 2 >= secondGO.pos.y - secondGO.height / 2;
  const leftCheck = firstGO.pos.x - firstGO.width / 2 <= secondGO.pos.x + secondGO.width / 2;
  const rightCheck = firstGO.pos.x + firstGO.width / 2 >= secondGO.pos.x - secondGO.width / 2;
  if (secondGO.pos.x >= firstGO.pos.x) {
    if (secondGO.pos.y >= firstGO.pos.y) {
      result = rightCheck && bottomCheck;
    } else if (secondGO.pos.y < firstGO.pos.y) {
      result = rightCheck && topCheck;
    }
  } else if (secondGO.pos.x < firstGO.pos.x) {
    if (secondGO.pos.y >= firstGO.pos.y) {
      result = leftCheck && bottomCheck;
    } else if (secondGO.pos.y < firstGO.pos.y) {
      result = leftCheck && topCheck;
    }
  }
  return result;
}
function isOutSide(ctx: CanvasRenderingContext2D, gO: IGameObject): boolean {
  const xOutSide = gO.pos.x - gO.width / 2 >= ctx.canvas.width || gO.pos.x + gO.width / 2 <= 0;
  const yOutSide = gO.pos.y - gO.height / 2 >= ctx.canvas.height || gO.pos.y + gO.height / 2 <= 0;
  return xOutSide || yOutSide;
}
//splice! отсеиваю не нужные пули по индексу!
function removeBullet(bullets: Array<IBullet>, index: number) {
  bullets.splice(index, 1);
}

function move(gO: IGameObject) {
  gO.pos.x += gO.delta! * gO.direction!.x;
  gO.pos.y += gO.delta! * gO.direction!.y;
}
function hitFlashAnimation(gO: IGameObject, flashSpeed: number, duration: number) {
  if (!gO.isAnimated) {
    gO.isAnimated = true;
    const oldColor = gO.color;
    const newColor = "white";
    const id = setInterval(() => {
      if (gO.color === oldColor) {
        gO.color = newColor;
      } else {
        gO.color = oldColor;
      }
    }, flashSpeed);
    setTimeout(() => {
      gO.isAnimated = false;
      gO.color = oldColor;
      clearInterval(id);
    }, duration);
  }
}
const useKey = (key: string, callback: () => void, canUse = true) => {
  React.useEffect(() => {
    if (canUse) {
      const handlePress = (e: KeyboardEvent) => {
        if (e.code === key) {
          e.preventDefault();
          callback();
        }
      };
      document.addEventListener("keydown", handlePress);
      return () => document.removeEventListener("keydown", handlePress);
    }
  });
};
//возможно лучше сделать хук для движения
function verticalMovementAI(ctx: CanvasRenderingContext2D, gO: IGameObject) {
  if (!gO.direction) gO.direction = { x: 0, y: 1 };
  if (isOutSide(ctx, { ...gO, pos: { x: gO.pos.x, y: gO.pos.y + gO.delta! * gO.direction!.y } })) {
    console.log(gO.direction);
    if(gO.direction.y===1) gO.direction.y = -1;
    else if(gO.direction.y === -1) gO.direction.y = 1;
  }
  move(gO);
}
