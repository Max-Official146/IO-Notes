export function createDrawEngine(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";

  let drawing = false;

  const positionFromEvent = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: ((event.clientX - rect.left) * scaleX) / (window.devicePixelRatio || 1),
      y: ((event.clientY - rect.top) * scaleY) / (window.devicePixelRatio || 1),
    };
  };

  const handlePointerDown = (event) => {
    drawing = true;
    canvas.setPointerCapture?.(event.pointerId);
    const { x, y } = positionFromEvent(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (event) => {
    if (!drawing) {
      return;
    }
    const { x, y } = positionFromEvent(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (event) => {
    drawing = false;
    canvas.releasePointerCapture?.(event.pointerId);
    ctx.closePath();
  };

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return {
    bind() {
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", handlePointerUp);
      canvas.addEventListener("pointerleave", handlePointerUp);
      canvas.addEventListener("pointercancel", handlePointerUp);
    },
    unbind() {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
    },
    clear,
  };
}
