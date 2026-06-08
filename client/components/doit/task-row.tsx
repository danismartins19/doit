"use client";

import { Check, GripVertical } from "lucide-react";

import { DeadlineChip } from "@/components/doit/deadline-chip";
import { initials } from "@/lib/date-utils";
import type { Person, Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TaskRowProps {
  task: Task;
  person?: Person;
  showAssignee: boolean;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
}

export function TaskRow({ task, person, showAssignee, onToggle, onOpen }: TaskRowProps) {
  return (
    <div
      onClick={() => onOpen(task.id)}
      className={cn(
        "group relative flex cursor-pointer items-start gap-3 rounded-[10px] px-2.5 py-2.5 transition-colors hover:bg-hover",
      )}
    >
      <span
        onClick={(e) => e.stopPropagation()}
        className="absolute left-[-16px] top-3 cursor-grab text-ink-3 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4" />
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className={cn(
          "mt-px grid h-[21px] w-[21px] shrink-0 place-items-center rounded-[6.5px] border-2 border-line-2 bg-panel text-white transition-all hover:border-primary",
          task.done && "border-primary bg-primary",
        )}
      >
        <Check
          className={cn(
            "h-[13px] w-[13px] transition-all",
            task.done ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
          strokeWidth={3}
        />
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-[3px] pt-px">
        <span
          className={cn(
            "text-[15px] font-medium leading-[1.35] text-ink",
            task.done && "text-ink-3 line-through decoration-ink-3",
          )}
        >
          {task.title}
        </span>

        {(task.deadline || (showAssignee && person && person.id !== "me")) && (
          <div className="flex flex-wrap items-center gap-2">
            {task.deadline && <DeadlineChip deadline={task.deadline} done={task.done} />}
            {showAssignee && person && person.id !== "me" && (
              <span
                className="grid h-[19px] w-[19px] place-items-center rounded-full text-[9.5px] font-bold text-white"
                style={{ background: person.color }}
                title={person.name}
              >
                {initials(person.name)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
