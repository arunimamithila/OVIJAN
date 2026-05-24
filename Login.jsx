import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, Globe, X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import logoImg from '../images/logo.png';

// ============================================
// EMAILJS CONFIGURATION - REPLACE WITH YOUR VALUES
// ============================================
// Step 1: Go to https://www.emailjs.com and sign up
// Step 2: Go to "Email Services" -> "Add New Service" (choose Gmail, Outlook, etc.)
// Step 3: Go to "Email Templates" -> "Create New Template"
// Step 4: Go to "Account" -> "API Keys" to get your Public Key
// ============================================

// REPLACE THIS WITH YOUR ACTUAL PUBLIC KEY FROM EMAILJS
// Found at: EmailJS Dashboard → Account → API Keys → Public Key
const EMAILJS_PUBLIC_KEY = "FkjwiVZo6TEcze8uU"; // e.g., "user_abc123def456"

// REPLACE THIS WITH YOUR ACTUAL SERVICE ID FROM EMAILJS
// Found at: EmailJS Dashboard → Email Services → Your Service → Service ID
const EMAILJS_SERVICE_ID = "service_h9ebed8"; // e.g., "service_abc123"

// REPLACE THIS WITH YOUR ACTUAL TEMPLATE ID FROM EMAILJS
// Found at: EmailJS Dashboard → Email Templates → Your Template → Template ID
const EMAILJS_TEMPLATE_ID = "template_xu2v0zi"; // e.g., "template_xyz789"

