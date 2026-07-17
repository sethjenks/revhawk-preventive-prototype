export function OutreachHeader({ count }: { count: number }) {
  return (
    <header className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-border bg-card px-6 py-5 md:px-12">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          RevHawk · Preventive Outreach
        </span>
        <h1
          className="text-[28px] font-bold tracking-[-0.02em] text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {count} account{count === 1 ? "" : "s"} need a call
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-lg border border-border bg-muted px-3 py-2 text-xs font-semibold text-foreground">
          Sorted by risk
        </span>
        <span className="px-2 py-2 text-xs font-medium text-muted-foreground">
          Unassigned only
        </span>
      </div>
    </header>
  );
}
