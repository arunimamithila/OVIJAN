// RecommendationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowLeft, Plus, X, Upload, Loader2,
  Award, DollarSign, Shield, ExternalLink, GraduationCap,
  Home, Target, LogOut, CheckCircle, AlertCircle, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecommendationPage = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    education_level: '', cgpa: '', ielts: '', toefl: '',
    gre: '', gmat: '', ssc_gpa: '', hsc_gpa: '',
    extracurriculars: [], skills: [], research_papers: [], documents: []
  });
  const [extracurricularInput, setExtracurricularInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [researchInput, setResearchInput] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.name) setUser(userData);
  }, []);

  const getChanceColor = (p) => {
    if (p >= 80) return '#10b981';
    if (p >= 60) return '#f59e0b';
    if (p >= 40) return '#f97316';
    return '#ef4444';
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
    setLoading(true);
    try {
      const payload = {
        education_level: formData.education_level,
        cgpa: formData.cgpa,
        exam_scores: { IELTS: formData.ielts, TOEFL: formData.toefl, GRE: formData.gre, GMAT: formData.gmat },
        ssc_gpa: formData.ssc_gpa,
        hsc_gpa: formData.hsc_gpa,
        extracurriculars: formData.extracurriculars,
        skills: formData.skills,
        research_papers: formData.research_papers
      };
      const response = await fetch('http://127.0.0.1:8000/api/universities/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      alert('Error analyzing profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #e9ecef', borderRadius: '12px',
    fontSize: '13.5px', fontFamily: "'Outfit', sans-serif",
    outline: 'none', transition: 'border-color 0.15s',
    background: '#fafbfc'
  };

  const labelStyle = {
    display: 'block', fontSize: '12.5px', fontWeight: '600',
    color: '#475569', marginBottom: '7px', letterSpacing: '0.01em'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus { border-color: #667eea !important; }
        .tag { display: flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .rec-card { transition: box-shadow 0.2s; }
        .rec-card:hover { box-shadow: 0 8px 24px -8px rgba(0,0,0,0.12) !important; }
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
            { label: 'Recommend', icon: Sparkles, active: true, action: () => {} },
            { label: 'Dream Uni', icon: Target, action: () => navigate('/dream') },
          ].map(({ label, icon: Icon, active, action }) => (
            <button key={label} onClick={action}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                height: '40px', padding: '0 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: active ? 'rgba(102,126,234,0.15)' : 'transparent',
                border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px',
                color: active ? '#a5b4fc' : 'rgba(255,255,255,0.6)',
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
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', color: '#475569', fontSize: '13px', fontWeight: '600', fontFamily: "'Outfit', sans-serif", transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0a0f1e' }}>Find Your Perfect University</h1>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#94a3b8' }}>Enter your academic profile and let AI do the matching</p>
          </div>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} color="white" />
          </div>
        </motion.div>

        {/* Content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: recommendations ? '420px 1fr' : '520px', gap: '24px', justifyContent: recommendations ? 'stretch' : 'center' }}>

          {/* ── Form Panel ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}
          >
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0a0f1e', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '28px', height: '28px', background: '#f3f0ff', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={14} color="#6d28d9" />
              </span>
              Academic Profile
            </h2>

            <form onSubmit={handleSubmit}>
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

              {formData.education_level === 'high_school' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                  <div>
                    <label style={labelStyle}>SSC / O-Level GPA</label>
                    <input type="number" step="0.01" value={formData.ssc_gpa} onChange={e => setFormData({ ...formData, ssc_gpa: e.target.value })} placeholder="0.00 – 5.00" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>HSC / A-Level GPA</label>
                    <input type="number" step="0.01" value={formData.hsc_gpa} onChange={e => setFormData({ ...formData, hsc_gpa: e.target.value })} placeholder="0.00 – 5.00" style={inputStyle} />
                  </div>
                </div>
              )}

              {/* Language scores */}
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

              {(formData.education_level === 'masters' || formData.education_level === 'phd') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                  <div>
                    <label style={labelStyle}>GRE Score</label>
                    <input type="number" value={formData.gre} onChange={e => setFormData({ ...formData, gre: e.target.value })} placeholder="260 – 340" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>GMAT Score</label>
                    <input type="number" value={formData.gmat} onChange={e => setFormData({ ...formData, gmat: e.target.value })} placeholder="200 – 800" style={inputStyle} />
                  </div>
                </div>
              )}

              {/* Tag inputs */}
              {[
                { label: 'Extracurricular Activities', key: 'extracurriculars', val: extracurricularInput, setVal: setExtracurricularInput, color: '#d1fae5', textColor: '#065f46', placeholder: 'e.g. Debate Club President' },
                { label: 'Skills & Technologies', key: 'skills', val: skillInput, setVal: setSkillInput, color: '#dbeafe', textColor: '#1e40af', placeholder: 'e.g. Python, Data Analysis' },
                { label: 'Research Papers / Publications', key: 'research_papers', val: researchInput, setVal: setResearchInput, color: '#fce7f3', textColor: '#9d174d', placeholder: 'e.g. AI in Healthcare – IEEE 2024' },
              ].map(({ label, key, val, setVal, color, textColor, placeholder }) => (
                <div key={key} style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>{label}</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input type="text" value={val} onChange={e => setVal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(key, val, setVal))}
                      placeholder={placeholder} style={{ ...inputStyle, flex: 1 }} />
                    <button type="button" onClick={() => addItem(key, val, setVal)}
                      style={{ padding: '0 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', flexShrink: 0 }}>
                      <Plus size={17} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {formData[key].map((item, idx) => (
                      <span key={idx} className="tag" style={{ background: color, color: textColor }}>
                        {item}
                        <X size={11} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeItem(key, idx)} />
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Document Upload */}
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Upload Documents</label>
                <div style={{ border: '2px dashed #e2e8f0', borderRadius: '14px', padding: '20px', textAlign: 'center', background: '#fafbfc' }}>
                  <Upload size={28} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px' }}>Transcripts, CV, SOP, Certificates</p>
                  <input type="file" multiple style={{ fontSize: '11px' }} onChange={e => setFormData({ ...formData, documents: Array.from(e.target.files) })} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.75 : 1, fontFamily: "'Outfit', sans-serif" }}
              >
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={18} />}
                {loading ? 'Analyzing your profile…' : 'Analyze My Profile'}
              </button>
            </form>
          </motion.div>

          {/* ── Results Panel ── */}
          <AnimatePresence>
            {recommendations && (
              <motion.div key="results" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto', paddingRight: '2px' }}
              >
                {/* Results header */}
                <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.18)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={22} color="white" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'white', fontSize: '1.05rem', fontWeight: '800' }}>Top University Matches</h3>
                    <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '12.5px' }}>{recommendations.length} universities matched to your profile</p>
                  </div>
                </div>

                {recommendations.map((rec, idx) => (
                  <motion.div key={idx} className="rec-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
                    style={{ background: 'white', borderRadius: '18px', padding: '22px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  >
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ background: '#f3f0ff', color: '#6d28d9', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px' }}>#{idx + 1} MATCH</span>
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: '#0a0f1e' }}>{rec.university.name}</h4>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>{rec.university.location}</p>
                      </div>
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: '2.2rem', fontWeight: '800', color: getChanceColor(rec.match_percentage), lineHeight: 1 }}>{rec.match_percentage}%</div>
                        <p style={{ fontSize: '10.5px', color: '#94a3b8', margin: '2px 0 0', fontWeight: '600' }}>Match Score</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '99px', marginBottom: '18px', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${rec.match_percentage}%` }} transition={{ delay: idx * 0.07 + 0.3, duration: 0.6, ease: 'easeOut' }}
                        style={{ height: '100%', background: `linear-gradient(90deg, ${getChanceColor(rec.match_percentage)}, ${getChanceColor(rec.match_percentage)}aa)`, borderRadius: '99px' }}
                      />
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
                      {[
                        { icon: Award, color: '#f59e0b', label: 'Scholarship', value: rec.scholarship_possibility },
                        { icon: DollarSign, color: '#10b981', label: 'Tuition', value: rec.tuition_range?.[0] || 'N/A' },
                        { icon: Shield, color: '#6366f1', label: 'Visa Rate', value: rec.visa_success_rate },
                      ].map(({ icon: Icon, color, label, value }) => (
                        <div key={label} style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                          <Icon size={14} color={color} style={{ margin: '0 auto 5px' }} />
                          <p style={{ fontSize: '11px', fontWeight: '700', margin: 0, color: '#0a0f1e' }}>{value}</p>
                          <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0' }}>{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Strengths / Weaknesses */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      {rec.strengths?.length > 0 && (
                        <div>
                          <p style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={11} /> Strengths
                          </p>
                          <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            {rec.strengths.slice(0, 3).map((s, i) => <li key={i} style={{ fontSize: '11.5px', color: '#475569', marginBottom: '3px' }}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {rec.weaknesses?.length > 0 && (
                        <div>
                          <p style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={11} /> To Improve
                          </p>
                          <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            {rec.weaknesses.slice(0, 3).map((w, i) => <li key={i} style={{ fontSize: '11.5px', color: '#475569', marginBottom: '3px' }}>{w}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    <button onClick={() => window.open(rec.university.website, '_blank')}
                      style={{ width: '100%', padding: '10px', background: '#f8fafc', border: '1.5px solid #e9ecef', borderRadius: '12px', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#475569', fontFamily: "'Outfit', sans-serif", transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                    >
                      View University Details <ExternalLink size={12} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
