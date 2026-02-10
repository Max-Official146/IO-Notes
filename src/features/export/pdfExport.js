import { jsPDF } from "jspdf";

export function exportCanvasToPdf(canvas, fileName = "note.pdf") {
  const doc = new jsPDF({ orientation: "landscape", unit: "px" });
  const image = canvas.toDataURL("image/png");
  doc.addImage(image, "PNG", 20, 20, 800, 500);
  doc.save(fileName);
}
