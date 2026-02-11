export function Topbar({ onToggleTheme, theme }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">SmartNotes AI</h1>
      <button
        type="button"
        onClick={onToggleTheme}
        className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
      >
        {theme === "dark" ? "Light" : "Dark"} mode
      </button>
    </header>
  );
}
