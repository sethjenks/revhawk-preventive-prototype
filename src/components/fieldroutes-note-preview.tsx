"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FieldRoutesNotePreviewProps = {
  open: boolean;
  initialText: string;
  accountName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (text: string) => void;
};

function NoteEditor({
  initialText,
  accountName,
  onCancel,
  onConfirm,
}: {
  initialText: string;
  accountName: string;
  onCancel: () => void;
  onConfirm: (text: string) => void;
}) {
  const [text, setText] = useState(initialText);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Preview FieldRoutes note</DialogTitle>
        <DialogDescription>
          Review and edit the note that will be saved to {accountName}&apos;s
          FieldRoutes account. Nothing is sent until you confirm.
        </DialogDescription>
      </DialogHeader>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        className="w-full resize-y rounded-md border border-border bg-background px-3 py-2.5 font-mono text-[12px] leading-[18px] text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
      />
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => onConfirm(text.trim())}
          disabled={!text.trim()}
        >
          Save to FieldRoutes
        </Button>
      </DialogFooter>
    </>
  );
}

export function FieldRoutesNotePreview({
  open,
  initialText,
  accountName,
  onOpenChange,
  onConfirm,
}: FieldRoutesNotePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        showCloseButton
        onClick={(e) => e.stopPropagation()}
      >
        {open ? (
          <NoteEditor
            key={initialText}
            initialText={initialText}
            accountName={accountName}
            onCancel={() => onOpenChange(false)}
            onConfirm={onConfirm}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
