/**
 * GuardrailsPage — Set Negotiation Guardrails
 * Exact replication of reference image
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BusinessLayout from "./BusinessLayout";

const CATEGORIES = ["Food", "Lifestyle", "Fashion", "Travel", "Tech", "Gaming"];
const STEPS = [
  { n: 1, label: "Budget" },
  { n: 2, label: "Quality" },
  { n: 3, label: "Categories" },
  { n: 4, label: "AI Settings" },
  { n: 5, label: "Review" },
];

export default function GuardrailsPage() {
  const navigate = useNavigate();
  const [activeStep] = useState(1);
  const [totalBudget, setTotalBudget] = useState("1,50,000");
  const [maxPerCreator, setMaxPerCreator] = useState("20,000");
  const [approvalThreshold, setApprovalThreshold] = useState("15,000");
  const [minScore, setMinScore] = useState(80);
  const [minAudience, setMinAudience] = useState(70);
  const [allowed, setAllowed] = useState(["Food", "Lifestyle"]);
  const [aiNegotiate, setAiNegotiate] = useState(true);

  const toggleCat = (cat: string) =>
    setAllowed((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  return (
    <BusinessLayout breadcrumb="Negotiation Guardrails">
      <style>{`
        .gr-slider { -webkit-appearance:none; appearance:none; height:4px; border-radius:4px; background: linear-gradient(to right, #FF6B35 0%, #FF6B35 var(--val), #e5e7eb var(--val), #e5e7eb 100%); outline:none; cursor:pointer; width:100%; }
        .gr-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:#FF6B35; border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.18); cursor:pointer; }
        .gr-toggle { position:relative; width:44px; height:24px; }
        .gr-toggle input { opacity:0; width:0; height:0; }
        .gr-toggle-slider { position:absolute; cursor:pointer; inset:0; background:#e5e7eb; border-radius:24px; transition:0.2s; }
        .gr-toggle-slider:before { position:absolute; content:""; height:18px; width:18px; left:3px; bottom:3px; background:white; border-radius:50%; transition:0.2s; }
        .gr-toggle input:checked + .gr-toggle-slider { background:#FF6B35; }
        .gr-toggle input:checked + .gr-toggle-slider:before { transform:translateX(20px); }
        .gr-num-input { display:flex; align-items:center; border:1.5px solid #e5e7eb; border-radius:8px; background:white; overflow:hidden; }
        .gr-num-input input { border:none; outline:none; font-family:inherit; font-size:15px; font-weight:600; color:#1a1a1a; background:transparent; padding:0 10px; height:44px; flex:1; min-width:0; }
        .gr-num-input input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        .gr-spin { display:flex; flex-direction:column; border-left:1px solid #e5e7eb; }
        .gr-spin button { flex:1; padding:0 8px; border:none; background:none; cursor:pointer; color:#6b7280; font-size:10px; line-height:1; }
        .gr-spin button:hover { background:#f9fafb; }
      `}</style>

      {/* Page Title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
          Set Negotiation Guardrails
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          Define the limits the AI must stay within. Every action beyond these limits requires your approval.
        </p>
      </div>

      {/* Main layout: step sidebar + content */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Step Sidebar */}
        <div style={{ width: 160, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {STEPS.map((step) => (
            <div
              key={step.n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 10,
                background: activeStep === step.n ? "#FFF5F0" : "transparent",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: activeStep === step.n ? "#FF6B35" : "#f3f4f6",
                  color: activeStep === step.n ? "white" : "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {step.n}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: activeStep === step.n ? 600 : 400,
                  color: activeStep === step.n ? "#FF6B35" : "#6b7280",
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── 1. Budget Controls ── */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFF5F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>💰</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Budget Controls</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>These limits can never be exceeded by the AI without your explicit approval.</div>
                </div>
              </div>
              {/* AI notice */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#FFF5F0", border: "1px solid #FFD4C1", borderRadius: 10, padding: "10px 14px", maxWidth: 220, flexShrink: 0 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🛡️</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#FF6B35", marginBottom: 2 }}>AI will stay within these limits</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>You'll be notified for anything above this.</div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              {[
                { label: "Total campaign budget", value: totalBudget, set: setTotalBudget, help: "Maximum authorized campaign spend" },
                { label: "Maximum price per creator", value: maxPerCreator, set: setMaxPerCreator, help: "AI will not agree above this per creator" },
                { label: "Manual approval threshold", value: approvalThreshold, set: setApprovalThreshold, help: "Deals above this always need your OK" },
              ].map((f) => (
                <div key={f.label}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                    {f.label}
                    <span style={{ width: 14, height: 14, borderRadius: "50%", border: "1px solid #9ca3af", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#9ca3af", cursor: "default" }}>i</span>
                  </div>
                  <div className="gr-num-input">
                    <span style={{ padding: "0 12px", color: "#6b7280", fontWeight: 600, fontSize: 16, borderRight: "1px solid #e5e7eb", height: 44, display: "flex", alignItems: "center" }}>₹</span>
                    <input
                      type="text"
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                    />
                    <div className="gr-spin">
                      <button onClick={() => {}}>▲</button>
                      <button onClick={() => {}}>▼</button>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>{f.help}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 2. Quality Thresholds ── */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFF5F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎯</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Quality Thresholds</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Minimum standards creators must meet to be considered.</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              {[
                { label: "Minimum creator score", val: minScore, set: setMinScore, suffix: "/ 100", help: "AI will not invite below this score" },
                { label: "Minimum audience match", val: minAudience, set: setMinAudience, suffix: "%", help: "Minimum geographic/demographic match" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 4 }}>
                      {s.label}
                      <span style={{ width: 14, height: 14, borderRadius: "50%", border: "1px solid #9ca3af", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#9ca3af" }}>i</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{s.val}</span>
                      <span style={{ fontSize: 13, color: "#6b7280" }}>{s.suffix}</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={s.val}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="gr-slider"
                    style={{ "--val": `${s.val}%` } as React.CSSProperties}
                  />
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{s.help}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. Allowed Categories ── */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFF5F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🏷️</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Allowed Categories</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Only creators in these categories will be considered.</div>
                </div>
              </div>
              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", width: 200 }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 18 18"><circle cx="8" cy="8" r="6" stroke="#9ca3af" strokeWidth="1.5"/><path d="M13 13l3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span style={{ fontSize: 13, color: "#9ca3af" }}>Search categories...</span>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {CATEGORIES.map((cat) => {
                const active = allowed.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCat(cat)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 18px",
                      borderRadius: 24,
                      border: active ? "1.5px solid #FF6B35" : "1.5px solid #e5e7eb",
                      background: active ? "#FFF5F0" : "white",
                      color: active ? "#FF6B35" : "#374151",
                      fontSize: 14,
                      fontWeight: active ? 600 : 400,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {active && <span style={{ fontSize: 12 }}>✓</span>}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 4. AI Negotiation ── */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F3F0FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>AI Negotiation</div>
                  <div style={{ fontSize: 13, color: "#FF6B35" }}>Control how the AI handles creator counteroffers within your guardrails.</div>
                </div>
              </div>
              {/* Toggle right */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexShrink: 0 }}>
                <label className="gr-toggle">
                  <input type="checkbox" checked={aiNegotiate} onChange={(e) => setAiNegotiate(e.target.checked)} />
                  <span className="gr-toggle-slider" />
                </label>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>Enable AI negotiation</div>
                  <div style={{ fontSize: 12, color: "#6b7280", maxWidth: 260 }}>AI will respond to counteroffers within your budget limits. Every action is logged and auditable.</div>
                </div>
              </div>
            </div>

            {aiNegotiate && (
              <div style={{ marginTop: 16, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#78350F", lineHeight: 1.6 }}>
                ⚠️ The AI will never exceed ₹{maxPerCreator} per creator or the ₹{totalBudget} total budget. Any deal above ₹{approvalThreshold} will be paused for your approval.
              </div>
            )}
          </div>

          {/* ── Guardrail Summary ── */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: "20px 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FFF5F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎯</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>Guardrail Summary</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 14 }}>A quick overview of your current limits.</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px" }}>
                  {[
                    { icon: "💰", label: "Total budget", value: `₹${totalBudget}` },
                    { icon: "👤", label: "Max per creator", value: `₹${maxPerCreator}` },
                    { icon: "📋", label: "Approval above", value: `₹${approvalThreshold}` },
                    { icon: "⭐", label: "Min creator score", value: `${minScore} / 100` },
                    { icon: "👥", label: "Min audience match", value: `${minAudience}%` },
                    { icon: "🏷️", label: "Allowed categories", value: allowed.join(", ") || "None" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600 }}>{item.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div style={{ display: "flex", gap: 12, paddingTop: 4, paddingBottom: 16 }}>
            <button
              onClick={() => navigate(-1)}
              style={{ padding: "12px 24px", background: "white", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}
            >
              ← Back
            </button>
            <button
              onClick={() => navigate("/business/campaigns/invitations")}
              style={{ flex: 1, padding: "12px 24px", background: "#1a1a1a", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "white", cursor: "pointer", fontFamily: "inherit" }}
            >
              Confirm & Send Invitations →
            </button>
          </div>

        </div>
      </div>
    </BusinessLayout>
  );
}