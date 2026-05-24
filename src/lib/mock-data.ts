// Mock dataset for URNOTALONE Stage 1 (backendless demo).
// Seed two children (수민, 준호), one teacher class (23명), and 14 days of activity.

export type Role = "parent" | "teacher";

export type Emotion = "very_sad" | "sad" | "neutral" | "happy" | "very_happy" | "unknown";

export const EMOTION_LABEL: Record<Emotion, string> = {
  very_sad: "많이 슬퍼요",
  sad: "조금 슬퍼요",
  neutral: "그저 그래요",
  happy: "기뻐요",
  very_happy: "아주 기뻐요",
  unknown: "표현 없음",
};

export const EMOTION_EMOJI: Record<Emotion, string> = {
  very_sad: "😢",
  sad: "😕",
  neutral: "😐",
  happy: "🙂",
  very_happy: "😄",
  unknown: "·",
};

export const EMOTION_COLOR: Record<Emotion, string> = {
  very_sad: "var(--color-emo-vsad)",
  sad: "var(--color-emo-sad)",
  neutral: "var(--color-emo-neutral)",
  happy: "var(--color-emo-happy)",
  very_happy: "var(--color-emo-vhappy)",
  unknown: "var(--color-muted-foreground)",
};

export const EMOTION_SCORE: Record<Emotion, number> = {
  very_sad: 1,
  sad: 2,
  neutral: 3,
  happy: 4,
  very_happy: 5,
  unknown: 0,
};

export type ActivityType =
  | "role_play"
  | "emotion_logging"
  | "cognitive_restructuring"
  | "daily_reflection"
  | "gratitude_journal"
  | "calm_mode"
  | "mood_check";

export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  role_play: "역할극",
  emotion_logging: "감정 기록",
  cognitive_restructuring: "인지 재구성",
  daily_reflection: "하루 돌아보기",
  gratitude_journal: "감사 일기",
  calm_mode: "차분 모드",
  mood_check: "오늘 기분",
};

export type AlertCategory = "bullying" | "verbal_violence" | "self_harm" | "abuse_neglect";

export const ALERT_CATEGORY_LABEL: Record<AlertCategory, string> = {
  bullying: "친구 관계의 어려움",
  verbal_violence: "언어적 상처",
  self_harm: "자기 자신을 향한 마음",
  abuse_neglect: "가정에서의 어려움",
};

export interface Child {
  id: string;
  name: string;
  gradeLevel: number;
  birthDate: string;
  parentNickname: string;
  friendsMentioned: string[];
  isAnonymous: boolean;
  anonymousCode?: string;
  classId?: string;
}

export interface EmotionLog {
  id: string;
  childId: string;
  loggedAt: string; // ISO
  activityType: ActivityType;
  primaryEmotion: Emotion;
  emotionWords: string[];
  category?: string;
  completed: boolean;
  durationSeconds: number;
}

export interface CrisisAlert {
  id: string;
  childId: string;
  detectedAt: string;
  severity: 1 | 2 | 3;
  category: AlertCategory;
  alertMessage: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  note?: string;
}

export interface WeeklyCoachingCard {
  id: string;
  childId: string;
  weekStart: string;
  weekEnd: string;
  headline: string;
  insight: string;
  coaching: string;
  suggestedActivity: string;
}

export interface GrowthMilestone {
  id: string;
  childId: string;
  type: string;
  label: string;
  achievedAt: string;
}

export interface ClassRoom {
  id: string;
  schoolName: string;
  gradeLevel: number;
  classNumber: number;
  schoolYear: number;
  studentIds: string[];
}

export interface RolePlayCard {
  id: string;
  category: "peer" | "academic" | "family" | "self_expression" | "custom";
  title: string;
  description: string;
  role: "friend" | "teacher" | "parent" | "stranger";
  ageGroup: "lower" | "upper" | "all";
  scope: "global" | "class";
  classId?: string;
  createdAt: string;
}

export interface TeacherNote {
  id: string;
  childId: string;
  note: string;
  createdAt: string;
}

