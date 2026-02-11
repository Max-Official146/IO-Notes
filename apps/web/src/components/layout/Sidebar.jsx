export function Sidebar({ folders = [] }) {
  return (
    <aside className="w-72 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Folders</h2>
      <ul className="space-y-2">
        {folders.map((folder) => (
          <li key={folder.id} className="rounded-md px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
            {folder.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
