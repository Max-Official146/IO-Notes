export async function generateHandwritingImage({ text, style }) {
  return {
    imageUrl: "",
    meta: {
      message: "Handwriting generator provider not configured yet. Plug your model/service here.",
      style,
      chars: text.length,
    },
  };
}
