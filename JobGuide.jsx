import { useState, useEffect, useRef } from 'react';

/* ── Global Styles ─────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:            #0b1120;
    --accent:        #23c55e;
    --accent-dim:    rgba(35,197,94,0.12);
    --accent-border: rgba(35,197,94,0.25);
    --glass:         rgba(15,23,42,0.72);
    --glass-border:  rgba(255,255,255,0.09);
    --text-on-dark:  #e2e8f0;
    --text-muted:    #64748b;
    --text-faint:    #4b6080;
    --divider-dark:  rgba(255,255,255,0.07);
    --divider-light: rgba(0,0,0,0.07);
  }

  body { font-family:'Sora',sans-serif; background:var(--bg); min-height:100vh; overflow-x:hidden; }

  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:rgba(35,197,94,0.25); border-radius:4px; }

  .dark-card {
    background: var(--glass);
    backdrop-filter: blur(18px) saturate(1.4);
    -webkit-backdrop-filter: blur(18px) saturate(1.4);
    border-radius: 18px;
    border: 1px solid var(--glass-border);
    box-shadow: 0 4px 32px rgba(0,0,0,0.45);
  }

  .white-card {
    background: #ffffff;
    border-radius: 14px;
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }

  #bg-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; }
  .app-root  { position:relative; z-index:1; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse-dot{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

  .fade-up  { animation:fadeUp .35s cubic-bezier(.22,1,.36,1) both; }
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

  .platform-card {
    background:#fff; border-radius:14px; border:1px solid rgba(0,0,0,0.08);
    box-shadow:0 2px 10px rgba(0,0,0,0.07); padding:18px 14px;
    cursor:pointer; transition:box-shadow .2s, transform .2s;
    display:flex; flex-direction:column; gap:8px;
  }
  .platform-card:hover { box-shadow:0 6px 24px rgba(35,197,94,0.18); transform:translateY(-3px); }

  .salary-card {
    background:#fff; border-radius:14px; border:1px solid rgba(0,0,0,0.07);
    box-shadow:0 2px 10px rgba(0,0,0,0.07); padding:16px 14px;
    display:flex; flex-direction:column; align-items:center; gap:8px; text-align:center;
    transition:box-shadow .2s, transform .2s; cursor:default;
  }
  .salary-card:hover { box-shadow:0 6px 20px rgba(35,197,94,0.15); transform:translateY(-2px); }

  .country-chip {
    padding:6px 14px; border-radius:30px; font-size:.78rem; font-weight:700; cursor:pointer;
    font-family:inherit; transition:all .18s; border:1px solid rgba(255,255,255,0.1);
    background:transparent; color:#64748b;
  }
  .country-chip.active {
    background:rgba(35,197,94,0.15); border-color:rgba(35,197,94,0.5); color:#23c55e;
  }
  .country-chip:hover:not(.active) { border-color:rgba(35,197,94,0.3); color:#94a3b8; }

  input, textarea, select { font-family:'Sora',sans-serif; }

  .tag-pill {
    display:inline-flex; align-items:center; gap:4px; padding:2px 10px;
    background:rgba(35,197,94,0.09); color:#23c55e; font-size:.7rem;
    border-radius:20px; border:1px solid rgba(35,197,94,0.2); font-weight:700;
  }

  .hero-img-wrap { position:relative; overflow:hidden; border-radius:18px; }
  .hero-img-wrap img { width:100%; height:220px; object-fit:cover; display:block; }
  .hero-img-wrap::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(to right, rgba(11,17,32,.92) 38%, rgba(11,17,32,.4) 70%, transparent);
  }
`;

function injectStyles() {
  if (document.getElementById('jg-styles')) return;
  const s = document.createElement('style');
  s.id = 'jg-styles'; s.textContent = STYLES;
  document.head.appendChild(s);
}
injectStyles();

/* ── Animated Background (same as feed) ────────────────────────────────────── */
function AnimatedBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, animId, dots = [];
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      dots = [];
      const n = Math.floor((W * H) / 16000);
      for (let i = 0; i < n; i++)
        dots.push({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.2, vy:(Math.random()-.5)*.2, r:Math.random()*1.2+.4, a:Math.random()*.35+.08 });
    };
    const G = 80;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      ctx.strokeStyle='rgba(35,197,94,0.035)'; ctx.lineWidth=1;
      for(let x=0;x<W;x+=G){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=G){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      ctx.fillStyle='rgba(35,197,94,0.07)';
      for(let x=G;x<W;x+=G) for(let y=G;y<H;y+=G){ctx.beginPath();ctx.arc(x,y,1.2,0,Math.PI*2);ctx.fill();}
      dots.forEach(d=>{
        d.x+=d.vx; d.y+=d.vy;
        if(d.x<0)d.x=W; if(d.x>W)d.x=0; if(d.y<0)d.y=H; if(d.y>H)d.y=0;
        ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(35,197,94,${d.a})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas id="bg-canvas" ref={ref}/>;
}

/* ── Icons ─────────────────────────────────────────────────────────────────── */
const Ic = {
  Briefcase: ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  Globe:     ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  DollarSign:()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Clock:     ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Check:     ({color='#23c55e'})=><svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowR:    ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ChevL:     ()=><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  Star:      ()=><svg width="13" height="13" fill="#f59e0b" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  MapPin:    ()=><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Shield:    ()=><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  TrendUp:   ()=><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Award:     ()=><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Bulb:      ()=><svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="1.8"><line x1="9" y1="21" x2="15" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M12 2a7 7 0 0 1 7 7c0 2.74-1.57 5.12-3.87 6.36L15 17H9l-.13-1.64A7 7 0 0 1 12 2z"/></svg>,
  Code:      ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  BarChart:  ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Megaphone: ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><path d="M18 8a6 6 0 0 1 0 8M14 9.3V3l-8 5.3H3a1 1 0 0 0-1 1v5.4a1 1 0 0 0 1 1h3l8 5.3V15M6 14.5V9.5"/></svg>,
  Person:    ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Wrench:    ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Hospital:  ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  Plane:     ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#23c55e" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 1 16.5 2.5L13 6 4.8 4.2 3.4 5.6l8 5.1L6 17.5l-1.3.5.5-1.3 5.5-4.8-2.9 2.9L9 14.5l4-4 5.1 8 1.4-1.4z"/></svg>,
  ExternalLink: ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

/* ── Country Data ───────────────────────────────────────────────────────────── */
const COUNTRIES = {
  Canada: {
    name: 'Canada', flag: '🇨🇦',
    tagline: 'Everything you need to know to find and apply for jobs in Canada.',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&h=500&fit=crop',
    currency: 'CAD (Canadian Dollar)', language: 'English / French', workWeek: '40 hours',
    visa: 'Usually required', visaDetail: '(Employer sponsorship / Work Permit)',
    accentColor: '#FF0000', secondaryColor: '#D40000',
    platforms: [
      { name:'LinkedIn',     icon:'in',  color:'#0A66C2', bg:'#E8F0FB', desc:'Most popular platform for professionals.',     url:'https://linkedin.com',    rating:4.8 },
      { name:'Indeed',       icon:'ii',  color:'#003A9B', bg:'#E8EDFB', desc:'Great for all types of job opportunities.',    url:'https://ca.indeed.com',   rating:4.6 },
      { name:'Glassdoor',    icon:'gd',  color:'#0CAA41', bg:'#E6F7EC', desc:'Company reviews & salary insights.',           url:'https://glassdoor.ca',    rating:4.5 },
      { name:'Job Bank CA',  icon:'jb',  color:'#D40000', bg:'#FDEAEA', desc:'Official government job board.',               url:'https://jobbank.gc.ca',   rating:4.7 },
    ],
    salaries: [
      { role:'Software Developer',  icon:<Ic.Code/>,      range:'$70K – $120K', color:'#0A66C2', bg:'#EBF5FF' },
      { role:'Data Analyst',        icon:<Ic.BarChart/>,  range:'$55K – $85K',  color:'#7C3AED', bg:'#F3EEFF' },
      { role:'Marketing Specialist',icon:<Ic.Megaphone/>, range:'$50K – $80K',  color:'#D97706', bg:'#FFFBEB' },
      { role:'Project Manager',     icon:<Ic.Person/>,    range:'$70K – $110K', color:'#059669', bg:'#ECFDF5' },
      { role:'Nurse / Healthcare',  icon:<Ic.Hospital/>,  range:'$65K – $105K', color:'#DC2626', bg:'#FEF2F2' },
      { role:'Mechanical Engineer', icon:<Ic.Wrench/>,    range:'$65K – $100K', color:'#2563EB', bg:'#EFF6FF' },
    ],
    tips: [
      'Customize your resume for Canadian standards (no photo, no DOB)',
      'Highlight your skills and relevant certifications',
      'Use LinkedIn to connect with professionals and recruiters',
      'Apply for jobs and follow up professionally after 1 week',
      'Get a Canadian phone number and local address before applying',
    ],
    facts: [
      { icon:<Ic.Shield/>,  text:'High quality of life & universal healthcare' },
      { icon:<Ic.Award/>,   text:'Diverse and inclusive culture' },
      { icon:<Ic.TrendUp/>, text:'Strong job market and worker rights' },
      { icon:<Ic.MapPin/>,  text:'Pathway to Permanent Residency (Express Entry)' },
    ],
    goodToKnow: 'Canada values skilled professionals. Keep your LinkedIn up-to-date and be consistent in your job search. Networking is key.',
    topSectors: ['Technology', 'Healthcare', 'Finance', 'Engineering', 'Education'],
  },
  USA: {
    name: 'United States', flag: '🇺🇸',
    tagline: 'Your complete guide to landing a job in the world\'s largest job market.',
    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200&h=500&fit=crop',
    currency: 'USD (US Dollar)', language: 'English', workWeek: '40–45 hours',
    visa: 'Required', visaDetail: '(H-1B / OPT / Green Card)',
    platforms: [
      { name:'LinkedIn',   icon:'in', color:'#0A66C2', bg:'#E8F0FB', desc:'The gold standard for US professional networking.', url:'https://linkedin.com',   rating:4.9 },
      { name:'Indeed',     icon:'ii', color:'#003A9B', bg:'#E8EDFB', desc:'Largest job aggregator in the US.',                 url:'https://indeed.com',     rating:4.7 },
      { name:'Glassdoor',  icon:'gd', color:'#0CAA41', bg:'#E6F7EC', desc:'Best for salary research and company culture.',     url:'https://glassdoor.com',  rating:4.5 },
      { name:'ZipRecruiter',icon:'zr',color:'#5B21B6', bg:'#EDE9FE', desc:'AI-powered matching for job seekers.',              url:'https://ziprecruiter.com',rating:4.4 },
    ],
    salaries: [
      { role:'Software Engineer',   icon:<Ic.Code/>,      range:'$90K – $180K', color:'#0A66C2', bg:'#EBF5FF' },
      { role:'Data Scientist',      icon:<Ic.BarChart/>,  range:'$85K – $155K', color:'#7C3AED', bg:'#F3EEFF' },
      { role:'Marketing Manager',   icon:<Ic.Megaphone/>, range:'$60K – $120K', color:'#D97706', bg:'#FFFBEB' },
      { role:'Product Manager',     icon:<Ic.Person/>,    range:'$100K – $175K',color:'#059669', bg:'#ECFDF5' },
      { role:'Registered Nurse',    icon:<Ic.Hospital/>,  range:'$70K – $120K', color:'#DC2626', bg:'#FEF2F2' },
      { role:'Civil Engineer',      icon:<Ic.Wrench/>,    range:'$65K – $110K', color:'#2563EB', bg:'#EFF6FF' },
    ],
    tips: [
      'Tailor your resume to each job — ATS systems filter heavily',
      'Build a strong LinkedIn profile with recommendations',
      'Understand H-1B cap and OPT deadlines if on a student visa',
      'Network aggressively — 70% of US jobs are filled via referrals',
      'Negotiate salary — initial offers are usually not final',
    ],
    facts: [
      { icon:<Ic.TrendUp/>, text:'World\'s largest economy and job market' },
      { icon:<Ic.Award/>,   text:'High salaries in tech, finance and healthcare' },
      { icon:<Ic.Shield/>,  text:'Strong IP and employment law protections' },
      { icon:<Ic.MapPin/>,  text:'Green Card pathways via EB-1, EB-2, EB-3 visas' },
    ],
    goodToKnow: 'The US job market is highly competitive. Your network is your net worth — reach out, attend events, and build genuine connections.',
    topSectors: ['Technology', 'Finance', 'Healthcare', 'Media', 'Consulting'],
  },
  UK: {
    name: 'United Kingdom', flag: '🇬🇧',
    tagline: 'Navigate the UK job market with confidence from day one.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=500&fit=crop',
    currency: 'GBP (British Pound)', language: 'English', workWeek: '37–40 hours',
    visa: 'Skilled Worker Visa', visaDetail: '(Sponsor licence required)',
    platforms: [
      { name:'LinkedIn',  icon:'in', color:'#0A66C2', bg:'#E8F0FB', desc:'Top platform for professional roles.',         url:'https://linkedin.com',  rating:4.8 },
      { name:'Reed',      icon:'rd', color:'#C0392B', bg:'#FDEAEA', desc:'UK\'s largest job board with 250K+ listings.', url:'https://reed.co.uk',    rating:4.6 },
      { name:'Totaljobs', icon:'tj', color:'#E94E2F', bg:'#FEF0EC', desc:'Great for mid-level and senior roles.',        url:'https://totaljobs.com', rating:4.4 },
      { name:'CV-Library', icon:'cv',color:'#004B85', bg:'#E6EFF8', desc:'Strong database of UK employer contacts.',     url:'https://cv-library.co.uk',rating:4.3 },
    ],
    salaries: [
      { role:'Software Developer',  icon:<Ic.Code/>,      range:'£45K – £90K',  color:'#0A66C2', bg:'#EBF5FF' },
      { role:'Data Analyst',        icon:<Ic.BarChart/>,  range:'£35K – £65K',  color:'#7C3AED', bg:'#F3EEFF' },
      { role:'Marketing Manager',   icon:<Ic.Megaphone/>, range:'£35K – £70K',  color:'#D97706', bg:'#FFFBEB' },
      { role:'Project Manager',     icon:<Ic.Person/>,    range:'£45K – £85K',  color:'#059669', bg:'#ECFDF5' },
      { role:'NHS Nurse',           icon:<Ic.Hospital/>,  range:'£27K – £45K',  color:'#DC2626', bg:'#FEF2F2' },
      { role:'Mechanical Engineer', icon:<Ic.Wrench/>,    range:'£35K – £65K',  color:'#2563EB', bg:'#EFF6FF' },
    ],
    tips: [
      'Register with recruitment agencies — very common in the UK',
      'Understand the UK CV format: 2 pages max, no photo',
      'Check if your employer is a Skilled Worker Visa sponsor',
      'Network at industry events and via LinkedIn UK groups',
      'Research UK National Living Wage minimums before accepting offers',
    ],
    facts: [
      { icon:<Ic.Shield/>,  text:'Strong worker rights and NHS healthcare access' },
      { icon:<Ic.Award/>,   text:'Global finance hub — London leads the world' },
      { icon:<Ic.TrendUp/>, text:'Growing tech sector, especially in Manchester & Edinburgh' },
      { icon:<Ic.MapPin/>,  text:'Graduate and Skilled Worker Visa pathways to ILR' },
    ],
    goodToKnow: 'UK employers value cultural fit as much as skills. Research the company culture and mention it in your cover letter.',
    topSectors: ['Finance', 'Technology', 'Healthcare', 'Creative', 'Legal'],
  },
  Germany: {
    name: 'Germany', flag: '🇩🇪',
    tagline: 'Europe\'s largest economy is actively seeking skilled international workers.',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&h=500&fit=crop',
    currency: 'EUR (Euro)', language: 'German / English', workWeek: '38–40 hours',
    visa: 'Job Seeker Visa', visaDetail: '(EU Blue Card / Chancenkarte)',
    platforms: [
      { name:'LinkedIn',     icon:'in', color:'#0A66C2', bg:'#E8F0FB', desc:'Growing fast in Germany for professional roles.',  url:'https://linkedin.com',    rating:4.7 },
      { name:'XING',         icon:'xg', color:'#026466', bg:'#E5F2F2', desc:'Germany\'s leading professional network.',          url:'https://xing.com',        rating:4.5 },
      { name:'StepStone',    icon:'ss', color:'#E8001D', bg:'#FDEAEA', desc:'Top German job portal with 60K+ listings.',         url:'https://stepstone.de',    rating:4.6 },
      { name:'Make it in DE', icon:'md',color:'#000000', bg:'#F2F2F2', desc:'Official government portal for skilled workers.',   url:'https://make-it-in-germany.com',rating:4.8 },
    ],
    salaries: [
      { role:'Software Engineer',  icon:<Ic.Code/>,      range:'€55K – €100K', color:'#0A66C2', bg:'#EBF5FF' },
      { role:'Data Engineer',      icon:<Ic.BarChart/>,  range:'€50K – €85K',  color:'#7C3AED', bg:'#F3EEFF' },
      { role:'Marketing Manager',  icon:<Ic.Megaphone/>, range:'€45K – €75K',  color:'#D97706', bg:'#FFFBEB' },
      { role:'Project Manager',    icon:<Ic.Person/>,    range:'€55K – €90K',  color:'#059669', bg:'#ECFDF5' },
      { role:'Medical Doctor',     icon:<Ic.Hospital/>,  range:'€60K – €100K', color:'#DC2626', bg:'#FEF2F2' },
      { role:'Mechanical Engineer',icon:<Ic.Wrench/>,    range:'€55K – €90K',  color:'#2563EB', bg:'#EFF6FF' },
    ],
    tips: [
      'Learn at least basic German — it significantly increases your hire rate',
      'Have your qualifications officially recognized (Anerkennung)',
      'Apply via the Chancenkarte if you don\'t have a job offer yet',
      'German work culture values punctuality and thoroughness in applications',
      'Join the Make It in Germany official portal for employer matching',
    ],
    facts: [
      { icon:<Ic.Shield/>,  text:'Excellent worker protections and 30 days paid leave' },
      { icon:<Ic.TrendUp/>, text:'Europe\'s strongest manufacturing & engineering base' },
      { icon:<Ic.Award/>,   text:'Free or low-cost higher education, even for workers\' families' },
      { icon:<Ic.MapPin/>,  text:'EU Blue Card leads to permanent residency after 33 months' },
    ],
    goodToKnow: 'Germany has a massive skilled worker shortage (Fachkräftemangel). If you have a STEM degree, you are in high demand.',
    topSectors: ['Engineering', 'Automotive', 'Technology', 'Healthcare', 'Finance'],
  },
  Australia: {
    name: 'Australia', flag: '🇦🇺',
    tagline: 'Sun, opportunity, and one of the world\'s most liveable job markets.',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&h=500&fit=crop',
    currency: 'AUD (Australian Dollar)', language: 'English', workWeek: '38 hours',
    visa: 'Skilled Visa', visaDetail: '(482 TSS / 186 / 189 / 190)',
    platforms: [
      { name:'LinkedIn',  icon:'in', color:'#0A66C2', bg:'#E8F0FB', desc:'Most popular for white-collar roles.',              url:'https://linkedin.com',  rating:4.8 },
      { name:'Seek',      icon:'sk', color:'#1D3461', bg:'#EAF0FA', desc:'Australia\'s #1 job board, 250K+ listings.',         url:'https://seek.com.au',   rating:4.9 },
      { name:'CareerOne', icon:'co', color:'#F07900', bg:'#FEF3E6', desc:'Strong for trade, healthcare & regional roles.',     url:'https://careerone.com.au',rating:4.3 },
      { name:'Jora',      icon:'jr', color:'#6D28D9', bg:'#F0EEFF', desc:'Aggregator covering smaller Australian employers.',  url:'https://au.jora.com',   rating:4.2 },
    ],
    salaries: [
      { role:'Software Developer',  icon:<Ic.Code/>,      range:'A$80K – A$140K', color:'#0A66C2', bg:'#EBF5FF' },
      { role:'Data Analyst',        icon:<Ic.BarChart/>,  range:'A$70K – A$110K', color:'#7C3AED', bg:'#F3EEFF' },
      { role:'Marketing Manager',   icon:<Ic.Megaphone/>, range:'A$70K – A$120K', color:'#D97706', bg:'#FFFBEB' },
      { role:'Project Manager',     icon:<Ic.Person/>,    range:'A$85K – A$140K', color:'#059669', bg:'#ECFDF5' },
      { role:'Registered Nurse',    icon:<Ic.Hospital/>,  range:'A$70K – A$100K', color:'#DC2626', bg:'#FEF2F2' },
      { role:'Civil Engineer',      icon:<Ic.Wrench/>,    range:'A$75K – A$120K', color:'#2563EB', bg:'#EFF6FF' },
    ],
    tips: [
      'Register on Seek immediately — it\'s the dominant Australian job board',
      'Australian employers value a friendly, direct communication style',
      'Include a skills assessment from the relevant VETASSESS/EA body',
      'Regional migration can fast-track your permanent residency pathway',
      'Check your occupation on the Skilled Occupation List (SOL) first',
    ],
    facts: [
      { icon:<Ic.Shield/>,  text:'Medicare provides free public healthcare for eligible workers' },
      { icon:<Ic.Award/>,   text:'High minimum wage — A$23.23 per hour in 2026' },
      { icon:<Ic.TrendUp/>, text:'Booming sectors: construction, mining, healthcare & tech' },
      { icon:<Ic.MapPin/>,  text:'Multiple points-tested visa pathways to PR and citizenship' },
    ],
    goodToKnow: 'Australia values lifestyle balance. Many roles offer flexible working arrangements. Experience in regional areas counts toward extra PR points.',
    topSectors: ['Mining', 'Healthcare', 'Technology', 'Construction', 'Education'],
  },
};

const COUNTRY_LIST = Object.keys(COUNTRIES);

/* ── Platform Icon Renderer ─────────────────────────────────────────────────── */
function PlatformIcon({ icon, color, bg, name }) {
  const letters = {
    in: <><span style={{fontWeight:800,fontSize:'1.1rem',color:'#0A66C2'}}>in</span></>,
    ii: <span style={{fontWeight:800,fontSize:'1rem',color:'#003A9B'}}>i</span>,
    gd: <span style={{fontWeight:800,fontSize:'1rem',color:'#0CAA41'}}>G</span>,
    jb: <span style={{fontSize:'1.2rem'}}>🍁</span>,
    zr: <span style={{fontWeight:800,fontSize:'.85rem',color:'#5B21B6'}}>ZIP</span>,
    rd: <span style={{fontWeight:800,fontSize:'.9rem',color:'#C0392B'}}>reed</span>,
    tj: <span style={{fontWeight:800,fontSize:'.8rem',color:'#E94E2F'}}>TJ</span>,
    cv: <span style={{fontWeight:800,fontSize:'.8rem',color:'#004B85'}}>CV</span>,
    xg: <span style={{fontWeight:800,fontSize:'.9rem',color:'#026466'}}>XING</span>,
    ss: <span style={{fontWeight:800,fontSize:'.9rem',color:'#E8001D'}}>step</span>,
    md: <span style={{fontWeight:800,fontSize:'.7rem',color:'#333'}}>MAKE IT</span>,
    sk: <span style={{fontWeight:800,fontSize:'.85rem',color:'#1D3461'}}>SEEK</span>,
    co: <span style={{fontWeight:800,fontSize:'.75rem',color:'#F07900'}}>C1</span>,
    jr: <span style={{fontWeight:800,fontSize:'.85rem',color:'#6D28D9'}}>jora</span>,
  };
  return (
    <div style={{ width:52, height:52, borderRadius:13, background:bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      {letters[icon] || <span style={{fontWeight:800,color}}>{name[0]}</span>}
    </div>
  );
}

/* ── Stars ──────────────────────────────────────────────────────────────────── */
function Stars({ n }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= Math.round(n) ? '#f59e0b' : '#e5e7eb'} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize:'.68rem', color:'#6b7280', marginLeft:3, fontWeight:600 }}>{n}</span>
    </div>
  );
}

/* ── Section Heading ────────────────────────────────────────────────────────── */
function SectionHeading({ num, label, sub }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
        <span style={{ width:28, height:28, borderRadius:8, background:'rgba(35,197,94,0.15)', border:'1px solid rgba(35,197,94,0.35)', display:'flex', alignItems:'center', justifyContent:'center', color:'#23c55e', fontWeight:800, fontSize:'.8rem', flexShrink:0 }}>{num}</span>
        <h2 style={{ fontSize:'1rem', fontWeight:800, color:'var(--text-on-dark)', letterSpacing:'-.02em' }}>{label}</h2>
        {sub && <span style={{ fontSize:'.72rem', color:'var(--text-faint)', fontWeight:500 }}>{sub}</span>}
      </div>
      <div style={{ height:2, width:36, background:'linear-gradient(to right,#23c55e,transparent)', borderRadius:2, marginLeft:38 }}/>
    </div>
  );
}

