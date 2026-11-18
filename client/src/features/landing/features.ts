import {
  Download,
  PenLine,
  RefreshCw,
  Search,
  ShieldCheck,
  Tags,
  type LucideIcon,
} from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Product features highlighted on the landing page. */
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
