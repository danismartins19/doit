"use client";

import { useTheme } from "next-themes";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  Moon,
  Search,
  Share2,
  Sun,
} from "lucide-react";

import { CalendarBody } from "@/components/doit/calendar-popover";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, diffDays, medDate, relLabel, TODAY } from "@/lib/date-utils";
import { useStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TopBarProps {
  viewDate: Date;
  projectTasks: Task[];
  onShiftDay: (n: number) => void;
  onJumpDate: (d: Date) => void;
  onShare: () => void;
  onSearch: () => void;
  onToggleHistory: () => void;
  historyOpen: boolean;
}

export function TopBar({
  viewDate,
  projectTasks,
  onShiftDay,
  onJumpDate,
  onShare,
  onSearch,
  onToggleHistory,
  historyOpen,
}: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const isToday = diffDays(viewDate, TODAY) === 0;
  const prevLbl = relLabel(addDays(viewDate, -1));
  const nextLbl = relLabel(addDays(viewDate, 1));

  return (
    <div className="relative flex items-start justify-center px-[30px] pb-3.5 pt-[22px] max-[1080px]:justify-start max-[1080px]:pl-3.5">
      <div className="flex items-start gap-5">
        <button
          onClick={() => onShiftDay(-1)}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-1 py-1.5 text-sm font-semibold text-ink-3 transition-colors hover:text-ink"
        >
          <ChevronLeft className="h-[15px] w-[15px]" /> {prevLbl}
        </button>

        <div className="flex min-w-[150px] flex-col items-center gap-0.5">
          <div className="text-[21px] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
            {relLabel(viewDate)}
          </div>
          <div className="whitespace-nowrap text-[12.5px] font-medium text-ink-3">
            {medDate(viewDate)}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button
                title="Calendário"
                className={cn(
                  "relative mt-1.5 grid h-[26px] w-[30px] place-items-center rounded-md text-ink-3 transition-colors hover:bg-hover hover:text-primary data-[state=open]:bg-[var(--blue-soft-bg)] data-[state=open]:text-primary",
                  !isToday &&
                    "after:absolute after:right-1 after:top-[3px] after:h-[5px] after:w-[5px] after:rounded-full after:bg-primary after:content-['']",
                )}
              >
                <CalendarIcon className="h-[17px] w-[17px]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[292px]" align="center">
              <CalendarBody
                viewDate={viewDate}
                projectTasks={projectTasks}
                onPick={onJumpDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <button
          onClick={() => onShiftDay(1)}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-1 py-1.5 text-sm font-semibold text-ink-3 transition-colors hover:text-ink"
        >
          {nextLbl} <ChevronRight className="h-[15px] w-[15px]" />
        </button>
      </div>

      <div className="absolute right-[30px] top-[22px] flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          title="Buscar (⌘K)"
          onClick={onSearch}
        >
          <Search className="h-[17px] w-[17px]" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          title={isDark ? "Tema claro" : "Tema escuro"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun className="h-[17px] w-[17px]" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          title="Histórico de alterações"
          onClick={onToggleHistory}
          className={cn(
            historyOpen && "border-primary bg-[var(--blue-soft-bg)] text-primary",
          )}
        >
          <FileText className="h-[17px] w-[17px]" />
        </Button>
        <Button onClick={onShare} className="gap-1.5">
          <Share2 className="h-[15px] w-[15px]" />
          <span className="max-[1080px]:hidden">Compartilhar</span>
        </Button>
      </div>
    </div>
  );
}
