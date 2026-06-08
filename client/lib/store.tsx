"use client";

/* ============ doit — domain store (Context + reducer) ============ */
import * as React from "react";
import type { Person, Project, Task, Activity, Role } from "./types";
import { PEOPLE, PROJECTS, TASKS, ACTIVITY } from "./data";
import { TODAY, iso, uid } from "./date-utils";

function nowHM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface State {
  people: Record<string, Person>;
  projects: Project[];
  tasks: Task[];
  activity: Activity[];
  currentId: string;
}

type Action =
  | { type: "TOGGLE_TASK"; id: string }
  | { type: "ADD_TASK"; title: string; deadline: string | null; date: string }
  | { type: "PATCH_TASK"; id: string; patch: Partial<Task> }
  | { type: "DELETE_TASK"; id: string }
  | { type: "SELECT_PROJECT"; id: string }
  | { type: "CREATE_PROJECT"; name: string; raw: string }
  | { type: "INVITE"; email: string; role: Role };

function log(state: State, kind: Activity["kind"], target: string | null, by = "me"): Activity[] {
  return [
    {
      id: uid("a"),
      projectId: state.currentId,
      by,
      kind,
      target,
      date: iso(TODAY),
      time: nowHM(),
    },
    ...state.activity,
  ];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_TASK": {
      const t = state.tasks.find((x) => x.id === action.id);
      if (!t) return state;
      const nowDone = !t.done;
      return {
        ...state,
        tasks: state.tasks.map((x) => (x.id === action.id ? { ...x, done: nowDone } : x)),
        activity: log(state, nowDone ? "complete" : "reopen", t.title),
      };
    }
    case "ADD_TASK": {
      const task: Task = {
        id: uid("t"),
        projectId: state.currentId,
        date: action.date,
        title: action.title,
        done: false,
        deadline: action.deadline,
        by: "me",
        notes: "",
      };
      return { ...state, tasks: [...state.tasks, task], activity: log(state, "add", action.title) };
    }
    case "PATCH_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)),
      };
    case "DELETE_TASK": {
      const t = state.tasks.find((x) => x.id === action.id);
      return {
        ...state,
        tasks: state.tasks.filter((x) => x.id !== action.id),
        activity: t ? log(state, "delete", t.title) : state.activity,
      };
    }
    case "SELECT_PROJECT":
      return { ...state, currentId: action.id };
    case "CREATE_PROJECT": {
      const id = uid("p");
      const slug = action.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const project: Project = {
        id,
        name: action.name,
        color: action.raw,
        raw: action.raw,
        members: ["me"],
        shareLink: `doit.app/p/${slug}-${Math.random().toString(36).slice(2, 6)}`,
      };
      return { ...state, projects: [...state.projects, project], currentId: id };
    }
    case "INVITE": {
      const pid = "u_" + action.email.split("@")[0].replace(/[^a-z0-9]/gi, "");
      const palette = ["#0ea5b7", "#e0901a", "#e5557a", "#8b5cf6", "#1f9d63"];
      const people = state.people[pid]
        ? state.people
        : {
            ...state.people,
            [pid]: {
              id: pid,
              name: action.email
                .split("@")[0]
                .replace(/[._]/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()),
              email: action.email,
              color: palette[Object.keys(state.people).length % palette.length],
            },
          };
      const projects = state.projects.map((p) =>
        p.id === state.currentId && !p.members.includes(pid)
          ? { ...p, members: [...p.members, pid] }
          : p,
      );
      return { ...state, people, projects, activity: log(state, "create", null) };
    }
    default:
      return state;
  }
}

const initialState: State = {
  people: PEOPLE,
  projects: PROJECTS,
  tasks: TASKS,
  activity: ACTIVITY,
  currentId: PROJECTS[0].id,
};

interface StoreValue extends State {
  toggleTask: (id: string) => void;
  addTask: (title: string, deadline: string | null, date: string) => void;
  patchTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  selectProject: (id: string) => void;
  createProject: (name: string, raw: string) => void;
  invite: (email: string, role: Role) => void;
  /** convenience selectors */
  current: Project;
}

const StoreContext = React.createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value: StoreValue = React.useMemo(() => {
    const current = state.projects.find((p) => p.id === state.currentId) ?? state.projects[0];
    return {
      ...state,
      current,
      toggleTask: (id) => dispatch({ type: "TOGGLE_TASK", id }),
      addTask: (title, deadline, date) => dispatch({ type: "ADD_TASK", title, deadline, date }),
      patchTask: (id, patch) => dispatch({ type: "PATCH_TASK", id, patch }),
      deleteTask: (id) => dispatch({ type: "DELETE_TASK", id }),
      selectProject: (id) => dispatch({ type: "SELECT_PROJECT", id }),
      createProject: (name, raw) => dispatch({ type: "CREATE_PROJECT", name, raw }),
      invite: (email, role) => dispatch({ type: "INVITE", email, role }),
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