export interface FollowUpAction {
  id: string;
  alertId: string;
  actionType: "contacted_parent" | "referred_counselor" | "talked_to_child" | "external_referral" | "other";
  note: string;
  recordedAt: string;
}

export interface NotificationLog {
  id: string;
  channel: "email" | "push" | "in_app";
  type: "crisis_alert" | "weekly_report" | "daily_summary" | "system";
  subject: string;
  body: string;
  sentAt: string;
  status: "sent" | "delivered";
}

// ---------- Seed builders ----------

const TODAY = new Date();
TODAY.setHours(20, 0, 0, 0);

function daysAgo(d: number, hour = 19, minute = 0) {
  const t = new Date(TODAY);
  t.setDate(TODAY.getDate() - d);
  t.setHours(hour, minute, 0, 0);
  return t.toISOString();
}

function uid(prefix: string, i: number | string) {
  return `${prefix}_${i}`;
}

// Two kids
export const SEED_CHILDREN: Child[] = [
  {
    id: "child_sumin",
    name: "수민",
    gradeLevel: 4,
    birthDate: "2017-03-12",
    parentNickname: "엄마",
    friendsMentioned: ["민지", "서연", "지호"],
    isAnonymous: false,
    classId: "class_a",
  },
  {
    id: "child_junho",
    name: "준호",
    gradeLevel: 2,
    birthDate: "2019-08-04",
    parentNickname: "아빠",
    friendsMentioned: ["민준"],
    isAnonymous: false,
  },
];

// 수민 emotion arc — neutral → sad → very_sad (Day 7 시나리오)
const SUMIN_ARC: Emotion[] = [
  "happy", "happy", "neutral", "neutral", "sad", "sad", "very_sad",
  "very_sad", "sad", "sad", "neutral", "neutral", "happy", "neutral",
];
const JUNHO_ARC: Emotion[] = [
  "happy", "very_happy", "happy", "happy", "neutral", "happy", "happy",
  "very_happy", "happy", "neutral", "happy", "happy", "very_happy", "happy",
];

const ACTIVITY_ROTATION: ActivityType[] = [
  "mood_check",
  "gratitude_journal",
  "role_play",
  "emotion_logging",
  "daily_reflection",
  "cognitive_restructuring",
  "calm_mode",
];

function buildLogs(childId: string, arc: Emotion[]): EmotionLog[] {
  const logs: EmotionLog[] = [];
  arc.forEach((emotion, idx) => {
    const dayIndex = arc.length - 1 - idx; // 0 = today
    // 1~3 activities per day
    const count = 1 + (idx % 3);
    for (let k = 0; k < count; k++) {
      const activity = ACTIVITY_ROTATION[(idx + k) % ACTIVITY_ROTATION.length];
      logs.push({
        id: uid(`log_${childId}`, `${idx}_${k}`),
        childId,
        loggedAt: daysAgo(dayIndex, 16 + k, 10),
        activityType: activity,
        primaryEmotion: emotion,
        emotionWords:
          emotion === "very_sad"
            ? ["외로워", "속상해"]
            : emotion === "sad"
              ? ["서운해"]
              : emotion === "happy"
                ? ["뿌듯해"]
                : emotion === "very_happy"
                  ? ["신나"]
                  : ["그저그래"],
        category: activity === "role_play" ? "또래" : undefined,
        completed: true,
        durationSeconds: 180 + k * 60,
      });
    }
  });
  return logs;
}

export const SEED_EMOTION_LOGS: EmotionLog[] = [
  ...buildLogs("child_sumin", SUMIN_ARC),
  ...buildLogs("child_junho", JUNHO_ARC),
];