// Initialize EmailJS with your public key
emailjs.init(EMAILJS_PUBLIC_KEY);

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State for error modal
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: '',
    type: 'error' // 'error' or 'warning'
  });

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close error modal after timer
  useEffect(() => {
    if (errorModal.isOpen) {
      const timer = setTimeout(() => {
        setErrorModal(prev => ({ ...prev, isOpen: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorModal.isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation before API call
    if (!formData.email || !formData.password) {
      setErrorModal({
        isOpen: true,
        message: 'Please fill in both email and password fields.',
        type: 'warning'
      });
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        // Show error modal with the message from backend
        setErrorModal({
          isOpen: true,
          message: data.message || 'Invalid email or password. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorModal({
        isOpen: true,
        message: 'Network error. Please check your connection and try again.',
        type: 'error'
      });
    }
  };

  // Generate a random reset token
  const generateResetToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Generate reset token and expiry (1 hour from now)
      const resetToken = generateResetToken();
      const resetExpiry = new Date(Date.now() + 3600000).toISOString();

      // FIX: Create a safe key without special characters
      const safeEmailKey = resetEmail.replace(/[^a-zA-Z0-9]/g, '_');

      // Store reset token in localStorage
      const resetData = {
        email: resetEmail,
        token: resetToken,
        expiry: resetExpiry,
        createdAt: new Date().toISOString()
      };

      // Store using both safe key and original email for redundancy
      localStorage.setItem(`reset_token_${resetToken}`, JSON.stringify(resetData));
      localStorage.setItem(`reset_email_${safeEmailKey}`, JSON.stringify(resetData));

      // Also store for debugging
      console.log('Token stored:', resetToken);
      console.log('For email:', resetEmail);
      console.log('Expires at:', resetExpiry);

      // Create reset link (make sure it's properly encoded)
      const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(resetEmail)}`;

      console.log('Reset link generated:', resetLink);

      // EmailJS template parameters
      const templateParams = {
        to_email: resetEmail,
        to_name: resetEmail.split('@')[0],
        reset_link: resetLink,
        from_name: 'Ovijan Support',
        message: `We received a request to reset your password for your Ovijan account. This link expires in 1 hour.`,
        year: new Date().getFullYear()
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setResetSent(true);

        // Auto close modal after 5 seconds
        setTimeout(() => {
          setResetSent(false);
          setShowForgotPassword(false);
          setResetEmail('');
        }, 5000);
      } else {
        setErrorMessage('Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      setErrorMessage('Unable to send reset email. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showForgotPassword) {
        setShowForgotPassword(false);
        setErrorMessage('');
        setResetEmail('');
      }
      if (e.key === 'Escape' && errorModal.isOpen) {
        setErrorModal(prev => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showForgotPassword, errorModal.isOpen]);

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

      {/* Animated Background Gradient */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
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

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer"
          }}
          onClick={() => navigate('/')}
        >
          <motion.img
            src={logoImg}
            alt="Ovijan Logo"
            style={{
              width: 50,
              height: 40,
              borderRadius: 12,
              marginTop: "-12px"
            }}
          />
          <h2
            style={{
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
            }}
          >
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
              transition: "all 0.3s ease",
              fontWeight: 500,
              color: "white",
              fontSize: 14,
              backdropFilter: "blur(10px)"
            }}
            onClick={() => navigate('/')}
          >
            Back to Home
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
              transition: "all 0.3s ease",
              color: "white",
              fontSize: 14,
              boxShadow: "0 4px 15px rgba(34,197,94,0.3)"
            }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </motion.button>
        </div>
      </motion.nav>

      {/* MAIN CONTENT */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "100px 24px 60px"
      }}>
        <div style={{
          display: "flex",
          maxWidth: 1200,
          width: "100%",
          gap: 60,
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          {/* LEFT SIDE - BRAND MESSAGE */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              flex: 1,
              minWidth: 280,
              color: "white"
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(34,197,94,0.15)",
                backdropFilter: "blur(10px)",
                padding: "8px 20px",
                borderRadius: 100,
                marginBottom: 32,
                border: "1px solid rgba(34,197,94,0.3)"
              }}
            >
              <Sparkles size={16} color="#22c55e" />
              <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>Welcome Back</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: "clamp(36px, 5vw, 52px)",
                fontWeight: 800,
                marginBottom: 20,
                letterSpacing: "-0.02em",
                lineHeight: 1.2
              }}
            >
              Continue Your{" "}
              <span style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Global Journey
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: 16,
                color: "#94a3b8",
                lineHeight: 1.6,
                marginBottom: 40,
                maxWidth: 400
              }}
            >
              Access personalized AI recommendations, track your applications, and connect with mentors who've been where you want to go.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16
              }}
            >
              {[
                { icon: Shield, text: "Secure & Encrypted Platform" },
                { icon: Globe, text: "Trusted by 50,000+ Students" },
                { icon: Sparkles, text: "AI-Powered Insights" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    background: "rgba(34,197,94,0.1)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <item.icon size={18} color="#22c55e" />
                  </div>
                  <span style={{ fontSize: 14, color: "#cbd5e1" }}>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - LOGIN FORM */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              flex: 1,
              minWidth: 380,
              maxWidth: 500
            }}
          >
            <div style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              borderRadius: 32,
              padding: "48px 40px",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
            }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "white", letterSpacing: "-0.02em" }}>
                  Sign In
                </h2>
                <p style={{ color: "#94a3b8", fontSize: 14 }}>
                  Enter your credentials to access your account
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 18,
                      height: 18,
                      color: "#64748b"
                    }} />
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
                        transition: "all 0.3s ease",
                        outline: "none",
                        fontFamily: "inherit",
                        color: "white"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#22c55e";
                        e.target.style.background = "rgba(255,255,255,0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.1)";
                        e.target.style.background = "rgba(255,255,255,0.05)";
                      }}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 18,
                      height: 18,
                      color: "#64748b"
                    }} />
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
                        transition: "all 0.3s ease",
                        outline: "none",
                        fontFamily: "inherit",
                        color: "white"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#22c55e";
                        e.target.style.background = "rgba(255,255,255,0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.1)";
                        e.target.style.background = "rgba(255,255,255,0.05)";
                      }}
                      placeholder="Enter your password"
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
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input type="checkbox" style={{ width: 16, height: 16, marginRight: 8, cursor: "pointer", accentColor: "#22c55e" }} />
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, textDecoration: "none", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Forgot password?
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: 14,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8
                  }}
                >
                  Sign In
                  <ArrowRight size={16} />
                </motion.button>
              </form>

              <div style={{ marginTop: 32, textAlign: "center", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ color: "#94a3b8", fontSize: 13 }}>
                  Don't have an account?{' '}
                  <Link to="/signup" style={{ color: "#22c55e", fontWeight: 600, textDecoration: "none" }}>
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ERROR MODAL - MODERN TOAST-STYLE NOTIFICATION */}
      <AnimatePresence>
        {errorModal.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 400 }}
            style={{
              position: "fixed",
              top: "100px",
              right: "24px",
              zIndex: 3000,
              maxWidth: "420px",
              width: "calc(100% - 48px)",
              pointerEvents: "auto"
            }}
          >
            <div style={{
              background: errorModal.type === 'error'
                ? "linear-gradient(135deg, rgba(239,68,68,0.95) 0%, rgba(220,38,38,0.95) 100%)"
                : "linear-gradient(135deg, rgba(245,158,11,0.95) 0%, rgba(217,119,6,0.95) 100%)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "16px 20px",
              boxShadow: "0 20px 35px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}>
              {/* Icon */}
              <motion.div
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: [0, 10, -10, 0], scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <AlertCircle size={22} color="white" />
              </motion.div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.3px"
                }}>
                  {errorModal.type === 'error' ? 'Login Failed' : 'Warning'}
                </h4>
                <p style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.4
                }}>
                  {errorModal.message}
                </p>
              </div>

              {/* Timer Progress Bar */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "0 0 20px 20px",
                overflow: "hidden"
              }}>
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  style={{
                    height: "100%",
                    background: "rgba(255,255,255,0.8)",
                    borderRadius: "0 0 0 20px"
                  }}
                />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "10px",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
              >
                <X size={14} color="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORGOT PASSWORD MODAL - WITH REAL EMAIL FUNCTIONALITY */}
      <AnimatePresence>
        {showForgotPassword && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              pointerEvents: "none"
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowForgotPassword(false);
                setErrorMessage('');
                setResetEmail('');
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(12px)",
                cursor: "pointer",
                pointerEvents: "auto"
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "relative",
                width: "90%",
                maxWidth: 480,
                background: "#0f172a",
                borderRadius: 28,
                border: "1px solid rgba(34,197,94,0.2)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                zIndex: 2001,
                overflow: "hidden",
                pointerEvents: "auto"
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setErrorMessage('');
                  setResetEmail('');
                }}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: 10,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.05)"}
              >
                <X size={18} color="#94a3b8" />
              </button>

              <div style={{ padding: "48px 40px" }}>
                {!resetSent ? (
                  <>
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      style={{
                        width: 64,
                        height: 64,
                        background: "linear-gradient(135deg, #22c55e15 0%, #16a34a15 100%)",
                        borderRadius: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        border: "1px solid rgba(34,197,94,0.2)"
                      }}
                    >
                      <Lock size={32} color="#22c55e" />
                    </motion.div>

                    <h3 style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "white",
                      textAlign: "center",
                      marginBottom: 8,
                      letterSpacing: "-0.02em"
                    }}>
                      Forgot Password?
                    </h3>
                    <p style={{
                      fontSize: 14,
                      color: "#94a3b8",
                      textAlign: "center",
                      marginBottom: 32,
                      lineHeight: 1.6
                    }}>
                      No worries! Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {/* Error Message */}
                    {errorMessage && (
                      <div style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: 12,
                        padding: "12px",
                        marginBottom: 20,
                        textAlign: "center"
                      }}>
                        <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }}>{errorMessage}</p>
                      </div>
                    )}

                    <form onSubmit={handleForgotPassword}>
                      <div style={{ marginBottom: 24 }}>
                        <label style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#e2e8f0",
                          marginBottom: 8
                        }}>
                          Email Address
                        </label>
                        <div style={{ position: "relative" }}>
                          <Mail style={{
                            position: "absolute",
                            left: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 18,
                            height: 18,
                            color: "#64748b"
                          }} />
                          <input
                            type="email"
                            required
                            value={resetEmail}
                            onChange={(e) => {
                              setResetEmail(e.target.value);
                              setErrorMessage('');
                            }}
                            style={{
                              width: "100%",
                              padding: "14px 16px 14px 48px",
                              background: "rgba(255,255,255,0.05)",
                              border: errorMessage ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                              borderRadius: 14,
                              fontSize: 14,
                              transition: "all 0.3s ease",
                              outline: "none",
                              fontFamily: "inherit",
                              color: "white"
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#22c55e";
                              e.target.style.background = "rgba(255,255,255,0.08)";
                            }}
                            onBlur={(e) => {
                              if (!errorMessage) {
                                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                              }
                              e.target.style.background = "rgba(255,255,255,0.05)";
                            }}
                            placeholder="Enter your registered email"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        style={{
                          width: "100%",
                          padding: "14px",
                          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: 14,
                          fontSize: 15,
                          fontWeight: 600,
                          cursor: isLoading ? "not-allowed" : "pointer",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          opacity: isLoading ? 0.7 : 1
                        }}
                      >
                        {isLoading ? (
                          <>
                            <div style={{
                              width: 18,
                              height: 18,
                              border: "2px solid rgba(255,255,255,0.3)",
                              borderTop: "2px solid white",
                              borderRadius: "50%",
                              animation: "spin 0.8s linear infinite"
                            }} />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Reset Link
                            <Send size={16} />
                          </>
                        )}
                      </motion.button>
                    </form>

                    <div style={{ marginTop: 24, textAlign: "center" }}>
                      <button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setErrorMessage('');
                          setResetEmail('');
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#64748b",
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "color 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#22c55e"}
                        onMouseLeave={(e) => e.target.style.color = "#64748b"}
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </>
                ) : (
                  // Success State
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ textAlign: "center" }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      style={{
                        width: 64,
                        height: 64,
                        background: "linear-gradient(135deg, #22c55e15 0%, #16a34a15 100%)",
                        borderRadius: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        border: "1px solid rgba(34,197,94,0.2)"
                      }}
                    >
                      <CheckCircle size={32} color="#22c55e" />
                    </motion.div>

                    <h3 style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "white",
                      textAlign: "center",
                      marginBottom: 12,
                      letterSpacing: "-0.02em"
                    }}>
                      Check Your Email
                    </h3>
                    <p style={{
                      fontSize: 14,
                      color: "#94a3b8",
                      textAlign: "center",
                      lineHeight: 1.6
                    }}>
                      We've sent a password reset link to<br />
                      <span style={{ color: "#22c55e", fontWeight: 600 }}>{resetEmail}</span>
                    </p>
                    <p style={{
                      fontSize: 12,
                      color: "#64748b",
                      textAlign: "center",
                      marginTop: 16
                    }}>
                      The link will expire in 1 hour
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 968px) {
          nav { padding: 16px 24px !important; }
          .login-container { flex-direction: column; text-align: center; }
        }
        @media (max-width: 768px) {
          nav { padding: 12px 20px !important; }
        }
        input::placeholder {
          color: #475569;
        }
      `}</style>
    </div>
  );
};

export default Login;