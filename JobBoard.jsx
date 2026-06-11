import { useState, useEffect, useRef, useMemo } from 'react';

/* ─── Styles ────────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0b1120;
    --accent: #23c55e;
    --glass: rgba(15,23,42,0.72);
    --glass-border: rgba(255,255,255,0.09);
    --on-dark: #e2e8f0;
    --muted: #64748b;
    --faint: #4b6080;
    --divider-dark: rgba(255,255,255,0.07);
    --divider-light: rgba(0,0,0,0.07);
  }

  body { font-family:'Plus Jakarta Sans',sans-serif; background:var(--bg); min-height:100vh; overflow-x:hidden; }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:rgba(35,197,94,0.3); border-radius:4px; }

  .dark-card {
    background:var(--glass);
    backdrop-filter:blur(18px) saturate(1.4);
    -webkit-backdrop-filter:blur(18px) saturate(1.4);
    border-radius:16px; border:1px solid var(--glass-border);
    box-shadow:0 4px 32px rgba(0,0,0,0.45);
  }
  .white-card {
    background:#fff; border-radius:14px;
    border:1px solid rgba(0,0,0,0.07);
    box-shadow:0 1px 8px rgba(0,0,0,0.06);
  }

  #bg-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; }
  .app-root  { position:relative; z-index:1; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
  .fade-up  { animation:fadeUp .3s cubic-bezier(.22,1,.36,1) both; }
  .spin-anim{ animation:spin .9s linear infinite; }

  .accent-btn {
    background:#23c55e; color:#fff; font-weight:700; border:none;
    cursor:pointer; font-family:inherit; transition:background .18s,transform .13s;
  }
  .accent-btn:hover  { background:#1aad51; transform:translateY(-1px); }
  .accent-btn:active { transform:scale(.97); }

  .ghost-btn {
    background:transparent; border:1px solid rgba(255,255,255,0.14);
    color:#94a3b8; font-family:inherit; cursor:pointer; transition:all .15s;
  }
  .ghost-btn:hover { border-color:#23c55e; color:#23c55e; background:rgba(35,197,94,0.06); }

  .job-row {
    padding:18px 20px; border-bottom:1px solid var(--divider-light);
    cursor:pointer; transition:background .15s;
  }
  .job-row:last-child { border-bottom:none; }
  .job-row:hover { background:#f8fffe; }

  .tag { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px;
    font-size:.69rem; font-weight:600; background:#f1f5f9; color:#475569;
    border:1px solid #e2e8f0; letter-spacing:.01em; }

  .filter-select {
    background:#fff; border:1px solid #e2e8f0; border-radius:10px;
    padding:8px 12px; font-family:'Plus Jakarta Sans',sans-serif; font-size:.78rem;
    color:#374151; cursor:pointer; outline:none; appearance:none;
    transition:border-color .15s;
  }
  .filter-select:focus { border-color:#23c55e; }

  .pg-btn {
    width:34px; height:34px; border-radius:9px; display:flex; align-items:center;
    justify-content:center; font-family:inherit; font-size:.78rem; font-weight:700;
    cursor:pointer; transition:all .15s; border:1px solid #e2e8f0;
    background:#fff; color:#374151;
  }
  .pg-btn:hover { border-color:#23c55e; color:#23c55e; }
  .pg-btn.active { background:#23c55e; color:#fff; border-color:#23c55e; }
  .pg-btn:disabled { opacity:.4; cursor:not-allowed; }

  .sidebar-job { padding:12px 0; border-bottom:1px solid var(--divider-dark); }
  .sidebar-job:last-child { border-bottom:none; }
  .sidebar-job:hover .sj-title { color:#23c55e; }
  .sj-title { font-size:.82rem; font-weight:700; color:var(--on-dark); transition:color .15s; cursor:pointer; }

  input::placeholder { color:#9ca3af; }

  .alert-input {
    flex:1; padding:9px 14px; border-radius:10px;
    border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.07);
    color:var(--on-dark); font-family:inherit; font-size:.8rem; outline:none;
  }
  .alert-input:focus { border-color:#23c55e; }
  .alert-input::placeholder { color:#4b6080; }
`;
(function inject() {
  if (document.getElementById('jb-styles')) return;
  const s = document.createElement('style');
  s.id = 'jb-styles'; s.textContent = STYLES;
  document.head.appendChild(s);
})();

/* ─── Animated Background ───────────────────────────────────────────────────── */
function AnimatedBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, id, dots = [];
    const resize = () => {
      W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight;
      dots = Array.from({ length: Math.floor(W * H / 16000) }, () => ({
        x:Math.random()*W, y:Math.random()*H,
        vx:(Math.random()-.5)*.2, vy:(Math.random()-.5)*.2,
        r:Math.random()*1.2+.4, a:Math.random()*.35+.08,
      }));
    };
    const G = 80;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      ctx.strokeStyle='rgba(35,197,94,0.035)'; ctx.lineWidth=1;
      for(let x=0;x<W;x+=G){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=G){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      ctx.fillStyle='rgba(35,197,94,0.07)';
      for(let x=G;x<W;x+=G) for(let y=G;y<H;y+=G){ctx.beginPath();ctx.arc(x,y,1.2,0,Math.PI*2);ctx.fill();}
      dots.forEach(d => {
        d.x+=d.vx; d.y+=d.vy;
        if(d.x<0)d.x=W; if(d.x>W)d.x=0; if(d.y<0)d.y=H; if(d.y>H)d.y=0;
        ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(35,197,94,${d.a})`; ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas id="bg-canvas" ref={ref}/>;
}

/* ─── Icons ─────────────────────────────────────────────────────────────────── */
const Ic = {
  Search:   ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  MapPin:   ()=><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Globe:    ()=><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Bookmark: ({f})=><svg width="16" height="16" fill={f?'#23c55e':'none'} viewBox="0 0 24 24" stroke={f?'#23c55e':'#9ca3af'} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  ArrowUpRight: ()=><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>,
  ChevDown: ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevL:    ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevR:    ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  Filter:   ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>,
  Shield:   ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check:    ({size=12})=><svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  Bell:     ()=><svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Send:     ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Briefcase:()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  Apply:    ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  GlobeG:   ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Lock:     ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  X:        ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ArrowR:   ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Ext:      ()=><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

/* ─── Company Logo Component ────────────────────────────────────────────────── */
const LOGO_STYLES = {
  Google:    { bg:'#fff',     border:'#e5e7eb', content: <svg viewBox="0 0 24 24" width="28" height="28"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
  LinkedIn:  { bg:'#0A66C2',  border:'#0A66C2', content: <span style={{color:'#fff',fontWeight:800,fontSize:'1rem',fontFamily:'serif'}}>in</span> },
  Shopify:   { bg:'#96BF48',  border:'#96BF48', content: <span style={{color:'#fff',fontWeight:800,fontSize:'1.1rem'}}>S</span> },
  Microsoft: { bg:'#fff',     border:'#e5e7eb', content: <svg viewBox="0 0 24 24" width="26" height="26"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg> },
  Amazon:    { bg:'#FF9900',  border:'#FF9900', content: <span style={{color:'#fff',fontWeight:800,fontSize:'1.1rem',fontFamily:'serif'}}>a</span> },
  RBC:       { bg:'#003168',  border:'#003168', content: <span style={{color:'#FFD700',fontWeight:800,fontSize:'.75rem'}}>RBC</span> },
  Apple:     { bg:'#000',     border:'#000',    content: <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
  Tesla:     { bg:'#CC0000',  border:'#CC0000', content: <span style={{color:'#fff',fontWeight:800,fontSize:'1rem'}}>T</span> },
  Deloitte:  { bg:'#86BC25',  border:'#86BC25', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.75rem'}}>D.</span> },
  HubSpot:   { bg:'#FF7A59',  border:'#FF7A59', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.8rem'}}>HS</span> },
  Nuvei:     { bg:'#5B21B6',  border:'#5B21B6', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.7rem'}}>nu</span> },
  Salesforce:{ bg:'#00A1E0',  border:'#00A1E0', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.7rem'}}>SF</span> },
  Stripe:    { bg:'#635BFF',  border:'#635BFF', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.9rem'}}>S</span> },
  Atlassian: { bg:'#0052CC',  border:'#0052CC', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.8rem'}}>A</span> },
  Spotify:   { bg:'#1DB954',  border:'#1DB954', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.9rem'}}>♫</span> },
  Siemens:   { bg:'#009999',  border:'#009999', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.75rem'}}>SIE</span> },
  NHS:       { bg:'#005EB8',  border:'#005EB8', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.75rem'}}>NHS</span> },
  KPMG:      { bg:'#00338D',  border:'#00338D', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.75rem'}}>KPMG</span> },
  SAP:       { bg:'#1172C5',  border:'#1172C5', content: <span style={{color:'#fff',fontWeight:800,fontSize:'.9rem'}}>SAP</span> },
};

function CompanyLogo({ company, size=52 }) {
  const s = LOGO_STYLES[company] || { bg:'#23c55e', border:'#23c55e', content:<span style={{color:'#fff',fontWeight:800}}>{company[0]}</span> };
  return (
    <div style={{ width:size, height:size, borderRadius:13, background:s.bg, border:`1.5px solid ${s.border}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
      {s.content}
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────────── */
const JOBS = [
  { id:1,  title:'Software Engineer',         company:'Google',     country:'Canada',  location:'Toronto, ON',    salary:'CAD 90K – 130K /yr', type:'Full-time', level:'Mid Level',    category:'Technology',   posted:'2h ago',  verified:true,  remote:false, desc:'Build scalable distributed systems for Google\'s core search infrastructure. 5+ years experience required.' },
  { id:2,  title:'Data Analyst',              company:'LinkedIn',   country:'Canada',  location:'Vancouver, BC',  salary:'CAD 70K – 95K /yr',  type:'Full-time', level:'Entry Level',   category:'Technology',   posted:'5h ago',  verified:true,  remote:false, desc:'Analyse product data to drive decisions. Proficiency in SQL and Python required.' },
  { id:3,  title:'Product Manager',           company:'Shopify',    country:'Canada',  location:'Ottawa, ON',     salary:'CAD 100K – 140K /yr',type:'Full-time', level:'Mid Level',    category:'Business',     posted:'1d ago',  verified:true,  remote:true,  desc:'Lead product strategy for Shopify\'s merchant success team. E-commerce background preferred.' },
  { id:4,  title:'Cloud Solutions Architect', company:'Microsoft',  country:'Canada',  location:'Montreal, QC',   salary:'CAD 110K – 150K /yr',type:'Full-time', level:'Senior Level', category:'Technology',   posted:'1d ago',  verified:true,  remote:false, desc:'Design enterprise cloud architectures on Azure. 8+ years experience, Azure cert preferred.' },
  { id:5,  title:'Operations Manager',        company:'Amazon',     country:'Canada',  location:'Calgary, AB',    salary:'CAD 75K – 105K /yr', type:'Full-time', level:'Mid Level',    category:'Operations',   posted:'2d ago',  verified:true,  remote:false, desc:'Oversee warehouse operations for Amazon\'s Western Canada fulfilment network.' },
  { id:6,  title:'Financial Analyst',         company:'RBC',        country:'Canada',  location:'Toronto, ON',    salary:'CAD 60K – 85K /yr',  type:'Full-time', level:'Entry Level',   category:'Finance',      posted:'2d ago',  verified:true,  remote:false, desc:'Support capital markets team with financial modelling and reporting. CFA candidate preferred.' },
  { id:7,  title:'iOS Developer',             company:'Apple',      country:'Canada',  location:'Toronto, ON',    salary:'CAD 95K – 135K /yr', type:'Full-time', level:'Senior Level', category:'Technology',   posted:'3h ago',  verified:true,  remote:false, desc:'Develop next-generation iOS apps for Apple\'s core platform team. Swift expertise required.' },
  { id:8,  title:'Manufacturing Engineer',    company:'Tesla',      country:'Canada',  location:'Vancouver, BC',  salary:'CAD 85K – 115K /yr', type:'Full-time', level:'Mid Level',    category:'Engineering',  posted:'4h ago',  verified:true,  remote:false, desc:'Drive continuous improvement on Tesla\'s EV battery pack production line.' },
  { id:9,  title:'Consultant',               company:'Deloitte',   country:'Canada',  location:'Montreal, QC',   salary:'CAD 65K – 90K /yr',  type:'Full-time', level:'Entry Level',   category:'Business',     posted:'6h ago',  verified:true,  remote:false, desc:'Join Deloitte\'s strategy consulting practice. Business or engineering degree required.' },
  { id:10, title:'Marketing Specialist',      company:'HubSpot',    country:'Canada',  location:'Remote',         salary:'CAD 60K – 80K /yr',  type:'Full-time', level:'Mid Level',    category:'Marketing',    posted:'8h ago',  verified:true,  remote:true,  desc:'Manage inbound marketing campaigns. HubSpot certification and 3+ years experience required.' },
  { id:11, title:'Business Analyst',          company:'Nuvei',      country:'Canada',  location:'Toronto, ON',    salary:'CAD 55K – 75K /yr',  type:'Full-time', level:'Entry Level',   category:'Business',     posted:'1d ago',  verified:true,  remote:false, desc:'Analyse fintech payment data and support product teams with actionable insights.' },
  { id:12, title:'Salesforce Administrator',  company:'Salesforce', country:'Canada',  location:'Vancouver, BC',  salary:'CAD 65K – 85K /yr',  type:'Full-time', level:'Mid Level',    category:'Technology',   posted:'2d ago',  verified:true,  remote:true,  desc:'Administer and customise Salesforce CRM for a fast-growing SaaS company.' },
  { id:13, title:'Backend Engineer',          company:'Stripe',     country:'USA',     location:'San Francisco, CA',salary:'USD 130K – 180K /yr',type:'Full-time', level:'Senior Level', category:'Technology',  posted:'1h ago',  verified:true,  remote:true,  desc:'Build and scale payment infrastructure handling millions of transactions. Go/Ruby expertise preferred.' },
  { id:14, title:'Product Designer',          company:'Atlassian',  country:'USA',     location:'Austin, TX',     salary:'USD 110K – 150K /yr',type:'Full-time', level:'Mid Level',    category:'Design',       posted:'3h ago',  verified:true,  remote:true,  desc:'Design intuitive experiences across Jira and Confluence. Figma expert required.' },
  { id:15, title:'Data Scientist',            company:'Spotify',    country:'USA',     location:'New York, NY',   salary:'USD 120K – 165K /yr',type:'Full-time', level:'Senior Level', category:'Technology',   posted:'6h ago',  verified:true,  remote:false, desc:'Build ML models for Spotify\'s recommendation engine. PhD or 5+ years ML experience.' },
  { id:16, title:'Mechanical Engineer',       company:'Siemens',    country:'Germany', location:'Munich',         salary:'€65K – 90K /yr',     type:'Full-time', level:'Mid Level',    category:'Engineering',  posted:'1d ago',  verified:true,  remote:false, desc:'Design precision components for Siemens\' industrial automation division. CAD proficiency required.' },
  { id:17, title:'Software Developer',        company:'SAP',        country:'Germany', location:'Walldorf',       salary:'€60K – 95K /yr',     type:'Full-time', level:'Mid Level',    category:'Technology',   posted:'2d ago',  verified:true,  remote:true,  desc:'Develop SAP S/4HANA cloud modules. ABAP or Java experience required.' },
  { id:18, title:'Staff Nurse',              company:'NHS',        country:'UK',      location:'London',         salary:'£27K – 40K /yr',     type:'Full-time', level:'Entry Level',   category:'Healthcare',   posted:'3h ago',  verified:true,  remote:false, desc:'Join the NHS in a frontline nursing role. NMC registration and UK right to work required.' },
  { id:19, title:'Audit Associate',          company:'KPMG',       country:'UK',      location:'Manchester',     salary:'£28K – 42K /yr',     type:'Full-time', level:'Entry Level',   category:'Finance',      posted:'1d ago',  verified:true,  remote:false, desc:'Graduate audit role at KPMG\'s Manchester office. ACA study support provided.' },
  { id:20, title:'UX Researcher',            company:'Google',     country:'UK',      location:'London',         salary:'£75K – 110K /yr',    type:'Full-time', level:'Senior Level', category:'Design',       posted:'5h ago',  verified:true,  remote:false, desc:'Lead user research programmes across Google\'s UK product portfolio.' },
  { id:21, title:'DevOps Engineer',          company:'Atlassian',  country:'Australia',location:'Sydney',        salary:'A$100K – 140K /yr',  type:'Full-time', level:'Mid Level',    category:'Technology',   posted:'2h ago',  verified:true,  remote:true,  desc:'Build CI/CD pipelines and manage Kubernetes infrastructure for Atlassian Cloud.' },
  { id:22, title:'Marketing Manager',        company:'Shopify',    country:'Australia',location:'Melbourne',     salary:'A$90K – 120K /yr',   type:'Full-time', level:'Senior Level', category:'Marketing',    posted:'1d ago',  verified:true,  remote:false, desc:'Lead performance marketing for Shopify\'s ANZ merchant growth team.' },
  { id:23, title:'Financial Controller',     company:'Deloitte',   country:'Australia',location:'Brisbane',      salary:'A$100K – 135K /yr',  type:'Full-time', level:'Senior Level', category:'Finance',      posted:'3d ago',  verified:true,  remote:false, desc:'Oversee financial reporting and compliance for a Deloitte enterprise client portfolio.' },
];

const FEATURED = [
  { id:'f1', title:'iOS Developer',          company:'Apple',     country:'Canada', location:'Toronto, ON',   salary:'CAD 95K – 135K /yr', verified:true },
  { id:'f2', title:'Manufacturing Engineer', company:'Tesla',     country:'Canada', location:'Vancouver, BC', salary:'CAD 85K – 115K /yr', verified:true },
  { id:'f3', title:'Consultant',            company:'Deloitte',  country:'Canada', location:'Montreal, QC',  salary:'CAD 65K – 90K /yr',  verified:true },
];
const RECOMMENDED = [
  { id:'r1', title:'Marketing Specialist',      company:'HubSpot',    country:'Canada', location:'Remote',        salary:'CAD 60K – 80K /yr',  verified:true },
  { id:'r2', title:'Business Analyst',          company:'Nuvei',      country:'Canada', location:'Toronto, ON',   salary:'CAD 55K – 75K /yr',  verified:true },
  { id:'r3', title:'Salesforce Administrator',  company:'Salesforce', country:'Canada', location:'Vancouver, BC', salary:'CAD 65K – 85K /yr',  verified:true },
];

const PER_PAGE = 6;

/* ─── Verified Badge ────────────────────────────────────────────────────────── */
function VerifiedBadge({ small }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, padding: small ? '1px 7px' : '2px 9px', background:'rgba(35,197,94,0.1)', border:'1px solid rgba(35,197,94,0.3)', borderRadius:20, fontSize: small ? '.62rem' : '.67rem', color:'#16a34a', fontWeight:700, whiteSpace:'nowrap' }}>
      <Ic.Check size={small?9:11}/> Verified
    </span>
  );
}

