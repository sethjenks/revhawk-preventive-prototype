"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ACCOUNTS, type Account, type RescuePath } from "@/lib/accounts";
import { FOLLOW_UP_LABELS, type FollowUpIn } from "@/lib/fieldroutes-note";
import { OutreachHeader } from "@/components/outreach-header";
import { RescueCard } from "@/components/rescue-card";

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

  const handleSaveNote = (
    account: Account,
    pathId: RescuePath["id"],
    noteText: string,
  ) => {
    const path = account.paths.find((p) => p.id === pathId);
    const schedulesCheckIn = path?.steps?.some((step) => step.schedulesCheckIn);
    toast.success(
      schedulesCheckIn
        ? `Saved to FieldRoutes · check-in scheduled · ${account.name}`
        : `Saved to FieldRoutes · ${path?.title ?? pathId} · ${account.name}`,
      { description: noteText.slice(0, 140) },
    );
    setExpandedId(null);
  };

  const handleSkip = (account: Account) => {
    toast.message(`Skipped ${account.name}`);
    removeAccount(account.id);
  };

  const handleNoteAndFollowUp = (
    account: Account,
    pathId: RescuePath["id"],
    noteText: string,
    followUpIn: FollowUpIn,
  ) => {
    const path = account.paths.find((p) => p.id === pathId);
    const when = FOLLOW_UP_LABELS[followUpIn];
    toast.message(
      noteText
        ? `Follow-up scheduled ${when} · ${account.name}`
        : `Queued for follow-up ${when} · ${path?.title ?? pathId}`,
      noteText ? { description: noteText.slice(0, 140) } : undefined,
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
              onSaveNote={(pathId, noteText) =>
                handleSaveNote(account, pathId, noteText)
              }
              onSkip={() => handleSkip(account)}
              onNoteAndFollowUp={(pathId, noteText, followUpIn) =>
                handleNoteAndFollowUp(account, pathId, noteText, followUpIn)
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
