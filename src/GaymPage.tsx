import React from "react";

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
  type: "enemy" | "ally";
  canvasStyle: {
    width: number;
    height: number;
  };
  pos: {
    x: number;
    y: number;
  };
  color: string;
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

export function GaymPage() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")!;
      drawBg(ctx, canvasSettings);
      createUnit(ctx, {
        type: "ally",
        canvasStyle: canvasSettings.defaultUnit.canvasStyle,
        color: canvasSettings.defaultUnit.color.ally,
        pos: {
          x: 100,
          y: 100,
        },
      });
      createUnit(ctx, {
        type: "enemy",
        canvasStyle: canvasSettings.defaultUnit.canvasStyle,
        color: canvasSettings.defaultUnit.color.enemy,
        pos: {
          x: 20,
          y: 20,
        },
      });
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
function createUnit(ctx: CanvasRenderingContext2D, settings: IUnit): void {
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
