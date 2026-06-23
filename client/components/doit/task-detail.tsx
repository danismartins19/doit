"use client";

import * as React from "react";
import { Calendar, Check, FileText, Flag, Trash2, User } from "lucide-react";
import {
  CreateTaskDto,
  TaskResponseDtoStatusEnum,
  UpdateTaskStatusDtoStatusEnum,
} from "@/services/api-back";

import { DeadlineChip } from "@/components/doit/deadline-chip";
import { UserAvatar } from "@/components/doit/user-avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { parseIso, relLabel, shortDate } from "@/lib/date-utils";
import { useStore } from "@/lib/store";
import type { Project, Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTasksHook } from "@/services/hooks";

interface TaskDetailProps {
  task: Task | null;
  project: Project | undefined;
  onOpenChange: (open: boolean) => void;
  onToast: (msg: string) => void;
}

export function TaskDetail({ task, project, onOpenChange, onToast }: TaskDetailProps) {
  const { upsertTask, removeTask } = useStore();
  const { update, remove: removeTaskRequest, updateStatus: updateTaskStatus } = useTasksHook();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!task || !project) {
    return (
      <Sheet open={false} onOpenChange={onOpenChange}>
        <SheetContent side="right" />
      </Sheet>
    );
  }

  const person = (task.responsible ?? task.createdBy)!;
  const taskDate = parseIso(task.day);
  const done = task.status === TaskResponseDtoStatusEnum.Done;
  const deadline = typeof task.deadline === "string" ? task.deadline : "";

  const updateTask = async (patch: Partial<CreateTaskDto>) => {
    setIsUpdating(true);

    try {
      const response = await update(task.id, patch);
      upsertTask(response.data);
      onToast("Tarefa atualizada");
    } catch {
      onToast("Nao foi possivel atualizar a tarefa");
    } finally {
      setIsUpdating(false);
    }
  };

  const changeStatus = async () => {
    setIsUpdating(true);

    try {
      const status =
        task.status === TaskResponseDtoStatusEnum.Done
          ? UpdateTaskStatusDtoStatusEnum.Pending
          : UpdateTaskStatusDtoStatusEnum.Done;
      const response = await updateTaskStatus(task.id, { status });
      upsertTask(response.data);
      onToast("Tarefa atualizada");
    } catch {
      onToast("Nao foi possivel atualizar a tarefa");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateDeadline = async (value: string) => {
    await updateTask({ deadline: value ? new Date(`${value}T00:00:00`).toISOString() : null });
  };

  const remove = async () => {
    setIsDeleting(true);

    try {
      await removeTaskRequest(task.id);
      removeTask(task.id);
      onOpenChange(false);
      onToast("Tarefa excluida");
    } catch {
      onToast("Nao foi possivel excluir a tarefa");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Sheet open={!!task} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-ink-3">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: project.color }}
            />
            {project.name}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-6 pt-4">
          <textarea
            defaultValue={task.title}
            rows={1}
            onBlur={(e) => {
              const title = e.target.value.trim();
              if (title && title !== task.title) {
                updateTask({ title });
              }
            }}
            placeholder="Sem título"
            className={cn(
              "mb-1.5 w-full resize-none border-none bg-transparent text-[20px] font-bold leading-[1.25] tracking-[-0.01em] text-ink outline-none",
              done && "text-ink-3 line-through",
            )}
          />

          <button
            onClick={changeStatus}
            disabled={isUpdating}
            className={cn(
              "mb-5 inline-flex items-center gap-2 rounded-lg bg-chip px-3 py-1.5 text-[13px] font-semibold text-ink-2",
              done && "bg-[rgba(31,157,99,0.12)] text-status-done",
            )}
          >
            <span
              className={cn(
                "grid h-[18px] w-[18px] place-items-center rounded-[6px] border-2 border-line-2 text-white",
                done && "border-status-done bg-status-done",
              )}
            >
              {done && <Check className="h-[11px] w-[11px]" strokeWidth={3} />}
            </span>
            {done ? "Concluída" : "Marcar como concluída"}
          </button>

          <Prop icon={<Calendar className="h-[15px] w-[15px]" />} label="Dia">
            {relLabel(taskDate)} · {shortDate(taskDate)}
          </Prop>

          <Prop icon={<Flag className="h-3.5 w-3.5" />} label="Prazo">
            <input
              type="date"
              value={deadline ? deadline.slice(0, 10) : ""}
              disabled={isUpdating}
              onChange={(e) => updateDeadline(e.target.value)}
              className="rounded-md border border-line-2 bg-background px-2.5 py-1 text-[13px] text-ink outline-none focus:border-primary"
            />
            {deadline && <DeadlineChip deadline={deadline} done={done} />}
          </Prop>

          <Prop icon={<User className="h-[15px] w-[15px]" />} label="Responsável">
            <UserAvatar person={person} size={22} /> {person.name}
          </Prop>

          <Separator className="my-3.5" />

          <span className="flex items-center gap-2 text-[13px] text-ink-3">
            <FileText className="h-[15px] w-[15px]" /> Notas
          </span>
          <Textarea
            defaultValue={typeof task.details === "string" ? task.details : ""}
            onBlur={(e) => {
              if (e.target.value !== (task.details ?? "")) {
                updateTask({ details: e.target.value });
              }
            }}
            placeholder="Adicione detalhes, links, subtarefas…"
            className="mt-1.5 min-h-[90px] leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between border-t border-line px-5 py-3.5">
          <button
            onClick={remove}
            disabled={isDeleting}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-ink-3 transition-colors hover:bg-overdue-soft hover:text-overdue"
          >
            <Trash2 className="h-[15px] w-[15px]" /> {isDeleting ? "Excluindo..." : "Excluir tarefa"}
          </button>
          {(project.members?.length ?? 0) > 1 && (
            <div className="flex gap-[5px]">
              {project.members
                ?.filter((member) => member.user)
                .map((member) => (
                  <UserAvatar
                    key={member.id}
                    person={member.user!}
                    size={24}
                    className="border-2 border-panel"
                  />
                ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Prop({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 text-[13.5px]">
      <span className="flex w-24 shrink-0 items-center gap-2 font-medium text-ink-3">
        {icon} {label}
      </span>
      <span className="flex flex-1 flex-wrap items-center gap-2 font-medium text-ink">
        {children}
      </span>
    </div>
  );
}
