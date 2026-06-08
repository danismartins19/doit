"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { diffDays, parseIso, relLabel, shortDate, TODAY } from "@/lib/date-utils";
import { useStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoToTask: (t: Task) => void;
}

export function SummaryModal({ open, onOpenChange, onGoToTask }: SummaryModalProps) {
  const { current: project, tasks } = useStore();

  const pending = tasks.filter((t) => t.projectId === project.id && !t.done);
  const days: Record<string, Task[]> = {};
  pending.forEach((t) => {
    (days[t.date] = days[t.date] || []).push(t);
  });
  // descending: future first, overdue/past last
  const orderedDays = Object.keys(days).sort((a, b) => b.localeCompare(a));
  const totalOverdue = pending.filter(
    (t) => diffDays(parseIso(t.date), TODAY) < 0,
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[540px]">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <span
              className="h-[11px] w-[11px] rounded-full"
              style={{ background: project.raw }}
            />
            <DialogTitle>{project.name}</DialogTitle>
          </div>
          <DialogDescription>
            {pending.length > 0
              ? `${pending.length} ${
                  pending.length === 1 ? "tarefa pendente" : "tarefas pendentes"
                }${
                  totalOverdue
                    ? ` · ${totalOverdue} atrasada${totalOverdue > 1 ? "s" : ""}`
                    : ""
                }`
              : "Tudo em dia"}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {orderedDays.length === 0 ? (
            <div className="px-2.5 pb-3.5 pt-[30px] text-center">
              <div className="mx-auto mb-3.5 grid h-14 w-14 place-items-center rounded-2xl bg-[rgba(31,157,99,0.12)] text-status-done">
                <Check className="h-[26px] w-[26px]" strokeWidth={2.4} />
              </div>
              <h3 className="mb-1.5 text-base font-bold">Nada pendente por aqui 🎉</h3>
              <p className="text-[13.5px] text-ink-2">
                Você concluiu todas as tarefas deste projeto.
              </p>
            </div>
          ) : (
            orderedDays.map((dk) => {
              const dt = parseIso(dk);
              const over = diffDays(dt, TODAY) < 0;
              return (
                <div key={dk} className="mb-[18px]">
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <span
                      className={cn(
                        "text-[13.5px] font-bold text-ink",
                        over && "text-overdue",
                      )}
                    >
                      {relLabel(dt)} · {shortDate(dt)}
                    </span>
                    <span className="rounded-full bg-chip px-2 py-px text-xs font-semibold text-ink-3">
                      {days[dk].length}
                    </span>
                  </div>
                  {days[dk].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onGoToTask(t)}
                      className="flex w-full items-center gap-2.5 rounded-[9px] px-3 py-1.5 text-left text-sm text-ink-2 transition-colors hover:bg-hover"
                    >
                      <span
                        className={cn(
                          "h-[7px] w-[7px] shrink-0 rounded-full",
                          over ? "bg-overdue" : "bg-ink-3",
                        )}
                      />
                      <span>{t.title}</span>
                      {over && (
                        <span className="ml-auto rounded-md bg-overdue-soft px-[7px] py-0.5 text-[11px] font-semibold text-overdue">
                          Atrasada
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              );
            })
          )}
          <Button className="mt-2 h-[42px] w-full text-sm" onClick={() => onOpenChange(false)}>
            Abrir projeto
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
