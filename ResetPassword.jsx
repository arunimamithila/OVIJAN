import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../images/logo.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);
  
  // Get token and email from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const emailParam = queryParams.get('email');
  
  useEffect(() => {
    const verifyToken = async () => {
      console.log('=== TOKEN VERIFICATION START ===');
      console.log('Token from URL:', token);
      console.log('Email from URL:', emailParam);
      
      if (!token || !emailParam) {
        setError('Invalid reset link. Please request a new password reset.');
        setIsVerifying(false);
        return;
      }
      
      const decodedEmail = decodeURIComponent(emailParam);
      console.log('Decoded email:', decodedEmail);
      setEmail(decodedEmail);
      
      // Try to find the reset token in localStorage first
      // In production, this should be verified by your backend
      let resetData = null;
      
      // Method 1: Try by token directly
      const tokenData = localStorage.getItem(`reset_token_${token}`);
      if (tokenData) {
        console.log('Found by token lookup');
        resetData = JSON.parse(tokenData);
      }
      
      // Method 2: Try by email with safe key
      if (!resetData) {
        const safeEmailKey = decodedEmail.replace(/[^a-zA-Z0-9]/g, '_');
        const emailData = localStorage.getItem(`reset_email_${safeEmailKey}`);
        if (emailData) {
          console.log('Found by safe email key lookup');
          resetData = JSON.parse(emailData);
        }
      }
      
      // Method 3: Try original method
      if (!resetData) {
        const originalData = localStorage.getItem(`reset_${decodedEmail}`);
        if (originalData) {
          console.log('Found by original email lookup');
          resetData = JSON.parse(originalData);
        }
      }
      
      if (!resetData) {
        console.log('No reset data found');
        setError('Reset link is invalid or has expired. Please request a new password reset.');
        setIsVerifying(false);
        return;
      }
      
      // Check if token matches
      if (resetData.token !== token) {
        console.log('Token mismatch');
        setError('Invalid reset link. Please request a new password reset.');
        setIsVerifying(false);
        return;
      }
      
      // Check if token has expired
      const expiryDate = new Date(resetData.expiry);
      const now = new Date();
      
      console.log('Expiry date:', expiryDate);
      console.log('Current date:', now);
      console.log('Is expired?', expiryDate < now);
      
      if (expiryDate < now) {
        console.log('Token has expired');
        setError('This reset link has expired. Please request a new password reset.');
        // Clean up expired token
        localStorage.removeItem(`reset_token_${token}`);
        setIsVerifying(false);
        return;
      }
      
      console.log('Token is VALID!');
      setValidToken(true);
      setIsVerifying(false);
    };
    
    verifyToken();
  }, [token, emailParam]);
  
  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(pass)) {
      return 'Password must contain at least one number';
    }
    return null;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call your backend API to update password in database
      const response = await fetch('http://127.0.0.1:8000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          email: email,
          token: token,
          password: password,
          password_confirmation: confirmPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Clean up used reset tokens
        localStorage.removeItem(`reset_token_${token}`);
        const safeEmailKey = email.replace(/[^a-zA-Z0-9]/g, '_');
        localStorage.removeItem(`reset_email_${safeEmailKey}`);
        localStorage.removeItem(`reset_${email}`);
        
        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading spinner while verifying
  if (isVerifying) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0f1c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 50,
            height: 50,
            border: "3px solid rgba(34,197,94,0.2)",
            borderTop: "3px solid #22c55e",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }} />
          <p style={{ color: "#94a3b8" }}>Verifying reset link...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  // If token is invalid, show error page
  if (!validToken && error) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0f1c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            borderRadius: 32,
            padding: "48px 40px",
            maxWidth: 500,
            width: "100%",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <div style={{
            width: 64,
            height: 64,
            background: "rgba(239,68,68,0.15)",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            border: "1px solid rgba(239,68,68,0.3)"
          }}>
            <AlertCircle size={32} color="#ef4444" />
          </div>
          
          <h2 style={{ color: "white", marginBottom: 12 }}>Invalid Reset Link</h2>
          <p style={{ color: "#94a3b8", marginBottom: 32, lineHeight: 1.6 }}>
            {error}
          </p>
          
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              border: "none",
              borderRadius: 14,
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}>
              <ArrowLeft size={18} />
              Back to Login
            </button>
          </Link>
          
          <button
            onClick={() => navigate('/login')}
            style={{
              marginTop: 16,
              background: "none",
              border: "none",
              color: "#22c55e",
              cursor: "pointer",
              fontSize: 14
            }}
          >
            Request New Reset Link →
          </button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      minHeight: "100vh",
      background: "#0a0f1c",
      position: "relative",
      overflowX: "hidden"
    }}>
      {/* Background Effects */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
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
      
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            maxWidth: 480
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <img src={logoImg} alt="Ovijan Logo" style={{ width: 50, height: 40 }} />
              <h2 style={{
                fontSize: 28,
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffffff 0%, #22c55e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Ovijan
              </h2>
            </div>
          </div>
          
          {/* Reset Password Form */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            borderRadius: 32,
            padding: "48px 40px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
          }}>
            {!success ? (
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    background: "linear-gradient(135deg, #22c55e15 0%, #16a34a15 100%)",
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    border: "1px solid rgba(34,197,94,0.2)"
                  }}>
                    <Lock size={32} color="#22c55e" />
                  </div>
                  
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>
                    Create New Password
                  </h2>
                  <p style={{ color: "#94a3b8", fontSize: 14 }}>
                    Enter your new password for <br />
                    <span style={{ color: "#22c55e", fontWeight: 600 }}>{email}</span>
                  </p>
                </div>
                
                {error && (
                  <div style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 12,
                    padding: "12px",
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 10
                  }}>
                    <AlertCircle size={16} color="#ef4444" />
                    <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  {/* New Password Field */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#e2e8f0",
                      marginBottom: 8
                    }}>
                      New Password
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
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError('');
                        }}
                        style={{
                          width: "100%",
                          padding: "14px 48px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 14,
                          fontSize: 14,
                          outline: "none",
                          color: "white"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                        placeholder="Enter new password"
                        required
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
                    <p style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>
                      Minimum 6 characters, 1 uppercase, 1 number
                    </p>
                  </div>
                  
                  {/* Confirm Password Field */}
                  <div style={{ marginBottom: 28 }}>
                    <label style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#e2e8f0",
                      marginBottom: 8
                    }}>
                      Confirm Password
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
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError('');
                        }}
                        style={{
                          width: "100%",
                          padding: "14px 48px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 14,
                          fontSize: 14,
                          outline: "none",
                          color: "white"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                        placeholder="Confirm your new password"
                        required
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
                      opacity: isLoading ? 0.7 : 1,
                      transition: "all 0.3s ease"
                    }}
                  >
                    {isLoading ? (
                      <div style={{
                        width: 20,
                        height: 20,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto"
                      }} />
                    ) : (
                      'Reset Password'
                    )}
                  </motion.button>
                </form>
                
                <div style={{ marginTop: 24, textAlign: "center" }}>
                  <Link to="/login" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>
                    ← Back to Sign In
                  </Link>
                </div>
              </>
            ) : (
              // Success State
              <div style={{ textAlign: "center" }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  style={{
                    width: 80,
                    height: 80,
                    background: "linear-gradient(135deg, #22c55e15 0%, #16a34a15 100%)",
                    borderRadius: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    border: "1px solid rgba(34,197,94,0.2)"
                  }}
                >
                  <CheckCircle size={48} color="#22c55e" />
                </motion.div>
                
                <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 12 }}>
                  Password Reset Successfully!
                </h2>
                <p style={{ color: "#94a3b8", lineHeight: 1.6 }}>
                  Your password has been reset in the database. You can now log in with your new password.
                </p>
                <p style={{ color: "#64748b", fontSize: 13, marginTop: 16 }}>
                  Redirecting to login page...
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;