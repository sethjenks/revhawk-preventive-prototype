"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

type RecommendedActionProps = {
  title: string;
  saveRate: number;
  costLabel: string;
  expanded: boolean;
  onDetails: () => void;
  onStart: () => void;
};

export function RecommendedAction({
  title,
  saveRate,
  costLabel,
  expanded,
  onDetails,
  onStart,
}: RecommendedActionProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-primary/35 bg-[var(--mint-bg)] px-3.5 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-primary">
          Recommended · {saveRate}% save
        </span>
        <span className="truncate text-sm font-semibold text-foreground">
          {title} · {costLabel}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDetails}
          className="h-9 border-border bg-card px-3.5 text-[13px] font-semibold"
        >
          {expanded ? "Collapse" : "Details"}
        </Button>
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button
            type="button"
            size="sm"
            onClick={onStart}
            className="h-9 px-3.5 text-[13px] font-bold"
          >
            Start →
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
