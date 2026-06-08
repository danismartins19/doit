"use client";

import { Inbox } from "lucide-react";

import { QuickAdd } from "@/components/doit/quick-add";
import { TaskRow } from "@/components/doit/task-row";
import { relLabel } from "@/lib/date-utils";
import { useStore } from "@/lib/store";
import type { Project, Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  project: Project;
  viewDate: Date;
  onOpenTask: (id: string) => void;
  onAdd: (title: string, deadline: string | null) => void;
}

export function TaskList({ tasks, project, viewDate, onOpenTask, onAdd }: TaskListProps) {
  const { people, toggleTask } = useStore();
  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const showAssignee = project.members.length > 1;

  return (
    <div className="mx-auto max-w-[660px] px-[30px] pb-20 pt-3.5">
      <span className="mb-[18px] inline-flex items-center gap-[7px] rounded-md bg-chip py-1 pl-2 pr-2.5 text-[12.5px] font-semibold text-ink-2">
        <span className="h-2 w-2 rounded-full" style={{ background: project.raw }} />
        {project.name}
      </span>

      <div className="flex flex-col">
        {pending.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            person={people[t.by]}
            showAssignee={showAssignee}
            onToggle={toggleTask}
            onOpen={onOpenTask}
          />
        ))}
        <QuickAdd onAdd={onAdd} />
      </div>

      {pending.length === 0 && done.length === 0 && (
        <div className="px-5 py-16 text-center text-ink-3">
          <div className="mx-auto mb-4 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-chip text-ink-3">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="mb-1.5 text-base font-bold text-ink-2">
            Nada para {relLabel(viewDate).toLowerCase()}
          </h3>
          <p className="text-[13.5px]">Adicione a primeira tarefa deste dia acima.</p>
        </div>
      )}

      {done.length > 0 && (
        <>
          <div className="mb-1.5 mt-[22px] flex items-center gap-2.5 px-2.5">
            <span className="text-xs font-bold uppercase tracking-[0.04em] text-ink-3">
              Concluídas · {done.length}
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="flex flex-col">
            {done.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                person={people[t.by]}
                showAssignee={showAssignee}
                onToggle={toggleTask}
                onOpen={onOpenTask}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
