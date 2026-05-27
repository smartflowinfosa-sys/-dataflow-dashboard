import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  TrendingUp, TrendingDown, Upload, BarChart2, FileText,
  Users, DollarSign, Settings, Home, Database, Bell, Search,
  X, CheckCircle, Globe, FileSpreadsheet, Plus, Layers,
  Activity, Zap, ChevronRight, Download, Filter, Menu
} from "lucide-react";

// ─── Themes ──────────────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "ocean", name: "Ocean",
    bg: "#07101F", surface: "#0C1929", card: "#0F1E35", border: "#1A2E4A",
    accent: "#4B8FFF", accentBg: "rgba(75,143,255,0.1)",
    text: "#E2ECFF", muted: "#4A6285",
    chart: ["#4B8FFF", "#06D6A0", "#9B72F8", "#FFB830", "#FF6B6B"],
  },
  {
    id: "violet", name: "Violet",
    bg: "#0B0818", surface: "#130E25", card: "#1A1335", border: "#26204A",
    accent: "#A67CFF", accentBg: "rgba(166,124,255,0.1)",
    text: "#EDE8FF", muted: "#5A4E80",
    chart: ["#A67CFF", "#E879F9", "#60B8FF", "#34D399", "#FFB830"],
  },
  {
    id: "emerald", name: "Emerald",
    bg: "#070F0D", surface: "#0C1A16", card: "#10221C", border: "#183628",
    accent: "#2DD4BF", accentBg: "rgba(45,212,191,0.1)",
    text: "#CCFBF1", muted: "#2F5A52",
    chart: ["#2DD4BF", "#34D399", "#60B8FF", "#FFB830", "#FF6B6B"],
  },
  {
    id: "amber", name: "Amber",
    bg: "#100C03", surface: "#1A1306", card: "#231B08", border: "#3A2C0E",
    accent: "#FFB830", accentBg: "rgba(255,184,48,0.1)",
    text: "#FFF3D1", muted: "#6B5025",
    chart: ["#FFB830", "#FF8C42", "#FF6B6B", "#4B8FFF", "#2DD4BF"],
  },
  {
    id: "light", name: "Light",
    bg: "#EEF2F7", surface: "#FFFFFF", card: "#FFFFFF", border: "#DDE3ED",
    accent: "#4B8FFF", accentBg: "rgba(75,143,255,0.08)",
    text: "#0D1B2A", muted: "#647A95",
    chart: ["#4B8FFF", "#9B72F8", "#2DD4BF", "#FFB830", "#FF6B6B"],
    light: true,
  },
];

// ─── Demo Data ────────────────────────────────────────────────────────────────
const MONTHLY = [
  { m: "Jan", rev: 42, exp: 28 }, { m: "Feb", rev: 38, exp: 25 },
  { m: "Mar", rev: 55, exp: 31 }, { m: "Apr", rev: 61, exp: 34 },
  { m: "May", rev: 58, exp: 33 }, { m: "Jun", rev: 72, exp: 38 },
  { m: "Jul", rev: 68, exp: 36 }, { m: "Aug", rev: 81, exp: 42 },
  { m: "Sep", rev: 76, exp: 40 }, { m: "Oct", rev: 89, exp: 46 },
  { m: "Nov", rev: 94, exp: 48 }, { m: "Dec", rev: 108, exp: 55 },
];

const SEGMENTS = [
  { seg: "Enterprise", cur: 45, prev: 38 },
  { seg: "Startup", cur: 28, prev: 24 },
  { seg: "Agency", cur: 19, prev: 21 },
  { seg: "SMB", cur: 34, prev: 29 },
  { seg: "Gov", cur: 12, prev: 14 },
];

const CHANNELS = [
  { name: "Direct", val: 35 },
  { name: "Organic", val: 28 },
  { name: "Referral", val: 22 },
  { name: "Social", val: 15 },
];

const SOURCES = [
  { name: "Acme Corp", type: "Excel", records: "14,230", revenue: "$84K", trend: "+12%", up: true },
  { name: "TechFlow Inc", type: "Sheets", records: "8,450", revenue: "$62K", trend: "+8%", up: true },
  { name: "DataSync Co", type: "PDF", records: "22,100", revenue: "$48K", trend: "−3%", up: false },
  { name: "Nexus Group", type: "Word", records: "5,670", revenue: "$31K", trend: "+21%", up: true },
  { name: "CloudBase AI", type: "Sheets", records: "18,900", revenue: "$95K", trend: "+15%", up: true },
];

