"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ACCOUNTS, type Account, type RescuePath } from "@/lib/accounts";
import { OutreachHeader } from "@/components/outreach-header";
import { RescueCard } from "@/components/rescue-card";
import type { ResurfaceIn } from "@/components/rescue-paths";

const RESURFACE_LABELS: Record<ResurfaceIn, string> = {
  "1d": "tomorrow",
  "3d": "in 3 days",
  "7d": "in 7 days",
  "14d": "in 14 days",
};

export function OutreachQueue() {
  const [accounts, setAccounts] = useState<Account[]>(ACCOUNTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const removeAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleStartPath = (account: Account, pathId: RescuePath["id"]) => {
    const path = account.paths.find((p) => p.id === pathId);
    toast.success(
      `Started ${path?.title ?? `path ${pathId}`} for ${account.name}`,
    );
    setExpandedId(account.id);
  };

  const handleLogOutreach = (account: Account, pathId: RescuePath["id"]) => {
    const path = account.paths.find((p) => p.id === pathId);
    const schedulesCheckIn = path?.steps?.some((step) => step.schedulesCheckIn);
    toast.success(
      schedulesCheckIn
        ? `Outreach logged · check-in scheduled · ${account.name}`
        : `Outreach logged · ${path?.title ?? pathId} · ${account.name}`,
    );
    setExpandedId(null);
  };

  const handleSkip = (account: Account) => {
    toast.message(`Skipped ${account.name}`);
    removeAccount(account.id);
  };

  const handleNoteAndResurface = (
    account: Account,
    pathId: RescuePath["id"],
    note: string,
    resurfaceIn: ResurfaceIn,
  ) => {
    const path = account.paths.find((p) => p.id === pathId);
    const when = RESURFACE_LABELS[resurfaceIn];
    toast.message(
      note
        ? `Will resurface ${when} · ${account.name}`
        : `Queued to resurface ${when} · ${path?.title ?? pathId}`,
      note ? { description: note } : undefined,
    );
    removeAccount(account.id);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <OutreachHeader count={accounts.length} />
      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-4 px-4 py-8 md:px-6">
        <AnimatePresence mode="popLayout">
          {accounts.map((account) => (
            <RescueCard
              key={account.id}
              account={account}
              expanded={expandedId === account.id}
              onExpand={() => setExpandedId(account.id)}
              onCollapse={() => setExpandedId(null)}
              onStartPath={(pathId) => handleStartPath(account, pathId)}
              onLogOutreach={(pathId) => handleLogOutreach(account, pathId)}
              onSkip={() => handleSkip(account)}
              onNoteAndResurface={(pathId, note, resurfaceIn) =>
                handleNoteAndResurface(account, pathId, note, resurfaceIn)
              }
            />
          ))}
        </AnimatePresence>
        {accounts.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Queue clear — no accounts need a call right now.
          </p>
        ) : null}
      </main>
    </div>
  );
}
