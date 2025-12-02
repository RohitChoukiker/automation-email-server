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

const MOCK: DashboardMetrics = {
  volume: [
    { date: "Nov 20", count: 12 },
    { date: "Nov 21", count: 18 },
    { date: "Nov 22", count: 9 },
    { date: "Nov 23", count: 22 },
    { date: "Nov 24", count: 16 },
    { date: "Nov 25", count: 28 },
    { date: "Nov 26", count: 20 },
  ],
  categories: [
    { name: "Meeting", value: 24 },
    { name: "Sales", value: 18 },
    { name: "Investor", value: 6 },
    { name: "Followup", value: 10 },
    { name: "Other", value: 12 },
  ],
  urgency: [
    { label: "Urgent", value: 9 },
    { label: "High", value: 18 },
    { label: "Normal", value: 42 },
    { label: "Low", value: 16 },
  ],
  inboxHealthScore: 76,
};

const COLORS = ["#10B981", "#06B6D4", "#F59E0B", "#EF4444", "#6366F1"];

export const DashboardCharts: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>(MOCK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try fetching real metrics from your backend. If it fails, fallback to MOCK.
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/dashboard/metrics");
        if (!res.ok) throw new Error("No metrics");
        const data = await res.json();
        // Expect the shape to match DashboardMetrics; you may need to adapt
        setMetrics(data);
      } catch (err) {
        // keep MOCK
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Left: big line chart + inbox health */}
      <div className="col-span-1 lg:col-span-2 space-y-6">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">Email Volume (last 7 days)</h3>
            <div className="text-xs text-gray-400">{loading ? "Loading…" : "Updated recently"}</div>
          </div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={metrics.volume}>
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
                {metrics.volume.reduce((s, p) => s + p.count, 0)}
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-gray-500">Avg / day</div>
              <div className="text-lg font-semibold text-slate-800">
                {Math.round(metrics.volume.reduce((s, p) => s + p.count, 0) / metrics.volume.length)}
              </div>
            </div>

            <div className="ml-auto rounded-lg bg-slate-50 p-3 text-right">
              <div className="text-xs text-gray-500">Inbox Health</div>
              <div className="text-lg font-semibold text-slate-800">{metrics.inboxHealthScore}%</div>
            </div>
          </div>
        </div>

        {/* Bottom: urgent bar chart */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Urgency Breakdown</h3>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <BarChart data={metrics.urgency}>
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
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={metrics.categories}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={3}
                  labelLine={false}
                >
                  {metrics.categories.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
            {metrics.categories.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded" style={{ background: COLORS[i % COLORS.length] }} />
                <span>{c.name}</span>
                <span className="ml-auto font-medium text-slate-800">{c.value}</span>
              </div>
            ))}
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
                  Math.round(metrics.volume.reduce((s, p) => s + p.count, 0) * 0.32)
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
              <div className="text-lg font-semibold text-slate-800">{metrics.inboxHealthScore}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