/* ── Job Guide Page ─────────────────────────────────────────────────────────── */
function JobGuidePage({ country: c, onBack }) {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'28px 16px 60px' }}>

      {/* ── Back + Country Crumb ── */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={onBack} className="ghost-btn"
          style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, fontSize:'.8rem', fontWeight:600 }}>
          <Ic.ChevL/> Back
        </button>
        <span style={{ color:'var(--text-faint)', fontSize:'.8rem' }}>Job Guides /</span>
        <span style={{ color:'#23c55e', fontSize:'.8rem', fontWeight:700 }}>{c.name}</span>
      </div>

      {/* ── Hero ── */}
      <div className="dark-card fade-up" style={{ marginBottom:20, position:'relative', overflow:'hidden', borderRadius:18 }}>
        <img src={c.image} alt={c.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }} loading="lazy"/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(11,17,32,0.96) 35%, rgba(11,17,32,0.6) 65%, rgba(11,17,32,0.25) 100%)' }}/>
        <div style={{ position:'relative', zIndex:2, padding:'34px 36px', minHeight:210, display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
            <span style={{ fontSize:'2.8rem', filter:'drop-shadow(0 2px 6px rgba(0,0,0,.5))' }}>{c.flag}</span>
            <div>
              <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#ffffff', letterSpacing:'-.03em', lineHeight:1.15 }}>
                Job Guide: {c.name}
              </h1>
              <p style={{ fontSize:'.88rem', color:'rgba(226,232,240,0.75)', marginTop:5, lineHeight:1.6 }}>{c.tagline}</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
            {c.topSectors.map(s => (
              <span key={s} className="tag-pill" style={{ fontSize:'.68rem' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="fade-up" style={{ padding:'18px 24px', marginBottom:20, animationDelay:'60ms', background:'#ffffff', borderRadius:18, border:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {[
            { icon:<Ic.Briefcase/>, label:'Work Visa',        value:c.visa,      sub:c.visaDetail },
            { icon:<Ic.Globe/>,     label:'Language',         value:c.language,  sub:null },
            { icon:<Ic.DollarSign/>,label:'Currency',         value:c.currency,  sub:null },
            { icon:<Ic.Clock/>,     label:'Avg Work Week',    value:c.workWeek,  sub:null },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:13, paddingRight: i < 3 ? 16 : 0, borderRight: i < 3 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'rgba(35,197,94,0.1)', border:'1px solid rgba(35,197,94,0.22)', display:'flex', alignItems:'center', justifyContent:'center', color:'#16a34a', flexShrink:0 }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize:'.7rem', color:'#9ca3af', marginBottom:2, fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em' }}>{item.label}</p>
                <p style={{ fontSize:'.86rem', fontWeight:800, color:'#0f172a', lineHeight:1.3 }}>{item.value}</p>
                {item.sub && <p style={{ fontSize:'.69rem', color:'#6b7280', marginTop:2 }}>{item.sub}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2-column grid ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>

        {/* ── 1. Top Job Platforms ── */}
        <div className="dark-card fade-up" style={{ padding:'22px 20px', animationDelay:'120ms' }}>
          <SectionHeading num="1" label="Top Job Platforms" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {c.platforms.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                <div className="platform-card">
                  <PlatformIcon icon={p.icon} color={p.color} bg={p.bg} name={p.name}/>
                  <div>
                    <p style={{ fontWeight:700, fontSize:'.84rem', color:'#111827', marginBottom:3 }}>{p.name}</p>
                    <Stars n={p.rating}/>
                  </div>
                  <p style={{ fontSize:'.75rem', color:'#4b5563', lineHeight:1.55, flex:1 }}>{p.desc}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:5, color:'#23c55e', fontSize:'.74rem', fontWeight:700, marginTop:'auto' }}>
                    Visit <Ic.ExternalLink/>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── 3. Tips for Job Seekers ── */}
        <div className="dark-card fade-up" style={{ padding:'22px 20px', animationDelay:'180ms' }}>
          <SectionHeading num="3" label="Tips for Job Seekers"/>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {c.tips.map((tip, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 13px', borderRadius:12, background:'rgba(35,197,94,0.05)', border:'1px solid rgba(35,197,94,0.12)', transition:'background .15s, border-color .15s', cursor:'default' }}
                onMouseOver={e => { e.currentTarget.style.background='rgba(35,197,94,0.1)'; e.currentTarget.style.borderColor='rgba(35,197,94,0.25)'; }}
                onMouseOut={e => { e.currentTarget.style.background='rgba(35,197,94,0.05)'; e.currentTarget.style.borderColor='rgba(35,197,94,0.12)'; }}>
                <div style={{ flexShrink:0, marginTop:1 }}><Ic.Check/></div>
                <p style={{ fontSize:'.81rem', color:'var(--text-on-dark)', lineHeight:1.6 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2-column row 2 ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>

        {/* ── 2. Average Salary Guide ── */}
        <div className="dark-card fade-up" style={{ padding:'22px 20px', animationDelay:'240ms' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ width:28, height:28, borderRadius:8, background:'rgba(35,197,94,0.15)', border:'1px solid rgba(35,197,94,0.35)', display:'flex', alignItems:'center', justifyContent:'center', color:'#23c55e', fontWeight:800, fontSize:'.8rem', flexShrink:0 }}>2</span>
              <h2 style={{ fontSize:'1rem', fontWeight:800, color:'var(--text-on-dark)', letterSpacing:'-.02em' }}>
                Average Salary Guide
              </h2>
            </div>
            <button
              onClick={() => setReportOpen(true)}
              style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:8, background:'rgba(35,197,94,0.1)', border:'1px solid rgba(35,197,94,0.3)', color:'#23c55e', fontFamily:'Sora,sans-serif', fontSize:'.72rem', fontWeight:700, cursor:'pointer', transition:'background .15s' }}
              onMouseOver={e => e.currentTarget.style.background='rgba(35,197,94,0.18)'}
              onMouseOut={e => e.currentTarget.style.background='rgba(35,197,94,0.1)'}>
              View Full Report <Ic.ArrowR/>
            </button>
          </div>
          <div style={{ height:2, width:36, background:'linear-gradient(to right,#23c55e,transparent)', borderRadius:2, marginLeft:38, marginBottom:16 }}/>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {c.salaries.map((s, i) => (
              <div key={i} className="salary-card">
                <div style={{ width:44, height:44, borderRadius:13, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {s.icon}
                </div>
                <p style={{ fontWeight:700, fontSize:'.74rem', color:'#111827', lineHeight:1.35, textAlign:'center' }}>{s.role}</p>
                <p style={{ fontWeight:800, fontSize:'.82rem', color:s.color }}>{s.range}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize:'.7rem', color:'#6b7280', marginTop:12, textAlign:'center' }}>
            Salaries vary based on experience, location, and company size.
          </p>
        </div>

        {/* ── 4. Quick Facts ── */}
        <div className="dark-card fade-up" style={{ padding:'22px 20px', animationDelay:'300ms' }}>
          <SectionHeading num="4" label="Quick Facts"/>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
            {c.facts.map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ flexShrink:0 }}>{f.icon}</div>
                <p style={{ fontSize:'.81rem', color:'var(--text-on-dark)', lineHeight:1.5 }}>{f.text}</p>
              </div>
            ))}
          </div>

          {/* Mini map silhouette area */}
          <div style={{ borderRadius:14, background:'rgba(35,197,94,0.06)', border:'1px solid rgba(35,197,94,0.15)', padding:'14px 16px', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ fontSize:'2.8rem', filter:'grayscale(.3)' }}>{c.flag}</div>
            <div>
              <p style={{ fontWeight:700, fontSize:'.82rem', color:'var(--text-on-dark)', marginBottom:3 }}>Top Hiring Sectors</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {c.topSectors.map(s => (
                  <span key={s} style={{ padding:'2px 9px', borderRadius:20, background:'rgba(35,197,94,0.12)', border:'1px solid rgba(35,197,94,0.25)', color:'#23c55e', fontSize:'.68rem', fontWeight:700 }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Good to Know Banner ── */}
      <div className="dark-card fade-up" style={{ padding:'18px 24px', border:'1px solid rgba(35,197,94,0.25)', background:'rgba(35,197,94,0.05)', display:'flex', alignItems:'center', gap:16, animationDelay:'360ms' }}>
        <div style={{ width:44, height:44, borderRadius:13, background:'rgba(35,197,94,0.12)', border:'1px solid rgba(35,197,94,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Ic.Bulb/>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontWeight:800, fontSize:'.86rem', color:'var(--text-on-dark)', marginBottom:3 }}>Good to Know</p>
          <p style={{ fontSize:'.8rem', color:'var(--text-muted)', lineHeight:1.6 }}>{c.goodToKnow}</p>
        </div>
        <button onClick={onBack} className="accent-btn"
          style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:12, fontSize:'.8rem', flexShrink:0, whiteSpace:'nowrap' }}>
          Explore More Countries <Ic.ArrowR/>
        </button>
      </div>

      {/* ── Full Report Modal ── */}
      {reportOpen && <SalaryReportModal c={c} onClose={() => setReportOpen(false)} />}
    </div>
  );
}

/* ── Salary Report Modal ────────────────────────────────────────────────────── */
function SalaryReportModal({ c, onClose }) {
  const OVERLAY_S = { position:'fixed', inset:0, background:'rgba(11,17,32,0.85)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:16 };
  return (
    <div style={OVERLAY_S} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="dark-card" style={{ width:'100%', maxWidth:560, maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden', animation:'fadeUp .22s cubic-bezier(.22,1,.36,1) both' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
          <div>
            <p style={{ fontWeight:800, fontSize:'.95rem', color:'#e2e8f0' }}>Full Salary Report — {c.name}</p>
            <p style={{ fontSize:'.72rem', color:'#4b6080', marginTop:2 }}>Annual figures · Median market rates 2026</p>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'#64748b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
          {c.salaries.map((s, i) => {
            const lo = parseInt(s.range.replace(/[^0-9]/g,''));
            const parts = s.range.split('–');
            const hi = parseInt((parts[1]||'').replace(/[^0-9]/g,''));
            const pct = Math.round(((lo - 30) / 170) * 100);
            const barW = Math.round(((hi - lo) / 170) * 100);
            return (
              <div key={i} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.icon}</div>
                    <span style={{ fontWeight:700, fontSize:'.82rem', color:'#e2e8f0' }}>{s.role}</span>
                  </div>
                  <span style={{ fontWeight:800, fontSize:'.82rem', color:s.color }}>{s.range}</span>
                </div>
                <div style={{ height:8, borderRadius:4, background:'rgba(255,255,255,0.07)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', left:`${pct}%`, width:`${barW}%`, height:'100%', borderRadius:4, background:`linear-gradient(to right, ${s.color}88, ${s.color})` }}/>
                </div>
              </div>
            );
          })}
          <div style={{ marginTop:16, padding:13, borderRadius:12, background:'rgba(35,197,94,0.07)', border:'1px solid rgba(35,197,94,0.18)' }}>
            <p style={{ fontSize:'.76rem', color:'#4ade80', lineHeight:1.65 }}>
              📊 Ranges represent the 25th–75th percentile of reported salaries for {c.name}. Senior roles, specialized skills, and major cities command higher compensation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Country Selector Home ──────────────────────────────────────────────────── */
function CountrySelector({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'48px 16px 60px' }}>

      {/* Title */}
      <div className="fade-up" style={{ textAlign:'center', marginBottom:40 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 16px', borderRadius:30, background:'rgba(35,197,94,0.1)', border:'1px solid rgba(35,197,94,0.25)', marginBottom:16 }}>
          <Ic.Plane/>
          <span style={{ fontSize:'.78rem', color:'#23c55e', fontWeight:700, letterSpacing:'.04em' }}>STUDY ABROAD COMMUNITY</span>
        </div>
        <h1 style={{ fontSize:'2.4rem', fontWeight:800, color:'#e2e8f0', letterSpacing:'-.03em', lineHeight:1.2, marginBottom:12 }}>
          Country Job Guides
        </h1>
        <p style={{ fontSize:'.92rem', color:'#64748b', maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>
          Detailed, up-to-date job market intelligence for the most popular study abroad destinations. Pick your country to begin.
        </p>
      </div>

      {/* Country Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
        {COUNTRY_LIST.map((key, i) => {
          const c = COUNTRIES[key];
          const img = c.image;
          return (
            <div key={key} className="fade-up"
              style={{ borderRadius:18, overflow:'hidden', position:'relative', cursor:'pointer', height:200, border:'1px solid rgba(255,255,255,0.08)', transition:'transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s', animationDelay:`${i*70}ms`, boxShadow: hovered===key ? '0 8px 32px rgba(35,197,94,0.2)' : '0 2px 12px rgba(0,0,0,0.3)' }}
              onMouseOver={e => { e.currentTarget.style.transform='scale(1.04) translateY(-4px)'; setHovered(key); }}
              onMouseOut={e => { e.currentTarget.style.transform='scale(1)'; setHovered(null); }}
              onClick={() => onSelect(key)}>
              <img src={img} alt={c.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy"/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(11,17,32,0.95) 0%, rgba(11,17,32,0.3) 55%, transparent)' }}/>
              {hovered===key && (
                <div style={{ position:'absolute', inset:0, background:'rgba(35,197,94,0.06)', transition:'opacity .2s' }}/>
              )}
              <div style={{ position:'absolute', bottom:14, left:14, right:14 }}>
                <div style={{ fontSize:'1.7rem', marginBottom:4 }}>{c.flag}</div>
                <div style={{ fontWeight:800, fontSize:'.92rem', color:'#fff', marginBottom:4 }}>{c.name}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:'.67rem', color:'rgba(35,197,94,.9)', fontWeight:700 }}>
                    {c.topSectors.slice(0,2).join(' · ')}
                  </span>
                  {hovered===key && (
                    <span style={{ fontSize:'.7rem', color:'#23c55e', fontWeight:700, display:'flex', alignItems:'center', gap:3 }}>
                      View <Ic.ArrowR/>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div className="fade-up" style={{ marginTop:28, padding:'18px 28px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, animationDelay:'500ms', background:'#ffffff', borderRadius:18, border:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
        {[
          { val:'5', label:'Countries covered' },
          { val:'30+', label:'Job platforms listed' },
          { val:'30+', label:'Salary data points' },
          { val:'25+', label:'Job seeker tips' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign:'center', padding:'0 16px', borderRight: i < 3 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
            <p style={{ fontSize:'1.6rem', fontWeight:800, color:'#23c55e', marginBottom:3 }}>{s.val}</p>
            <p style={{ fontSize:'.74rem', color:'#6b7280' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── App ────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <AnimatedBackground/>
      <div className="app-root" style={{ minHeight:'100vh' }}>
        {selected
          ? <JobGuidePage country={COUNTRIES[selected]} onBack={() => setSelected(null)}/>
          : <CountrySelector onSelect={setSelected}/>
        }
      </div>
    </>
  );
}
