"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type RecommendedActionProps = {
  expanded: boolean;
  onDetails: () => void;
};

export function RecommendedAction({
  expanded,
  onDetails,
}: RecommendedActionProps) {
  return (
    <button
      type="button"
      onClick={onDetails}
      aria-expanded={expanded}
      className={cn(
        // -mx + matching px keeps label aligned with card text while
        // hover/active chrome matches rescue-path row padding.
        "flex w-auto -mx-2.5 items-center justify-between self-stretch rounded-lg border px-2.5 py-2.5 text-left text-[13px] font-semibold transition-colors duration-150",
        expanded
          ? "border-primary/35 bg-[var(--mint-bg)] text-foreground"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/70 hover:text-foreground",
      )}
    >
      <span>{expanded ? "Hide details" : "View details"}</span>
      <ChevronDown
        className={cn(
          "size-4 transition-transform duration-200",
          expanded && "rotate-180",
        )}
        strokeWidth={2.25}
        aria-hidden
      />
    </button>
  );
}
