"use client";

import { ChevronDown } from "lucide-react";

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
      className="flex w-full items-center justify-between rounded-md py-1.5 text-left text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
    >
      <span>{expanded ? "Hide details" : "View details"}</span>
      <ChevronDown
        className={`size-4 transition-transform duration-200 ${
          expanded ? "rotate-180" : ""
        }`}
        strokeWidth={2.25}
        aria-hidden
      />
    </button>
  );
}
