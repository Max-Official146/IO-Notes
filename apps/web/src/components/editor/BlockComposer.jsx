export function BlockComposer({ blocks }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Composable Blocks</h3>
      <div className="space-y-2">
        {blocks.map((block) => (
          <div key={block.id} className="rounded-md border border-slate-200 p-2 text-sm dark:border-slate-700">
            <p className="text-xs text-slate-500">{block.type}</p>
            <p>{block.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
