import { useState, useEffect, useRef, useCallback } from "react";

const G = {
  deep: "#0b1120", panel: "#111827", card: "#151f2e", cardAlt: "#1a2537",
  glass: "rgba(255,255,255,0.03)",
  mint: "#23c55e", mintDim: "rgba(35,197,94,0.13)", mintGlow: "rgba(35,197,94,0.3)",
  lavender: "#a78bfa", coral: "#f87171", gold: "#fbbf24", sky: "#38bdf8",
  text: "#e8f0fe", textSub: "#6b82a8", textMuted: "#334155",
  edge: "rgba(255,255,255,0.07)", edgeMint: "rgba(35,197,94,0.22)",
  wBg: "#ffffff", wBg2: "#f8fafc", wBorder: "rgba(0,0,0,0.08)",
  wText: "#111827", wTextSub: "#6b7280", wTextMuted: "#9ca3af",
  wEdge: "rgba(0,0,0,0.07)",
  wMint: "#23c55e", wCoral: "#ef4444",
};
const FONT = "'Plus Jakarta Sans', sans-serif";
const D = "#151f2e";
const DB = "rgba(255,255,255,0.07)";

if (typeof document !== "undefined") {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap";
  link.rel = "stylesheet";
  if (!document.querySelector("[href*='Plus+Jakarta']")) document.head.appendChild(link);
  const style = document.createElement("style");
  style.setAttribute("data-dash2", "1");
  style.textContent = `
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    @keyframes fade-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(0.8)}}
    @keyframes count-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slide-in-num{from{opacity:0;transform:translateY(8px) scale(0.9)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes modal-in{from{opacity:0;transform:scale(0.96) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .card-lift{transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s}
    .card-lift:hover{transform:translateY(-4px);box-shadow:0 24px 64px rgba(0,0,0,0.45)!important}
    .card-h{transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s}
    .card-h:hover{transform:translateY(-3px)}
    .skill-tag{transition:all .15s;cursor:pointer}
    .skill-tag:hover{filter:brightness(1.2);transform:scale(1.04)}
    .skill-tag-rm{cursor:pointer;transition:all .15s}
    .skill-tag-rm:hover{background:rgba(248,113,113,0.15)!important;border-color:rgba(248,113,113,0.5)!important}
    .job-row{cursor:pointer;border-radius:14px;padding:12px 14px;transition:all .15s;border:1px solid transparent}
    .job-row:hover{background:rgba(35,197,94,0.04)!important;border-color:rgba(35,197,94,0.15)!important}
    .req-row{transition:background .15s;border-radius:10px;padding:9px 12px;margin:-9px -12px}
    .req-row:hover{background:rgba(255,255,255,0.03)}
    /* FIXED: overlay uses fixed positioning with flex centering */
    .overlay-bg{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.75);
      backdrop-filter:blur(8px);
      z-index:9999;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
    }
    .modal-box{background:#151f2e;border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:30px;width:560px;max-width:92vw;max-height:86vh;overflow-y:auto;box-shadow:0 40px 100px rgba(0,0,0,0.7);animation:fade-up .3s ease both}
    .modal-input{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:11px 15px;color:#e8f0fe;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;box-sizing:border-box;transition:border-color .2s}
    .modal-input:focus{border-color:rgba(35,197,94,0.45);background:rgba(35,197,94,0.03)}
    .modal-label{color:#6b82a8;font-size:11px;font-weight:700;letter-spacing:.8px;margin-bottom:6px;display:block;font-family:'Plus Jakarta Sans',sans-serif}
    .dark-row-hover{transition:background .15s;border-radius:10px}
    .dark-row-hover:hover{background:rgba(255,255,255,0.03)}
    .w-row-h{transition:background .15s}.w-row-h:hover{background:#f1f5f9!important}
    .cal-c:hover{background:rgba(35,197,94,0.08)!important;border-color:rgba(35,197,94,0.3)!important}
    .comm-row{transition:background .15s;cursor:pointer;border-radius:12px;padding:10px 12px}
    .comm-row:hover{background:rgba(255,255,255,0.04)}
    .action-btn{transition:all .15s;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;color:#6b7280;padding:6px 10px;border-radius:8px}
    .action-btn:hover{background:rgba(0,0,0,0.05);color:#374151}
    .trend-row{cursor:pointer;transition:background .15s;border-radius:8px}
    .trend-row:hover{background:rgba(35,197,94,0.04)}
    .create-btn:hover{transform:scale(1.02);box-shadow:0 4px 20px rgba(35,197,94,0.35)}
    .post-card{transition:all .22s cubic-bezier(.22,1,.36,1);cursor:pointer}
    .post-card:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,0.15)!important}
    .btn-g{transition:all .2s}.btn-g:hover{transform:scale(1.03)}
    .visa-opt{background:none;border:none;color:#6b82a8;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;width:100%;text-align:left;padding:10px 16px;transition:background .12s}
    .visa-opt:hover{background:rgba(35,197,94,0.06);color:#23c55e}
    .edit-btn{display:flex;align-items:center;gap:6px;padding:7px 18px;border-radius:10px;border:none;background:#23c55e;color:#fff;font-size:12px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .18s;box-shadow:0 2px 8px rgba(35,197,94,0.25)}
    .edit-btn:hover{background:#1db354;box-shadow:0 4px 18px rgba(35,197,94,0.38);transform:translateY(-1px)}
    .edit-btn:active{transform:translateY(0);box-shadow:0 2px 6px rgba(35,197,94,0.2)}
    .stat-tile-v2{position:relative;overflow:hidden;border-radius:18px;padding:20px 22px;flex:1;cursor:default;transition:transform .3s cubic-bezier(.22,1,.36,1),border-color .3s,box-shadow .3s;background:#0e1828;border:1px solid rgba(255,255,255,0.07)}
    .stat-tile-v2:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.13);box-shadow:0 20px 50px rgba(0,0,0,0.5)}
    .stat-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.5px;font-family:'Plus Jakarta Sans',sans-serif}
    .stat-divider{width:100%;height:1px;background:rgba(255,255,255,0.05);margin:14px 0}
    .modal-wide{background:#151f2e;border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:30px;width:680px;max-width:92vw;max-height:86vh;overflow-y:auto;box-shadow:0 40px 100px rgba(0,0,0,0.7);animation:fade-up .3s ease both}
    .job-card-modal{border-radius:16px;padding:18px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);transition:all .2s;cursor:pointer}
    .job-card-modal:hover{background:rgba(35,197,94,0.05);border-color:rgba(35,197,94,0.2);transform:translateY(-2px)}
    .stat-tile-modern{position:relative;overflow:hidden;border-radius:20px;padding:22px 22px;flex:1;cursor:default;transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s}
    .stat-tile-modern:hover{transform:translateY(-5px)}
    .work-right-tab-btn{padding:9px 22px;border-radius:999px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;transition:all .2s}
    .work-right-tab-btn:hover{opacity:.85}

    /* ══ Edit Profile Modal ══ */
    .ep-overlay{position:fixed;inset:0;background:rgba(5,8,18,0.85);backdrop-filter:blur(12px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px}
    .ep-modal{background:#0e1828;border:1px solid rgba(255,255,255,0.09);border-radius:28px;width:780px;max-width:96vw;max-height:92vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 48px 120px rgba(0,0,0,0.8);animation:modal-in .35s cubic-bezier(.22,1,.36,1) both}
    .ep-tab-btn{padding:10px 24px;border-radius:999px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;transition:all .22s;white-space:nowrap}
    .ep-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:12px;padding:11px 14px;color:#e8f0fe;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;box-sizing:border-box;transition:all .2s}
    .ep-input:focus{border-color:rgba(35,197,94,0.5);background:rgba(35,197,94,0.04);box-shadow:0 0 0 3px rgba(35,197,94,0.08)}
    .ep-input::placeholder{color:#334155}
    .ep-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b82a8' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:34px}
    .ep-label{color:#6b82a8;font-size:10px;font-weight:800;letter-spacing:1px;margin-bottom:7px;display:block;font-family:'Plus Jakarta Sans',sans-serif;text-transform:uppercase}
    .ep-section-title{font-weight:800;font-size:13px;color:#e8f0fe;font-family:'Plus Jakarta Sans',sans-serif;letter-spacing:-.3px;display:flex;align-items:center;gap:8px;margin-bottom:16px}
    .ep-section-title::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.06)}
    .ep-avatar-ring{width:80px;height:80px;border-radius:50%;border:2px solid rgba(35,197,94,0.4);padding:3px;cursor:pointer;transition:all .2s;flex-shrink:0}
    .ep-avatar-ring:hover{border-color:#23c55e;transform:scale(1.04)}
    .ep-skill-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 13px;border-radius:99px;background:rgba(35,197,94,0.08);border:1px solid rgba(35,197,94,0.2);color:#e8f0fe;font-size:12px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .15s}
    .ep-skill-chip:hover{background:rgba(248,113,113,0.1);border-color:rgba(248,113,113,0.3);color:#f87171}
    .ep-save-btn{padding:12px 36px;border-radius:14px;border:none;background:linear-gradient(135deg,#23c55e,#1aad51);color:#fff;font-weight:800;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .2s;box-shadow:0 4px 20px rgba(35,197,94,0.3)}
    .ep-save-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(35,197,94,0.4)}
    .ep-cancel-btn{padding:12px 28px;border-radius:14px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#6b82a8;font-weight:600;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .2s}
    .ep-cancel-btn:hover{background:rgba(255,255,255,0.04);color:#e8f0fe}
    .ep-progress-dot{width:8px;height:8px;border-radius:50%;transition:all .3s}
  `;
  if (!document.querySelector("[data-dash2]")) document.head.appendChild(style);
}

