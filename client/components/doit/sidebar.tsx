"use client";

import { Plus, Users } from "lucide-react";

import { Logo } from "@/components/doit/logo";
import { UserAvatar } from "@/components/doit/user-avatar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNewProject: () => void;
}

export function Sidebar({ onNewProject }: SidebarProps) {
  const { projects, tasks, currentId, selectProject, people } = useStore();
  const me = people.me;

  return (
    <aside className="flex w-[268px] shrink-0 flex-col border-r border-line bg-side px-3.5 py-5">
      <div className="flex items-center gap-2.5 px-2.5 pb-5 pt-1">
        <Logo />
      </div>

      <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.07em] text-ink-3">
        <span>Meus projetos</span>
        <button
          title="Novo projeto"
          onClick={onNewProject}
          className="grid h-[22px] w-[22px] place-items-center rounded-md text-ink-3 transition-colors hover:bg-hover hover:text-ink"
        >
          <Plus className="h-[15px] w-[15px]" />
        </button>
      </div>

      <div className="flex flex-col gap-0.5">
        {projects.map((p) => {
          const pending = tasks.filter((t) => t.projectId === p.id && !t.done).length;
          const shared = p.members.length > 1;
          const active = p.id === currentId;
          return (
            <button
              key={p.id}
              onClick={() => selectProject(p.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-[9px] px-3 py-2 text-left text-[14.5px] font-medium text-ink transition-colors hover:bg-hover",
                active && "bg-activebg font-semibold",
              )}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: p.raw }}
              />
              <span className="flex-1 truncate">{p.name}</span>
              {shared && (
                <span className="text-ink-3" title={`${p.members.length} pessoas`}>
                  <Users className="h-[13px] w-[13px]" />
                </span>
              )}
              <span
                className={cn(
                  "text-xs font-semibold tabular-nums",
                  active ? "text-ink-2" : "text-ink-3",
                )}
              >
                {pending}
              </span>
            </button>
          );
        })}

        <button
          onClick={onNewProject}
          className="mt-1 flex w-full items-center gap-2.5 rounded-[9px] px-3 py-2 text-left text-sm font-medium text-ink-3 transition-colors hover:bg-hover hover:text-ink-2"
        >
          <Plus className="h-[15px] w-[15px]" /> Novo projeto
        </button>
      </div>

      <div className="mt-auto flex items-center gap-2.5 border-t border-line px-1.5 pt-2.5">
        <UserAvatar person={me} size={30} />
        <div className="text-[13px] font-semibold leading-tight">
          {me.name}
          <span className="block text-[11.5px] font-medium text-ink-3">{me.email}</span>
        </div>
      </div>
    </aside>
  );
}
