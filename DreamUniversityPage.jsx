// DreamUniversityPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, ArrowLeft, Plus, X, Loader2, Search,
  Award, Shield, Building, CheckCircle, AlertCircle,
  ExternalLink, GraduationCap, Home, Sparkles, LogOut,
  TrendingUp, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DreamUniversityPage = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [dreamUniversity, setDreamUniversity] = useState(null);
  const [dreamResult, setDreamResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [formData, setFormData] = useState({
    education_level: '', cgpa: '', ielts: '', toefl: '',
    gre: '', gmat: '', extracurriculars: [], skills: [], research_papers: []
  });
  const [extracurricularInput, setExtracurricularInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [researchInput, setResearchInput] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.name) setUser(userData);
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/universities');
      const data = await response.json();
      setUniversities(data.data || data || []);
    } catch (e) { console.error(e); }
  };

  const searchUniversities = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = universities.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.location?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const getChanceColor = (p) => {
    if (p >= 80) return '#10b981';
    if (p >= 60) return '#f59e0b';
    if (p >= 40) return '#f97316';
    return '#ef4444';
  };

  const getChanceLabel = (p) => {
    if (p >= 80) return 'Excellent Chance!';
    if (p >= 60) return 'Good Chance';
    if (p >= 40) return 'Moderate Chance';
    return 'Needs Improvement';
  };

  const addItem = (key, value, setter) => {
    if (value.trim()) {
      setFormData(prev => ({ ...prev, [key]: [...prev[key], value.trim()] }));
      setter('');
    }
  };

  const removeItem = (key, idx) => {
    setFormData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dreamUniversity) return alert('Please select a university first');
    setLoading(true);
    try {
      const payload = {
        education_level: formData.education_level,
        cgpa: formData.cgpa,
        exam_scores: { IELTS: formData.ielts, TOEFL: formData.toefl, GRE: formData.gre, GMAT: formData.gmat },
        extracurriculars: formData.extracurriculars,
        skills: formData.skills,
        research_papers: formData.research_papers
      };
      const response = await fetch(`http://127.0.0.1:8000/api/universities/${dreamUniversity.id}/check-chance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setDreamResult(data);
    } catch (e) {
      alert('Error analyzing your chances. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #e9ecef', borderRadius: '12px',
    fontSize: '13.5px', fontFamily: "'Outfit', sans-serif",
    outline: 'none', transition: 'border-color 0.15s', background: '#fafbfc'
  };

  const labelStyle = {
    display: 'block', fontSize: '12.5px', fontWeight: '600',
    color: '#475569', marginBottom: '7px'
  };

  const circumference = 2 * Math.PI * 52;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes dash { from { stroke-dashoffset: var(--full); } to { stroke-dashoffset: var(--target); } }
        input:focus, select:focus { border-color: #f5576c !important; box-shadow: 0 0 0 3px rgba(245,87,108,0.1) !important; }
        .tag { display: flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .uni-result-pill { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
      `}</style>

      {/* ── Sidebar ── */}
      <motion.div
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        style={{
          position: 'fixed', top: '20px', left: '20px', bottom: '20px',
          width: sidebarCollapsed ? '68px' : '240px',
          background: '#0a0f1e', borderRadius: '16px', zIndex: 100,
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.2s ease-out', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
        }}
      >
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', height: '72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div style={{ minWidth: '36px', height: '36px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={18} color="white" />
            </div>
            {!sidebarCollapsed && <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px', whiteSpace: 'nowrap' }}>EduGuide AI</span>}
          </div>
        </div>
        <div style={{ padding: '8px 12px', flex: 1 }}>
          {[
            { label: 'Home', icon: Home, action: () => navigate('/') },
            { label: 'Recommend', icon: Sparkles, action: () => navigate('/recommend') },
            { label: 'Dream Uni', icon: Target, active: true, action: () => {} },
          ].map(({ label, icon: Icon, active, action }) => (
            <button key={label} onClick={action}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                height: '40px', padding: '0 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: active ? 'rgba(245,87,108,0.15)' : 'transparent',
                border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px',
                color: active ? '#fca5a5' : 'rgba(255,255,255,0.6)',
                fontSize: '13px', transition: 'all 0.15s'
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!sidebarCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
            </button>
          ))}
        </div>
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => { localStorage.clear(); navigate('/'); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', height: '40px', padding: '0 12px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', fontSize: '13px' }}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {!sidebarCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* ── Main ── */}
      <div style={{ marginLeft: sidebarCollapsed ? '100px' : '276px', transition: 'margin-left 0.25s ease', minHeight: '100vh', padding: '24px 28px 48px' }}>

        {/* Page header */}
        <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', background: 'white', padding: '16px 24px', borderRadius: '16px', boxShadow: '0 1px 0 rgba(0,0,0,0.05), 0 4px 12px -4px rgba(0,0,0,0.07)' }}
        >
          <button onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', color: '#475569', fontSize: '13px', fontWeight: '600', fontFamily: "'Outfit', sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0a0f1e' }}>Dream University Analysis</h1>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#94a3b8' }}>Find out your admission probability and get a roadmap to improve</p>
          </div>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={22} color="white" />
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: dreamResult ? '420px 1fr' : '520px', gap: '24px', justifyContent: dreamResult ? 'stretch' : 'center' }}>

          {/* ── Form Panel ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}
          >
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0a0f1e', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '28px', height: '28px', background: '#fff0f3', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={14} color="#e11d48" />
              </span>
              Your Profile
            </h2>

            {/* Selected university banner */}
            <AnimatePresence>
              {dreamUniversity && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ background: 'linear-gradient(135deg, #fff0f3, #fce7f3)', border: '1.5px solid #fecdd3', padding: '14px 16px', borderRadius: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <Building size={22} color="#e11d48" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '10.5px', color: '#e11d48', margin: 0, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dream University</p>
                    <p style={{ fontWeight: '800', margin: '2px 0 0', fontSize: '13.5px', color: '#0a0f1e' }}>{dreamUniversity.name}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>{dreamUniversity.location}</p>
                  </div>
                  <button onClick={() => { setDreamUniversity(null); setSearchQuery(''); }} style={{ background: '#fecdd3', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '4px' }}>
                    <X size={14} color="#e11d48" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              {/* University search */}
              <div style={{ marginBottom: '18px', position: 'relative' }}>
                <label style={labelStyle}>Search Your Dream University *</label>
                <div style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', pointerEvents: 'none' }} size={15} />
                  <input type="text" value={searchQuery} onChange={e => searchUniversities(e.target.value)}
                    placeholder="Type university name or location…"
                    style={{ ...inputStyle, paddingLeft: '38px' }}
                    required={!dreamUniversity}
                  />
                </div>
                <AnimatePresence>
                  {showSearch && searchResults.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', borderRadius: '14px', boxShadow: '0 16px 40px -8px rgba(0,0,0,0.14)', maxHeight: '260px', overflowY: 'auto', zIndex: 50, border: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      {searchResults.map(uni => (
                        <button key={uni.id} type="button"
                          onClick={() => { setDreamUniversity(uni); setShowSearch(false); setSearchQuery(uni.name); }}
                          style={{ width: '100%', textAlign: 'left', padding: '11px 16px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontFamily: "'Outfit', sans-serif", transition: 'background 0.12s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fff0f3'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <p style={{ fontWeight: '700', margin: 0, fontSize: '13px', color: '#0a0f1e' }}>{uni.name}</p>
                          <p style={{ fontSize: '11px', margin: '3px 0 0', color: '#94a3b8' }}>{uni.location}</p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Education Level */}
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Highest Education *</label>
                <select required value={formData.education_level} onChange={e => setFormData({ ...formData, education_level: e.target.value })} style={inputStyle}>
                  <option value="">Select level</option>
                  <option value="phd">PhD</option>
                  <option value="masters">Master's Degree</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="high_school">High School / A-Level</option>
                </select>
              </div>

              {(formData.education_level === 'masters' || formData.education_level === 'phd') && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>Bachelor's CGPA *</label>
                  <input type="number" step="0.01" required value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} placeholder="0.00 – 4.00" style={inputStyle} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label style={labelStyle}>IELTS Score</label>
                  <input type="number" step="0.5" value={formData.ielts} onChange={e => setFormData({ ...formData, ielts: e.target.value })} placeholder="0 – 9" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>TOEFL Score</label>
                  <input type="number" value={formData.toefl} onChange={e => setFormData({ ...formData, toefl: e.target.value })} placeholder="0 – 120" style={inputStyle} />
                </div>
              </div>

              {/* Tag inputs (abbreviated) */}
              {[
                { label: 'Extracurricular Activities', key: 'extracurriculars', val: extracurricularInput, setVal: setExtracurricularInput, color: '#d1fae5', textColor: '#065f46', placeholder: 'e.g. Student Council' },
                { label: 'Skills & Technologies', key: 'skills', val: skillInput, setVal: setSkillInput, color: '#dbeafe', textColor: '#1e40af', placeholder: 'e.g. Machine Learning' },
                { label: 'Research / Publications', key: 'research_papers', val: researchInput, setVal: setResearchInput, color: '#fce7f3', textColor: '#9d174d', placeholder: 'e.g. IEEE Paper 2024' },
              ].map(({ label, key, val, setVal, color, textColor, placeholder }) => (
                <div key={key} style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>{label}</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '7px' }}>
                    <input type="text" value={val} onChange={e => setVal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(key, val, setVal))}
                      placeholder={placeholder} style={{ ...inputStyle, flex: 1 }} />
                    <button type="button" onClick={() => addItem(key, val, setVal)}
                      style={{ padding: '0 14px', background: '#f5576c', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', flexShrink: 0 }}>
                      <Plus size={17} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {formData[key].map((item, idx) => (
                      <span key={idx} className="tag" style={{ background: color, color: textColor }}>
                        {item}<X size={11} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeItem(key, idx)} />
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              <button type="submit" disabled={loading || !dreamUniversity}
                style={{ width: '100%', padding: '14px', marginTop: '8px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '14px', cursor: (loading || !dreamUniversity) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (loading || !dreamUniversity) ? 0.65 : 1, fontFamily: "'Outfit', sans-serif" }}
              >
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Target size={18} />}
                {loading ? 'Calculating chances…' : 'Check My Admission Chance'}
              </button>
            </form>
          </motion.div>

          {/* ── Results Panel ── */}
          <AnimatePresence>
            {dreamResult && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}
              >
                {/* Gauge card */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 20px' }}>Admission Probability</p>

                  {/* Circular gauge */}
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                      <circle cx="70" cy="70" r="52" fill="none"
                        stroke={getChanceColor(dreamResult.match_percentage)}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - dreamResult.match_percentage / 100)}
                        transform="rotate(-90 70 70)"
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                      />
                      <text x="70" y="66" textAnchor="middle" fontSize="30" fontWeight="800" fill="#0a0f1e" fontFamily="Outfit, sans-serif">
                        {dreamResult.match_percentage}%
                      </text>
                      <text x="70" y="84" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Outfit, sans-serif">
                        match score
                      </text>
                    </svg>
                  </div>

                  <p style={{ fontSize: '1.15rem', fontWeight: '800', color: getChanceColor(dreamResult.match_percentage), margin: '0 0 4px' }}>
                    {getChanceLabel(dreamResult.match_percentage)}
                  </p>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>for {dreamUniversity?.name}</p>

                  {dreamResult.match_percentage >= 80 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      style={{ background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '14px 18px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <CheckCircle size={22} color="#10b981" style={{ flexShrink: 0 }} />
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontWeight: '800', margin: 0, color: '#065f46', fontSize: '13.5px' }}>Congratulations! 🎉</p>
                        <p style={{ fontSize: '12px', margin: '3px 0 0', color: '#047857' }}>You're highly qualified. Apply as soon as possible!</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Quick stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  {[
                    { icon: Award, color: '#f59e0b', bg: '#fffbeb', label: 'Scholarship Chance', value: dreamResult.scholarship_possibility || 'Medium' },
                    { icon: Shield, color: '#6366f1', bg: '#eef2ff', label: 'Visa Success Rate', value: dreamResult.university?.country?.visa_success_rate || '85%' },
                  ].map(({ icon: Icon, color, bg, label, value }) => (
                    <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                      <div style={{ width: '44px', height: '44px', background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <Icon size={20} color={color} />
                      </div>
                      <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0a0f1e', margin: 0 }}>{value}</p>
                      <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '4px 0 0', fontWeight: '500' }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Strengths */}
                {dreamResult.strengths?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    style={{ background: 'white', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '14px' }}
                  >
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={15} /> Your Strengths
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {dreamResult.strengths.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '10px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', flexShrink: 0, marginTop: '5px' }} />
                          <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>{s}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Weaknesses */}
                {dreamResult.weaknesses?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                    style={{ background: 'white', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '14px' }}
                  >
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#f59e0b', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={15} /> Areas to Improve
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {dreamResult.weaknesses.map((w, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', background: '#fffbeb', borderRadius: '10px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%', flexShrink: 0, marginTop: '5px' }} />
                          <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>{w}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Recommendations */}
                {dreamResult.recommendations?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ background: 'white', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}
                  >
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#6366f1', margin: '0 0 14px' }}>📋 Action Plan</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {dreamResult.recommendations.map((rec, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', background: '#f5f3ff', borderRadius: '10px' }}>
                          <span style={{ background: '#6366f1', color: 'white', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '20px', flexShrink: 0, marginTop: '1px' }}>{i + 1}</span>
                          <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>{rec}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <button onClick={() => window.open(dreamUniversity?.website, '_blank')}
                  style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: "'Outfit', sans-serif" }}
                >
                  Visit University Website <ExternalLink size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DreamUniversityPage;
