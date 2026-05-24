// VisaTracker.jsx - Complete with Database Integration
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, Clock, AlertCircle, FileText,
  GraduationCap, Briefcase, Flag, LogOut,
  CreditCard, Fingerprint, Shield, Users, Building,
  Calendar, Mail, Phone, MapPin, Globe, BookOpen,
  Award, BadgeCheck, FileCheck, Upload, Heart,
  DollarSign, Home, Activity, UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const VisaTracker = () => {
  const navigate = useNavigate();
  
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ passportNumber: '', accessCode: '' });
  const [loginError, setLoginError] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [applicantType, setApplicantType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [visaData, setVisaData] = useState(null);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [progressStats, setProgressStats] = useState({ total: 0, completed: 0, in_progress: 0, pending: 0, percentage: 0 });
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  
  // Student Application Form State
  const [studentFormData, setStudentFormData] = useState({
    email: '', fullName: '', dateOfBirth: '', nationality: '',
    passportNumber: '', passportExpiryDate: '', phoneNumber: '', homeAddress: '',
    intendedTravelDate: '', universityName: '', courseName: '',
    acceptanceLetter: null, proofOfFunds: null,
    hasCriminalRecord: false, hasVisaRefusal: false
  });

  // Job Seeker Application Form State
  const [jobSeekerFormData, setJobSeekerFormData] = useState({
    email: '', fullName: '', dateOfBirth: '', nationality: '',
    passportNumber: '', passportExpiryDate: '', phoneNumber: '', homeAddress: '',
    intendedTravelDate: '', jobTitle: '', companyName: '',
    jobOfferLetter: null, proofOfFunds: null,
    hasCriminalRecord: false, hasVisaRefusal: false
  });

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #F0F4FC 0%, #E8EEF9 100%)',
      fontFamily: "'Inter', sans-serif",
      padding: '32px',
    },
    card: {
      background: 'white',
      borderRadius: '32px',
      padding: '40px',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
      maxWidth: '600px',
      margin: '0 auto',
    },
    wideCard: {
      background: 'white',
      borderRadius: '32px',
      padding: '40px',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      paddingBottom: '28px',
      borderBottom: '2px solid rgba(0,0,0,0.06)',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(16,185,129,0.12)',
      color: '#0B6E4F',
      fontSize: '12px',
      fontWeight: '700',
      padding: '8px 20px',
      borderRadius: '40px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#0A2540',
      marginBottom: '12px',
    },
    sub: {
      fontSize: '14px',
      color: '#5A6E85',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1.5px solid #E2E8F2',
      borderRadius: '16px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: "'Inter', sans-serif",
    },
    button: {
      padding: '12px 28px',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      border: 'none',
      borderRadius: '40px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
    },
    buttonOutline: {
      padding: '12px 28px',
      background: 'transparent',
      color: '#10b981',
      border: '1.5px solid #10b981',
      borderRadius: '40px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
    },
    typeSelector: {
      display: 'flex',
      gap: '24px',
      marginBottom: '32px',
    },
    typeOption: {
      flex: 1,
      padding: '32px 24px',
      borderRadius: '24px',
      cursor: 'pointer',
      textAlign: 'center',
      background: 'white',
      border: '1px solid #E2E8F2',
      transition: 'all 0.3s ease',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '32px',
    },
    statusBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '20px 28px',
      borderRadius: '28px',
      marginBottom: '32px',
      background: 'rgba(16,185,129,0.1)',
      border: '1px solid rgba(16,185,129,0.25)',
    },
    progressWrap: {
      background: 'white',
      borderRadius: '28px',
      padding: '24px',
      marginBottom: '32px',
    },
    tabs: {
      display: 'flex',
      gap: '12px',
      background: '#F1F4F9',
      padding: '6px',
      borderRadius: '24px',
      marginBottom: '32px',
    },
    tab: {
      flex: 1,
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '600',
      borderRadius: '20px',
      cursor: 'pointer',
      border: 'none',
      fontFamily: 'inherit',
      background: 'transparent',
      transition: 'all 0.2s',
    },
    tlItem: {
      display: 'flex',
      gap: '0',
      position: 'relative',
    },
    tlLeft: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '70px',
      flexShrink: 0,
    },
    tlContent: {
      flex: 1,
      padding: '0 0 32px 20px',
    },
    sectionLabel: {
      fontSize: '12px',
      fontWeight: '800',
      color: '#10b981',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      marginBottom: '24px',
    },
    timelineCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      border: '1px solid #E2E8F2',
    },
    statCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid #E2E8F2',
    },
    grid4: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '32px',
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '32px',
    },
  };

  // Helper Components
  const DotStatus = ({ status }) => {
    const base = {
      width: '36px',
      height: '36px',
      borderRadius: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      flexShrink: 0,
    };
    
    if (status === 'completed') {
      return <div style={{ ...base, background: '#10b981', color: 'white', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>✓</div>;
    }
    if (status === 'in_progress') {
      return <div style={{ ...base, background: '#f59e0b', color: 'white', boxShadow: '0 0 0 4px rgba(245,158,11,0.2)' }}>●</div>;
    }
    return <div style={{ ...base, background: '#F1F4F9', border: '2px solid #D1DBE8', color: '#8EA0B5' }}>○</div>;
  };

  const Badge = ({ status }) => {
    const colors = {
      completed: { background: 'rgba(16,185,129,0.12)', color: '#0B6E4F', label: 'Completed' },
      in_progress: { background: 'rgba(245,158,11,0.12)', color: '#C47B0E', label: 'In Progress' },
      pending: { background: '#F1F4F9', color: '#6C7E98', label: 'Pending' }
    };
    const style = colors[status] || colors.pending;
    
    return (
      <span style={{
        ...style,
        fontSize: '11px',
        fontWeight: '700',
        padding: '6px 14px',
        borderRadius: '40px',
      }}>
        {style.label}
      </span>
    );
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/visa/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          passport_number: loginData.passportNumber,
          access_code: loginData.accessCode
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setVisaData(result.data.application);
        setTimelineSteps(result.data.timeline || []);
        setProgressStats(result.data.stats || { total: 0, completed: 0, in_progress: 0, pending: 0, percentage: 0 });
        setApplicantType(result.data.application.visa_type);
        setHasApplied(true);
        setIsLoggedIn(true);
        setShowLogin(false);
      } else {
        setLoginError(result.message || 'Invalid passport number or access code');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Make sure Laravel is running on port 8000');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setHasApplied(false);
    setVisaData(null);
    setTimelineSteps([]);
    setApplicantType(null);
    setLoginData({ passportNumber: '', accessCode: '' });
    setShowLogin(true);
    setShowApplicationForm(false);
    setActiveTab('timeline');
  };

  // Handle New Application - Navigate to VisaGuide
  const handleNewApplication = () => {
    navigate('/visaguide');
  };

  // Screen conditions
  const showApplicantTypeScreen = !isLoggedIn && showLogin && !applicantType && !showApplicationForm;
  const showLoginScreen = !isLoggedIn && showLogin && applicantType && !showApplicationForm;
  const showStudentForm = !isLoggedIn && showApplicationForm && applicantType === 'student';
  const showJobSeekerForm = !isLoggedIn && showApplicationForm && applicantType === 'job_seeker';
  const showDashboard = isLoggedIn && hasApplied && visaData;

  // Group steps by category
  const stepsByCategory = timelineSteps.reduce((acc, step) => {
    if (!acc[step.category]) acc[step.category] = [];
    acc[step.category].push(step);
    return acc;
  }, {});

  // Applicant Type Selection Screen
  if (showApplicantTypeScreen) {
    return (
      <div style={styles.container}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={styles.card}>
          <div style={styles.header}>
            <div style={styles.badge}><Flag size={16} /> UK Visa Application Tracker</div>
            <h1 style={styles.title}>Track Your Visa Application</h1>
            <p style={styles.sub}>Real-time tracking with detailed step-by-step updates</p>
          </div>
          
          <div style={styles.typeSelector}>
            <motion.div whileHover={{ scale: 1.02 }} onClick={() => setApplicantType('student')} style={styles.typeOption}>
              <GraduationCap size={52} color="#10b981" style={{ marginBottom: '16px' }} />
              <div style={{ fontWeight: '700', fontSize: '18px' }}>Student Visa</div>
              <div style={{ fontSize: '13px', color: '#5A6E85' }}>For students pursuing education in the UK</div>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} onClick={() => setApplicantType('job_seeker')} style={styles.typeOption}>
              <Briefcase size={52} color="#10b981" style={{ marginBottom: '16px' }} />
              <div style={{ fontWeight: '700', fontSize: '18px' }}>Work Visa</div>
              <div style={{ fontSize: '13px', color: '#5A6E85' }}>Skilled Worker visa for professionals</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Login Form
  if (showLoginScreen) {
    return (
      <div style={styles.container}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ ...styles.card, maxWidth: '500px' }}>
          <div style={styles.header}>
            <div style={styles.badge}>
              {applicantType === 'student' ? <GraduationCap size={16} /> : <Briefcase size={16} />}
              {applicantType === 'student' ? ' Student Visa Portal' : ' Work Visa Portal'}
            </div>
            <h1 style={styles.title}>Track Your Application</h1>
            <p style={styles.sub}>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Passport Number</label>
              <input
                type="text"
                value={loginData.passportNumber}
                onChange={(e) => setLoginData({ ...loginData, passportNumber: e.target.value })}
                style={styles.input}
                placeholder="Enter your passport number"
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Secure Access Code</label>
              <input
                type="text"
                value={loginData.accessCode}
                onChange={(e) => setLoginData({ ...loginData, accessCode: e.target.value })}
                style={styles.input}
                placeholder="Enter access code from email"
                required
              />
            </div>

            {loginError && (
              <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '20px', textAlign: 'center', background: '#FEF2F2', padding: '12px', borderRadius: '16px' }}>
                {loginError}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ ...styles.button, width: '100%', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Verifying...' : 'Track Application →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button type="button" onClick={handleNewApplication} style={styles.buttonOutline}>
                New Application? Start here
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button type="button" onClick={() => setApplicantType(null)} style={{ ...styles.buttonOutline, borderColor: '#D1DBE8', color: '#6C7E98' }}>
                ← Back
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // Visa Tracker Dashboard - Using timelineSteps from database
  if (showDashboard) {
    return (
      <div style={styles.container}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.badge}>
              {visaData.visa_type === 'student' ? <GraduationCap size={16} /> : <Briefcase size={16} />}
              {visaData.visa_type === 'student' ? ' Student Visa Application' : ' Skilled Worker Visa Application'}
            </div>
            <h1 style={styles.title}>Visa Application Tracker</h1>
            <p style={styles.sub}>Real-time updates based on your application status</p>
          </div>

          {/* Status Banner */}
          <div style={styles.statusBanner}>
            <div style={{ width: '56px', height: '56px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.2)' }}>
              <Clock size={28} color="#10b981" />
            </div>
            <div>
              <strong style={{ fontSize: '16px', display: 'block', marginBottom: '6px' }}>
                Status: {visaData.application_status?.toUpperCase()}
              </strong>
              <span style={{ fontSize: '14px', color: '#5A6E85' }}>
                Reference: {visaData.application_reference}
              </span>
            </div>
          </div>

          {/* Statistics Cards */}
          <div style={styles.grid4}>
            <div style={styles.statCard}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981' }}>{progressStats.total}</div>
              <div style={{ fontSize: '12px', color: '#5A6E85', marginTop: '4px' }}>Total Steps</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981' }}>{progressStats.completed}</div>
              <div style={{ fontSize: '12px', color: '#5A6E85', marginTop: '4px' }}>Completed</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#f59e0b' }}>{progressStats.in_progress}</div>
              <div style={{ fontSize: '12px', color: '#5A6E85', marginTop: '4px' }}>In Progress</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#8EA0B5' }}>{progressStats.pending}</div>
              <div style={{ fontSize: '12px', color: '#5A6E85', marginTop: '4px' }}>Pending</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressWrap}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: '600' }}>Overall Progress</span>
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>{progressStats.percentage}%</span>
            </div>
            <div style={{ height: '10px', background: '#EFF3F8', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressStats.percentage}%`, background: 'linear-gradient(90deg, #10b981, #34D399)', borderRadius: '10px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <span style={{ fontSize: '11px', color: '#5A6E85' }}>Application Submitted</span>
              <span style={{ fontSize: '11px', color: '#5A6E85' }}>Visa Decision</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            {['timeline', 'byCategory', 'info'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                style={{ 
                  ...styles.tab, 
                  background: activeTab === tab ? 'white' : 'transparent', 
                  color: activeTab === tab ? '#10b981' : '#5A6E85',
                  boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {tab === 'timeline' ? 'Timeline View' : tab === 'byCategory' ? 'Group by Category' : 'Application Info'}
              </button>
            ))}
          </div>

          {/* Timeline View - Using data from database */}
          {activeTab === 'timeline' && (
            <div>
              <p style={styles.sectionLabel}>Application Timeline</p>
              {timelineSteps.map((step, idx) => (
                <div key={step.id} style={styles.tlItem}>
                  <div style={styles.tlLeft}>
                    <DotStatus status={step.status} />
                    {idx < timelineSteps.length - 1 && <div style={{ width: '2px', flex: 1, minHeight: '28px', background: step.status === 'completed' ? '#10b981' : '#E2E8F2' }} />}
                  </div>
                  <div style={styles.tlContent}>
                    <div style={styles.timelineCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: step.status === 'pending' ? '#8EA0B5' : '#0A2540' }}>
                            {step.title}
                          </span>
                        </div>
                        <Badge status={step.status} />
                      </div>
                      <p style={{ fontSize: '13px', color: '#5A6E85', marginBottom: '8px' }}>{step.description}</p>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <p style={{ fontSize: '11px', color: '#8EA0B5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {step.date}
                        </p>
                        {step.estimated_wait && (
                          <p style={{ fontSize: '11px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> Est. wait: {step.estimated_wait}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Group by Category View */}
          {activeTab === 'byCategory' && (
            <div>
              {Object.keys(stepsByCategory).map(category => (
                <div key={category} style={{ marginBottom: '32px' }}>
                  <p style={{ ...styles.sectionLabel, marginBottom: '16px' }}>{category}</p>
                  <div style={styles.grid2}>
                    {stepsByCategory[category].map(step => (
                      <div key={step.id} style={{ ...styles.timelineCard, marginBottom: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#0A2540' }}>{step.title}</div>
                            <div style={{ fontSize: '11px', color: '#8EA0B5' }}>{step.date}</div>
                          </div>
                          <Badge status={step.status} />
                        </div>
                        <p style={{ fontSize: '12px', color: '#5A6E85', marginLeft: '0' }}>{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Application Info Tab */}
          {activeTab === 'info' && (
            <div style={{ background: '#F8FAFE', borderRadius: '24px', padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2540' }}>{visaData.full_name}</div></div>
                <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Passport Number</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2540' }}>{visaData.passport_number}</div></div>
                <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2540' }}>{visaData.email}</div></div>
                <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nationality</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2540' }}>{visaData.nationality}</div></div>
                {visaData.visa_type === 'student' ? (
                  <>
                    <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>University</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2540' }}>{visaData.university_name}</div></div>
                    <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Course</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2540' }}>{visaData.course_name}</div></div>
                  </>
                ) : (
                  <>
                    <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Job Title</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2540' }}>{visaData.job_title}</div></div>
                    <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2540' }}>{visaData.company_name}</div></div>
                  </>
                )}
                <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submitted Date</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2540' }}>{new Date(visaData.submitted_at).toLocaleDateString()}</div></div>
                <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Application Status</div><div style={{ fontSize: '15px', fontWeight: '700', color: visaData.application_status === 'approved' ? '#10b981' : visaData.application_status === 'rejected' ? '#ef4444' : '#f59e0b' }}>{visaData.application_status?.toUpperCase()}</div></div>
                <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Secure Access Code</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#10b981', fontFamily: 'monospace' }}>{visaData.secure_access_code}</div></div>
                <div><div style={{ fontSize: '11px', color: '#5A6E85', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Country Applied To</div><div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2540' }}>{visaData.selected_country_name || 'United Kingdom'}</div></div>
              </div>
              
              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16,185,129,0.08)', borderRadius: '16px' }}>
                <p style={{ fontSize: '12px', color: '#5A6E85', textAlign: 'center' }}>
                  Need assistance? Contact UKVI support at <strong>+44 (0)300 790 6268</strong> or visit 
                  <strong> www.gov.uk/contact-ukvi-inside-outside-uk</strong>
                </p>
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button onClick={handleLogout} style={{ ...styles.buttonOutline, borderColor: '#D1DBE8', color: '#6C7E98' }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VisaTracker;