export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>© {year} NoteFlow. Built by Muhammad Saim Ayyaz.</p>
        <p>10Pearls Shine · Cohort 10</p>
      </div>
    </footer>
  );
}
