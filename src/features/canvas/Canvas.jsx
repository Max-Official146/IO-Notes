import { useEffect, useRef } from "react";
import { createDrawEngine } from "./drawEngine";

export default function Canvas({ onReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = 1000;
    const cssHeight = 650;

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const engine = createDrawEngine(canvas);
    engine.bind();
    onReady?.({ canvas, clear: engine.clear });

    return () => engine.unbind();
  }, [onReady]);

  return <canvas ref={canvasRef} />;
}
