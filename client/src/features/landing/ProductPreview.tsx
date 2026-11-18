import type { JSX } from 'react';
import { FileText, Pin, Search } from 'lucide-react';

interface PreviewNote {
  title: string;
  preview: string;
  tag: string;
  tagClass: string;
  time: string;
  pinned?: boolean;
}

const NOTES: PreviewNote[] = [
  {
    title: 'Sprint planning',
    preview: 'Finalize the auth flow, write service tests, review CodeRabbit feedback…',
    tag: 'Work',
    tagClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
    time: '2m ago',
    pinned: true,
  },
  {
    title: 'Book notes — Deep Work',
    preview: 'Schedule every minute of the day. Embrace boredom. Quit social media…',
    tag: 'Reading',
    tagClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    time: '1h ago',
  },
  {
    title: 'Weekend ideas',
    preview: 'Try the new café downtown, finish the side project landing page…',
    tag: 'Personal',
    tagClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    time: 'Yesterday',
  },
];

const NAV_ITEMS = ['All notes', 'Pinned', 'Archive', 'Trash'];

/** Decorative, non-interactive mock of the dashboard shown on the landing page. */
export function ProductPreview(): JSX.Element {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6" aria-hidden="true">
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <aside className="hidden border-r border-border p-4 md:block">
            <ul className="space-y-1 text-sm">
              {NAV_ITEMS.map((item, index) => (
                <li
                  key={item}
                  className={
                    index === 0
                      ? 'rounded-md bg-primary-soft px-3 py-2 font-medium text-primary'
                      : 'px-3 py-2 text-muted-foreground'
                  }
                >
                  {item}
                </li>
              ))}
            </ul>
          </aside>
          <div className="p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
              <Search className="size-4" />
              Search notes…
              <kbd className="ml-auto rounded border border-border px-1.5 text-xs">Ctrl K</kbd>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {NOTES.map((note) => (
                <article
                  key={note.title}
                  className="rounded-lg border border-border bg-background p-4 text-left"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <FileText className="size-4 text-muted-foreground" />
                      {note.title}
                    </h3>
                    {note.pinned ? <Pin className="size-4 text-primary" /> : null}
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{note.preview}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className={`rounded-full px-2 py-0.5 font-medium ${note.tagClass}`}>
                      {note.tag}
                    </span>
                    <span className="text-muted-foreground">{note.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
