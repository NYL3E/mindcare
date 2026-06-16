"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  calculateStreak,
  canJoinActivity,
  mapRequestToFriend,
  moodDateKey,
} from "@/lib/rules";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MoodEntry {
  date: string;
  energy: number;
  mood: number;
  stress: number;
  social: number;
}

export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface ActivityData {
  id: number;
  title: string;
  category: string;
  categoryIcon?: string;
  description: string;
  participants: number;
  maxParticipants: number;
  location: string;
  date?: string;
  isPublic?: boolean;
  hostName?: string;
  joined?: boolean;
}

export interface FriendData {
  id: number;
  name: string;
  initial: string;
  online: boolean;
  moodIcon: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface FriendRequest {
  id: number;
  name: string;
  initial: string;
  mutualFriends: number;
  gradientFrom: string;
  gradientTo: string;
}

export interface AISettings {
  name: string;
  personality: string;
  color: string;
  tutoiement: boolean;
  decontracte: boolean;
  eyes: string;
  mouth: string;
  hair: string;
}

export interface UserProfile {
  name: string;
  bio: string;
}

export interface NotificationSettings {
  checkin: boolean;
  messages: boolean;
  activites: boolean;
  amis: boolean;
}

export interface PrivacySettings {
  profilPublic: boolean;
  showMood: boolean;
  shareLocation: boolean;
}

interface MindCareState {
  // Auth
  user: User | null;
  authLoading: boolean;
  signOut: () => Promise<void>;

  // AI
  ai: AISettings;
  setAI: (ai: Partial<AISettings>) => void;

  // Profile
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;

  // Mood
  moodHistory: MoodEntry[];
  saveMood: (entry: Omit<MoodEntry, "date">) => void;
  todayMood: MoodEntry | null;

  // Chat
  messages: ChatMessage[];
  addMessage: (text: string, isUser: boolean) => void;

  // Activities
  activities: ActivityData[];
  addActivity: (activity: Omit<ActivityData, "id">) => void;
  joinActivity: (id: number) => void;

  // Friends
  friends: FriendData[];
  friendRequests: FriendRequest[];
  acceptRequest: (id: number) => void;
  declineRequest: (id: number) => void;

  // Settings
  notifications: NotificationSettings;
  setNotifications: (n: Partial<NotificationSettings>) => void;
  privacy: PrivacySettings;
  setPrivacy: (p: Partial<PrivacySettings>) => void;
  theme: string;
  setTheme: (t: string) => void;

