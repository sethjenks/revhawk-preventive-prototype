"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarClock, CalendarPlus, Check, Phone } from "lucide-react";
import { pathCtaLabel, type RescuePath } from "@/lib/accounts";
import { PATHS } from "@/lib/rescue-card.storyboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ResurfaceIn = "1d" | "3d" | "7d" | "14d";

const RESURFACE_OPTIONS: { value: ResurfaceIn; label: string }[] = [
  { value: "1d", label: "Tomorrow" },
  { value: "3d", label: "In 3 days" },
  { value: "7d", label: "In 7 days" },
  { value: "14d", label: "In 14 days" },
];

type StepState = {
  done: boolean;
  note: string;
};

type RescuePathsProps = {
  paths: RescuePath[];
  selectedId: RescuePath["id"] | null;
  startedId: RescuePath["id"] | null;
  onSelect: (id: RescuePath["id"]) => void;
  onStart: (id: RescuePath["id"]) => void;
  onBack: () => void;
  onLogOutreach: (id: RescuePath["id"]) => void;
  onSkip: (id: RescuePath["id"]) => void;
  onNoteAndResurface: (
    id: RescuePath["id"],
    note: string,
    resurfaceIn: ResurfaceIn,
  ) => void;
  visible: boolean;
  stagger?: number;
};

