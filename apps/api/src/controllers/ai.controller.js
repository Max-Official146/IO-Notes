import { summarizeText } from "../services/ai/openai.service.js";
import { runOcrOnImage } from "../services/ai/ocr.service.js";
import { generateHandwritingImage } from "../services/ai/handwriting.service.js";

export async function summarizeTranscript(req, res, next) {
  try {
    const { text, format } = req.body;
    const result = await summarizeText({ text, format });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function ocrImage(req, res, next) {
  try {
    const { imageUrl } = req.body;
    const result = await runOcrOnImage(imageUrl);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function typedToHandwritten(req, res, next) {
  try {
    const { text, style } = req.body;
    const result = await generateHandwritingImage({ text, style });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