export const SEED_ALERTS: CrisisAlert[] = [
  {
    id: "alert_1",
    childId: "child_sumin",
    detectedAt: daysAgo(0, 19, 32),
    severity: 2,
    category: "bullying",
    alertMessage:
      "오늘 수민이가 도리와의 대화에서 친구 관계의 어려움을 표현했어요. 오늘 저녁 자연스럽게 이야기 나눠 주세요.",
  },
  {
    id: "alert_2",
    childId: "child_sumin",
    detectedAt: daysAgo(3, 17, 12),
    severity: 2,
    category: "verbal_violence",
    alertMessage: "수민이가 누군가의 말로 마음이 상한 신호를 보였어요. 차분히 들어주세요.",
    acknowledgedBy: "parent_demo",
    acknowledgedAt: daysAgo(3, 21, 0),
    note: "저녁에 짧게 대화함. 학교에서 친구와 다툼이 있었던 듯.",
  },
];

export const SEED_COACHING: WeeklyCoachingCard[] = [
  {
    id: "coach_w0",
    childId: "child_sumin",
    weekStart: daysAgo(6, 0, 0).slice(0, 10),
    weekEnd: daysAgo(0, 23, 59).slice(0, 10),
    headline: "이번 주는 친구 관계가 어려웠던 한 주였어요",
    insight: "감정 단어가 '외로움 → 슬픔 → 분노' 순으로 변화했어요. 친구 관계에서 작은 균열이 있었던 신호예요.",
    coaching:
      "평가하지 말고 들어주세요. ‘왜 그랬어?’ 대신 ‘그랬구나, 많이 속상했겠다’로 시작하면 마음을 더 잘 보여줄 수 있어요.",
    suggestedActivity: "다음 주 등교 전, 짧은 응원 한마디를 건네보세요. ‘오늘도 네 편이야’ 한 줄이면 충분해요.",
  },
  {
    id: "coach_w1",
    childId: "child_sumin",
    weekStart: daysAgo(13, 0, 0).slice(0, 10),
    weekEnd: daysAgo(7, 23, 59).slice(0, 10),
    headline: "감정 단어가 3개 늘었어요",
    insight: "수민이는 ‘뿌듯해, 서운해, 외로워’를 새로 표현했어요.",
    coaching: "아이가 새 단어를 쓸 때 ‘그 말 처음 들어봐, 어떤 느낌이야?’로 확장해보세요.",
    suggestedActivity: "잠들기 전 ‘오늘의 한 단어’를 한 번씩 나눠보기.",
  },
];

export const SEED_MILESTONES: GrowthMilestone[] = [
  { id: "m1", childId: "child_sumin", type: "vocabulary_30", label: "감정 단어 30개 돌파", achievedAt: daysAgo(2) },
  { id: "m2", childId: "child_sumin", type: "gratitude_streak_7", label: "감사 일기 7일 연속", achievedAt: daysAgo(5) },
  { id: "m3", childId: "child_sumin", type: "first_role_play", label: "첫 역할극 완료", achievedAt: daysAgo(11) },
];

// Teacher class — 23 students; first one is 수민 (linked).
const STUDENT_NAMES = [
  "수민", "민지", "서연", "지호", "예린", "도윤", "하준", "시우", "유나", "윤서",
  "은우", "지유", "채원", "수아", "주원", "준우", "지안", "다온", "재이", "하린",
  "예준", "리아", "건우",
];

function buildClassStudents(): Child[] {
  return STUDENT_NAMES.map((name, i) => {
    if (i === 0) return SEED_CHILDREN[0]; // 수민 link
    const consent = i % 5 !== 0;
    return {
      id: `cls_child_${i}`,
      name,
      gradeLevel: 4,
      birthDate: "2017-05-01",
      parentNickname: "보호자",
      friendsMentioned: [],
      isAnonymous: !consent,
      anonymousCode: !consent ? `학생${String.fromCharCode(65 + i)}` : undefined,
      classId: "class_a",
    } satisfies Child;
  });
}

export const SEED_CLASS_STUDENTS: Child[] = buildClassStudents();

export const SEED_CLASS: ClassRoom = {
  id: "class_a",
  schoolName: "햇살초등학교",
  gradeLevel: 4,
  classNumber: 2,
  schoolYear: 2026,
  studentIds: SEED_CLASS_STUDENTS.map((s) => s.id),
};

