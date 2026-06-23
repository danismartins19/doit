"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  addDays,
  dateKey,
  dayStatus,
  diffDays,
  iso,
  MO_LONG,
  TODAY,
  WD,
} from "@/lib/date-utils";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

const DOT: Record<string, string> = {
  overdue: "var(--overdue)",
  pending: "var(--p-amber)",
  done: "var(--p-green)",
};

interface CalendarPopoverProps {
  viewDate: Date;
  projectTasks: Task[];
  onPick: (d: Date) => void;
}

export function CalendarBody({ viewDate, projectTasks, onPick }: CalendarPopoverProps) {
  const [cursor, setCursor] = React.useState(
    new Date(viewDate.getFullYear(), viewDate.getMonth(), 1),
  );

  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = addDays(monthStart, -monthStart.getDay());
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  const byDay = React.useMemo(() => {
    const m: Record<string, Task[]> = {};
    projectTasks.forEach((t) => {
      const key = dateKey(t.day);
      (m[key] = m[key] || []).push(t);
    });
    return m;
  }, [projectTasks]);

  const todayIso = iso(TODAY);
  const selIso = iso(viewDate);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="grid h-7 w-7 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-hover hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="whitespace-nowrap text-sm font-bold text-ink">
          {MO_LONG[cursor.getMonth()]} {cursor.getFullYear()}
        </span>
        <button
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="grid h-7 w-7 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-hover hover:text-ink"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {WD.map((w) => (
          <span
            key={w}
            className="py-1 text-center text-[10.5px] font-bold uppercase tracking-[0.03em] text-ink-3"
          >
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {cells.map((d) => {
          const di = iso(d);
          const st = dayStatus(byDay[di]);
          const other = d.getMonth() !== cursor.getMonth();
          const isToday = di === todayIso;
          const sel = di === selIso;
          return (
            <button
              key={di}
              onClick={() => onPick(new Date(d))}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center gap-[3px] rounded-[9px] text-[13px] transition-colors",
                sel ? "bg-primary hover:bg-brand-blue-press" : "hover:bg-hover",
              )}
            >
              <span
                className={cn(
                  "leading-none tabular-nums",
                  other && "text-ink-3 opacity-55",
                  isToday && !sel && "font-extrabold text-primary",
                  sel && "font-bold text-white",
                )}
              >
                {d.getDate()}
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: st ? DOT[st] : "transparent" }}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2.5 border-t border-line pt-3">
        <div className="flex flex-col gap-[3px]">
          <Legend color="var(--overdue)" label="Atrasada" />
          <Legend color="var(--p-amber)" label="Pendente" />
          <Legend color="var(--p-green)" label="Concluída" />
        </div>
        <button
          onClick={() => onPick(new Date(TODAY))}
          className="h-[30px] shrink-0 self-end rounded-lg border border-line-2 bg-background px-3.5 text-[12.5px] font-semibold text-ink transition-colors hover:border-primary hover:bg-hover hover:text-primary"
        >
          Hoje
        </button>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink-3">
      <i className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
