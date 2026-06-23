"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { HistoryDrawer } from "@/components/doit/history-drawer";
import { NewProjectModal } from "@/components/doit/new-project-modal";
import { SearchPalette } from "@/components/doit/search-palette";
import { ShareModal } from "@/components/doit/share-modal";
import { Sidebar } from "@/components/doit/sidebar";
import { SummaryModal } from "@/components/doit/summary-modal";
import { TaskDetail } from "@/components/doit/task-detail";
import { TaskList } from "@/components/doit/task-list";
import { TopBar } from "@/components/doit/top-bar";
import { addDays, dateKey, iso, parseIso, TODAY } from "@/lib/date-utils";
import { useStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { useProjectsHook, useTasksHook, useUsersHook } from "@/services/hooks";
import type { ProjectResponseDto } from "@/services/api-back";

export function DoitApp() {
  const store = useStore();
  const {
    tasks,
    projects,
    currentId,
    current,
    selectProject,
    error,
    setError,
    setLoading,
    setProjects,
    setTasks,
    setUser,
    upsertProject,
  } = store;
  const { me } = useUsersHook();
  const { findAll: findAllProjects } = useProjectsHook();
  const { findAll: findAllTasks } = useTasksHook();

  const [viewDate, setViewDate] = React.useState<Date>(new Date(TODAY));
  const [shareOpen, setShareOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [detailId, setDetailId] = React.useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = React.useState(false);
  const [newProjOpen, setNewProjOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const toastTimer = React.useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const loadHome = React.useCallback(() => {
    setLoading(true);
    setError(null);

    Promise.all([me(), findAllProjects()])
      .then(async ([userResponse, projectsResponse]) => {
        const nextProjects = projectsResponse.data;
        setUser(userResponse.data);
        setProjects(nextProjects);

        const taskResponses = await Promise.all(
          nextProjects.map((project) => findAllTasks(project.id)),
        );
        setTasks(taskResponses.flatMap((response) => response.data));
      })
      .catch(() => {
        setUser(null);
        setProjects([]);
        setTasks([]);
        setError("Nao foi possivel carregar seus dados");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [findAllProjects, findAllTasks, me, setError, setLoading, setProjects, setTasks, setUser]);

  React.useEffect(() => {
    loadHome();
  }, [loadHome]);

  React.useEffect(() => {
    if (error) {
      showToast(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // ⌘K / Ctrl+K to open search
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSelectProject = (id: string) => {
    if (id === currentId) return;
    selectProject(id);
    setDetailId(null);
    setSummaryOpen(true);
  };

  const handleProjectCreated = (project: ProjectResponseDto) => {
    upsertProject(project);
  };

  const goToTask = (t: Task) => {
    selectProject(t.projectId);
    setViewDate(parseIso(t.day));
    setSummaryOpen(false);
    setSearchOpen(false);
    setTimeout(() => setDetailId(t.id), 60);
  };

  const toggleHistory = () => {
    setHistoryOpen((v) => !v);
    setDetailId(null);
  };

  const openDetail = (id: string) => {
    setDetailId(id);
    setHistoryOpen(false);
  };

  const dayTasks = tasks.filter(
    (t) => t.projectId === currentId && dateKey(t.day) === iso(viewDate),
  );
  const projectTasks = tasks.filter((t) => t.projectId === currentId);
  const detailTask = detailId ? tasks.find((t) => t.id === detailId) ?? null : null;
  const detailProject = detailTask
    ? projects.find((p) => p.id === detailTask.projectId)
    : undefined;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onNewProject={() => setNewProjOpen(true)} />

      <main className="flex min-w-0 flex-1 flex-col bg-canvas">
        <TopBar
          viewDate={viewDate}
          projectTasks={projectTasks}
          onShiftDay={(n) => setViewDate((d) => addDays(d, n))}
          onJumpDate={(d) => setViewDate(new Date(d))}
          onShare={() => setShareOpen(true)}
          onSearch={() => setSearchOpen(true)}
          onToggleHistory={toggleHistory}
          historyOpen={historyOpen}
        />

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <TaskList
            tasks={dayTasks}
            project={current}
            viewDate={viewDate}
            onOpenTask={openDetail}
            projectId={currentId}
            day={iso(viewDate)}
            onToast={showToast}
          />
        </div>
      </main>

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} onToast={showToast} />
      <SummaryModal
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        onGoToTask={goToTask}
      />
      <NewProjectModal
        open={newProjOpen}
        onOpenChange={setNewProjOpen}
        onCreated={handleProjectCreated}
        onToast={showToast}
      />
      <SearchPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onPick={goToTask}
        onToast={showToast}
      />
      <HistoryDrawer open={historyOpen} onOpenChange={setHistoryOpen} />
      <TaskDetail
        task={detailTask}
        project={detailProject}
        onOpenChange={(o) => !o && setDetailId(null)}
        onToast={showToast}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2.5 rounded-[10px] bg-brand-navy px-[18px] py-2.5 text-[13px] font-medium text-white shadow-[0_12px_40px_-12px_rgba(20,24,34,0.4)] dark:border dark:border-line-2 dark:bg-panel dark:text-ink">
          <Check className="h-[15px] w-[15px]" strokeWidth={2.6} /> {toast}
        </div>
      )}
    </div>
  );
}