// Build today's mood for each student
function buildClassLogs(): EmotionLog[] {
  const pool: Emotion[] = ["happy", "neutral", "happy", "very_happy", "neutral", "sad", "happy"];
  const logs: EmotionLog[] = [];
  SEED_CLASS_STUDENTS.forEach((s, i) => {
    if (s.id === "child_sumin") return; // already covered
    for (let d = 0; d < 7; d++) {
      logs.push({
        id: `cls_log_${i}_${d}`,
        childId: s.id,
        loggedAt: daysAgo(d, 14, 30),
        activityType: ACTIVITY_ROTATION[(i + d) % ACTIVITY_ROTATION.length],
        primaryEmotion: pool[(i + d) % pool.length],
        emotionWords: [],
        completed: d % 4 !== 0,
        durationSeconds: 120,
      });
    }
  });
  return logs;
}

export const SEED_CLASS_LOGS: EmotionLog[] = buildClassLogs();

export const SEED_CLASS_ALERTS: CrisisAlert[] = [
  {
    id: "cls_alert_1",
    childId: "cls_child_4", // 예린
    detectedAt: daysAgo(0, 11, 12),
    severity: 2,
    category: "bullying",
    alertMessage: "예린이가 또래 관계의 어려움을 표현했어요.",
  },
  {
    id: "cls_alert_2",
    childId: "child_sumin",
    detectedAt: daysAgo(3, 13, 5),
    severity: 2,
    category: "bullying",
    alertMessage: "수민이가 친구 관계의 어려움을 표현했어요.",
  },
  {
    id: "cls_alert_3",
    childId: "cls_child_9", // 윤서
    detectedAt: daysAgo(1, 9, 40),
    severity: 1,
    category: "verbal_violence",
    alertMessage: "윤서가 평소와 다른 정서 표현을 보였어요.",
  },
];

export const SEED_ROLEPLAY_CARDS: RolePlayCard[] = [
  {
    id: "rp_1",
    category: "peer",
    title: "친구가 놀이에 끼워주지 않을 때",
    description: "쉬는 시간 놀이에서 빠지게 되었을 때 어떻게 마음을 표현할지 연습해요.",
    role: "friend",
    ageGroup: "lower",
    scope: "global",
    createdAt: daysAgo(30),
  },
  {
    id: "rp_2",
    category: "academic",
    title: "시험을 잘 못 봤을 때",
    description: "내 마음을 누구에게 어떻게 이야기할 수 있을지 연습해요.",
    role: "parent",
    ageGroup: "all",
    scope: "global",
    createdAt: daysAgo(30),
  },
  {
    id: "rp_3",
    category: "family",
    title: "부모님이 바쁘실 때",
    description: "혼자라고 느끼는 시간을 어떻게 보낼 수 있는지 이야기 나눠요.",
    role: "parent",
    ageGroup: "all",
    scope: "global",
    createdAt: daysAgo(30),
  },
  {
    id: "rp_4",
    category: "self_expression",
    title: "나의 새로운 점 말하기",
    description: "내가 좋아하게 된 새로운 것을 도리에게 소개해요.",
    role: "friend",
    ageGroup: "upper",
    scope: "global",
    createdAt: daysAgo(30),
  },
];

export const SEED_NOTIFICATIONS: NotificationLog[] = [
  {
    id: "n1",
    channel: "email",
    type: "crisis_alert",
    subject: "수민이의 마음 신호 알림",
    body: "오늘 수민이가 도리와의 대화에서 친구 관계의 어려움을 표현했어요.",
    sentAt: daysAgo(0, 19, 33),
    status: "delivered",
  },
  {
    id: "n2",
    channel: "email",
    type: "weekly_report",
    subject: "수민이의 이번 주 마음 리포트",
    body: "이번 주는 친구 관계가 어려웠던 한 주였어요. 주간 코칭 카드를 확인해 주세요.",
    sentAt: daysAgo(6, 9, 0),
    status: "sent",
  },
];
