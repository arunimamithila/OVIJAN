import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building, Calendar, Users, BarChart3, Bookmark,
  Shield, FileText, Settings, UserCircle, LogOut, ChevronDown,
  Globe, Heart, MessageCircle, Share2, Bookmark as BookmarkIcon,
  TrendingUp, Award, Flag, Plus, X, Image, Hash, MapPin,
  Bell, Search, Menu, UserPlus, CheckCircle, Clock, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #f0f2f5;
    --accent:  #10b981;
    --accent-dim: rgba(16,185,129,0.12);
    --accent-border: rgba(16,185,129,0.25);
    --text-dark:   #111827;
    --text-mid:    #000000;
    --text-light:  #9ca3af;
    --divider:     rgba(0,0,0,0.07);
  }

  body {
    font-family: 'Sora', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    color: var(--text-dark);
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 4px; }

  .card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  }

  .dark-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  }

  .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .line-clamp-2 { overflow:hidden; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .fade-up { animation: fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.9s linear infinite; }

  @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  .modal-in { animation: modalIn 0.22s cubic-bezier(0.22,1,0.36,1) both; }

  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  @keyframes globe-spin { to { transform: rotate(360deg); } }
  .globe-spin { animation: globe-spin 22s linear infinite; }

  .accent-btn {
    background: #10b981;
    color: #fff;
    font-weight: 700;
    border: none;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.18s, transform 0.13s;
  }
  .accent-btn:hover { background: #059669; transform: translateY(-1px); }
  .accent-btn:active { transform: scale(0.97); }
  .accent-btn:disabled { background: #a7f3c4; cursor: not-allowed; transform: none; }

  .ghost-btn {
    background: transparent;
    border: 1px solid rgba(0,0,0,0.12);
    color: #64748b;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
  }
  .ghost-btn:hover { border-color: #10b981; color: #10b981; background: rgba(16,185,129,0.06); }

  .icon-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-dark);
    display: flex; align-items: center; justify-content: center;
    transition: color 0.15s;
    font-family: inherit;
  }
  .icon-btn:hover { color: #10b981; }

  .tag-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 10px;
    background: rgba(16,185,129,0.09);
    color: #10b981;
    font-size: 0.71rem;
    border-radius: 20px;
    border: 1px solid rgba(16,185,129,0.2);
    font-weight: 600;
  }

  .carr-arrow { opacity: 0; transition: opacity 0.18s; }

  #bg-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .app-root { position: relative; z-index: 1; }

  input, textarea, select { font-family: 'Sora', sans-serif; }
  select option { color: #111827; }
`;

function injectStyles() {
  if (document.getElementById('cf-styles')) return;
  const s = document.createElement('style');
  s.id = 'cf-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}
injectStyles();

// ── Data ──────────────────────────────────────────────────────────────────────
const POSTS_DATA = [
  { id:1, author:{name:'Sarah Johnson',avatar:'SJ',country:'United Kingdom',flag:'🇬🇧'}, timestamp:'2 hours ago', content:'Just received my acceptance letter from Oxford University! 🎉 The journey was tough but so worth it. Happy to answer any questions about the application process for UK universities.', image:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=420&fit=crop', likes:342, comments:56, shares:28, tags:['Oxford','UKStudy','AcceptanceLetter'], trending:true },
  { id:2, author:{name:'Alex Chen',avatar:'AC',country:'Canada',flag:'🇨🇦'}, timestamp:'5 hours ago', content:'Complete guide to Canadian study permits: Everything you need to know about the application process, required documents, and timeline. Took me 6 weeks to get mine approved!', likes:289, comments:42, shares:67, tags:['Canada','StudyPermit','VisaGuide'], trending:true },
  { id:3, author:{name:'Maria Garcia',avatar:'MG',country:'Spain',flag:'🇪🇸'}, timestamp:'8 hours ago', content:'Sharing my experience with the DAAD scholarship for Germany. Application tips, interview process, and what they really look for in candidates. Feel free to ask anything!', image:'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=420&fit=crop', likes:456, comments:89, shares:123, tags:['Germany','DAAD','Scholarship'], trending:true },
  { id:4, author:{name:'David Kim',avatar:'DK',country:'USA',flag:'🇺🇸'}, timestamp:'12 hours ago', content:"Top 5 mistakes international students make when applying to US universities. Learn from my mistakes so you don't have to make them yourself! 📚", likes:512, comments:78, shares:94, tags:['USA','ApplicationTips','InternationalStudents'], trending:true },
  { id:5, author:{name:'Yuki Tanaka',avatar:'YT',country:'Japan',flag:'🇯🇵'}, timestamp:'14 hours ago', content:'Just landed in Tokyo for my exchange semester at Waseda University! The campus is incredible and everyone has been so welcoming. Happy to share tips for anyone considering Japan! 🇯🇵', likes:198, comments:31, shares:19, tags:['Japan','Waseda','ExchangeSemester'], trending:false },
  { id:6, author:{name:'Emma Wilson',avatar:'EW',country:'UK',flag:'🇬🇧'}, timestamp:'18 hours ago', content:'Scholarship alert! The Chevening Scholarship applications are now open for 2026-2027. Fully funded UK masters for students from 160+ countries. Deadline: November 4th. Apply now!', likes:634, comments:112, shares:287, tags:['Chevening','Scholarship','UK'], trending:true },
  { id:7, author:{name:'Lucas Schmidt',avatar:'LS',country:'Germany',flag:'🇩🇪'}, timestamp:'1 day ago', content:'Breaking down the costs of studying in Germany as an international student. Spoiler: tuition is mostly free but here is what you actually need to budget for living expenses.', likes:421, comments:67, shares:88, tags:['Germany','CostOfLiving','StudyAbroad'], trending:false },
  { id:8, author:{name:'Maya Patel',avatar:'MP',country:'India',flag:'🇮🇳'}, timestamp:'1 day ago', content:'After 3 rejections, I finally got into LSE with a partial scholarship! Here is exactly what I changed in my application and personal statement that made the difference.', likes:892, comments:143, shares:201, tags:['LSE','UK','Persistence','MSc'], trending:true },
  { id:9, author:{name:'Oliver Braun',avatar:'OB',country:'Germany',flag:'🇩🇪'}, timestamp:'2 days ago', content:'PSA: The German blocked account (Sperrkonto) requirement has changed for 2026. You now need to show €11,904 before your visa appointment. Here is the easiest banks to use.', likes:374, comments:54, shares:112, tags:['Germany','Sperrkonto','VisaTips'], trending:false },
  { id:10, author:{name:'Priya Nair',avatar:'PN',country:'India',flag:'🇮🇳'}, timestamp:'2 days ago', content:'How I wrote a personal statement that got me offers from Cambridge, Imperial, and UCL. Breaking down the exact structure and what admissions tutors actually look for.', likes:1204, comments:218, shares:445, tags:['UK','PersonalStatement','Admissions'], trending:true },
  { id:11, author:{name:'Jake Morrison',avatar:'JM',country:'USA',flag:'🇺🇸'}, timestamp:'3 days ago', content:'Comparing F-1 vs J-1 student visa: which one is right for you? I went through both processes and made a comprehensive breakdown of pros, cons, and long-term implications.', likes:298, comments:47, shares:73, tags:['USA','F1Visa','J1Visa','StudentVisa'], trending:false },
  { id:12, author:{name:'Chiara Russo',avatar:'CR',country:'Italy',flag:'🇮🇹'}, timestamp:'3 days ago', content:'Italy for international students is massively underrated. World-class universities, rich culture, affordable living — and some programs are completely free. Here is your guide.', likes:563, comments:91, shares:167, tags:['Italy','StudyAbroad','ErasmusPlus'], trending:true },
];

const COUNTRIES = [
  { name:'United States', flag:'🇺🇸', members:'125K', image:'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=280&fit=crop' },
  { name:'United Kingdom', flag:'🇬🇧', members:'98K',  image:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=280&fit=crop' },
  { name:'Canada',         flag:'🇨🇦', members:'87K',  image:'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&h=280&fit=crop' },
  { name:'Germany',        flag:'🇩🇪', members:'76K',  image:'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=280&fit=crop' },
  { name:'Australia',      flag:'🇦🇺', members:'92K',  image:'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=280&fit=crop' },
  { name:'France',         flag:'🇫🇷', members:'64K',  image:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=280&fit=crop' },
  { name:'Netherlands',    flag:'🇳🇱', members:'52K',  image:'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=280&fit=crop' },
  { name:'Japan',          flag:'🇯🇵', members:'71K',  image:'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&h=280&fit=crop' },
  { name:'South Korea',    flag:'🇰🇷', members:'48K',  image:'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&h=280&fit=crop' },
  { name:'Sweden',         flag:'🇸🇪', members:'41K',  image:'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400&h=280&fit=crop' },
  { name:'Italy',          flag:'🇮🇹', members:'56K',  image:'https://images.unsplash.com/photo-1555992457-b8fefdd09069?w=400&h=280&fit=crop' },
  { name:'Spain',          flag:'🇪🇸', members:'53K',  image:'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400&h=280&fit=crop' },
];

const ALL_EVENTS = [
  { type:'Webinar',  title:'Study in Germany Q&A Session',       date:'May 26, 2026', time:'3:00 PM GMT',  host:'Lucas Schmidt',    spots:142, desc:'Live Q&A covering blocked accounts, visa timelines, university applications and adapting to life in Germany.' },
  { type:'Workshop', title:'SOP Writing Masterclass',             date:'May 29, 2026', time:'5:00 PM GMT',  host:'Maya Patel',       spots:89,  desc:'A hands-on workshop breaking down every section of a winning Statement of Purpose with real examples from successful applicants.' },
  { type:'Session',  title:'Visa Interview Preparation',          date:'Jun 2, 2026',  time:'2:00 PM GMT',  host:'Emma Wilson',      spots:210, desc:'Mock interview practice and coaching for US, UK, and Schengen student visa interviews. Includes common questions and red-flag answers.' },
  { type:'Webinar',  title:'Scholarships for Developing Nations', date:'Jun 8, 2026',  time:'4:00 PM GMT',  host:'Priya Nair',       spots:300, desc:'Overview of fully funded scholarships — Chevening, DAAD, Fulbright, Commonwealth — and actionable tips for competitive applications.' },
  { type:'Panel',    title:'Life After Graduation Abroad',        date:'Jun 14, 2026', time:'6:00 PM GMT',  host:'David Kim',        spots:175, desc:'Alumni panel discussing post-study work permits, job markets, and building a career in your host country vs returning home.' },
  { type:'Workshop', title:'IELTS & TOEFL Prep Sprint',           date:'Jun 20, 2026', time:'10:00 AM GMT', host:'Sarah Johnson',     spots:60,  desc:'Intensive two-hour session covering test strategy, time management, and the most common mistakes that cost applicants band scores.' },
];

const ALL_CONTRIBUTORS = [
  { name:'Emma Wilson',     country:'UK',          flag:'🇬🇧', pts:'12.5K', online:true,  posts:87,  bio:'UK visa expert & Chevening alumni. Ask me anything about British universities.' },
  { name:'David Lee',       country:'Canada',      flag:'🇨🇦', pts:'10.2K', online:false, posts:74,  bio:'Helped 200+ students with Canadian study permit applications. Co-founder of StudyCA.' },
  { name:'Sofia Rodriguez', country:'Spain',       flag:'🇪🇸', pts:'9.8K',  online:true,  posts:65,  bio:'Erasmus coordinator. Passionate about European higher education and scholarships.' },
  { name:'James Park',      country:'USA',         flag:'🇺🇸', pts:'8.9K',  online:false, posts:58,  bio:'Former admissions officer at UCLA. Now helping international students crack US apps.' },
  { name:'Priya Nair',      country:'India',       flag:'🇮🇳', pts:'8.1K',  online:true,  posts:52,  bio:'Cambridge grad. Personal statement coach. Helped 150+ students get into Oxbridge.' },
  { name:'Lucas Schmidt',   country:'Germany',     flag:'🇩🇪', pts:'7.6K',  online:false, posts:49,  bio:'TU Munich student. Writing about studying in Germany for free as an international.' },
  { name:'Yuki Tanaka',     country:'Japan',       flag:'🇯🇵', pts:'6.9K',  online:true,  posts:43,  bio:'Waseda exchange student. Japan study guide author. JLPT N2 prep resources.' },
  { name:'Chiara Russo',    country:'Italy',       flag:'🇮🇹', pts:'6.3K',  online:false, posts:39,  bio:'Bocconi MBA. Advocating for Italy as a study destination. ErasmusPlus mentor.' },
];

const FULL_GUIDELINES = [
  { icon:'🤝', title:'Be respectful and supportive', body:'Treat every member with courtesy. Disagreements are fine — personal attacks, harassment, and discrimination are not. We are all navigating the same difficult journey.' },
  { icon:'✅', title:'Share accurate information', body:'Only share visa rules, scholarship details, and deadlines you can verify. Outdated or wrong info can seriously harm someone\'s application. Link your sources when possible.' },
  { icon:'🚫', title:'No spam or unsolicited promotion', body:'Do not post promotional content, affiliate links, or advertisements without moderator approval. Consultancy services must be disclosed and approved.' },
  { icon:'🔒', title:'Protect personal data', body:'Never share your own or others\' passport numbers, full dates of birth, or financial account details in public posts. Use DMs for sensitive documents.' },
  { icon:'🗣️', title:'Stay on topic', body:'Posts should relate to studying abroad, visas, scholarships, university admissions, or student life in a host country. Off-topic content may be removed.' },
  { icon:'📣', title:'Report, don\'t retaliate', body:'If you see rule-breaking content, use the Report button. Retaliating against bad actors escalates problems. Mods review all reports within 24 hours.' },
  { icon:'🌍', title:'English is the common language', body:'Posts in English reach the widest audience. You may reply in your native language in comment threads, but top-level posts should be in English.' },
  { icon:'⚖️', title:'Consequences', body:'Violations result in a warning, then a 7-day suspension, then a permanent ban. Severe violations (doxxing, hate speech) result in immediate permanent removal.' },
];

const DEFAULT_FOLLOWING = new Set(['Sarah Johnson', 'Emma Wilson', 'David Kim']);

const OVERLAY = {
  position:'fixed', inset:0,
  background:'rgba(0,0,0,0.5)',
  backdropFilter:'blur(8px)',
  WebkitBackdropFilter:'blur(8px)',
  zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16,
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ic = {
  Search:   ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus:     ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X:        ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Heart:    ({f})=><svg width="16" height="16" fill={f?'#10b981':'none'} viewBox="0 0 24 24" stroke={f?'#10b981':'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Chat:     ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Share:    ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Bookmark: ({f})=><svg width="16" height="16" fill={f?'#10b981':'none'} viewBox="0 0 24 24" stroke={f?'#10b981':'currentColor'} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Dots:     ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
  Flag:     ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  Copy:     ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Eye:      ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Save:     ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Globe:    ()=><svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  ChevL:    ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevR:    ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Trend:    ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Cal:      ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  File:     ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Users:    ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  UserPlus: ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Image:    ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Hash:     ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
  Pin:      ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Check:    ()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Pen:      ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Shield:   ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Award:    ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Clock:    ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  People:   ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ initials, size = 42 }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', flexShrink:0, background:'#10b981', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:size>36?'0.82rem':'0.7rem' }}>
    {initials}
  </div>
);

// ── Generic Modal Shell ───────────────────────────────────────────────────────
function ModalShell({ title, subtitle, onClose, children, maxWidth=600 }) {
  return (
    <div style={OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="dark-card modal-in" style={{ width:'100%', maxWidth, maxHeight:'88vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(0,0,0,0.07)', flexShrink:0 }}>
          <div>
            <p style={{ fontWeight:700, fontSize:'0.95rem', color:'#111827' }}>{title}</p>
            {subtitle && <p style={{ fontSize:'0.72rem', color:'#6b7280', marginTop:2 }}>{subtitle}</p>}
          </div>
          <button className="icon-btn" onClick={onClose} style={{ width:30, height:30, borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', color:'#64748b' }}>
            <Ic.X />
          </button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Events Modal ──────────────────────────────────────────────────────────────
function EventsModal({ onClose }) {
  const [registered, setRegistered] = useState(new Set());
  const [loading, setLoading]       = useState(null);

  const register = async (title) => {
    setLoading(title);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(null);
    setRegistered(prev => new Set([...prev, title]));
  };

  const typeColors = { Webinar:'#3b82f6', Workshop:'#f59e0b', Session:'#8b5cf6', Panel:'#ec4899' };

  return (
    <ModalShell title="Upcoming Events" subtitle={`${ALL_EVENTS.length} events scheduled`} onClose={onClose} maxWidth={580}>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {ALL_EVENTS.map((ev, i) => {
          const isReg   = registered.has(ev.title);
          const isLoading = loading === ev.title;
          const color   = typeColors[ev.type] || '#10b981';
          return (
            <div key={i} className="fade-up"
              style={{ padding:16, border:'1px solid rgba(0,0,0,0.08)', borderRadius:14, transition:'border-color 0.18s', animationDelay:`${i*50}ms` }}
              onMouseOver={e => e.currentTarget.style.borderColor='rgba(16,185,129,0.35)'}
              onMouseOut={e => e.currentTarget.style.borderColor='rgba(0,0,0,0.08)'}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                    <span style={{ padding:'2px 10px', background:`${color}22`, color, fontSize:'0.67rem', borderRadius:20, fontWeight:700, border:`1px solid ${color}44` }}>{ev.type}</span>
                    <span style={{ fontSize:'0.69rem', color:'#6b7280', display:'flex', alignItems:'center', gap:4 }}><Ic.Clock/>{ev.date} · {ev.time}</span>
                  </div>
                  <p style={{ fontWeight:700, fontSize:'0.86rem', color:'#111827', marginBottom:4 }}>{ev.title}</p>
                  <p style={{ fontSize:'0.78rem', color:'#6b7280', lineHeight:1.6, marginBottom:8 }}>{ev.desc}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12, fontSize:'0.72rem', color:'#6b7280' }}>
                    <span>Host: <span style={{ color:'#374151' }}>{ev.host}</span></span>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><Ic.People/>{ev.spots} spots left</span>
                  </div>
                </div>
                <button
                  onClick={() => !isReg && register(ev.title)}
                  disabled={isReg || isLoading}
                  className="accent-btn"
                  style={{ flexShrink:0, padding:'7px 14px', borderRadius:10, fontSize:'0.76rem', display:'flex', alignItems:'center', gap:6, background:isReg?'rgba(16,185,129,0.15)':undefined, color:isReg?'#10b981':undefined, border:isReg?'1px solid rgba(16,185,129,0.3)':undefined }}>
                  {isLoading
                    ? <><span className="spin" style={{ width:11, height:11, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block' }}/></>
                    : isReg ? '✓ Registered' : 'Register'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ModalShell>
  );
}

// ── Guidelines Modal ──────────────────────────────────────────────────────────
function GuidelinesModal({ onClose }) {
  return (
    <ModalShell title="Community Guidelines" subtitle="Last updated May 2026 · Applies to all members" onClose={onClose} maxWidth={560}>
      <div style={{ marginBottom:14, padding:12, borderRadius:12, background:'rgba(16,185,129,0.07)', border:'1px solid rgba(16,185,129,0.2)' }}>
        <p style={{ fontSize:'0.8rem', color:'#059669', lineHeight:1.7 }}>
          These guidelines keep our community safe, accurate, and welcoming for the 800K+ students navigating study abroad. Violations are handled by our moderation team.
        </p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {FULL_GUIDELINES.map((g, i) => (
          <div key={i} className="fade-up"
            style={{ padding:14, borderRadius:13, border:'1px solid rgba(0,0,0,0.07)', background:'rgba(0,0,0,0.02)', animationDelay:`${i*40}ms` }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <span style={{ fontSize:'1.3rem', flexShrink:0, marginTop:1 }}>{g.icon}</span>
              <div>
                <p style={{ fontWeight:700, fontSize:'0.84rem', color:'#111827', marginBottom:4 }}>{g.title}</p>
                <p style={{ fontSize:'0.78rem', color:'#6b7280', lineHeight:1.65 }}>{g.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:16, padding:14, borderRadius:12, border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.04)' }}>
        <p style={{ fontSize:'0.77rem', color:'#ef4444', lineHeight:1.65 }}>
          <strong>Questions?</strong> Reach the moderation team at <span style={{ color:'#10b981' }}>mods@communityname.com</span> or use the in-app Report button on any post.
        </p>
      </div>
    </ModalShell>
  );
}

// ── Contributors Modal ────────────────────────────────────────────────────────
function ContributorsModal({ followedUsers, onToggleFollow, onClose }) {
  const [search, setSearch] = useState('');
  const filtered = ALL_CONTRIBUTORS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalShell title="Top Contributors" subtitle={`${ALL_CONTRIBUTORS.length} members · Ranked by community points`} onClose={onClose} maxWidth={540}>
      <div style={{ marginBottom:14 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contributors…"
          style={{ width:'100%', padding:'9px 13px', background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.1)', borderRadius:12, color:'#111827', fontSize:'0.82rem', outline:'none', fontFamily:'Sora, sans-serif' }}
        />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map((u, i) => {
          const followed = followedUsers.has(u.name);
          return (
            <div key={i} className="fade-up"
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'12px 14px', borderRadius:13, border:'1px solid rgba(0,0,0,0.07)', background:'rgba(0,0,0,0.02)', animationDelay:`${i*40}ms` }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, minWidth:0 }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <Avatar initials={u.name.split(' ').map(n=>n[0]).join('')} size={40}/>
                  {u.online && <span style={{ position:'absolute', bottom:0, right:0, width:9, height:9, background:'#10b981', borderRadius:'50%', border:'2px solid #fff', animation:'pulse-dot 2s ease infinite' }}/>}
                  {i < 3 && (
                    <span style={{ position:'absolute', top:-4, left:-4, width:18, height:18, background:['#FFD700','#C0C0C0','#CD7F32'][i], borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', fontWeight:700, color:'#000' }}>
                      {i+1}
                    </span>
                  )}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <p style={{ fontWeight:700, fontSize:'0.84rem', color:'#111827' }}>{u.name}</p>
                    <span style={{ fontSize:'0.68rem', color:'#6b7280' }}>{u.flag} {u.country}</span>
                  </div>
                  <p style={{ fontSize:'0.74rem', color:'#6b7280', lineHeight:1.5, marginTop:2 }}>{u.bio}</p>
                  <div style={{ display:'flex', gap:12, marginTop:4, fontSize:'0.69rem', color:'#6b7280' }}>
                    <span style={{ color:'#10b981', fontWeight:700 }}>{u.pts} pts</span>
                    <span>{u.posts} posts</span>
                    <span>{u.online ? <span style={{ color:'#059669' }}>● Online</span> : 'Offline'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onToggleFollow(u.name)}
                style={{ flexShrink:0, padding:'6px 14px', borderRadius:9, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', transition:'all .15s', border:`1px solid ${followed?'rgba(16,185,129,.35)':'rgba(16,185,129,.5)'}`, background:followed?'rgba(16,185,129,.1)':'#10b981', color:followed?'#10b981':'#fff', fontFamily:'inherit' }}>
                {followed ? '✓ Following' : 'Follow'}
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ textAlign:'center', color:'#6b7280', fontSize:'0.84rem', padding:24 }}>No contributors match your search.</p>
        )}
      </div>
    </ModalShell>
  );
}

// ── Join Modal ────────────────────────────────────────────────────────────────
function JoinModal({ country, onClose, onConfirm }) {
  const [msg, setMsg]         = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const handle = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false); setSent(true);
    setTimeout(() => { onConfirm(country.name); onClose(); }, 1500);
  };

  return (
    <div style={OVERLAY} onClick={e => e.target === e.currentTarget && !sending && onClose()}>
      <div className="dark-card modal-in" style={{ width:'100%', maxWidth:440, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:'1.5rem' }}>{country.flag}</span>
            <div>
              <p style={{ fontWeight:700, fontSize:'0.93rem', color:'#111827' }}>Join {country.name}</p>
              <p style={{ fontSize:'0.72rem', color:'#6b7280' }}>{country.members} members · Open community</p>
            </div>
          </div>
          {!sent && (
            <button className="icon-btn" onClick={onClose} style={{ width:30, height:30, borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', color:'#64748b' }}>
              <Ic.X />
            </button>
          )}
        </div>

        {sent ? (
          <div style={{ padding:'36px 20px', textAlign:'center' }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <Ic.Check />
            </div>
            <p style={{ fontWeight:700, fontSize:'0.95rem', color:'#111827', marginBottom:6 }}>Request Sent!</p>
            <p style={{ fontSize:'0.82rem', color:'#6b7280' }}>Your join request for {country.name} has been submitted.</p>
          </div>
        ) : (
          <div style={{ padding:'18px 20px' }}>
            <div style={{ padding:12, borderRadius:12, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.22)', marginBottom:16 }}>
              <p style={{ fontSize:'0.8rem', color:'#059669', lineHeight:1.6 }}>📌 Most communities approve within 24 hours.</p>
            </div>
            <label style={{ display:'block', fontSize:'0.75rem', color:'#6b7280', marginBottom:6 }}>Introduce yourself (optional)</label>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder={`Tell the ${country.name} community about yourself...`}
              style={{ width:'100%', minHeight:90, padding:'10px 13px', background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.1)', borderRadius:12, color:'#111827', fontSize:'0.85rem', resize:'none', outline:'none', lineHeight:1.6, marginBottom:14, fontFamily:'inherit' }}
            />
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={onClose}
                style={{ flex:1, padding:10, borderRadius:12, fontWeight:600, fontSize:'0.85rem', background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.12)', color:'#6b7280', cursor:'pointer', fontFamily:'inherit' }}>
                Cancel
              </button>
              <button onClick={handle} disabled={sending} className="accent-btn"
                style={{ flex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:10, borderRadius:12, fontSize:'0.85rem' }}>
                {sending
                  ? <><span className="spin" style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block' }}/> Sending…</>
                  : 'Send Join Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Country Carousel ──────────────────────────────────────────────────────────
function CountryCarousel({ joinedCountries, onJoin, onViewAll, viewAll }) {
  const [joinTarget, setJoinTarget] = useState(null);
  const navigate = useNavigate();

  const scroll = dir => {
    const el = document.getElementById('c-carousel');
    if (el) el.scrollBy({ left: dir === 'l' ? -300 : 300, behavior: 'smooth' });
  };

  const displayCountries = viewAll ? COUNTRIES : COUNTRIES.slice(0, 8);

  return (
    <>
      <div className="dark-card" style={{ padding:16, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <h2 style={{ fontSize:'0.97rem', fontWeight:700, color:'#111827', letterSpacing:'-0.01em' }}>Explore Communities</h2>
          <button onClick={onViewAll} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.78rem', color:'#10b981', fontFamily:'inherit', fontWeight:600 }}>
            {viewAll ? '← Show Less' : 'View All →'}
          </button>
        </div>

        {viewAll ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
            {COUNTRIES.map((c, i) => {
              const j = joinedCountries.has(c.name);
              return (
                <div key={i}
                  style={{ borderRadius:14, overflow:'hidden', position:'relative', cursor:'pointer', height:140, border:'1px solid rgba(0,0,0,0.08)', transition:'transform .2s' }}
                  onMouseOver={e => { e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.querySelector('.jbtn').style.opacity='1'; }}
                  onMouseOut={e => { e.currentTarget.style.transform='scale(1)'; if (!j) e.currentTarget.querySelector('.jbtn').style.opacity='0'; }}
                >
                  <img src={c.image} alt={c.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy"/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.7) 0%,rgba(0,0,0,.2) 55%,transparent)' }}/>
                  <button className="jbtn accent-btn"
                    onClick={e => { e.stopPropagation(); if (!j) setJoinTarget(c); }}
                    style={{ position:'absolute', top:8, right:8, padding:'3px 11px', borderRadius:8, fontSize:'0.7rem', opacity:j?1:0, transition:'opacity .18s', cursor:j?'default':'pointer' }}>
                    {j ? '✓ Joined' : 'Join'}
                  </button>
                  <div style={{ position:'absolute', bottom:10, left:12 }}>
                    <div style={{ fontSize:'1.5rem' }}>{c.flag}</div>
                    <div style={{ fontSize:'0.84rem', fontWeight:700, color:'#fff', marginTop:1 }}>{c.name}</div>
                    <div style={{ fontSize:'0.68rem', color:'#10b981' }}>👥 {c.members} members</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ position:'relative' }}
            onMouseOver={e => e.currentTarget.querySelectorAll('.carr-arrow').forEach(b => b.style.opacity='1')}
            onMouseOut={e => e.currentTarget.querySelectorAll('.carr-arrow').forEach(b => b.style.opacity='0')}
          >
            <button className="carr-arrow" onClick={() => scroll('l')}
              style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', zIndex:5, width:32, height:32, borderRadius:'50%', background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.1)', color:'#10b981', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Ic.ChevL />
            </button>

            <div id="c-carousel" className="scrollbar-hide" style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:2 }}>
              {displayCountries.map((c, i) => {
                const j = joinedCountries.has(c.name);
                return (
                  <div key={i}
                    style={{ flexShrink:0, width:200, height:130, borderRadius:14, overflow:'hidden', position:'relative', cursor:'pointer', transition:'transform 0.25s cubic-bezier(0.22,1,0.36,1)', border:'1px solid rgba(0,0,0,0.08)' }}
                    onMouseOver={e => { e.currentTarget.style.transform='scale(1.04) translateY(-3px)'; e.currentTarget.querySelector('.jbtn').style.opacity='1'; }}
                    onMouseOut={e => { e.currentTarget.style.transform='scale(1)'; if (!j) e.currentTarget.querySelector('.jbtn').style.opacity='0'; }}
                  >
                    <img src={c.image} alt={c.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy"/>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 55%, transparent)' }}/>
                    <button className="jbtn accent-btn"
                      onClick={e => { e.stopPropagation(); if (!j) setJoinTarget(c); }}
                      style={{ position:'absolute', top:8, right:8, padding:'3px 11px', borderRadius:8, fontSize:'0.7rem', opacity:j?1:0, transition:'opacity 0.18s', cursor:j?'default':'pointer' }}>
                      {j ? '✓ Joined' : 'Join'}
                    </button>
                    <div style={{ position:'absolute', bottom:10, left:12 }}>
                      <div style={{ fontSize:'1.5rem' }}>{c.flag}</div>
                      <div style={{ fontSize:'0.84rem', fontWeight:700, color:'#fff', marginTop:1 }}>{c.name}</div>
                      <div style={{ fontSize:'0.68rem', color:'#10b981' }}>👥 {c.members} members</div>
                    </div>
                  </div>
                );
              })}
              <div
                onClick={onViewAll}
                style={{ flexShrink:0, width:200, height:130, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, borderRadius:14, cursor:'pointer', background:'rgba(0,0,0,0.03)', border:'1px dashed rgba(16,185,129,0.25)', transition:'background 0.18s, border-color 0.18s' }}
                onMouseOver={e => { e.currentTarget.style.background='rgba(16,185,129,0.06)'; e.currentTarget.style.borderColor='rgba(16,185,129,0.45)'; }}
                onMouseOut={e => { e.currentTarget.style.background='rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor='rgba(16,185,129,0.25)'; }}
              >
                <div className="globe-spin"><Ic.Globe /></div>
                <span style={{ fontWeight:700, color:'#111827', fontSize:'0.82rem' }}>View All</span>
              </div>
            </div>

            <button className="carr-arrow" onClick={() => scroll('r')}
              style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', zIndex:5, width:32, height:32, borderRadius:'50%', background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.1)', color:'#10b981', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Ic.ChevR />
            </button>
          </div>
        )}
      </div>

      {joinTarget && (
        <JoinModal
          country={joinTarget}
          onClose={() => setJoinTarget(null)}
          onConfirm={name => { onJoin(name); setJoinTarget(null); }}
        />
      )}
    </>
  );
}

// ── Feed Tabs ─────────────────────────────────────────────────────────────────
function FeedTabs({ active, setActive }) {
  const tabs = ['For You', 'Trending', 'New', 'Following'];
  return (
    <div className="dark-card" style={{ display:'flex', gap:4, padding:5, marginBottom:14 }}>
      {tabs.map(t => {
        const on = active === t;
        return (
          <button key={t} onClick={() => setActive(t)}
            style={{ flex:1, padding:'8px 4px', borderRadius:10, border:on?'1px solid rgba(16,185,129,0.45)':'1px solid transparent', background:on?'rgba(16,185,129,0.14)':'transparent', color:on?'#10b981':'#64748b', fontFamily:'inherit', fontWeight:600, fontSize:'0.78rem', cursor:'pointer', transition:'all 0.15s' }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}

// ── Trending Banner ───────────────────────────────────────────────────────────
function TrendingBanner({ trendingCount }) {
  return (
    <div className="dark-card" style={{ padding:16, marginBottom:14, border:'1px solid rgba(16,185,129,0.2)', background:'rgba(16,185,129,0.04)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <Ic.Trend />
        <span style={{ color:'#111827', fontWeight:700, fontSize:'0.86rem' }}>Trending Now</span>
        <span style={{ padding:'2px 8px', background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:20, fontSize:'0.67rem', color:'#10b981', fontWeight:700 }}>{trendingCount} posts</span>
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {['Scholarship','VisaGuide','Oxford','DAAD','USA','StudyAbroad'].map(t => (
          <span key={t} style={{ padding:'4px 12px', borderRadius:20, fontSize:'0.73rem', fontWeight:700, cursor:'pointer', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#10b981' }}>#{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── New Banner ────────────────────────────────────────────────────────────────
function NewBanner({ count, onBack }) {
  return (
    <div className="dark-card" style={{ padding:'14px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', animation:'pulse-dot 2s ease infinite', flexShrink:0 }}/>
      <span style={{ color:'#6b7280', fontSize:'0.82rem' }}>Showing <strong style={{ color:'#111827' }}>{count} new posts</strong> from the last 24 hours</span>
      <button onClick={onBack} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#10b981', fontFamily:'inherit', fontSize:'0.76rem', fontWeight:600 }}>Back to feed</button>
    </div>
  );
}

// ── Following Banner ──────────────────────────────────────────────────────────
function FollowingBanner({ followingCount, followingNames, postCount }) {
  return (
    <div className="dark-card" style={{ padding:'14px 16px', marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ color:'#111827', fontWeight:700, fontSize:'0.86rem', marginBottom:2 }}>Following {followingCount} people</p>
          <p style={{ color:'#6b7280', fontSize:'0.75rem' }}>Posts from people you follow appear here</p>
        </div>
        <div style={{ display:'flex' }}>
          {followingNames.slice(0,3).map((n,i) => (
            <div key={i} style={{ width:28, height:28, borderRadius:'50%', background:'#10b981', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'0.65rem', marginLeft: i > 0 ? -6 : 0 }}>
              {n[0]}
            </div>
          ))}
        </div>
      </div>
      {postCount === 0 && (
        <div style={{ marginTop:12, padding:14, background:'rgba(16,185,129,0.06)', borderRadius:10, border:'1px solid rgba(16,185,129,0.15)', textAlign:'center' }}>
          <p style={{ color:'#6b7280', fontSize:'0.82rem' }}>No posts yet from people you follow.<br/>Discover and follow more people in the sidebar!</p>
        </div>
      )}
    </div>
  );
}

// ── Inline Create Post ────────────────────────────────────────────────────────
function InlineCreatePost({ onOpen }) {
  return (
    <div className="dark-card" style={{ padding:16, marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <Avatar initials="JD" />
        <button onClick={onOpen}
          style={{ flex:1, textAlign:'left', padding:'10px 16px', background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.1)', borderRadius:24, color:'#6b7280', fontFamily:'inherit', fontSize:'0.85rem', cursor:'pointer', transition:'border-color 0.18s' }}
          onMouseOver={e => e.currentTarget.style.borderColor='rgba(16,185,129,0.5)'}
          onMouseOut={e => e.currentTarget.style.borderColor='rgba(0,0,0,0.1)'}>
          What's on your mind? Share your experience…
        </button>
        <button onClick={onOpen} className="accent-btn"
          style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:12, fontSize:'0.82rem', flexShrink:0 }}>
          <Ic.Pen /><span>Post</span>
        </button>
      </div>
      <div style={{ display:'flex', gap:4, marginTop:12, paddingTop:12, borderTop:'1px solid rgba(0,0,0,0.07)' }}>
        {[{icon:<Ic.Image/>,label:'Photo'},{icon:<Ic.Hash/>,label:'Tag'},{icon:<Ic.Pin/>,label:'Location'}].map((item,i) => (
          <button key={i} onClick={onOpen} className="icon-btn"
            style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:10, fontSize:'0.77rem', fontWeight:500, color:'#64748b' }}
            onMouseOver={e => { e.currentTarget.style.background='rgba(16,185,129,0.08)'; e.currentTarget.style.color='#10b981'; }}
            onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#64748b'; }}>
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, delay=0, isFollowing, onToggleFollow }) {
  const [liked, setLiked]       = useState(false);
  const [saved, setSaved]       = useState(false);
  const [count, setCount]       = useState(post.likes);
  const [menu, setMenu]         = useState(false);
  const [comments, setComments] = useState(false);
  const [toast, setToast]       = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2400); };
  const like = () => { setLiked(p => !p); setCount(p => liked ? p-1 : p+1); };
  const bookmark = () => { setSaved(p => !p); showToast(saved ? 'Removed from saved' : 'Post saved!'); };
  const share = () => showToast('Link copied!');

  const isDefaultFollowing = DEFAULT_FOLLOWING.has(post.author.name);

  return (
    <div className="card fade-up"
      style={{ padding:20, marginBottom:12, position:'relative', transition:'box-shadow 0.2s', animationDelay:`${delay}ms` }}
      onMouseOver={e => e.currentTarget.style.boxShadow='0 4px 20px rgba(16,185,129,0.1)'}
      onMouseOut={e => e.currentTarget.style.boxShadow='0 1px 8px rgba(0,0,0,0.06)'}>

      {toast && (
        <div style={{ position:'absolute', top:14, right:14, background:'#10b981', color:'#fff', padding:'5px 13px', borderRadius:10, fontSize:'0.76rem', fontWeight:600, zIndex:5 }}>
          {toast}
        </div>
      )}

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <Avatar initials={post.author.avatar} />
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' }}>
              <span style={{ fontWeight:700, color:'var(--text-dark)', fontSize:'0.9rem' }}>{post.author.name}</span>
              <span className="tag-pill">{post.author.flag} {post.author.country}</span>
            </div>
            <span style={{ fontSize:'0.72rem', color:'var(--text-light)' }}>{post.timestamp}</span>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:8, position:'relative' }}>
          {!isDefaultFollowing && (
            <button onClick={() => onToggleFollow(post.author.name)}
              style={{ padding:'4px 12px', borderRadius:8, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', transition:'all .15s', border:`1px solid ${isFollowing?'rgba(16,185,129,.35)':'rgba(0,0,0,.1)'}`, background:isFollowing?'rgba(16,185,129,.1)':'transparent', color:isFollowing?'#10b981':'#64748b', fontFamily:'inherit' }}>
              {isFollowing ? '✓ Following' : '+ Follow'}
            </button>
          )}
          <button onClick={() => setMenu(!menu)} className="icon-btn"
            style={{ width:32, height:32, borderRadius:8, border:'1px solid transparent' }}
            onMouseOver={e => e.currentTarget.style.background='#f3f4f6'}
            onMouseOut={e => e.currentTarget.style.background='transparent'}>
            <Ic.Dots />
          </button>
          {menu && (
            <div className="card" style={{ position:'absolute', right:0, top:'100%', marginTop:6, width:170, padding:6, zIndex:10 }}>
              {[{icon:Ic.Save,label:'Save Post'},{icon:Ic.Copy,label:'Copy Link'},{icon:Ic.Eye,label:'Hide'},{icon:Ic.Flag,label:'Report',danger:true}].map((item,i) => (
                <button key={i} onClick={() => setMenu(false)}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:8, border:'none', background:'transparent', color:item.danger?'#ef4444':'var(--text-dark)', fontFamily:'inherit', fontSize:'0.79rem', cursor:'pointer', transition:'background 0.13s' }}
                  onMouseOver={e => e.currentTarget.style.background='#f9fafb'}
                  onMouseOut={e => e.currentTarget.style.background='transparent'}>
                  <item.icon /> {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p style={{ color:'var(--text-dark)', lineHeight:1.75, marginBottom:10, fontSize:'0.87rem' }}>{post.content}</p>

      {post.tags && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
          {post.tags.map(tag => <span key={tag} style={{ color:'#10b981', fontSize:'0.78rem', cursor:'pointer', fontWeight:600 }}>#{tag}</span>)}
        </div>
      )}

      {post.image && (
        <div style={{ borderRadius:12, overflow:'hidden', marginBottom:12, border:'1px solid var(--divider)' }}>
          <img src={post.image} alt="" style={{ width:'100%', display:'block', objectFit:'cover' }} loading="lazy"/>
        </div>
      )}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--divider)' }}>
        <div style={{ display:'flex', gap:18 }}>
          {[
            { fn:like, icon:<Ic.Heart f={liked}/>, label:count, active:liked },
            { fn:()=>setComments(!comments), icon:<Ic.Chat/>, label:post.comments },
            { fn:share, icon:<Ic.Share/>, label:post.shares },
          ].map((btn,i) => (
            <button key={i} onClick={btn.fn} className="icon-btn"
              style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.79rem', fontWeight:600, color:btn.active?'#10b981':'var(--text-mid)' }}>
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
        <button onClick={bookmark} className="icon-btn" style={{ color:saved?'#10b981':'var(--text-mid)' }}>
          <Ic.Bookmark f={saved}/>
        </button>
      </div>

      {comments && (
        <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid var(--divider)' }}>
          {[1,2].map(i => (
            <div key={i} style={{ display:'flex', gap:10, marginBottom:10 }}>
              <Avatar initials="U" size={30}/>
              <div style={{ flex:1, background:'#f9fafb', borderRadius:12, padding:'9px 13px', border:'1px solid var(--divider)' }}>
                <p style={{ fontWeight:700, fontSize:'0.78rem', marginBottom:2, color:'var(--text-dark)' }}>User {i}</p>
                <p style={{ fontSize:'0.78rem', color:'var(--text-mid)' }}>Great post! Very helpful information.</p>
              </div>
            </div>
          ))}
          <div style={{ display:'flex', gap:10 }}>
            <Avatar initials="JD" size={30}/>
            <input placeholder="Write a comment…"
              style={{ flex:1, padding:'8px 13px', background:'#f9fafb', border:'1px solid var(--divider)', borderRadius:12, color:'var(--text-dark)', fontSize:'0.82rem', outline:'none' }}/>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ followedUsers, onToggleFollow, onSeeAllTrending, onSeeAllFollowing, onOpenEvents, onOpenGuidelines, onOpenContributors }) {
  const trending = [
    { title:'Top 10 Universities in Germany for Engineering', author:'Alex Kim',      views:'2.4K' },
    { title:'Complete Guide to UK Student Visa Process',      author:'Sarah Johnson', views:'1.8K' },
    { title:'Scholarship Opportunities in Canada 2026',       author:'Mike Chen',     views:'1.5K' },
  ];
  const contributors = ALL_CONTRIBUTORS.slice(0, 4);
  const events = ALL_EVENTS.slice(0, 3);
  const suggested = ['Maya Patel', 'Lucas Schmidt', 'Yuki Tanaka'];

  const SectionTitle = ({ icon, label, onMore }) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, color:'#111827', fontWeight:700, fontSize:'0.86rem' }}>{icon}{label}</div>
      {onMore && <button className="icon-btn" style={{ fontSize:'0.74rem', color:'#10b981' }} onClick={onMore}>See All</button>}
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

      {/* Trending */}
      <div className="dark-card" style={{ padding:16 }}>
        <SectionTitle icon={<Ic.Trend/>} label="Trending Posts" onMore={onSeeAllTrending}/>
        {trending.map((p,i) => (
          <div key={i}
            style={{ padding:'8px 6px', borderRadius:10, cursor:'pointer', transition:'background 0.14s', marginBottom:2 }}
            onMouseOver={e => e.currentTarget.style.background='rgba(0,0,0,0.04)'}
            onMouseOut={e => e.currentTarget.style.background='transparent'}>
            <p className="line-clamp-2" style={{ fontSize:'0.79rem', color:'#374151', marginBottom:3, lineHeight:1.5 }}>{p.title}</p>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.69rem' }}>
              <span style={{ color:'#6b7280' }}>{p.author}</span>
              <span style={{ color:'#10b981', fontWeight:600 }}>{p.views} views</span>
            </div>
          </div>
        ))}
      </div>

      {/* Contributors */}
      <div className="dark-card" style={{ padding:16 }}>
        <SectionTitle icon={<Ic.Users/>} label="Top Contributors" onMore={onOpenContributors}/>
        {contributors.map((u,i) => {
          const followed = followedUsers.has(u.name);
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ position:'relative' }}>
                  <Avatar initials={u.name[0]} size={34}/>
                  {u.online && <span style={{ position:'absolute', bottom:0, right:0, width:8, height:8, background:'#10b981', borderRadius:'50%', border:'2px solid #fff', animation:'pulse-dot 2s ease infinite' }}/>}
                </div>
                <div>
                  <p style={{ fontWeight:600, fontSize:'0.79rem', color:'#111827' }}>{u.name}</p>
                  <p style={{ fontSize:'0.67rem', color:'#6b7280' }}>{u.flag} {u.country} · <span style={{ color:'#10b981', fontWeight:600 }}>{u.pts} pts</span></p>
                </div>
              </div>
              <button onClick={() => onToggleFollow(u.name)}
                style={{ padding:'4px 12px', borderRadius:8, fontSize:'0.7rem', fontWeight:700, cursor:'pointer', transition:'all .15s', border:`1px solid ${followed?'rgba(16,185,129,.35)':'rgba(16,185,129,.5)'}`, background:followed?'rgba(16,185,129,.1)':'#10b981', color:followed?'#10b981':'#fff', fontFamily:'inherit' }}>
                {followed ? '✓ Following' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Find People */}
      <div className="dark-card" style={{ padding:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:12 }}>
          <Ic.UserPlus/><span style={{ color:'#111827', fontWeight:700, fontSize:'0.86rem' }}>Find People</span>
        </div>
        <input type="text" placeholder="Search users…"
          style={{ width:'100%', padding:'8px 12px', background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.1)', borderRadius:10, color:'#111827', fontSize:'0.79rem', outline:'none', marginBottom:10, fontFamily:'inherit' }}/>
        <p style={{ fontSize:'0.69rem', color:'#6b7280', marginBottom:8 }}>Suggested Connections</p>
        {suggested.map((name,i) => {
          const followed = followedUsers.has(name);
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'5px 0' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Avatar initials={name[0]} size={28}/>
                <span style={{ fontSize:'0.79rem', color:'#111827' }}>{name}</span>
              </div>
              <button onClick={() => { onToggleFollow(name); onSeeAllFollowing(); }}
                style={{ width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', padding:0, background:followed?'rgba(16,185,129,.1)':'#10b981', border:followed?'1px solid rgba(16,185,129,.3)':'none', cursor:'pointer', color:followed?'#10b981':'#fff', fontSize:'0.75rem', fontWeight:700 }}>
                {followed ? '✓' : '+'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Events */}
      <div className="dark-card" style={{ padding:16 }}>
        <SectionTitle icon={<Ic.Cal/>} label="Upcoming Events" onMore={onOpenEvents}/>
        {events.map((ev,i) => (
          <div key={i}
            style={{ padding:12, border:'1px solid rgba(0,0,0,0.08)', borderRadius:12, marginBottom:8, transition:'border-color 0.15s' }}
            onMouseOver={e => e.currentTarget.style.borderColor='rgba(16,185,129,0.4)'}
            onMouseOut={e => e.currentTarget.style.borderColor='rgba(0,0,0,0.08)'}>
            <span style={{ display:'inline-block', padding:'2px 9px', background:'rgba(16,185,129,0.12)', color:'#10b981', fontSize:'0.67rem', borderRadius:20, marginBottom:6, fontWeight:700 }}>{ev.type}</span>
            <p style={{ fontWeight:700, fontSize:'0.79rem', marginBottom:2, color:'#111827' }}>{ev.title}</p>
            <p style={{ fontSize:'0.69rem', color:'#6b7280', marginBottom:8 }}>{ev.date} · {ev.time}</p>
            <button className="accent-btn" style={{ width:'100%', padding:'7px', borderRadius:8, fontSize:'0.76rem' }}>Register</button>
          </div>
        ))}
        <button
          onClick={onOpenEvents}
          style={{ width:'100%', padding:'8px', borderRadius:10, fontSize:'0.76rem', fontWeight:600, cursor:'pointer', background:'rgba(16,185,129,0.07)', border:'1px solid rgba(16,185,129,0.2)', color:'#10b981', fontFamily:'inherit', marginTop:2 }}>
          View all {ALL_EVENTS.length} events →
        </button>
      </div>

      {/* Guidelines */}
      <div className="dark-card" style={{ padding:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:12 }}>
          <Ic.Shield/><span style={{ color:'#111827', fontWeight:700, fontSize:'0.86rem' }}>Community Guidelines</span>
        </div>
        <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
          {FULL_GUIDELINES.slice(0,3).map((g,i) => (
            <li key={i} style={{ display:'flex', gap:7, fontSize:'0.79rem', color:'#6b7280' }}>
              <span style={{ color:'#10b981', marginTop:1 }}>›</span><span>{g.title}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onOpenGuidelines}
          style={{ marginTop:12, background:'none', border:'none', cursor:'pointer', fontSize:'0.74rem', color:'#10b981', fontFamily:'inherit', fontWeight:600, padding:0 }}>
          Read Full Guidelines ({FULL_GUIDELINES.length} rules) →
        </button>
      </div>

    </div>
  );
}

// ── Create Post Modal ─────────────────────────────────────────────────────────
function CreatePostModal({ isOpen, onClose }) {
  const [content, setContent]   = useState('');
  const [country, setCountry]   = useState('');
  const [tags, setTags]         = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [posting, setPosting]   = useState(false);
  const [imgSrc, setImgSrc]     = useState(null);

  const countries = [
    {name:'United States',flag:'🇺🇸'},{name:'United Kingdom',flag:'🇬🇧'},
    {name:'Canada',flag:'🇨🇦'},{name:'Germany',flag:'🇩🇪'},{name:'Australia',flag:'🇦🇺'},
  ];

  const uploadImg = e => {
    const f = e.target.files?.[0];
    if (f) { const r = new FileReader(); r.onloadend = () => setImgSrc(r.result); r.readAsDataURL(f); }
  };

  const addTag = e => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const publish = async () => {
    if (!content.trim()) return;
    setPosting(true);
    await new Promise(r => setTimeout(r, 1400));
    setPosting(false); setContent(''); setImgSrc(null); setTags([]); setCountry(''); onClose();
  };

  if (!isOpen) return null;

  const inputStyle = {
    width:'100%', padding:'9px 13px',
    background:'rgba(0,0,0,0.05)',
    border:'1px solid rgba(0,0,0,0.1)',
    borderRadius:12, color:'#111827',
    fontFamily:'inherit', fontSize:'0.85rem', outline:'none', transition:'border-color 0.18s',
  };
  const labelStyle = { display:'flex', alignItems:'center', gap:6, fontSize:'0.74rem', color:'#6b7280', marginBottom:6 };

  return (
    <div style={OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="dark-card modal-in" style={{ width:'100%', maxWidth:540, maxHeight:'90vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'15px 20px', borderBottom:'1px solid rgba(0,0,0,0.07)', flexShrink:0 }}>
          <h2 style={{ fontWeight:700, fontSize:'0.95rem', color:'#111827' }}>Create Post</h2>
          <button onClick={onClose} className="icon-btn" style={{ width:30, height:30, borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', color:'#64748b' }}>
            <Ic.X />
          </button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:14 }}>
            <Avatar initials="JD" />
            <p style={{ fontWeight:700, fontSize:'0.87rem', color:'#111827' }}>John Doe</p>
          </div>

          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="What's on your mind? Share your study abroad experience, tips, or questions…"
            autoFocus
            style={{ width:'100%', minHeight:160, background:'transparent', border:'none', color:'#111827', fontFamily:'inherit', fontSize:'0.92rem', resize:'none', outline:'none', lineHeight:1.75, marginBottom:12 }}
          />

          {imgSrc && (
            <div style={{ position:'relative', borderRadius:12, overflow:'hidden', marginBottom:12, border:'1px solid rgba(0,0,0,0.1)' }}>
              <img src={imgSrc} alt="" style={{ width:'100%', display:'block' }} />
              <button onClick={() => setImgSrc(null)}
                style={{ position:'absolute', top:8, right:8, width:28, height:28, background:'rgba(0,0,0,0.65)', border:'none', borderRadius:'50%', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Ic.X />
              </button>
            </div>
          )}

          <div style={{ marginBottom:14 }}>
            <div style={labelStyle}><Ic.Pin/> Country Tag (optional)</div>
            <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inputStyle, cursor:'pointer', appearance:'none' }}>
              <option value="" style={{ background:'#fff', color:'#6b7280' }}>Select a country…</option>
              {countries.map(c => <option key={c.name} value={c.name} style={{ background:'#fff', color:'#111827' }}>{c.flag} {c.name}</option>)}
            </select>
          </div>

          <div style={{ marginBottom:4 }}>
            <div style={labelStyle}><Ic.Hash/> Add Tags</div>
            {tags.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
                {tags.map(tag => (
                  <span key={tag} className="tag-pill">
                    #{tag}
                    <button onClick={() => setTags(tags.filter(t => t !== tag))}
                      style={{ background:'none', border:'none', color:'inherit', cursor:'pointer', padding:0, lineHeight:1, fontSize:'0.9rem' }}>×</button>
                  </span>
                ))}
              </div>
            )}
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
              placeholder="Type a tag and press Enter…" style={inputStyle}/>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(0,0,0,0.07)', padding:'12px 20px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', gap:6 }}>
              <label className="icon-btn" style={{ width:32, height:32, borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', cursor:'pointer', color:'#64748b' }}>
                <input type="file" accept="image/*" onChange={uploadImg} style={{ display:'none' }}/>
                <Ic.Image/>
              </label>
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <span style={{ fontSize:'0.7rem', color:'#6b7280', fontFamily:'DM Mono, monospace' }}>{content.length} chars</span>
              <button onClick={onClose}
                style={{ padding:'8px 16px', borderRadius:12, fontWeight:600, fontSize:'0.84rem', background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.12)', color:'#6b7280', cursor:'pointer', fontFamily:'inherit' }}>
                Cancel
              </button>
              <button onClick={publish} disabled={posting || !content.trim()} className="accent-btn"
                style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 20px', borderRadius:12, fontSize:'0.84rem' }}>
                {posting
                  ? <><span className="spin" style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.35)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block' }}/> Publishing…</>
                  : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Sidebar Navigation ──────────────────────────────────────────────
function DashboardSidebar({ sidebarCollapsed, setSidebarCollapsed, activeNav, setActiveNav, handleNavigation, primaryNavItems, secondaryNavItems }) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        bottom: '20px',
        width: sidebarCollapsed ? '68px' : '260px',
        background: '#0a0f1e',
        borderRadius: '16px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease-out',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setSidebarCollapsed(false)}
      onMouseLeave={() => setSidebarCollapsed(true)}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', height: '72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/src/images/logo.png" alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '10px' }} />
          {!sidebarCollapsed && <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '17px', whiteSpace: 'nowrap' }}>Ovijan</span>}
        </div>
      </div>

      {/* Primary Navigation */}
      <div style={{ padding: '8px 12px', flex: 1, overflowY: 'auto' }}>
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item)}
              whileHover={{ scale: 1.02 }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '40px',
                padding: '0 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '4px',
                color: isActive ? '#10b981' : 'rgba(255,255,255,0.6)',
                fontSize: '13px',
                fontWeight: isActive ? '500' : '400',
                position: 'relative',
              }}
            >
              {isActive && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', background: '#10b981', borderRadius: '0 3px 3px 0' }} />}
              <Icon size={18} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </motion.button>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 16px' }} />

      {/* Secondary Navigation */}
      <div style={{ padding: '12px', flexShrink: 0 }}>
        {!sidebarCollapsed && (
          <div style={{ padding: '0 12px 8px 12px' }}>
            <span style={{ fontSize: '11px', fontWeight: '500', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Account</span>
          </div>
        )}
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isLogout = item.id === 'logout';
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item)}
              whileHover={{ scale: 1.02 }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '40px',
                padding: '0 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '4px',
                color: isLogout ? '#ef4444' : 'rgba(255,255,255,0.5)',
                fontSize: '13px',
              }}
            >
              <Icon size={18} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 6;

export default function App() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeNav, setActiveNav] = useState('community');
  const [modal, setModal]              = useState(false);
  const [feedTab, setFeedTab]          = useState('For You');
  const [joinedCountries, setJoined]   = useState(new Set());
  const [followedUsers, setFollowed]   = useState(new Set());
  const [viewAllCountries, setViewAll] = useState(false);
  const [visibleCount, setVisibleCount]= useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore]  = useState(false);
  const [eventsOpen, setEventsOpen]    = useState(false);
  const [guidelinesOpen, setGuidelines]= useState(false);
  const [contributorsOpen, setContributors] = useState(false);
  const [countries, setCountries] = useState([]);

  // Navigation items matching dashboard
  // Navigation items with dynamic countries from database
    const primaryNavItems = [
      { 
        id: 'dashboard', 
        icon: LayoutDashboard, 
        label: 'Dream Destinations', 
        path: '/dashboard',
        hasSubmenu: true,
        submenuItems: countries.map(country => ({
          id: `country-${country.id}`,
          label: country.name,
          path: '/universities',
          state: { countryName: country.name, countryId: country.id },
          flag: country.flag || '🌍',
          icon: Globe
        }))
      },
      { id: 'all-universities', icon: Building, label: 'Universities', path: '/all-universities' },
      { id: 'calendar', icon: Calendar, label: 'Calendar', path: '/calendar' },
      { id: 'community', icon: Users, label: 'Community', path: '/community' },
      { id: 'bookmarks', icon: Bookmark, label: 'Saved', path: '/bookmarks' },
      { id: 'visa', icon: Shield, label: 'Visa Tracker', path: '/visatracker' },
      { id: 'visaguide', icon: FileText, label: 'Visa Application', path: '/visaguide' },
    ];
  
    const secondaryNavItems = [
      { id: 'profile', icon: UserCircle, label: 'Profile', path: '/profile' },
      { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
      { id: 'logout', icon: LogOut, label: 'Logout', action: () => { localStorage.clear(); navigate('/login'); } },
    ];

  const handleNavigation = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      setActiveNav(item.id);
      navigate(item.path);
    }
  };

  const handleJoin = name => setJoined(prev => new Set([...prev, name]));
  const handleToggleFollow = name => {
    setFollowed(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const allFollowing = new Set([...DEFAULT_FOLLOWING, ...followedUsers]);

  const getAllFeedPosts = () => {
    switch (feedTab) {
      case 'Trending':  return [...POSTS_DATA].filter(p => p.trending).sort((a,b) => b.likes - a.likes);
      case 'New':       return [...POSTS_DATA].sort((a,b) => a.id - b.id);
      case 'Following': return POSTS_DATA.filter(p => allFollowing.has(p.author.name));
      default:          return POSTS_DATA;
    }
  };

  const allFeedPosts  = getAllFeedPosts();
  const feedPosts     = allFeedPosts.slice(0, visibleCount);
  const hasMore       = visibleCount < allFeedPosts.length;

  // Reset visible count when tab changes
  const handleTabChange = tab => { setFeedTab(tab); setVisibleCount(PAGE_SIZE); };

  const loadMore = async () => {
    setLoadingMore(true);
    await new Promise(r => setTimeout(r, 900));
    setVisibleCount(prev => prev + PAGE_SIZE);
    setLoadingMore(false);
  };

  return (
    <>
      <div className="app-root" style={{ minHeight:'100vh', background: '#f0f2f5' }}>
        {/* Dashboard Sidebar */}
        <DashboardSidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          handleNavigation={handleNavigation}
          primaryNavItems={primaryNavItems}
          secondaryNavItems={secondaryNavItems}
        />

        {/* Main Content with margin for sidebar */}
        <div style={{ marginLeft: sidebarCollapsed ? '100px' : '288px', transition: 'margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)', minHeight: '100vh', padding: '28px 20px 60px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

              {/* ── Main column ── */}
              <div style={{ minWidth: 0 }}>
                <CountryCarousel
                  joinedCountries={joinedCountries}
                  onJoin={handleJoin}
                  onViewAll={() => setViewAll(p => !p)}
                  viewAll={viewAllCountries}
                />
                <InlineCreatePost onOpen={() => setModal(true)} />
                <FeedTabs active={feedTab} setActive={handleTabChange} />

                {feedTab === 'Trending' && <TrendingBanner trendingCount={POSTS_DATA.filter(p=>p.trending).length} />}
                {feedTab === 'New'      && <NewBanner count={allFeedPosts.length} onBack={() => handleTabChange('For You')} />}
                {feedTab === 'Following' && (
                  <FollowingBanner
                    followingCount={allFollowing.size}
                    followingNames={[...allFollowing]}
                    postCount={feedPosts.length}
                  />
                )}

                {feedPosts.length > 0
                  ? feedPosts.map((p,i) => (
                      <PostCard
                        key={p.id}
                        post={p}
                        delay={i * 60}
                        isFollowing={followedUsers.has(p.author.name)}
                        onToggleFollow={handleToggleFollow}
                      />
                    ))
                  : (
                    <div className="dark-card" style={{ padding:40, textAlign:'center' }}>
                      <p style={{ color:'#6b7280', fontSize:'0.9rem', marginBottom:16 }}>No posts from people you follow yet.</p>
                      <button onClick={() => handleTabChange('For You')} className="accent-btn" style={{ padding:'10px 24px', borderRadius:12, fontSize:'0.85rem' }}>
                        Discover People
                      </button>
                    </div>
                  )
                }

                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:16, gap:10 }}>
                  {hasMore ? (
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="ghost-btn"
                      style={{ padding:'10px 32px', borderRadius:12, fontWeight:600, fontSize:'0.84rem', display:'flex', alignItems:'center', gap:8 }}>
                      {loadingMore
                        ? <><span className="spin" style={{ width:13, height:13, border:'2px solid rgba(148,163,184,0.3)', borderTopColor:'#94a3b8', borderRadius:'50%', display:'inline-block' }}/> Loading…</>
                        : `Load More Posts (${allFeedPosts.length - visibleCount} remaining)`}
                    </button>
                  ) : allFeedPosts.length > 0 ? (
                    <p style={{ color:'#6b7280', fontSize:'0.78rem', fontWeight:600 }}>✓ You're all caught up</p>
                  ) : null}
                </div>
              </div>

              {/* ── Sidebar ── */}
              <div style={{ position:'sticky', top:20, maxHeight:'calc(100vh - 40px)', overflowY:'auto' }} className="scrollbar-hide">
                <Sidebar
                  followedUsers={followedUsers}
                  onToggleFollow={handleToggleFollow}
                  onSeeAllTrending={() => handleTabChange('Trending')}
                  onSeeAllFollowing={() => handleTabChange('Following')}
                  onOpenEvents={() => setEventsOpen(true)}
                  onOpenGuidelines={() => setGuidelines(true)}
                  onOpenContributors={() => setContributors(true)}
                />
              </div>
            </div>
          </div>
        </div>

        <CreatePostModal isOpen={modal} onClose={() => setModal(false)} />
        {eventsOpen      && <EventsModal onClose={() => setEventsOpen(false)} />}
        {guidelinesOpen  && <GuidelinesModal onClose={() => setGuidelines(false)} />}
        {contributorsOpen && (
          <ContributorsModal
            followedUsers={followedUsers}
            onToggleFollow={handleToggleFollow}
            onClose={() => setContributors(false)}
          />
        )}
      </div>
    </>
  );
}