/* ─── Apply Modal ───────────────────────────────────────────────────────────── */
function ApplyModal({ job, onClose }) {
  const [step, setStep]     = useState(1);
  const [sending, setSend]  = useState(false);
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [cover, setCover]   = useState('');

  const OVERLAY = { position:'fixed', inset:0, background:'rgba(11,17,32,0.88)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:16 };

  const submit = async () => {
    if (!name || !email) return;
    setSend(true);
    await new Promise(r => setTimeout(r, 1400));
    setSend(false); setStep(2);
  };

  const inp = { width:'100%', padding:'9px 13px', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.05)', color:'#e2e8f0', fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'.83rem', outline:'none' };

  return (
    <div style={OVERLAY} onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="dark-card" style={{ width:'100%', maxWidth:480, overflow:'hidden', animation:'fadeUp .2s cubic-bezier(.22,1,.36,1) both' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <CompanyLogo company={job.company} size={36}/>
            <div>
              <p style={{ fontWeight:700, fontSize:'.9rem', color:'#e2e8f0' }}>{job.title}</p>
              <p style={{ fontSize:'.71rem', color:'#4b6080' }}>{job.company} · {job.location}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b' }}>
            <Ic.X/>
          </button>
        </div>

        {step === 2 ? (
          <div style={{ padding:'40px 24px', textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(35,197,94,0.12)', border:'1px solid rgba(35,197,94,0.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style={{ fontWeight:800, fontSize:'1rem', color:'#e2e8f0', marginBottom:6 }}>Application Sent!</p>
            <p style={{ fontSize:'.82rem', color:'#64748b', lineHeight:1.65, marginBottom:20 }}>
              Your application for <strong style={{ color:'#e2e8f0' }}>{job.title}</strong> at {job.company} has been submitted. You'll hear back within 5–7 business days.
            </p>
            <button onClick={onClose} className="accent-btn" style={{ padding:'9px 28px', borderRadius:12, fontSize:'.84rem' }}>Done</button>
          </div>
        ) : (
          <div style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ padding:12, borderRadius:11, background:'rgba(35,197,94,0.07)', border:'1px solid rgba(35,197,94,0.2)' }}>
              <p style={{ fontSize:'.77rem', color:'#4ade80', lineHeight:1.6 }}>💼 <strong>Apply directly</strong> — your application goes straight to the employer. No redirects.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>
                <label style={{ fontSize:'.71rem', color:'#64748b', display:'block', marginBottom:5 }}>Full Name *</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="John Doe" style={inp}/>
              </div>
              <div>
                <label style={{ fontSize:'.71rem', color:'#64748b', display:'block', marginBottom:5 }}>Email *</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" style={inp}/>
              </div>
            </div>
            <div>
              <label style={{ fontSize:'.71rem', color:'#64748b', display:'block', marginBottom:5 }}>Cover Note (optional)</label>
              <textarea value={cover} onChange={e=>setCover(e.target.value)} placeholder={`Tell ${job.company} why you're a great fit...`} style={{ ...inp, minHeight:90, resize:'none', lineHeight:1.6 }}/>
            </div>
            <div>
              <label style={{ fontSize:'.71rem', color:'#64748b', display:'block', marginBottom:5 }}>Resume / CV</label>
              <label style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 13px', borderRadius:10, border:'1px dashed rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.03)', cursor:'pointer' }}>
                <input type="file" accept=".pdf,.doc,.docx" style={{ display:'none' }}/>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span style={{ fontSize:'.78rem', color:'#64748b' }}>Upload PDF, DOC, DOCX</span>
              </label>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <button onClick={onClose} style={{ flex:1, padding:'9px', borderRadius:11, fontWeight:600, fontSize:'.82rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
              <button onClick={submit} disabled={sending || !name || !email} className="accent-btn" style={{ flex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'9px', borderRadius:11, fontSize:'.84rem' }}>
                {sending ? <><span className="spin-anim" style={{ width:13, height:13, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block' }}/> Submitting…</> : <><Ic.Send/> Submit Application</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Job Detail Modal ──────────────────────────────────────────────────────── */
function JobDetailModal({ job, onClose, onApply }) {
  const OVERLAY = { position:'fixed', inset:0, background:'rgba(11,17,32,0.88)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:16 };
  return (
    <div style={OVERLAY} onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="dark-card" style={{ width:'100%', maxWidth:540, maxHeight:'88vh', display:'flex', flexDirection:'column', overflow:'hidden', animation:'fadeUp .22s cubic-bezier(.22,1,.36,1) both' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <CompanyLogo company={job.company} size={44}/>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <p style={{ fontWeight:800, fontSize:'.92rem', color:'#e2e8f0' }}>{job.title}</p>
                {job.verified && <VerifiedBadge small/>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:2, fontSize:'.72rem', color:'#64748b' }}>
                <span>{job.company}</span>
                <span style={{ display:'flex', alignItems:'center', gap:3 }}><Ic.Globe/>{job.country}</span>
                <span style={{ display:'flex', alignItems:'center', gap:3 }}><Ic.MapPin/>{job.location}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b' }}>
            <Ic.X/>
          </button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <p style={{ fontSize:'1.1rem', fontWeight:800, color:'#23c55e' }}>{job.salary}</p>
            <div style={{ display:'flex', gap:6 }}>
              <span className="tag">{job.type}</span>
              <span className="tag">{job.level}</span>
              {job.remote && <span style={{ padding:'3px 10px', borderRadius:20, fontSize:'.69rem', fontWeight:700, background:'rgba(59,130,246,0.1)', color:'#3b82f6', border:'1px solid rgba(59,130,246,0.25)' }}>Remote OK</span>}
            </div>
          </div>
          <div style={{ padding:14, borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', marginBottom:16 }}>
            <p style={{ fontSize:'.82rem', color:'#94a3b8', lineHeight:1.75 }}>{job.desc}</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Category',  value:job.category },
              { label:'Posted',    value:job.posted },
              { label:'Country',   value:job.country },
              { label:'Location',  value:job.location },
            ].map((r,i) => (
              <div key={i} style={{ padding:'10px 13px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontSize:'.67rem', color:'#4b6080', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:3 }}>{r.label}</p>
                <p style={{ fontSize:'.8rem', color:'#e2e8f0', fontWeight:600 }}>{r.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:10, flexShrink:0 }}>
          <button onClick={onClose} style={{ flex:1, padding:'9px', borderRadius:11, fontWeight:600, fontSize:'.82rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', cursor:'pointer', fontFamily:'inherit' }}>Close</button>
          <button onClick={() => { onClose(); onApply(job); }} className="accent-btn" style={{ flex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'9px', borderRadius:11, fontSize:'.84rem' }}>
            <Ic.Apply/> Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Job Row ────────────────────────────────────────────────────────────────── */
function JobRow({ job, onView, delay }) {
  return (
    <div className="job-row fade-up" style={{ animationDelay:`${delay}ms`, display:'flex', alignItems:'center', gap:16 }} onClick={() => onView(job)}>
      <CompanyLogo company={job.company}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
          <span style={{ fontWeight:700, fontSize:'.9rem', color:'#111827' }}>{job.title}</span>
          {job.verified && <VerifiedBadge/>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:7, fontSize:'.75rem', color:'#6b7280', flexWrap:'wrap' }}>
          <span style={{ fontWeight:600 }}>{job.company}</span>
          <span style={{ display:'flex', alignItems:'center', gap:3 }}><Ic.Globe/>{job.country}</span>
          <span style={{ display:'flex', alignItems:'center', gap:3 }}><Ic.MapPin/>{job.location}</span>
          {job.remote && <span style={{ color:'#3b82f6', fontWeight:700 }}>· Remote OK</span>}
        </div>
        <div style={{ display:'flex', gap:6 }}>
          <span className="tag">{job.type}</span>
          <span className="tag">{job.level}</span>
          <span className="tag">{job.category}</span>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, flexShrink:0 }}>
        <span style={{ fontSize:'.8rem', fontWeight:800, color:'#23c55e', whiteSpace:'nowrap' }}>{job.salary}</span>
        <span style={{ fontSize:'.68rem', color:'#9ca3af' }}>{job.posted}</span>
      </div>
    </div>
  );
}

/* ─── Sidebar Job Card ───────────────────────────────────────────────────────── */
function SidebarJob({ job, onApply }) {
  return (
    <div className="sidebar-job" style={{ display:'flex', gap:10 }}>
      <CompanyLogo company={job.company} size={40}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:6 }}>
          <p className="sj-title" onClick={() => onApply(job)}>{job.title}</p>
          {job.verified && <VerifiedBadge small/>}
        </div>
        <p style={{ fontSize:'.7rem', color:'#4b6080', marginTop:1 }}>{job.company}</p>
        <div style={{ display:'flex', gap:6, marginTop:4, fontSize:'.67rem', color:'#4b6080' }}>
          <span style={{ display:'flex', alignItems:'center', gap:2 }}><Ic.Globe/>{job.country}</span>
          <span style={{ display:'flex', alignItems:'center', gap:2 }}><Ic.MapPin/>{job.location}</span>
        </div>
        <p style={{ fontSize:'.76rem', fontWeight:700, color:'#23c55e', marginTop:5 }}>{job.salary}</p>
      </div>
    </div>
  );
}

/* ─── Filter Bar ─────────────────────────────────────────────────────────────── */
function FilterBar({ filters, setFilters, total }) {
  const wrap = { position:'relative' };
  return (
    <div className="white-card" style={{ padding:'14px 18px', marginBottom:14 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr 1fr auto', gap:10, alignItems:'center' }}>
        {/* Keyword */}
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}><Ic.Search/></div>
          <input
            value={filters.keyword}
            onChange={e => setFilters(f => ({...f, keyword:e.target.value, page:1}))}
            placeholder="e.g. Developer"
            style={{ width:'100%', padding:'8px 12px 8px 34px', borderRadius:10, border:'1px solid #e2e8f0', fontSize:'.8rem', color:'#374151', outline:'none', fontFamily:'Plus Jakarta Sans,sans-serif', transition:'border-color .15s' }}
            onFocus={e => e.target.style.borderColor='#23c55e'}
            onBlur={e => e.target.style.borderColor='#e2e8f0'}
          />
        </div>
        {/* Country */}
        <div style={wrap}>
          <select className="filter-select" style={{ width:'100%', paddingRight:28 }} value={filters.country} onChange={e => setFilters(f => ({...f, country:e.target.value, page:1}))}>
            <option value="">All Countries</option>
            {['Canada','USA','UK','Germany','Australia'].map(c => <option key={c}>{c}</option>)}
          </select>
          <div style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}><Ic.ChevDown/></div>
        </div>
        {/* Category */}
        <div style={wrap}>
          <select className="filter-select" style={{ width:'100%', paddingRight:28 }} value={filters.category} onChange={e => setFilters(f => ({...f, category:e.target.value, page:1}))}>
            <option value="">All Categories</option>
            {['Technology','Business','Finance','Engineering','Marketing','Healthcare','Design','Operations'].map(c => <option key={c}>{c}</option>)}
          </select>
          <div style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}><Ic.ChevDown/></div>
        </div>
        {/* Level */}
        <div style={wrap}>
          <select className="filter-select" style={{ width:'100%', paddingRight:28 }} value={filters.level} onChange={e => setFilters(f => ({...f, level:e.target.value, page:1}))}>
            <option value="">All Levels</option>
            {['Entry Level','Mid Level','Senior Level'].map(c => <option key={c}>{c}</option>)}
          </select>
          <div style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}><Ic.ChevDown/></div>
        </div>
        {/* Type */}
        <div style={wrap}>
          <select className="filter-select" style={{ width:'100%', paddingRight:28 }} value={filters.type} onChange={e => setFilters(f => ({...f, type:e.target.value, page:1}))}>
            <option value="">All Types</option>
            {['Full-time','Part-time','Contract','Remote'].map(c => <option key={c}>{c}</option>)}
          </select>
          <div style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}><Ic.ChevDown/></div>
        </div>
        {/* Filters badge */}
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 13px', borderRadius:10, border:'1px solid #e2e8f0', background:'#f9fafb', cursor:'default', whiteSpace:'nowrap', fontSize:'.78rem', color:'#374151', fontWeight:600 }}>
          <Ic.Filter/>
          Filters
          {Object.values(filters).filter(Boolean).length > 1 && (
            <span style={{ width:16, height:16, borderRadius:'50%', background:'#23c55e', color:'#fff', fontSize:'.6rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {Object.entries(filters).filter(([k,v]) => k!=='page' && k!=='sort' && v).length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Pagination ─────────────────────────────────────────────────────────────── */
function Pagination({ page, total, perPage, onPage }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('…');
    for (let i = Math.max(2, page-1); i <= Math.min(totalPages-1, page+1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, paddingTop:20 }}>
      <button className="pg-btn" disabled={page===1} onClick={() => onPage(page-1)}><Ic.ChevL/></button>
      {pages.map((p,i) => p==='…'
        ? <span key={i} style={{ width:34, textAlign:'center', color:'#9ca3af', fontSize:'.78rem' }}>…</span>
        : <button key={p} className={`pg-btn${page===p?' active':''}`} onClick={() => onPage(p)}>{p}</button>
      )}
      <button className="pg-btn" disabled={page===totalPages} onClick={() => onPage(page+1)}><Ic.ChevR/></button>
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [filters, setFilters] = useState({ keyword:'', country:'', category:'', level:'', type:'', sort:'newest', page:1 });
  const [detailJob, setDetail]= useState(null);
  const [applyJob, setApply]  = useState(null);
  const [showAllFeatured, setShowAllFeatured] = useState(false);


  const filtered = useMemo(() => {
    let list = [...JOBS];
    if (filters.keyword) list = list.filter(j => j.title.toLowerCase().includes(filters.keyword.toLowerCase()) || j.company.toLowerCase().includes(filters.keyword.toLowerCase()) || j.category.toLowerCase().includes(filters.keyword.toLowerCase()));
    if (filters.country)  list = list.filter(j => j.country === filters.country);
    if (filters.category) list = list.filter(j => j.category === filters.category);
    if (filters.level)    list = list.filter(j => j.level === filters.level);
    if (filters.type)     list = list.filter(j => j.type === filters.type || (filters.type === 'Remote' && j.remote));

    if (filters.sort === 'newest') {
      const toHours = s => { const m = s.match(/(\d+)([hd])/); if (!m) return 999; return parseInt(m[1]) * (m[2]==='d' ? 24 : 1); };
      list.sort((a, b) => toHours(a.posted) - toHours(b.posted));
    } else if (filters.sort === 'salary') {
      const minVal = s => { const nums = s.match(/[\d,]+/g); return nums ? parseInt(nums[0].replace(/,/g,'')) : 0; };
      list.sort((a, b) => minVal(b.salary) - minVal(a.salary));
    } else if (filters.sort === 'company') {
      list.sort((a, b) => a.company.localeCompare(b.company));
    }

    return list;
  }, [filters]);

  const pageJobs = filtered.slice((filters.page-1)*PER_PAGE, filters.page*PER_PAGE);

  const activeFilters = Object.entries(filters).filter(([k,v]) => !['page','sort'].includes(k) && v);

  return (
    <>
      <AnimatedBackground/>
      <div className="app-root" style={{ minHeight:'100vh' }}>
        <div style={{ maxWidth:1160, margin:'0 auto', padding:'28px 16px 60px' }}>

          {/* ── Header ── */}
          <div className="fade-up" style={{ marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
              <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'#e2e8f0', letterSpacing:'-.03em' }}>Integrated Job Board</h1>
              <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:20, background:'rgba(35,197,94,0.12)', border:'1px solid rgba(35,197,94,0.3)', fontSize:'.72rem', color:'#23c55e', fontWeight:700 }}>
                <Ic.Shield/> Verified Jobs Only
              </span>
            </div>
            <p style={{ fontSize:'.88rem', color:'#64748b' }}>Find and apply to international job opportunities — all in one place.</p>
          </div>

          {/* ── Layout ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 310px', gap:18, alignItems:'start' }}>

            {/* ── LEFT ── */}
            <div style={{ minWidth:0 }}>
              <FilterBar filters={filters} setFilters={setFilters} total={filtered.length}/>

              {/* Active filter chips */}
              {activeFilters.length > 0 && (
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                  {activeFilters.map(([k,v]) => (
                    <button key={k} onClick={() => setFilters(f => ({...f, [k]:'', page:1}))}
                      style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, background:'rgba(35,197,94,0.1)', border:'1px solid rgba(35,197,94,0.28)', color:'#23c55e', fontSize:'.69rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                      {v} <Ic.X/>
                    </button>
                  ))}
                </div>
              )}

              {/* Count + Sort */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, padding:'0 2px' }}>
                <span style={{ fontSize:'.8rem', color:'#64748b' }}>
                  <strong style={{ color:'#e2e8f0' }}>{filtered.length.toLocaleString()}</strong> jobs found
                </span>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:'.78rem', color:'#64748b' }}>Sort by:</span>
                  <div style={{ position:'relative' }}>
                    <select className="filter-select" value={filters.sort} onChange={e => setFilters(f => ({...f, sort:e.target.value}))} style={{ paddingRight:24, fontSize:'.78rem' }}>
                      <option value="newest">Newest First</option>
                      <option value="salary">Highest Salary</option>
                      <option value="company">Company A–Z</option>
                    </select>
                    <div style={{ position:'absolute', right:7, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}><Ic.ChevDown/></div>
                  </div>
                </div>
              </div>

              {/* Job list */}
              <div className="white-card" style={{ overflow:'hidden' }}>
                {pageJobs.length > 0
                  ? pageJobs.map((job, i) => (
                      <JobRow key={job.id} job={job}
                        onView={j => setDetail(j)} delay={i * 55}/>
                    ))
                  : (
                    <div style={{ padding:'48px 20px', textAlign:'center' }}>
                      <p style={{ fontSize:'1rem', color:'#9ca3af', marginBottom:8 }}>No jobs match your filters.</p>
                      <button onClick={() => setFilters({ keyword:'', country:'', category:'', level:'', type:'', sort:'newest', page:1 })}
                        className="accent-btn" style={{ padding:'8px 20px', borderRadius:10, fontSize:'.82rem' }}>Clear Filters</button>
                    </div>
                  )
                }
              </div>

              <Pagination page={filters.page} total={filtered.length} perPage={PER_PAGE} onPage={p => setFilters(f => ({...f, page:p}))}/>

              {/* Trust bar */}
              <div className="dark-card fade-up" style={{ marginTop:18, padding:'16px 24px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                  {[
                    { icon:<Ic.Shield/>,    title:'100% Verified Jobs',   desc:'All job listings are verified by our team.' },
                    { icon:<Ic.Apply/>,     title:'Apply Directly',       desc:'Apply to jobs directly inside the app.' },
                    { icon:<Ic.GlobeG/>,   title:'Global Opportunities',  desc:'Explore jobs from top companies worldwide.' },
                    { icon:<Ic.Lock/>,     title:'Secure & Private',      desc:'Your information is safe and secure with us.' },
                  ].map((item, i) => (
                    <div key={i} style={{ display:'flex', gap:10 }}>
                      <div style={{ flexShrink:0, marginTop:2 }}>{item.icon}</div>
                      <div>
                        <p style={{ fontWeight:700, fontSize:'.78rem', color:'#e2e8f0', marginBottom:3 }}>{item.title}</p>
                        <p style={{ fontSize:'.71rem', color:'#4b6080', lineHeight:1.55 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT sidebar ── */}
            <div style={{ position:'sticky', top:20, display:'flex', flexDirection:'column', gap:14 }}>

              {/* Featured Jobs */}
              <div className="dark-card" style={{ padding:16 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <h3 style={{ fontWeight:700, fontSize:'.88rem', color:'#e2e8f0', letterSpacing:'-.01em' }}>Featured Jobs</h3>
                  <button
                    onClick={() => {
                      setShowAllFeatured(v => !v);
                    }}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'#23c55e', fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'.74rem', fontWeight:600, display:'flex', alignItems:'center', gap:3 }}>
                    {showAllFeatured ? 'Show less' : 'View all'}
                  </button>
                </div>
                {(showAllFeatured ? JOBS.filter(j => FEATURED.some(f => f.company === j.company && f.title === j.title)) : FEATURED)
                  .map(job => <SidebarJob key={job.id} job={job} onApply={j => setApply(j)}/>)}
                {showAllFeatured && (
                  <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize:'.7rem', color:'#4b6080', textAlign:'center' }}>Showing all {FEATURED.length} featured jobs</p>
                  </div>
                )}
              </div>

              {/* Recommended */}
              <div className="dark-card" style={{ padding:16 }}>
                <h3 style={{ fontWeight:700, fontSize:'.88rem', color:'#e2e8f0', letterSpacing:'-.01em', marginBottom:14 }}>Recommended for You</h3>
                {RECOMMENDED.map(job => <SidebarJob key={job.id} job={job} onApply={j => setApply(j)}/>)}
              </div>



            </div>
          </div>
        </div>
      </div>

      {detailJob && <JobDetailModal job={detailJob} onClose={() => setDetail(null)} onApply={j => setApply(j)}/>}
      {applyJob  && <ApplyModal    job={applyJob}   onClose={() => setApply(null)}/>}
    </>
  );
}
