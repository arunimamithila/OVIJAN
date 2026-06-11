import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, Globe, 
  User, CheckCircle, Calendar, GraduationCap, BookOpen, Award, 
  TrendingUp, ChevronRight, Star, Briefcase 
} from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../images/logo.png';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
    edu_info_qn: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          dob: formData.dob,
          email: formData.email,
          password: formData.password,
          edu_info_qn: formData.edu_info_qn,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        navigate('/login');
      } else {
        const msg = data.errors ? Object.values(data.errors)[0][0] : data.message;
        alert(msg || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Updated education options to match backend validation
  // Backend accepts: 'Higher Secondary', 'Undergraduation', 'Post graduation', 'PHd'
  const educationOptions = [
    { value: 'Higher Secondary', label: 'Higher Secondary / 10+2', icon: BookOpen },
    { value: 'Undergraduation', label: 'Undergraduation (Bachelor\'s)', icon: GraduationCap },
    { value: 'Post graduation', label: 'Post Graduation (Master\'s)', icon: Award },
    { value: 'PHd', label: 'PhD / Doctorate', icon: TrendingUp }
  ];

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'education', label: 'Education', icon: GraduationCap }
  ];

  const isFormValid = () => {
    return formData.name && formData.dob && formData.email && 
           formData.password && formData.confirmPassword && formData.edu_info_qn &&
           formData.password === formData.confirmPassword;
  };

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      minHeight: "100vh",
      background: "#0a0f1c",
      position: "relative",
      overflowX: "hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      {/* Animated Background Gradients */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}
      />

      {/* Grid Pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "linear-gradient(#22c55e08 1px, transparent 1px), linear-gradient(90deg, #22c55e08 1px, transparent 1px)",
        backgroundSize: "50px 50px",
        pointerEvents: "none"
      }} />

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: scrolled ? "12px 60px" : "20px 60px",
          borderBottom: scrolled ? "1px solid rgba(34,197,94,0.15)" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: scrolled ? "rgba(10,15,28,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          zIndex: 1000,
          transition: "all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)"
        }}
      >
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => navigate('/')}
        >
          <motion.img
            src={logoImg}
            alt="Ovijan Logo"
            style={{ width: 50, height: 40, borderRadius: 12, marginTop: "-12px" }}
          />
          <h2 style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            lineHeight: 1,
            color: "white",
            fontFamily: "'Playfair Display', serif",
            background: "linear-gradient(135deg, #ffffff 0%, #22c55e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Ovijan
          </h2>
        </motion.div>

        <div style={{ display: "flex", gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "10px 24px",
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.2)",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 500,
              color: "white",
              fontSize: 14,
              backdropFilter: "blur(10px)"
            }}
            onClick={() => navigate('/')}
          >
            Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "10px 28px",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              border: "none",
              borderRadius: 12,
              fontWeight: 600,
              cursor: "pointer",
              color: "white",
              fontSize: 14,
              boxShadow: "0 4px 15px rgba(34,197,94,0.3)"
            }}
            onClick={() => navigate('/login')}
          >
            Sign In
          </motion.button>
        </div>
      </motion.nav>

      {/* MAIN CONTENT - NEW DESIGN */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "100px 24px 60px"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: 1100,
            width: "100%",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(10px)",
            borderRadius: 40,
            border: "1px solid rgba(34,197,94,0.15)",
            overflow: "hidden"
          }}
        >
          <div style={{
            display: "flex",
            flexWrap: "wrap"
          }}>
            {/* LEFT SIDE - PROGRESS & FEATURES */}
            <div style={{
              flex: 1,
              minWidth: 280,
              background: "rgba(34,197,94,0.05)",
              padding: "48px 32px",
              borderRight: "1px solid rgba(34,197,94,0.1)"
            }}>
              <div style={{ marginBottom: 40 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: "rgba(34,197,94,0.15)",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  border: "1px solid rgba(34,197,94,0.3)"
                }}>
                  <Sparkles size={24} color="#22c55e" />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 12 }}>
                  Join Our Community
                </h3>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
                  Create your account and unlock unlimited opportunities for global education.
                </p>
              </div>

              {/* Progress Steps */}
              <div style={{ marginBottom: 40 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 20, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Registration Steps
                </p>
                {tabs.map((tab, idx) => (
                  <motion.div
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ x: 5 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      marginBottom: 8,
                      borderRadius: 14,
                      cursor: "pointer",
                      background: activeTab === tab.id ? "rgba(34,197,94,0.1)" : "transparent",
                      border: activeTab === tab.id ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      background: activeTab === tab.id ? "#22c55e" : "rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <tab.icon size={16} color={activeTab === tab.id ? "white" : "#94a3b8"} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: activeTab === tab.id ? "#22c55e" : "#cbd5e1" }}>
                        Step {idx + 1}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{tab.label}</div>
                    </div>
                    {activeTab === tab.id && <ChevronRight size={14} color="#22c55e" style={{ marginLeft: "auto" }} />}
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div>
                <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "white" }}>50k+</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Active Users</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "white" }}>98%</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Satisfaction</div>
                  </div>
                </div>
                <div style={{
                  padding: "12px 16px",
                  background: "rgba(34,197,94,0.08)",
                  borderRadius: 12,
                  border: "1px solid rgba(34,197,94,0.15)"
                }}>
                  <p style={{ fontSize: 12, color: "#22c55e", marginBottom: 4 }}>✨ Trusted Partner</p>
                  <p style={{ fontSize: 11, color: "#64748b" }}>200+ Universities Worldwide</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div style={{
              flex: 1.5,
              minWidth: 400,
              padding: "48px 48px"
            }}>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: "white", marginBottom: 8 }}>
                  Create Account
                </h2>
                <p style={{ color: "#94a3b8", fontSize: 14 }}>
                  Fill in your details to get started
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ display: "flex", flexDirection: "column", gap: 20 }}
                  >
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                        Full Name *
                      </label>
                      <div style={{ position: "relative" }}>
                        <User size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "14px 16px 14px 48px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 14,
                            fontSize: 14,
                            outline: "none",
                            color: "white"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                        Date of Birth *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Calendar size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" }} />
                        <input
                          type="date"
                          required
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "14px 16px 14px 48px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 14,
                            fontSize: 14,
                            outline: "none",
                            color: "white",
                            cursor: "pointer"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                        Email Address *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Mail size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "14px 16px 14px 48px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 14,
                            fontSize: 14,
                            outline: "none",
                            color: "white"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('account')}
                      style={{
                        marginTop: 20,
                        padding: "14px",
                        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        border: "none",
                        borderRadius: 14,
                        color: "white",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8
                      }}
                    >
                      Continue to Account Setup
                      <ArrowRight size={16} />
                    </motion.button>
                  </motion.div>
                )}

                {/* Account Information Tab */}
                {activeTab === 'account' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ display: "flex", flexDirection: "column", gap: 20 }}
                  >
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                        Password *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Lock size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "14px 48px 14px 48px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 14,
                            fontSize: 14,
                            outline: "none",
                            color: "white"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                        Confirm Password *
                      </label>
                      <div style={{ position: "relative" }}>
                        <CheckCircle size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "14px 48px 14px 48px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 14,
                            fontSize: 14,
                            outline: "none",
                            color: "white"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          {showConfirmPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                        </button>
                      </div>
                      {passwordError && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>{passwordError}</p>}
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('personal')}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "transparent",
                          border: "1.5px solid rgba(255,255,255,0.2)",
                          borderRadius: 14,
                          color: "#cbd5e1",
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: "pointer"
                        }}
                      >
                        Back
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('education')}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                          border: "none",
                          borderRadius: 14,
                          color: "white",
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Continue to Education
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Education Information Tab - UPDATED to match backend validation */}
                {activeTab === 'education' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ display: "flex", flexDirection: "column", gap: 20 }}
                  >
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                        Educational Qualification *
                      </label>
                      <div style={{ position: "relative" }}>
                        <GraduationCap size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none", zIndex: 1 }} />
                        <select
                          required
                          value={formData.edu_info_qn}
                          onChange={(e) => setFormData({ ...formData, edu_info_qn: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "14px 16px 14px 48px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 14,
                            fontSize: 14,
                            outline: "none",
                            color: "white",
                            cursor: "pointer",
                            appearance: "none"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                        >
                          <option value="" style={{ background: "#0f172a" }}>Select your highest qualification</option>
                          {educationOptions.map(option => (
                            <option key={option.value} value={option.value} style={{ background: "#0f172a" }}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div style={{
                          position: "absolute",
                          right: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#64748b"
                        }}>▼</div>
                      </div>
                      <p style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>
                        Options: Higher Secondary, Undergraduation, Post graduation, or PHd
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                      <input
                        type="checkbox"
                        required
                        style={{ width: 16, height: 16, marginRight: 10, cursor: "pointer", accentColor: "#22c55e" }}
                      />
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>
                        I agree to the{' '}
                        <a href="#" style={{ color: "#22c55e", fontWeight: 600, textDecoration: "none" }}>Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" style={{ color: "#22c55e", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</a>
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('account')}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "transparent",
                          border: "1.5px solid rgba(255,255,255,0.2)",
                          borderRadius: 14,
                          color: "#cbd5e1",
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: "pointer"
                        }}
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={!isFormValid() || isSubmitting}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: isFormValid() && !isSubmitting ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" : "rgba(255,255,255,0.1)",
                          border: "none",
                          borderRadius: 14,
                          color: isFormValid() && !isSubmitting ? "white" : "#64748b",
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: isFormValid() && !isSubmitting ? "pointer" : "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8
                        }}
                      >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        {!isSubmitting && <ArrowRight size={16} />}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </form>

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <p style={{ color: "#64748b", fontSize: 12 }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: "#22c55e", fontWeight: 600, textDecoration: "none" }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          nav { padding: 16px 24px !important; }
        }
        @media (max-width: 768px) {
          nav { padding: 12px 20px !important; }
          .signup-container { flex-direction: column; }
        }
        input::placeholder {
          color: #475569;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(0.6);
        }
        select option {
          background: #0f172a;
        }
      `}</style>
    </div>
  );
};

export default Signup;