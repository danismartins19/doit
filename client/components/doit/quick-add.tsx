"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flag, Plus } from "lucide-react";

import { taskSchema, type TaskFormValues } from "@/lib/schemas";
import { parseIso, relShort } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { CreateTaskDtoStatusEnum, TaskResponseDto } from "@/services/api-back";
import { useTasksHook } from "@/services/hooks";

interface QuickAddProps {
  projectId: string;
  day: string;
  onCreated: (task: TaskResponseDto) => void;
  onToast: (msg: string) => void;
}

function toIsoDateTime(value: string) {
  return new Date(`${value}T00:00:00`).toISOString();
}

export function QuickAdd({ projectId, day, onCreated, onToast }: QuickAddProps) {
  const [focused, setFocused] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const dateRef = React.useRef<HTMLInputElement>(null);
  const { create } = useTasksHook();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", deadline: null },
    mode: "onSubmit",
  });

  const title = form.watch("title");
  const deadline = form.watch("deadline");

  const submit = form.handleSubmit(async (values) => {
    setIsCreating(true);

    try {
      const response = await create(projectId, {
        title: values.title.trim(),
        day: toIsoDateTime(day),
        deadline: values.deadline ? toIsoDateTime(values.deadline) : null,
        status: CreateTaskDtoStatusEnum.Pending,
      });
      onCreated(response.data);
      form.reset({ title: "", deadline: null });
      onToast("Tarefa criada com sucesso");
    } catch {
      onToast("Nao foi possivel criar a tarefa");
    } finally {
      setIsCreating(false);
    }
  });

  return (
    <form
      onSubmit={submit}
      className={cn(
        "group flex items-center gap-3 rounded-[10px] p-2.5 transition-colors hover:bg-hover",
        focused && "bg-hover",
      )}
    >
      <span
        className={cn(
          "grid h-[21px] w-[21px] shrink-0 place-items-center rounded-[6.5px] border-2 border-dashed border-line-2 text-ink-3 transition-colors",
          focused && "border-solid border-primary text-primary",
        )}
      >
        <Plus className="h-[13px] w-[13px]" strokeWidth={2.4} />
      </span>

      <input
        {...form.register("title")}
        placeholder="Adicionar uma tarefa…"
        autoComplete="off"
        disabled={isCreating}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 border-none bg-transparent py-px text-[15px] text-ink outline-none placeholder:text-ink-3"
      />

      {title?.trim() ? (
        deadline ? (
          <span className="mr-1 inline-flex items-center gap-1 rounded-md bg-chip px-1.5 py-0.5 text-[11.5px] font-semibold text-ink-2">
            <Flag className="h-[11px] w-[11px]" /> {relShort(parseIso(deadline))}
          </span>
        ) : null
      ) : (
        <span className="flex items-center gap-1.5 text-[11.5px] text-ink-3">
          {isCreating ? "criando..." : "pressione"}{" "}
          <span className="rounded-[5px] border border-line-2 bg-chip px-1.5 py-px text-[10.5px] font-semibold text-ink-2">
            Enter
          </span>
        </span>
      )}

      <button
        type="button"
        disabled={isCreating}
        title="Definir data limite"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => dateRef.current?.showPicker?.()}
        className={cn(
          "grid h-7 w-7 place-items-center rounded-md text-ink-3 transition-colors hover:bg-activebg hover:text-primary",
          deadline && "text-primary",
        )}
      >
        <Flag className="h-[15px] w-[15px]" />
        <input
          ref={dateRef}
          type="date"
          className="absolute h-0 w-0 opacity-0"
          value={deadline ?? ""}
          onChange={(e) => form.setValue("deadline", e.target.value || null)}
        />
      </button>
    </form>
  );
}
