import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  SEED_ALERTS,
  SEED_CHILDREN,
  SEED_CLASS,
  SEED_CLASS_ALERTS,
  SEED_CLASS_LOGS,
  SEED_CLASS_STUDENTS,
  SEED_COACHING,
  SEED_EMOTION_LOGS,
  SEED_MILESTONES,
  SEED_NOTIFICATIONS,
  SEED_ROLEPLAY_CARDS,
  type Child,
  type ClassRoom,
  type CrisisAlert,
  type EmotionLog,
  type FollowUpAction,
  type GrowthMilestone,
  type NotificationLog,
  type Role,
  type RolePlayCard,
  type TeacherNote,
  type WeeklyCoachingCard,
} from "./mock-data";

const STORAGE_KEY = "urnotalone:state:v1";

interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

interface PersistedState {
  session: AuthSession | null;
  children: Child[];
  alerts: CrisisAlert[];
  classAlerts: CrisisAlert[];
  followUps: FollowUpAction[];
  teacherNotes: TeacherNote[];
  rolePlayCards: RolePlayCard[];
  notifications: NotificationLog[];
  ackInbox: string[]; // acknowledged crisis alert ids (parent inbox)
}

const DEFAULT_STATE: PersistedState = {
  session: null,
  children: SEED_CHILDREN,
  alerts: SEED_ALERTS,
  classAlerts: SEED_CLASS_ALERTS,
  followUps: [],
  teacherNotes: [],
  rolePlayCards: SEED_ROLEPLAY_CARDS,
  notifications: SEED_NOTIFICATIONS,
  ackInbox: [],
};

function load(): PersistedState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

interface AppContextValue extends PersistedState {
  classRoom: ClassRoom;
  classStudents: Child[];
  emotionLogs: EmotionLog[];
  classLogs: EmotionLog[];
  coaching: WeeklyCoachingCard[];
  milestones: GrowthMilestone[];

  login: (email: string, role: Role, name?: string) => void;
  logout: () => void;

  acknowledgeAlert: (alertId: string, scope: "parent" | "teacher", note?: string) => void;
  addFollowUp: (action: Omit<FollowUpAction, "id" | "recordedAt">) => void;
  addTeacherNote: (childId: string, note: string) => void;
  addRolePlayCard: (card: Omit<RolePlayCard, "id" | "createdAt" | "scope" | "classId">) => void;
  updateChild: (childId: string, patch: Partial<Child>) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const login = useCallback((email: string, role: Role, name?: string) => {
    setState((s) => ({
      ...s,
      session: {
        userId: role === "parent" ? "parent_demo" : "teacher_demo",
        email,
        name: name ?? (role === "parent" ? "보호자" : "담임 선생님"),
        role,
      },
    }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, session: null }));
  }, []);

  const acknowledgeAlert = useCallback((alertId: string, scope: "parent" | "teacher", note?: string) => {
    setState((s) => {
      const key = scope === "parent" ? "alerts" : "classAlerts";
      const next = { ...s, [key]: s[key].map((a) =>
        a.id === alertId
          ? { ...a, acknowledgedBy: s.session?.userId ?? "demo", acknowledgedAt: new Date().toISOString(), note: note ?? a.note }
          : a,
      ) } as PersistedState;
      if (scope === "parent" && !s.ackInbox.includes(alertId)) {
        next.ackInbox = [...s.ackInbox, alertId];
      }
      return next;
    });
  }, []);

  const addFollowUp = useCallback((action: Omit<FollowUpAction, "id" | "recordedAt">) => {
    setState((s) => ({
      ...s,
      followUps: [
        ...s.followUps,
        { ...action, id: `fu_${Date.now()}`, recordedAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const addTeacherNote = useCallback((childId: string, note: string) => {
    setState((s) => ({
      ...s,
      teacherNotes: [
        ...s.teacherNotes,
        { id: `tn_${Date.now()}`, childId, note, createdAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const addRolePlayCard = useCallback(
    (card: Omit<RolePlayCard, "id" | "createdAt" | "scope" | "classId">) => {
      setState((s) => ({
        ...s,
        rolePlayCards: [
          ...s.rolePlayCards,
          {
            ...card,
            id: `rp_${Date.now()}`,
            createdAt: new Date().toISOString(),
            scope: "class",
            classId: SEED_CLASS.id,
          },
        ],
      }));
    },
    [],
  );

  const updateChild = useCallback((childId: string, patch: Partial<Child>) => {
    setState((s) => ({
      ...s,
      children: s.children.map((c) => (c.id === childId ? { ...c, ...patch } : c)),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      classRoom: SEED_CLASS,
      classStudents: SEED_CLASS_STUDENTS,
      emotionLogs: SEED_EMOTION_LOGS,
      classLogs: SEED_CLASS_LOGS,
      coaching: SEED_COACHING,
      milestones: SEED_MILESTONES,
      login,
      logout,
      acknowledgeAlert,
      addFollowUp,
      addTeacherNote,
      addRolePlayCard,
      updateChild,
      resetDemo,
    }),
    [state, login, logout, acknowledgeAlert, addFollowUp, addTeacherNote, addRolePlayCard, updateChild, resetDemo],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useSession() {
  const { session } = useApp();
  return session;
}
