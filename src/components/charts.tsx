import { EMOTION_COLOR, EMOTION_SCORE, type Emotion, type EmotionLog } from "@/lib/mock-data";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

function dayKey(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function aggregateDailyEmotion(logs: EmotionLog[], days: number) {
  const buckets = new Map<string, { sum: number; count: number; date: Date }>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    buckets.set(dayKey(d.toISOString()), { sum: 0, count: 0, date: d });
  }
  logs.forEach((l) => {
    const k = dayKey(l.loggedAt);
    if (!buckets.has(k)) return;
    const score = EMOTION_SCORE[l.primaryEmotion];
    if (!score) return;
    const b = buckets.get(k)!;
    b.sum += score;
    b.count += 1;
  });
  return [...buckets.entries()].map(([day, b]) => ({
    day,
    value: b.count ? Number((b.sum / b.count).toFixed(2)) : null,
    date: b.date.toISOString(),
  }));
}

export function EmotionTimelineChart({
  logs,
  days,
  crisisDays = [],
  height = 240,
}: {
  logs: EmotionLog[];
  days: number;
  crisisDays?: string[]; // day keys (M/D)
  height?: number;
}) {
  const data = aggregateDailyEmotion(logs, days);
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(v) => ["", "😢", "😕", "😐", "🙂", "😄"][v] ?? ""}
            tick={{ fontSize: 14 }}
            width={32}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 }}
            formatter={(v: any) => [v == null ? "기록 없음" : v, "평균"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "var(--color-primary)" }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          {data.map((d) =>
            crisisDays.includes(d.day) ? (
              <ReferenceDot key={d.day} x={d.day} y={d.value ?? 3} r={6} fill="var(--alert-3)" stroke="none" />
            ) : null,
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EmotionDistributionDonut({ logs, height = 220 }: { logs: EmotionLog[]; height?: number }) {
  const buckets: Record<Emotion, number> = {
    very_sad: 0, sad: 0, neutral: 0, happy: 0, very_happy: 0, unknown: 0,
  };
  logs.forEach((l) => { buckets[l.primaryEmotion] = (buckets[l.primaryEmotion] ?? 0) + 1; });
  const data = (["very_sad", "sad", "neutral", "happy", "very_happy"] as Emotion[]).map((e) => ({
    name: e,
    value: buckets[e],
    color: EMOTION_COLOR[e],
  }));
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <div className="relative" style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 }}
            formatter={(v: any, _n: any, p: any) => [v, ({ very_sad: "많이 슬퍼요", sad: "조금 슬퍼요", neutral: "보통", happy: "기뻐요", very_happy: "아주 기뻐요" } as any)[p.payload.name]]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold">{total}</div>
        <div className="text-[10px] text-muted-foreground">감정 기록</div>
      </div>
    </div>
  );
}

export function CategoryBarChart({ data, height = 200 }: { data: { name: string; value: number; color?: string }[]; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color ?? "var(--color-primary)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniSparkline({ values }: { values: number[] }) {
  const data = values.map((v, i) => ({ i, v }));
  return (
    <div style={{ width: "100%", height: 40 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
