"use client";

import * as React from "react";
import { FileText } from "lucide-react";

import { UserAvatar } from "@/components/doit/user-avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { parseIso, relLabel, shortDate } from "@/lib/date-utils";
import { useStore } from "@/lib/store";
import type { Activity, ActivityKind } from "@/lib/types";

const ACT_TEXT: Record<ActivityKind, (name: string, target: string | null) => React.ReactNode> = {
  complete: (n, t) => (
    <>
      <b>{n}</b> <span className="font-medium">concluiu</span> <b>{t}</b>
    </>
  ),
  reopen: (n, t) => (
    <>
      <b>{n}</b> <span className="font-medium">reabriu</span> <b>{t}</b>
    </>
  ),
  add: (n, t) => (
    <>
      <b>{n}</b> <span className="font-medium">adicionou</span> <b>{t}</b>
    </>
  ),
  deadline: (n, t) => (
    <>
      <b>{n}</b> <span className="font-medium">definiu o prazo de</span> <b>{t}</b>
    </>
  ),
  edit: (n, t) => (
    <>
      <b>{n}</b> <span className="font-medium">editou</span> <b>{t}</b>
    </>
  ),
  delete: (n, t) => (
    <>
      <b>{n}</b> <span className="font-medium">removeu</span> <b>{t}</b>
    </>
  ),
  join: (n) => (
    <>
      <b>{n}</b> <span className="font-medium">entrou no projeto</span>
    </>
  ),
  create: (n) => (
    <>
      <b>{n}</b> <span className="font-medium">compartilhou o projeto</span>
    </>
  ),
};

interface HistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoryDrawer({ open, onOpenChange }: HistoryDrawerProps) {
  const { current: project, activity, people } = useStore();

  const list = activity.filter((a) => a.projectId === project.id);
  const days: Record<string, Activity[]> = {};
  list.forEach((a) => {
    (days[a.date] = days[a.date] || []).push(a);
  });
  const orderedDays = Object.keys(days).sort((a, b) => b.localeCompare(a));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-[17px] w-[17px]" /> Histórico
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-10 pt-4">
          {orderedDays.length === 0 && (
            <div className="px-2.5 py-10 text-center text-ink-3">
              <div className="mx-auto mb-4 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-chip">
                <FileText className="h-[22px] w-[22px]" />
              </div>
              <p className="text-[13.5px]">Nenhuma alteração ainda.</p>
            </div>
          )}

          {orderedDays.map((dk) => (
            <div key={dk} className="mb-[22px]">
              <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.05em] text-ink-3">
                {relLabel(parseIso(dk))} · {shortDate(parseIso(dk))}
              </div>
              {days[dk].map((a, i) => {
                const p = people[a.by];
                const fn = ACT_TEXT[a.kind] ?? ACT_TEXT.edit;
                const name = p.name === "Você" ? "Você" : p.name.split(" ")[0];
                const last = i === days[dk].length - 1;
                return (
                  <div key={a.id} className="relative flex gap-3 py-1.5">
                    {!last && (
                      <span className="absolute left-[13px] top-7 -bottom-2.5 w-0.5 bg-line" />
                    )}
                    <UserAvatar person={p} size={26} className="z-[1]" />
                    <div>
                      <div className="pt-0.5 text-[13.5px] leading-[1.45] text-ink-2 [&_b]:font-semibold [&_b]:text-ink">
                        {fn(name, a.target)}
                      </div>
                      <div className="mt-px text-[11.5px] text-ink-3">{a.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