const NAV_ITEMS = [
  { id: "overview", label: "Overview", Icon: Home },
  { id: "analytics", label: "Analytics", Icon: Activity },
  { id: "reports", label: "Reports", Icon: FileText },
  { id: "sources", label: "Data Sources", Icon: Database },
  { id: "integrations", label: "Integrations", Icon: Zap },
  { id: "settings", label: "Settings", Icon: Settings },
];

const FILE_TYPES = [
  { type: "Excel", Icon: FileSpreadsheet, color: "#10B981", desc: ".xlsx · .xls" },
  { type: "Google Sheets", Icon: Globe, color: "#4B8FFF", desc: "Live sync" },
  { type: "PDF", Icon: FileText, color: "#EF4444", desc: ".pdf documents" },
  { type: "Word / Docs", Icon: FileText, color: "#3B82F6", desc: ".docx · .doc" },
];

const INTEGRATIONS = ["Zapier", "Make", "Salesforce", "HubSpot", "Notion", "Airtable", "Slack", "Webhooks"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function App() {
  const [themeIdx, setThemeIdx] = useState(0);
  const [nav, setNav] = useState("overview");
  const [showUpload, setShowUpload] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [drag, setDrag] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close sidebar on nav change (mobile)
  const handleNav = (id) => {
    setNav(id);
    if (isMobile) setShowSidebar(false);
  };

  const t = THEMES[themeIdx];
  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: 12 };
  const activeLabel = NAV_ITEMS.find((n) => n.id === nav)?.label || "Overview";

  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11 }}>
        <p style={{ color: t.muted, margin: "0 0 4px" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}: <strong style={{ color: t.text }}>{p.value}K</strong>
          </p>
        ))}
      </div>
    );
  };

  // ── Sidebar ──────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{
      width: 218, background: t.surface, borderRight: `1px solid ${t.border}`,
      display: "flex", flexDirection: "column", flexShrink: 0, height: "100%",
      position: isMobile ? "absolute" : "relative", zIndex: isMobile ? 200 : 1,
      left: isMobile ? (showSidebar ? 0 : -280) : 0,
      transition: "left 0.25s ease",
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Layers size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: t.text, letterSpacing: "-0.4px", lineHeight: 1.1 }}>DataFlow</div>
              <div style={{ fontSize: 9, color: t.muted, letterSpacing: "1px", fontWeight: 600 }}>ANALYTICS SUITE</div>
            </div>
          </div>
          {isMobile && (
            <button onClick={() => setShowSidebar(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <X size={16} color={t.muted} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "10px 10px", flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 9, color: t.muted, letterSpacing: "0.8px", fontWeight: 600, padding: "6px 8px 4px", textTransform: "uppercase" }}>Menu</div>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = nav === id;
          return (
            <button key={id} onClick={() => handleNav(id)} style={{
              display: "flex", alignItems: "center", gap: 9, width: "100%",
              padding: "9px 10px", marginBottom: 2,
              background: active ? t.accentBg : "transparent",
              color: active ? t.accent : t.muted,
              border: active ? `1px solid ${t.accent}35` : "1px solid transparent",
              borderRadius: 8, cursor: "pointer", textAlign: "left",
              fontSize: 13, fontWeight: active ? 700 : 400, transition: "all 0.15s",
            }}>
              <Icon size={15} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={11} />}
            </button>
          );
        })}
      </div>

      {/* Theme switcher */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 9, color: t.muted, letterSpacing: "0.8px", fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>Theme</div>
        <div style={{ display: "flex", gap: 7 }}>
          {THEMES.map((th, i) => (
            <button key={th.id} onClick={() => setThemeIdx(i)} title={th.name} style={{
              width: 22, height: 22, borderRadius: 6, background: th.accent, padding: 0, cursor: "pointer",
              border: themeIdx === i ? `2.5px solid ${t.text}` : "2.5px solid transparent",
              transition: "border 0.15s", outline: "none",
            }} />
          ))}
        </div>
      </div>

      {/* User */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>A</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Admin User</div>
          <div style={{ fontSize: 10, color: t.muted }}>Pro Plan · Active</div>
        </div>
        <Settings size={13} color={t.muted} style={{ flexShrink: 0, cursor: "pointer" }} />
      </div>
    </div>
  );

  // ── Dashboard Content ─────────────────────────────────────────────────────
  const DashboardContent = () => (
    <div style={{ flex: 1, overflow: "auto", padding: isMobile ? 12 : 18 }}>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, minmax(0, 1fr))", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Total Revenue", val: "$842K", change: "+18.2%", up: true, Icon: DollarSign },
          { label: "Active Users", val: "24,891", change: "+8.4%", up: true, Icon: Users },
          { label: "Data Sources", val: "142", change: "+23 new", up: true, Icon: Database },
          { label: "Auto Reports", val: "3,240", change: "−2.1%", up: false, Icon: BarChart2 },
        ].map(({ label, val, change, up, Icon }) => (
          <div key={label} style={{ ...card, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: t.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} color={t.accent} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 6px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: up ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: up ? "#10B981" : "#EF4444" }}>
                {up ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {change}
              </div>
            </div>
            <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: t.text, letterSpacing: "-0.6px", marginBottom: 2 }}>{val}</div>
            <div style={{ fontSize: 11, color: t.muted }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Area + Pie */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.8fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ ...card, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>Revenue Overview</div>
              <div style={{ fontSize: 10, color: t.muted, marginTop: 2 }}>Monthly revenue vs expenses · $K</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {["Revenue", "Expenses"].map((lbl, i) => (
                <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: t.muted }}>
                  <div style={{ width: 8, height: 2, borderRadius: 1, background: i === 0 ? t.accent : t.chart[2] }} />
                  {lbl}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={MONTHLY} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={t.accent} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={t.accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={t.chart[2]} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={t.chart[2]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
              <XAxis dataKey="m" tick={{ fill: t.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={renderTooltip} />
              <Area type="monotone" dataKey="rev" name="Revenue" stroke={t.accent} strokeWidth={2} fill="url(#g1)" />
              <Area type="monotone" dataKey="exp" name="Expenses" stroke={t.chart[2]} strokeWidth={1.5} strokeDasharray="4 2" fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...card, padding: 16, display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 2 }}>Traffic Channels</div>
          <div style={{ fontSize: 10, color: t.muted, marginBottom: 8 }}>Source distribution</div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={CHANNELS} cx="50%" cy="50%" innerRadius={38} outerRadius={56} paddingAngle={3} dataKey="val" strokeWidth={0}>
                {CHANNELS.map((_, i) => <Cell key={i} fill={t.chart[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 10px", marginTop: "auto" }}>
            {CHANNELS.map((ch, i) => (
              <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: t.chart[i], flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: t.muted, flex: 1 }}>{ch.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: t.text }}>{ch.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar + Table */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.6fr", gap: 12 }}>
        <div style={{ ...card, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 2 }}>By Segment</div>
          <div style={{ fontSize: 10, color: t.muted, marginBottom: 12 }}>Current vs previous period</div>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={SEGMENTS} margin={{ top: 0, right: 4, left: -26, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
              <XAxis dataKey="seg" tick={{ fill: t.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="cur" name="Current" fill={t.accent} radius={[4, 4, 0, 0]} maxBarSize={26} />
              <Bar dataKey="prev" name="Previous" fill={t.chart[1]} radius={[4, 4, 0, 0]} maxBarSize={26} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...card, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>Connected Sources</div>
              <div style={{ fontSize: 10, color: t.muted }}>Active data integrations</div>
            </div>
            <button onClick={() => { setShowUpload(true); setSelectedType(null); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: t.accentBg, color: t.accent, border: `1px solid ${t.accent}40`, borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
              <Plus size={10} /> Add Source
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 320 }}>
              <thead>
                <tr>
                  {["Source", "Type", "Records", "Revenue", "Trend"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0 6px 8px 0", color: t.muted, fontWeight: 600, fontSize: 10, borderBottom: `1px solid ${t.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px 6px 8px 0", fontWeight: 700, color: t.text, borderBottom: i < SOURCES.length - 1 ? `1px solid ${t.border}` : "none" }}>{row.name}</td>
                    <td style={{ padding: "8px 6px 8px 0", borderBottom: i < SOURCES.length - 1 ? `1px solid ${t.border}` : "none" }}>
                      <span style={{ padding: "2px 7px", borderRadius: 5, background: t.accentBg, color: t.accent, fontSize: 9, fontWeight: 700 }}>{row.type}</span>
                    </td>
                    <td style={{ padding: "8px 6px 8px 0", color: t.muted, borderBottom: i < SOURCES.length - 1 ? `1px solid ${t.border}` : "none" }}>{row.records}</td>
                    <td style={{ padding: "8px 6px 8px 0", fontWeight: 700, color: t.text, borderBottom: i < SOURCES.length - 1 ? `1px solid ${t.border}` : "none" }}>{row.revenue}</td>
                    <td style={{ padding: "8px 0", borderBottom: i < SOURCES.length - 1 ? `1px solid ${t.border}` : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: row.up ? "#10B981" : "#EF4444" }}>
                        {row.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {row.trend}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Import Modal ──────────────────────────────────────────────────────────
  const UploadModal = () => (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}>
      <div style={{ ...card, width: "100%", maxWidth: 480, padding: 22, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: t.text, letterSpacing: "-0.4px" }}>Import Data</div>
            <div style={{ fontSize: 11, color: t.muted, marginTop: 3 }}>Excel, Sheets, PDF, Word & integrations</div>
          </div>
          <button onClick={() => setShowUpload(false)} style={{ width: 30, height: 30, borderRadius: 8, background: t.surface, border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} color={t.muted} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {FILE_TYPES.map(({ type, Icon, color, desc }) => (
            <button key={type} onClick={() => setSelectedType(selectedType === type ? null : type)} style={{
              padding: 13, textAlign: "left", cursor: "pointer",
              background: selectedType === type ? `${color}15` : t.surface,
              border: `1px solid ${selectedType === type ? color : t.border}`,
              borderRadius: 10, transition: "all 0.15s", outline: "none",
            }}>
              <Icon size={18} color={color} style={{ marginBottom: 8, display: "block" }} />
              <div style={{ fontWeight: 700, fontSize: 12, color: t.text, marginBottom: 2 }}>{type}</div>
              <div style={{ fontSize: 10, color: t.muted }}>{desc}</div>
            </button>
          ))}
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); }}
          style={{ border: `2px dashed ${drag ? t.accent : t.border}`, borderRadius: 10, padding: "20px 16px", textAlign: "center", background: drag ? t.accentBg : "transparent", transition: "all 0.2s", cursor: "pointer", marginBottom: 14 }}
        >
          <Upload size={20} color={t.accent} style={{ margin: "0 auto 8px", display: "block" }} />
          <div style={{ fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 4 }}>Drop files here</div>
          <div style={{ fontSize: 11, color: t.muted }}>or <span style={{ color: t.accent, fontWeight: 600 }}>browse files</span> · Max 50MB</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: t.muted, letterSpacing: "0.8px", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Or connect via integration</div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {INTEGRATIONS.map(name => (
              <button key={name} style={{ padding: "5px 11px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 7, cursor: "pointer", fontSize: 11, color: t.muted, fontWeight: 500 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.muted; }}
              >{name}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowUpload(false)} style={{ flex: 1, padding: "9px", background: "transparent", color: t.muted, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Cancel</button>
          <button style={{ flex: 2, padding: "9px", background: t.accent, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <CheckCircle size={13} /> Connect &amp; Import
          </button>
        </div>
      </div>
    </div>
  );

  // ── Main Render ───────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100%", background: t.bg, color: t.text, overflow: "hidden", position: "relative", fontSize: 13 }}>

      {/* Mobile sidebar overlay */}
      {isMobile && showSidebar && (
        <div onClick={() => setShowSidebar(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 150 }} />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Header */}
        <div style={{ padding: isMobile ? "10px 14px" : "12px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10, background: t.surface, flexShrink: 0 }}>
          {isMobile && (
            <button onClick={() => setShowSidebar(true)} style={{ width: 32, height: 32, borderRadius: 8, background: t.card, border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Menu size={14} color={t.muted} />
            </button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: isMobile ? 14 : 15, color: t.text, letterSpacing: "-0.3px" }}>{activeLabel}</div>
            <div style={{ fontSize: 10, color: t.muted, marginTop: 1 }}>Updated just now · 2024</div>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 12px", flex: "0 0 160px" }}>
              <Search size={12} color={t.muted} />
              <span style={{ fontSize: 11, color: t.muted }}>Search data...</span>
            </div>
          )}
          <button style={{ width: 32, height: 32, borderRadius: 8, background: t.card, border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Bell size={13} color={t.muted} />
          </button>
          <button onClick={() => { setShowUpload(true); setSelectedType(null); }} style={{ display: "flex", alignItems: "center", gap: isMobile ? 0 : 7, padding: isMobile ? "7px 10px" : "7px 15px", background: t.accent, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            <Upload size={13} />
            {!isMobile && " Import"}
          </button>
        </div>

        {/* Content */}
        <DashboardContent />
      </div>

      {/* Import Modal */}
      {showUpload && <UploadModal />}
    </div>
  );
}
