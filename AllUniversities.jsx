import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Award, DollarSign, Calendar, Building,
  TrendingUp, Users, BookOpen, Search, Filter, ChevronDown, ChevronUp,
  X, GraduationCap, Globe, Star, BarChart3, HardDrive,
  Terminal, Cpu, Server, Grid, Layers, Eye, Heart, Send, CheckCircle, AlertCircle,
  LayoutDashboard, Bell, LogOut, Settings, UserCircle, Bookmark, Clock, TrendingUp as Trending,
  Shield, Crown, Sparkles, ArrowRight, Menu, Home, FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../images/logo.png';

const AllUniversities = () => {
  const navigate = useNavigate();

  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedUniForApply, setSelectedUniForApply] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('universities');
  const [hoveredCard, setHoveredCard] = useState(null);

  const [filters, setFilters] = useState({
    type: 'all',
    minRanking: '',
    maxTuition: '',
    countryId: 'all',
    sortBy: 'ranking'
  });

  const [applicationData, setApplicationData] = useState({
    program_name: '',
    notes: ''
  });

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const [scrolled, setScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const userName = userData.name || 'Student';
  const userId = localStorage.getItem('userId') || userData.userID || null;

  // Navigation handler for countries and other items
  const handleNavigation = (item, subItem = null) => {
    if (item.action) {
      item.action();
    } else if (subItem) {
      // This handles country submenu items
      setActiveNav(subItem.id);
      if (subItem.path) {
        navigate(subItem.path, { state: subItem.state });
      }
    } else if (item.id === 'universities') {
      setActiveNav(item.id);
      if (item.path) navigate(item.path);
    } else if (item.id === 'dashboard') {
      // For dashboard main link without submenu
      setActiveNav(item.id);
      if (item.path) navigate(item.path);
    } else if (item.path) {
      setActiveNav(item.id);
      navigate(item.path);
    }
  };

  // Handle details navigation - passes full university data to /uvdetails
  const handleDetailsClick = (uni, e) => {
    e.stopPropagation();
    navigate('/uvdetails', { state: { university: uni, countryName: uni.country_name || 'Global' } });
  };

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
        flag: country.flag,
        icon: Globe
      }))
    },
    { id: 'universities', icon: Building, label: 'Universities', path: '/all-universities' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', path: '/calendar' },
    { id: 'community', icon: Users, label: 'Community', path: '/community' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'bookmarks', icon: Bookmark, label: 'Saved', path: '/bookmarks' },
    { id: 'visa', icon: Shield, label: 'Visa Tracker', path: '/visatracker' },
    { id: 'visaguide', icon: FileText, label: 'Visa Application', path: '/visaguide' },
  ];

  const secondaryNavItems = [
    { id: 'profile', icon: UserCircle, label: 'Profile', path: '/profile' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    { id: 'logout', icon: LogOut, label: 'Logout', action: () => { localStorage.clear(); navigate('/login'); } },
  ];

  // SIMPLE IMAGE HELPER - NO require NEEDED
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/university-placeholder.jpg';
    return `/universitys/${imageUrl}`;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchCountriesAndUniversities();
  }, []);

  const toggleSubmenu = (menuId) => {
    setOpenSubmenu(openSubmenu === menuId ? null : menuId);
  };

  useEffect(() => {
    applyFiltersAndSearch();
  }, [universities, filters, searchTerm]);

  const fetchCountriesAndUniversities = async () => {
    setLoading(true);
    try {
      const [countriesResponse, universitiesResponse] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/countries'),
        fetch('http://127.0.0.1:8000/api/universities')
      ]);

      const countriesData = await countriesResponse.json();
      const universitiesData = await universitiesResponse.json();

      const countriesList = Array.isArray(countriesData) ? countriesData : (countriesData.data || []);
      setCountries(countriesList);

      let universitiesList = [];
      if (Array.isArray(universitiesData)) {
        universitiesList = universitiesData;
      } else if (universitiesData.data && Array.isArray(universitiesData.data)) {
        universitiesList = universitiesData.data;
      } else if (universitiesData.universities && Array.isArray(universitiesData.universities)) {
        universitiesList = universitiesData.universities;
      } else {
        universitiesList = [];
      }

      const universitiesWithCountry = universitiesList.map(uni => {
        const country = countriesList.find(c => c.id === uni.country_id);
        return {
          ...uni,
          country_name: country ? country.name : 'Unknown'
        };
      });

      setUniversities(universitiesWithCountry);
      setFilteredUniversities(universitiesWithCountry);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    if (!Array.isArray(universities)) {
      setFilteredUniversities([]);
      return;
    }

    let filtered = [...universities];

    if (searchTerm) {
      filtered = filtered.filter(uni =>
        uni.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.country_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(uni => uni.type === filters.type);
    }

    if (filters.countryId !== 'all') {
      filtered = filtered.filter(uni => uni.country_id === parseInt(filters.countryId));
    }

    if (filters.minRanking) {
      filtered = filtered.filter(uni => uni.ranking <= parseInt(filters.minRanking));
    }

    if (filters.maxTuition) {
      filtered = filtered.filter(uni => {
        const tuitionNum = parseInt(uni.tuition?.replace(/[^0-9]/g, '') || '0');
        return tuitionNum <= parseInt(filters.maxTuition);
      });
    }

    switch (filters.sortBy) {
      case 'ranking':
        filtered.sort((a, b) => (a.ranking || 999) - (b.ranking || 999));
        break;
      case 'name':
        filtered.sort((a, b) => a.name?.localeCompare(b.name) || 0);
        break;
      case 'tuition_low':
        filtered.sort((a, b) => {
          const aTuition = parseInt(a.tuition?.replace(/[^0-9]/g, '') || '0');
          const bTuition = parseInt(b.tuition?.replace(/[^0-9]/g, '') || '0');
          return aTuition - bTuition;
        });
        break;
      case 'tuition_high':
        filtered.sort((a, b) => {
          const aTuition = parseInt(a.tuition?.replace(/[^0-9]/g, '') || '0');
          const bTuition = parseInt(b.tuition?.replace(/[^0-9]/g, '') || '0');
          return bTuition - aTuition;
        });
        break;
      default:
        break;
    }

    setFilteredUniversities(filtered);
  };

  const handleApplyClick = (uni, e) => {
    e.stopPropagation();
    setSelectedUniForApply(uni);
    setApplicationData({
      program_name: '',
      notes: ''
    });
    setShowApplyModal(true);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    if (!userId) {
      setSubmitError('Please login to apply for universities');
      setSubmitting(false);
      return;
    }

    try {
      const applicationPayload = {
        user_id: parseInt(userId),
        university_id: selectedUniForApply.id,
        country_name: selectedUniForApply.country_name,
        program_name: applicationData.program_name,
        status: 'Pending',
        applied_date: new Date().toISOString().split('T')[0],
        notes: applicationData.notes
      };

      const response = await fetch('http://127.0.0.1:8000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(applicationPayload)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowApplyModal(false);
          setApplicationData({
            program_name: '',
            notes: ''
          });
        }, 1500);
      } else {
        setSubmitError(data.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      minRanking: '',
      maxTuition: '',
      countryId: 'all',
      sortBy: 'ranking'
    });
    setSearchTerm('');
  };

  const getInitials = () => userName.charAt(0).toUpperCase();

  const formatCurrency = (value, symbol = '$') => {
    if (!value) return 'Varies';
    const numericMatch = value.match(/\d[\d,]*/);
    if (numericMatch) {
      return `${symbol}${numericMatch[0]}`;
    }
    return value.split(' ')[0];
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <AlertCircle size={48} color="#ef4444" />
          <p style={{ marginTop: '16px', color: '#64748b' }}>Error: {error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 3px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .premium-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .premium-card:hover { transform: translateY(-8px); box-shadow: 0 25px 40px -12px rgba(0,0,0,0.25); }
        .premium-card:hover .card-image { transform: scale(1.08); }
        .card-image { transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
        @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          bottom: '16px',
          width: sidebarCollapsed ? '72px' : '256px',
          background: '#0a0f1e',
          borderRadius: '20px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.05)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 32px 64px -16px rgba(0,0,0,0.4)'
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <img
              src={logoImg}
              alt="Ovijan Logo"
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'contain',
                borderRadius: '10px'
              }}
            />
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6, y: 3 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '17px',
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap'
                  }}>
                  Ovijan
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Primary nav */}
        <div style={{ padding: '4px 10px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {primaryNavItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            const isOpen = openSubmenu === item.id;

            return (
              <div key={item.id}>
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.01, duration: 0.2, ease: "easeOut" }}
                  style={{ position: 'relative' }}
                >
                  <motion.button
                    onClick={() => item.hasSubmenu ? toggleSubmenu(item.id) : handleNavigation(item)}
                    className="nav-item"
                    whileHover={!isActive ? { scale: 1.02 } : {}}
                    transition={{ type: "spring", stiffness: 500, damping: 12, mass: 0.8 }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      minHeight: '46px',
                      padding: '0 12px',
                      justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                      background: isActive ? 'rgba(16,185,129,0.12)' : 'transparent',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      marginBottom: '2px',
                      color: isActive ? '#10b981' : 'rgba(255,255,255,0.5)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'background 0.12s ease, color 0.12s ease'
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                      }
                    }}
                  >
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '20%',
                        bottom: '20%',
                        width: '3px',
                        background: '#10b981',
                        borderRadius: '0 3px 3px 0'
                      }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={18} style={{ flexShrink: 0 }} />
                      <AnimatePresence mode="wait">
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.12, ease: "easeOut" }}
                            style={{
                              fontSize: '13px',
                              fontWeight: isActive ? '600' : '400',
                              whiteSpace: 'nowrap',
                              letterSpacing: '-0.01em',
                              overflow: 'hidden'
                            }}>
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {!sidebarCollapsed && item.hasSubmenu && (
                      <ChevronDown
                        size={14}
                        style={{
                          transition: 'transform 0.2s ease',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                      />
                    )}
                  </motion.button>
                </motion.div>

                {/* Submenu Items */}
                {!sidebarCollapsed && item.hasSubmenu && isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      marginLeft: '28px',
                      marginBottom: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Main Dashboard Link */}
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0 }}
                      onClick={() => {
                        navigate('/dashboard');
                        setActiveNav('dashboard');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        background: activeNav === 'dashboard' ? 'rgba(16,185,129,0.08)' : 'transparent',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        marginBottom: '4px',
                        color: activeNav === 'dashboard' ? '#10b981' : 'rgba(255,255,255,0.5)',
                        fontSize: '12.5px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                      }}
                    >
                      <LayoutDashboard size={14} />
                      <span style={{ flex: 1, textAlign: 'left' }}>Main Dashboard</span>
                    </motion.button>

                    {/* Divider */}
                    <div style={{
                      height: '1px',
                      background: 'rgba(255,255,255,0.06)',
                      margin: '8px 8px',
                    }} />

                    {/* Countries Section Header */}
                    <div style={{
                      padding: '6px 12px',
                      fontSize: '10px',
                      fontWeight: '600',
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      Countries
                    </div>

                    {/* Dynamic Country Links */}
                    {item.submenuItems.map((country) => {
                      const CountryIcon = country.icon;
                      const isCountryActive = activeNav === country.id;
                      return (
                        <button
                          key={country.id}
                          onClick={() => handleNavigation(item, country)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            background: isCountryActive ? 'rgba(16,185,129,0.08)' : 'transparent',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: isCountryActive ? '#10b981' : 'rgba(255,255,255,0.5)',
                            fontSize: '12px',
                            transition: 'all 0.15s ease',
                            marginBottom: '2px'
                          }}
                          onMouseEnter={e => {
                            if (!isCountryActive) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isCountryActive) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                            }
                          }}
                        >
                          {country.flag ? (
                            <span style={{ fontSize: '14px' }}>{country.flag}</span>
                          ) : (
                            <CountryIcon size={14} />
                          )}
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {country.label}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', margin: '4px 16px' }} />

        {/* Secondary nav */}
        <div style={{ padding: '8px 10px 10px', flexShrink: 0 }}>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ padding: '4px 4px 8px' }}
            >
              <span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Account
              </span>
            </motion.div>
          )}

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isLogout = item.id === 'logout';
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className="nav-item"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500, damping: 12, mass: 0.8 }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  minHeight: '46px',
                  padding: '0 12px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  marginBottom: '2px',
                  color: isLogout ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.4)',
                  transition: 'background 0.12s ease, color 0.12s ease'
                }}
                onMouseEnter={e => {
                  if (isLogout) {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                    e.currentTarget.style.color = '#f87171';
                  } else {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                  }
                }}
                onMouseLeave={e => {
                  if (isLogout) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(239,68,68,0.6)';
                  } else {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      style={{
                        fontSize: '13.5px',
                        fontWeight: '400',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                      }}>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarCollapsed ? '100px' : '288px', transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', minHeight: '100vh', padding: '16px 20px 32px' }}>

        {/* Premium Navbar */}
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            marginBottom: '28px',
            boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -6px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={16} color="white" />
                </div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, color: '#0a0f1e', letterSpacing: '-0.03em' }}>
                  Global <span style={{ color: '#10b981' }}>Universities</span>
                </h1>
              </div>
              <p style={{ color: '#94a3b8', margin: '0', fontSize: '13px' }}>Discover {filteredUniversities.length}+ top-tier institutions worldwide</p>
            </div>

            <div style={{ position: 'relative', minWidth: '280px', maxWidth: '400px', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by university name, location, or country..."
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: '1.5px solid #e9ecef',
                  borderRadius: '14px',
                  fontSize: '14px',
                  outline: 'none',
                  background: '#fafbfc',
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.15s'
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = 'white'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.background = '#fafbfc'; }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: showFilters ? '#0a0f1e' : '#f8fafc',
                  border: `1.5px solid ${showFilters ? '#0a0f1e' : '#e9ecef'}`,
                  borderRadius: '40px',
                  fontSize: '13px',
                  color: showFilters ? 'white' : '#475569',
                  cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '500',
                  transition: 'all 0.15s'
                }}
              >
                <Filter size={15} />
                <span>Filters</span>
                {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', cursor: 'pointer' }}>
                  {getInitials()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ background: 'white', borderRadius: '20px', marginBottom: '28px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 12px -4px rgba(0,0,0,0.06)' }}
            >
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>University Type</label>
                    <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
                      <option value="all">All Types</option>
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Country</label>
                    <select value={filters.countryId} onChange={(e) => setFilters({ ...filters, countryId: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
                      <option value="all">All Countries</option>
                      {countries.map(country => <option key={country.id} value={country.id}>{country.flag} {country.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Ranking (≤)</label>
                    <input type="number" placeholder="e.g., 100" value={filters.minRanking} onChange={(e) => setFilters({ ...filters, minRanking: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#f8fafc', fontFamily: "'Outfit', sans-serif" }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Tuition (USD)</label>
                    <input type="number" placeholder="e.g., 50000" value={filters.maxTuition} onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#f8fafc', fontFamily: "'Outfit', sans-serif" }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort By</label>
                    <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
                      <option value="ranking">Ranking (Best First)</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="tuition_low">Tuition (Low to High)</option>
                      <option value="tuition_high">Tuition (High to Low)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>
                      Showing <span style={{ color: '#10b981', fontWeight: '700' }}>{filteredUniversities.length}</span> universities
                    </span>
                  </div>
                  <button onClick={clearFilters}
                    style={{ padding: '8px 20px', background: '#f8fafc', border: '1px solid #e9ecef', borderRadius: '40px', fontSize: '12px', color: '#64748b', cursor: 'pointer', fontWeight: '500', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#10b981'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e9ecef'; }}>
                    Clear All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Universities Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {!loading && filteredUniversities.map((uni, idx) => (
            <div
              key={uni.id || idx}
              className="premium-card"
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -6px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.04)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredCard === idx ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredCard === idx ? '0 25px 40px -12px rgba(0,0,0,0.25)' : '0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -6px rgba(0,0,0,0.08)'
              }}
            >
              {/* Image Section */}
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <img
                  src={getImageUrl(uni.image_url)}
                  alt={uni.name}
                  className="card-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: hoveredCard === idx ? 'scale(1.08)' : 'scale(1)',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onError={(e) => {
                    e.target.src = '/images/university-placeholder.jpg';
                    e.target.onerror = null;
                  }}
                  loading="lazy"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.9) 0%, rgba(10,15,30,0.2) 55%, transparent 100%)' }} />

                {/* Rank Badge */}
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <div style={{
                    background: 'rgba(16,185,129,0.95)',
                    backdropFilter: 'blur(8px)',
                    padding: '6px 14px',
                    borderRadius: '40px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'white', letterSpacing: '0.5px' }}>
                      #{uni.ranking || 'TOP'}
                    </span>
                  </div>
                </div>

                {/* Type Badge */}
                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(8px)',
                    padding: '6px 14px',
                    borderRadius: '40px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#0f172a' }}>{uni.type || 'University'}</span>
                  </div>
                </div>

                {/* University Info Overlay */}
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white', margin: '0 0 6px', letterSpacing: '-0.02em', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                    {uni.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="rgba(255,255,255,0.8)" />
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{uni.location}, {uni.country_name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px' }}>
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
                    <DollarSign size={14} color="#059669" style={{ margin: '0 auto 6px' }} />
                    <p style={{ fontSize: '9px', fontWeight: '700', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tuition</p>
                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      {uni.tuition ? formatCurrency(uni.tuition) : 'Varies'}
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
                    <Users size={14} color="#10b981" style={{ margin: '0 auto 6px' }} />
                    <p style={{ fontSize: '9px', fontWeight: '700', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Students</p>
                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{uni.students || '25k+'}</p>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
                    <Star size={14} color="#f59e0b" style={{ margin: '0 auto 6px' }} />
                    <p style={{ fontSize: '9px', fontWeight: '700', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</p>
                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{uni.rating || '4.5'} ★</p>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.55', margin: '0 0 20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {uni.description || `${uni.name} is a prestigious institution offering world-class education and research opportunities.`}
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={(e) => handleDetailsClick(uni, e)}
                    style={{
                      flex: 1,
                      padding: '11px',
                      border: '1.5px solid #e9ecef',
                      background: 'white',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.background = 'white'; }}
                  >
                    <Eye size={12} /> Details
                  </button>
                  <button
                    onClick={(e) => handleApplyClick(uni, e)}
                    style={{
                      flex: 1,
                      padding: '11px',
                      background: hoveredCard === idx ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.3s ease',
                      boxShadow: hoveredCard === idx ? '0 4px 12px rgba(16,185,129,0.4)' : 'none'
                    }}
                  >
                    <Send size={12} /> Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="skeleton" style={{ height: '220px', width: '100%' }} />
                <div style={{ padding: '20px' }}>
                  <div className="skeleton" style={{ height: '60px', borderRadius: '12px', marginBottom: '20px' }} />
                  <div className="skeleton" style={{ height: '40px', borderRadius: '12px', marginBottom: '20px' }} />
                  <div className="skeleton" style={{ height: '45px', borderRadius: '12px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredUniversities.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: 'white', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <Building size={56} style={{ color: '#cbd5e1', margin: '0 auto 20px', display: 'block' }} />
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#0a0f1e', margin: '0 0 12px' }}>No universities found</p>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 24px' }}>Try adjusting your filters or search criteria</p>
            <button onClick={clearFilters}
              style={{ padding: '12px 32px', background: '#10b981', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
              Clear All Filters
            </button>
          </div>
        )}

        {/* Premium CTA Section */}
        <div
          style={{
            marginTop: '48px',
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)',
            borderRadius: '28px',
            padding: '48px 56px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(16,185,129,0.2)'
          }}
        >
          <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={20} color="#10b981" />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Premium Consultation</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', margin: '0 0 12px', letterSpacing: '-0.03em' }}>Need Help Choosing the <br />Right University?</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', maxWidth: '480px', margin: 0, lineHeight: '1.6' }}>
                Get personalized guidance from our expert counselors. We'll help you find the perfect university that matches your academic profile and career goals.
              </p>
            </div>
            <button
              onClick={() => navigate('/consultation')}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(16,185,129,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.3)'; }}
            >
              Book Consultation <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && selectedUniForApply && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ background: 'white', borderRadius: '28px', maxWidth: '520px', width: '90%', maxHeight: '85vh', overflow: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '28px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#0a0f1e', letterSpacing: '-0.03em' }}>Apply to University</h2>
                  <button onClick={() => setShowApplyModal(false)} style={{ background: '#f8fafc', border: '1px solid #e9ecef', borderRadius: '12px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={18} />
                  </button>
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{selectedUniForApply.name} • {selectedUniForApply.country_name}</p>
              </div>

              <div style={{ padding: '28px' }}>
                {submitSuccess ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ width: '64px', height: '64px', background: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <CheckCircle size={32} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#0a0f1e' }}>Application Submitted!</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Your application has been successfully submitted.</p>
                    <button onClick={() => setShowApplyModal(false)} style={{ padding: '12px 28px', background: '#10b981', color: 'white', border: 'none', borderRadius: '40px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitApplication}>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px' }}>Program Name *</label>
                      <input
                        type="text"
                        name="program_name"
                        value={applicationData.program_name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Bachelor of Science in Computer Science"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1.5px solid #e9ecef',
                          borderRadius: '14px',
                          fontSize: '14px',
                          outline: 'none',
                          fontFamily: "'Outfit', sans-serif",
                          transition: 'border-color 0.15s'
                        }}
                        onFocus={e => e.target.style.borderColor = '#10b981'}
                        onBlur={e => e.target.style.borderColor = '#e9ecef'}
                      />
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px' }}>Additional Notes</label>
                      <textarea
                        name="notes"
                        value={applicationData.notes}
                        onChange={handleInputChange}
                        placeholder="Any additional information you'd like to share..."
                        rows="4"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1.5px solid #e9ecef',
                          borderRadius: '14px',
                          fontSize: '14px',
                          outline: 'none',
                          fontFamily: "'Outfit', sans-serif",
                          resize: 'vertical',
                          transition: 'border-color 0.15s'
                        }}
                        onFocus={e => e.target.style.borderColor = '#10b981'}
                        onBlur={e => e.target.style.borderColor = '#e9ecef'}
                      />
                    </div>

                    {submitError && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertCircle size={16} color="#dc2626" />
                        <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{submitError}</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '14px' }}>
                      <button
                        type="button"
                        onClick={() => setShowApplyModal(false)}
                        style={{
                          flex: 1,
                          padding: '14px',
                          border: '1.5px solid #e9ecef',
                          background: 'white',
                          borderRadius: '14px',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#e9ecef'}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          flex: 1,
                          padding: '14px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '14px',
                          fontWeight: '700',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          opacity: submitting ? 0.7 : 1
                        }}
                      >
                        {submitting ? (
                          <>
                            <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send size={14} /> Submit Application
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllUniversities;