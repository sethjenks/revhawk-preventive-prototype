"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDialKit } from "dialkit";
import { Expand, Minus, Plus, Shrink } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type Account,
  type RescuePath,
} from "@/lib/accounts";
import {
  EXIT,
  EXIT_TIMING,
  EXPAND,
  EXPAND_TIMING,
  ExpandStage,
  PATHS,
  SECTION,
  type ExpandStageValue,
} from "@/lib/rescue-card.storyboard";
import {
  MAP_BODY,
  MAP_CLOSE_TIMING,
  MAP_HEIGHT,
  MAP_OPEN_TIMING,
  MAP_PIN,
  MAP_SHEET,
  MapStage,
  type MapStageValue,
} from "@/lib/map-view.storyboard";
import { AccountSnapshot } from "@/components/account-snapshot";
import { RecommendedAction } from "@/components/recommended-action";
import {
  RescuePaths,
  type FollowUpIn,
} from "@/components/rescue-paths";

const MAP_ZOOM = {
  min: 1,
  max: 2.5,
  step: 0.25,
  default: 1,
} as const;

type RescueCardProps = {
  account: Account;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onStartPath: (pathId: RescuePath["id"]) => void;
  onSaveNote: (pathId: RescuePath["id"], noteText: string) => void;
  onSkip: () => void;
  onNoteAndFollowUp: (
    pathId: RescuePath["id"],
    noteText: string,
    followUpIn: FollowUpIn,
  ) => void;
};

export function RescueCard({
  account,
  expanded,
  onExpand,
  onCollapse,
  onStartPath,
  onSaveNote,
  onSkip,
  onNoteAndFollowUp,
}: RescueCardProps) {
  const dial = useDialKit("RescueCard", {
    expandWhyMs: [0, EXPAND_TIMING.why, 800, 10],
    expandPathsMs: [0, EXPAND_TIMING.paths, 1000, 10],
    sectionOffsetY: [0, SECTION.offsetY, 40, 1],
    pathStagger: [0, PATHS.stagger, 0.3, 0.01],
    sectionSpring: SECTION.spring,
    expandSpring: EXPAND.spring,
  });

  const cardRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<ExpandStageValue>(ExpandStage.Idle);
  const [selectedPath, setSelectedPath] = useState<RescuePath["id"] | null>(
    null,
  );
  const [startedPath, setStartedPath] = useState<RescuePath["id"] | null>(null);
  const [exiting, setExiting] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [mapStage, setMapStage] = useState<MapStageValue>(MapStage.Idle);
  const [mapZoom, setMapZoom] = useState<number>(MAP_ZOOM.default);
  const [trackedExpanded, setTrackedExpanded] = useState(expanded);

  if (expanded !== trackedExpanded) {
    setTrackedExpanded(expanded);
    if (!expanded) {
      setStage(ExpandStage.Idle);
      setSelectedPath(null);
      setStartedPath(null);
    } else if (!mapOpen) {
      setStage(ExpandStage.Layout);
    }
  }

  useEffect(() => {
    if (!expanded || mapOpen) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => setStage(ExpandStage.Why), dial.expandWhyMs),
    );
    timers.push(
      setTimeout(() => setStage(ExpandStage.Paths), dial.expandPathsMs),
    );
    return () => timers.forEach(clearTimeout);
  }, [expanded, dial.expandWhyMs, dial.expandPathsMs, mapOpen]);

  useEffect(() => {
    if (!mapOpen) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => setMapStage(MapStage.Pin), MAP_OPEN_TIMING.pin),
    );
    timers.push(
      setTimeout(() => setMapStage(MapStage.Sheet), MAP_OPEN_TIMING.sheet),
    );
    return () => timers.forEach(clearTimeout);
  }, [mapOpen]);

  const showWhy = expanded && !mapOpen && stage >= ExpandStage.Why;
  const showPaths = expanded && !mapOpen && stage >= ExpandStage.Paths;
  const pinVisible = mapOpen && mapStage >= MapStage.Pin;
  const sheetVisible = mapOpen && mapStage >= MapStage.Sheet;

  const handleExit = (action: () => void) => {
    setExiting(true);
    setTimeout(action, EXIT_TIMING.remove);
  };

  const handleSelectPath = (id: RescuePath["id"]) => {
    setSelectedPath(id);
    setStartedPath(null);
  };

  const handleStartPath = (id: RescuePath["id"]) => {
    setSelectedPath(id);
    setStartedPath(id);
    onStartPath(id);
  };

  const openMap = () => {
    setMapZoom(MAP_ZOOM.default);
    setMapStage(MapStage.Morphing);
    setMapOpen(true);
  };

  const closeMap = useCallback(() => {
    setMapStage(MapStage.Morphing);
    setTimeout(() => {
      setMapOpen(false);
      setMapStage(MapStage.Idle);
      setMapZoom(MAP_ZOOM.default);
    }, MAP_CLOSE_TIMING.bodyIn);
  }, []);

  const zoomIn = () => {
    setMapZoom((zoom) =>
      Math.min(MAP_ZOOM.max, Number((zoom + MAP_ZOOM.step).toFixed(2))),
    );
  };

  const zoomOut = () => {
    setMapZoom((zoom) =>
      Math.max(MAP_ZOOM.min, Number((zoom - MAP_ZOOM.step).toFixed(2))),
    );
  };

  useEffect(() => {
    if (!mapOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (cardRef.current && target && !cardRef.current.contains(target)) {
        closeMap();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMap();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mapOpen, closeMap]);

  const riskTextClass =
    account.risk === "critical"
      ? "text-[11px] font-bold uppercase tracking-[0.08em] text-destructive"
      : account.risk === "high"
        ? "text-[11px] font-bold uppercase tracking-[0.08em] text-amber-700"
        : "text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground";

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={false}
      animate={
        exiting
          ? { opacity: 0, y: EXIT.offsetY }
          : { opacity: 1, y: 0 }
      }
      transition={EXIT.spring}
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <motion.div
        layout
        animate={{
          height: mapOpen ? MAP_HEIGHT.expanded : MAP_HEIGHT.collapsed,
        }}
        transition={MAP_HEIGHT.spring}
        className="group relative w-full overflow-hidden"
        onWheel={
          mapOpen
            ? (event) => {
                event.preventDefault();
                if (event.deltaY < 0) zoomIn();
                else if (event.deltaY > 0) zoomOut();
              }
            : undefined
        }
      >
        <button
          type="button"
          onClick={mapOpen ? closeMap : openMap}
          className="absolute inset-0 w-full overflow-hidden text-left"
          aria-label={
            mapOpen
              ? `Minimize map for ${account.address}`
              : `Expand map for ${account.address}`
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={account.mapImage}
            alt=""
            className={
              mapOpen
                ? "absolute inset-0 size-full origin-center object-cover transition-transform duration-200 ease-out"
                : "absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            }
            style={mapOpen ? { transform: `scale(${mapZoom})` } : undefined}
          />
          {!mapOpen ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-card/80" />
              <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-card to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          )}
        </button>

        {!mapOpen ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="flex flex-row overflow-hidden rounded-md border border-border bg-card/95 shadow-sm">
              <span className="px-2.5 py-1 text-[13px] font-semibold leading-snug text-foreground">
                {account.address}
              </span>
              <div className="w-px self-stretch bg-border" />
              <span className="flex items-center justify-center px-2 text-foreground/45">
                <Expand className="size-3.5" strokeWidth={2.25} aria-hidden />
              </span>
            </div>
          </div>
        ) : null}

        <AnimatePresence>
          {mapOpen ? (
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={MAP_BODY.spring}
                onClick={(event) => {
                  event.stopPropagation();
                  closeMap();
                }}
                className="absolute right-3.5 top-3.5 z-20 inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2 text-[11px] font-semibold text-foreground shadow-sm"
              >
                Minimize
                <Shrink className="size-3" strokeWidth={2.25} aria-hidden />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={MAP_BODY.spring}
                className="absolute left-3.5 top-3.5 z-20 flex h-7 flex-row overflow-hidden rounded-md border border-border bg-card shadow-sm"
              >
                <button
                  type="button"
                  aria-label="Zoom out"
                  disabled={mapZoom <= MAP_ZOOM.min}
                  onClick={(event) => {
                    event.stopPropagation();
                    zoomOut();
                  }}
                  className="flex h-full w-7 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="size-3.5" strokeWidth={2.25} />
                </button>
                <div className="h-full w-px bg-border" />
                <button
                  type="button"
                  aria-label="Zoom in"
                  disabled={mapZoom >= MAP_ZOOM.max}
                  onClick={(event) => {
                    event.stopPropagation();
                    zoomIn();
                  }}
                  className="flex h-full w-7 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="size-3.5" strokeWidth={2.25} />
                </button>
              </motion.div>

              <motion.div
                initial={{ scale: MAP_PIN.initialScale, opacity: 0 }}
                animate={{
                  scale: pinVisible
                    ? MAP_PIN.finalScale
                    : MAP_PIN.initialScale,
                  opacity: pinVisible ? 1 : 0,
                }}
                exit={{ opacity: 0, scale: MAP_PIN.initialScale }}
                transition={MAP_PIN.spring}
                className="pointer-events-none absolute left-[47%] top-[36%] z-20 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-destructive"
              />

              <div className="pointer-events-none absolute left-[47%] top-[36%] z-20 -translate-x-1/2 -translate-y-[calc(100%+12px)]">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: sheetVisible ? 1 : 0,
                    y: sheetVisible ? 0 : 8,
                  }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={MAP_SHEET.spring}
                  className="rounded-md border border-border bg-card px-2 py-1 shadow-sm"
                >
                  <span className="text-[11px] font-semibold leading-none text-foreground">
                    {account.mapLabel}
                  </span>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: MAP_SHEET.offsetY }}
                animate={{
                  opacity: sheetVisible ? 1 : 0,
                  y: sheetVisible ? 0 : MAP_SHEET.offsetY,
                }}
                exit={{ opacity: 0, y: MAP_SHEET.offsetY }}
                transition={MAP_SHEET.spring}
                className="absolute bottom-3.5 left-3.5 right-3.5 z-20 flex flex-col gap-1.5 rounded-lg border border-border bg-card px-3.5 pb-3 pt-2.5 shadow-sm"
              >
                <span
                  className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {account.address}
                </span>
                <p className="text-[13px] leading-[19px] text-muted-foreground">
                  {account.mapNote}
                </p>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence initial={false} mode="popLayout">
        {!mapOpen ? (
          <motion.div
            key="card-body"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={MAP_BODY.spring}
          >
            <div className="flex flex-col gap-3 px-6 pb-4 pt-4">
              <h2
                className="text-[22px] font-bold leading-[1.25] tracking-[-0.02em] text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {account.headline}
              </h2>

              <p className="text-[14px] leading-[21px] text-muted-foreground">
                {account.summary}
              </p>

              <span className={riskTextClass}>{account.riskLabel}</span>
            </div>

            <div className="flex flex-col border-t border-border px-6 pb-3 pt-3">
              <RecommendedAction
                expanded={expanded}
                onDetails={expanded ? onCollapse : onExpand}
              />

              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div
                    key="expanded"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={dial.expandSpring as typeof EXPAND.spring}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-4 pb-1 pt-3">
                      <motion.section
                        initial={{ opacity: 0, y: dial.sectionOffsetY }}
                        animate={{
                          opacity: showWhy ? 1 : 0,
                          y: showWhy ? 0 : dial.sectionOffsetY,
                        }}
                        transition={dial.sectionSpring as typeof SECTION.spring}
                        className="flex flex-col gap-3"
                      >
                        <AccountSnapshot
                          account={account}
                          variant="expanded"
                        />
                      </motion.section>

                      <RescuePaths
                        account={account}
                        paths={account.paths}
                        selectedId={selectedPath}
                        startedId={startedPath}
                        onSelect={handleSelectPath}
                        onStart={handleStartPath}
                        onBack={() => setStartedPath(null)}
                        onSaveNote={(pathId, noteText) => {
                          onSaveNote(pathId, noteText);
                          setStartedPath(null);
                          setSelectedPath(null);
                        }}
                        onSkip={() => handleExit(onSkip)}
                        onNoteAndFollowUp={(pathId, noteText, followUpIn) =>
                          handleExit(() =>
                            onNoteAndFollowUp(pathId, noteText, followUpIn),
                          )
                        }
                        visible={showPaths}
                        stagger={dial.pathStagger}
                      />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
