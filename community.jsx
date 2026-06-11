import { useState, useEffect, useRef } from 'react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-primary: #060d18;
    --bg-secondary: #0b1628;
    --bg-card: rgba(11, 22, 40, 0.75);
    --accent-green: #00d97e;
    --accent-green-dim: rgba(0, 217, 126, 0.15);
    --accent-green-glow: rgba(0, 217, 126, 0.08);
    --accent-teal: #00b4d8;
    --accent-teal-dim: rgba(0, 180, 216, 0.12);
    --text-primary: #e8f0fe;
    --text-secondary: #6b8caf;
    --text-muted: #3d5a7a;
    --glass-border: rgba(0, 217, 126, 0.12);
    --glass-border-hover: rgba(0, 217, 126, 0.3);
    --grid-color: rgba(0, 217, 126, 0.06);
  }

  body {
    font-family: 'Sora', sans-serif;
    background: var(--bg-primary);
    min-height: 100vh;
    color: var(--text-primary);
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,217,126,0.2); border-radius: 4px; }

  .glass-card {
    background: var(--bg-card);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: 14px;
  }

  .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }

  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; }

  @keyframes globe-spin { to { transform: rotate(360deg); } }
  .globe-spin { animation: globe-spin 24s linear infinite; }

  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.96) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal-in { animation: modalIn 0.22s cubic-bezier(0.22,1,0.36,1) both; }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.8); }
  }

  .accent-btn {
    background: var(--accent-green);
    color: #050d18;
    font-weight: 700;
    border: none;
    cursor: pointer;
    font-family: inherit;
    transition: filter 0.2s, transform 0.15s;
  }
  .accent-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .accent-btn:active { transform: scale(0.97); }

  .tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    background: var(--accent-green-dim);
    color: var(--accent-green);
    font-size: 0.72rem;
    border-radius: 20px;
    border: 1px solid rgba(0,217,126,0.2);
    font-weight: 600;
  }

  #bg-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .app-root { position: relative; z-index: 1; }
