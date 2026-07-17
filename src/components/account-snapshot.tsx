import type { Account, CadenceStatus } from "@/lib/accounts";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

function isCadenceAlert(status: CadenceStatus): boolean {
  switch (status) {
    case "on_track":
      return false;
    case "overdue":
    case "quarter_ending":
    case "over_a_quarter":
      return true;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

type AccountSnapshotProps = {
  account: Account;
  /** Compact collapsed view vs expanded detail */
  variant?: "collapsed" | "expanded";
  className?: string;
};

export function AccountSnapshot({
  account,
  variant = "collapsed",
  className,
}: AccountSnapshotProps) {
  const { service } = account;
  const cadenceAlert = isCadenceAlert(service.cadenceStatus);
  const flags: string[] = [];

  if (cadenceAlert) flags.push(service.cadenceLabel);
  if (account.complaintSummary) {
    flags.push(
      account.complaintSummary.length > 48
        ? `${account.complaintSummary.slice(0, 48).trim()}…`
        : account.complaintSummary,
    );
  }
  if (account.billingIssue) flags.push(account.billingIssue);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className="flex flex-col gap-2 border-b border-border pb-2.5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-foreground">
              {account.name}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] leading-[17px] text-muted-foreground">
              <a
                href={`tel:${account.phone.replace(/\D/g, "")}`}
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                {account.phone}
              </a>
              <a
                href={`mailto:${account.email}`}
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                {account.email}
              </a>
              <span>{account.address}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] leading-[17px] text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">
                {service.recentServiceCount}
              </span>{" "}
              services / {service.recentServiceWindowDays}d
            </span>
            <span>
              <span className="font-semibold text-foreground">
                {service.daysSinceLastService}d
              </span>{" "}
              since last service
            </span>
          </div>
        </div>
        <a
          href={account.fieldRoutesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-[11px] font-normal text-[var(--text-tertiary)] underline-offset-2 hover:text-muted-foreground hover:underline sm:self-end"
        >
          Open in FieldRoutes
          <ExternalLink className="size-2.5" strokeWidth={2} aria-hidden />
        </a>
      </div>

      {variant === "expanded" ? (
        <div className="flex flex-col gap-3 border-b border-border pb-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            Why this surfaced
          </span>
          <ul className="flex flex-col gap-1.5">
            {account.why.map((item) => (
              <li
                key={`${item.date}-${item.text}`}
                className="flex gap-2 text-[13px] leading-[19px] text-muted-foreground"
              >
                <span className="shrink-0 font-semibold text-foreground">
                  {item.date}
                </span>
                <span className={item.emphasize ? "font-medium" : undefined}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {variant === "collapsed" && flags.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {flags.map((flag) => (
            <li
              key={flag}
              className="w-fit rounded-md border border-amber-500/25 bg-amber-50 px-2 py-1 text-[11px] font-semibold leading-[15px] text-amber-900"
            >
              {flag}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
