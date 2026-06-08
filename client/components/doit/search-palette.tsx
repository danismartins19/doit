"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  parseIso,
  relLabel,
  shortDate,
  STATE_COLOR,
  STATE_LABEL,
  taskState,
} from "@/lib/date-utils";
import { useStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (t: Task) => void;
}

export function SearchPalette({ open, onOpenChange, onPick }: SearchPaletteProps) {
  const { tasks, projects, people } = useStore();
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const projMap = React.useMemo(() => {
    const m: Record<string, (typeof projects)[number]> = {};
    projects.forEach((p) => (m[p.id] = p));
    return m;
  }, [projects]);

  const query = q.trim().toLowerCase();
  const results = query
    ? tasks
        .filter((t) => t.title.toLowerCase().includes(query))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 40)
    : [];

  const highlight = (title: string) => {
    const i = title.toLowerCase().indexOf(query);
    if (i < 0) return title;
    return (
      <>
        {title.slice(0, i)}
        <mark className="rounded-[3px] bg-[rgba(61,127,245,0.2)] px-px text-inherit">
          {title.slice(i, i + query.length)}
        </mark>
        {title.slice(i + query.length)}
      </>
    );
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Buscar tarefas em todos os projetos…"
        value={q}
        onValueChange={setQ}
      />
      <CommandList>
        {!query && (
          <div className="px-3.5 py-[22px] text-[13.5px] leading-relaxed text-ink-3">
            Digite para buscar pelo título da tarefa. Ao escolher, levamos você até o
            projeto e o dia dela.
          </div>
        )}
        {query && results.length === 0 && (
          <div className="px-3.5 py-8 text-center text-sm text-ink-3">
            Nada encontrado para “{q}”.
          </div>
        )}
        {results.map((t) => {
          const p = projMap[t.projectId];
          const d = parseIso(t.date);
          const st = taskState(t);
          return (
            <CommandItem
              key={t.id}
              value={t.id}
              onSelect={() => onPick(t)}
              className="px-3 py-2.5"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: STATE_COLOR[st] }}
              />
              <span
                className={cn(
                  "shrink truncate text-[14.5px] font-medium",
                  t.done && "text-ink-3 line-through",
                )}
              >
                {highlight(t.title)}
              </span>
              <span className="ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap text-xs text-ink-3">
                <span className="flex items-center gap-1.5 font-semibold text-ink-2">
                  <span
                    className="h-[7px] w-[7px] rounded-full"
                    style={{ background: p.raw }}
                  />
                  {p.name}
                </span>
                <span className="opacity-50">·</span>
                <span>
                  {relLabel(d)}, {shortDate(d)}
                </span>
                <span className="font-semibold" style={{ color: STATE_COLOR[st] }}>
                  {STATE_LABEL[st]}
                </span>
              </span>
            </CommandItem>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