const dk = (extra = {}) => ({ background: D, border: `1px solid ${DB}`, borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", ...extra });
const glass = (extra = {}) => ({ background: "rgba(255,255,255,0.03)", border: `1px solid ${G.edge}`, borderRadius: 20, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", ...extra });
const whiteCard = (extra = {}) => ({ background: G.wBg, border: `1px solid ${G.wBorder}`, borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", ...extra });

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const FileIcon = ({ color = "currentColor" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="2 6 5 9 10 3"/>
  </svg>
);

function EditProfileModal({ name, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState("student");
  const [avatar, setAvatar] = useState(null);
  const avatarRef = useRef();

  const [student, setStudent] = useState({
    firstName: name.split(" ")[0] || "Novera",
    lastName: name.split(" ").slice(1).join(" ") || "Ahmed",
    email: "novera.ahmed@gmail.com",
    phone: "+880 1711-234567",
    dob: "2002-05-17",
    gender: "Female",
    nationality: "Bangladeshi",
    location: "Dhaka, Bangladesh",
    passportNo: "A12345678",
    passportExpiry: "2029-05-17",
    degree: "Bachelor of Science in CS",
    institution: "North South University",
    gradYear: "2024",
    gpa: "3.72",
    ielts: "7.0",
    destination: "Canada 🇨🇦",
    program: "MSc Computer Science",
    intake: "Fall 2026",
    bio: "Passionate software engineer looking to pursue advanced studies in AI and distributed systems.",
  });

  const [work, setWork] = useState({
    currentJob: "Software Engineer at Tech Solutions Ltd.",
    experience: "2.3 Years",
    industry: "Information Technology",
    desiredRole: "Software Developer",
    targetCountry: "🇨🇦 Canada",
    workPref: "Hybrid",
    salaryMin: "70000",
    salaryMax: "90000",
    salaryCurrency: "CAD",
    relocation: "Yes",
    family: "Yes",
    startDate: "Within 3 months",
    linkedin: "linkedin.com/in/noveraahmed",
    github: "github.com/noveraahmed",
    portfolio: "",
  });
  const [skills, setSkills] = useState(["JavaScript", "Python", "React", "Node.js", "SQL", "Git", "Docker", "AWS"]);
  const [skillInput, setSkillInput] = useState("");

  const setS = (key) => (e) => setStudent((p) => ({ ...p, [key]: e.target.value }));
  const setW = (key) => (e) => setWork((p) => ({ ...p, [key]: e.target.value }));

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) { setSkills((s) => [...s, v]); setSkillInput(""); }
  };
  const removeSkill = (s) => setSkills((l) => l.filter((x) => x !== s));

  const handleAvatarChange = (e) => {
    const f = e.target.files[0];
    if (f) setAvatar(URL.createObjectURL(f));
  };

  const handleSave = () => {
    onSave({ name: `${student.firstName} ${student.lastName}`, student, work, skills });
    onClose();
  };

  const completionStudent = () => {
    const keys = ["firstName", "lastName", "email", "phone", "dob", "nationality", "passportNo", "degree", "institution", "gpa", "ielts", "destination", "program"];
    return Math.round((keys.filter((k) => student[k]).length / keys.length) * 100);
  };
  const completionWork = () => {
    const keys = ["currentJob", "experience", "desiredRole", "targetCountry", "workPref", "salaryMin", "salaryMax"];
    return Math.round((keys.filter((k) => work[k]).length / keys.length) * 100);
  };

  const Field = ({ label, value, onChange, type = "text", options, placeholder, span = 1 }) => (
    <div style={{ gridColumn: `span ${span}` }}>
      <label className="ep-label">{label}</label>
      {options ? (
        <select className={`ep-input ep-select`} value={value} onChange={onChange}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "11px 34px 11px 14px", color: "#e8f0fe", fontSize: 13, fontFamily: FONT, outline: "none", cursor: "pointer" }}>
          {options.map((o) => <option key={o} value={o} style={{ background: "#0e1828" }}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea className="ep-input" rows={3} value={value} onChange={onChange} placeholder={placeholder}
          style={{ resize: "vertical" }} />
      ) : (
        <input className="ep-input" type={type} value={value} onChange={onChange} placeholder={placeholder} />
      )}
    </div>
  );

  const TabContent = () => {
    if (activeTab === "student") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", padding: "20px 24px", background: "rgba(35,197,94,0.04)", border: "1px solid rgba(35,197,94,0.12)", borderRadius: 18 }}>
          <div style={{ position: "relative" }}>
            <div className="ep-avatar-ring" onClick={() => avatarRef.current?.click()}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", background: avatar ? "transparent" : "rgba(35,197,94,0.1)", overflow: "hidden" }}>
              {avatar
                ? <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                : <span style={{ fontSize: 28 }}>👤</span>}
            </div>
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: G.mint, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
              onClick={() => avatarRef.current?.click()}>
              <EditIcon />
            </div>
            <input ref={avatarRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: G.text, fontFamily: FONT, letterSpacing: -.5 }}>{student.firstName} {student.lastName}</div>
            <div style={{ color: G.textSub, fontSize: 12, fontFamily: FONT, marginTop: 3 }}>{student.email}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <span style={{ padding: "4px 12px", borderRadius: 99, background: "rgba(35,197,94,0.1)", border: "1px solid rgba(35,197,94,0.25)", color: G.mint, fontSize: 11, fontWeight: 700, fontFamily: FONT }}>{student.destination}</span>
              <span style={{ padding: "4px 12px", borderRadius: 99, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: G.sky, fontSize: 11, fontWeight: 700, fontFamily: FONT }}>{student.intake}</span>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 26, color: G.mint, fontFamily: FONT, lineHeight: 1 }}>{completionStudent()}%</div>
            <div style={{ color: G.textSub, fontSize: 10, fontFamily: FONT, marginTop: 3 }}>Profile</div>
          </div>
        </div>
        <div>
          <div className="ep-section-title">
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(35,197,94,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</span>
            Personal Information
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="First Name" value={student.firstName} onChange={setS("firstName")} placeholder="First name" />
            <Field label="Last Name" value={student.lastName} onChange={setS("lastName")} placeholder="Last name" />
            <Field label="Email Address" value={student.email} onChange={setS("email")} type="email" placeholder="you@email.com" />
            <Field label="Phone Number" value={student.phone} onChange={setS("phone")} placeholder="+880 ..." />
            <Field label="Date of Birth" value={student.dob} onChange={setS("dob")} type="date" />
            <Field label="Gender" value={student.gender} onChange={setS("gender")} options={["Female", "Male", "Non-binary", "Prefer not to say"]} />
            <Field label="Nationality" value={student.nationality} onChange={setS("nationality")} placeholder="e.g. Bangladeshi" />
            <Field label="Current Location" value={student.location} onChange={setS("location")} placeholder="City, Country" />
            <Field label="Passport Number" value={student.passportNo} onChange={setS("passportNo")} placeholder="e.g. A12345678" />
            <Field label="Passport Expiry" value={student.passportExpiry} onChange={setS("passportExpiry")} type="date" />
          </div>
        </div>
        <div>
          <div className="ep-section-title">
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(167,139,250,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎓</span>
            Academic Background
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Highest Degree" value={student.degree} onChange={setS("degree")} placeholder="e.g. BSc in Computer Science" span={2} />
            <Field label="Institution" value={student.institution} onChange={setS("institution")} placeholder="University name" />
            <Field label="Graduation Year" value={student.gradYear} onChange={setS("gradYear")} options={["2020","2021","2022","2023","2024","2025","2026"]} />
            <Field label="GPA / CGPA" value={student.gpa} onChange={setS("gpa")} placeholder="e.g. 3.72" />
            <Field label="IELTS Score" value={student.ielts} onChange={setS("ielts")} placeholder="e.g. 7.0" />
          </div>
        </div>
        <div>
          <div className="ep-section-title">
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(56,189,248,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✈️</span>
            Study Destination
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Target Country" value={student.destination} onChange={setS("destination")} options={["Canada 🇨🇦","Australia 🇦🇺","UK 🇬🇧","Germany 🇩🇪","USA 🇺🇸","Netherlands 🇳🇱"]} />
            <Field label="Intended Intake" value={student.intake} onChange={setS("intake")} options={["Fall 2025","Spring 2026","Fall 2026","Spring 2027","Fall 2027"]} />
            <Field label="Program of Study" value={student.program} onChange={setS("program")} placeholder="e.g. MSc Computer Science" span={2} />
            <Field label="About / Bio" value={student.bio} onChange={setS("bio")} type="textarea" placeholder="Brief introduction..." span={2} />
          </div>
        </div>
      </div>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", padding: "20px 24px", background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.12)", borderRadius: 18 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>💼</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: G.text, fontFamily: FONT, letterSpacing: -.5 }}>{work.currentJob}</div>
            <div style={{ color: G.textSub, fontSize: 12, fontFamily: FONT, marginTop: 3 }}>{work.experience} · {work.industry}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <span style={{ padding: "4px 12px", borderRadius: 99, background: "rgba(35,197,94,0.1)", border: "1px solid rgba(35,197,94,0.25)", color: G.mint, fontSize: 11, fontWeight: 700, fontFamily: FONT }}>{work.targetCountry}</span>
              <span style={{ padding: "4px 12px", borderRadius: 99, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: G.gold, fontSize: 11, fontWeight: 700, fontFamily: FONT }}>{work.workPref}</span>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 26, color: G.sky, fontFamily: FONT, lineHeight: 1 }}>{completionWork()}%</div>
            <div style={{ color: G.textSub, fontSize: 10, fontFamily: FONT, marginTop: 3 }}>Work Profile</div>
          </div>
        </div>
        <div>
          <div className="ep-section-title">
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(56,189,248,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💼</span>
            Career Details
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Current Job Title" value={work.currentJob} onChange={setW("currentJob")} placeholder="e.g. Software Engineer at ABC" span={2} />
            <Field label="Years of Experience" value={work.experience} onChange={setW("experience")} placeholder="e.g. 2.3 Years" />
            <Field label="Industry" value={work.industry} onChange={setW("industry")} options={["Information Technology","Finance","Healthcare","Education","Marketing","Engineering","Design","Other"]} />
            <Field label="Desired Role" value={work.desiredRole} onChange={setW("desiredRole")} placeholder="e.g. Software Developer" />
            <Field label="Target Country" value={work.targetCountry} onChange={setW("targetCountry")} options={["🇨🇦 Canada","🇦🇺 Australia","🇬🇧 UK","🇩🇪 Germany","🇺🇸 USA"]} />
          </div>
        </div>
        <div>
          <div className="ep-section-title">
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(251,191,36,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚙️</span>
            Work Preferences
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Work Mode" value={work.workPref} onChange={setW("workPref")} options={["Hybrid","Remote","On-site"]} />
            <Field label="Available to Start" value={work.startDate} onChange={setW("startDate")} options={["Immediately","Within 1 month","Within 3 months","Within 6 months"]} />
            <Field label="Relocation Support" value={work.relocation} onChange={setW("relocation")} options={["Yes","No","Negotiable"]} />
            <Field label="Family Relocation" value={work.family} onChange={setW("family")} options={["Yes","No"]} />
            <div style={{ gridColumn: "span 2" }}>
              <label className="ep-label">Expected Salary Range</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <select className="ep-input" value={work.salaryCurrency} onChange={setW("salaryCurrency")}
                  style={{ width: 90, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "11px 10px", color: "#e8f0fe", fontSize: 13, fontFamily: FONT, outline: "none", flexShrink: 0 }}>
                  {["CAD","AUD","GBP","EUR","USD"].map(c => <option key={c} value={c} style={{ background: "#0e1828" }}>{c}</option>)}
                </select>
                <input className="ep-input" type="number" value={work.salaryMin} onChange={setW("salaryMin")} placeholder="Min e.g. 70000" style={{ flex: 1 }} />
                <span style={{ color: G.textSub, fontFamily: FONT, fontSize: 14, flexShrink: 0 }}>–</span>
                <input className="ep-input" type="number" value={work.salaryMax} onChange={setW("salaryMax")} placeholder="Max e.g. 90000" style={{ flex: 1 }} />
              </div>
              <div style={{ color: G.textMuted, fontSize: 11, fontFamily: FONT, marginTop: 6 }}>
                Preview: {work.salaryCurrency} {work.salaryMin ? Number(work.salaryMin).toLocaleString() : "—"} – {work.salaryMax ? Number(work.salaryMax).toLocaleString() : "—"} / year
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="ep-section-title">
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(167,139,250,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🛠️</span>
            Skills
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, minHeight: 40 }}>
            {skills.map((s) => (
              <span key={s} className="ep-skill-chip" onClick={() => removeSkill(s)} title="Click to remove">
                {s}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
              </span>
            ))}
            {skills.length === 0 && <span style={{ color: G.textMuted, fontSize: 12, fontFamily: FONT }}>No skills added yet.</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="ep-input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} placeholder="Add a skill (e.g. TypeScript, Figma)…" style={{ flex: 1 }} />
            <button onClick={addSkill} style={{ padding: "11px 20px", borderRadius: 12, border: "none", background: G.mint, color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: FONT, cursor: "pointer", flexShrink: 0 }}>Add</button>
          </div>
        </div>
        <div>
          <div className="ep-section-title">
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(56,189,248,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔗</span>
            Online Presence
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="LinkedIn" value={work.linkedin} onChange={setW("linkedin")} placeholder="linkedin.com/in/you" />
            <Field label="GitHub" value={work.github} onChange={setW("github")} placeholder="github.com/you" />
            <Field label="Portfolio / Website" value={work.portfolio} onChange={setW("portfolio")} placeholder="yoursite.com" span={2} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ep-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ep-modal">
        <div style={{ padding: "24px 28px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 22, color: G.text, fontFamily: FONT, letterSpacing: -1 }}>Edit Profile</div>
              <div style={{ color: G.textSub, fontSize: 12, fontFamily: FONT, marginTop: 3 }}>Update your student and work information</div>
            </div>
            <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: G.textSub, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = G.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = G.textSub; }}>×</button>
          </div>
          <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 4, marginBottom: 0, border: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { id: "student", label: "Student Profile", icon: "🎓", pct: completionStudent() },
              { id: "work", label: "Work Profile", icon: "💼", pct: completionWork() },
            ].map((tab) => (
              <button key={tab.id} className="ep-tab-btn" onClick={() => setActiveTab(tab.id)}
                style={{ flex: 1, background: activeTab === tab.id ? "rgba(255,255,255,0.08)" : "transparent", color: activeTab === tab.id ? G.text : G.textSub, borderRadius: 10, border: activeTab === tab.id ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 16px" }}>
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                <span>{tab.label}</span>
                <span style={{ padding: "2px 8px", borderRadius: 99, background: activeTab === tab.id ? (tab.id === "student" ? "rgba(35,197,94,0.15)" : "rgba(56,189,248,0.15)") : "rgba(255,255,255,0.06)", color: activeTab === tab.id ? (tab.id === "student" ? G.mint : G.sky) : G.textMuted, fontSize: 10, fontWeight: 800, fontFamily: FONT }}>
                  {tab.pct}%
                </span>
              </button>
            ))}
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, marginTop: 16, marginBottom: 0, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: activeTab === "student" ? G.mint : G.sky, width: `${activeTab === "student" ? completionStudent() : completionWork()}%`, transition: "width .6s cubic-bezier(.22,1,.36,1)" }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <TabContent />
        </div>
        <div style={{ padding: "16px 28px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: G.textMuted, fontSize: 12, fontFamily: FONT }}>All changes are saved locally</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ep-cancel-btn" onClick={onClose}>Cancel</button>
            <button className="ep-save-btn" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ALL_VISA_DATA = {
  "🇨🇦 Canada": [
    { name: "Passport (Valid)", desc: "Must be valid for at least 6 months beyond stay", done: true },
    { name: "Educational Credential Assessment (ECA)", desc: "Required for Express Entry — WES, ICAS, or approved body", done: true },
    { name: "IELTS Language Proficiency", desc: "Minimum CLB 7 for most programs (IELTS 6.0+)", done: true },
    { name: "Proof of Funds", desc: "Bank statements showing sufficient settlement funds", done: false },
    { name: "Police Clearance Certificate", desc: "From all countries you've lived in for 6+ months", done: false },
    { name: "Medical Examination", desc: "Completed by a panel physician approved by IRCC", done: false },
    { name: "Biometrics", desc: "Fingerprints and photo at a VAC or Application Support Center", done: false },
    { name: "Letter of Explanation", desc: "Optional but recommended to address any gaps or concerns", done: false },
    { name: "Employment Records", desc: "Reference letters, pay stubs, or NOC documentation", done: true },
    { name: "Digital Photo", desc: "Meets IRCC specifications (35mm × 45mm, white background)", done: false },
  ],
  "🇦🇺 Australia": [
    { name: "Valid Passport", desc: "Valid throughout your intended stay in Australia", done: true },
    { name: "Skills Assessment", desc: "Completed by the relevant assessing authority for your occupation", done: false },
    { name: "English Proficiency Test", desc: "IELTS, TOEFL, PTE, or OET at competent or above", done: true },
    { name: "Health Examination", desc: "Completed by a panel physician before visa grant", done: false },
    { name: "Character Certificate", desc: "Police clearances from all countries lived in 12+ months", done: false },
    { name: "Expression of Interest (EOI)", desc: "Submitted via SkillSelect for skilled migration streams", done: false },
    { name: "Sponsorship (if applicable)", desc: "State/Territory or employer nomination where required", done: false },
    { name: "Proof of Funds", desc: "Evidence of sufficient funds to support yourself initially", done: false },
  ],
  "🇬🇧 UK": [
    { name: "Valid Passport", desc: "Valid for the duration of your planned stay", done: true },
    { name: "English Language Proof", desc: "B1 CEFR or higher — IELTS, TOEFL, or approved test", done: true },
    { name: "Financial Evidence", desc: "Bank statements showing £1,270+ held for 28+ days", done: false },
    { name: "Sponsorship / Job Offer", desc: "Certificate of Sponsorship (CoS) from a licensed sponsor", done: false },
    { name: "TB Test Certificate", desc: "Required if from a listed country — approved clinic only", done: false },
    { name: "Criminal Record Certificate", desc: "For roles involving children or vulnerable adults", done: false },
    { name: "Biometrics", desc: "At a UK Visa and Citizenship Application Services (UKVCAS) centre", done: false },
    { name: "Application Form (FLR/ILR)", desc: "Correct form depends on visa category and leave history", done: false },
  ],
  "🇩🇪 Germany": [
    { name: "Valid Passport", desc: "With at least two blank pages and valid beyond your stay", done: true },
    { name: "Recognized Qualification", desc: "Anabin database or Statement of Comparability from KMK", done: false },
    { name: "German / English Proof", desc: "B2 German or C1 English depending on role", done: false },
    { name: "Health Insurance", desc: "Statutory or private health insurance covering Germany", done: false },
    { name: "Financial Proof", desc: "€11,208/year blocked account or employer sponsorship letter", done: false },
    { name: "Job Offer / Contract", desc: "Signed contract from a German employer in your field", done: false },
    { name: "Biometric Photos", desc: "2 recent photos (35mm × 45mm) meeting German specifications", done: false },
    { name: "Registration Certificate", desc: "Anmeldung — register your address within 2 weeks of arrival", done: false },
  ],
};

function AllRequirementsModal({ country, onClose }) {
  const reqs = ALL_VISA_DATA[country] || [];
  const done = reqs.filter(r => r.done).length;
  return (
    <div className="overlay-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-wide">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: G.text, fontFamily: FONT, letterSpacing: -.5 }}>{country} — All Requirements</div>
            <div style={{ color: G.textSub, fontSize: 12, fontFamily: FONT, marginTop: 4 }}>{done} of {reqs.length} requirements completed</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: G.textSub, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ width: `${(done / reqs.length) * 100}%`, height: "100%", background: G.mint, borderRadius: 99, transition: "width 1s" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reqs.map((r, i) => (
            <div key={r.name} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", borderRadius: 14, background: r.done ? "rgba(35,197,94,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${r.done ? "rgba(35,197,94,0.2)" : "rgba(255,255,255,0.06)"}`, animation: `fade-up .3s ease ${i * 40}ms both` }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: r.done ? "rgba(35,197,94,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${r.done ? "rgba(35,197,94,0.35)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: r.done ? G.mint : G.textMuted, marginTop: 1 }}>
                {r.done ? <CheckIcon /> : <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="6" y1="2" x2="6" y2="10"/><line x1="2" y1="6" x2="10" y2="6"/></svg>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: r.done ? G.text : G.textSub, fontFamily: FONT, marginBottom: 3 }}>{r.name}</div>
                <div style={{ color: G.textMuted, fontSize: 12, fontFamily: FONT, lineHeight: 1.5 }}>{r.desc}</div>
              </div>
              <div style={{ padding: "3px 10px", borderRadius: 99, background: r.done ? "rgba(35,197,94,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${r.done ? "rgba(35,197,94,0.25)" : "rgba(255,255,255,0.08)"}`, color: r.done ? G.mint : G.textSub, fontSize: 10, fontWeight: 700, fontFamily: FONT, flexShrink: 0 }}>
                {r.done ? "DONE" : "PENDING"}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={onClose} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: G.mint, color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: FONT, cursor: "pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

const ALL_JOBS = [
  { title: "Software Developer", company: "TechCorp Solutions", match: 92, logo: "TC", color: G.mint, location: "Toronto, CA", type: "Full-time", salary: "CAD 85,000" },
  { title: "Full Stack Developer", company: "CodeWave Inc.", match: 88, logo: "CW", color: G.sky, location: "Vancouver, CA", type: "Hybrid", salary: "CAD 80,000" },
  { title: "Backend Developer", company: "InnoSoft Systems", match: 85, logo: "IS", color: G.lavender, location: "Remote", type: "Remote", salary: "CAD 78,000" },
  { title: "React Developer", company: "WebCraft Agency", match: 81, logo: "WC", color: G.gold, location: "Ottawa, CA", type: "On-site", salary: "CAD 75,000" },
  { title: "Node.js Developer", company: "CloudBase Ltd.", match: 79, logo: "CB", color: G.coral, location: "Calgary, CA", type: "Full-time", salary: "CAD 77,000" },
  { title: "DevOps Engineer", company: "Infra.io", match: 74, logo: "IO", color: "#34d399", location: "Montreal, CA", type: "Hybrid", salary: "CAD 90,000" },
  { title: "Frontend Engineer", company: "PixelCo", match: 71, logo: "PC", color: "#e879f9", location: "Remote", type: "Remote", salary: "CAD 72,000" },
  { title: "Software Engineer II", company: "DataStream Corp", match: 68, logo: "DS", color: G.textSub, location: "Winnipeg, CA", type: "Full-time", salary: "CAD 82,000" },
];

/* FIXED: AllJobsModal uses overlay-bg class which now has position:fixed + flex centering */
function AllJobsModal({ onClose }) {
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState({});
  const types = ["All", "Full-time", "Remote", "Hybrid", "On-site"];
  const filtered = filter === "All" ? ALL_JOBS : ALL_JOBS.filter(j => j.type === filter);
  return (
    <div className="overlay-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-wide" style={{ width: 700 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: G.text, fontFamily: FONT, letterSpacing: -.5 }}>All Recommended Jobs</div>
            <div style={{ color: G.textSub, fontSize: 12, fontFamily: FONT, marginTop: 4 }}>{ALL_JOBS.length} AI-matched positions for your profile</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: G.textSub, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ padding: "6px 16px", borderRadius: 99, border: `1px solid ${filter === t ? "rgba(35,197,94,0.4)" : "rgba(255,255,255,0.08)"}`, background: filter === t ? "rgba(35,197,94,0.12)" : "rgba(255,255,255,0.03)", color: filter === t ? G.mint : G.textSub, fontWeight: filter === t ? 700 : 500, fontSize: 12, fontFamily: FONT, cursor: "pointer", transition: "all .15s" }}>{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((job, i) => (
            <div key={job.title + job.company} className="job-card-modal" style={{ display: "flex", alignItems: "center", gap: 14, animation: `fade-up .3s ease ${i * 40}ms both` }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `${job.color}14`, border: `1px solid ${job.color}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: job.color, fontWeight: 900, fontSize: 12, fontFamily: FONT }}>{job.logo}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: G.text, fontFamily: FONT }}>{job.title}</div>
                <div style={{ color: G.textSub, fontSize: 12, fontFamily: FONT, marginTop: 2 }}>{job.company} · {job.location}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <span style={{ padding: "2px 9px", borderRadius: 99, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: G.textSub, fontSize: 10, fontWeight: 600, fontFamily: FONT }}>{job.type}</span>
                  <span style={{ padding: "2px 9px", borderRadius: 99, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: G.textSub, fontSize: 10, fontWeight: 600, fontFamily: FONT }}>{job.salary}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ padding: "6px 14px", borderRadius: 99, background: `${job.color}12`, border: `1px solid ${job.color}28`, color: job.color, fontSize: 12, fontWeight: 800, fontFamily: FONT }}>{job.match}%</div>
                <button onClick={() => setSaved(s => ({ ...s, [job.title]: !s[job.title] }))} style={{ background: "none", border: "none", cursor: "pointer", color: saved[job.title] ? G.gold : G.textSub, fontSize: 18, lineHeight: 1, padding: "2px 4px", transition: "color .15s" }}>
                  {saved[job.title] ? "★" : "☆"}
                </button>
                <button style={{ padding: "7px 16px", borderRadius: 10, border: "none", background: G.mint, color: "#fff", fontWeight: 700, fontSize: 12, fontFamily: FONT, cursor: "pointer" }}>Apply</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: G.textSub, fontWeight: 600, fontSize: 13, fontFamily: FONT, cursor: "pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ title, fields, values, onSave, onClose }) {
  const [form, setForm] = useState({ ...values });
  return (
    <div className="overlay-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: G.text, fontFamily: FONT }}>Edit {title}</div>
            <div style={{ color: G.textSub, fontSize: 12, fontFamily: FONT, marginTop: 3 }}>Make changes and save</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: G.textSub, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: fields.length > 4 ? "1fr 1fr" : "1fr", gap: 14 }}>
          {fields.map(f => (
            <div key={f.key} style={f.full ? { gridColumn: "1/-1" } : {}}>
              <label className="modal-label">{f.label.toUpperCase()}</label>
              {f.type === "textarea" ? (
                <textarea className="modal-input" rows={3} value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ resize: "vertical" }} />
              ) : f.type === "select" ? (
                <select className="modal-input" value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}>
                  {f.options.map(o => <option key={o} value={o} style={{ background: "#151f2e" }}>{o}</option>)}
                </select>
              ) : (
                <input className="modal-input" type={f.type || "text"} value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder || ""} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 26, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: G.textSub, fontWeight: 600, fontSize: 13, fontFamily: FONT, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} style={{ padding: "10px 26px", borderRadius: 10, border: "none", background: G.mint, color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: FONT, cursor: "pointer" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function SkillsModal({ skills, onSave, onClose }) {
  const [list, setList] = useState([...skills]);
  const [input, setInput] = useState("");
  const remove = s => setList(l => l.filter(x => x !== s));
  const add = () => { const v = input.trim(); if (v && !list.includes(v)) { setList(l => [...l, v]); setInput(""); } };
  return (
    <div className="overlay-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div><div style={{ fontWeight: 800, fontSize: 18, color: G.text, fontFamily: FONT }}>Edit Top Skills</div><div style={{ color: G.textSub, fontSize: 12, fontFamily: FONT, marginTop: 3 }}>Click a skill to remove it</div></div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: G.textSub, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <label className="modal-label">CURRENT SKILLS</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20, minHeight: 44, padding: "8px 0" }}>
          {list.map(s => (
            <span key={s} className="skill-tag-rm" onClick={() => remove(s)} style={{ padding: "7px 14px", borderRadius: 99, background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.18)", color: G.coral, fontSize: 13, fontWeight: 600, fontFamily: FONT, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              {s} <span style={{ fontSize: 15 }}>×</span>
            </span>
          ))}
          {list.length === 0 && <span style={{ color: G.textMuted, fontSize: 13, fontFamily: FONT }}>No skills yet. Add some below.</span>}
        </div>
        <label className="modal-label">ADD SKILL</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="modal-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="e.g. TypeScript, Figma..." style={{ flex: 1 }} />
          <button onClick={add} style={{ padding: "11px 20px", borderRadius: 12, border: "none", background: G.mint, color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: FONT, cursor: "pointer", flexShrink: 0 }}>Add</button>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: G.textSub, fontWeight: 600, fontSize: 13, fontFamily: FONT, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => { onSave(list); onClose(); }} style={{ padding: "10px 26px", borderRadius: 10, border: "none", background: G.mint, color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: FONT, cursor: "pointer" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon, value, label, sublabel, subColor = G.mint, delay = 0, accent }) {
  const ac = accent || subColor;
  const [shown, setShown] = useState(false);
  const isWarning = subColor === "#f59e0b";
  useEffect(() => { const t = setTimeout(() => setShown(true), delay + 100); return () => clearTimeout(t); }, [delay]);
  return (
    <div className="stat-tile-v2" style={{ animation: `fade-up .5s cubic-bezier(.22,1,.36,1) ${delay}ms both` }}>
      <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 1, background: `linear-gradient(90deg, transparent, ${ac}60, transparent)`, borderRadius: 99 }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: ac, display: "flex" }}>{icon}</span>
        </div>
        <span className="stat-badge" style={{ background: `${ac}16`, border: `1px solid ${ac}30`, color: ac }}>
          {isWarning && <span style={{ width: 5, height: 5, borderRadius: "50%", background: ac, display: "inline-block", animation: "pulse-dot 1.8s infinite", flexShrink: 0 }} />}
          {sublabel}
        </span>
      </div>
      <div className="stat-divider" />
      <div style={{ fontWeight: 900, fontSize: value ? 38 : 16, color: value ? "#fff" : G.textSub, fontFamily: FONT, lineHeight: 1, letterSpacing: value ? -2 : -.3, animation: shown ? `slide-in-num .45s cubic-bezier(.22,1,.36,1) ${delay + 60}ms both` : "none", marginBottom: value ? 6 : 0 }}>
        {value || label}
      </div>
      {value && <div style={{ color: G.textSub, fontSize: 11, fontFamily: FONT, fontWeight: 600, letterSpacing: .3, textTransform: "uppercase" }}>{label}</div>}
    </div>
  );
}

function CareerSnapshot() {
  const def = { targetCountry: "🇨🇦 Canada", experience: "2.3 Years", desiredRole: "Software Developer", currentJob: "Software Engineer at Tech Solutions Ltd.", industry: "Information Technology", degree: "Bachelor of Science in CS", workPref: "Hybrid", institution: "North South University", salary: "CAD 70,000 – 90,000 / year", gradYear: "2024" };
  const [vals, setVals] = useState(def);
  const [modal, setModal] = useState(false);
  const fields = [
    { key: "targetCountry", label: "Target Country" },
    { key: "experience", label: "Experience" },
    { key: "desiredRole", label: "Desired Role" },
    { key: "currentJob", label: "Current Job" },
    { key: "industry", label: "Industry" },
    { key: "degree", label: "Highest Degree" },
    { key: "workPref", label: "Work Preference", type: "select", options: ["Hybrid", "Remote", "On-site"] },
    { key: "institution", label: "Institution" },
    { key: "salary", label: "Expected Salary", full: true },
    { key: "gradYear", label: "Graduation Year" },
  ];
  const rows = [
    { l: "Target Country", v: vals.targetCountry, l2: "Experience", v2: vals.experience },
    { l: "Desired Role", v: vals.desiredRole, l2: "Current Job", v2: vals.currentJob },
    { l: "Industry", v: vals.industry, l2: "Highest Degree", v2: vals.degree },
    { l: "Work Preference", v: vals.workPref, l2: "Institution", v2: vals.institution },
    { l: "Expected Salary", v: vals.salary, l2: "Graduation Year", v2: vals.gradYear },
  ];
  return (
    <>
      {modal && <EditModal title="Career Snapshot" fields={fields} values={vals} onSave={v => setVals(v)} onClose={() => setModal(false)} />}
      <div className="card-lift" style={{ ...dk(), padding: "22px 24px", animation: "fade-up .5s ease .15s both", height: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: G.text, fontFamily: FONT, letterSpacing: -.5 }}>Career Snapshot</div>
            <div style={{ color: G.textSub, fontSize: 11, fontFamily: FONT, marginTop: 2 }}>Your professional overview</div>
          </div>
          <button className="edit-btn" onClick={() => setModal(true)}><EditIcon /> Edit</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {rows.map((row, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{ padding: "10px 0", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", paddingRight: 20 }}>
                <div style={{ color: G.textSub, fontSize: 10, fontFamily: FONT, marginBottom: 3, fontWeight: 600 }}>{row.l}</div>
                <div style={{ color: G.text, fontWeight: 700, fontSize: 12, fontFamily: FONT }}>{row.v}</div>
              </div>
              <div style={{ padding: "10px 0", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: 20 }}>
                <div style={{ color: G.textSub, fontSize: 10, fontFamily: FONT, marginBottom: 3, fontWeight: 600 }}>{row.l2}</div>
                <div style={{ color: G.text, fontWeight: 700, fontSize: 12, fontFamily: FONT }}>{row.v2}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TopSkills() {
  const [skills, setSkills] = useState(["JavaScript", "Python", "React", "Node.js", "SQL", "Git", "Docker", "AWS"]);
  const [modal, setModal] = useState(false);
  return (
    <>
      {modal && <SkillsModal skills={skills} onSave={setSkills} onClose={() => setModal(false)} />}
      <div style={{ padding: "4px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: G.wText, fontFamily: FONT, letterSpacing: -.5 }}>Top Skills</div>
            <div style={{ color: G.wTextSub, fontSize: 11, fontFamily: FONT, marginTop: 2 }}>{skills.length} skills listed</div>
          </div>
          <button className="edit-btn" onClick={() => setModal(true)}><EditIcon /> Edit</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {skills.map((s) => (
            <span key={s} className="skill-tag" style={{ padding: "7px 16px", borderRadius: 99, background: "rgba(35,197,94,0.08)", border: "1px solid rgba(35,197,94,0.2)", color: G.wText, fontSize: 13, fontWeight: 700, fontFamily: FONT }}>{s}</span>
          ))}
        </div>
      </div>
    </>
  );
}

function WorkDocumentsPanel() {
  const [docs, setDocs] = useState([
    { name: "Resume/CV", uploaded: true },
    { name: "Passport Copy", uploaded: true },
    { name: "ID Card", uploaded: true },
    { name: "Certificates", uploaded: true, extra: "2 Files" },
  ]);
  const refs = useRef({});
  const handleReplace = (name, e) => {
    const f = e.target.files[0];
    if (f) setDocs(d => d.map(doc => doc.name === name ? { ...doc, extra: f.name.slice(0, 16) + "…" } : doc));
  };
  const handleNew = (e) => {
    const f = e.target.files[0];
    if (f) setDocs(d => [...d, { name: f.name.slice(0, 22), uploaded: true }]);
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: G.wText, fontFamily: FONT, letterSpacing: -.5 }}>Documents</div>
          <div style={{ color: G.wTextSub, fontSize: 11, fontFamily: FONT, marginTop: 2 }}>{docs.filter(d => d.uploaded).length} of {docs.length} ready</div>
        </div>
        <div>
          <button onClick={() => refs.current["__new__"]?.click()} style={{ padding: "7px 14px", borderRadius: 10, border: "1px dashed rgba(0,0,0,0.18)", background: "rgba(0,0,0,0.04)", color: G.wText, fontSize: 12, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>+ Upload New</button>
          <input ref={el => refs.current["__new__"] = el} type="file" style={{ display: "none" }} onChange={handleNew} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {docs.map((doc, i) => (
          <div key={doc.name + i} className="w-row-h" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 12, border: `1px solid ${doc.uploaded ? "rgba(35,197,94,0.25)" : G.wEdge}`, background: doc.uploaded ? "rgba(35,197,94,0.04)" : G.wBg2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: doc.uploaded ? "rgba(35,197,94,0.1)" : "rgba(0,0,0,0.05)", border: `1px solid ${doc.uploaded ? "rgba(35,197,94,0.3)" : G.wEdge}`, display: "flex", alignItems: "center", justifyContent: "center", color: doc.uploaded ? G.mint : G.wTextMuted }}>
                <FileIcon />
              </div>
              <div>
                <div style={{ color: G.wText, fontWeight: 600, fontSize: 13, fontFamily: FONT }}>{doc.name}</div>
                <div style={{ color: G.wTextMuted, fontSize: 10, fontFamily: FONT, marginTop: 1 }}>{doc.extra || "Uploaded"}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ padding: "3px 10px", borderRadius: 99, background: "rgba(35,197,94,0.08)", border: "1px solid rgba(35,197,94,0.2)", color: G.mint, fontSize: 10, fontWeight: 700, fontFamily: FONT }}>✓ READY</span>
              <button onClick={() => refs.current[doc.name + i]?.click()} style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", color: G.wTextSub, fontSize: 10, fontWeight: 600, fontFamily: FONT, padding: "4px 10px", borderRadius: 7, cursor: "pointer" }}>Replace</button>
              <input ref={el => refs.current[doc.name + i] = el} type="file" style={{ display: "none" }} onChange={e => handleReplace(doc.name, e)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const VISA_DATA = {
  "🇨🇦 Canada": ["Passport (Valid)", "Educational Credential Assessment (ECA)", "IELTS Language Proficiency", "Proof of Funds", "Police Clearance Certificate"],
  "🇦🇺 Australia": ["Valid Passport", "Skills Assessment", "English Proficiency Test", "Health Examination", "Character Certificate"],
  "🇬🇧 UK": ["Valid Passport", "English Language Proof", "Financial Evidence", "Sponsorship / Job Offer", "TB Test Certificate"],
  "🇩🇪 Germany": ["Valid Passport", "Recognized Qualification", "German / English Proof", "Health Insurance", "Financial Proof"],
};

function VisaRequirementsPanel() {
  const [country, setCountry] = useState("🇨🇦 Canada");
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const reqs = VISA_DATA[country] || [];
  return (
    <>
      {showAll && <AllRequirementsModal country={country} onClose={() => setShowAll(false)} />}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: G.wText, fontFamily: FONT, letterSpacing: -.5 }}>Visa / Country Requirements</div>
            <div style={{ color: G.wTextSub, fontSize: 11, fontFamily: FONT, marginTop: 2 }}>Requirements for your destination</div>
          </div>
          <div style={{ position: "relative" }}>
            <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, cursor: "pointer", background: "rgba(0,0,0,0.04)", color: G.wText, fontFamily: FONT, fontWeight: 600, fontSize: 12, transition: "all .15s" }}>
              {country}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>
            </button>
            {open && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14, overflow: "hidden", zIndex: 200, minWidth: 190, boxShadow: "0 20px 50px rgba(0,0,0,0.15)", animation: "fade-up .2s ease both" }}>
                {Object.keys(VISA_DATA).map(c => (
                  <button key={c} className="visa-opt" onClick={() => { setCountry(c); setOpen(false); }} style={{ background: c === country ? "rgba(35,197,94,0.08)" : "none", color: c === country ? G.mint : G.wTextSub, fontWeight: c === country ? 700 : 500 }}>{c}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", marginBottom: 18 }}>
          {reqs.map((r, i) => (
            <div key={r} className="req-row" style={{ display: "flex", alignItems: "center", gap: 12, animation: `fade-up .3s ease ${i * 60}ms both` }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(35,197,94,0.1)", border: "1px solid rgba(35,197,94,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: G.mint }}><CheckIcon /></div>
              <span style={{ color: G.wText, fontSize: 13, fontFamily: FONT, fontWeight: 500 }}>{r}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setShowAll(true)} style={{ background: "none", border: "none", color: G.mint, fontWeight: 700, fontSize: 13, fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          View All Requirements
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </>
  );
}

/* FIXED: RecommendedJobsPanel — limited to 4 jobs (2×2 grid) to match Visa/Documents height */
function RecommendedJobsPanel() {
  const jobs = [
    { title: "Software Developer", company: "TechCorp Solutions", match: 92, logo: "TC", color: G.mint },
    { title: "Full Stack Developer", company: "CodeWave Inc.", match: 88, logo: "CW", color: G.sky },
    { title: "Backend Developer", company: "InnoSoft Systems", match: 85, logo: "IS", color: G.lavender },
    { title: "React Developer", company: "WebCraft Agency", match: 81, logo: "WC", color: G.gold },
  ];
  const [saved, setSaved] = useState({});
  const [showAll, setShowAll] = useState(false);
  return (
    <>
      {showAll && <AllJobsModal onClose={() => setShowAll(false)} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: G.wText, fontFamily: FONT, letterSpacing: -.5 }}>Recommended Jobs</div>
            <div style={{ color: G.wTextSub, fontSize: 11, fontFamily: FONT, marginTop: 2 }}>AI-matched for your profile</div>
          </div>
          <div style={{ padding: "4px 10px", borderRadius: 99, background: "rgba(35,197,94,0.08)", border: "1px solid rgba(35,197,94,0.2)", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: G.mint, animation: "pulse-dot 2s infinite" }} />
            <span style={{ color: G.mint, fontSize: 10, fontWeight: 700, fontFamily: FONT }}>LIVE</span>
          </div>
        </div>

        {/* 2×2 grid — 4 jobs only, matching the height of Visa (5 req rows) and Documents (4 doc rows) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1 }}>
          {jobs.map(job => (
            <div key={job.title} className="w-row-h" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)", background: G.wBg2, cursor: "pointer", transition: "all .15s" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: `${job.color}14`, border: `1px solid ${job.color}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: job.color, fontWeight: 900, fontSize: 12, fontFamily: FONT }}>{job.logo}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: G.wText, fontFamily: FONT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.title}</div>
                <div style={{ color: G.wTextSub, fontSize: 11, fontFamily: FONT, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.company}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                <div style={{ padding: "3px 8px", borderRadius: 99, background: `${job.color}12`, border: `1px solid ${job.color}28`, color: job.color, fontSize: 11, fontWeight: 800, fontFamily: FONT }}>{job.match}%</div>
                <button onClick={e => { e.stopPropagation(); setSaved(s => ({ ...s, [job.title]: !s[job.title] })); }} style={{ background: "none", border: "none", cursor: "pointer", color: saved[job.title] ? G.gold : G.wTextMuted, fontSize: 15, lineHeight: 1, padding: "2px 2px" }}>
                  {saved[job.title] ? "★" : "☆"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Browse All button */}
        <button onClick={() => setShowAll(true)} style={{ width: "100%", marginTop: 14, padding: "11px", borderRadius: 12, border: "1px solid rgba(35,197,94,0.2)", background: "rgba(35,197,94,0.06)", color: G.mint, fontWeight: 700, fontSize: 13, fontFamily: FONT, cursor: "pointer", transition: "all .15s", flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(35,197,94,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(35,197,94,0.06)"; }}>
          Browse All Jobs →
        </button>
      </div>
    </>
  );
}

const RIGHT_TABS = ["Visa", "Documents", "Jobs"];

function WorkRightPanel() {
  const [activeTab, setActiveTab] = useState("Visa");
  return (
    <div style={{ ...whiteCard(), position: "relative", overflow: "visible", animation: "fade-up .5s ease .3s both" }}>
      <div style={{ display: "flex", justifyContent: "center", position: "absolute", top: -22, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ display: "flex", gap: 3, background: "#1a2537", borderRadius: 999, padding: "4px 5px", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
          {RIGHT_TABS.map(t => (
            <button key={t} className="work-right-tab-btn" onClick={() => setActiveTab(t)}
              style={{ background: activeTab === t ? G.mint : "transparent", color: activeTab === t ? "#fff" : "#8a9bb5", fontWeight: activeTab === t ? 700 : 500 }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "36px 28px 28px" }}>
        {activeTab === "Visa" && <VisaRequirementsPanel />}
        {activeTab === "Documents" && <WorkDocumentsPanel />}
        {activeTab === "Jobs" && <RecommendedJobsPanel />}
      </div>
    </div>
  );
}

function Preferences() {
  const def = { city: "Toronto, Vancouver", relocation: "Yes", family: "Yes", remote: "Hybrid", salary: "CAD 70,000+", start: "Within 3 months" };
  const [prefs, setPrefs] = useState(def);
  const [modal, setModal] = useState(false);
  const fields = [
    { key: "city", label: "Preferred City", full: true },
    { key: "relocation", label: "Relocation Support", type: "select", options: ["Yes", "No", "Negotiable"] },
    { key: "family", label: "Family Relocation", type: "select", options: ["Yes", "No"] },
    { key: "remote", label: "Work Mode", type: "select", options: ["Remote", "Hybrid", "On-site"] },
    { key: "salary", label: "Salary Expectation" },
    { key: "start", label: "Available to Start", type: "select", options: ["Immediately", "Within 1 month", "Within 3 months", "Within 6 months"] },
  ];
  const items = [
    { l: "Preferred City", v: prefs.city, icon: "📍" },
    { l: "Relocation Support", v: prefs.relocation, icon: "🚚", hi: prefs.relocation === "Yes" },
    { l: "Family Relocation", v: prefs.family, icon: "👨‍👩‍👧", hi: prefs.family === "Yes" },
    { l: "Work Mode", v: prefs.remote, icon: "💼" },
    { l: "Salary Expectation", v: prefs.salary, icon: "💰" },
    { l: "Available to Start", v: prefs.start, icon: "📅" },
  ];
  return (
    <>
      {modal && <EditModal title="Preferences" fields={fields} values={prefs} onSave={v => setPrefs(v)} onClose={() => setModal(false)} />}
      <div className="card-lift" style={{ ...dk(), padding: "22px 24px", animation: "fade-up .5s ease .4s both", height: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: G.text, fontFamily: FONT, letterSpacing: -.5 }}>Preferences</div>
            <div style={{ color: G.textSub, fontSize: 11, fontFamily: FONT, marginTop: 2 }}>Work & relocation settings</div>
          </div>
          <button className="edit-btn" onClick={() => setModal(true)}><EditIcon /> Edit</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {items.map(p => (
            <div key={p.l} style={{ padding: "12px 14px", borderRadius: 14, background: p.hi ? "rgba(35,197,94,0.05)" : "rgba(255,255,255,0.02)", border: p.hi ? "1px solid rgba(35,197,94,0.18)" : "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ color: G.textSub, fontSize: 10, fontFamily: FONT, marginBottom: 5, display: "flex", alignItems: "center", gap: 4, fontWeight: 600, letterSpacing: .3 }}>
                <span>{p.icon}</span> {p.l}
              </div>
              <div style={{ color: p.hi ? G.mint : G.text, fontWeight: 800, fontSize: 13, fontFamily: FONT }}>{p.v}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ProfileCompletionCard({ profile }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(profile), 200); return () => clearTimeout(t); }, [profile]);
  return (
    <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 18, padding: "20px 22px", animation: "fade-up .5s ease .2s both", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#111827", fontFamily: FONT }}>Profile Completion</div>
        <div style={{ fontWeight: 900, fontSize: 18, color: G.mint, fontFamily: FONT }}>{profile}%</div>
      </div>
      <div style={{ background: "rgba(0,0,0,0.08)", borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 10 }}>
        <div style={{ width: `${w}%`, height: "100%", background: G.mint, borderRadius: 99, transition: "width 1.2s cubic-bezier(.22,1,.36,1)" }} />
      </div>
      <div style={{ color: "#6b7280", fontSize: 12, fontFamily: FONT, lineHeight: 1.5 }}>Complete your profile to get better job matches and opportunities.</div>
    </div>
  );
}

function WorkView({ profile }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <StatTile delay={0}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>}
          value="82%" label="Job Match Score" sublabel="Great Match" accent={G.mint}
        />
        <StatTile delay={80}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          value="12" label="Applied Jobs" sublabel="Total" accent={G.sky}
        />
        <StatTile delay={160}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          value="5" label="Interviews" sublabel="Scheduled" accent={G.lavender}
        />
        <StatTile delay={240}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          value="" label="Visa Status" sublabel="In Progress" subColor="#f59e0b" accent="#f59e0b"
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14, alignItems: "stretch" }}>
        <CareerSnapshot />
        <Preferences />
      </div>
      <div style={{ paddingTop: 24 }}>
        <WorkRightPanel />
      </div>
    </div>
  );
}

function SegBar({ value, color = G.mint, total = 16, delay = 0 }) {
  const [filled, setFilled] = useState(0);
  useEffect(() => { const t = setTimeout(() => setFilled(Math.round((value / 100) * total)), delay + 100); return () => clearTimeout(t); }, [value, total, delay]);
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: total }, (_, i) => <div key={i} style={{ flex: 1, height: 12, borderRadius: 3, background: i < filled ? color : "rgba(255,255,255,0.07)", transition: `all 0.6s cubic-bezier(.22,1,.36,1) ${i * 30 + delay}ms`, transform: i < filled ? "scaleY(1)" : "scaleY(0.6)" }} />)}
    </div>
  );
}

function SlimBarFull({ value, color = G.mint, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), delay + 80); return () => clearTimeout(t); }, [value]);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ color: G.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{value}%</span>
        <span style={{ color, fontSize: 11, fontWeight: 800 }}>{value}%</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 6 }}>
        <div style={{ width: `${w}%`, height: "100%", borderRadius: 99, background: color, transition: `width 1.4s cubic-bezier(.22,1,.36,1) ${delay}ms` }} />
      </div>
      <SegBar value={value} color={color} delay={delay + 200} />
    </div>
  );
}

function Donut({ pct = 60, size = 200, stroke = 18 }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf, s;
    const step = ts => { if (!s) s = ts; const t = Math.min((ts - s) / 1400, 1); setP(Math.round((1 - Math.pow(1 - t, 4)) * pct)); if (t < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [pct]);
  const offset = circ - (p / 100) * circ, cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={G.mint} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }} />
      <text x={cx} y={cy - 12} textAnchor="middle" fill={G.mint} fontSize={42} fontWeight={800} fontFamily={FONT}>{p}%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={G.textSub} fontSize={12} fontFamily={FONT} fontWeight={500} letterSpacing={1}>OVERALL</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fill={G.textMuted} fontSize={10} fontFamily={FONT}>PROGRESS</text>
    </svg>
  );
}

const EVENTS = {
  "2026-10-05": [{ l: "UofT Deadline", c: G.coral, type: "deadline" }],
  "2026-10-12": [{ l: "UBC App Due", c: G.coral, type: "deadline" }],
  "2026-10-15": [{ l: "Scholarship Close", c: G.gold, type: "scholarship" }],
  "2026-10-20": [{ l: "McGill Deadline", c: G.coral, type: "deadline" }],
  "2026-10-22": [{ l: "IELTS Results", c: G.mint, type: "announcement" }],
  "2026-10-25": [{ l: "Visa Interview", c: G.lavender, type: "interview" }],
  "2026-10-31": [{ l: "SOP Final Sub", c: G.coral, type: "deadline" }],
};

function Calendar() {
  const [yr, setYr] = useState(2026), [mo, setMo] = useState(9), [sel, setSel] = useState(null);
  const MO = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DL = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  const fd = (new Date(yr, mo, 1).getDay() + 6) % 7, dim = new Date(yr, mo + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < fd; i++) cells.push({ d: new Date(yr, mo, -fd + i + 1).getDate(), cur: false, k: null });
  for (let d = 1; d <= dim; d++) { const k = `${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; cells.push({ d, cur: true, k }); }
  while (cells.length % 7) cells.push({ d: cells.length - fd - dim + 1, cur: false, k: null });
  const nav = dir => { const dt = new Date(yr, mo + dir); setYr(dt.getFullYear()); setMo(dt.getMonth()); };
  const upcoming = Object.entries(EVENTS).filter(([,v]) => v[0].type === "deadline").slice(0, 2);
  return (
    <div style={{ ...glass(), padding: 18, height: "100%", display: "flex", flexDirection: "column", animation: "fade-up .5s ease .2s both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <button onClick={() => nav(-1)} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.edge}`, color: G.textSub, width: 24, height: 24, borderRadius: 7, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
        <span style={{ color: G.text, fontWeight: 700, fontSize: 13, fontFamily: FONT, flex: 1, textAlign: "center" }}>{MO[mo]} {yr}</span>
        <button onClick={() => nav(1)} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.edge}`, color: G.textSub, width: 24, height: 24, borderRadius: 7, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
        {DL.map(d => <div key={d} style={{ textAlign: "center", color: G.textMuted, fontSize: 8, fontWeight: 700, fontFamily: FONT, padding: "2px 0", letterSpacing: .5 }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, flex: 1 }}>
        {cells.map((cell, i) => {
          const evs = cell.k ? (EVENTS[cell.k] || []) : [], isSel = sel === cell.k, hasDeadline = evs.some(e => e.type === "deadline");
          return (
            <div key={i} className="cal-c" onClick={() => cell.cur && setSel(isSel ? null : cell.k)} style={{ borderRadius: 7, padding: "3px 2px", minHeight: 42, cursor: cell.cur ? "pointer" : "default", background: isSel ? "rgba(35,197,94,0.1)" : hasDeadline && cell.cur ? "rgba(248,113,113,0.06)" : "transparent", border: `1px solid ${isSel ? G.mint + "55" : "transparent"}`, opacity: cell.cur ? 1 : 0.18, transition: "all .14s" }}>
              <div style={{ textAlign: "center", fontSize: 10, fontWeight: isSel ? 800 : 500, fontFamily: FONT, color: isSel ? G.mint : G.text, marginBottom: 2 }}>{cell.d}</div>
              {evs.map((ev, ei) => <div key={ei} style={{ background: `${ev.c}28`, borderRadius: 3, fontSize: 5.5, color: ev.c, padding: "1px 2px", marginBottom: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontWeight: 700, fontFamily: FONT, border: `1px solid ${ev.c}44` }}>{ev.l.split(" ").slice(0,2).join(" ")}</div>)}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 10, background: "#ffffff", borderRadius: 12, padding: "10px 12px" }}>
        <div style={{ color: "#9ca3af", fontSize: 9, fontWeight: 700, letterSpacing: .8, marginBottom: 6 }}>UPCOMING</div>
        {upcoming.map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: v[0].c, flexShrink: 0 }} />
            <span style={{ color: "#111827", fontSize: 11, fontWeight: 600, fontFamily: FONT, flex: 1 }}>{v[0].l}</span>
            <span style={{ color: "#6b7280", fontSize: 10, fontFamily: FONT }}>{k.slice(5).replace("-", "/")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocRow({ name, status, onUpload }) {
  const uploaded = status === "Uploaded", fileRef = useRef();
  const [fname, setFname] = useState(null);
  const handleFile = e => { const f = e.target.files[0]; if (f) { setFname(f.name.slice(0,18)+"…"); onUpload(name); } };
  return (
    <div className="w-row-h" onClick={() => !uploaded && fileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 14px", borderRadius: 12, cursor: uploaded ? "default" : "pointer", border: `1px solid ${uploaded ? "rgba(35,197,94,0.25)" : G.wEdge}`, background: uploaded ? "rgba(35,197,94,0.05)" : G.wBg2, transition: "all .2s" }}>
      <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFile} />
      <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: uploaded ? "rgba(35,197,94,0.1)" : "rgba(0,0,0,0.05)", border: `1px solid ${uploaded ? "rgba(35,197,94,0.3)" : G.wEdge}`, display: "flex", alignItems: "center", justifyContent: "center", color: uploaded ? G.wMint : G.wTextMuted }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>{uploaded && <path d="M9 13l2 2 4-4"/>}</svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: G.wText, fontWeight: 600, fontSize: 13, fontFamily: FONT }}>{name}</div>
        <div style={{ color: G.wTextMuted, fontSize: 10, fontFamily: FONT, marginTop: 1 }}>{fname || (uploaded ? "Verified ✓" : "Required")}</div>
      </div>
      <div style={{ padding: "4px 12px", borderRadius: 99, background: uploaded ? "rgba(35,197,94,0.1)" : "rgba(220,60,60,0.07)", border: `1px solid ${uploaded ? "rgba(35,197,94,0.3)" : "rgba(220,60,60,0.2)"}`, color: uploaded ? G.wMint : G.wCoral, fontSize: 10, fontWeight: 700, fontFamily: FONT, letterSpacing: .5, flexShrink: 0 }}>
        {uploaded ? "UPLOADED" : "PENDING"}
      </div>
    </div>
  );
}

function UniversitiesTab() {
  const unis = [{ name: "University of Toronto", loc: "Toronto, Canada", match: 92, rank: "#1 Canada", logo: "UT" }, { name: "UBC Vancouver", loc: "Vancouver, Canada", match: 90, rank: "#2 Canada", logo: "UBC" }, { name: "McGill University", loc: "Montreal, Canada", match: 85, rank: "#3 Canada", logo: "MC" }];
  const [bars, setBars] = useState([0, 0, 0]);
  useEffect(() => { const t = setTimeout(() => setBars(unis.map(u => u.match)), 120); return () => clearTimeout(t); }, []);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div><div style={{ fontWeight: 800, fontSize: 16, color: G.wText, fontFamily: FONT }}>Recommended Universities</div><div style={{ color: G.wTextSub, fontSize: 12, fontFamily: FONT, marginTop: 3 }}>AI-matched based on your profile</div></div>
        <div style={{ background: "rgba(35,197,94,0.08)", border: "1px solid rgba(35,197,94,0.25)", borderRadius: 10, padding: "5px 14px", fontSize: 11, color: G.wMint, fontWeight: 700, fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: G.wMint }} /> AI Matching Active</div>
      </div>
      {unis.map((u, i) => (
        <div key={u.name} className="w-row-h" style={{ padding: "14px 18px", background: G.wBg2, borderRadius: 14, border: `1px solid ${G.wEdge}`, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 10 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(35,197,94,0.08)", border: "1px solid rgba(35,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: G.wMint, fontWeight: 900, fontSize: 11, fontFamily: FONT }}>{u.logo}</span></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}><span style={{ fontWeight: 700, fontSize: 14, color: G.wText, fontFamily: FONT }}>{u.name}</span><span style={{ background: "rgba(0,0,0,0.06)", color: G.wTextSub, fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 600, fontFamily: FONT }}>{u.rank}</span></div>
            <div style={{ color: G.wTextSub, fontSize: 12, fontFamily: FONT, marginBottom: 8 }}>🇨🇦 {u.loc}</div>
            <div style={{ background: "rgba(0,0,0,0.07)", borderRadius: 99, height: 4, overflow: "hidden" }}><div style={{ width: `${bars[i]}%`, height: "100%", background: G.wMint, borderRadius: 99, transition: `width 1.2s cubic-bezier(.22,1,.36,1) ${i * 120}ms` }} /></div>
          </div>
          <div style={{ background: "rgba(35,197,94,0.08)", border: "1px solid rgba(35,197,94,0.22)", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}><div style={{ fontWeight: 900, fontSize: 18, color: G.wMint, fontFamily: FONT, lineHeight: 1 }}>{u.match}%</div><div style={{ color: G.wTextSub, fontSize: 9, fontWeight: 700, fontFamily: FONT, marginTop: 2 }}>MATCH</div></div>
        </div>
      ))}
    </div>
  );
}

function InsightsTab() {
  const [animVals, setAnimVals] = useState([0,0,0]);
  const insights = [{ label: "Admission Probability", val: 82, color: G.wMint }, { label: "Scholarship Eligibility", val: 68, color: "#818cf8" }, { label: "Visa Approval Chance", val: 77, color: G.lavender }];
  const stats = [{ label: "Profile", val: "Strong", icon: "🧠" }, { label: "Tasks", val: "3", icon: "⏰" }, { label: "Days Left", val: "42", icon: "📅" }, { label: "Acceptance", val: "72%", icon: "📊" }];
  useEffect(() => { const t = setTimeout(() => setAnimVals([82,68,77]), 120); return () => clearTimeout(t); }, []);
  return (
    <div>
      <div style={{ background: G.wBg2, border: `1px solid ${G.wEdge}`, borderRadius: 16, padding: "18px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(0,0,0,0.05)", border: `1px solid ${G.wEdge}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧠</div>
        <div><div style={{ color: G.wText, fontWeight: 800, fontSize: 16, fontFamily: FONT }}>AI Insights</div><div style={{ color: G.wTextSub, fontSize: 12, fontFamily: FONT, marginTop: 2 }}>Personalized analysis based on your profile</div></div>
        <div style={{ marginLeft: "auto", background: "rgba(35,197,94,0.08)", border: "1px solid rgba(35,197,94,0.22)", borderRadius: 99, padding: "4px 12px", display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: G.wMint }} /><span style={{ color: G.wMint, fontSize: 10, fontWeight: 700, fontFamily: FONT }}>LIVE</span></div>
      </div>
      <div style={{ background: G.wBg2, border: `1px solid ${G.wEdge}`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: G.wTextSub, fontFamily: FONT, marginBottom: 16, letterSpacing: .8 }}>PROBABILITY ANALYSIS</div>
        {insights.map((item, i) => (
          <div key={item.label} style={{ marginBottom: i < 2 ? 16 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}><span style={{ color: G.wText, fontSize: 13, fontWeight: 600, fontFamily: FONT }}>{item.label}</span><span style={{ fontWeight: 900, fontSize: 15, color: item.color, fontFamily: FONT }}>{item.val}%</span></div>
            <div style={{ background: "rgba(0,0,0,0.07)", borderRadius: 99, height: 6, overflow: "hidden" }}><div style={{ width: `${animVals[i]}%`, height: "100%", background: item.color, borderRadius: 99, transition: `width 1.3s cubic-bezier(.22,1,.36,1) ${i * 150}ms` }} /></div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {stats.map(s => <div key={s.label} style={{ background: G.wBg2, border: `1px solid ${G.wEdge}`, borderRadius: 12, padding: "14px 10px", textAlign: "center" }}><div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div><div style={{ fontWeight: 900, fontSize: 15, color: G.wText, fontFamily: FONT }}>{s.val}</div><div style={{ color: G.wTextMuted, fontSize: 10, fontFamily: FONT, marginTop: 3 }}>{s.label}</div></div>)}
      </div>
    </div>
  );
}

const POSTS = [
  { id: 1, author: "Ayesha Khan", avatar: "AK", time: "2 days ago", category: "Experience", categoryColor: "rgba(35,197,94,0.12)", categoryText: "#23c55e", title: "My journey of getting admission in Canada 🇨🇦", excerpt: "I wanted to share my complete journey of getting admission in a Canadian university. From choosing the right program to preparing documents and SOP...", tags: ["Canada", "Admission", "Study Abroad"], likes: 128, comments: 36, hasImage: true, imgUrl: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&q=80" },
  { id: 2, author: "Ayesha Khan", avatar: "AK", time: "1 week ago", category: "Question", categoryColor: "rgba(250,191,36,0.12)", categoryText: "#f59e0b", title: "Which country is best for MS in Computer Science?", excerpt: "I'm confused between Canada, UK and Australia for MS in CS. I'm looking for good universities, PR opportunities and part-time work options.", tags: ["MS in CS", "Canada", "UK", "Australia"], likes: 87, comments: 64, hasImage: false },
  { id: 3, author: "Ayesha Khan", avatar: "AK", time: "2 weeks ago", category: "Scholarship", categoryColor: "rgba(167,139,250,0.12)", categoryText: "#a78bfa", title: "Finally received my scholarship! 🎉", excerpt: "Thrilled to share that I've been awarded a 50% scholarship for my Master's program. Hard work really pays off!", tags: ["Scholarship", "Funding", "Masters"], likes: 142, comments: 52, hasImage: true, imgUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80" },
];
const COMMUNITIES = [{ name: "Study Abroad", members: "12.5K", emoji: "🌍", bg: "rgba(35,197,94,0.1)" }, { name: "Computer Science", members: "8.1K", emoji: "💻", bg: "rgba(99,102,241,0.1)" }, { name: "Scholarships", members: "6.3K", emoji: "🎓", bg: "rgba(250,191,36,0.1)" }, { name: "International Students", members: "9.2K", emoji: "👥", bg: "rgba(167,139,250,0.1)" }];
const TRENDING = [{ flag: "🇨🇦", country: "Canada", students: "24.5K" }, { flag: "🇦🇺", country: "Australia", students: "18.7K" }, { flag: "🇬🇧", country: "UK", students: "15.2K" }, { flag: "🇩🇪", country: "Germany", students: "11.3K" }, { flag: "🇺🇸", country: "USA", students: "9.8K" }];

function PostCard({ post, delay = 0 }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="post-card" style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginBottom: 14, overflow: "hidden", animation: `fade-up .4s ease ${delay}ms both` }}>
      <div style={{ padding: "20px 22px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: G.mint, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, fontFamily: FONT, flexShrink: 0 }}>{post.avatar}</div>
            <div><div style={{ fontWeight: 700, fontSize: 14, color: "#111827", fontFamily: FONT }}>{post.author}</div><div style={{ color: "#9ca3af", fontSize: 11, fontFamily: FONT }}>{post.time}</div></div>
          </div>
          <span style={{ padding: "4px 12px", borderRadius: 99, background: post.categoryColor, color: post.categoryText, fontSize: 11, fontWeight: 700, fontFamily: FONT }}>⚡ {post.category}</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: "#111827", fontFamily: FONT, lineHeight: 1.35, marginBottom: 8 }}>{post.title}</h3>
            <p style={{ color: "#6b7280", fontSize: 13, fontFamily: FONT, lineHeight: 1.6, marginBottom: 12 }}>{post.excerpt}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{post.tags.map(tag => <span key={tag} style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "rgba(35,197,94,0.1)", color: "#23c55e", border: "1px solid rgba(35,197,94,0.22)" }}>{tag}</span>)}</div>
          </div>
          {post.hasImage && <div style={{ width: 120, height: 80, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}><img src={post.imgUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} /></div>}
        </div>
      </div>
      <div style={{ padding: "10px 22px 14px", borderTop: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 4 }}>
        <button className="action-btn" onClick={() => setLiked(l => !l)} style={{ color: liked ? "#ef4444" : "#6b7280" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button className="action-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>{post.comments}</button>
        <button className="action-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Share</button>
      </div>
    </div>
  );
}

function PostView() {
  const [activeTab, setActiveTab] = useState("All Posts");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, animation: "fade-up .4s ease both" }}>
      <div>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 800, fontSize: 22, color: G.text, fontFamily: FONT, letterSpacing: -.5 }}>My Posts</h2>
          <p style={{ color: G.textSub, fontSize: 13, fontFamily: FONT, marginTop: 3 }}>All the posts you've shared in the community.</p>
        </div>
        <div style={{ display: "flex", borderBottom: "2px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
          {["All Posts", "Saved Posts"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 20px", borderRadius: 0, border: "none", background: "transparent", cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? G.text : G.textSub, borderBottom: activeTab === tab ? `2px solid ${G.mint}` : "2px solid transparent", marginBottom: -2, transition: "all .15s" }}>{tab}</button>
          ))}
        </div>
        {POSTS.map((p, i) => <PostCard key={p.id} post={p} delay={i * 80} />)}
      </div>
      <div>
        <div style={{ background: "#1a2537", borderRadius: 18, padding: 20, marginBottom: 16, border: "1px solid rgba(255,255,255,0.07)", animation: "fade-up .4s ease .1s both" }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: G.text, fontFamily: FONT, marginBottom: 4 }}>My Communities</div>
          <div style={{ color: G.textSub, fontSize: 11, fontFamily: FONT, marginBottom: 16 }}>Communities you're part of</div>
          {COMMUNITIES.map(c => (
            <div key={c.name} className="comm-row" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{c.emoji}</div>
              <div><div style={{ fontWeight: 700, fontSize: 13, color: G.text, fontFamily: FONT }}>{c.name}</div><div style={{ color: G.textSub, fontSize: 11, fontFamily: FONT }}>{c.members} Members</div></div>
            </div>
          ))}
          <button style={{ marginTop: 8, background: "none", border: "none", color: G.mint, fontWeight: 700, fontSize: 12, fontFamily: FONT, cursor: "pointer" }}>View All Communities →</button>
        </div>
        <div style={{ background: "#1a2537", borderRadius: 18, padding: 20, border: "1px solid rgba(255,255,255,0.07)", animation: "fade-up .4s ease .18s both" }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: G.text, fontFamily: FONT, marginBottom: 4 }}>Top Trending</div>
          <div style={{ color: G.textSub, fontSize: 11, fontFamily: FONT, marginBottom: 16 }}>Top dream countries among students</div>
          {TRENDING.map((t, i) => (
            <div key={t.country} className="trend-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 6px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <span style={{ color: G.textMuted, fontWeight: 700, fontSize: 12, fontFamily: FONT, minWidth: 16 }}>{i+1}</span>
              <span style={{ fontSize: 22 }}>{t.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: G.text, fontFamily: FONT }}>{t.country}</div>
                <div style={{ color: G.textSub, fontSize: 11, fontFamily: FONT }}>{t.students} students</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [topTab, setTopTab] = useState("Student");
  const [docTab, setDocTab] = useState("Document");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [name, setName] = useState("Novera Ahmed");
  const [profile, setProfile] = useState(75);
  const [uploaded, setUploaded] = useState({ Passport: true, "Academic Transcript": true, "Degree Certificate": true });

  const docs = ["Passport", "Academic Transcript", "Degree Certificate", "SOP", "Bank Statement", "Medical Report"].map(n => ({ name: n, status: uploaded[n] ? "Uploaded" : "Pending" }));
  const upCount = docs.filter(d => d.status === "Uploaded").length;
  const docPct = Math.round((upCount / 16) * 100);
  const handleUpload = useCallback(n => { setUploaded(p => ({ ...p, [n]: true })); setProfile(p => Math.min(100, p + 3)); }, []);

  const handleProfileSave = ({ name: newName }) => {
    setName(newName);
    setProfile(p => Math.min(100, p + 5));
  };

  const TOP = ["Student", "Work", "Post"];
  const BTABS = ["Document", "University", "Insight"];

  const NeonBadge = ({ label, value, color = G.mint, delay = 0 }) => (
    <div style={{ background: `${color}10`, border: `1px solid ${color}28`, borderRadius: 12, padding: "10px 16px", animation: `fade-up .5s ease ${delay}ms both` }}>
      <div style={{ color, fontWeight: 800, fontSize: 18, fontFamily: FONT, letterSpacing: -.5, lineHeight: 1 }}>{value}</div>
      <div style={{ color: G.textSub, fontSize: 10, fontFamily: FONT, marginTop: 3, fontWeight: 500, letterSpacing: .5 }}>{label.toUpperCase()}</div>
    </div>
  );

  const Topbar = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, animation: "fade-up .5s ease both" }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, fontFamily: FONT, letterSpacing: -1.5, lineHeight: 1, color: G.text }}>
          Welcome back, <span style={{ color: G.mint }}>{name.split(" ")[0]}</span>
          <span style={{ color: G.mint, marginLeft: 4, animation: "float 3s ease-in-out infinite", display: "inline-block" }}>✦</span>
        </h1>
        <p style={{ margin: "5px 0 0", color: G.textSub, fontSize: 13, fontFamily: FONT, fontWeight: 500 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · Student Portal
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ background: "#fff", borderRadius: 999, padding: "4px 5px", display: "flex", gap: 2, border: "1px solid rgba(255,255,255,0.15)" }}>
          {TOP.map(t => <button key={t} onClick={() => setTopTab(t)} style={{ padding: "7px 18px", borderRadius: 999, border: "none", cursor: "pointer", background: topTab === t ? G.mint : "transparent", color: topTab === t ? "#fff" : "#374151", fontWeight: topTab === t ? 700 : 500, fontSize: 12, fontFamily: FONT, transition: "all .2s" }}>{t}</button>)}
        </div>
        <button className="btn-g" onClick={() => setEditProfileOpen(true)}
          style={{ background: G.mint, color: "#fff", border: "none", borderRadius: 999, padding: "9px 20px", fontWeight: 700, fontSize: 12, fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 2px 10px rgba(35,197,94,0.3)" }}>
          <EditIcon /> Edit Profile
        </button>
      </div>
    </div>
  );

  return (
    <>
      {editProfileOpen && (
        <EditProfileModal
          name={name}
          onSave={handleProfileSave}
          onClose={() => setEditProfileOpen(false)}
        />
      )}

      {topTab === "Post" && (
        <div style={{ minHeight: "100vh", background: G.deep, fontFamily: FONT, padding: "22px 26px" }}>
          <Topbar /><PostView />
        </div>
      )}

      {topTab === "Work" && (
        <div style={{ minHeight: "100vh", background: G.deep, fontFamily: FONT, padding: "22px 26px" }}>
          <Topbar />
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="card-h" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 22, overflow: "hidden", display: "flex", flexDirection: "column", animation: "fade-up .5s ease .1s both", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
                <div style={{ position: "relative", height: 160, overflow: "hidden", flexShrink: 0 }}>
                  <img src="https://images.unsplash.com/photo-1564805280186-5d7056d538ca?q=80&w=765&auto=format&fit=crop" alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} onError={e => { e.target.style.background = "#e8f8f0"; }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.25) 100%)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(35,197,94,0.2)", backdropFilter: "blur(10px)", border: "1px solid rgba(35,197,94,0.4)", borderRadius: 99, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: G.mint, letterSpacing: .5 }}>WORK</div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -.5, color: "#111827", marginBottom: 2, fontFamily: FONT }}>{name}</div>
                  <div style={{ color: "#6b7280", fontSize: 11, fontFamily: FONT, marginBottom: 12 }}>novera.ahmed@gmail.com</div>
                  {[{ l: "📍 Location", v: "Dhaka, Bangladesh" }, { l: "🌍 Nationality", v: "Bangladeshi" }, { l: "📅 Date of Birth", v: "May 17, 2002" }, { l: "👤 Gender", v: "Female" }, { l: "🛂 Passport", v: "A12345678" }].map(row => (
                    <div key={row.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      <span style={{ color: "#9ca3af", fontSize: 11 }}>{row.l}</span>
                      <span style={{ fontWeight: 600, fontSize: 11, color: "#111827" }}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ProfileCompletionCard profile={profile} />
            </div>
            <div><WorkView profile={profile} /></div>
          </div>
        </div>
      )}

      {topTab === "Student" && (
        <div style={{ minHeight: "100vh", background: G.deep, fontFamily: FONT, padding: "22px 26px" }}>
          <Topbar />
          <div style={{ display: "flex", gap: 12, marginBottom: 16, animation: "fade-up .5s ease .1s both" }}>
            <div style={{ ...glass(), padding: "14px 18px", minWidth: 150 }}><span style={{ color: G.textSub, fontSize: 10, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 10 }}>VISA STATUS</span><SlimBarFull value={15} color={G.coral} delay={0} /></div>
            <div style={{ ...glass(), flex: 2, padding: "14px 18px" }}><span style={{ color: G.textSub, fontSize: 10, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 10 }}>PROFILE COMPLETION</span><SlimBarFull value={profile} color={G.mint} delay={80} /></div>
            <div style={{ ...glass(), flex: 2, padding: "14px 18px" }}><span style={{ color: G.textSub, fontSize: 10, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 10 }}>SKILL LEVEL</span><SlimBarFull value={50} color={G.lavender} delay={160} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "270px 1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div className="card-h" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 22, overflow: "hidden", display: "flex", flexDirection: "column", animation: "fade-up .5s ease .15s both", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
              <div style={{ position: "relative", height: 210, overflow: "hidden", flexShrink: 0 }}>
                <img src="https://images.unsplash.com/photo-1564805280186-5d7056d538ca?q=80&w=765&auto=format&fit=crop" alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} onError={e => { e.target.style.background = "#e8f8f0"; }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />
                <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(35,197,94,0.18)", backdropFilter: "blur(10px)", border: "1px solid rgba(35,197,94,0.4)", borderRadius: 99, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: G.mint, letterSpacing: .5 }}>STUDENT</div>
              </div>
              <div style={{ padding: "16px 18px", flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: -.5, color: "#111", marginBottom: 14, fontFamily: FONT }}>{name}</div>
                {[{ l: "📍 Location", v: "Dhaka" }, { l: "🌍 Nationality", v: "Bangladeshi" }, { l: "🎓 Education", v: "Undergrad" }, { l: "✈️ Destination", v: "Canada 🇨🇦" }].map(row => (
                  <div key={row.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <span style={{ color: "#9ca3af", fontSize: 12 }}>{row.l}</span>
                    <span style={{ fontWeight: 600, fontSize: 12, color: "#111" }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-h" style={{ ...glass(), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 18, animation: "fade-up .5s ease .2s both" }}>
              <Donut pct={60} size={200} stroke={18} />
              <div style={{ color: G.text, fontWeight: 700, fontSize: 18, fontFamily: FONT, letterSpacing: -.5 }}>Overall Progress</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, width: "100%" }}>
                <NeonBadge label="Documents" value={`${docPct}%`} color={G.mint} delay={0} />
                <NeonBadge label="Profile" value={`${profile}%`} color="#a5f3fc" delay={80} />
                <NeonBadge label="Skills" value="50%" color={G.lavender} delay={160} />
              </div>
            </div>
            <Calendar />
          </div>
          <div style={{ ...whiteCard(), position: "relative", overflow: "visible", animation: "fade-up .5s ease .35s both" }}>
            <div style={{ display: "flex", justifyContent: "center", position: "absolute", top: -22, left: 0, right: 0, zIndex: 10 }}>
              <div style={{ display: "flex", gap: 3, background: "#1a2537", borderRadius: 999, padding: "4px 5px", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
                {BTABS.map(t => <button key={t} onClick={() => setDocTab(t)} style={{ padding: "9px 28px", borderRadius: 999, border: "none", cursor: "pointer", background: docTab === t ? G.wMint : "transparent", color: docTab === t ? "#fff" : "#8a9bb5", fontWeight: docTab === t ? 700 : 500, fontSize: 13, fontFamily: FONT, transition: "all .2s" }}>{t}</button>)}
              </div>
            </div>
            <div style={{ padding: "36px 28px 28px" }}>
              {docTab === "Document" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
                    <div><div style={{ color: G.wText, fontWeight: 800, fontSize: 16, fontFamily: FONT }}>Document Upload</div><div style={{ color: G.wTextSub, fontSize: 12, fontFamily: FONT, marginTop: 3 }}>{upCount} of 16 documents submitted</div></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ textAlign: "right" }}><div style={{ color: G.wMint, fontWeight: 900, fontSize: 22, fontFamily: FONT, letterSpacing: -1, lineHeight: 1 }}>{docPct}%</div><div style={{ color: G.wTextMuted, fontSize: 10, fontFamily: FONT, letterSpacing: .5 }}>COMPLETE</div></div>
                      <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="16" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="5"/><circle cx="22" cy="22" r="16" fill="none" stroke={G.wMint} strokeWidth="5" strokeLinecap="round" strokeDasharray={2*Math.PI*16} strokeDashoffset={2*Math.PI*16*(1-docPct/100)} style={{ transform: "rotate(-90deg)", transformOrigin: "22px 22px", transition: "stroke-dashoffset .9s cubic-bezier(.22,1,.36,1)" }}/></svg>
                    </div>
                  </div>
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>{Array.from({ length: 16 }, (_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < upCount ? G.wMint : "rgba(0,0,0,0.08)", transition: `all .6s ease ${i * 40}ms` }} />)}</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: G.wTextMuted, fontSize: 10, fontFamily: FONT }}>{upCount} uploaded</span><span style={{ color: G.wTextMuted, fontSize: 10, fontFamily: FONT }}>{16 - upCount} remaining</span></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: G.wMint }} /><span style={{ color: G.wTextSub, fontSize: 10, fontWeight: 700, fontFamily: FONT, letterSpacing: .8 }}>UPLOADED</span></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{docs.filter(d => d.status === "Uploaded").map(d => <DocRow key={d.name} name={d.name} status={d.status} onUpload={handleUpload} />)}</div>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: G.wCoral }} /><span style={{ color: G.wTextSub, fontSize: 10, fontWeight: 700, fontFamily: FONT, letterSpacing: .8 }}>PENDING</span></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{docs.filter(d => d.status !== "Uploaded").map(d => <DocRow key={d.name} name={d.name} status={d.status} onUpload={handleUpload} />)}</div>
                    </div>
                  </div>
                </div>
              )}
              {docTab === "University" && <UniversitiesTab />}
              {docTab === "Insight" && <InsightsTab />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
