// prediction.jsx - Complete Modern Professional Design with Fixed Sidebar
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Prediction = ({ 
  sidebarCollapsed = false,
  setSidebarCollapsed = () => {},
  activeNav = 'prediction',
  setActiveNav = () => {},
  countries = []
}) => {
  const [formData, setFormData] = useState({
    education_level: '',
    cgpa: '',
    field_of_study: '',
    ielts_score: '',
    toefl_score: '',
    gre_score: '',
    gmat_score: '',
    skills: '',
    activities: '',
    publications: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [activeSection, setActiveSection] = useState('form');

  useEffect(() => {
    if (setActiveNav) {
      setActiveNav('prediction');
    }
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/universities');
      const data = await response.json();
      setUniversities(data.data || data || []);
    } catch (error) {
      console.error('Failed to fetch universities:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRecommend = async () => {
    setLoading(true);
    setError(null);
    setActiveSection('loading');

    const profile = {
      education: {
        level: formData.education_level,
        cgpa: formData.cgpa,
        field: formData.field_of_study
      },
      englishTests: [],
      standardizedTests: [],
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      activities: formData.activities.split(',').map(a => a.trim()).filter(a => a),
      publications: formData.publications.split(',').map(p => p.trim()).filter(p => p)
    };

    if (formData.ielts_score) {
      profile.englishTests.push({ type: 'IELTS', score: formData.ielts_score });
    }
    if (formData.toefl_score) {
      profile.englishTests.push({ type: 'TOEFL', score: formData.toefl_score });
    }
    if (formData.gre_score) {
      profile.standardizedTests.push({ type: 'GRE', score: formData.gre_score });
    }
    if (formData.gmat_score) {
      profile.standardizedTests.push({ type: 'GMAT', score: formData.gmat_score });
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ profile })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setActiveSection('results');
      } else {
        setError(data.error || 'Failed to get recommendation');
        setActiveSection('form');
      }
    } catch (err) {
      setError(`Connection error: ${err.message}. Make sure Laravel is running on port 8000`);
      setActiveSection('form');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    doc.setFontSize(24);
    doc.setTextColor(102, 126, 234);
    doc.text('University Recommendation Report', pageWidth / 2, yPos, { align: 'center' });

    yPos += 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });

    yPos += 20;

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('STUDENT PROFILE', 20, yPos);
    yPos += 10;

    const userProfile = [
      ['Education Level', formData.education_level || 'N/A'],
      ['CGPA/Percentage', formData.cgpa || 'N/A'],
      ['Field of Study', formData.field_of_study || 'N/A'],
      ['IELTS Score', formData.ielts_score || 'N/A'],
      ['TOEFL Score', formData.toefl_score || 'N/A'],
      ['GRE Score', formData.gre_score || 'N/A'],
      ['GMAT Score', formData.gmat_score || 'N/A'],
      ['Skills', formData.skills || 'N/A'],
      ['Activities', formData.activities || 'N/A'],
      ['Publications', formData.publications || 'N/A']
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Category', 'Information']],
      body: userProfile,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219], textColor: [255, 255, 255], fontSize: 11, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 'auto' }
      }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('TOP RECOMMENDATION', 20, yPos);

    yPos += 10;
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    const uniName = result.university?.name || result.recommendation?.best_university_name;
    const wrappedUniName = doc.splitTextToSize(uniName, pageWidth - 40);
    doc.text(wrappedUniName, 20, yPos);
    yPos += (wrappedUniName.length * 7) + 5;

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    const reasoning = doc.splitTextToSize(result.recommendation?.reasoning || '', pageWidth - 40);
    doc.text(reasoning, 20, yPos);
    yPos += reasoning.length * 6 + 15;

    doc.setFillColor(102, 126, 234);
    doc.setDrawColor(102, 126, 234);
    doc.roundedRect(20, yPos, pageWidth - 40, 35, 5, 5, 'F');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text(`${result.recommendation?.match_percentage || 85}%`, pageWidth / 2, yPos + 22, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Overall Match Score', pageWidth / 2, yPos + 32, { align: 'center' });

    yPos += 45;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('UNIVERSITY DETAILS', 20, yPos);

    yPos += 10;
    const uniDetails = [
      ['Location', result.university?.location || 'N/A'],
      ['Global Rank', `#${result.university?.rank || 'N/A'}`],
      ['Acceptance Rate', result.university?.acceptance_rate || 'N/A'],
      ['Scholarship Potential', result.recommendation?.scholarship_potential || 'Medium'],
      ['Visa Success Rate', result.recommendation?.visa_success_rate || 'Medium'],
      ['Match Quality', result.recommendation?.match_quality || 'Good']
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Category', 'Information']],
      body: uniDetails,
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234], textColor: [255, 255, 255], fontSize: 11, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' }
      }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    if (result.recommendation?.strengths?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('KEY STRENGTHS', 20, yPos);
      yPos += 10;

      result.recommendation.strengths.forEach((strength, index) => {
        const wrappedStrength = doc.splitTextToSize(`• ${strength}`, pageWidth - 40);
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(wrappedStrength, 25, yPos + (index * 6));
      });
      yPos += (result.recommendation.strengths.length * 6) + 10;
    }

    if (result.recommendation?.areas_to_improve?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('AREAS TO IMPROVE', 20, yPos);
      yPos += 10;

      result.recommendation.areas_to_improve.forEach((area, index) => {
        const wrappedArea = doc.splitTextToSize(`• ${area}`, pageWidth - 40);
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(wrappedArea, 25, yPos + (index * 6));
      });
      yPos += (result.recommendation.areas_to_improve.length * 6) + 10;
    }

    if (result.recommendation?.next_steps?.length > 0) {
      if (yPos + (result.recommendation.next_steps.length * 8) > 280) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('RECOMMENDED NEXT STEPS', 20, yPos);
      yPos += 10;

      result.recommendation.next_steps.forEach((step, index) => {
        const wrappedStep = doc.splitTextToSize(`${index + 1}. ${step}`, pageWidth - 40);
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(wrappedStep, 25, yPos + (index * 8));
      });
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        'Generated by AI University Recommender System',
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`university-recommendation-${Date.now()}.pdf`);
  };

  const getEducationLabel = (level) => {
    const labels = {
      'bachelors': "Bachelor's Degree",
      'masters': "Master's Degree",
      'phd': 'PhD / Doctorate'
    };
    return labels[level] || level || 'N/A';
  };

  const mainContentMargin = sidebarCollapsed ? '80px' : '280px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        countries={countries}
      />

      <div style={{
        flex: 1,
        marginLeft: mainContentMargin,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        width: `calc(100% - ${mainContentMargin})`
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderRadius: '1px 1px 10px 10px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 32px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>
                <h1 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  AI University Recommender
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#667eea',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Powered by
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#475569',
                    background: '#f1f5f9',
                    padding: '2px 8px',
                    borderRadius: '20px'
                  }}>
                    GROQ AI
                  </span>
                  <span style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#cbd5e1',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}></span>
                  <span style={{
                    fontSize: '10px',
                    color: '#64748b'
                  }}>
                    Intelligent Matching System
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                padding: '6px 14px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    display: 'inline-block',
                    position: 'relative'
                  }}></span>
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    left: '-4px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    opacity: 0.6,
                    animation: 'pulse-ring 1.5s infinite'
                  }}></span>
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#065f46'
                }}>
                  System Online
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>
          <AnimatePresence mode="wait">
            {activeSection === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ marginBottom: '32px' }}>
                  <div
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '24px',
                      padding: '36px',
                      background: 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                      color: '#1f2937'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-80px',
                        width: '250px',
                        height: '250px',
                        background: 'rgba(16, 185, 129, 0.25)',
                        borderRadius: '50%',
                        filter: 'blur(80px)',
                        zIndex: 0
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-120px',
                        left: '-80px',
                        width: '220px',
                        height: '220px',
                        background: 'rgba(5, 150, 105, 0.2)',
                        borderRadius: '50%',
                        filter: 'blur(80px)',
                        zIndex: 0
                      }}
                    />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h2
                        style={{
                          fontSize: '32px',
                          fontWeight: '700',
                          marginBottom: '14px',
                          lineHeight: '1.3',
                          color: '#111827',
                          display: 'flex',
                          gap: '8px'
                        }}
                      >
                        <img
                          src="/logo/rank.png"
                          alt="Rank"
                          style={{
                            width: '38px',
                            height: '34px',
                            objectFit: 'cover',
                            marginBottom: '0'
                          }}
                        /> Find Your Perfect University Match
                      </h2>

                      <p
                        style={{
                          fontSize: '16px',
                          color: '#374151',
                          maxWidth: '700px',
                          lineHeight: '1.8',
                          marginBottom: '28px'
                        }}
                      >
                        Complete your academic profile and receive AI-powered university recommendations
                        tailored to your grades, goals, budget, and preferred study destination.
                      </p>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '16px'
                        }}
                      >
                        {[
                          { icon: '🎯', title: 'Personalized Matches', desc: 'Universities selected based on your profile.' },
                          { icon: '🤖', title: 'AI Analysis', desc: 'Smart evaluation of academic strengths.' },
                          { icon: '⚡', title: 'Real-Time Results', desc: 'Instant recommendations and insights.' }
                        ].map((item, index) => (
                          <div
                            key={index}
                            style={{
                              background: 'rgba(16, 185, 129, 0.12)',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)',
                              borderRadius: '18px',
                              padding: '20px',
                              transition: '0.3s ease'
                            }}
                          >
                            <div style={{ fontSize: '28px', marginBottom: '12px', color: '#10b981' }}>
                              {item.icon}
                            </div>
                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#065f46' }}>
                              {item.title}
                            </h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#047857', lineHeight: '1.6' }}>
                              {item.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '24px 32px',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#fafbfc'
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                      Academic Profile Information
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
                      Please fill in all required fields (*)
                    </p>
                  </div>

                  <div style={{ padding: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                      <div>
                        <div style={{ marginBottom: '24px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                            Education Level <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <select
                            name="education_level"
                            value={formData.education_level}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              backgroundColor: '#ffffff',
                              transition: 'all 0.2s',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                          >
                            <option value="">Select your highest degree</option>
                            <option value="bachelors">Bachelor's Degree</option>
                            <option value="masters">Master's Degree</option>
                            <option value="phd">PhD / Doctorate</option>
                          </select>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                            CGPA / Percentage <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            name="cgpa"
                            placeholder="e.g., 3.8/4.0 or 85%"
                            value={formData.cgpa}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              transition: 'all 0.2s',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                          />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                            Field of Study <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            name="field_of_study"
                            placeholder="e.g., Computer Science, Business, Engineering"
                            value={formData.field_of_study}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              transition: 'all 0.2s',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                              IELTS Score
                            </label>
                            <input
                              type="text"
                              name="ielts_score"
                              placeholder="e.g., 7.5"
                              value={formData.ielts_score}
                              onChange={handleChange}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                              TOEFL Score
                            </label>
                            <input
                              type="text"
                              name="toefl_score"
                              placeholder="e.g., 100"
                              value={formData.toefl_score}
                              onChange={handleChange}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                              GRE Score
                            </label>
                            <input
                              type="text"
                              name="gre_score"
                              placeholder="e.g., 320"
                              value={formData.gre_score}
                              onChange={handleChange}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                              GMAT Score
                            </label>
                            <input
                              type="text"
                              name="gmat_score"
                              placeholder="e.g., 700"
                              value={formData.gmat_score}
                              onChange={handleChange}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                            Technical & Professional Skills
                          </label>
                          <input
                            type="text"
                            name="skills"
                            placeholder="Separate skills with commas (e.g., Python, Project Management)"
                            value={formData.skills}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                          />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                            Extracurricular Activities
                          </label>
                          <input
                            type="text"
                            name="activities"
                            placeholder="Separate activities with commas"
                            value={formData.activities}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                          />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>
                            Publications & Research
                          </label>
                          <input
                            type="text"
                            name="publications"
                            placeholder="List any publications or research papers"
                            value={formData.publications}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleRecommend}
                      disabled={loading || !formData.education_level || !formData.cgpa || !formData.field_of_study}
                      style={{
                        width: '100%',
                        marginTop: '32px',
                        padding: '14px 24px',
                        background: '#21a63e',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: loading || !formData.education_level || !formData.cgpa || !formData.field_of_study ? 'not-allowed' : 'pointer',
                        opacity: loading || !formData.education_level || !formData.cgpa || !formData.field_of_study ? 0.6 : 1,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && formData.education_level && formData.cgpa && formData.field_of_study) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 10px 20px rgba(51, 88, 67, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <div className="loader-small"></div>
                          Analyzing Your Profile...
                        </span>
                      ) : (
                        'Generate AI Recommendation →'
                      )}
                    </button>

                    {error && (
                      <div style={{
                        marginTop: '20px',
                        padding: '14px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '10px',
                        color: '#dc2626',
                        fontSize: '14px',
                        textAlign: 'center'
                      }}>
                        ⚠️ {error}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '500px'
                }}
              >
                <div className="loader"></div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginTop: '32px', marginBottom: '8px' }}>
                  Processing Your Academic Profile
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', maxWidth: '400px' }}>
                  Our AI is analyzing your qualifications and finding the best university matches for you...
                </p>
                <div style={{
                  marginTop: '32px',
                  width: '300px',
                  height: '6px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '60%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    borderRadius: '3px',
                    animation: 'loading 1.5s ease-in-out infinite'
                  }}></div>
                </div>
              </motion.div>
            )}

            {activeSection === 'results' && result && result.success && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '16px',
                  padding: '32px',
                  marginBottom: '32px',
                  color: '#ffffff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '32px' }}>🎉</span>
                        <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>Recommendation Ready!</h2>
                      </div>
                      <p style={{ fontSize: '14px', opacity: 0.95, margin: 0 }}>
                        Here's your personalized university match based on your academic profile
                      </p>
                    </div>
                    <div style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '28px', fontWeight: '700' }}>
                        {result.recommendation?.match_percentage || 85}%
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>Overall Match Score</div>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    padding: '20px 24px',
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}><img
                        src="/logo/businessman.png"
                        alt="User Avatar"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      /></span>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Your Academic Profile</h3>
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '20px'
                    }}>
                      <div>
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Education</p>
                          <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a' }}>{getEducationLabel(formData.education_level)}</p>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>CGPA / Percentage</p>
                          <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a' }}>{formData.cgpa || 'N/A'}</p>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Field of Study</p>
                          <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a' }}>{formData.field_of_study || 'N/A'}</p>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Test Scores</p>
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {formData.ielts_score && <span style={{ fontSize: '14px', color: '#334155' }}>IELTS: {formData.ielts_score}</span>}
                            {formData.toefl_score && <span style={{ fontSize: '14px', color: '#334155' }}>TOEFL: {formData.toefl_score}</span>}
                            {formData.gre_score && <span style={{ fontSize: '14px', color: '#334155' }}>GRE: {formData.gre_score}</span>}
                            {formData.gmat_score && <span style={{ fontSize: '14px', color: '#334155' }}>GMAT: {formData.gmat_score}</span>}
                            {!formData.ielts_score && !formData.toefl_score && !formData.gre_score && !formData.gmat_score &&
                              <span style={{ fontSize: '14px', color: '#94a3b8' }}>No test scores provided</span>
                            }
                          </div>
                        </div>
                      </div>

                      <div>
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Skills</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {formData.skills ? (
                              formData.skills.split(',').map((skill, idx) => (
                                <span key={idx} style={{
                                  fontSize: '13px',
                                  backgroundColor: '#e0e7ff',
                                  color: '#4338ca',
                                  padding: '4px 10px',
                                  borderRadius: '12px'
                                }}>
                                  {skill.trim()}
                                </span>
                              ))
                            ) : (
                              <span style={{ fontSize: '14px', color: '#94a3b8' }}>No skills listed</span>
                            )}
                          </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Extracurricular Activities</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {formData.activities ? (
                              formData.activities.split(',').map((activity, idx) => (
                                <span key={idx} style={{
                                  fontSize: '13px',
                                  backgroundColor: '#d1fae5',
                                  color: '#065f46',
                                  padding: '4px 10px',
                                  borderRadius: '12px'
                                }}>
                                  {activity.trim()}
                                </span>
                              ))
                            ) : (
                              <span style={{ fontSize: '14px', color: '#94a3b8' }}>No activities listed</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Publications & Research</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {formData.publications ? (
                              formData.publications.split(',').map((pub, idx) => (
                                <span key={idx} style={{
                                  fontSize: '13px',
                                  backgroundColor: '#fed7aa',
                                  color: '#92400e',
                                  padding: '4px 10px',
                                  borderRadius: '12px'
                                }}>
                                  {pub.trim()}
                                </span>
                              ))
                            ) : (
                              <span style={{ fontSize: '14px', color: '#94a3b8' }}>No publications listed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    padding: '28px',
                    borderBottom: '1px solid #e2e8f0',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                      <div>
                        <p
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#667eea',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <img
                            src="/logo/rank.png"
                            alt="Rank"
                            style={{
                              width: '24px',
                              height: '24px',
                              objectFit: 'cover',
                              marginBottom: '0'
                            }}
                          />
                          Top Recommendation
                        </p>
                        <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                          {result.university?.name || result.recommendation?.best_university_name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '28px' }}>
                    <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#334155', marginBottom: '28px' }}>
                      {result.recommendation?.reasoning}
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '20px',
                      paddingTop: '20px',
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', gap: '5px' }}>
                          <img src="/logo/location.png" alt="Location" style={{ width: '15px', height: '15px', objectFit: 'cover' }} /> Location
                        </p>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a' }}>{result.university?.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', gap: '5px' }}>
                          <img src="/logo/global.png" alt="Global" style={{ width: '15px', height: '15px', objectFit: 'cover' }} /> Global Rank
                        </p>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a' }}>#{result.university?.rank || 'N/A'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', gap: '5px' }}>
                          <img src="/logo/rating.png" alt="Rating" style={{ width: '15px', height: '15px', objectFit: 'cover' }} /> Acceptance Rate
                        </p>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a' }}>{result.university?.acceptance_rate || 'N/A'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', gap: '5px' }}>
                          <img src="/logo/scholarship.png" alt="Scholarship" style={{ width: '15px', height: '15px', objectFit: 'cover' }} /> Scholarship Potential
                        </p>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a' }}>{result.recommendation?.scholarship_potential || 'Medium'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', gap: '5px' }}>
                          <img src="/logo/visa.png" alt="Visa" style={{ width: '15px', height: '15px', objectFit: 'cover' }} /> Visa Success Rate
                        </p>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a' }}>{result.recommendation?.visa_success_rate || 'Medium'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', gap: '5px' }}>
                          <img src="/logo/puzzle.png" alt="Match" style={{ width: '15px', height: '15px', objectFit: 'cover' }} /> Match Quality
                        </p>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: '#0f172a' }}>{result.recommendation?.match_quality || 'Good'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#d1fae5',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>✅</div>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Key Strengths</h4>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {result.recommendation?.strengths?.map((s, i) => (
                        <li key={i} style={{ marginBottom: '10px', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#fed7aa',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>📈</div>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Areas for Improvement</h4>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {result.recommendation?.areas_to_improve?.map((a, i) => (
                        <li key={i} style={{ marginBottom: '10px', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  marginBottom: '32px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <img src="/logo/recommendation-letter.png" alt="Recommendation" style={{ width: '26px', height: '26px', objectFit: 'cover' }} />
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Recommended Next Steps</h4>
                  </div>
                  <div style={{ display: 'grid', gap: '14px' }}>
                    {result.recommendation?.next_steps?.map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          background: '#30a86a',
                          color: '#ffffff',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>{i + 1}</div>
                        <span style={{ fontSize: '14px', color: '#334155', flex: 1 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setResult(null);
                      setActiveSection('form');
                      setFormData({
                        education_level: '',
                        cgpa: '',
                        field_of_study: '',
                        ielts_score: '',
                        toefl_score: '',
                        gre_score: '',
                        gmat_score: '',
                        skills: '',
                        activities: '',
                        publications: ''
                      });
                    }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  >
                    Start New Recommendation
                  </button>
                  <button
                    onClick={exportToPDF}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #079c5e 0%, #32db89 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(102, 234, 192, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Export to PDF
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .loader {
          width: 70px;
          aspect-ratio: 1;
          display: grid;
        }
        .loader::before,
        .loader::after {    
          content: "";
          grid-area: 1/1;
          --c: no-repeat radial-gradient(farthest-side, #25b09b 92%, #0000);
          background: 
            var(--c) 50% 0, 
            var(--c) 50% 100%, 
            var(--c) 100% 50%, 
            var(--c) 0 50%;
          background-size: 16px 16px;
          animation: l12 1s infinite;
        }
        .loader::before {
          margin: 4px;
          filter: hue-rotate(45deg);
          background-size: 12px 12px;
          animation-timing-function: linear;
        }
        
        .loader-small {
          width: 20px;
          aspect-ratio: 1;
          display: inline-grid;
        }
        .loader-small::before,
        .loader-small::after {    
          content: "";
          grid-area: 1/1;
          --c: no-repeat radial-gradient(farthest-side, #ffffff 92%, #0000);
          background: 
            var(--c) 50% 0, 
            var(--c) 50% 100%, 
            var(--c) 100% 50%, 
            var(--c) 0 50%;
          background-size: 6px 6px;
          animation: l12 0.8s infinite;
        }
        .loader-small::before {
          margin: 2px;
          filter: hue-rotate(45deg);
          background-size: 4px 4px;
          animation-timing-function: linear;
        }
        
        @keyframes l12 { 
          100% { transform: rotate(0.5turn); }
        }
        
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Prediction;