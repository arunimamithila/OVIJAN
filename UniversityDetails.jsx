// src/pages/UniversityDetails.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  ArrowLeft, MapPin, Award, DollarSign, Calendar, Building,
  TrendingUp, Users, BookOpen, Clock, ChevronDown,
  GraduationCap, Globe, Star, CreditCard,
  FlaskConical, Trophy, Briefcase, Heart, Mail, Phone,
  Link as LinkIcon, CheckCircle, Share2,
  Brain, Microscope, Rocket, FileText, Loader,
  Shield, Sparkles, Quote, ExternalLink, Play, Layers, Target
} from 'lucide-react';

// Import the CSS file (create this file)
import './UniversityDetailsonly.css';

const UniversityDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { university: passedUniversity } = location.state || {};

  const [activeTab, setActiveTab] = useState('overview');
  const [expandedDept, setExpandedDept] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [universityData, setUniversityData] = useState(null);

  // API Base URL - Update this to your Laravel backend URL
  const API_BASE_URL = 'http://localhost:8000';

  // Fetch complete university data with departments, research, and admission seasons
  const fetchUniversityData = async (universityId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/universities/${universityId}`);
      
      if (response.data && response.data.success) {
        setUniversityData(response.data.data);
      } else if (response.data && response.data.id) {
        setUniversityData(response.data);
      } else {
        setError('Failed to load university data');
      }
    } catch (err) {
      console.error('Error fetching university:', err);
      setError('Unable to connect to the server. Please make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let universityId = null;
    
    if (passedUniversity && passedUniversity.id) {
      universityId = passedUniversity.id;
    } else {
      const urlParts = window.location.pathname.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart !== 'uvdetails' && !isNaN(lastPart)) {
        universityId = parseInt(lastPart);
      }
    }
    
    if (universityId) {
      fetchUniversityData(universityId);
    } else {
      setError('No university selected. Please go back and select a university.');
      setLoading(false);
    }
    
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [passedUniversity]);

  const safeRender = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };

  // Enhanced image URL handling with priority for universitys folder
  const getImageUrl = (imageUrl) => {
    console.log('Original image_url from DB:', imageUrl);
    
    if (!imageUrl) {
      console.log('No image URL, using fallback');
      return 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop';
    }
    
    if (imageUrl.startsWith('http')) {
      console.log('Using external URL:', imageUrl);
      return imageUrl;
    }
    
    // Clean the path - remove any leading slashes or universitys prefix if needed
    let cleanImageUrl = imageUrl.replace(/^\/+/, '').replace(/^universitys\//, '');
    const finalUrl = `/universitys/${cleanImageUrl}`;
    console.log('Final image URL:', finalUrl);
    
    return finalUrl;
  };

  const toggleDepartment = (deptId) => {
    setExpandedDept(expandedDept === deptId ? null : deptId);
  };

  const getIconComponent = (iconName, size = 24, className = "") => {
    const iconProps = { size, className };
    switch (iconName) {
      case 'Trophy': return <Trophy {...iconProps} />;
      case 'Award': return <Award {...iconProps} />;
      case 'FlaskConical': return <FlaskConical {...iconProps} />;
      case 'Rocket': return <Rocket {...iconProps} />;
      case 'Brain': return <Brain {...iconProps} />;
      case 'Briefcase': return <Briefcase {...iconProps} />;
      case 'BookOpen': return <BookOpen {...iconProps} />;
      case 'Microscope': return <Microscope {...iconProps} />;
      case 'Users': return <Users {...iconProps} />;
      case 'Globe': return <Globe {...iconProps} />;
      case 'GraduationCap': return <GraduationCap {...iconProps} />;
      case 'TrendingUp': return <TrendingUp {...iconProps} />;
      default: return <Award {...iconProps} />;
    }
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0 }
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loader-wrapper">
            <div className="loader-ring"></div>
            <div className="loader-icon">
              <GraduationCap size={32} color="#10b981" />
            </div>
          </div>
          <p className="loading-text">Loading university details...</p>
          <p className="loading-subtext">Preparing your academic journey</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">
            <Shield size={40} color="#ef4444" />
          </div>
          <h2 className="error-title">Unable to Load Data</h2>
          <p className="error-message">{error}</p>
          <div className="error-buttons">
            <button
              onClick={() => navigate('/universities')}
              className="btn-primary"
            >
              Browse Universities
            </button>
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!universityData) {
    return (
      <div className="no-data-container">
        <div className="no-data-card">
          <div className="no-data-icon">
            <BookOpen size={40} color="#f59e0b" />
          </div>
          <h2 className="no-data-title">No University Data</h2>
          <button onClick={() => navigate('/universities')} className="btn-primary">
            Browse Universities
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="university-details"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Premium Navigation Bar */}
      <div className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-content">
            <motion.button 
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/universities')} 
              className="back-button"
            >
              <ArrowLeft size={18} />
              <span>Back to Universities</span>
            </motion.button>
            <div className="navbar-actions">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSaved(!saved)} 
                className="action-button"
              >
                <Heart size={18} className={saved ? 'heart-saved' : ''} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="action-button"
              >
                <Share2 size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Parallax Effect */}
      <div className="hero-section">
        <div className="hero-background">
          <img 
            src={getImageUrl(universityData.image_url)} 
            alt={universityData.name} 
            className="hero-image"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop'; }}
          />
          <div className="hero-overlay"></div>
          <div className="hero-gradient-top"></div>
          <div className="hero-gradient-bottom"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badges">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="badge-primary"
            >
              #{safeRender(universityData.rank)} World University Rank
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="badge-secondary"
            >
              {safeRender(universityData.type)}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="badge-accent"
            >
              Founded {safeRender(universityData.estavlished)}
            </motion.span>
            {universityData.flag && (
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="badge-light"
              >
                {universityData.flag} {universityData.country}
              </motion.span>
            )}
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="hero-title"
          >
            {universityData.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hero-quote"
          >
            <Quote size={28} className="quote-icon" />
            "{safeRender(universityData.motto)}"
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hero-location"
          >
            <MapPin size={20} />
            <span>{safeRender(universityData.location)}, {safeRender(universityData.country)}</span>
          </motion.div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-indicator-inner">
            <div className="scroll-dot"></div>
          </div>
        </div>
      </div>

      {/* Premium Tabs */}
      <div className="tabs-container">
        <div className="container">
          <div className="tabs-wrapper">
            {['overview', 'departments', 'research', 'cost', 'admissions'].map((tab, idx) => (
              <motion.button 
                key={tab} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setActiveTab(tab)} 
                className={`tab-button ${activeTab === tab ? 'tab-active' : ''}`}
              >
                {tab === 'overview' && <Building size={14} className="tab-icon" />}
                {tab === 'departments' && <GraduationCap size={14} className="tab-icon" />}
                {tab === 'research' && <FlaskConical size={14} className="tab-icon" />}
                {tab === 'cost' && <DollarSign size={14} className="tab-icon" />}
                {tab === 'admissions' && <FileText size={14} className="tab-icon" />}
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          
          {/* OVERVIEW TAB */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeUpVariants}
                className="space-y-10"
              >
                {/* Stats Grid */}
                <div className="stats-grid">
                  {universityData.campusStats && universityData.campusStats.map((stat, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="stat-card"
                    >
                      <div className="stat-icon-wrapper">
                        <div className="stat-icon">
                          {getIconComponent(stat.icon, 22, "icon-emerald")}
                        </div>
                      </div>
                      <p className="stat-value">{safeRender(stat.value)}</p>
                      <p className="stat-label">{safeRender(stat.label)}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="content-grid">
                  <div className="content-main">
                    {/* About Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="about-card"
                    >
                      <h2 className="section-title">
                        <Building size={24} className="title-icon" />
                        About the University
                      </h2>
                      <p className="about-text">{safeRender(universityData.description)}</p>
                    </motion.div>

                    {/* Country Information */}
                    {(universityData.capital || universityData.language || universityData.currency || universityData.visa_success_rate) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="country-card"
                      >
                        <h3 className="card-title">
                          <Globe size={20} className="title-icon-blue" />
                          Country & Location Insights
                        </h3>
                        <div className="country-grid">
                          {universityData.capital && (
                            <div className="country-item">
                              <p className="country-label">Capital</p>
                              <p className="country-value">{universityData.capital}</p>
                            </div>
                          )}
                          {universityData.language && (
                            <div className="country-item">
                              <p className="country-label">Language</p>
                              <p className="country-value">{universityData.language}</p>
                            </div>
                          )}
                          {universityData.currency && (
                            <div className="country-item">
                              <p className="country-label">Currency</p>
                              <p className="country-value">{universityData.currency}</p>
                            </div>
                          )}
                          {universityData.visa_success_rate && (
                            <div className="country-item">
                              <p className="country-label">Visa Success</p>
                              <p className="country-value-success">{universityData.visa_success_rate}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Key Statistics - Enhanced */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="stats-card"
                    >
                      <h3 className="card-title">
                        <TrendingUp size={20} className="title-icon-emerald" />
                        Institutional Statistics
                      </h3>
                      <div className="institution-stats">
                        <div className="institution-stat">
                          <p className="institution-stat-value">{safeRender(universityData.students)}</p>
                          <p className="institution-stat-label">Total Students</p>
                        </div>
                        <div className="institution-stat">
                          <p className="institution-stat-value">{safeRender(universityData.international_percent)}</p>
                          <p className="institution-stat-label">International Students</p>
                        </div>
                        <div className="institution-stat">
                          <p className="institution-stat-value">{safeRender(universityData.acceptance_rate)}</p>
                          <p className="institution-stat-label">Acceptance Rate</p>
                        </div>
                        <div className="institution-stat">
                          <p className="institution-stat-value">{safeRender(universityData.undergraduate)}</p>
                          <p className="institution-stat-label">Undergraduates</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Sidebar - Contact & Why Choose */}
                  <div className="content-sidebar">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="contact-card"
                    >
                      <h3 className="card-title">
                        <div className="contact-icon-wrapper">
                          <Mail size={16} className="contact-icon" />
                        </div>
                        Connect With Us
                      </h3>
                      <div className="contact-info">
                        <motion.a 
                          whileHover={{ x: 5 }}
                          href={`mailto:${universityData.email}`} 
                          className="contact-link"
                        >
                          <Mail size={16} className="contact-link-icon" />
                          <span>{safeRender(universityData.email)}</span>
                        </motion.a>
                        <motion.a 
                          whileHover={{ x: 5 }}
                          href={`tel:${universityData.phone}`} 
                          className="contact-link"
                        >
                          <Phone size={16} className="contact-link-icon" />
                          <span>{safeRender(universityData.phone)}</span>
                        </motion.a>
                        <motion.a 
                          whileHover={{ x: 5 }}
                          href={`https://${universityData.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="contact-link"
                        >
                          <LinkIcon size={16} className="contact-link-icon" />
                          <span>{safeRender(universityData.website)}</span>
                          <ExternalLink size={12} className="external-icon" />
                        </motion.a>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="why-choose-card"
                    >
                      <h3 className="card-title-white">
                        <Sparkles size={18} className="sparkle-icon" />
                        Why Choose This University?
                      </h3>
                      <ul className="why-choose-list">
                        <li className="why-choose-item">
                          <CheckCircle size={14} className="check-icon" />
                          <span>World-class education with global recognition</span>
                        </li>
                        <li className="why-choose-item">
                          <CheckCircle size={14} className="check-icon" />
                          <span>Cutting-edge research facilities and labs</span>
                        </li>
                        <li className="why-choose-item">
                          <CheckCircle size={14} className="check-icon" />
                          <span>Diverse international student community</span>
                        </li>
                        <li className="why-choose-item">
                          <CheckCircle size={14} className="check-icon" />
                          <span>Excellent career opportunities worldwide</span>
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DEPARTMENTS TAB */}
            {activeTab === 'departments' && (
              <motion.div 
                key="departments"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeUpVariants}
                className="departments-tab"
              >
                <div className="tab-header">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="tab-header-badge"
                  >
                    <Layers size={16} />
                    <span>Academic Excellence</span>
                  </motion.div>
                  <h2 className="tab-title">Academic Departments</h2>
                  <p className="tab-subtitle">Explore our world-class departments and innovative programs designed to shape future leaders</p>
                </div>
                {universityData.departments && universityData.departments.length > 0 ? (
                  <div className="departments-list">
                    {universityData.departments.map((dept, idx) => (
                      <motion.div 
                        key={dept.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="department-card"
                      >
                        <div 
                          className="department-header" 
                          onClick={() => toggleDepartment(dept.id)}
                        >
                          <div className="department-info">
                            <div className="department-icon-wrapper">
                              <div className="department-icon">
                                <GraduationCap size={22} />
                              </div>
                              <h3 className="department-name">{safeRender(dept.name)}</h3>
                              <span className="department-shortname">{safeRender(dept.short_name)}</span>
                            </div>
                            <p className="department-description">{safeRender(dept.description)}</p>
                            <div className="department-stats">
                              {dept.total_cridits && (
                                <span className="stat-badge">
                                  <strong>Total Credits:</strong> {dept.total_cridits}
                                </span>
                              )}
                              {dept.cridit_fee && (
                                <span className="stat-badge">
                                  <strong>Credit Fee:</strong> {dept.cridit_fee}
                                </span>
                              )}
                              {dept.total_tution && (
                                <span className="stat-badge-emerald">
                                  <strong>Total Tuition:</strong> {dept.total_tution}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronDown size={20} className={`chevron-icon ${expandedDept === dept.id ? 'expanded' : ''}`} />
                        </div>
                        <AnimatePresence>
                          {expandedDept === dept.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="department-expanded"
                            >
                              <div className="department-expanded-content">
                                <div className="program-structure">
                                  <h4 className="program-title">
                                    <Target size={18} />
                                    Program Structure
                                  </h4>
                                  <div className="program-grid">
                                    {dept.total_cridits && (
                                      <div className="program-item">
                                        <p className="program-label">Required Credits</p>
                                        <p className="program-value">{dept.total_cridits}</p>
                                      </div>
                                    )}
                                    {dept.cridit_fee && (
                                      <div className="program-item">
                                        <p className="program-label">Cost Per Credit</p>
                                        <p className="program-value">{dept.cridit_fee}</p>
                                      </div>
                                    )}
                                    {dept.total_tution && (
                                      <div className="program-item">
                                        <p className="program-label">Total Program Cost</p>
                                        <p className="program-value-emerald">{dept.total_tution}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="department-overview">
                                  <h4 className="overview-title">
                                    <BookOpen size={16} />
                                    Department Overview
                                  </h4>
                                  <p className="overview-text">{safeRender(dept.description)}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <BookOpen size={32} />
                    </div>
                    <p className="empty-state-text">No department information available for this university.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* RESEARCH TAB */}
            {activeTab === 'research' && (
              <motion.div 
                key="research"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeUpVariants}
                className="research-tab"
              >
                <div className="tab-header">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="tab-header-badge-purple"
                  >
                    <FlaskConical size={16} />
                    <span>Innovation Hub</span>
                  </motion.div>
                  <h2 className="tab-title">Research & Innovation</h2>
                  <p className="tab-subtitle">Pioneering discoveries and breakthrough innovations that shape the future of science and humanity</p>
                </div>
                <div className="research-grid">
                  {universityData.researchHighlights && universityData.researchHighlights.length > 0 ? (
                    universityData.researchHighlights.map((highlight, idx) => {
                      const colors = [
                        "amber", "blue", "emerald", "purple", "rose", "cyan"
                      ];
                      const icons = ['Trophy', 'FlaskConical', 'Brain', 'Rocket', 'Award', 'Microscope'];
                      return (
                        <motion.div 
                          key={highlight.id || idx} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ y: -8 }}
                          className="research-card"
                        >
                          <div className={`research-card-bar ${colors[idx % colors.length]}`}></div>
                          <div className="research-card-content">
                            <div className={`research-icon ${colors[idx % colors.length]}`}>
                              {getIconComponent(icons[idx % icons.length], 24, "research-icon-white")}
                            </div>
                            <h3 className="research-title">{safeRender(highlight.title)}</h3>
                            <p className="research-description">{safeRender(highlight.description)}</p>
                            <div className="research-category">
                              <span className="category-badge">{safeRender(highlight.category)}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Microscope size={32} />
                      </div>
                      <p className="empty-state-text">No research highlights available for this university.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* COST TAB */}
            {activeTab === 'cost' && (
              <motion.div 
                key="cost"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeUpVariants}
                className="cost-tab"
              >
                <div className="tab-header">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="tab-header-badge-amber"
                  >
                    <DollarSign size={16} />
                    <span>Investment in Future</span>
                  </motion.div>
                  <h2 className="tab-title">Tuition & Financial Aid</h2>
                  <p className="tab-subtitle">Comprehensive breakdown of costs and available financial support to make your education accessible</p>
                </div>
                <div className="tuition-card">
                  <h3 className="tuition-title">
                    <CreditCard size={22} />
                    Tuition by Department
                  </h3>
                  <div className="table-wrapper">
                    <table className="tuition-table">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Total Credits</th>
                          <th>Credit Fee</th>
                          <th>Total Tuition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {universityData.departments && universityData.departments.map((dept, idx) => (
                          <motion.tr 
                            key={idx} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className="table-row"
                          >
                            <td className="dept-name">{safeRender(dept.name)}</td>
                            <td>{safeRender(dept.total_cridits)}</td>
                            <td>{safeRender(dept.cridit_fee)}</td>
                            <td className="tuition-amount">{safeRender(dept.total_tution)}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="financial-aid-card"
                >
                  <h3 className="financial-aid-title">
                    <Award size={24} />
                    Financial Aid Opportunities
                  </h3>
                  <div className="aid-grid">
                    <div className="aid-item">
                      <span>🎓</span> Merit-based Scholarships: Up to 100% tuition
                    </div>
                    <div className="aid-item">
                      <span>💰</span> Need-based Grants: Available based on financial need
                    </div>
                    <div className="aid-item">
                      <span>🏅</span> Research Assistantships: Tuition + monthly stipend
                    </div>
                    <div className="aid-item">
                      <span>🌍</span> International Student Scholarships: Merit-based available
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="aid-button"
                  >
                    Apply for Financial Aid
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* ADMISSIONS TAB */}
            {activeTab === 'admissions' && (
              <motion.div 
                key="admissions"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeUpVariants}
                className="admissions-tab"
              >
                <div className="tab-header">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="tab-header-badge-blue"
                  >
                    <Calendar size={16} />
                    <span>Begin Your Journey</span>
                  </motion.div>
                  <h2 className="tab-title">Admissions Information</h2>
                  <p className="tab-subtitle">Your journey to joining our community starts here - everything you need to know about applying</p>
                </div>
                <div className="admissions-grid">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="dates-card"
                  >
                    <h3 className="dates-title">
                      <Calendar size={22} />
                      Important Dates
                    </h3>
                    {universityData.admissionSeasons && universityData.admissionSeasons.length > 0 ? (
                      <div className="dates-list">
                        {universityData.admissionSeasons.map((season, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="date-item"
                          >
                            <span className="semester-name">{safeRender(season.semester_name)}</span>
                            <span className="date-range">{season.start_date} - {season.end_date}</span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-dates">No admission seasons available</p>
                    )}
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="documents-card"
                  >
                    <h3 className="documents-title">
                      <FileText size={22} />
                      Required Documents
                    </h3>
                    <ul className="documents-list">
                      {[
                        "Official transcripts from all institutions attended",
                        "Standardized test scores (SAT/ACT/GRE/GMAT)",
                        "Letters of recommendation (2-3 academic/professional)",
                        "Statement of purpose / Personal essay",
                        "English proficiency (TOEFL/IELTS for international students)"
                      ].map((doc, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="document-item"
                        >
                          <CheckCircle size={18} className="document-check" />
                          <span>{doc}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="apply-card"
                >
                  <h3 className="apply-title">Ready to Apply?</h3>
                  <p className="apply-text">Take the first step toward your future at {universityData.short_name || universityData.name}</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="apply-button"
                  >
                    Start Your Application
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityDetails;