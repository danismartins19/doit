"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Link2 } from "lucide-react";

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
import { inviteSchema, type InviteValues } from "@/lib/schemas";
import { useStore } from "@/lib/store";
import { useInvitesHook } from "@/services/hooks";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToast: (msg: string) => void;
}

export function ShareModal({ open, onOpenChange, onToast }: ShareModalProps) {
  const { current: project, currentId } = useStore();
  const { create } = useInvitesHook();
  const [copied, setCopied] = React.useState(false);
  const [inviteLink, setInviteLink] = React.useState("");
  const [isInviting, setIsInviting] = React.useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = React.useState(false);

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "" },
  });

  if (!project) {
    return null;
  }

  const buildInviteLink = (token: string) => `${window.location.origin}/invites/${token}`;

  const onInvite = form.handleSubmit(async (values) => {
    setIsInviting(true);

    try {
      const response = await create(currentId, { email: values.email.trim() });
      const token = response.data.token;
      setInviteLink(buildInviteLink(token));
      onToast(`Convite enviado para ${values.email.trim()}`);
      form.reset({ email: "" });
    } catch {
      onToast("Nao foi possivel criar o convite");
    } finally {
      setIsInviting(false);
    }
  });

  const copy = async () => {
    setIsGeneratingLink(true);

    try {
      const response = await create(currentId, {});
      const token = response.data.token;
      const link = buildInviteLink(token);
      setInviteLink(link);
      navigator.clipboard?.writeText(link).catch(() => {});
      setCopied(true);
      onToast("Link copiado");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      onToast("Nao foi possivel gerar o link");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Compartilhar</DialogTitle>
          <DialogDescription className="flex items-center gap-[7px]">
            <span
              className="h-[9px] w-[9px] rounded-full"
              style={{ background: project.color }}
            />
            {project.name}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form onSubmit={onInvite} className="mb-2 flex gap-2">
            <div className="flex-1">
              <Input
                disabled={isInviting}
                placeholder="Convidar por e-mail..."
                {...form.register("email")}
              />
            </div>
            <Button type="submit" disabled={isInviting} className="h-10">
              {isInviting ? "Convidando..." : "Convidar"}
            </Button>
          </form>
          {form.formState.errors.email && (
            <p className="mb-2 text-[12.5px] font-medium text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-0.5">
            {project.members?.map((member) => {
              const p = member.user;
              if (!p) return null;
              const owner = member.role === "OWNER";
              return (
                <div key={member.id} className="flex items-center gap-3 px-1.5 py-2">
                  <UserAvatar person={p} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">
                      {p.name}
                      {owner && " (voce)"}
                    </div>
                    <div className="text-[12.5px] text-ink-3">{p.email}</div>
                  </div>
                  <button
                    type="button"
                    className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12.5px] font-semibold ${
                      owner ? "text-ink-3" : "text-ink-2 hover:bg-hover"
                    }`}
                  >
                    {owner ? "Proprietario" : "Membro"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-[18px] flex items-center gap-2 rounded-[10px] border border-line bg-background py-2.5 pl-3.5 pr-2.5">
            <Link2 className="h-4 w-4 text-ink-3" />
            <span className="flex-1 truncate text-[13px] text-ink-2">
              {inviteLink || "Crie um convite para gerar um link"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={copy}
              disabled={isGeneratingLink}
              className={copied ? "border-status-done text-status-done" : ""}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copiado!
                </>
              ) : (
                isGeneratingLink ? "Gerando..." : "Copiar link"
              )}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
