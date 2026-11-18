import { Download, PenLine, RefreshCw, Search, ShieldCheck, Tags, type LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: PenLine,
    title: 'Rich text editor',
    description: 'Headings, lists, checklists, code blocks and links — with autosave as you type.',
  },
  {
    icon: Tags,
    title: 'Tags, pins & archive',
    description: 'Organize with coloured tags, pin what matters and archive the rest.',
  },
  {
    icon: Search,
    title: 'Instant search',
    description: 'Full-text search across every note, with filters and sorting.',
  },
  {
    icon: RefreshCw,
    title: 'Real-time sync',
    description: 'Edit in one tab and watch every other open session update instantly.',
  },
  {
    icon: Download,
    title: 'Export & import',
    description: 'Take your notes anywhere as JSON or Markdown, and bring them back.',
  },
  {
    icon: ShieldCheck,
    title: 'Private & secure',
    description: 'Your notes are visible only to you, protected by hashed passwords and tokens.',
  },
];

export function FeatureGrid() {
  return (
    <section aria-labelledby="features-heading" className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="features-heading" className="text-3xl font-semibold tracking-tight">
            Everything you need, nothing you don’t
          </h2>
          <p className="mt-4 text-muted-foreground">
            Thoughtfully designed features that stay out of your way.
          </p>
        </div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-xl border border-border bg-surface p-6 transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
