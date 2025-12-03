// components/DashboardCharts.tsx
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type VolumePoint = { date: string; count: number };
type CategorySlice = { name: string; value: number };
type UrgencyPoint = { label: string; value: number };

export type DashboardMetrics = {
  volume: VolumePoint[];
  categories: CategorySlice[];
  urgency: UrgencyPoint[];
  inboxHealthScore: number; // 0-100
};

const COLORS = ["#10B981", "#06B6D4", "#F59E0B", "#EF4444", "#6366F1"];

// Mock metrics used when backend metrics are not available.
const MOCK_METRICS: DashboardMetrics = {
  volume: [
    { date: "Mon", count: 42 },
    { date: "Tue", count: 56 },
    { date: "Wed", count: 49 },
    { date: "Thu", count: 61 },
    { date: "Fri", count: 58 },
    { date: "Sat", count: 34 },
    { date: "Sun", count: 47 },
  ],
  categories: [
    { name: "Support", value: 94 },
    { name: "Sales", value: 68 },
    { name: "Billing", value: 36 },
    { name: "Spam", value: 12 },
  ],
  urgency: [
    { label: "High", value: 18 },
    { label: "Medium", value: 62 },
    { label: "Low", value: 120 },
  ],
  inboxHealthScore: 78,
};
// Try to normalize various possible API response shapes into `DashboardMetrics`.
const normalizeMetrics = (raw: any): DashboardMetrics | null => {
  if (!raw) return null;

  // Unwrap common wrappers
  const payload = raw.data ?? raw.metrics ?? raw;

  const normalizeVolume = (v: any): VolumePoint[] => {
    if (!v) return [];
    if (Array.isArray(v)) {
      return v.map((p: any) => ({ date: String(p.date ?? p.day ?? p.label ?? ""), count: Number(p.count ?? p.value ?? 0) }));
    }
    if (typeof v === "object") {
      return Object.entries(v).map(([date, count]) => ({ date, count: Number(count) }));
    }
    return [];
  };

  const normalizeCategories = (c: any): CategorySlice[] => {
    if (!c) return [];
    if (Array.isArray(c)) {
      return c.map((it: any) => ({ name: String(it.name ?? it.category ?? it.label ?? it._id ?? "Unknown"), value: Number(it.value ?? it.count ?? 0) }));
    }
    if (typeof c === "object") {
      return Object.entries(c).map(([name, value]) => ({ name, value: Number(value) }));
    }
    return [];
  };

  const normalizeUrgency = (u: any): UrgencyPoint[] => {
    if (!u) return [];
    if (Array.isArray(u)) {
      return u.map((it: any) => ({ label: String(it.label ?? it.name ?? it.priority ?? it._id ?? ""), value: Number(it.value ?? it.count ?? 0) }));
    }
    if (typeof u === "object") {
      return Object.entries(u).map(([label, value]) => ({ label, value: Number(value) }));
    }
    return [];
  };

  const volume = normalizeVolume(payload.volume ?? payload.vol ?? payload.daily ?? payload.dataPoints);
  const categories = normalizeCategories(payload.categories ?? payload.cat ?? payload.categoryMap);
  const urgency = normalizeUrgency(payload.urgency ?? payload.urg ?? payload.priority);
  const inboxHealthScore = Number(payload.inboxHealthScore ?? payload.healthScore ?? payload.inbox_score ?? 0) || 0;

  // If we don't at least have volume data, consider the response invalid
  if (!volume || volume.length === 0) return null;

  return { volume, categories, urgency, inboxHealthScore };
};
export const DashboardCharts: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    // Try fetching real metrics from your backend. If it fails, fallback to MOCK.
    const fetchMetrics = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers: Record<string, string> = { Accept: "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch("/api/dashboard/metrics", {
          method: "GET",
          credentials: "include",
          headers,
        });
        if (res.status === 401 || res.status === 403) {
          setAuthRequired(true);
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error(`No metrics (status ${res.status})`);
        const data = await res.json();
        console.log("Fetched dashboard metrics:", data);
        // Normalize API response into DashboardMetrics where possible
        const parsed = normalizeMetrics(data);
        if (parsed) {
          setMetrics(parsed);
        } else {
          console.warn("Unexpected metrics shape from API:", data);
          setMetrics(null);
        }
      } catch (err) {
        // Preserve previous behavior for auth errors, but do not fall back to
        // mock data. If the fetch fails for any other reason, surface the
        // error (metrics remain null) so the UI accurately reflects that the
        // backend data could not be loaded.
        if (err instanceof Error && (err.message === "Failed to fetch" || err.message.includes("401") || err.message.includes("403"))) {
          setAuthRequired(true);
          console.warn("Unable to load dashboard metrics (auth?).", err);
        } else {
          console.warn("Failed to fetch dashboard metrics.", err);
          setMetrics(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-1 lg:col-span-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm text-center">Loading metrics…</div>
        </div>
        <div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm text-center">Loading metrics…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Left: big line chart + inbox health */}
      <div className="col-span-1 lg:col-span-2 space-y-6">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">Email Volume (last 7 days)</h3>
            <div className="text-xs text-gray-400">{loading ? "Loading…" : "Updated recently"}</div>
          </div>
            <div style={{ width: "100%", height: 240, minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={(metrics && metrics.volume) || []}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-gray-500">Total (7d)</div>
              <div className="text-lg font-semibold text-slate-800">
                {metrics ? metrics.volume.reduce((s, p) => s + p.count, 0) : "—"}
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-gray-500">Avg / day</div>
                <div className="text-lg font-semibold text-slate-800">
                {metrics ? Math.round(metrics.volume.reduce((s, p) => s + p.count, 0) / Math.max(metrics.volume.length,1)) : "—"}
              </div>
            </div>

            <div className="ml-auto rounded-lg bg-slate-50 p-3 text-right">
              <div className="text-xs text-gray-500">Inbox Health</div>
              <div className="text-lg font-semibold text-slate-800">{metrics ? `${metrics.inboxHealthScore}%` : "—"}</div>
            </div>
          </div>
        </div>

        {/* Bottom: urgent bar chart */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Urgency Breakdown</h3>
          <div style={{ width: "100%", height: 180, minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(metrics && metrics.urgency) || []}>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FB923C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right column: donut + KPI cards */}
      <div className="space-y-6">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Category Distribution</h3>
          <div style={{ width: "100%", height: 220, minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                    data={(metrics && metrics.categories) || []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={3}
                  labelLine={false}
                >
                    {(metrics ? metrics.categories : []).map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
              {(metrics ? metrics.categories : []).map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded" style={{ background: COLORS[i % COLORS.length] }} />
                  <span>{c.name}</span>
                  <span className="ml-auto font-medium text-slate-800">{c.value}</span>
                </div>
              ))}
              {authRequired ? (
                <div className="col-span-2 text-center">
                  <div className="text-sm text-gray-700">Please sign in to view this data</div>
                  <a
                    href="/api/auth/google"
                    className="mt-2 inline-block rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white"
                  >
                    Sign in with Google
                  </a>
                </div>
              ) : (!metrics || metrics.categories.length === 0 ? (
                <div className="col-span-2 text-center text-sm text-gray-500">No category data available</div>
              ) : null)}
            </div>
        </div>

        {/* Small KPI */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Quick Insights</h3>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">AI Replies Suggested</div>
                <div className="text-lg font-semibold text-slate-800">{
                  // sample derived metric
                  metrics ? Math.round(metrics.volume.reduce((s, p) => s + p.count, 0) * 0.32) : "—"
                }</div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>Last 7 days</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Avg Response Time</div>
                <div className="text-lg font-semibold text-slate-800">2.4h</div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>Improved</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Noise reduced</div>
              <div className="text-lg font-semibold text-slate-800">{metrics ? `${metrics.inboxHealthScore}%` : "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
