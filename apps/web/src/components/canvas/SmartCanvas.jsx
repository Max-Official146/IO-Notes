import { Stage, Layer, Line, Rect } from "react-konva";
import { useRef, useState } from "react";

export function SmartCanvas({ onStrokesChange }) {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const handlePointerDown = (event) => {
    isDrawing.current = true;
    const pos = event.target.getStage().getPointerPosition();
    const pressure = event.evt.pressure || 0.5;
    setLines((prev) => [...prev, { points: [pos.x, pos.y], pressure }]);
  };

  const handlePointerMove = (event) => {
    if (!isDrawing.current) {
      return;
    }

    const stage = event.target.getStage();
    const point = stage.getPointerPosition();
    const pressure = event.evt.pressure || 0.5;

    setLines((prev) => {
      const next = [...prev];
      const current = next[next.length - 1];
      current.points = current.points.concat([point.x, point.y]);
      current.pressure = pressure;
      onStrokesChange?.(next);
      return next;
    });
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-2 text-sm text-slate-500">Pen Input (Stylus/Touch + pressure-aware line width)</p>
      <Stage
        width={900}
        height={500}
        className="rounded-lg border border-slate-200 dark:border-slate-700"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <Layer>
          <Rect width={900} height={500} fill="#ffffff" />
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke="#111827"
              strokeWidth={Math.max(1.5, line.pressure * 6)}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
