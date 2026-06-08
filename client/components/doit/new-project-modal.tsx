"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  newProjectSchema,
  PROJECT_COLORS,
  type NewProjectValues,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, color: string) => void;
}

export function NewProjectModal({ open, onOpenChange, onCreate }: NewProjectModalProps) {
  const form = useForm<NewProjectValues>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: { name: "", color: PROJECT_COLORS[0] },
  });

  const color = form.watch("color");

  const submit = form.handleSubmit((values) => {
    onCreate(values.name.trim(), values.color);
    form.reset({ name: "", color: PROJECT_COLORS[0] });
    onOpenChange(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) form.reset({ name: "", color: PROJECT_COLORS[0] });
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Novo projeto</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={submit}>
            <Input autoFocus placeholder="Nome do projeto" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="mt-2 text-[12.5px] font-medium text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}

            <div className="my-[18px] flex gap-2.5">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => form.setValue("color", c)}
                  style={{ background: c }}
                  className={cn(
                    "h-[30px] w-[30px] rounded-full outline-offset-[-4px] transition-all",
                    color === c
                      ? "outline outline-2 outline-background ring-2 ring-ink"
                      : "",
                  )}
                />
              ))}
            </div>

            <Button type="submit" className="h-[42px] w-full text-sm">
              Criar projeto
            </Button>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
