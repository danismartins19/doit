"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Link2 } from "lucide-react";

import { UserAvatar } from "@/components/doit/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inviteSchema, type InviteValues } from "@/lib/schemas";
import { useStore } from "@/lib/store";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToast: (msg: string) => void;
}

export function ShareModal({ open, onOpenChange, onToast }: ShareModalProps) {
  const { current: project, people, invite } = useStore();
  const [copied, setCopied] = React.useState(false);

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role: "edit" },
  });

  const onInvite = form.handleSubmit((values) => {
    invite(values.email.trim(), values.role);
    onToast(`Convite enviado para ${values.email.trim()}`);
    form.reset({ email: "", role: values.role });
  });

  const copy = () => {
    navigator.clipboard?.writeText("https://" + project.shareLink).catch(() => {});
    setCopied(true);
    onToast("Link copiado");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Compartilhar</DialogTitle>
          <DialogDescription className="flex items-center gap-[7px]">
            <span
              className="h-[9px] w-[9px] rounded-full"
              style={{ background: project.raw }}
            />
            {project.name}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form onSubmit={onInvite} className="mb-2 flex gap-2">
            <div className="flex-1">
              <Input placeholder="Convidar por e-mail…" {...form.register("email")} />
            </div>
            <Select
              defaultValue="edit"
              onValueChange={(v) => form.setValue("role", v as "view" | "edit")}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="edit">Pode editar</SelectItem>
                <SelectItem value="view">Pode ver</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="h-10">
              Convidar
            </Button>
          </form>
          {form.formState.errors.email && (
            <p className="mb-2 text-[12.5px] font-medium text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-0.5">
            {project.members.map((mid) => {
              const p = people[mid];
              const owner = mid === "me";
              return (
                <div key={mid} className="flex items-center gap-3 px-1.5 py-2">
                  <UserAvatar person={p} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">
                      {p.name}
                      {owner && " (você)"}
                    </div>
                    <div className="text-[12.5px] text-ink-3">{p.email}</div>
                  </div>
                  <button
                    className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12.5px] font-semibold ${
                      owner ? "text-ink-3" : "text-ink-2 hover:bg-hover"
                    }`}
                  >
                    {owner ? (
                      "Proprietário"
                    ) : (
                      <>
                        Pode editar <ChevronDown className="h-[13px] w-[13px]" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-[18px] flex items-center gap-2 rounded-[10px] border border-line bg-background py-2.5 pl-3.5 pr-2.5">
            <Link2 className="h-4 w-4 text-ink-3" />
            <span className="flex-1 truncate text-[13px] text-ink-2">
              https://{project.shareLink}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={copy}
              className={copied ? "border-status-done text-status-done" : ""}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copiado!
                </>
              ) : (
                "Copiar link"
              )}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
