import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Target, ArrowRight,
  TrendingUp, Award, Globe, Shield, GraduationCap,
  CheckCircle, Clock, FileText, Bell,
  LogOut, Building, DollarSign, Users, BarChart3,
  Home, X
} from 'lucide-react';

// ─── SHARED NAVIGATION STATE ──────────────────────────────────────────────────
// activePage: 'home' | 'recommend' | 'dream'

// ═════════════════════════════════════════════════════════════════════════════
// RECOMMENDATION PAGE INTERNALS
// ═════════════════════════════════════════════════════════════════════════════
const T = {
  white:"#ffffff", bg:"#f5f7fa", navy:"#0b1120", navyLight:"#1e2d47",
  green:"#23c55e", greenHover:"#1aaa4e", greenLight:"#edfaf2", greenMid:"#bbf7d0",
  border:"#e5e9f0", borderFocus:"#23c55e",
  text:"#0b1120", textMid:"#374151", textMuted:"#6b7280", textDim:"#9ca3af",
  red:"#ef4444", redLight:"#fff0f0",
  amber:"#f59e0b", amberLight:"#fffbeb",
  blue:"#3b82f6", blueLight:"#eff6ff",
  purple:"#8b5cf6", purpleLight:"#f5f3ff",
  teal:"#0891b2", tealLight:"#ecfeff",
  shadow:"0 1px 3px rgba(11,17,32,0.06),0 4px 16px rgba(11,17,32,0.06)",
  shadowMd:"0 4px 6px rgba(11,17,32,0.05),0 10px 32px rgba(11,17,32,0.10)",
  shadowLg:"0 8px 16px rgba(11,17,32,0.06),0 24px 48px rgba(11,17,32,0.12)",
};

let _n = 0; const uid = () => `uid_${++_n}`;

const Ic = ({ p, size=16, c="currentColor", sw=1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d={p}/>
  </svg>
);
const I = {
  cap:   "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
  bolt:  "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  list:  "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  book:  "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 014 17V5a2 2 0 012-2h14a2 2 0 012 2v12",
  plus:  "M12 5v14M5 12h14",
  x:     "M18 6L6 18M6 6l12 12",
  chev:  "M9 18l6-6-6-6",
  spark: "M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 4.5L19 9l-4.5 1.5L13 15l-1.5-4.5L7 9l4.5-1.5L13 3z",
  eye:   "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  award: "M12 15l-5 6 5-3 5 3zM12 15a6 6 0 100-12 6 6 0 000 12z",
  link:  "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  check: "M20 6L9 17l-5-5",
  user:  "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  arr:   "M5 12h14M12 5l7 7-7 7",
  globe: "M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20",
  close: "M18 6L6 18M6 6l12 12",
  loader:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
};

const baseIn = {
  width:"100%", padding:"10px 13px", background:T.white,
  border:`1.5px solid ${T.border}`, borderRadius:10, color:T.text,
  fontSize:13.5, fontFamily:"'Manrope',sans-serif", outline:"none",
  transition:"border-color 0.18s,box-shadow 0.18s",
};

const RField = ({ label, children, hint }) => (
  <div style={{marginBottom:16}}>
    {label && <label style={{display:"block",fontSize:11.5,fontWeight:700,color:T.textMuted,marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</label>}
    {children}
    {hint && <p style={{fontSize:11,color:T.textDim,marginTop:4}}>{hint}</p>}
  </div>
);

const FInput = ({ style, onFocus, onBlur, ...rest }) => {
  const [f,sf] = useState(false);
  return <input {...rest}
    style={{...baseIn,...(f?{borderColor:T.borderFocus,boxShadow:`0 0 0 3px rgba(35,197,94,0.15)`}:{}),...style}}
    onFocus={e=>{sf(true);onFocus?.(e);}} onBlur={e=>{sf(false);onBlur?.(e);}}/>;
};

const FSelect = ({ children, style, onFocus, onBlur, ...rest }) => {
  const [f,sf] = useState(false);
  return (
    <select {...rest}
      style={{...baseIn,cursor:"pointer",appearance:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center",paddingRight:34,
        ...(f?{borderColor:T.borderFocus,boxShadow:`0 0 0 3px rgba(35,197,94,0.15)`}:{}),...style}}
      onFocus={e=>{sf(true);onFocus?.(e);}} onBlur={e=>{sf(false);onBlur?.(e);}}>
      {children}
    </select>
  );
};

const FTextarea = ({ style, onFocus, onBlur, ...rest }) => {
  const [f,sf] = useState(false);
  return <textarea {...rest}
    style={{...baseIn,minHeight:76,resize:"vertical",...(f?{borderColor:T.borderFocus,boxShadow:`0 0 0 3px rgba(35,197,94,0.15)`}:{}),...style}}
    onFocus={e=>{sf(true);onFocus?.(e);}} onBlur={e=>{sf(false);onBlur?.(e);}}/>;
};

const GreenBtn = ({ children, onClick, small, icon, disabled, full }) => {
  const [h,sh] = useState(false);
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,
        padding:small?"8px 16px":"12px 22px",
        width:full?"100%":"auto",
        background:disabled?T.textDim:(h?T.greenHover:T.green),
        border:"none",borderRadius:small?8:11,color:T.white,
        fontSize:small?12.5:14,fontWeight:700,cursor:disabled?"not-allowed":"pointer",
        fontFamily:"'Manrope',sans-serif",transition:"all 0.18s",
        transform:(!disabled&&h)?"translateY(-1px)":"none",
        boxShadow:(!disabled&&h)?`0 6px 18px rgba(35,197,94,0.35)`:`0 2px 8px rgba(35,197,94,0.2)`,
        opacity:disabled?0.6:1}}
      onMouseEnter={()=>!disabled&&sh(true)} onMouseLeave={()=>sh(false)}>
      {icon && <Ic p={icon} size={small?13:16} c={T.white}/>}
      {children}
    </button>
  );
};

const RemBtn = ({ onClick }) => {
  const [h,sh] = useState(false);
  return (
    <button type="button" onClick={onClick}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
        width:28,height:28,background:h?T.redLight:"transparent",
        border:`1.5px solid ${h?T.red:T.border}`,borderRadius:7,
        color:h?T.red:T.textDim,cursor:"pointer",transition:"all 0.15s",flexShrink:0}}
      onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}>
      <Ic p={I.x} size={12}/>
    </button>
  );
};

const RToggle = ({ label, active, onClick, color=T.green }) => {
  const [h,sh] = useState(false);
  return (
    <button type="button" onClick={onClick}
      style={{flex:1,padding:"9px 6px",border:`1.5px solid ${active?color:T.border}`,
        borderRadius:9,background:active?`${color}12`:(h?T.bg:T.white),
        color:active?color:T.textMuted,fontWeight:700,fontSize:12.5,cursor:"pointer",
        fontFamily:"'Manrope',sans-serif",transition:"all 0.15s"}}
      onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}>
      {label}
    </button>
  );
};

const EntryCard = ({ children, onRemove, accent }) => {
  const [h,sh] = useState(false);
  return (
    <motion.div layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6,scale:0.97}}
      transition={{duration:0.2}}
      style={{display:"flex",alignItems:"flex-start",gap:12,padding:"13px 14px",
        background:h?T.bg:T.white,border:`1.5px solid ${h?T.border:"#edf0f5"}`,
        borderRadius:11,marginBottom:8,transition:"all 0.18s",
        boxShadow:h?T.shadowMd:T.shadow}}
      onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}>
      {accent&&<div style={{width:4,borderRadius:4,alignSelf:"stretch",background:accent,flexShrink:0}}/>}
      <div style={{flex:1,minWidth:0}}>{children}</div>
      <RemBtn onClick={onRemove}/>
    </motion.div>
  );
};

const AddForm = ({ children }) => (
  <div style={{background:T.bg,border:`1.5px dashed ${T.border}`,borderRadius:13,padding:"18px 18px 14px",marginBottom:16}}>
    {children}
  </div>
);

const NavyNote = ({ children }) => (
  <div style={{background:T.navy,borderRadius:10,padding:"11px 15px",marginBottom:18,display:"flex",alignItems:"flex-start",gap:9}}>
    <Ic p={I.spark} size={14} c={T.green}/>
    <span style={{fontSize:12.5,color:"rgba(255,255,255,0.75)",lineHeight:1.5,fontWeight:500}}>{children}</span>
  </div>
);

const SM = {
  education:{icon:I.cap,col:T.blue,soft:T.blueLight},
  tests:{icon:I.check,col:T.green,soft:T.greenLight},
  standardized:{icon:I.award,col:T.amber,soft:T.amberLight},
  activities:{icon:I.list,col:T.red,soft:T.redLight},
  skills:{icon:I.bolt,col:T.purple,soft:T.purpleLight},
  research:{icon:I.book,col:T.teal,soft:T.tealLight},
};