  // Stats
  streak: number;
}

// ─── Default data (used for new accounts) ────────────────────────────────────

const defaultAI: AISettings = {
  name: "Luna",
  personality: "empathique",
  color: "pink",
  tutoiement: true,
  decontracte: true,
  eyes: "round",
  mouth: "smile",
  hair: "none",
};

const defaultActivities = [
  { title: "Yoga au parc", category: "Bien-être", categoryIcon: "lotus", description: "Séance de yoga douce en plein air, tous niveaux", participants: 8, maxParticipants: 15, location: "Parc des Buttes-Chaumont", date: "Demain · 10h00", isPublic: true, hostName: "Marie", joined: false },
  { title: "Café & Boardgames", category: "Social", categoryIcon: "fork", description: "Soirée jeux de société dans un café cozy", participants: 5, maxParticipants: 10, location: "Le Dernier Bar", date: "Jeudi · 18h30", isPublic: true, hostName: "Thomas", joined: false },
  { title: "Rando découverte", category: "Nature", categoryIcon: "leaf", description: "Balade en forêt avec pique-nique partagé", participants: 12, maxParticipants: 20, location: "Forêt de Fontainebleau", date: "Samedi · 9h00", isPublic: true, hostName: "Hugo", joined: false },
  { title: "Atelier peinture", category: "Créatif", categoryIcon: "palette", description: "Peindre ensemble dans une ambiance détendue", participants: 4, maxParticipants: 8, location: "Atelier Montmartre", date: "Vendredi · 14h00", isPublic: true, hostName: "Léa", joined: false },
  { title: "Course matinale", category: "Sport", categoryIcon: "run", description: "Run de 5km suivi d'un petit-déj ensemble", participants: 6, maxParticipants: 12, location: "Canal Saint-Martin", date: "Dimanche · 8h00", isPublic: true, hostName: "Nathan", joined: false },
  { title: "Soirée gaming", category: "Gaming", categoryIcon: "gamepad", description: "Tournoi Mario Kart & pizza party", participants: 7, maxParticipants: 8, location: "Chez Alex", date: "Samedi · 20h00", isPublic: false, hostName: "Lucas", joined: false },
];

const defaultFriends = [
  { name: "Marie L.", initial: "M", online: true, moodIcon: "smile", gradientFrom: "from-pink-400", gradientTo: "to-violet-400" },
  { name: "Thomas D.", initial: "T", online: true, moodIcon: "wave", gradientFrom: "from-violet-400", gradientTo: "to-sky-400" },
  { name: "Léa M.", initial: "L", online: false, moodIcon: "lotus", gradientFrom: "from-coral-400", gradientTo: "to-pink-400" },
  { name: "Hugo B.", initial: "H", online: true, moodIcon: "heart", gradientFrom: "from-mint-400", gradientTo: "to-sky-400" },
  { name: "Camille R.", initial: "C", online: false, moodIcon: "smile", gradientFrom: "from-lemon-400", gradientTo: "to-coral-400" },
  { name: "Nathan P.", initial: "N", online: true, moodIcon: "fire", gradientFrom: "from-sky-400", gradientTo: "to-violet-400" },
];

const defaultFriendRequests = [
  { name: "Sophie B.", initial: "S", mutualFriends: 3, gradientFrom: "from-mint-400", gradientTo: "to-violet-400" },
  { name: "Antoine M.", initial: "A", mutualFriends: 1, gradientFrom: "from-lemon-400", gradientTo: "to-pink-400" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// calculateStreak est désormais importé depuis @/lib/rules (testé unitairement).

function ts(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const MindCareContext = createContext<MindCareState | undefined>(undefined);

export function MindCareProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [ai, setAIState] = useState<AISettings>(defaultAI);
  const [profile, setProfileState] = useState<UserProfile>({ name: "Toi", bio: "" });
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [notifications, setNotificationsState] = useState<NotificationSettings>({ checkin: true, messages: true, activites: true, amis: true });
  const [privacy, setPrivacyState] = useState<PrivacySettings>({ profilPublic: true, showMood: true, shareLocation: false });
  const [theme, setThemeState] = useState<string>("clair");

  const dataLoadedForRef = useRef<string | null>(null);

  // ─── Initialise un nouveau compte avec les données par défaut ────────────
  const initNewUser = useCallback(async (userId: string, displayName: string) => {
    const now = ts();

    await Promise.all([
      supabase.from("profiles").insert({ id: userId, name: displayName, bio: "" }),
      supabase.from("ai_settings").insert({ user_id: userId, ...defaultAI }),
      supabase.from("notification_prefs").insert({ user_id: userId }),
      supabase.from("privacy_prefs").insert({ user_id: userId }),
      supabase.from("user_settings").insert({ user_id: userId }),
      supabase.from("chat_messages").insert([
        { user_id: userId, text: `Salut ${displayName} ! Je suis Luna, ton amie IA. Comment tu vas aujourd'hui ?`, is_user: false, ts: now, seq: 1 },
      ]),
      supabase.from("activities").insert(
        defaultActivities.map((a) => ({ user_id: userId, title: a.title, category: a.category, category_icon: a.categoryIcon, description: a.description, participants: a.participants, max_participants: a.maxParticipants, location: a.location, date_label: a.date, is_public: a.isPublic, host_name: a.hostName, joined: false }))
      ),
      supabase.from("friends").insert(
        defaultFriends.map((f) => ({ user_id: userId, name: f.name, initial: f.initial, online: f.online, mood_icon: f.moodIcon, gradient_from: f.gradientFrom, gradient_to: f.gradientTo }))
      ),
      supabase.from("friend_requests").insert(
        defaultFriendRequests.map((r) => ({ user_id: userId, name: r.name, initial: r.initial, mutual_friends: r.mutualFriends, gradient_from: r.gradientFrom, gradient_to: r.gradientTo }))
      ),
    ]);
  }, []);

  // ─── Charge toutes les données de l'utilisateur ──────────────────────────
  const loadData = useCallback(async (userId: string, displayName: string) => {
    if (dataLoadedForRef.current === userId) return;
    dataLoadedForRef.current = userId;

    // Check if profile exists (new user detection)
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (!profileData) {
      await initNewUser(userId, displayName);
    }

    // Fetch all data in parallel
    const [
      prof, aiData, moodData, msgData, actData, friendData, reqData, notifData, privData, settingsData,
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("ai_settings").select("*").eq("user_id", userId).single(),
      supabase.from("mood_entries").select("*").eq("user_id", userId),
      supabase.from("chat_messages").select("*").eq("user_id", userId).order("seq"),
      supabase.from("activities").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("friends").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("friend_requests").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("notification_prefs").select("*").eq("user_id", userId).single(),
      supabase.from("privacy_prefs").select("*").eq("user_id", userId).single(),
      supabase.from("user_settings").select("*").eq("user_id", userId).single(),
    ]);

    if (prof.data) setProfileState({ name: prof.data.name, bio: prof.data.bio });

    if (aiData.data) {
      const d = aiData.data;
      setAIState({ name: d.name, personality: d.personality, color: d.color, tutoiement: d.tutoiement, decontracte: d.decontracte, eyes: d.eyes ?? "round", mouth: d.mouth ?? "smile", hair: d.hair ?? "none" });
    }

    if (moodData.data) {
      setMoodHistory(moodData.data.map((e: { date: string; energy: number; mood: number; stress: number; social: number }) => ({ date: e.date, energy: e.energy, mood: e.mood, stress: e.stress, social: e.social })));
    }

    if (msgData.data) {
      setMessages(msgData.data.map((m: { seq: number; text: string; is_user: boolean; ts: string }, i: number) => ({ id: m.seq || i + 1, text: m.text, isUser: m.is_user, timestamp: m.ts })));
    }

    if (actData.data) {
      setActivities(actData.data.map((a: { id: string; title: string; category: string; category_icon?: string; description: string; participants: number; max_participants: number; location: string; date_label?: string; is_public?: boolean; host_name?: string; joined?: boolean }, i: number) => ({
        id: i + 1,
        title: a.title,
        category: a.category,
        categoryIcon: a.category_icon,
        description: a.description,
        participants: a.participants,
        maxParticipants: a.max_participants,
        location: a.location,
        date: a.date_label,
        isPublic: a.is_public,
        hostName: a.host_name,
        joined: a.joined,
        _uuid: a.id,
      })));
    }

    if (friendData.data) {
      setFriends(friendData.data.map((f: { id: string; name: string; initial: string; online: boolean; mood_icon: string; gradient_from: string; gradient_to: string }, i: number) => ({
        id: i + 1,
        name: f.name,
        initial: f.initial,
        online: f.online,
        moodIcon: f.mood_icon,
        gradientFrom: f.gradient_from,
        gradientTo: f.gradient_to,
        _uuid: f.id,
      })));
    }

    if (reqData.data) {
      setFriendRequests(reqData.data.map((r: { id: string; name: string; initial: string; mutual_friends: number; gradient_from: string; gradient_to: string }, i: number) => ({
        id: i + 1,
        name: r.name,
        initial: r.initial,
        mutualFriends: r.mutual_friends,
        gradientFrom: r.gradient_from,
        gradientTo: r.gradient_to,
        _uuid: r.id,
      })));
    }

    if (notifData.data) {
      const d = notifData.data;
      setNotificationsState({ checkin: d.checkin, messages: d.messages, activites: d.activites, amis: d.amis });
    }

    if (privData.data) {
      const d = privData.data;
      setPrivacyState({ profilPublic: d.profil_public, showMood: d.show_mood, shareLocation: d.share_location });
    }

    if (settingsData.data) setThemeState(settingsData.data.theme);

    setAuthLoading(false);
  }, [initNewUser]);

  // ─── Auth state listener ─────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const name = session.user.user_metadata?.name ?? session.user.email?.split("@")[0] ?? "Toi";
        loadData(session.user.id, name);
      } else {
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const name = session.user.user_metadata?.name ?? session.user.email?.split("@")[0] ?? "Toi";
        loadData(session.user.id, name);
      } else {
        setUser(null);
        dataLoadedForRef.current = null;
        setAuthLoading(false);
        // Reset state
        setAIState(defaultAI);
        setProfileState({ name: "Toi", bio: "" });
        setMoodHistory([]);
        setMessages([]);
        setActivities([]);
        setFriends([]);
        setFriendRequests([]);
        setNotificationsState({ checkin: true, messages: true, activites: true, amis: true });
        setPrivacyState({ profilPublic: true, showMood: true, shareLocation: false });
        setThemeState("clair");
      }
    });

    return () => subscription.unsubscribe();
  }, [loadData]);

  // ─── Theme ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (theme === "sombre") root.classList.add("dark");
    else if (theme === "clair") root.classList.remove("dark");
    else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = () => mq.matches ? root.classList.add("dark") : root.classList.remove("dark");
      apply();
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  // ─── Mutations ───────────────────────────────────────────────────────────

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const setAI = useCallback((partial: Partial<AISettings>) => {
    setAIState((prev) => {
      const next = { ...prev, ...partial };
      if (user) {
        supabase.from("ai_settings").upsert({ user_id: user.id, ...next, updated_at: new Date().toISOString() }, { onConflict: "user_id" }).then(() => {});
      }
      return next;
    });
  }, [user]);

  const setProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...partial };
      if (user) {
        supabase.from("profiles").update({ name: next.name, bio: next.bio }).eq("id", user.id).then(() => {});
      }
      return next;
    });
  }, [user]);

  const saveMood = useCallback((entry: Omit<MoodEntry, "date">) => {
    const today = moodDateKey();
    setMoodHistory((prev) => {
      const filtered = prev.filter((e) => e.date !== today);
      return [...filtered, { ...entry, date: today }];
    });
    if (user) {
      supabase.from("mood_entries").upsert({ user_id: user.id, date: today, ...entry }, { onConflict: "user_id,date" }).then(() => {});
    }
  }, [user]);

  const todayMood = moodHistory.find((e) => e.date === moodDateKey()) ?? null;

  const addMessage = useCallback((text: string, isUser: boolean) => {
    setMessages((prev) => {
      const seq = prev.length > 0 ? Math.max(...prev.map((m) => m.id)) + 1 : 1;
      const newMsg: ChatMessage = { id: seq, text, isUser, timestamp: ts() };
      if (user) {
        supabase.from("chat_messages").insert({ user_id: user.id, text, is_user: isUser, ts: newMsg.timestamp, seq }).then(() => {});
      }
      return [...prev, newMsg];
    });
  }, [user]);

  const addActivity = useCallback((activity: Omit<ActivityData, "id">) => {
    setActivities((prev) => {
      const id = prev.length > 0 ? Math.max(...prev.map((a) => a.id)) + 1 : 1;
      const newAct = { ...activity, id };
      if (user) {
        supabase.from("activities").insert({ user_id: user.id, title: activity.title, category: activity.category, category_icon: activity.categoryIcon, description: activity.description, participants: activity.participants, max_participants: activity.maxParticipants, location: activity.location, date_label: activity.date, is_public: activity.isPublic, host_name: activity.hostName, joined: activity.joined ?? false }).then(() => {});
      }
      return [...prev, newAct];
    });
  }, [user]);

  const joinActivity = useCallback((id: number) => {
    setActivities((prev) => {
      const updated = prev.map((a) => {
        if (a.id !== id || !canJoinActivity(a)) return a;
        const next = { ...a, joined: true, participants: a.participants + 1 };
        if (user && (a as ActivityData & { _uuid?: string })._uuid) {
          supabase.from("activities").update({ joined: true, participants: next.participants }).eq("id", (a as ActivityData & { _uuid?: string })._uuid!).then(() => {});
        }
        return next;
      });
      return updated;
    });
  }, [user]);

  const acceptRequest = useCallback((id: number) => {
    setFriendRequests((prev) => {
      const req = prev.find((r) => r.id === id);
      if (req) {
        setFriends((prevFriends) => {
          const newId = prevFriends.length > 0 ? Math.max(...prevFriends.map((f) => f.id)) + 1 : 1;
          const newFriend: FriendData = mapRequestToFriend(req, newId);
          if (user) {
            const uuid = (req as FriendRequest & { _uuid?: string })._uuid;
            if (uuid) supabase.from("friend_requests").delete().eq("id", uuid).then(() => {});
            supabase.from("friends").insert({ user_id: user.id, name: req.name, initial: req.initial, online: false, mood_icon: "smile", gradient_from: req.gradientFrom, gradient_to: req.gradientTo }).then(() => {});
          }
          return [...prevFriends, newFriend];
        });
      }
      return prev.filter((r) => r.id !== id);
    });
  }, [user]);

  const declineRequest = useCallback((id: number) => {
    setFriendRequests((prev) => {
      const req = prev.find((r) => r.id === id);
      if (user && req) {
        const uuid = (req as FriendRequest & { _uuid?: string })._uuid;
        if (uuid) supabase.from("friend_requests").delete().eq("id", uuid).then(() => {});
      }
      return prev.filter((r) => r.id !== id);
    });
  }, [user]);

  const setNotifications = useCallback((partial: Partial<NotificationSettings>) => {
    setNotificationsState((prev) => {
      const next = { ...prev, ...partial };
      if (user) {
        supabase.from("notification_prefs").upsert({ user_id: user.id, checkin: next.checkin, messages: next.messages, activites: next.activites, amis: next.amis }, { onConflict: "user_id" }).then(() => {});
      }
      return next;
    });
  }, [user]);

  const setPrivacy = useCallback((partial: Partial<PrivacySettings>) => {
    setPrivacyState((prev) => {
      const next = { ...prev, ...partial };
      if (user) {
        supabase.from("privacy_prefs").upsert({ user_id: user.id, profil_public: next.profilPublic, show_mood: next.showMood, share_location: next.shareLocation }, { onConflict: "user_id" }).then(() => {});
      }
      return next;
    });
  }, [user]);

  const setTheme = useCallback((t: string) => {
    setThemeState(t);
    if (user) {
      supabase.from("user_settings").upsert({ user_id: user.id, theme: t }, { onConflict: "user_id" }).then(() => {});
    }
  }, [user]);

  const streak = calculateStreak(moodHistory);

  const value: MindCareState = {
    user, authLoading, signOut,
    ai, setAI,
    profile, setProfile,
    moodHistory, saveMood, todayMood,
    messages, addMessage,
    activities, addActivity, joinActivity,
    friends, friendRequests, acceptRequest, declineRequest,
    notifications, setNotifications,
    privacy, setPrivacy,
    theme, setTheme,
    streak,
  };

  return <MindCareContext.Provider value={value}>{children}</MindCareContext.Provider>;
}

export function useMindCare(): MindCareState {
  const context = useContext(MindCareContext);
  if (!context) throw new Error("useMindCare must be used within a MindCareProvider");
  return context;
}