`;

function injectStyles() {
  if (document.getElementById('ov-styles')) return;
  const s = document.createElement('style');
  s.id = 'ov-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}
injectStyles();

// ─── ANIMATED GRID + PARTICLE BACKGROUND ─────────────────────────────────────
function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, animId;
    let dots = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initDots();
    };

    const initDots = () => {
      dots = [];
      const count = Math.floor((W * H) / 14000);
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const GRID = 80;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(0,217,126,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0,217,126,0.12)';
      for (let x = GRID; x < W; x += GRID) {
        for (let y = GRID; y < H; y += GRID) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,217,126,${d.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,217,126,${0.07 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      const grad = ctx.createRadialGradient(W * 0.85, H * 0.18, 0, W * 0.85, H * 0.18, W * 0.45);
      grad.addColorStop(0, 'rgba(0,217,126,0.04)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Plus: () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Heart: ({ filled }) => (
    <svg width="17" height="17" fill={filled ? '#00d97e' : 'none'} viewBox="0 0 24 24" stroke={filled ? '#00d97e' : 'currentColor'} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  MessageCircle: () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Share2: () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  BookmarkOutline: ({ filled }) => (
    <svg width="17" height="17" fill={filled ? 'var(--accent-green)' : 'none'} viewBox="0 0 24 24" stroke={filled ? 'var(--accent-green)' : 'currentColor'} strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  MoreVertical: () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
    </svg>
  ),
  Flag: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Bookmark: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Globe: () => (
    <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="var(--accent-green)" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--accent-green)" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--accent-green)" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--accent-green)" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--accent-green)" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  UserPlus: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <line x1="20" y1="8" x2="20" y2="14"/>
      <line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  ),
  Image: () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  Hash: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--accent-green)" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  PenSquare: () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
};

const AvatarGrad = ({ initials, size = 44, fontSize = '0.82rem' }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #00d97e 0%, #00b4d8 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#050d18', fontWeight: 700, fontSize,
  }}>{initials}</div>
);

const MOCK_POSTS = [
  { id: 1, author: { name: 'Sarah Johnson', avatar: 'SJ', country: 'United Kingdom', flag: '🇬🇧' }, timestamp: '2 hours ago', content: 'Just received my acceptance letter from Oxford University! 🎉 The journey was tough but so worth it. Happy to answer any questions about the application process for UK universities.', image: '../src/images/usa.jpeg', likes: 342, comments: 56, shares: 28, tags: ['Oxford', 'UKStudy', 'AcceptanceLetter'] },
  { id: 2, author: { name: 'Alex Chen', avatar: 'AC', country: 'Canada', flag: '🇨🇦' }, timestamp: '5 hours ago', content: 'Complete guide to Canadian study permits: Everything you need to know about the application process, required documents, and timeline. Took me 6 weeks to get mine approved!', likes: 289, comments: 42, shares: 67, tags: ['Canada', 'StudyPermit', 'VisaGuide'] },
  { id: 3, author: { name: 'Maria Garcia', avatar: 'MG', country: 'Spain', flag: '🇪🇸' }, timestamp: '8 hours ago', content: 'Sharing my experience with the DAAD scholarship for Germany. Application tips, interview process, and what they really look for in candidates. Feel free to ask anything!', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=500&fit=crop', likes: 456, comments: 89, shares: 123, tags: ['Germany', 'DAAD', 'Scholarship'] },
  { id: 4, author: { name: 'David Kim', avatar: 'DK', country: 'USA', flag: '🇺🇸' }, timestamp: '12 hours ago', content: "Top 5 mistakes international students make when applying to US universities. Learn from my mistakes so you don't have to make them yourself! 📚", likes: 512, comments: 78, shares: 94, tags: ['USA', 'ApplicationTips', 'InternationalStudents'] },
];

const COUNTRIES = [
  { name: 'United States', flag: '🇺🇸', members: '125K', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop' },
  { name: 'United Kingdom', flag: '🇬🇧', members: '98K',  image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
  { name: 'Canada',         flag: '🇨🇦', members: '87K',  image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&h=300&fit=crop' },
  { name: 'Germany',        flag: '🇩🇪', members: '76K',  image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop' },
  { name: 'Australia',      flag: '🇦🇺', members: '92K',  image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=300&fit=crop' },
  { name: 'France',         flag: '🇫🇷', members: '64K',  image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
  { name: 'Netherlands',    flag: '🇳🇱', members: '52K',  image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop' },
  { name: 'Japan',          flag: '🇯🇵', members: '71K',  image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&h=300&fit=crop' },
];

// ─── JOIN MODAL ───────────────────────────────────────────────────────────────
function JoinModal({ country, onClose, onConfirm }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false); setSent(true);
    setTimeout(() => { onConfirm(country.name); onClose(); }, 1600);
  };

  return (
    <div onClick={e => { if (e.target === e.currentTarget && !sending && !sent) onClose(); }} style={{
      position: 'fixed', inset: 0, background: 'rgba(6,13,24,0.85)',
      backdropFilter: 'blur(10px)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div className="glass-card modal-in" style={{ width: '100%', maxWidth: 460, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(0,217,126,0.2)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '1px solid rgba(0,217,126,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.6rem' }}>{country.flag}</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Join {country.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{country.members} members · Open community</p>
            </div>
          </div>
          {!sent && (
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(0,217,126,0.15)', background: 'rgba(0,217,126,0.06)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon.X />
            </button>
          )}
        </div>

        {sent ? (
          <div style={{ padding: '40px 22px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,217,126,0.12)', border: '1px solid rgba(0,217,126,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon.Check />
            </div>
            <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 6 }}>Request Sent!</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your join request for the {country.name} community has been submitted.</p>
          </div>
        ) : (
          <div style={{ padding: '20px 22px' }}>
            <div style={{ padding: 14, borderRadius: 12, background: 'rgba(0,217,126,0.06)', border: '1px solid rgba(0,217,126,0.15)', marginBottom: 18 }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--accent-green)', lineHeight: 1.6 }}>
                📌 Joining sends a request to the community moderators. Most communities approve within 24 hours.
              </p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Introduce yourself (optional)</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={`Tell the ${country.name} community about yourself...`} style={{ width: '100%', minHeight: 100, padding: '10px 13px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,217,126,0.15)', borderRadius: 12, color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'none', outline: 'none', lineHeight: 1.6 }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'var(--text-secondary)', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSend} disabled={sending} className="accent-btn" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', borderRadius: 12, opacity: sending ? 0.7 : 1 }}>
                {sending ? (<><span className="spin" style={{ width: 14, height: 14, border: '2px solid rgba(5,13,24,0.3)', borderTopColor: '#050d18', borderRadius: '50%', display: 'inline-block' }} /> Sending...</>) : 'Send Join Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COUNTRY CAROUSEL ─────────────────────────────────────────────────────────
function CountryCarousel() {
  const [joinTarget, setJoinTarget] = useState(null);
  const [joinedSet, setJoinedSet]   = useState(new Set());

  const scroll = dir => {
    const el = document.getElementById('country-carousel');
    if (el) el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Explore Communities</h2>
          <button style={{ background: 'none', border: 'none', color: 'var(--accent-green)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>View All →</button>
        </div>
        <div style={{ position: 'relative' }}
          onMouseOver={e => e.currentTarget.querySelectorAll('.carr-arrow').forEach(b => b.style.opacity = '1')}
          onMouseOut={e => e.currentTarget.querySelectorAll('.carr-arrow').forEach(b => b.style.opacity = '0')}
        >
          <button className="carr-arrow" onClick={() => scroll('left')} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid rgba(0,217,126,0.2)', color: 'var(--accent-green)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}><Icon.ChevronLeft /></button>

          <div id="country-carousel" className="scrollbar-hide" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {COUNTRIES.map((c, i) => {
              const joined = joinedSet.has(c.name);
              return (
                <div key={i} style={{ flexShrink: 0, width: 220, height: 140, borderRadius: 14, overflow: 'hidden', position: 'relative', cursor: 'pointer', transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)', border: '1px solid rgba(0,217,126,0.1)' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04) translateY(-4px)'; e.currentTarget.querySelector('.join-btn').style.opacity = '1'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.querySelector('.join-btn').style.opacity = '0'; }}
                >
                  <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,13,24,0.92) 0%, rgba(6,13,24,0.25) 55%, transparent)' }} />
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <button className="join-btn" onClick={e => { e.stopPropagation(); if (!joined) setJoinTarget(c); }}
                      style={{ padding: '3px 12px', background: joined ? 'rgba(0,217,126,0.9)' : 'var(--accent-green)', border: 'none', borderRadius: 8, color: '#050d18', fontSize: '0.72rem', fontWeight: 700, cursor: joined ? 'default' : 'pointer', opacity: joined ? 1 : 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
                      {joined ? '✓ Joined' : 'Join'}
                    </button>
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
                    <div style={{ fontSize: '1.7rem' }}>{c.flag}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>{c.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(0,217,126,0.8)' }}>👥 {c.members} members</div>
                  </div>
                </div>
              );
            })}
            <div style={{ flexShrink: 0, width: 220, height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 14, cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s', background: 'rgba(0,217,126,0.03)', border: '1px dashed rgba(0,217,126,0.2)' }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,217,126,0.07)'; e.currentTarget.style.borderColor = 'rgba(0,217,126,0.4)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,217,126,0.03)'; e.currentTarget.style.borderColor = 'rgba(0,217,126,0.2)'; }}
            >
              <div className="globe-spin"><Icon.Globe /></div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>View All Countries</span>
            </div>
          </div>

          <button className="carr-arrow" onClick={() => scroll('right')} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid rgba(0,217,126,0.2)', color: 'var(--accent-green)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}><Icon.ChevronRight /></button>
        </div>
      </div>
      {joinTarget && <JoinModal country={joinTarget} onClose={() => setJoinTarget(null)} onConfirm={name => setJoinedSet(prev => new Set([...prev, name]))} />}
    </>
  );
}

// ─── FEED TABS ────────────────────────────────────────────────────────────────
function FeedTabs() {
  const [active, setActive] = useState('For You');
  const tabs = ['For You', 'Trending', 'New', 'Following'];

  return (
    <div className="glass-card" style={{ display: 'flex', gap: 4, padding: 5, marginBottom: 16 }}>
      {tabs.map(name => {
        const isActive = active === name;
        return (
          <button key={name} onClick={() => setActive(name)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '8px 6px', borderRadius: 10,
            border: isActive ? '1px solid rgba(0,217,126,0.35)' : '1px solid transparent',
            background: isActive ? 'rgba(0,217,126,0.12)' : 'transparent',
            color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
            transition: 'all 0.18s',
          }}>{name}</button>
        );
      })}
    </div>
  );
}

// ─── INLINE CREATE POST ───────────────────────────────────────────────────────
function InlineCreatePost({ onOpenModal }) {
  return (
    <div className="glass-card" style={{ padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <AvatarGrad initials="JD" />
        <button onClick={onOpenModal} style={{ flex: 1, textAlign: 'left', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,217,126,0.1)', borderRadius: 24, color: 'var(--text-muted)', fontFamily: 'inherit', fontSize: '0.875rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(0,217,126,0.3)'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(0,217,126,0.1)'}
        >What's on your mind? Share your experience...</button>
        <button onClick={onOpenModal} className="accent-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 12, fontSize: '0.82rem', flexShrink: 0 }}>
          <Icon.PenSquare /><span>Post</span>
        </button>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,217,126,0.07)' }}>
        {[{ icon: <Icon.Image />, label: 'Photo' }, { icon: <Icon.Hash />, label: 'Tag' }, { icon: <Icon.MapPin />, label: 'Location' }].map((item, i) => (
          <button key={i} onClick={onOpenModal} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'transparent', border: 'none', borderRadius: 10, color: 'var(--text-secondary)', fontFamily: 'inherit', fontSize: '0.78rem', cursor: 'pointer', transition: 'color 0.18s, background 0.18s' }}
            onMouseOver={e => { e.currentTarget.style.color = 'var(--accent-green)'; e.currentTarget.style.background = 'rgba(0,217,126,0.06)'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
          >{item.icon} {item.label}</button>
        ))}
      </div>
    </div>
  );
}

// ─── POST CARD ────────────────────────────────────────────────────────────────
function PostCard({ post }) {
  const [liked, setLiked]               = useState(false);
  const [bookmarked, setBookmarked]     = useState(false);
  const [likesCount, setLikesCount]     = useState(post.likes);
  const [showMenu, setShowMenu]         = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [toastMsg, setToastMsg]         = useState('');

  const toast = msg => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500); };

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };
  const handleBookmark = () => { setBookmarked(p => !p); toast(bookmarked ? 'Removed from saved' : 'Post saved!'); };
  const handleShare = () => toast('Link copied to clipboard!');

  return (
    <div className="glass-card fade-up" style={{ padding: 20, marginBottom: 12, transition: 'border-color 0.2s', position: 'relative' }}
      onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(0,217,126,0.25)'}
      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
    >
      {toastMsg && (
        <div style={{ position: 'absolute', top: 14, right: 14, background: 'var(--bg-secondary)', border: '1px solid rgba(0,217,126,0.25)', padding: '6px 14px', borderRadius: 10, fontSize: '0.78rem', zIndex: 5, color: 'var(--accent-green)' }}>{toastMsg}</div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AvatarGrad initials={post.author.avatar} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{post.author.name}</span>
              <span className="tag-pill">{post.author.flag} {post.author.country}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.timestamp}</span>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.MoreVertical /></button>
          {showMenu && (
            <div className="glass-card" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 6, width: 175, padding: 6, zIndex: 10, border: '1px solid rgba(0,217,126,0.15)' }}>
              {[{ icon: Icon.Bookmark, label: 'Save Post' }, { icon: Icon.Copy, label: 'Copy Link' }, { icon: Icon.Eye, label: 'Hide' }, { icon: Icon.Flag, label: 'Report', danger: true }].map((item, i) => (
                <button key={i} onClick={() => setShowMenu(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent', color: item.danger ? '#ef4444' : 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.8rem', cursor: 'pointer' }}><item.icon /> {item.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: 10, fontSize: '0.88rem', opacity: 0.9 }}>{post.content}</p>

      {post.tags && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {post.tags.map((tag, i) => (
            <span key={i} style={{ color: 'var(--accent-green)', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.85 }}>#{tag}</span>
          ))}
        </div>
      )}

      {post.image && (
        <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 12, border: '1px solid rgba(0,217,126,0.08)' }}>
          <img src={post.image} alt="post" style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} loading="lazy" />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(0,217,126,0.07)' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { onClick: handleLike, icon: <Icon.Heart filled={liked} />, label: likesCount, active: liked, color: '#00d97e' },
            { onClick: () => setShowComments(!showComments), icon: <Icon.MessageCircle />, label: post.comments },
            { onClick: handleShare, icon: <Icon.Share2 />, label: post.shares },
          ].map((btn, i) => (
            <button key={i} onClick={btn.onClick} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: btn.active ? btn.color : 'var(--text-secondary)', fontFamily: 'inherit', fontSize: '0.8rem', transition: 'color 0.18s' }}
              onMouseOver={e => !btn.active && (e.currentTarget.style.color = 'var(--accent-green)')}
              onMouseOut={e => !btn.active && (e.currentTarget.style.color = 'var(--text-secondary)')}
            >{btn.icon} {btn.label}</button>
          ))}
        </div>
        <button onClick={handleBookmark} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: bookmarked ? 'var(--accent-green)' : 'var(--text-secondary)', transition: 'color 0.18s' }}>
          <Icon.BookmarkOutline filled={bookmarked} />
        </button>
      </div>

      {showComments && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(0,217,126,0.07)' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <AvatarGrad initials="U" size={32} fontSize="0.7rem" />
              <div style={{ flex: 1, background: 'rgba(0,217,126,0.04)', borderRadius: 12, padding: '9px 13px', border: '1px solid rgba(0,217,126,0.08)' }}>
                <p style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: 2, color: 'var(--text-primary)' }}>User {i}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Great post! Very helpful information.</p>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <AvatarGrad initials="JD" size={32} fontSize="0.7rem" />
            <input placeholder="Write a comment..." style={{ flex: 1, padding: '8px 13px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,217,126,0.15)', borderRadius: 12, color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.83rem', outline: 'none' }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar() {
  const trendingPosts = [
    { title: 'Top 10 Universities in Germany for Engineering', author: 'Alex Kim',      views: '2.4K' },
    { title: 'Complete Guide to UK Student Visa Process',      author: 'Sarah Johnson', views: '1.8K' },
    { title: 'Scholarship Opportunities in Canada 2026',       author: 'Mike Chen',     views: '1.5K' },
  ];
  const topContributors = [
    { name: 'Emma Wilson',     country: 'UK',     flag: '🇬🇧', points: '12.5K', online: true  },
    { name: 'David Lee',       country: 'Canada', flag: '🇨🇦', points: '10.2K', online: false },
    { name: 'Sofia Rodriguez', country: 'Spain',  flag: '🇪🇸', points: '9.8K',  online: true  },
    { name: 'James Park',      country: 'USA',    flag: '🇺🇸', points: '8.9K',  online: false },
  ];
  const upcomingEvents = [
    { type: 'Webinar',  title: 'Study in Germany Q&A Session', date: 'May 12, 2026', time: '3:00 PM GMT' },
    { type: 'Workshop', title: 'SOP Writing Masterclass',       date: 'May 15, 2026', time: '5:00 PM GMT' },
    { type: 'Session',  title: 'Visa Interview Preparation',    date: 'May 18, 2026', time: '2:00 PM GMT' },
  ];
  const suggested = ['Maya Patel', 'Lucas Schmidt', 'Yuki Tanaka'];

  const cardStyle = { padding: 16, marginBottom: 14 };
  const titleStyle = { display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 14 };
  const linkBtnStyle = { background: 'none', border: 'none', color: 'var(--accent-green)', fontSize: '0.76rem', cursor: 'pointer', fontFamily: 'inherit' };

  return (
    <div>
      <div className="glass-card" style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={titleStyle}><Icon.TrendingUp /> Trending Posts</div>
          <button style={linkBtnStyle}>See All</button>
        </div>
        {trendingPosts.map((post, i) => (
          <div key={i} style={{ padding: '9px 8px', borderRadius: 10, cursor: 'pointer', marginBottom: 2, transition: 'background 0.18s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(0,217,126,0.05)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <p className="line-clamp-2" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.5 }}>{post.title}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>{post.author}</span><span style={{ color: 'var(--accent-green)', opacity: 0.7 }}>{post.views} views</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={cardStyle}>
        <div style={titleStyle}><Icon.Users /> Top Contributors</div>
        {topContributors.map((user, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <AvatarGrad initials={user.name[0]} size={36} fontSize="0.75rem" />
                {user.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, background: 'var(--accent-green)', borderRadius: '50%', border: '2px solid var(--bg-primary)', animation: 'pulse-dot 2s ease infinite' }} />}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{user.name}</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{user.flag} {user.country} · <span style={{ color: 'var(--accent-green)', opacity: 0.8 }}>{user.points} pts</span></p>
              </div>
            </div>
            <button style={{ padding: '3px 10px', background: 'rgba(0,217,126,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(0,217,126,0.2)', borderRadius: 8, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s', fontFamily: 'inherit' }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.color = '#050d18'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,217,126,0.1)'; e.currentTarget.style.color = 'var(--accent-green)'; }}
            >Follow</button>
          </div>
        ))}
      </div>

      <div className="glass-card" style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Icon.UserPlus /><span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Find People</span>
        </div>
        <input type="text" placeholder="Search users..." style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,217,126,0.12)', borderRadius: 10, color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.8rem', outline: 'none', marginBottom: 10 }} />
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 8 }}>Suggested Connections</p>
        {suggested.map((name, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AvatarGrad initials={name[0]} size={30} fontSize="0.68rem" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{name}</span>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(0,217,126,0.2)', background: 'rgba(0,217,126,0.06)', color: 'var(--accent-green)', cursor: 'pointer', transition: 'background 0.18s' }}>
              <Icon.UserPlus />
            </button>
          </div>
        ))}
      </div>

      <div className="glass-card" style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={titleStyle}><Icon.Calendar /> Upcoming Events</div>
          <button style={linkBtnStyle}>View All</button>
        </div>
        {upcomingEvents.map((event, i) => (
          <div key={i} style={{ padding: 12, border: '1px solid rgba(0,217,126,0.1)', borderRadius: 12, marginBottom: 8, transition: 'border-color 0.18s' }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(0,217,126,0.3)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(0,217,126,0.1)'}
          >
            <span style={{ display: 'inline-block', padding: '2px 9px', background: 'var(--accent-green-dim)', color: 'var(--accent-green)', fontSize: '0.68rem', borderRadius: 20, marginBottom: 6, fontWeight: 600 }}>{event.type}</span>
            <p style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: 3, color: 'var(--text-primary)' }}>{event.title}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 8 }}>{event.date} · {event.time}</p>
            <button className="accent-btn" style={{ width: '100%', padding: '7px', borderRadius: 8, fontSize: '0.76rem' }}>Register</button>
          </div>
        ))}
      </div>

      <div className="glass-card" style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Icon.FileText /><span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Community Guidelines</span>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Be respectful and supportive to all members', 'Share accurate and helpful information', 'No spam or self-promotion without permission'].map((rule, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--accent-green)', marginTop: 2 }}>›</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        <button style={{ background: 'none', border: 'none', color: 'var(--accent-green)', fontSize: '0.75rem', cursor: 'pointer', marginTop: 12, fontFamily: 'inherit' }}>Read Full Guidelines →</button>
      </div>
    </div>
  );
}

// ─── CREATE POST MODAL ────────────────────────────────────────────────────────
function CreatePostModal({ isOpen, onClose }) {
  const [content, setContent]             = useState('');
  const [country, setCountry]             = useState('');
  const [tags, setTags]                   = useState([]);
  const [tagInput, setTagInput]           = useState('');
  const [isPosting, setIsPosting]         = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const countries = [
    { name: 'United States', flag: '🇺🇸' }, { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Canada', flag: '🇨🇦' }, { name: 'Germany', flag: '🇩🇪' }, { name: 'Australia', flag: '🇦🇺' },
  ];

  const handleImageUpload = e => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onloadend = () => setSelectedImage(r.result); r.readAsDataURL(file); }
  };

  const handleAddTag = e => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    await new Promise(r => setTimeout(r, 1400));
    setIsPosting(false);
    setContent(''); setSelectedImage(null); setTags([]); setCountry('');
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = { width: '100%', padding: '9px 13px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,217,126,0.15)', borderRadius: 12, color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none' };
  const labelStyle = { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: 6 };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, background: 'rgba(6,13,24,0.88)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="glass-card modal-in" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', borderRadius: 20, border: '1px solid rgba(0,217,126,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(0,217,126,0.1)', position: 'sticky', top: 0, background: 'var(--bg-card)', backdropFilter: 'blur(16px)', borderRadius: '20px 20px 0 0', zIndex: 5 }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>Create Post</h2>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(0,217,126,0.15)', background: 'rgba(0,217,126,0.06)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon.X /></button>
        </div>

        <div style={{ padding: '18px 20px' }}>
          {/* Author row — no privacy selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <AvatarGrad initials="JD" />
            <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>John Doe</p>
          </div>

          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind? Share your study abroad experience, tips, or questions..." autoFocus style={{ width: '100%', minHeight: 175, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.93rem', resize: 'none', outline: 'none', lineHeight: 1.75 }} />

          {selectedImage && (
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 14, border: '1px solid rgba(0,217,126,0.1)' }}>
              <img src={selectedImage} alt="preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <button onClick={() => setSelectedImage(null)} style={{ position: 'absolute', top: 8, right: 8, padding: '4px 7px', background: 'rgba(6,13,24,0.8)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', display: 'flex' }}><Icon.X /></button>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}><Icon.MapPin /> Country Tag (optional)</div>
            <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', color: '#000' }}>
              <option value="">Select a country...</option>
              {countries.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}><Icon.Hash /> Add Tags</div>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {tags.map(tag => (
                  <span key={tag} className="tag-pill">
                    #{tag}
                    <button onClick={() => setTags(tags.filter(t => t !== tag))} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, fontSize: '0.85rem' }}>×</button>
                  </span>
                ))}
              </div>
            )}
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Type a tag and press Enter..." style={inputStyle} />
          </div>

          {/* Bottom toolbar — photo upload only, emoji removed */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(0,217,126,0.07)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <label style={{ cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'rgba(0,217,126,0.06)', border: '1px solid rgba(0,217,126,0.15)', color: 'var(--accent-green)' }}>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <Icon.Image />
              </label>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{content.length} chars</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, padding: '14px 20px', borderTop: '1px solid rgba(0,217,126,0.1)', position: 'sticky', bottom: 0, background: 'var(--bg-card)', backdropFilter: 'blur(16px)', borderRadius: '0 0 20px 20px' }}>
          <button onClick={onClose} style={{ padding: '8px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'var(--text-secondary)', fontFamily: 'inherit', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
          <button onClick={handlePublish} disabled={isPosting || !content.trim()} className="accent-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 12, opacity: isPosting || !content.trim() ? 0.4 : 1, cursor: isPosting || !content.trim() ? 'not-allowed' : 'pointer' }}>
            {isPosting ? (<><span className="spin" style={{ width: 14, height: 14, border: '2px solid rgba(5,13,24,0.3)', borderTopColor: '#050d18', borderRadius: '50%', display: 'inline-block' }} /> Publishing...</>) : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <AnimatedBackground />
      <div className="app-root" style={{ minHeight: '100vh' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto', padding: '30px 16px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 325px', gap: 22 }}>
            <div style={{ minWidth: 0 }}>
              <CountryCarousel />
              <InlineCreatePost onOpenModal={() => setShowCreateModal(true)} />
              <FeedTabs />
              <div>
                {MOCK_POSTS.map(post => <PostCard key={post.id} post={post} />)}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                  <button className="glass-card" style={{ padding: '10px 26px', borderRadius: 12, color: 'var(--accent-green)', background: 'rgba(0,217,126,0.05)', border: '1px solid rgba(0,217,126,0.2)', fontFamily: 'inherit', cursor: 'pointer', fontSize: '0.85rem', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(0,217,126,0.1)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(0,217,126,0.05)'}
                  >Load More Posts</button>
                </div>
              </div>
            </div>
            <div style={{ position: 'sticky', top: 24, alignSelf: 'start', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' }} className="scrollbar-hide">
              <Sidebar />
            </div>
          </div>
        </div>
        <CreatePostModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      </div>
    </>
  );
}