const RSection = ({ id, title, subtitle, isOpen, onToggle, count, children }) => {
  const m = SM[id];
  const [h,sh] = useState(false);
  return (
    <motion.div layout style={{background:T.white,
      border:`1.5px solid ${isOpen?m.col+"44":T.border}`,
      borderRadius:16,overflow:"hidden",
      boxShadow:isOpen?`0 8px 32px rgba(11,17,32,0.09)`:T.shadow,
      transition:"border-color 0.25s,box-shadow 0.25s"}}>
      <button type="button" onClick={onToggle}
        onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}
        style={{width:"100%",display:"flex",alignItems:"center",gap:14,
          padding:"18px 22px",background:h?T.bg:"none",border:"none",
          cursor:"pointer",textAlign:"left",transition:"background 0.15s"}}>
        <div style={{width:42,height:42,borderRadius:12,flexShrink:0,
          background:isOpen?m.col:m.soft,display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:isOpen?`0 4px 12px ${m.col}33`:"none",transition:"all 0.25s"}}>
          <Ic p={m.icon} size={18} c={isOpen?T.white:m.col} sw={2}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:15,fontWeight:800,color:T.text,letterSpacing:"-0.01em"}}>{title}</div>
          <div style={{fontSize:12,color:T.textMuted,marginTop:2}}>{subtitle}</div>
        </div>
        {count>0&&(
          <span style={{padding:"3px 10px",background:m.soft,color:m.col,
            borderRadius:20,fontSize:11.5,fontWeight:700,whiteSpace:"nowrap"}}>
            {count} {count===1?"entry":"entries"}
          </span>
        )}
        <motion.div animate={{rotate:isOpen?90:0}} transition={{duration:0.22}}>
          <Ic p={I.chev} size={16} c={isOpen?m.col:T.textDim} sw={2.5}/>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen&&(
          <motion.div key="body"
            initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
            exit={{height:0,opacity:0}} transition={{duration:0.28,ease:[0.4,0,0.2,1]}}
            style={{overflow:"hidden"}}>
            <div style={{borderTop:`1px solid ${T.border}`,padding:"22px 22px 24px"}}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AnalysisModal = ({ profile, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyze = async () => {
      try {
        const profileSummary = `
Education: ${profile.edu.level || "Not specified"}
${profile.edu.ugCgpa ? `Undergraduate CGPA: ${profile.edu.ugCgpa}` : ""}
${profile.edu.ugField ? `Field: ${profile.edu.ugField}` : ""}
${profile.edu.ugUniv ? `University: ${profile.edu.ugUniv}` : ""}
${profile.edu.sscGpa ? `SSC GPA: ${profile.edu.sscGpa}` : ""}
${profile.edu.hscGpa ? `HSC GPA: ${profile.edu.hscGpa}` : ""}
English Tests: ${profile.engTests.length > 0 ? profile.engTests.map(t => `${t.type}: ${t.score}`).join(", ") : "None"}
Standardized Tests: ${profile.stdTests.length > 0 ? profile.stdTests.map(t => `${t.type}: ${t.score} (Attempt ${t.attempt})`).join(", ") : "None"}
Extracurricular Activities (${profile.activities.length}):
${profile.activities.map(a => `- ${a.name} (${a.category}, ${a.achievement})`).join("\n") || "None"}
Skills (${profile.skills.length}):
${profile.skills.map(s => `${s.name} (${s.proficiency})`).join(", ") || "None"}
Research/Publications (${profile.papers.length}):
${profile.papers.map(p => `- ${p.title} [${p.status}]${p.domain ? " — " + p.domain : ""}`).join("\n") || "None"}`.trim();

        const prompt = `You are an expert international university admissions counselor. Analyze this student profile and provide:
1. A profile score out of 100
2. 2-3 key strengths
3. 2-3 areas to improve
4. Top 5 university recommendations with match percentage, country, scholarship potential (High/Medium/Low), and visa approval rate estimate
Student Profile:\n${profileSummary}
Respond ONLY with valid JSON in this exact structure, no markdown, no extra text:
{"score":<number 0-100>,"scoreLabel":"<Strong Profile|Competitive Profile|Developing Profile>","strengths":["<s1>","<s2>","<s3>"],"improvements":["<i1>","<i2>"],"universities":[{"name":"<name>","country":"<country>","match":<0-100>,"scholarship":"<High|Medium|Low>","visa":"<pct>","reason":"<one sentence>"}]}`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        const text = data.content.map(b => b.text || "").join("");
        const clean = text.replace(/```json|```/g, "").trim();
        setResults(JSON.parse(clean));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Analysis failed. Please try again.");
        setLoading(false);
      }
    };
    analyze();
  }, []);

  const matchColor = p => p >= 80 ? T.green : p >= 60 ? T.amber : T.red;

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"rgba(11,17,32,0.6)",backdropFilter:"blur(6px)",
        zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div initial={{scale:0.92,y:20}} animate={{scale:1,y:0}} exit={{scale:0.92,y:20}}
        style={{background:T.white,borderRadius:20,width:"100%",maxWidth:640,
          maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column",
          boxShadow:"0 24px 80px rgba(11,17,32,0.25)"}}>
        <div style={{background:T.navy,padding:"22px 26px",display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
          <div style={{width:44,height:44,borderRadius:12,background:T.green,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px rgba(35,197,94,0.4)`}}>
            <Ic p={I.spark} size={22} c={T.white} sw={2}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:800,color:T.white,letterSpacing:"-0.02em"}}>AI Profile Analysis</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:2}}>Powered by Claude AI</div>
          </div>
          <button type="button" onClick={onClose}
            style={{width:34,height:34,borderRadius:9,background:"rgba(255,255,255,0.08)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <Ic p={I.close} size={16} c="rgba(255,255,255,0.7)"/>
          </button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"26px"}}>
          {loading && (
            <div style={{textAlign:"center",padding:"48px 0"}}>
              <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} style={{display:"inline-block",marginBottom:20}}>
                <Ic p={I.loader} size={36} c={T.green} sw={2}/>
              </motion.div>
              <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Analyzing your profile…</div>
              <div style={{fontSize:13,color:T.textMuted}}>Claude is reviewing your academic background</div>
              <div style={{marginTop:24,display:"flex",flexDirection:"column",gap:8,maxWidth:320,margin:"24px auto 0"}}>
                {["Evaluating academic background","Checking test score compatibility","Assessing extracurriculars","Computing university matches"].map((s,i)=>(
                  <motion.div key={s} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.6+0.3}}
                    style={{display:"flex",alignItems:"center",gap:9,fontSize:12.5,color:T.textMuted}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:T.green,flexShrink:0}}/>
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {error && (
            <div style={{textAlign:"center",padding:"48px 0"}}>
              <div style={{fontSize:16,fontWeight:700,color:T.red,marginBottom:8}}>{error}</div>
              <GreenBtn onClick={onClose}>Close</GreenBtn>
            </div>
          )}
          {results && !loading && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}}>
              <div style={{background:T.navy,borderRadius:14,padding:"20px 24px",marginBottom:24,display:"flex",alignItems:"center",gap:20}}>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:48,fontWeight:900,color:T.green,lineHeight:1,letterSpacing:"-0.04em"}}>{results.score}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginTop:2}}>PROFILE SCORE</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:T.white,marginBottom:8}}>{results.scoreLabel}</div>
                  <div style={{height:7,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}}>
                    <motion.div initial={{width:0}} animate={{width:`${results.score}%`}} transition={{duration:1,ease:"easeOut"}}
                      style={{height:"100%",background:T.green,borderRadius:99}}/>
                  </div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:22}}>
                <div style={{background:T.greenLight,borderRadius:12,padding:"14px 16px",border:`1px solid ${T.greenMid}`}}>
                  <div style={{fontSize:11,fontWeight:800,color:T.greenHover,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Strengths</div>
                  {(results.strengths||[]).map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:7}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:T.green,flexShrink:0,marginTop:5}}/>
                      <span style={{fontSize:12.5,color:T.textMid,lineHeight:1.5}}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:T.amberLight,borderRadius:12,padding:"14px 16px",border:`1px solid rgba(245,158,11,0.2)`}}>
                  <div style={{fontSize:11,fontWeight:800,color:T.amber,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>To Improve</div>
                  {(results.improvements||[]).map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:7}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:T.amber,flexShrink:0,marginTop:5}}/>
                      <span style={{fontSize:12.5,color:T.textMid,lineHeight:1.5}}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{fontSize:12.5,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>Top University Matches</div>
              {(results.universities||[]).map((u,i)=>(
                <motion.div key={u.name} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                  style={{padding:"14px 16px",background:T.white,border:`1.5px solid ${T.border}`,borderRadius:12,marginBottom:10,boxShadow:T.shadow}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:10,fontWeight:800,padding:"2px 7px",background:T.bg,color:T.textMuted,borderRadius:20}}>#{i+1}</span>
                        <span style={{fontSize:14,fontWeight:800,color:T.text}}>{u.name}</span>
                      </div>
                      <div style={{fontSize:12,color:T.textMuted,display:"flex",gap:12,flexWrap:"wrap"}}>
                        <span>📍 {u.country}</span>
                        <span>🏆 Scholarship: {u.scholarship}</span>
                        <span>🛂 Visa: {u.visa}</span>
                      </div>
                      {u.reason && <div style={{fontSize:11.5,color:T.textMuted,marginTop:6,fontStyle:"italic"}}>{u.reason}</div>}
                    </div>
                    <div style={{textAlign:"center",flexShrink:0}}>
                      <div style={{fontSize:26,fontWeight:900,color:matchColor(u.match),lineHeight:1}}>{u.match}%</div>
                      <div style={{fontSize:10,color:T.textDim,fontWeight:600}}>match</div>
                    </div>
                  </div>
                  <div style={{height:4,background:T.bg,borderRadius:99,marginTop:10,overflow:"hidden"}}>
                    <motion.div initial={{width:0}} animate={{width:`${u.match}%`}} transition={{delay:i*0.08+0.4,duration:0.7,ease:"easeOut"}}
                      style={{height:"100%",background:matchColor(u.match),borderRadius:99}}/>
                  </div>
                </motion.div>
              ))}
              <div style={{marginTop:20}}>
                <GreenBtn onClick={onClose} full icon={I.check}>Done — Back to Profile</GreenBtn>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const PBlock = ({ icon, label, color, children }) => (
  <div style={{marginBottom:13,paddingBottom:13,borderBottom:`1px solid ${T.border}`}}>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
      <Ic p={icon} size={12} c={color} sw={2.5}/>
      <span style={{fontSize:10.5,fontWeight:800,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</span>
    </div>
    {children}
  </div>
);

function RecommendationPage({ onNavigate }) {
  const [open, setOpen] = useState({education:true,tests:false,standardized:false,activities:false,skills:false,research:false});
  const [showPreview, setShowPreview] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [edu, setEdu] = useState({level:"",phdMasters:null,ugCgpa:"",ugUniv:"",ugField:"",mastersCgpa:"",mastersField:"",sscGpa:"",hscGpa:""});
  const [engTests, setEngTests] = useState([]);
  const [eng, setEng] = useState({type:"IELTS",score:"",date:""});
  const [stdTests, setStdTests] = useState([]);
  const [std, setStd] = useState({type:"GRE",score:"",attempt:"1"});
  const [activities, setActivities] = useState([]);
  const [act, setAct] = useState({name:"",category:"Leadership",achievement:"Participant",description:""});
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState({name:"",category:"Programming",proficiency:"Intermediate"});
  const [papers, setPapers] = useState([]);
  const [paper, setPaper] = useState({title:"",domain:"",description:"",link:"",status:"Published"});

  const toggle = k => setOpen(p=>({...p,[k]:!p[k]}));

  const addEng = () => { if(!eng.score.trim()) return; setEngTests(p=>[...p,{...eng,id:uid()}]); setEng(p=>({...p,score:"",date:""})); };
  const addStd = () => { if(!std.score.trim()) return; setStdTests(p=>[...p,{...std,id:uid()}]); setStd(p=>({...p,score:""})); };
  const addAct = () => { if(!act.name.trim()) return; setActivities(p=>[...p,{...act,id:uid()}]); setAct({name:"",category:"Leadership",achievement:"Participant",description:""}); };
  const addSkill = () => { if(!skill.name.trim()) return; setSkills(p=>[...p,{...skill,id:uid()}]); setSkill(p=>({...p,name:""})); };
  const addPaper = () => { if(!paper.title.trim()) return; setPapers(p=>[...p,{...paper,id:uid()}]); setPaper({title:"",domain:"",description:"",link:"",status:"Published"}); };

  const totalItems = [edu.level?1:0,engTests.length,stdTests.length,activities.length,skills.length,papers.length].reduce((a,b)=>a+b,0);
  const overall = Math.min(100,Math.round((totalItems/10)*100));
  const profile = {edu,engTests,stdTests,activities,skills,papers};

  const ENG_META = {
    IELTS:{range:"1–9",step:"0.5",col:T.blue,soft:T.blueLight},
    TOEFL:{range:"0–120",step:"1",col:T.green,soft:T.greenLight},
    Duolingo:{range:"10–160",step:"1",col:T.purple,soft:T.purpleLight},
    PTE:{range:"10–90",step:"1",col:T.amber,soft:T.amberLight},
    Cambridge:{range:"80–230",step:"1",col:T.teal,soft:T.tealLight},
  };

  const renderTests = () => (
    <>
      <NavyNote>Select your test type and enter your score. Multiple scores are supported.</NavyNote>
      <AddForm>
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr",gap:12,marginBottom:14}}>
          <RField label="Test Type">
            <FSelect value={eng.type} onChange={e=>setEng(p=>({...p,type:e.target.value}))}>
              {Object.keys(ENG_META).map(k=><option key={k}>{k}</option>)}
            </FSelect>
          </RField>
          <RField label={`Score (${ENG_META[eng.type]?.range})`}>
            <FInput type="number" step={ENG_META[eng.type]?.step} placeholder={ENG_META[eng.type]?.range}
              value={eng.score} onChange={e=>setEng(p=>({...p,score:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addEng()}/>
          </RField>
          <RField label="Test Date (optional)">
            <FInput type="month" value={eng.date} onChange={e=>setEng(p=>({...p,date:e.target.value}))} style={{colorScheme:"light"}}/>
          </RField>
        </div>
        <GreenBtn onClick={addEng} icon={I.plus} small>Add Score</GreenBtn>
      </AddForm>
      <AnimatePresence>
        {engTests.map(t=>{
          const m=ENG_META[t.type]||{col:T.blue,soft:T.blueLight};
          return (
            <EntryCard key={t.id} onRemove={()=>setEngTests(p=>p.filter(x=>x.id!==t.id))} accent={m.col}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:10.5,fontWeight:800,padding:"3px 9px",background:m.soft,color:m.col,borderRadius:20}}>{t.type}</span>
                <span style={{fontSize:22,fontWeight:900,color:T.text,letterSpacing:"-0.03em"}}>{t.score}</span>
                {t.date&&<span style={{fontSize:11.5,color:T.textMuted}}>· {t.date}</span>}
              </div>
            </EntryCard>
          );
        })}
      </AnimatePresence>
      {engTests.length===0&&<p style={{textAlign:"center",fontSize:12.5,color:T.textDim,padding:"8px 0 4px"}}>No scores added yet</p>}
    </>
  );

  const STD_META = {
    GRE:{range:"260–340",col:T.amber,soft:T.amberLight},
    GMAT:{range:"200–800",col:T.red,soft:T.redLight},
    SAT:{range:"400–1600",col:T.purple,soft:T.purpleLight},
    ACT:{range:"1–36",col:T.blue,soft:T.blueLight},
    MCAT:{range:"472–528",col:T.teal,soft:T.tealLight},
  };

  const renderStandardized = () => (
    <>
      <NavyNote>Add GRE, GMAT, SAT or other results. Multiple attempts are supported.</NavyNote>
      <AddForm>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
          <RField label="Test">
            <FSelect value={std.type} onChange={e=>setStd(p=>({...p,type:e.target.value}))}>
              {Object.keys(STD_META).map(k=><option key={k}>{k}</option>)}
            </FSelect>
          </RField>
          <RField label={`Score (${STD_META[std.type]?.range})`}>
            <FInput type="number" placeholder={STD_META[std.type]?.range}
              value={std.score} onChange={e=>setStd(p=>({...p,score:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addStd()}/>
          </RField>
          <RField label="Attempt">
            <FSelect value={std.attempt} onChange={e=>setStd(p=>({...p,attempt:e.target.value}))}>
              {[1,2,3,4].map(n=><option key={n} value={n}>Attempt {n}</option>)}
            </FSelect>
          </RField>
        </div>
        <GreenBtn onClick={addStd} icon={I.plus} small>Add Test</GreenBtn>
      </AddForm>
      <AnimatePresence>
        {stdTests.map(t=>{
          const m=STD_META[t.type]||{col:T.amber,soft:T.amberLight};
          return (
            <EntryCard key={t.id} onRemove={()=>setStdTests(p=>p.filter(x=>x.id!==t.id))} accent={m.col}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:10.5,fontWeight:800,padding:"3px 9px",background:m.soft,color:m.col,borderRadius:20}}>{t.type}</span>
                <span style={{fontSize:22,fontWeight:900,color:T.text,letterSpacing:"-0.03em"}}>{t.score}</span>
                <span style={{fontSize:11.5,color:T.textMuted}}>Attempt {t.attempt}</span>
              </div>
            </EntryCard>
          );
        })}
      </AnimatePresence>
      {stdTests.length===0&&<p style={{textAlign:"center",fontSize:12.5,color:T.textDim,padding:"8px 0 4px"}}>No tests added yet</p>}
    </>
  );

  const renderEducation = () => (
    <>
      <NavyNote>Select your highest level of education — the form adapts to collect exactly what's needed.</NavyNote>
      <RField label="Highest Education Level">
        <FSelect value={edu.level} onChange={e=>setEdu(p=>({...p,level:e.target.value,phdMasters:null}))}>
          <option value="">Choose level…</option>
          <option value="bachelors">Bachelor's Degree</option>
          <option value="masters">Master's Degree</option>
          <option value="phd">PhD / Doctorate</option>
        </FSelect>
      </RField>
      <AnimatePresence mode="wait">
        {edu.level==="bachelors"&&(
          <motion.div key="bach" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
            <div style={{background:T.blueLight,border:`1px solid ${T.blue}22`,borderRadius:10,padding:"11px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
              <Ic p={I.cap} size={14} c={T.blue}/>
              <span style={{fontSize:12.5,color:T.blue,fontWeight:600}}>Enter your secondary school results</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <RField label="SSC / O-Level GPA"><FInput type="number" step="0.01" placeholder="0.00 – 5.00" value={edu.sscGpa} onChange={e=>setEdu(p=>({...p,sscGpa:e.target.value}))}/></RField>
              <RField label="HSC / A-Level GPA"><FInput type="number" step="0.01" placeholder="0.00 – 5.00" value={edu.hscGpa} onChange={e=>setEdu(p=>({...p,hscGpa:e.target.value}))}/></RField>
            </div>
          </motion.div>
        )}
        {edu.level==="masters"&&(
          <motion.div key="mast" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
            <div style={{background:T.greenLight,border:`1px solid ${T.green}22`,borderRadius:10,padding:"11px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
              <Ic p={I.check} size={14} c={T.green}/>
              <span style={{fontSize:12.5,color:T.greenHover,fontWeight:600}}>Provide your undergraduate academic details</span>
            </div>
            <RField label="Undergraduate CGPA *"><FInput type="number" step="0.01" placeholder="0.00 – 4.00" value={edu.ugCgpa} onChange={e=>setEdu(p=>({...p,ugCgpa:e.target.value}))}/></RField>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <RField label="University (optional)"><FInput placeholder="e.g. BUET, University of Dhaka" value={edu.ugUniv} onChange={e=>setEdu(p=>({...p,ugUniv:e.target.value}))}/></RField>
              <RField label="Field of Study (optional)"><FInput placeholder="e.g. Computer Science, EEE" value={edu.ugField} onChange={e=>setEdu(p=>({...p,ugField:e.target.value}))}/></RField>
            </div>
          </motion.div>
        )}
        {edu.level==="phd"&&(
          <motion.div key="phd" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
            <div style={{background:T.purpleLight,border:`1px solid ${T.purple}22`,borderRadius:10,padding:"11px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
              <Ic p={I.award} size={14} c={T.purple}/>
              <span style={{fontSize:12.5,color:T.purple,fontWeight:600}}>Tell us about your prior degrees</span>
            </div>
            <RField label="Do you have a completed Master's degree?">
              <div style={{display:"flex",gap:8}}>
                {["Yes","No","In Progress"].map(opt=>(
                  <RToggle key={opt} label={opt} active={edu.phdMasters===opt} color={T.purple} onClick={()=>setEdu(p=>({...p,phdMasters:opt}))}/>
                ))}
              </div>
            </RField>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  const ACT_CATS=["Leadership","Sports","Volunteer","Competition","Club","Research","Other"];
  const ACH=["Participant","Winner","Organizer","Leader"];
  const ACH_COLORS={Participant:[T.textMuted,T.bg],Winner:[T.amber,T.amberLight],Organizer:[T.green,T.greenLight],Leader:[T.blue,T.blueLight]};

  const renderActivities = () => (
    <>
      <NavyNote>Add extracurricular activities with structured details to strengthen your application.</NavyNote>
      <AddForm>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <RField label="Activity Name">
            <FInput placeholder="e.g. Debate Club President" value={act.name}
              onChange={e=>setAct(p=>({...p,name:e.target.value}))}
              onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addAct(); }}}/>
          </RField>
          <RField label="Category">
            <FSelect value={act.category} onChange={e=>setAct(p=>({...p,category:e.target.value}))}>
              {ACT_CATS.map(c=><option key={c}>{c}</option>)}
            </FSelect>
          </RField>
        </div>
        <RField label="Achievement Level">
          <div style={{display:"flex",gap:8}}>
            {ACH.map(l=>{
              const [col]=ACH_COLORS[l];
              return <RToggle key={l} label={l} active={act.achievement===l} color={col} onClick={()=>setAct(p=>({...p,achievement:l}))}/>;
            })}
          </div>
        </RField>
        <RField label="Description (optional)">
          <FTextarea rows={2} placeholder="Briefly describe your role and impact…" value={act.description} onChange={e=>setAct(p=>({...p,description:e.target.value}))}/>
        </RField>
        <GreenBtn onClick={addAct} icon={I.plus} small>Add Activity</GreenBtn>
      </AddForm>
      <AnimatePresence>
        {activities.map(a=>{
          const [col,bg]=ACH_COLORS[a.achievement]||ACH_COLORS.Participant;
          return (
            <EntryCard key={a.id} onRemove={()=>setActivities(p=>p.filter(x=>x.id!==a.id))} accent={col}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:a.description?5:0}}>
                <span style={{fontSize:13.5,fontWeight:700,color:T.text}}>{a.name}</span>
                <span style={{fontSize:10.5,padding:"2px 8px",background:bg,color:col,borderRadius:20,fontWeight:700}}>{a.achievement}</span>
                <span style={{fontSize:10.5,padding:"2px 8px",background:T.bg,color:T.textMuted,borderRadius:20,fontWeight:600}}>{a.category}</span>
              </div>
              {a.description&&<p style={{fontSize:12,color:T.textMuted,margin:0,lineHeight:1.5}}>{a.description}</p>}
            </EntryCard>
          );
        })}
      </AnimatePresence>
      {activities.length===0&&<p style={{textAlign:"center",fontSize:12.5,color:T.textDim,padding:"8px 0 4px"}}>No activities added yet</p>}
    </>
  );

  const SKILL_CATS=["Programming","Design","Research","Communication","Business","Language","Other"];
  const PROF_STYLES={Beginner:[T.textMuted,T.bg],Intermediate:[T.amber,T.amberLight],Advanced:[T.green,T.greenLight]};

  const renderSkills = () => (
    <>
      <NavyNote>Add skills with proficiency levels. Press Enter or click Add after each skill.</NavyNote>
      <AddForm>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div style={{flex:"2 1 160px"}}>
            <RField label="Skill Name">
              <FInput placeholder="e.g. Python, Figma, R" value={skill.name}
                onChange={e=>setSkill(p=>({...p,name:e.target.value}))}
                onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addSkill(); }}}/>
            </RField>
          </div>
          <div style={{flex:"1 1 120px"}}>
            <RField label="Category">
              <FSelect value={skill.category} onChange={e=>setSkill(p=>({...p,category:e.target.value}))}>
                {SKILL_CATS.map(c=><option key={c}>{c}</option>)}
              </FSelect>
            </RField>
          </div>
          <div style={{flex:"1 1 120px"}}>
            <RField label="Proficiency">
              <FSelect value={skill.proficiency} onChange={e=>setSkill(p=>({...p,proficiency:e.target.value}))}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </FSelect>
            </RField>
          </div>
          <div style={{marginBottom:16}}>
            <GreenBtn onClick={addSkill} icon={I.plus} small>Add</GreenBtn>
          </div>
        </div>
      </AddForm>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        <AnimatePresence>
          {skills.map(s=>{
            const [col,bg]=PROF_STYLES[s.proficiency]||PROF_STYLES.Beginner;
            return (
              <motion.div key={s.id} layout initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.8,opacity:0}}
                style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 11px",background:bg,border:`1.5px solid ${col}33`,borderRadius:9,boxShadow:T.shadow}}>
                <span style={{fontSize:13,fontWeight:700,color:T.text}}>{s.name}</span>
                <span style={{fontSize:10,fontWeight:700,color:col}}>{s.proficiency}</span>
                <button type="button" onClick={()=>setSkills(p=>p.filter(x=>x.id!==s.id))}
                  style={{background:"none",border:"none",padding:0,cursor:"pointer",display:"flex",lineHeight:1,color:T.textDim}}>
                  <Ic p={I.x} size={11} c={T.textDim}/>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {skills.length===0&&<p style={{textAlign:"center",fontSize:12.5,color:T.textDim,padding:"12px 0 4px"}}>No skills added yet — press Enter to add quickly</p>}
    </>
  );

  const STATUS_STYLES={Published:[T.green,T.greenLight],"Under Review":[T.amber,T.amberLight],Project:[T.blue,T.blueLight]};

  const renderResearch = () => (
    <>
      <NavyNote>Add research papers, publications, or ongoing projects.</NavyNote>
      <AddForm>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <RField label="Title"><FInput placeholder="e.g. Transformer Models for NLP Tasks" value={paper.title} onChange={e=>setPaper(p=>({...p,title:e.target.value}))}/></RField>
          <RField label="Domain / Topic"><FInput placeholder="e.g. Machine Learning, Bioinformatics" value={paper.domain} onChange={e=>setPaper(p=>({...p,domain:e.target.value}))}/></RField>
          <RField label="Publication Link (optional)"><FInput placeholder="https://doi.org/…" value={paper.link} onChange={e=>setPaper(p=>({...p,link:e.target.value}))}/></RField>
          <RField label="Status">
            <FSelect value={paper.status} onChange={e=>setPaper(p=>({...p,status:e.target.value}))}>
              <option>Published</option><option>Under Review</option><option>Project</option>
            </FSelect>
          </RField>
        </div>
        <RField label="Description (optional)">
          <FTextarea rows={2} placeholder="Brief abstract or summary…" value={paper.description} onChange={e=>setPaper(p=>({...p,description:e.target.value}))}/>
        </RField>
        <GreenBtn onClick={addPaper} icon={I.plus} small>Add Publication</GreenBtn>
      </AddForm>
      <AnimatePresence>
        {papers.map(pp=>{
          const [col,bg]=STATUS_STYLES[pp.status]||STATUS_STYLES.Published;
          return (
            <EntryCard key={pp.id} onRemove={()=>setPapers(p=>p.filter(x=>x.id!==pp.id))} accent={col}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:13.5,fontWeight:700,color:T.text}}>{pp.title}</span>
                <span style={{fontSize:10.5,padding:"2px 8px",background:bg,color:col,borderRadius:20,fontWeight:700,whiteSpace:"nowrap"}}>{pp.status}</span>
              </div>
              {pp.domain&&<span style={{fontSize:11.5,color:T.textMuted,display:"block",marginBottom:3}}>{pp.domain}</span>}
              {pp.description&&<p style={{fontSize:12,color:T.textMuted,margin:"3px 0"}}>{pp.description}</p>}
              {pp.link&&(
                <a href={pp.link} target="_blank" rel="noreferrer"
                  style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:T.blue,textDecoration:"none",fontWeight:600,marginTop:4}}>
                  <Ic p={I.link} size={11} c={T.blue}/> View publication
                </a>
              )}
            </EntryCard>
          );
        })}
      </AnimatePresence>
      {papers.length===0&&<p style={{textAlign:"center",fontSize:12.5,color:T.textDim,padding:"8px 0 4px"}}>No publications added yet</p>}
    </>
  );

  const renderPreview = () => (
    <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:18,overflow:"hidden",boxShadow:T.shadowLg,position:"sticky",top:84}}>
      <div style={{background:T.navy,padding:"20px 22px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{width:36,height:36,borderRadius:10,background:T.green,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px rgba(35,197,94,0.3)`}}>
            <Ic p={I.user} size={17} c={T.white} sw={2}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13.5,fontWeight:800,color:T.white}}>Live Preview</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:1}}>Updates in real time</div>
          </div>
          <span style={{fontSize:12,fontWeight:800,color:T.green}}>{overall}%</span>
        </div>
        <div style={{height:5,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}}>
          <motion.div animate={{width:`${overall}%`}} transition={{duration:0.5,ease:"easeOut"}}
            style={{height:"100%",background:T.green,borderRadius:99}}/>
        </div>
      </div>
      <div style={{padding:"18px 20px"}}>
        {totalItems===0&&(
          <div style={{textAlign:"center",padding:"28px 0"}}>
            <Ic p={I.spark} size={30} c={T.textDim}/>
            <p style={{fontSize:12.5,color:T.textDim,marginTop:10,lineHeight:1.6}}>Fill in the sections on the left — your profile summary will appear here.</p>
          </div>
        )}
        {edu.level&&(
          <PBlock icon={I.cap} label="Education" color={T.blue}>
            <span style={{fontSize:13,fontWeight:700,color:T.text,textTransform:"capitalize"}}>{edu.level.replace("phd","PhD")}</span>
            {edu.ugCgpa&&<span style={{fontSize:11.5,color:T.textMuted}}> · CGPA {edu.ugCgpa}</span>}
            {edu.ugField&&<div style={{fontSize:11.5,color:T.textMuted,marginTop:2}}>{edu.ugField}</div>}
          </PBlock>
        )}
        {engTests.length>0&&(
          <PBlock icon={I.check} label="English Tests" color={T.green}>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {engTests.map(t=><span key={t.id} style={{fontSize:11.5,padding:"2px 9px",background:T.greenLight,color:T.greenHover,borderRadius:20,fontWeight:700}}>{t.type} {t.score}</span>)}
            </div>
          </PBlock>
        )}
        {skills.length>0&&(
          <PBlock icon={I.bolt} label={`Skills (${skills.length})`} color={T.purple}>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {skills.slice(0,8).map(s=><span key={s.id} style={{fontSize:11.5,padding:"2px 8px",background:T.purpleLight,color:T.purple,borderRadius:6,fontWeight:600}}>{s.name}</span>)}
              {skills.length>8&&<span style={{fontSize:11.5,color:T.textDim}}>+{skills.length-8}</span>}
            </div>
          </PBlock>
        )}
        {totalItems>0&&(
          <div style={{marginTop:4}}>
            <GreenBtn onClick={()=>setShowModal(true)} full icon={I.spark}>Analyze Profile</GreenBtn>
          </div>
        )}
      </div>
    </div>
  );

  const sections = [
    {id:"education",title:"Education Background",subtitle:"Degree level, GPA, academic history",count:edu.level?1:0,render:renderEducation},
    {id:"tests",title:"English Proficiency",subtitle:"IELTS, TOEFL, Duolingo, PTE, Cambridge",count:engTests.length,render:renderTests},
    {id:"standardized",title:"Standardized Tests",subtitle:"GRE, GMAT, SAT, ACT, MCAT",count:stdTests.length,render:renderStandardized},
    {id:"activities",title:"Extracurricular Activities",subtitle:"Leadership, sports, volunteering, competitions",count:activities.length,render:renderActivities},
    {id:"skills",title:"Skills & Technologies",subtitle:"Programming, design, research, communication",count:skills.length,render:renderSkills},
    {id:"research",title:"Research & Publications",subtitle:"Papers, projects, under-review work",count:papers.length,render:renderResearch},
  ];

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Manrope',sans-serif",color:T.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');input[type='month']::-webkit-calendar-picker-indicator{opacity:0.5;cursor:pointer;}`}</style>

      {/* Sticky top bar */}
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(245,247,250,0.94)",backdropFilter:"blur(14px)",borderBottom:`1px solid ${T.border}`,padding:"0 24px",height:64,display:"flex",alignItems:"center",gap:12}}>
        <button type="button" onClick={()=>onNavigate('home')}
          onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background=T.white}
          style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",background:T.white,border:`1.5px solid ${T.border}`,borderRadius:9,color:T.textMuted,fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"'Manrope',sans-serif",transition:"all 0.15s",flexShrink:0}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <div style={{flex:1}}/>
        <button type="button" onClick={()=>onNavigate('dream')}
          onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background=T.white}
          style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",background:T.white,border:`1.5px solid ${T.border}`,borderRadius:9,color:T.textMuted,fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"'Manrope',sans-serif",transition:"all 0.15s",flexShrink:0}}>
          Dream University
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",background:T.greenLight,borderRadius:20,border:`1px solid ${T.greenMid}`,flexShrink:0}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:T.green}}/>
          <span style={{fontSize:12,color:T.greenHover,fontWeight:700}}>Profile {overall}% complete</span>
        </div>
        <button type="button" onClick={()=>setShowPreview(p=>!p)}
          onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background=T.white}
          style={{display:"flex",alignItems:"center",gap:7,padding:"7px 14px",background:T.white,border:`1.5px solid ${showPreview?T.green:T.border}`,borderRadius:9,color:showPreview?T.green:T.textMuted,fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"'Manrope',sans-serif",transition:"all 0.15s"}}>
          <Ic p={I.eye} size={14} c={showPreview?T.green:T.textMuted}/>
          Preview
        </button>
      </div>

      <div style={{maxWidth:1240,margin:"0 auto",padding:"32px 24px 60px",display:"grid",gridTemplateColumns:showPreview?"1fr 320px":"680px",gap:28,justifyContent:"center"}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
            style={{background:T.navy,borderRadius:18,padding:"28px 30px",display:"flex",alignItems:"center",gap:20,boxShadow:T.shadowLg,overflow:"hidden",position:"relative"}}>
            <div style={{position:"absolute",right:-20,top:-20,width:160,height:160,borderRadius:"50%",background:"rgba(35,197,94,0.07)"}}/>
            <div style={{width:56,height:56,borderRadius:16,background:T.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 6px 24px rgba(35,197,94,0.4)`}}>
              <Ic p={I.spark} size={26} c={T.white} sw={2}/>
            </div>
            <div style={{position:"relative"}}>
              <h1 style={{fontSize:21,fontWeight:900,color:T.white,letterSpacing:"-0.03em",marginBottom:6}}>Build Your Academic Profile</h1>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>Fill each section below — AI will use your profile to recommend best-fit universities worldwide.</p>
            </div>
          </motion.div>

          {sections.map(({id,title,subtitle,count,render},i)=>(
            <motion.div key={id} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
              <RSection id={id} title={title} subtitle={subtitle} count={count} isOpen={open[id]} onToggle={()=>toggle(id)}>
                {render()}
              </RSection>
            </motion.div>
          ))}

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}>
            <button type="button" onClick={()=>setShowModal(true)}
              style={{width:"100%",padding:"16px 24px",background:T.green,border:"none",borderRadius:14,color:T.white,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Manrope',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10,transition:"all 0.2s",boxShadow:`0 4px 18px rgba(35,197,94,0.25)`,letterSpacing:"-0.01em"}}>
              <Ic p={I.spark} size={20} c={T.white} sw={2}/>
              Analyze Profile & Find Universities
              <Ic p={I.arr} size={18} c={T.white} sw={2.5}/>
            </button>
          </motion.div>
        </div>

        <AnimatePresence>
          {showPreview&&(
            <motion.div key="prev" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} transition={{duration:0.25}}>
              {renderPreview()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal&&<AnalysisModal profile={profile} onClose={()=>setShowModal(false)}/>}
      </AnimatePresence>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DREAM UNIVERSITY PAGE INTERNALS
// ═════════════════════════════════════════════════════════════════════════════
const C = {
  white:"#ffffff", bg:"#f7f8fa", navy:"#0b1120", navyMid:"#1a2540", navyLight:"#243050",
  green:"#23c55e", greenDark:"#18a04a", greenLight:"#edfaf3", greenMid:"#b6f0ce",
  border:"#e8ecf2", borderStrong:"#d0d8e8",
  text:"#0b1120", textMid:"#2d3a55", textMuted:"#64748b", textDim:"#98a4b8",
  shadow:"0 1px 3px rgba(11,17,32,0.05),0 4px 12px rgba(11,17,32,0.06)",
  shadowMd:"0 4px 16px rgba(11,17,32,0.09)",
  shadowLg:"0 8px 40px rgba(11,17,32,0.13)",
};

const UNIS = [
  {id:1,name:"Massachusetts Institute of Technology",country:"USA",rank:1,flag:"🇺🇸",programs:["CS","Engineering","Physics","Math","Business"]},
  {id:2,name:"Stanford University",country:"USA",rank:3,flag:"🇺🇸",programs:["CS","AI","Business","Medicine","Law"]},
  {id:3,name:"Harvard University",country:"USA",rank:4,flag:"🇺🇸",programs:["Law","Medicine","Business","Economics","Government"]},
  {id:4,name:"University of Cambridge",country:"UK",rank:2,flag:"🇬🇧",programs:["Engineering","Mathematics","Natural Sciences","CS","Economics"]},
  {id:5,name:"University of Oxford",country:"UK",rank:5,flag:"🇬🇧",programs:["PPE","Law","Medicine","History","CS"]},
  {id:6,name:"ETH Zurich",country:"Switzerland",rank:7,flag:"🇨🇭",programs:["Engineering","CS","Data Science","Robotics","Physics"]},
  {id:7,name:"University of Toronto",country:"Canada",rank:21,flag:"🇨🇦",programs:["CS","Engineering","Medicine","Business","AI"]},
  {id:8,name:"University of Melbourne",country:"Australia",rank:33,flag:"🇦🇺",programs:["Engineering","Business","Medicine","Law","CS"]},
  {id:9,name:"TU Munich",country:"Germany",rank:37,flag:"🇩🇪",programs:["Engineering","CS","Robotics","Physics","Business"]},
  {id:10,name:"University of Edinburgh",country:"UK",rank:22,flag:"🇬🇧",programs:["CS","AI","Medicine","Law","Engineering"]},
  {id:11,name:"NUS Singapore",country:"Singapore",rank:11,flag:"🇸🇬",programs:["CS","Engineering","Business","Medicine","Law"]},
  {id:12,name:"Delft University of Technology",country:"Netherlands",rank:49,flag:"🇳🇱",programs:["Engineering","CS","Architecture","Aerospace","Marine"]},
  {id:13,name:"Monash University",country:"Australia",rank:57,flag:"🇦🇺",programs:["Engineering","Business","Medicine","Pharmacy","Law"]},
  {id:14,name:"University of British Columbia",country:"Canada",rank:46,flag:"🇨🇦",programs:["CS","Forestry","Medicine","Business","Engineering"]},
  {id:15,name:"Carnegie Mellon University",country:"USA",rank:25,flag:"🇺🇸",programs:["CS","AI","Robotics","HCI","Engineering"]},
  {id:16,name:"Technion",country:"Israel",rank:89,flag:"🇮🇱",programs:["Engineering","CS","Physics","Math","Biotech"]},
  {id:17,name:"Seoul National University",country:"South Korea",rank:31,flag:"🇰🇷",programs:["Engineering","CS","Medicine","Law","Business"]},
  {id:18,name:"University of Amsterdam",country:"Netherlands",rank:55,flag:"🇳🇱",programs:["Data Science","AI","Psychology","Law","Business"]},
];

const PROGRAMS = {
  CS:{desc:"Algorithms, systems, and software engineering",difficulty:"Competitive",careers:["Software Engineer","Research Scientist","CTO"]},
  Engineering:{desc:"Applied sciences and industrial problem-solving",difficulty:"Rigorous",careers:["Systems Engineer","Project Manager","Consultant"]},
  AI:{desc:"Machine learning, NLP, and intelligent systems",difficulty:"Very Competitive",careers:["ML Engineer","AI Researcher","Data Scientist"]},
  Business:{desc:"Strategy, finance, and organizational leadership",difficulty:"Selective",careers:["MBA Graduate","Entrepreneur","Strategy Consultant"]},
  Medicine:{desc:"Clinical practice and biomedical research",difficulty:"Extremely Selective",careers:["Physician","Researcher","Healthcare Executive"]},
  Law:{desc:"Legal theory, practice, and justice systems",difficulty:"Competitive",careers:["Lawyer","Judge","Legal Counsel"]},
  Mathematics:{desc:"Pure and applied mathematical foundations",difficulty:"Rigorous",careers:["Actuary","Quantitative Analyst","Academic"]},
  Physics:{desc:"Fundamental forces and quantum phenomena",difficulty:"Rigorous",careers:["Physicist","Engineer","Data Analyst"]},
  Robotics:{desc:"Mechanical design and autonomous systems",difficulty:"Competitive",careers:["Robotics Engineer","Research Lead","Product Manager"]},
  "Data Science":{desc:"Statistical modeling and big data pipelines",difficulty:"Competitive",careers:["Data Scientist","Analytics Lead","BI Engineer"]},
  Economics:{desc:"Markets, policy, and macroeconomic theory",difficulty:"Selective",careers:["Economist","Policy Analyst","Financial Analyst"]},
  "Natural Sciences":{desc:"Biology, chemistry, and earth sciences",difficulty:"Rigorous",careers:["Researcher","Lab Scientist","Environmental Consultant"]},
  PPE:{desc:"Philosophy, politics, and economics",difficulty:"Competitive",careers:["Policy Analyst","Economist","Politician"]},
  History:{desc:"Historical analysis and cultural studies",difficulty:"Selective",careers:["Historian","Writer","Policy Advisor"]},
  Government:{desc:"Political science and governance",difficulty:"Competitive",careers:["Government Official","Policy Analyst","Diplomat"]},
  HCI:{desc:"Human-computer interaction and UX research",difficulty:"Competitive",careers:["UX Researcher","Product Designer","HCI Scientist"]},
  Architecture:{desc:"Design and construction of spaces",difficulty:"Competitive",careers:["Architect","Urban Planner","Designer"]},
  Aerospace:{desc:"Aeronautics and space systems engineering",difficulty:"Rigorous",careers:["Aerospace Engineer","Mission Analyst","Pilot"]},
  Marine:{desc:"Naval architecture and ocean engineering",difficulty:"Rigorous",careers:["Marine Engineer","Naval Architect","Ocean Scientist"]},
  Pharmacy:{desc:"Pharmaceutical sciences and drug development",difficulty:"Selective",careers:["Pharmacist","Drug Developer","Clinical Researcher"]},
  Forestry:{desc:"Forest management and environmental science",difficulty:"Selective",careers:["Forester","Environmental Consultant","Ecologist"]},
  Biotech:{desc:"Biotechnology and life sciences",difficulty:"Competitive",careers:["Biotechnologist","Lab Scientist","R&D Manager"]},
  Psychology:{desc:"Human behavior and mental processes",difficulty:"Selective",careers:["Psychologist","Researcher","Counselor"]},
};

const RESEARCH_DOMAINS = ["Artificial Intelligence","Natural Language Processing","Computer Vision","Robotics","Quantum Computing","Bioinformatics","Climate Science","Neuroscience","FinTech","Cybersecurity","Renewable Energy","Drug Discovery"];

let _uid = 0; const duid = () => `_${++_uid}`;

const DIcon = ({ d, size=16, color="currentColor", sw=1.7, style:s }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...s}}>
    <path d={d}/>
  </svg>
);

const dpaths = {
  cap:"M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
  spark:"M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 4.5L19 9l-4.5 1.5L13 15l-1.5-4.5L7 9l4.5-1.5L13 3z",
  check:"M20 6L9 17l-5-5",
  x:"M18 6L6 18M6 6l12 12",
  plus:"M12 5v14M5 12h14",
  chev:"M6 9l6 6 6-6",
  chevR:"M9 18l6-6-6-6",
  user:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  award:"M12 15l-5 6 5-3 5 3zM12 15a6 6 0 100-12 6 6 0 000 12z",
  book:"M4 19.5A2.5 2.5 0 016.5 17H20M4 4h16v13H4z",
  bolt:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  globe:"M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20",
  loader:"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
  arrow:"M5 12h14M12 5l7 7-7 7",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  list:"M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  flask:"M9 3h6M8.5 3l-1 7h9l-1-7M7.5 10s-2.5 3-2.5 6a7 7 0 0014 0c0-3-2.5-6-2.5-6",
  road:"M12 22V12M5 12l7-10 7 10M5 22h14",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
};

const dbaseInput = {width:"100%",padding:"10px 14px",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13.5,fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border-color 0.18s,box-shadow 0.18s"};

const DInput = ({style,...rest}) => {
  const [f,sf]=useState(false);
  return <input {...rest} style={{...dbaseInput,...(f?{borderColor:C.green,boxShadow:`0 0 0 3px rgba(35,197,94,0.13)`}:{}),...style}} onFocus={()=>sf(true)} onBlur={()=>sf(false)}/>;
};

const DSelect = ({children,style,...rest}) => {
  const [f,sf]=useState(false);
  return <select {...rest} style={{...dbaseInput,appearance:"none",cursor:"pointer",paddingRight:34,backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center",...(f?{borderColor:C.green,boxShadow:`0 0 0 3px rgba(35,197,94,0.13)`}:{}),...style}} onFocus={()=>sf(true)} onBlur={()=>sf(false)}>{children}</select>;
};

const Btn = ({children,onClick,disabled,full,sm,variant="green",icon}) => {
  const [h,sh]=useState(false);
  const bg=variant==="green"?(h?C.greenDark:C.green):variant==="navy"?(h?C.navyMid:C.navy):(h?"#f0f2f5":C.white);
  const col=variant==="ghost"?C.text:C.white;
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,padding:sm?"7px 16px":"11px 22px",width:full?"100%":"auto",background:disabled?"#c8d0de":bg,border:variant==="ghost"?`1.5px solid ${C.border}`:"none",borderRadius:sm?9:12,color:disabled?"#fff":col,fontSize:sm?12.5:14,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.17s",transform:(!disabled&&h&&variant!=="ghost")?"translateY(-1px)":"none",boxShadow:(!disabled&&h&&variant==="green")?`0 6px 20px rgba(35,197,94,0.32)`:"none",opacity:disabled?0.6:1}}
      onMouseEnter={()=>!disabled&&sh(true)} onMouseLeave={()=>sh(false)}>
      {icon&&<DIcon d={icon} size={sm?13:16} color={col}/>}
      {children}
    </button>
  );
};

const DLabel = ({children}) => (
  <label style={{display:"block",fontSize:11.5,fontWeight:700,color:C.textMuted,marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>{children}</label>
);

const DTag = ({label,color,bg,onRemove}) => (
  <motion.span layout initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.8,opacity:0}}
    style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 10px",background:bg,border:`1.5px solid ${color}30`,borderRadius:8,fontSize:12,fontWeight:600,color}}>
    {label}
    {onRemove&&(
      <button onClick={onRemove} style={{background:"none",border:"none",padding:0,cursor:"pointer",display:"flex",lineHeight:1,opacity:0.7}}>
        <DIcon d={dpaths.x} size={10} color={color}/>
      </button>
    )}
  </motion.span>
);

const STEP_LABELS=["University","Program","Research","Profile","Analysis"];
const StepBar=({current})=>(
  <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:36}}>
    {STEP_LABELS.map((label,i)=>{
      const done=i<current,active=i===current;
      return (
        <div key={i} style={{display:"flex",alignItems:"center",flex:i<4?1:0}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
            <motion.div animate={{background:done||active?C.navy:C.white,borderColor:done||active?C.navy:C.border,scale:active?1.08:1}} transition={{duration:0.25}}
              style={{width:32,height:32,borderRadius:"50%",border:`2px solid ${done||active?C.navy:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:active?`0 0 0 4px rgba(11,17,32,0.1)`:"none"}}>
              {done?<DIcon d={dpaths.check} size={14} color={C.green} sw={2.5}/>:<span style={{fontSize:12,fontWeight:800,color:done||active?C.white:C.textDim}}>{i+1}</span>}
            </motion.div>
            <span style={{fontSize:10.5,fontWeight:700,color:active?C.navy:C.textDim,letterSpacing:"0.04em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}</span>
          </div>
          {i<4&&<motion.div animate={{background:done?C.green:C.border}} transition={{duration:0.4}} style={{flex:1,height:2,borderRadius:2,margin:"0 6px",marginBottom:20}}/>}
        </div>
      );
    })}
  </div>
);

const Step1=({onSelect})=>{
  const [query,setQuery]=useState("");
  const [hovered,setHovered]=useState(null);
  const filtered=query.trim()?UNIS.filter(u=>u.name.toLowerCase().includes(query.toLowerCase())||u.country.toLowerCase().includes(query.toLowerCase())):UNIS;
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
      <div style={{marginBottom:28}}>
        <h2 style={{fontSize:24,fontWeight:800,color:C.navy,margin:"0 0 6px",letterSpacing:"-0.03em"}}>Choose Your Dream University</h2>
        <p style={{fontSize:14,color:C.textMuted,margin:0}}>Select from 18 top global institutions to begin your admission analysis.</p>
      </div>
      <div style={{position:"relative",marginBottom:24}}>
        <div style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}>
          <DIcon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" size={15} color={C.textDim}/>
        </div>
        <DInput placeholder="Search by university or country…" value={query} onChange={e=>setQuery(e.target.value)} style={{paddingLeft:38}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
        {filtered.map((uni,i)=>(
          <motion.div key={uni.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}}
            onMouseEnter={()=>setHovered(uni.id)} onMouseLeave={()=>setHovered(null)} onClick={()=>onSelect(uni)}
            style={{padding:"16px 18px",background:hovered===uni.id?C.navy:C.white,border:`1.5px solid ${hovered===uni.id?C.navy:C.border}`,borderRadius:14,cursor:"pointer",transition:"all 0.2s",boxShadow:hovered===uni.id?C.shadowMd:C.shadow}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:22}}>{uni.flag}</span>
              <span style={{fontSize:10,fontWeight:800,padding:"3px 8px",background:hovered===uni.id?"rgba(35,197,94,0.2)":C.greenLight,color:hovered===uni.id?C.green:C.greenDark,borderRadius:20}}>#{uni.rank}</span>
            </div>
            <div style={{fontSize:13.5,fontWeight:800,color:hovered===uni.id?C.white:C.navy,lineHeight:1.3,marginBottom:5}}>{uni.name}</div>
            <div style={{fontSize:11.5,color:hovered===uni.id?"rgba(255,255,255,0.5)":C.textDim,fontWeight:500}}>{uni.country}</div>
          </motion.div>
        ))}
      </div>
      {filtered.length===0&&<p style={{textAlign:"center",color:C.textDim,fontSize:13,padding:"32px 0"}}>No universities match your search.</p>}
    </motion.div>
  );
};

const Step2=({university,onSelect,onBack})=>{
  const [hovered,setHov]=useState(null);
  const diffColor=d=>d==="Extremely Selective"?C.textMuted:d==="Very Competitive"?"#e67e22":d==="Competitive"?C.greenDark:"#3498db";
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
      <div style={{marginBottom:24}}>
        <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",padding:0,marginBottom:12,fontWeight:600}}>
          <DIcon d={dpaths.chevR} size={14} color={C.textMuted} style={{transform:"rotate(180deg)"}}/>Back to universities
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:C.navy,borderRadius:14,marginBottom:20}}>
          <span style={{fontSize:24}}>{university.flag}</span>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:C.white}}>{university.name}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2}}>Rank #{university.rank} · {university.country}</div>
          </div>
        </div>
        <h2 style={{fontSize:22,fontWeight:800,color:C.navy,margin:"0 0 6px",letterSpacing:"-0.02em"}}>Select a Program</h2>
        <p style={{fontSize:13.5,color:C.textMuted,margin:0}}>Choose the field you want to study at {university.name}.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
        {university.programs.map((prog,i)=>{
          const meta=PROGRAMS[prog]||{desc:"Interdisciplinary program",difficulty:"Competitive",careers:["Professional","Researcher"]};
          return (
            <motion.div key={prog} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              onMouseEnter={()=>setHov(prog)} onMouseLeave={()=>setHov(null)} onClick={()=>onSelect(prog)}
              style={{padding:"18px 20px",background:hovered===prog?C.greenLight:C.white,border:`1.5px solid ${hovered===prog?C.green:C.border}`,borderRadius:14,cursor:"pointer",transition:"all 0.2s",boxShadow:C.shadow}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:15,fontWeight:800,color:C.navy}}>{prog}</span>
                <span style={{fontSize:10.5,fontWeight:700,color:diffColor(meta.difficulty),padding:"2px 8px",background:`${diffColor(meta.difficulty)}18`,borderRadius:20}}>{meta.difficulty}</span>
              </div>
              <p style={{fontSize:12.5,color:C.textMuted,margin:"0 0 12px",lineHeight:1.5}}>{meta.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {meta.careers.map(cc=>(
                  <span key={cc} style={{fontSize:10.5,padding:"2px 8px",background:C.bg,color:C.textMuted,borderRadius:6,fontWeight:600}}>{cc}</span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const Step3=({university,program,onSelect,onSkip,onBack})=>{
  const [selected,setSelected]=useState([]);
  const toggle=d=>setSelected(p=>p.includes(d)?p.filter(x=>x!==d):p.length<3?[...p,d]:p);
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
      <div style={{marginBottom:24}}>
        <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",padding:0,marginBottom:12,fontWeight:600}}>
          <DIcon d={dpaths.chevR} size={14} color={C.textMuted} style={{transform:"rotate(180deg)"}}/>Back
        </button>
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          {[{label:program,color:C.greenDark,bg:C.greenLight},{label:university.name,color:C.navy,bg:C.bg}].map(({label,color,bg})=>(
            <span key={label} style={{fontSize:12,fontWeight:700,padding:"4px 12px",background:bg,color,borderRadius:20,border:`1.5px solid ${color}25`}}>{label}</span>
          ))}
        </div>
        <h2 style={{fontSize:22,fontWeight:800,color:C.navy,margin:"0 0 6px",letterSpacing:"-0.02em"}}>Research Area (Optional)</h2>
        <p style={{fontSize:13.5,color:C.textMuted,margin:0}}>Select up to 3 research domains relevant to your goals. Skip if undergraduate.</p>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:28}}>
        {RESEARCH_DOMAINS.map(d=>{
          const on=selected.includes(d);
          return (
            <motion.button key={d} type="button" onClick={()=>toggle(d)} whileTap={{scale:0.96}}
              style={{padding:"9px 16px",background:on?C.navy:C.white,border:`1.5px solid ${on?C.navy:C.border}`,borderRadius:10,color:on?C.white:C.textMid,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.18s",boxShadow:on?C.shadowMd:"none"}}>
              {on&&<DIcon d={dpaths.check} size={12} color={C.green} sw={2.5} style={{marginRight:5,verticalAlign:"middle"}}/>}
              {d}
            </motion.button>
          );
        })}
      </div>
      <div style={{display:"flex",gap:12}}>
        <Btn onClick={()=>onSkip()} variant="ghost">Skip this step</Btn>
        <Btn onClick={()=>onSelect(selected)} icon={dpaths.arrow}>Continue{selected.length>0?` with ${selected.length} area${selected.length>1?"s":""}`:""}</Btn>
      </div>
    </motion.div>
  );
};

const Step4=({university,program,researchAreas,onSubmit,onBack})=>{
  const [edu,setEdu]=useState({level:"",ugCgpa:"",ugField:"",ugUniv:""});
  const [engTests,setEngTests]=useState([]);
  const [engForm,setEngForm]=useState({type:"IELTS",score:""});
  const [stdTests,setStdTests]=useState([]);
  const [stdForm,setStdForm]=useState({type:"GRE",score:""});
  const [activities,setActivities]=useState([]);
  const [actInput,setActInput]=useState("");
  const [skills,setSkills]=useState([]);
  const [skillInput,setSkillInput]=useState("");
  const [papers,setPapers]=useState([]);
  const [paperForm,setPaperForm]=useState({title:"",status:"Published"});

  const ENG={IELTS:"1–9",TOEFL:"0–120",Duolingo:"10–160",PTE:"10–90"};
  const STD={GRE:"260–340",GMAT:"200–800",SAT:"400–1600"};

  const addEng=()=>{if(engForm.score){setEngTests(p=>[...p,{...engForm,id:duid()}]);setEngForm(p=>({...p,score:""}));}};
  const addStd=()=>{if(stdForm.score){setStdTests(p=>[...p,{...stdForm,id:duid()}]);setStdForm(p=>({...p,score:""}));}};
  const addAct=()=>{if(actInput.trim()){setActivities(p=>[...p,{label:actInput.trim(),id:duid()}]);setActInput("");}};
  const addSkill=()=>{if(skillInput.trim()){setSkills(p=>[...p,{label:skillInput.trim(),id:duid()}]);setSkillInput("");}};
  const addPaper=()=>{if(paperForm.title.trim()){setPapers(p=>[...p,{...paperForm,id:duid()}]);setPaperForm({title:"",status:"Published"});}};
  const canSubmit=edu.level&&(engTests.length>0||stdTests.length>0);

  const SHead=({icon,label,green})=>(
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,marginTop:24,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
      <div style={{width:28,height:28,borderRadius:8,background:green?C.greenLight:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <DIcon d={icon} size={14} color={green?C.greenDark:C.navy}/>
      </div>
      <span style={{fontSize:13,fontWeight:800,color:C.navy}}>{label}</span>
    </div>
  );

  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
      <div style={{marginBottom:24}}>
        <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",padding:0,marginBottom:12,fontWeight:600}}>
          <DIcon d={dpaths.chevR} size={14} color={C.textMuted} style={{transform:"rotate(180deg)"}}/>Back
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:C.navy,borderRadius:14,marginBottom:20}}>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:800,color:C.white}}>{university.name} · {program}</div>
            <div style={{fontSize:11.5,color:"rgba(255,255,255,0.4)",marginTop:2}}>{researchAreas.length>0?`Research: ${researchAreas.join(", ")}`:"Build your profile to check admission chances"}</div>
          </div>
        </div>
        <h2 style={{fontSize:22,fontWeight:800,color:C.navy,margin:"0 0 6px",letterSpacing:"-0.02em"}}>Your Academic Profile</h2>
        <p style={{fontSize:13.5,color:C.textMuted,margin:0}}>Fill in your details for an accurate AI admission analysis.</p>
      </div>

      <SHead icon={dpaths.cap} label="Education Background"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:12}}>
        <div><DLabel>Degree Level *</DLabel><DSelect value={edu.level} onChange={e=>setEdu(p=>({...p,level:e.target.value}))}><option value="">Select…</option><option value="bachelors">Bachelor's</option><option value="masters">Master's</option><option value="phd">PhD</option></DSelect></div>
        {(edu.level==="masters"||edu.level==="phd")&&<div><DLabel>Undergrad CGPA</DLabel><DInput type="number" step="0.01" placeholder="e.g. 3.80" value={edu.ugCgpa} onChange={e=>setEdu(p=>({...p,ugCgpa:e.target.value}))}/></div>}
        <div><DLabel>University (optional)</DLabel><DInput placeholder="e.g. BUET, DU" value={edu.ugUniv} onChange={e=>setEdu(p=>({...p,ugUniv:e.target.value}))}/></div>
        <div><DLabel>Field of Study (optional)</DLabel><DInput placeholder="e.g. CSE, EEE" value={edu.ugField} onChange={e=>setEdu(p=>({...p,ugField:e.target.value}))}/></div>
      </div>

      <SHead icon={dpaths.globe} label="English Proficiency" green/>
      <div style={{display:"flex",gap:10,marginBottom:10}}>
        <div style={{flex:1}}><DSelect value={engForm.type} onChange={e=>setEngForm(p=>({...p,type:e.target.value}))}>{Object.keys(ENG).map(k=><option key={k}>{k}</option>)}</DSelect></div>
        <div style={{flex:1}}><DInput type="number" placeholder={ENG[engForm.type]} value={engForm.score} onChange={e=>setEngForm(p=>({...p,score:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addEng()}/></div>
        <Btn onClick={addEng} icon={dpaths.plus} sm>Add</Btn>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:8}}>
        <AnimatePresence>{engTests.map(t=><DTag key={t.id} label={`${t.type} ${t.score}`} color={C.greenDark} bg={C.greenLight} onRemove={()=>setEngTests(p=>p.filter(x=>x.id!==t.id))}/>)}</AnimatePresence>
      </div>

      <SHead icon={dpaths.award} label="Standardized Tests"/>
      <div style={{display:"flex",gap:10,marginBottom:10}}>
        <div style={{flex:1}}><DSelect value={stdForm.type} onChange={e=>setStdForm(p=>({...p,type:e.target.value}))}>{Object.keys(STD).map(k=><option key={k}>{k}</option>)}</DSelect></div>
        <div style={{flex:1}}><DInput type="number" placeholder={STD[stdForm.type]} value={stdForm.score} onChange={e=>setStdForm(p=>({...p,score:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addStd()}/></div>
        <Btn onClick={addStd} icon={dpaths.plus} sm>Add</Btn>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:8}}>
        <AnimatePresence>{stdTests.map(t=><DTag key={t.id} label={`${t.type} ${t.score}`} color="#7c3aed" bg="#f5f3ff" onRemove={()=>setStdTests(p=>p.filter(x=>x.id!==t.id))}/>)}</AnimatePresence>
      </div>

      <SHead icon={dpaths.list} label="Extracurricular Activities"/>
      <div style={{display:"flex",gap:10,marginBottom:10}}>
        <DInput placeholder="e.g. Debate Club President, IEEE Volunteer" value={actInput} onChange={e=>setActInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAct()}/>
        <Btn onClick={addAct} icon={dpaths.plus} sm>Add</Btn>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:8}}>
        <AnimatePresence>{activities.map(a=><DTag key={a.id} label={a.label} color="#b45309" bg="#fffbeb" onRemove={()=>setActivities(p=>p.filter(x=>x.id!==a.id))}/>)}</AnimatePresence>
      </div>

      <SHead icon={dpaths.bolt} label="Skills & Technologies" green/>
      <div style={{display:"flex",gap:10,marginBottom:10}}>
        <DInput placeholder="e.g. Python, TensorFlow, Figma" value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSkill()}/>
        <Btn onClick={addSkill} icon={dpaths.plus} sm>Add</Btn>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:8}}>
        <AnimatePresence>{skills.map(s=><DTag key={s.id} label={s.label} color="#0891b2" bg="#ecfeff" onRemove={()=>setSkills(p=>p.filter(x=>x.id!==s.id))}/>)}</AnimatePresence>
      </div>

      <SHead icon={dpaths.book} label="Research & Publications"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:10,marginBottom:10,alignItems:"end"}}>
        <div><DLabel>Paper Title</DLabel><DInput placeholder="e.g. Transformer-based NLP for Bengali" value={paperForm.title} onChange={e=>setPaperForm(p=>({...p,title:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addPaper()}/></div>
        <div style={{minWidth:120}}><DLabel>Status</DLabel><DSelect value={paperForm.status} onChange={e=>setPaperForm(p=>({...p,status:e.target.value}))} style={{minWidth:120}}><option>Published</option><option>Under Review</option><option>Project</option></DSelect></div>
        <div><Btn onClick={addPaper} icon={dpaths.plus} sm>Add</Btn></div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:24}}>
        <AnimatePresence>{papers.map(p=><DTag key={p.id} label={`${p.title} [${p.status}]`} color="#0f766e" bg="#f0fdfa" onRemove={()=>setPapers(prev=>prev.filter(x=>x.id!==p.id))}/>)}</AnimatePresence>
      </div>

      <div style={{display:"flex",gap:12,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
        <Btn onClick={onBack} variant="ghost">Back</Btn>
        <Btn onClick={()=>onSubmit({edu,engTests,stdTests,activities,skills,papers})} disabled={!canSubmit} full icon={dpaths.spark}>Run AI Admission Analysis</Btn>
      </div>
      {!canSubmit&&<p style={{fontSize:12,color:C.textDim,marginTop:8,textAlign:"center"}}>Add your degree level and at least one test score to continue.</p>}
    </motion.div>
  );
};

const Step5=({university,program,researchAreas,profile,onReset})=>{
  const [loading,setLoading]=useState(true);
  const [results,setResults]=useState(null);
  const [error,setError]=useState(null);

  useEffect(()=>{
    const analyze=async()=>{
      try{
        const summary=`Target University: ${university.name} (Rank #${university.rank}), ${university.country}\nTarget Program: ${program}\nResearch Areas: ${researchAreas.join(", ")||"Not specified"}\n---\nEducation: ${profile.edu.level||"Not specified"}\nCGPA: ${profile.edu.ugCgpa||"Not provided"}\nField: ${profile.edu.ugField||"Not specified"}\nUniversity: ${profile.edu.ugUniv||"Not specified"}\nEnglish Tests: ${profile.engTests.map(t=>`${t.type} ${t.score}`).join(", ")||"None"}\nStandardized Tests: ${profile.stdTests.map(t=>`${t.type} ${t.score}`).join(", ")||"None"}\nActivities (${profile.activities.length}): ${profile.activities.map(a=>a.label).join(", ")||"None"}\nSkills: ${profile.skills.map(s=>s.label).join(", ")||"None"}\nPublications (${profile.papers.length}): ${profile.papers.map(p=>`${p.title} [${p.status}]`).join("; ")||"None"}`.trim();
        const prompt=`You are an expert international university admissions consultant with deep knowledge of top global universities.\n\nAnalyze this student's profile for admission to their target program and provide a comprehensive assessment.\n\n${summary}\n\nRespond ONLY with valid JSON (no markdown, no extra text):\n{"admissionScore":<int 0-100>,"admissionLabel":"<Exceptional|Strong|Competitive|Developing|Needs Work>","scholarshipChance":"<High|Medium|Low>","scholarshipScore":<int 0-100>,"visaRate":"<pct>","strengths":["<s1>","<s2>","<s3>"],"weaknesses":["<w1>","<w2>"],"fitAnalysis":"<2 sentences>","scholarshipInsights":{"merit":"<1 sentence>","research":"<1 sentence>","need":"<1 sentence>"},"roadmap":["<step 1>","<step 2>","<step 3>","<step 4>","<step 5>"]}`;
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:prompt}]})});
        if(!res.ok) throw new Error(`${res.status}`);
        const data=await res.json();
        const text=data.content.map(b=>b.text||"").join("");
        setResults(JSON.parse(text.replace(/```json|```/g,"").trim()));
      }catch(e){setError("Analysis failed — please try again.");}
      finally{setLoading(false);}
    };
    analyze();
  },[]);

  const scoreColor=s=>s>=80?C.green:s>=60?"#f59e0b":s>=40?"#ef8c22":"#ef4444";
  const circ=2*Math.PI*48;

  if(error) return <div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:15,color:"#ef4444",marginBottom:16}}>{error}</div><Btn onClick={onReset} variant="ghost">Start over</Btn></div>;
  if(loading) return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{textAlign:"center",padding:"60px 0"}}>
      <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} style={{display:"inline-block",marginBottom:20}}>
        <DIcon d={dpaths.loader} size={40} color={C.green} sw={2}/>
      </motion.div>
      <div style={{fontSize:17,fontWeight:700,color:C.navy,marginBottom:8}}>Analyzing your profile…</div>
      <div style={{fontSize:13,color:C.textMuted,marginBottom:32}}>Claude is reviewing your application for {university.name}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,maxWidth:360,margin:"0 auto"}}>
        {["Evaluating academic background against requirements","Checking test scores vs program benchmarks","Assessing research and extracurricular fit","Computing scholarship eligibility","Building your personalized roadmap"].map((s,i)=>(
          <motion.div key={s} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.7}}
            style={{display:"flex",alignItems:"center",gap:10,fontSize:12.5,color:C.textMuted,padding:"9px 14px",background:C.bg,borderRadius:9,textAlign:"left"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.green,flexShrink:0}}/>{s}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const r=results;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,color:C.navy,margin:"0 0 4px",letterSpacing:"-0.02em"}}>Admission Analysis</h2>
          <p style={{fontSize:13,color:C.textMuted,margin:0}}>{university.name} · {program}</p>
        </div>
        <Btn onClick={onReset} variant="ghost" sm icon={dpaths.x}>Start Over</Btn>
      </div>
      <div style={{background:C.navy,borderRadius:20,padding:"28px 32px",marginBottom:20,display:"flex",alignItems:"center",gap:32}}>
        <div style={{position:"relative",flexShrink:0}}>
          <svg width={120} height={120} viewBox="0 0 120 120">
            <circle cx={60} cy={60} r={48} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={9}/>
            <motion.circle cx={60} cy={60} r={48} fill="none" stroke={scoreColor(r.admissionScore)} strokeWidth={9} strokeLinecap="round" strokeDasharray={circ} initial={{strokeDashoffset:circ}} animate={{strokeDashoffset:circ*(1-r.admissionScore/100)}} transition={{duration:1.2,ease:"easeOut"}} style={{transform:"rotate(-90deg)",transformOrigin:"60px 60px"}}/>
            <text x={60} y={55} textAnchor="middle" fontSize={26} fontWeight={800} fill={scoreColor(r.admissionScore)} fontFamily="DM Sans,sans-serif">{r.admissionScore}</text>
            <text x={60} y={72} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.4)" fontFamily="DM Sans,sans-serif">score</text>
          </svg>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:22,fontWeight:900,color:C.white,letterSpacing:"-0.03em",marginBottom:6}}>{r.admissionLabel}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.6,marginBottom:14}}>{r.fitAnalysis}</div>
          <div style={{display:"flex",gap:20}}>
            {[{label:"Scholarship",value:r.scholarshipChance,accent:r.scholarshipScore>=70?C.green:"#f59e0b"},{label:"Visa Rate",value:r.visaRate,accent:"#60a5fa"}].map(({label,value,accent})=>(
              <div key={label}>
                <div style={{fontSize:15,fontWeight:800,color:accent}}>{value}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:16,padding:"18px 20px",boxShadow:C.shadow}}>
          <div style={{fontSize:12,fontWeight:800,color:C.greenDark,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
            <DIcon d={dpaths.check} size={13} color={C.green} sw={2.5}/> Strengths
          </div>
          {(r.strengths||[]).map((s,i)=>(
            <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:8,padding:"8px 12px",background:C.greenLight,borderRadius:9}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:C.green,flexShrink:0,marginTop:5}}/>
              <span style={{fontSize:12.5,color:C.textMid,lineHeight:1.5}}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:16,padding:"18px 20px",boxShadow:C.shadow}}>
          <div style={{fontSize:12,fontWeight:800,color:"#b45309",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
            <DIcon d={dpaths.chev} size={13} color="#f59e0b" sw={2.5}/> Areas to Improve
          </div>
          {(r.weaknesses||[]).map((w,i)=>(
            <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:8,padding:"8px 12px",background:"#fffbeb",borderRadius:9}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"#f59e0b",flexShrink:0,marginTop:5}}/>
              <span style={{fontSize:12.5,color:C.textMid,lineHeight:1.5}}>{w}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:16,padding:"20px 22px",marginBottom:14,boxShadow:C.shadow}}>
        <div style={{fontSize:12,fontWeight:800,color:C.navy,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
          <DIcon d={dpaths.award} size={13} color={C.navy}/> Scholarship Insights
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[{label:"Merit-Based",text:r.scholarshipInsights?.merit,icon:dpaths.star,color:"#7c3aed",bg:"#f5f3ff"},{label:"Research-Based",text:r.scholarshipInsights?.research,icon:dpaths.flask,color:"#0891b2",bg:"#ecfeff"},{label:"Need-Based",text:r.scholarshipInsights?.need,icon:dpaths.shield,color:C.greenDark,bg:C.greenLight}].map(({label,text,icon,color,bg})=>(
            <div key={label} style={{padding:"12px 14px",background:bg,borderRadius:11}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
                <DIcon d={icon} size={13} color={color}/>
                <span style={{fontSize:11,fontWeight:800,color,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span>
              </div>
              <p style={{fontSize:12,color:C.textMid,margin:0,lineHeight:1.5}}>{text||"No info available."}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:C.navy,borderRadius:16,padding:"22px 24px",marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:16,display:"flex",alignItems:"center",gap:6}}>
          <DIcon d={dpaths.road} size={13} color={C.green}/> Improvement Roadmap
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {(r.roadmap||[]).map((step,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
              style={{display:"flex",alignItems:"flex-start",gap:12,padding:"11px 14px",background:"rgba(255,255,255,0.06)",borderRadius:11}}>
              <span style={{minWidth:22,height:22,background:C.green,color:C.white,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0,marginTop:1}}>{i+1}</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.8)",lineHeight:1.5}}>{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <Btn onClick={onReset} full variant="ghost" icon={dpaths.arrow}>Analyze Another University</Btn>
    </motion.div>
  );
};

function DreamUniversityPage({onNavigate}) {
  const [step,setStep]=useState(0);
  const [university,setUniversity]=useState(null);
  const [program,setProgram]=useState(null);
  const [researchAreas,setResearchAreas]=useState([]);
  const [profile,setProfile]=useState(null);
  const topRef=useRef(null);
  const scrollTop=()=>topRef.current?.scrollIntoView({behavior:"smooth"});
  const handleUniSelect=u=>{setUniversity(u);setStep(1);scrollTop();};
  const handleProgSelect=p=>{setProgram(p);setStep(2);scrollTop();};
  const handleResearch=areas=>{setResearchAreas(areas);setStep(3);scrollTop();};
  const handleProfile=prof=>{setProfile(prof);setStep(4);scrollTop();};
  const handleReset=()=>{setStep(0);setUniversity(null);setProgram(null);setResearchAreas([]);setProfile(null);scrollTop();};

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}`}</style>
      <div ref={topRef} style={{position:"sticky",top:0,zIndex:200,background:"rgba(247,248,250,0.92)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"0 24px",height:60,display:"flex",alignItems:"center",gap:12}}>
        <button type="button" onClick={()=>onNavigate('home')}
          onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background=C.white}
          style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:9,color:C.textMuted,fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s",flexShrink:0}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Back
        </button>
        <div style={{flex:1}}/>
        <button type="button" onClick={()=>onNavigate('recommend')}
          onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background=C.white}
          style={{display:"flex",alignItems:"center",gap:6,padding:"6px 13px",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:9,color:C.textMuted,fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s",flexShrink:0}}>
          Recommendation
        </button>
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"28px 24px 60px"}}>
        <motion.div layout>
          <div style={{background:C.white,borderRadius:20,padding:"32px 36px",boxShadow:C.shadow,border:`1px solid ${C.border}`}}>
            <StepBar current={step}/>
            <AnimatePresence mode="wait">
              {step===0&&<Step1 key="s1" onSelect={handleUniSelect}/>}
              {step===1&&<Step2 key="s2" university={university} onSelect={handleProgSelect} onBack={()=>setStep(0)}/>}
              {step===2&&<Step3 key="s3" university={university} program={program} onSelect={handleResearch} onSkip={()=>handleResearch([])} onBack={()=>setStep(1)}/>}
              {step===3&&<Step4 key="s4" university={university} program={program} researchAreas={researchAreas} onSubmit={handleProfile} onBack={()=>setStep(2)}/>}
              {step===4&&<Step5 key="s5" university={university} program={program} researchAreas={researchAreas} profile={profile} onReset={handleReset}/>}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HOME PAGE (AdmissionChanceCalculator)
// ═════════════════════════════════════════════════════════════════════════════
function HomePage({ onNavigate }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authData, setAuthData] = useState({ name: '', email: '', password: '', dob: '', edu_info_qn: '' });
  const [user, setUser] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchUniversities();
    fetchCountries();
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (token && userData.userID) { setIsLoggedIn(true); setUser(userData); fetchUserApplications(userData.userID); }
  };

  const fetchUserApplications = async (userId) => {
    try { const r = await fetch(`http://127.0.0.1:8000/api/applications/user/${userId}`); const d = await r.json(); setApplications(d.data || d || []); } catch {}
  };
  const fetchUniversities = async () => {
    try { const r = await fetch('http://127.0.0.1:8000/api/universities'); const d = await r.json(); setUniversities(d.data || d || []); } catch {}
  };
  const fetchCountries = async () => {
    try { const r = await fetch('http://127.0.0.1:8000/api/countries'); const d = await r.json(); setCountries(d); } catch {}
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = authMode === 'login' ? 'http://127.0.0.1:8000/api/login' : 'http://127.0.0.1:8000/api/register';
    try {
      const response = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(authData) });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true); setUser(data.user); setShowAuthModal(false);
        setAuthData({ name:'', email:'', password:'', dob:'', edu_info_qn:'' });
        fetchUserApplications(data.user.userID);
      } else { alert(data.message || 'Authentication failed'); }
    } catch { alert('Connection error. Please try again.'); }
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return { color:'#10b981', bg:'rgba(16,185,129,0.1)', icon:CheckCircle, label:'ACCEPTED' };
      case 'rejected': return { color:'#ef4444', bg:'rgba(239,68,68,0.1)', icon:X, label:'REJECTED' };
      case 'under review': return { color:'#f59e0b', bg:'rgba(245,158,11,0.1)', icon:Clock, label:'UNDER REVIEW' };
      default: return { color:'#64748b', bg:'rgba(100,116,139,0.1)', icon:Clock, label:'PENDING' };
    }
  };

  const quickStats = [
    { label:'Universities', value:universities.length.toString(), icon:Building, color:'#6366f1' },
    { label:'Countries', value:countries.length.toString(), icon:Globe, color:'#10b981' },
    { label:'Applications', value:applications.length.toString(), icon:FileText, color:'#f59e0b' },
    { label:'Match Rate', value:'92%', icon:TrendingUp, color:'#ec4899' },
  ];

  const features = [
    { title:'AI-Powered Matching', desc:'Smart algorithms analyze 50+ factors to find your ideal match', icon:Sparkles, color:'#6366f1', bg:'#6366f110' },
    { title:'Scholarship Finder', desc:'Discover funding opportunities tailored to your profile', icon:Award, color:'#f59e0b', bg:'#f59e0b10' },
    { title:'Visa Success Rate', desc:'Data-driven visa success predictions by country and university', icon:Shield, color:'#10b981', bg:'#10b98110' },
    { title:'Global Network', desc:'Access data from thousands of universities across 60+ countries', icon:Globe, color:'#ec4899', bg:'#ec489910' },
  ];

  const navItems = [
    { label:'Home', icon:Home, page:'home' },
    { label:'Recommend', icon:Sparkles, page:'recommend' },
    { label:'Dream Uni', icon:Target, page:'dream' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#f0f2f5', fontFamily:"'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.14) !important; }
        .btn-hover { transition: opacity 0.15s ease, transform 0.15s ease; }
        .btn-hover:hover { opacity: 0.9; transform: scale(1.01); }
      `}</style>

      {/* Sidebar */}
      <motion.div
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        style={{ position:'fixed', top:'20px', left:'20px', bottom:'20px', width:sidebarCollapsed?'68px':'240px', background:'#0a0f1e', borderRadius:'16px', zIndex:100, display:'flex', flexDirection:'column', transition:'width 0.2s ease-out', overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)', boxShadow:'0 8px 32px rgba(0,0,0,0.25)' }}
      >
        <div style={{ padding:'20px 16px', display:'flex', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.06)', height:'72px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', overflow:'hidden' }}>
            <div style={{ minWidth:'36px', height:'36px', background:'linear-gradient(135deg, #10b981, #059669)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <GraduationCap size={18} color="white" />
            </div>
            {!sidebarCollapsed && <span style={{ color:'#fff', fontWeight:'700', fontSize:'16px', whiteSpace:'nowrap' }}>EduGuide AI</span>}
          </div>
        </div>
        <div style={{ padding:'8px 12px', flex:1 }}>
          {navItems.map(({ label, icon: Icon, page }) => (
            <button key={label} onClick={() => onNavigate(page)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:'12px', height:'40px', padding:'0 12px', justifyContent:sidebarCollapsed?'center':'flex-start', background:'transparent', border:'none', borderRadius:'8px', cursor:'pointer', marginBottom:'4px', color:'rgba(255,255,255,0.6)', fontSize:'13px', transition:'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,0.6)'; }}
            >
              <Icon size={18} style={{ flexShrink:0 }} />
              {!sidebarCollapsed && <span style={{ whiteSpace:'nowrap' }}>{label}</span>}
            </button>
          ))}
        </div>
        <div style={{ padding:'12px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => { localStorage.clear(); setIsLoggedIn(false); setUser(null); }}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:'12px', height:'40px', padding:'0 12px', justifyContent:sidebarCollapsed?'center':'flex-start', background:'transparent', border:'none', borderRadius:'8px', cursor:'pointer', color:'#ef4444', fontSize:'13px' }}>
            <LogOut size={18} style={{ flexShrink:0 }} />
            {!sidebarCollapsed && <span style={{ whiteSpace:'nowrap' }}>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{ marginLeft:sidebarCollapsed?'100px':'276px', transition:'margin-left 0.25s ease', minHeight:'100vh', padding:'16px 24px 48px' }}>
        {/* Navbar */}
        <motion.div initial={{ y:-16, opacity:0 }} animate={{ y:0, opacity:1 }}
          style={{ background:'white', padding:'14px 24px', borderRadius:'16px', marginBottom:'28px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px', boxShadow:'0 1px 0 rgba(0,0,0,0.05), 0 4px 12px -4px rgba(0,0,0,0.07)' }}
        >
          <div>
            <h2 style={{ margin:0, fontSize:'18px', fontWeight:'700', color:'#0a0f1e' }}>Admission Chance Calculator</h2>
            <p style={{ color:'#94a3b8', margin:'2px 0 0', fontSize:'13px' }}>{user ? `Welcome back, ${user.name}!` : 'Your AI-powered study abroad companion'}</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <button onClick={() => setShowNotifications(!showNotifications)}
              style={{ width:'40px', height:'40px', background:'#f8fafc', border:'1.5px solid #e9ecef', borderRadius:'12px', cursor:'pointer', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bell size={17} style={{ color:'#64748b' }} />
              {applications.length > 0 && <span style={{ position:'absolute', top:'-4px', right:'-4px', background:'#10b981', color:'white', fontSize:'9px', padding:'2px 5px', borderRadius:'20px', fontWeight:'700' }}>{applications.length}</span>}
            </button>
            {!isLoggedIn ? (
              <button onClick={() => setShowAuthModal(true)}
                style={{ padding:'8px 20px', background:'linear-gradient(135deg, #10b981, #059669)', color:'white', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>
                Sign In
              </button>
            ) : (
              <div style={{ width:'40px', height:'40px', background:'linear-gradient(135deg, #10b981, #059669)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'15px' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'16px', marginBottom:'36px' }}>
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:i*0.07 }}
                style={{ background:'white', borderRadius:'16px', padding:'20px', boxShadow:'0 1px 0 rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.06)' }}>
                <div style={{ width:'40px', height:'40px', background:`${stat.color}12`, borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
                  <Icon size={20} color={stat.color} />
                </div>
                <p style={{ fontSize:'1.9rem', fontWeight:'800', color:'#0a0f1e', margin:0 }}>{stat.value}</p>
                <p style={{ color:'#94a3b8', fontSize:'12px', margin:'4px 0 0', fontWeight:'500' }}>{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Hero text */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
          style={{ textAlign:'center', marginBottom:'40px' }}>
          <h1 style={{ fontSize:'clamp(1.6rem, 3vw, 2.4rem)', fontWeight:'800', color:'#0a0f1e', margin:'0 0 12px', lineHeight:'1.2' }}>
            Find Your Path to the <span style={{ background:'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Right University</span>
          </h1>
          <p style={{ color:'#64748b', fontSize:'15px', maxWidth:'520px', margin:'0 auto', lineHeight:'1.6' }}>
            Use AI to match your profile with the best universities, or check your chances at your dream school.
          </p>
        </motion.div>

        {/* Two Main Feature Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(360px, 1fr))', gap:'24px', marginBottom:'48px' }}>
          {/* Card 1 — Recommend */}
          <motion.div className="card-hover" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            style={{ background:'white', borderRadius:'24px', overflow:'hidden', boxShadow:'0 4px 20px -4px rgba(0,0,0,0.08)', border:'1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding:'36px 32px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', width:'160px', height:'160px', background:'rgba(255,255,255,0.06)', borderRadius:'50%', top:'-40px', right:'-40px' }}/>
              <div style={{ position:'absolute', width:'100px', height:'100px', background:'rgba(255,255,255,0.04)', borderRadius:'50%', bottom:'-20px', left:'20px' }}/>
              <div style={{ width:'60px', height:'60px', background:'rgba(255,255,255,0.18)', borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', position:'relative' }}>
                <Sparkles size={28} color="white" />
              </div>
              <h3 style={{ fontSize:'1.4rem', fontWeight:'800', color:'white', margin:'0 0 10px', lineHeight:'1.25', position:'relative' }}>
                Choose Best University<br/>Based on Your Result
              </h3>
              <p style={{ color:'rgba(255,255,255,0.82)', margin:0, fontSize:'13.5px', lineHeight:'1.6', position:'relative' }}>
                Let our AI analyze your complete academic profile and surface the universities where you'll thrive.
              </p>
            </div>
            <div style={{ padding:'28px 32px' }}>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'28px' }}>
                {['AI-powered matching','Scholarship predictions','Visa success analysis','Personalized insights'].map(f => (
                  <span key={f} style={{ background:'#f3f0ff', color:'#6d28d9', padding:'5px 12px', borderRadius:'20px', fontSize:'11.5px', fontWeight:'600' }}>{f}</span>
                ))}
              </div>
              <button className="btn-hover" onClick={() => onNavigate('recommend')}
                style={{ width:'100%', padding:'15px', background:'#0a0f1e', color:'white', border:'none', borderRadius:'14px', fontWeight:'700', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', cursor:'pointer' }}>
                Get Started <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          {/* Card 2 — Dream */}
          <motion.div className="card-hover" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            style={{ background:'white', borderRadius:'24px', overflow:'hidden', boxShadow:'0 4px 20px -4px rgba(0,0,0,0.08)', border:'1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ background:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding:'36px 32px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', width:'160px', height:'160px', background:'rgba(255,255,255,0.06)', borderRadius:'50%', top:'-40px', right:'-40px' }}/>
              <div style={{ position:'absolute', width:'100px', height:'100px', background:'rgba(255,255,255,0.04)', borderRadius:'50%', bottom:'-20px', left:'20px' }}/>
              <div style={{ width:'60px', height:'60px', background:'rgba(255,255,255,0.18)', borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', position:'relative' }}>
                <Target size={28} color="white" />
              </div>
              <h3 style={{ fontSize:'1.4rem', fontWeight:'800', color:'white', margin:'0 0 10px', lineHeight:'1.25', position:'relative' }}>
                Select Your<br/>Dream University
              </h3>
              <p style={{ color:'rgba(255,255,255,0.82)', margin:0, fontSize:'13.5px', lineHeight:'1.6', position:'relative' }}>
                Pick any university and get a detailed probability score plus a personalised roadmap to improve your chances.
              </p>
            </div>
            <div style={{ padding:'28px 32px' }}>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'28px' }}>
                {['Admission probability','Improvement roadmap','Scholarship guide','Application tips'].map(f => (
                  <span key={f} style={{ background:'#fff0f3', color:'#e11d48', padding:'5px 12px', borderRadius:'20px', fontSize:'11.5px', fontWeight:'600' }}>{f}</span>
                ))}
              </div>
              <button className="btn-hover" onClick={() => onNavigate('dream')}
                style={{ width:'100%', padding:'15px', background:'#0a0f1e', color:'white', border:'none', borderRadius:'14px', fontWeight:'700', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', cursor:'pointer' }}>
                Check Your Chance <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'16px' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1*i+0.4 }}
                style={{ background:'white', borderRadius:'16px', padding:'20px', boxShadow:'0 1px 0 rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.06)' }}>
                <div style={{ width:'44px', height:'44px', background:f.bg, borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
                  <Icon size={22} color={f.color} />
                </div>
                <h4 style={{ fontSize:'14px', fontWeight:'700', color:'#0a0f1e', margin:'0 0 6px' }}>{f.title}</h4>
                <p style={{ fontSize:'12.5px', color:'#64748b', margin:0, lineHeight:'1.5' }}>{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}
            onClick={() => setShowAuthModal(false)}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              style={{ background:'white', borderRadius:'24px', width:'90%', maxWidth:'440px', padding:'32px' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
                <h2 style={{ margin:0, fontSize:'1.4rem', fontWeight:'800', color:'#0a0f1e' }}>{authMode==='login'?'Welcome Back':'Create Account'}</h2>
                <button onClick={() => setShowAuthModal(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20}/></button>
              </div>
              <form onSubmit={handleAuth}>
                {authMode==='register' && (
                  <>
                    <input type="text" placeholder="Full Name" required value={authData.name} onChange={e=>setAuthData({...authData,name:e.target.value})} style={{ width:'100%', padding:'12px', border:'1.5px solid #e9ecef', borderRadius:'12px', fontSize:'13px', marginBottom:'12px', outline:'none' }}/>
                    <input type="date" required value={authData.dob} onChange={e=>setAuthData({...authData,dob:e.target.value})} style={{ width:'100%', padding:'12px', border:'1.5px solid #e9ecef', borderRadius:'12px', fontSize:'13px', marginBottom:'12px', outline:'none' }}/>
                    <select required value={authData.edu_info_qn} onChange={e=>setAuthData({...authData,edu_info_qn:e.target.value})} style={{ width:'100%', padding:'12px', border:'1.5px solid #e9ecef', borderRadius:'12px', fontSize:'13px', marginBottom:'12px', outline:'none' }}>
                      <option value="">Highest Education</option>
                      <option value="phd">PhD</option><option value="masters">Master's Degree</option><option value="bachelors">Bachelor's Degree</option><option value="high_school">High School</option>
                    </select>
                  </>
                )}
                <input type="email" placeholder="Email" required value={authData.email} onChange={e=>setAuthData({...authData,email:e.target.value})} style={{ width:'100%', padding:'12px', border:'1.5px solid #e9ecef', borderRadius:'12px', fontSize:'13px', marginBottom:'12px', outline:'none' }}/>
                <input type="password" placeholder="Password" required value={authData.password} onChange={e=>setAuthData({...authData,password:e.target.value})} style={{ width:'100%', padding:'12px', border:'1.5px solid #e9ecef', borderRadius:'12px', fontSize:'13px', marginBottom:'20px', outline:'none' }}/>
                <button type="submit" style={{ width:'100%', padding:'13px', background:'linear-gradient(135deg, #10b981, #059669)', color:'white', border:'none', borderRadius:'12px', fontWeight:'600', cursor:'pointer', marginBottom:'14px' }}>
                  {authMode==='login'?'Sign In':'Create Account'}
                </button>
                <p style={{ textAlign:'center', fontSize:'13px', color:'#94a3b8', margin:0 }}>
                  {authMode==='login'?"Don't have an account? ":"Already have an account? "}
                  <button type="button" onClick={() => setAuthMode(authMode==='login'?'register':'login')} style={{ background:'none', border:'none', color:'#10b981', cursor:'pointer', fontWeight:'600' }}>
                    {authMode==='login'?'Sign Up':'Sign In'}
                  </button>
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setShowNotifications(false)}
              style={{ position:'fixed', inset:0, background:'rgba(10,15,30,0.45)', backdropFilter:'blur(4px)', zIndex:200 }}/>
            <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
              style={{ position:'fixed', top:0, right:0, width:'380px', height:'100%', background:'white', zIndex:201, display:'flex', flexDirection:'column', boxShadow:'-8px 0 32px rgba(0,0,0,0.12)' }}>
              <div style={{ padding:'24px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h2 style={{ fontSize:'1.15rem', fontWeight:'800', margin:0 }}>Applications</h2>
                <button onClick={() => setShowNotifications(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={18}/></button>
              </div>
              <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
                {applications.length===0 ? (
                  <div style={{ textAlign:'center', padding:'60px 24px' }}>
                    <FileText size={48} color="#cbd5e1" style={{ margin:'0 auto 16px' }}/>
                    <p style={{ color:'#94a3b8' }}>No applications yet</p>
                  </div>
                ) : applications.map((app, idx) => {
                  const si = getStatusInfo(app.status);
                  const SIcon = si.icon;
                  return (
                    <div key={idx} style={{ background:'#f8fafc', borderRadius:'12px', padding:'16px', marginBottom:'10px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'6px' }}>
                        <div>
                          <p style={{ fontWeight:'700', margin:0, fontSize:'13px' }}>{app.university_name}</p>
                          <p style={{ fontSize:'11px', color:'#94a3b8', margin:'4px 0 0' }}>{app.program_name||'Program not specified'}</p>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'4px', padding:'4px 8px', borderRadius:'20px', background:si.bg }}>
                          <SIcon size={10} color={si.color}/>
                          <span style={{ fontSize:'9px', fontWeight:'700', color:si.color }}>{si.label}</span>
                        </div>
                      </div>
                      <p style={{ fontSize:'10px', color:'#94a3b8', margin:'8px 0 0' }}>Applied: {app.applied_date||'N/A'}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ROOT APP — single-page router
// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activePage, setActivePage] = useState('home');

  return (
    <AnimatePresence mode="wait">
      {activePage === 'home' && (
        <motion.div key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}>
          <HomePage onNavigate={setActivePage} />
        </motion.div>
      )}
      {activePage === 'recommend' && (
        <motion.div key="recommend" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}>
          <RecommendationPage onNavigate={setActivePage} />
        </motion.div>
      )}
      {activePage === 'dream' && (
        <motion.div key="dream" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}>
          <DreamUniversityPage onNavigate={setActivePage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