export function RescuePaths({
  paths,
  selectedId,
  startedId,
  onSelect,
  onStart,
  onBack,
  onLogOutreach,
  onSkip,
  onNoteAndResurface,
  visible,
  stagger = PATHS.stagger,
}: RescuePathsProps) {
  const [stepsByPath, setStepsByPath] = useState<
    Record<string, StepState[]>
  >({});
  const [expandedStep, setExpandedStep] = useState<{
    pathId: RescuePath["id"];
    index: number;
  } | null>(null);
  const [showResurface, setShowResurface] = useState(false);
  const [resurfaceNote, setResurfaceNote] = useState("");
  const [resurfaceIn, setResurfaceIn] = useState<ResurfaceIn>("7d");

  useEffect(() => {
    if (!startedId) {
      setShowResurface(false);
      setExpandedStep(null);
      return;
    }
    const path = paths.find((p) => p.id === startedId);
    if (!path?.steps) return;
    setStepsByPath((prev) => {
      if (prev[startedId]?.length === path.steps!.length) return prev;
      return {
        ...prev,
        [startedId]: path.steps!.map(() => ({ done: false, note: "" })),
      };
    });
  }, [startedId, paths]);

  const updateStep = (
    pathId: RescuePath["id"],
    index: number,
    patch: Partial<StepState>,
  ) => {
    setStepsByPath((prev) => {
      const current = prev[pathId] ?? [];
      const next = current.map((step, i) =>
        i === index ? { ...step, ...patch } : step,
      );
      return { ...prev, [pathId]: next };
    });
  };

  const completeStep = (pathId: RescuePath["id"], index: number) => {
    updateStep(pathId, index, { done: true });
    setExpandedStep(null);
  };

  return (
    <div className="flex w-full flex-col gap-1.5 pt-1">
      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
        Rescue paths
      </span>
      {paths.map((path, i) => {
        const selected = selectedId === path.id;
        const started = startedId === path.id;
        const recommended = Boolean(path.recommended);
        const stepStates = stepsByPath[path.id] ?? [];
        const schedulesCheckIn = Boolean(
          path.steps?.some((step) => step.schedulesCheckIn),
        );
        const ctaLabel = pathCtaLabel(path);
        const CtaIcon = schedulesCheckIn ? CalendarPlus : Phone;

        return (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: PATHS.offsetY }}
            animate={{
              opacity: visible ? 1 : 0,
              y: visible ? 0 : PATHS.offsetY,
            }}
            transition={{
              ...PATHS.spring,
              delay: visible ? i * stagger : 0,
            }}
            className={
              selected
                ? "flex w-full flex-col gap-3 rounded-lg border border-primary/35 bg-[var(--mint-bg)] px-4 py-3.5"
                : "flex w-full flex-col rounded-lg border border-transparent transition-colors duration-150 hover:border-border hover:bg-muted/70"
            }
          >
            <button
              type="button"
              onClick={() => onSelect(path.id)}
              className={
                selected
                  ? "flex w-full items-baseline justify-between gap-3 text-left"
                  : "flex w-full flex-row items-center gap-3 px-2.5 py-2.5 text-left"
              }
            >
              {selected ? (
                <>
                  <span className="text-[13px] font-bold text-foreground">
                    {path.id} · {path.title}
                    {recommended ? " · recommended" : ""}
                  </span>
                  <span
                    className={
                      path.riskEmphasis
                        ? "shrink-0 text-xs font-bold text-destructive"
                        : "shrink-0 text-xs font-bold text-primary"
                    }
                  >
                    {path.saveRate}% · {path.costLabel}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-3.5 shrink-0 text-xs font-bold text-[var(--text-tertiary)]">
                    {path.id}
                  </span>
                  <span className="flex-1 text-[13px] font-medium text-foreground">
                    {path.title}
                    {recommended ? (
                      <span className="ml-1.5 text-[11px] font-semibold text-muted-foreground">
                        · recommended
                      </span>
                    ) : null}
                  </span>
                </>
              )}
            </button>

            <AnimatePresence initial={false}>
              {selected && !started ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={PATHS.spring}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-3">
                    {path.summary ? (
                      <p className="text-xs leading-[18px] text-muted-foreground">
                        {path.summary}
                      </p>
                    ) : null}
                    <div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onStart(path.id)}
                        className="h-9 px-3.5 text-[13px] font-bold"
                      >
                        Start →
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {started ? (
                <motion.div
                  key="started"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={PATHS.spring}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-3.5">
                    {path.steps && path.steps.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                          Steps
                        </span>
                        <ul className="flex flex-col gap-2">
                          {path.steps.map((rawStep, index) => {
                            const label =
                              typeof rawStep === "string"
                                ? rawStep
                                : (rawStep.text ?? "");
                            const schedulesThisCheckIn =
                              typeof rawStep !== "string" &&
                              Boolean(rawStep.schedulesCheckIn);
                            const state = stepStates[index] ?? {
                              done: false,
                              note: "",
                            };
                            const open =
                              expandedStep?.pathId === path.id &&
                              expandedStep.index === index;

                            return (
                              <li
                                key={`${path.id}-step-${index}`}
                                className="rounded-lg border border-border bg-white px-3 py-2.5"
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    type="button"
                                    aria-label={
                                      state.done
                                        ? "Mark step incomplete"
                                        : "Add notes for this step"
                                    }
                                    onClick={() => {
                                      if (state.done) {
                                        updateStep(path.id, index, {
                                          done: false,
                                        });
                                      }
                                      setExpandedStep({
                                        pathId: path.id,
                                        index,
                                      });
                                    }}
                                    className={cn(
                                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                                      state.done
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-white",
                                    )}
                                  >
                                    {state.done ? (
                                      <Check
                                        className="size-3"
                                        strokeWidth={3}
                                      />
                                    ) : null}
                                  </button>

                                  <div className="min-w-0 flex-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedStep(
                                          open
                                            ? null
                                            : { pathId: path.id, index },
                                        )
                                      }
                                      className="w-full text-left"
                                    >
                                      <span
                                        className={cn(
                                          "block text-[13px] font-medium leading-[19px]",
                                          state.done &&
                                            "line-through opacity-70",
                                        )}
                                        style={{ color: "#13181B" }}
                                      >
                                        {label || `Step ${index + 1}`}
                                      </span>
                                    </button>
                                    {schedulesThisCheckIn && !state.done ? (
                                      <p
                                        className="mt-0.5 text-[11px] font-medium"
                                        style={{ color: "#07CF7C" }}
                                      >
                                        Included when you log outreach
                                      </p>
                                    ) : null}
                                    {state.done && state.note ? (
                                      <p className="mt-1 text-xs leading-[17px] text-muted-foreground">
                                        Note: {state.note}
                                      </p>
                                    ) : null}

                                    <AnimatePresence initial={false}>
                                      {open && !state.done ? (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{
                                            opacity: 1,
                                            height: "auto",
                                          }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={PATHS.spring}
                                          className="overflow-hidden"
                                        >
                                          <div className="mt-2 flex flex-col gap-2">
                                            <textarea
                                              value={state.note}
                                              onChange={(e) =>
                                                updateStep(path.id, index, {
                                                  note: e.target.value,
                                                })
                                              }
                                              placeholder="Add your notes before marking this done…"
                                              rows={2}
                                              className="w-full resize-none rounded-md border border-border bg-white px-3 py-2 text-[13px] leading-[18px] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                                              style={{ color: "#13181B" }}
                                            />
                                            <div className="flex items-center gap-2">
                                              <Button
                                                type="button"
                                                size="sm"
                                                onClick={() =>
                                                  completeStep(path.id, index)
                                                }
                                                className="h-8 px-3 text-xs font-semibold"
                                              >
                                                Mark done
                                              </Button>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setExpandedStep(null)
                                                }
                                                className="px-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        </motion.div>
                                      ) : null}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : null}

                    {path.script ? (
                      <div className="rounded-lg border border-border/80 bg-card px-3.5 py-3">
                        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                          Opening script
                        </span>
                        <p className="text-[13px] leading-[19px] text-foreground">
                          “{path.script}”
                        </p>
                      </div>
                    ) : null}

                    <AnimatePresence initial={false}>
                      {showResurface ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={PATHS.spring}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-3.5 py-3">
                            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                              Note & resurface
                            </span>
                            <textarea
                              value={resurfaceNote}
                              onChange={(e) => setResurfaceNote(e.target.value)}
                              placeholder="What should the next person know when this comes back?"
                              rows={3}
                              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-[13px] leading-[18px] text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                            />
                            <div className="flex flex-col gap-1.5">
                              <span className="text-xs font-medium text-muted-foreground">
                                Resurface
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {RESURFACE_OPTIONS.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setResurfaceIn(option.value)}
                                    className={cn(
                                      "rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                                      resurfaceIn === option.value
                                        ? "border-primary/40 bg-[var(--mint-bg)] text-foreground"
                                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                                    )}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  onNoteAndResurface(
                                    path.id,
                                    resurfaceNote.trim(),
                                    resurfaceIn,
                                  );
                                  setShowResurface(false);
                                  setResurfaceNote("");
                                  setResurfaceIn("7d");
                                }}
                                className="h-9 gap-1.5 px-3.5 text-[13px] font-semibold"
                              >
                                <CalendarClock
                                  className="size-3.5"
                                  strokeWidth={2.25}
                                />
                                Save & resurface
                              </Button>
                              <button
                                type="button"
                                onClick={() => setShowResurface(false)}
                                className="px-2 text-[13px] font-medium text-muted-foreground underline-offset-2 hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onLogOutreach(path.id)}
                        className="h-9 gap-1.5 px-3.5 text-[13px] font-semibold"
                      >
                        <CtaIcon className="size-3.5" strokeWidth={2.25} />
                        {ctaLabel}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowResurface((v) => !v)}
                        className="h-9 gap-1.5 border-border bg-card px-3.5 text-[13px] font-semibold"
                      >
                        <CalendarClock
                          className="size-3.5"
                          strokeWidth={2.25}
                        />
                        Note & resurface
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onSkip(path.id)}
                        className="h-9 px-3 text-[13px] font-medium text-muted-foreground"
                      >
                        Skip
                      </Button>
                      <button
                        type="button"
                        onClick={onBack}
                        className="px-2 text-[13px] font-medium text-muted-foreground underline-offset-2 hover:underline"
                      >
                        ← Back
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
