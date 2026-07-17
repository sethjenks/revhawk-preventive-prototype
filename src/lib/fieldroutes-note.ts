import type { Account, RescuePath } from "@/lib/accounts";

export type FollowUpIn = "1d" | "3d" | "7d" | "14d";

export const FOLLOW_UP_OPTIONS: { value: FollowUpIn; label: string }[] = [
  { value: "1d", label: "Tomorrow" },
  { value: "3d", label: "In 3 days" },
  { value: "7d", label: "In 7 days" },
  { value: "14d", label: "In 14 days" },
];

export const FOLLOW_UP_LABELS: Record<FollowUpIn, string> = {
  "1d": "tomorrow",
  "3d": "in 3 days",
  "7d": "in 7 days",
  "14d": "in 14 days",
};

export type StepNoteInput = {
  text: string;
  done: boolean;
  note: string;
};

export type ComposeFieldRoutesNoteInput = {
  account: Account;
  path: RescuePath;
  steps: StepNoteInput[];
  followUpIn?: FollowUpIn;
  followUpNote?: string;
};

export function composeFieldRoutesNote({
  account,
  path,
  steps,
  followUpIn,
  followUpNote,
}: ComposeFieldRoutesNoteInput): string {
  const lines: string[] = [];

  lines.push(`RevHawk preventive outreach — ${account.name}`);
  lines.push(`Address: ${account.address}`);
  lines.push(`Path: ${path.id} · ${path.title}`);
  lines.push(
    `Estimated retention likelihood: ${path.retentionLikelihood}%`,
  );
  if (path.discount) {
    lines.push(`Discount discussed: ${path.discount.label}`);
  }
  lines.push("");
  lines.push("Account context:");
  lines.push(
    `- Recent services: ${account.service.recentServiceCount} in ${account.service.recentServiceWindowDays}d`,
  );
  const pestActivitySummary = account.pestActivities
    .map(({ pest, activity }) => `${pest}: ${activity}`)
    .join("; ");
  lines.push(
    `- Pest activity: ${pestActivitySummary || "not specified"} — ${account.service.pestActivityNote}`,
  );
  lines.push(`- Cadence: ${account.service.cadenceLabel}`);
  if (account.complaintSummary) {
    lines.push(`- Complaints: ${account.complaintSummary}`);
  }
  if (account.billingIssue) {
    lines.push(`- Billing: ${account.billingIssue}`);
  }
  const completed = steps.filter((s) => s.done);
  if (completed.length > 0) {
    lines.push("");
    lines.push("Completed checklist:");
    for (const step of completed) {
      lines.push(`- ${step.text}`);
      if (step.note.trim()) {
        lines.push(`  Note: ${step.note.trim()}`);
      }
    }
  }

  const openNotes = steps.filter((s) => !s.done && s.note.trim());
  if (openNotes.length > 0) {
    lines.push("");
    lines.push("Additional notes:");
    for (const step of openNotes) {
      lines.push(`- ${step.text}: ${step.note.trim()}`);
    }
  }

  if (followUpIn) {
    lines.push("");
    lines.push(`Follow up ${FOLLOW_UP_LABELS[followUpIn]}.`);
    if (followUpNote?.trim()) {
      lines.push(`Handoff note: ${followUpNote.trim()}`);
    }
  }

  lines.push("");
  lines.push("— Saved from RevHawk preventive queue");

  return lines.join("\n");
}
