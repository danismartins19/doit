"use client";

import { Inbox } from "lucide-react";
import { TaskResponseDtoStatusEnum, UpdateTaskStatusDtoStatusEnum } from "@/services/api-back";

import { QuickAdd } from "@/components/doit/quick-add";
import { TaskRow } from "@/components/doit/task-row";
import { relLabel } from "@/lib/date-utils";
import { useStore } from "@/lib/store";
import type { Project, Task } from "@/lib/types";
import { useTasksHook } from "@/services/hooks";

interface TaskListProps {
  tasks: Task[];
  project: Project | null;
  viewDate: Date;
  onOpenTask: (id: string) => void;
  projectId: string;
  day: string;
  onToast: (msg: string) => void;
}

export function TaskList({ tasks, project, viewDate, onOpenTask, projectId, day, onToast }: TaskListProps) {
  const { loading, upsertTask } = useStore();
  const { updateStatus } = useTasksHook();
  const pending = tasks.filter((t) => t.status !== TaskResponseDtoStatusEnum.Done);
  const done = tasks.filter((t) => t.status === TaskResponseDtoStatusEnum.Done);
  const showAssignee = (project?.members?.length ?? 0) > 1;

  const onToggle = async (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    const status =
      task.status === TaskResponseDtoStatusEnum.Done
        ? UpdateTaskStatusDtoStatusEnum.Pending
        : UpdateTaskStatusDtoStatusEnum.Done;

    try {
      const response = await updateStatus(id, { status });
      upsertTask(response.data);
      onToast("Tarefa atualizada");
    } catch {
      onToast("Nao foi possivel atualizar a tarefa");
    }
  };

  if (!project) {
    return (
      <div className="mx-auto max-w-[660px] px-[30px] py-16 text-center text-ink-3">
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-[10px] bg-chip" />
            ))}
          </div>
        ) : (
          <>
            <Inbox className="mx-auto mb-4 h-6 w-6" />
            <p className="text-[13.5px]">Crie um projeto para comecar.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[660px] px-[30px] pb-20 pt-3.5">
      <span className="mb-[18px] inline-flex items-center gap-[7px] rounded-md bg-chip py-1 pl-2 pr-2.5 text-[12.5px] font-semibold text-ink-2">
        <span className="h-2 w-2 rounded-full" style={{ background: project.color }} />
        {project.name}
      </span>

      <div className="flex flex-col">
        {pending.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            person={t.responsible ?? t.createdBy}
            showAssignee={showAssignee}
            onToggle={onToggle}
            onOpen={onOpenTask}
          />
        ))}
        <QuickAdd
          projectId={projectId}
          day={day}
          onCreated={upsertTask}
          onToast={onToast}
        />
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
                person={t.responsible ?? t.createdBy}
                showAssignee={showAssignee}
                onToggle={onToggle}
                onOpen={onOpenTask}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
