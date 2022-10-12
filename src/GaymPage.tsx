import React from "react";
import { useKey } from "./useKey";

interface ICanvasSettings {
  width: number;
  height: number;
  bgColor: string;
  defaultUnit: {
    canvasStyle: {
      width: number;
      height: number;
    };
    color: {
      enemy: string;
      ally: string;
    };
  };
}
interface IUnit {
  type: "enemy" | "player";
  canvasStyle: {
    width: number;
    height: number;
  };
  pos: {
    x: number;
    y: number;
  };
  color: string;
  delta: number;
}
const canvasSettings: ICanvasSettings = {
  width: 500,
  height: 500,
  bgColor: "green",
  defaultUnit: {
    canvasStyle: {
      width: 40,
      height: 40,
    },
    color: {
      enemy: "red",
      ally: "blue",
    },
  },
};
const myUnitDefault: IUnit = {
  type: "player",
  canvasStyle: canvasSettings.defaultUnit.canvasStyle,
  color: canvasSettings.defaultUnit.color.ally,
  pos: {
    x: 100,
    y: 100,
  },
  delta: 5,
};
export function GaymPage() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [myUnit, setMyUnit] = React.useState<IUnit>(myUnitDefault);
  useKey("KeyW", () => moveUp(myUnit, setMyUnit));
  useKey("KeyA", () => moveLeft(myUnit, setMyUnit));
  useKey("KeyD", () => moveRight(myUnit, setMyUnit));
  useKey("KeyS", () => moveDown(myUnit, setMyUnit));
  React.useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")!;
      drawBg(ctx, canvasSettings);
      drawUnit(ctx, myUnit);
    }
  });
  return <canvas ref={canvasRef}></canvas>;
}

function drawBg(ctx: CanvasRenderingContext2D, settings: ICanvasSettings): void {
  ctx.beginPath();
  ctx.rect(0, 0, settings.width, settings.height);
  ctx.fillStyle = settings.bgColor;
  ctx.fill();
  ctx.closePath();
}
function drawUnit(ctx: CanvasRenderingContext2D, settings: IUnit): void {
  const pos = {
    x: settings.pos.x - settings.canvasStyle.width / 2,
    y: settings.pos.y - settings.canvasStyle.height / 2,
  };
  ctx.beginPath();
  ctx.rect(pos.x, pos.y, settings.canvasStyle.width, settings.canvasStyle.height);
  ctx.fillStyle = settings.color;
  ctx.fill();
  ctx.closePath();
}
function moveUp(unit: IUnit, setUnit: Function) {
  const newValue = unit.pos.y - unit.delta;
  setUnit((prev: IUnit) => ({
    ...prev,
    pos: { ...prev.pos, y: newValue },
  }));
}
function moveLeft(unit: IUnit, setUnit: Function) {
  const newValue = unit.pos.x - unit.delta;
  setUnit((prev: IUnit) => ({
    ...prev,
    pos: { ...prev.pos, x: newValue },
  }));
}
function moveRight(unit: IUnit, setUnit: Function) {
  const newValue = unit.pos.x + unit.delta;
  setUnit((prev: IUnit) => ({
    ...prev,
    pos: { ...prev.pos, x: newValue },
  }));
}
function moveDown(unit: IUnit, setUnit: Function) {
  const newValue = unit.pos.y + unit.delta;
  setUnit((prev: IUnit) => ({
    ...prev,
    pos: { ...prev.pos, y: newValue },
  }));
}
