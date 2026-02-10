import { useEffect, useRef } from "react";
import { createDrawEngine } from "./drawEngine";

export default function Canvas({ onReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 650;

    const engine = createDrawEngine(canvas);
    engine.bind();
    onReady?.({ canvas, clear: engine.clear });

    return () => engine.unbind();
  }, [onReady]);

  return <canvas ref={canvasRef} />;
}
