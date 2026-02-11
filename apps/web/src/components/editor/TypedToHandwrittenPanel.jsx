import { useState } from "react";
import { convertTypedToHandwriting } from "../../features/ai/aiApi";

const styles = ["classic-cursive", "neat-student", "fast-notes"];

export function TypedToHandwrittenPanel() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState(styles[0]);
  const [result, setResult] = useState("");

  const convert = async () => {
    const response = await convertTypedToHandwriting(text, style);
    setResult(response.imageUrl || response.meta?.message || "No output");
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Typed → Handwritten</h3>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type your notes here..."
        className="h-32 w-full rounded-md border border-slate-300 p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <div className="mt-2 flex items-center gap-2">
        <select value={style} onChange={(event) => setStyle(event.target.value)} className="rounded-md border px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800">
          {styles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button type="button" onClick={convert} className="rounded-md bg-slate-900 px-3 py-1 text-sm text-white dark:bg-slate-100 dark:text-slate-900">
          Convert
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-500">{result}</p>
    </section>
  );
}
