import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Bell, X, LogOut, Search, FileText,
  CheckCircle, Clock, AlertCircle, Eye, Filter,
  LayoutDashboard, Calendar, BellRing, Users,
  TrendingUp, Star, Settings, UserCircle, Library,
  Home, DollarSign, GraduationCap, Shield, Compass,
  MessageSquare, Target, Zap, Upload, Send, UserPlus,
  Heart, Share2, Award, Globe, Bookmark, ExternalLink,
  Sparkles, Crown, Diamond, Leaf, TreePine, Flower2,
  ChevronRight, ChevronLeft, SlidersHorizontal, MapPin,
  BarChart3, Cpu, Menu, ArrowUpRight, BadgeCheck,
  TrendingDown, Activity, Percent, Building, ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Import all country images explicitly
import usaImg from '../images/usa.jpg';
import ukImg from '../images/uk.jpg';
import canadaImg from '../images/canada.jpg';
import australiaImg from '../images/australia.jpg';
import germanyImg from '../images/germany.jpg';
import franceImg from '../images/france.jpg';
import irelandImg from '../images/ireland.jpg';
import italiImg from '../images/itali.jpeg';
import japanImg from '../images/japan.jpg';
import netherlandsImg from '../images/netherlands.jpg';
import spainImg from '../images/spain.jpg';
import swedenImg from '../images/sweden.jpg';

// Create a mapping object
const imageMap = {
  'usa.jpg': usaImg,
  'uk.jpg': ukImg,
  'canada.jpg': canadaImg,
  'australia.jpg': australiaImg,
  'germany.jpg': germanyImg,
  'france.jpg': franceImg,
  'ireland.jpg': irelandImg,
  'itali.jpeg': italiImg,
  'japan.jpg': japanImg,
  'netherlands.jpg': netherlandsImg,
  'spain.jpg': spainImg,
  'sweden.jpg': swedenImg,
};

// Helper function
const getCountryImage = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return imageMap[imageUrl] || null;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ countries: [], universities: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [tuitionRange, setTuitionRange] = useState([0, 100]);
  const [visaRange, setVisaRange] = useState([0, 100]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const filterRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = userData.name || 'Student';
  const userEmail = userData.email || '';
  const userId = localStorage.getItem('userId') || userData.userID || null;

  // Simulate loading progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Fetch countries
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/countries')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        setFilteredCountries(data);
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => setIsPageLoaded(true), 100);
        }, 500);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load data');
        setLoading(false);
        setIsPageLoaded(true);
      });
  }, []);

  // Fetch universities
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/universities')
      .then(res => res.json())
      .then(data => {
        const uniData = data.data || data || [];
        setUniversities(uniData);
      })
      .catch(err => console.error('Error fetching universities:', err));
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...countries];
    result = result.filter(country => {
      const visaRate = parseFloat(country.visa_success_rate) || 85;
      return visaRate >= visaRange[0] && visaRate <= visaRange[1];
    });
    setFilteredCountries(result);
  }, [visaRange, countries]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults({ countries: [], universities: [] });
      setShowSearchResults(false);
      return;
    }
    const query = searchQuery.toLowerCase();
    const matchedCountries = countries.filter(country =>
      country.name?.toLowerCase().includes(query) ||
      (country.capital && country.capital.toLowerCase().includes(query))
    );
    const matchedUniversities = universities.filter(uni =>
      uni.name?.toLowerCase().includes(query) ||
      (uni.location && uni.location.toLowerCase().includes(query))
    );
    setSearchResults({ countries: matchedCountries, universities: matchedUniversities });
    setShowSearchResults(true);
  }, [searchQuery, countries, universities]);

  // Load saved notifications from localStorage
  const loadSavedNotifications = () => {
    const savedNotifications = localStorage.getItem(`notifications_${userId}`);
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      const unread = parsed.filter(n => !n.read).length;
      setUnreadCount(unread);
    }
  };

  // Save notifications to localStorage
  const saveNotifications = (updatedNotifications) => {
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    const unread = updatedNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    const updated = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    saveNotifications(updated);
    
    // Also update on server if you have an endpoint
    try {
      await fetch(`http://127.0.0.1:8000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    saveNotifications(updated);
    
    try {
      await fetch(`http://127.0.0.1:8000/api/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // Fetch user applications and create notifications
  const fetchUserApplications = async () => {
    if (!userId) return;
    setNotificationsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/applications/user/${userId}`);
      const data = await response.json();
      const applicationsList = data.data || data || [];
      setApplications(applicationsList);
      
      // Load existing notifications
      loadSavedNotifications();
      
      // Check for status changes and create notifications
      const existingNotifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
      const existingAppIds = existingNotifications.map(n => n.applicationId);
      
      applicationsList.forEach(app => {
        // Create notification if status changed and not already notified
        if (!existingAppIds.includes(app.id)) {
          const newNotification = {
            id: Date.now() + Math.random(),
            applicationId: app.id,
            title: `${app.university_name || 'Application'} Status Update`,
            message: `Your application status has been updated to ${app.status || 'Pending'}`,
            status: app.status,
            read: false,
            createdAt: new Date().toISOString(),
            universityName: app.university_name,
            countryName: app.country_name
          };
          existingNotifications.unshift(newNotification);
        }
      });
      
      // Also check for status changes in existing applications
      const updatedNotifications = existingNotifications.map(notif => {
        const matchingApp = applicationsList.find(app => app.id === notif.applicationId);
        if (matchingApp && matchingApp.status !== notif.status && notif.status !== matchingApp.status) {
          return {
            ...notif,
            status: matchingApp.status,
            message: `Your application status has been updated to ${matchingApp.status}`,
            read: false,
            updatedAt: new Date().toISOString()
          };
        }
        return notif;
      });
      
      saveNotifications(updatedNotifications);
      
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Poll for application status updates every 30 seconds
  useEffect(() => {
    if (userId) {
      fetchUserApplications();
      const interval = setInterval(fetchUserApplications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuActive(false);
    };
    window.addEventListener("resize", handleResize);
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = () => userName.charAt(0).toUpperCase();
  const handleCountryClick = (countryName, countryId) => navigate('/universities', { state: { countryName, countryId } });
  
  const handleNotificationClick = () => { 
    fetchUserApplications(); 
    setShowNotifications(true); 
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle, label: 'ACCEPTED' };
      case 'rejected': return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: X, label: 'REJECTED' };
      case 'under review': return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Clock, label: 'UNDER REVIEW' };
      default: return { color: '#64748b', bg: 'rgba(100,116,139,0.1)', icon: Clock, label: 'PENDING' };
    }
  };

  const formatCurrency = (value, symbol = '$') => {
    if (!value) return 'Varies';
    const numericMatch = value.match(/\d[\d,]*/);
    if (numericMatch) {
      return `${symbol}${numericMatch[0]}`;
    }
    return value.split(' ')[0];
  };

  // Get notification icon based on status
  const getNotificationIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return <CheckCircle size={18} color="#10b981" />;
      case 'rejected': return <X size={18} color="#ef4444" />;
      case 'under review': return <Clock size={18} color="#f59e0b" />;
      default: return <BellRing size={18} color="#10b981" />;
    }
  };

  // Get time ago string
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Updated navigation items with submenu support
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
        path: `/universities`,
        state: { countryName: country.name, countryId: country.id },
        flag: country.flag,
        icon: Globe
      }))
    },
    { id: 'all-universities', icon: Building, label: 'Universities', path: '/all-universities' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', path: '/calendar' },
    { id: 'community', icon: Users, label: 'Community', path: '/community' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'bookmarks', icon: Bookmark, label: 'Saved', path: '/bookmarks' },
    { id: 'visa', icon: Shield, label: 'Visa Tracker', path: '/visatracker' },
    { id: 'visaguide', icon: FileText , label: 'Visa Application', path: '/visaguide' },
  ];

  const secondaryNavItems = [
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    { id: 'profile', icon: UserCircle, label: 'Profile', path: '/profile' },
    { id: 'logout', icon: LogOut, label: 'Logout', action: () => { localStorage.clear(); navigate('/login'); } },
  ];

  const handleNavigation = (item, submenuItem = null) => {
    if (submenuItem) {
      setActiveNav(submenuItem.id);
      navigate(submenuItem.path, { state: submenuItem.state });
    } else if (item.action) {
      item.action();
    } else if (item.path) {
      setActiveNav(item.id);
      navigate(item.path);
    }
    setIsMobileMenuActive(false);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (itemId) => {
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #030712 0%, #0f172a 50%, #030712 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Outfit', sans-serif"
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');`}</style>

        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: '2px',
                height: '2px',
                background: '#10b981',
                borderRadius: '50%'
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            zIndex: 2
          }}
        >
          {/* Lottie Animation */}
          <div style={{ width: '320px', height: '320px', margin: '0 auto' }}>
            <DotLottieReact
              src="https://lottie.host/bb6fb785-ec0a-4144-aed6-c955583b3ea3/W3yUjx7AG4.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: 'white',
              marginTop: '24px',
              background: 'linear-gradient(135deg, #10b981, #6ee7b7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Loading your experience...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.875rem',
              marginTop: '12px'
            }}
          >
            Please wait while we prepare everything for you
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#030712', color: 'white', fontFamily: "'Outfit', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');`}</style>
        <AlertCircle size={56} color="#ef4444" />
        <p style={{ marginTop: '20px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>Error: {error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '28px', padding: '12px 28px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .nav-item { transition: all 0.2s ease; }
        .nav-item:hover { background: rgba(16,185,129,0.08) !important; }
        .nav-item.active { background: rgba(16,185,129,0.12) !important; }
        .country-card { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
        .country-card:hover { transform: translateY(-6px) !important; box-shadow: 0 24px 48px -12px rgba(0,0,0,0.18) !important; }
        .country-card:hover .card-img { transform: scale(1.06) !important; }
        .explore-btn { transition: all 0.25s ease; }
        .explore-btn:hover { background: linear-gradient(135deg,#10b981,#059669) !important; color: white !important; border-color: transparent !important; }
        .stat-card { transition: all 0.25s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px -8px rgba(0,0,0,0.12) !important; }
        .notification-item { transition: all 0.2s ease; }
        .notification-item:hover { transform: translateX(-4px); }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 4px; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #10b981; cursor: pointer; border: 2px solid white; box-shadow: 0 2px 6px rgba(16,185,129,0.4); }
        input[type=range]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #10b981; cursor: pointer; border: 2px solid white; box-shadow: 0 2px 6px rgba(16,185,129,0.4); }
        .smooth-appear { animation: fadeInScale 0.5s ease-out forwards; }
        .submenu-enter { animation: fadeInScale 0.2s ease-out forwards; }
        .unread-dot { animation: pulse 1.5s infinite; }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          bottom: '20px',
          width: sidebarCollapsed ? '68px' : '260px',
          background: '#0a0f1e',
          borderRadius: '16px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease-out',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>

        {/* Logo Section */}
        <div style={{
          padding: '20px 16px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          height: '72px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <img
              src="/src/images/logo.png"
              alt="Logo"
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'contain',
                borderRadius: '10px'
              }}
            />
            {!sidebarCollapsed && (
              <span
                style={{
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '17px',
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap',
                  opacity: 1,
                  marginTop: '8px',
                }}>
                Ovijan
              </span>
            )}
          </div>
        </div>

        {/* Primary Navigation */}
        <div style={{
          padding: '8px 12px',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            const isOpen = openSubmenu === item.id;
            
            return (
              <div key={item.id}>
                <motion.button
                  onClick={() => item.hasSubmenu ? toggleSubmenu(item.id) : handleNavigation(item)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '40px',
                    padding: '0 12px',
                    justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                    background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    color: isActive ? '#10b981' : 'rgba(255,255,255,0.6)',
                    transition: 'background 0.15s ease, color 0.15s ease',
                    fontSize: '13px',
                    fontWeight: isActive ? '500' : '400',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    <Icon size={18} style={{ flexShrink: 0 }} />
                    {!sidebarCollapsed && (
                      <span style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                      }}>
                        {item.label}
                      </span>
                    )}
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
        <div style={{
          height: '1px',
          background: 'rgba(255,255,255,0.06)',
          margin: '4px 16px'
        }} />

        {/* Secondary Navigation */}
        <div style={{ padding: '12px', flexShrink: 0 }}>
          {!sidebarCollapsed && (
            <div style={{ padding: '0 12px 8px 12px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '500',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Account
              </span>
            </div>
          )}

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isLogout = item.id === 'logout';
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  height: '40px',
                  padding: '0 12px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  color: isLogout ? '#ef4444' : 'rgba(255,255,255,0.5)',
                  transition: 'background 0.15s ease, color 0.15s ease',
                  fontSize: '13px',
                  fontWeight: '400'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = isLogout
                    ? 'rgba(239,68,68,0.1)'
                    : 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = isLogout
                    ? '#f87171'
                    : 'rgba(255,255,255,0.8)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = isLogout
                    ? '#ef4444'
                    : 'rgba(255,255,255,0.5)';
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && (
                  <span style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }}>
                    {item.label}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ marginLeft: sidebarCollapsed ? '100px' : '288px', transition: 'margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)', minHeight: '100vh', padding: '16px 20px 32px' }}>

        {/* ─── NAVBAR ─── */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'white',
            padding: '14px 24px',
            borderRadius: '16px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 1px 0 0 rgba(0,0,0,0.05), 0 4px 12px -4px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}
        >
          <div>
            <p style={{ color: '#94a3b8', margin: '2px 0 0', fontSize: '13px', fontWeight: '400' }}>Your study abroad journey starts here</p>
          </div>

          {/* Search */}
          <div style={{ flex: 2, position: 'relative', minWidth: '260px', maxWidth: '460px' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search countries, universities..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                border: '1.5px solid #e9ecef',
                borderRadius: '12px',
                fontSize: '13.5px',
                outline: 'none',
                color: '#0a0f1e',
                background: '#f8fafc',
                fontFamily: "'Outfit', sans-serif",
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#10b981'}
              onBlur={e => e.currentTarget.style.borderColor = '#e9ecef'}
            />
            <AnimatePresence>
              {showSearchResults && (searchResults.countries.length > 0 || searchResults.universities.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderRadius: '14px',
                    boxShadow: '0 20px 40px -8px rgba(0,0,0,0.12)',
                    maxHeight: '380px',
                    overflowY: 'auto',
                    zIndex: 100,
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  {searchResults.countries.length > 0 && (
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px', paddingLeft: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Countries</h4>
                      {searchResults.countries.map(country => (
                        <button
                          key={country.id}
                          onClick={() => { setShowSearchResults(false); setSearchQuery(''); handleCountryClick(country.name, country.id); }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '9px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '10px',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span style={{ fontSize: '1.3rem' }}>{country.flag}</span>
                          <div>
                            <p style={{ fontWeight: '600', margin: 0, color: '#0a0f1e', fontSize: '13.5px' }}>{country.name}</p>
                            <p style={{ fontSize: '11.5px', margin: 0, color: '#94a3b8' }}>{country.capital}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.universities.length > 0 && (
                    <div style={{ padding: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <h4 style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px', paddingLeft: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Universities</h4>
                      {searchResults.universities.map(uni => (
                        <button
                          key={uni.id}
                          onClick={() => { setShowSearchResults(false); setSearchQuery(''); navigate(`/university/${uni.id}`); }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '9px 10px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '10px',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <p style={{ fontWeight: '600', margin: 0, color: '#0a0f1e', fontSize: '13.5px' }}>{uni.name}</p>
                          <p style={{ fontSize: '11.5px', margin: 0, color: '#94a3b8' }}>{uni.location}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleNotificationClick}
              style={{
                width: '40px',
                height: '40px',
                background: '#f8fafc',
                border: '1.5px solid #e9ecef',
                borderRadius: '12px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e9ecef'}
            >
              <Bell size={17} style={{ color: '#64748b' }} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '20px',
                  fontWeight: '700',
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  animation: 'pulse 1.5s infinite'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', cursor: 'pointer' }}>{getInitials()}</div>
          </div>
        </motion.div>

        {/* ─── COUNTRIES SECTION ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{ color: '#10b981', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}
              >
                Explore
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, color: '#0a0f1e', letterSpacing: '-0.03em' }}
              >
                Top Destinations
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '13px' }}
              >
                {filteredCountries.length} destinations available
              </motion.p>
            </div>

            {/* Filter Button */}
            <div ref={filterRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFilter(!showFilter)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: showFilter ? '#0a0f1e' : 'white',
                  border: `1.5px solid ${showFilter ? '#0a0f1e' : '#e9ecef'}`,
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  color: showFilter ? 'white' : '#475569',
                  cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                <SlidersHorizontal size={15} />
                <span>Filter</span>
                {(visaRange[0] > 0 || visaRange[1] < 100) && (
                  <span style={{ background: '#10b981', color: 'white', width: '18px', height: '18px', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>!</span>
                )}
              </button>

              <AnimatePresence>
                {showFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: '300px',
                      background: 'white',
                      borderRadius: '18px',
                      boxShadow: '0 24px 48px -12px rgba(0,0,0,0.16)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      padding: '20px',
                      zIndex: 200
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0a0f1e' }}>Filter Destinations</h3>
                      <button
                        onClick={() => { setVisaRange([0, 100]); setTuitionRange([0, 100]); }}
                        style={{
                          fontSize: '12px',
                          color: '#10b981',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: '600',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        Reset all
                      </button>
                    </div>

                    {/* Visa Success Rate Range */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#475569', letterSpacing: '0.02em' }}>Visa Success Rate</label>
                        <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#10b981' }}>{visaRange[0]}% – {visaRange[1]}%</span>
                      </div>
                      <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', left: 0, right: 0, height: '4px', background: '#e9ecef', borderRadius: '4px' }}>
                          <div style={{ position: 'absolute', left: `${visaRange[0]}%`, right: `${100 - visaRange[1]}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '4px' }} />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={visaRange[0]}
                          onChange={e => setVisaRange([Math.min(Number(e.target.value), visaRange[1] - 5), visaRange[1]])}
                          style={{ position: 'absolute', width: '100%', background: 'transparent', pointerEvents: 'auto' }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={visaRange[1]}
                          onChange={e => setVisaRange([visaRange[0], Math.max(Number(e.target.value), visaRange[0] + 5)])}
                          style={{ position: 'absolute', width: '100%', background: 'transparent', pointerEvents: 'auto' }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>0%</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>100%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowFilter(false)}
                      style={{
                        width: '100%',
                        padding: '11px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        fontFamily: "'Outfit', sans-serif",
                        boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                      }}
                    >
                      Apply Filters ({filteredCountries.length} results)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Countries Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
            {filteredCountries.map((country, idx) => {
              const imageSrc = getCountryImage(country.image_url);

              return (
                <motion.div
                  key={country.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="country-card"
                  onClick={() => handleCountryClick(country.name, country.id)}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === idx ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: hoveredCard === idx ? '0 20px 25px -12px rgba(0,0,0,0.15)' : '0 1px 0 rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.06)'
                  }}
                >
                  {/* Image Section */}
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={country.name}
                        className="card-img"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          transform: hoveredCard === idx ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onError={(e) => {
                          console.error(`Failed to load image for ${country.name}: ${imageSrc}`);
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, #0f172a, #1e293b)';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #0f172a, #1e293b)'
                      }}>
                        <span style={{ fontSize: '3rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)' }}>
                          {country.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(10,15,30,0.85) 0%, rgba(10,15,30,0.2) 55%, transparent 100%)'
                    }} />

                    {/* Top badges */}
                    <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '8px', zIndex: 2 }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(12px)',
                        padding: '6px 12px',
                        borderRadius: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}>
                        <span style={{ fontSize: '1.2rem' }}>{country.flag || '🌍'}</span>
                        <span style={{ fontWeight: '700', color: '#0a0f1e', fontSize: '13px' }}>{country.name}</span>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      display: 'flex',
                      gap: '8px',
                      opacity: hoveredCard === idx ? 1 : 0,
                      transition: 'opacity 0.25s ease',
                      zIndex: 2
                    }}>
                      <button onClick={(e) => e.stopPropagation()} style={{ background: 'rgba(255,255,255,0.95)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <Heart size={14} color="#ef4444" />
                      </button>
                      <button onClick={(e) => e.stopPropagation()} style={{ background: 'rgba(255,255,255,0.95)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <Share2 size={14} color="#64748b" />
                      </button>
                    </div>

                    {/* Bottom image info */}
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2 }}>
                      <div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', margin: '0 0 2px', letterSpacing: '-0.02em', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                          {country.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={11} color="rgba(255,255,255,0.8)" />
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{country.capital || 'N/A'}</p>
                        </div>
                      </div>
                      <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', backdropFilter: 'blur(8px)', padding: '5px 12px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}>
                        <Crown size={11} color="white" />
                        <span style={{ fontSize: '10px', fontWeight: '700', color: 'white', letterSpacing: '0.5px' }}>PREMIUM</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
                      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '10px 8px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
                          <GraduationCap size={12} color="#059669" />
                          <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tuition</span>
                        </div>
                        <p style={{ fontWeight: '700', fontSize: '11px', color: '#0f172a', margin: 0, lineHeight: '1.3' }}>
                          {country.avg_tuition ? country.avg_tuition.split(' ')[0] : 'Varies'}
                        </p>
                      </div>

                      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '10px 8px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
                          <Shield size={12} color="#10b981" />
                          <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Visa Rate</span>
                        </div>
                        <p style={{ fontWeight: '700', fontSize: '13px', color: '#10b981', margin: 0 }}>
                          {country.visa_success_rate || '85%'}
                        </p>
                      </div>

                      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '10px 8px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
                          <Award size={12} color="#f59e0b" />
                          <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Living Cost</span>
                        </div>
                        <p style={{ fontWeight: '700', fontSize: '10px', color: '#0f172a', margin: 0, lineHeight: '1.3' }}>
                          {country.avg_living_cost ? country.avg_living_cost.split('/')[0] : 'Varies'}
                        </p>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.55', margin: '0 0 18px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {country.description || `${country.name} offers world-class education with excellent post-study work opportunities and visa pathways.`}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', padding: '10px', background: '#f1f5f9', borderRadius: '12px', fontSize: '11px' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '10px' }}>Language</span>
                        <p style={{ fontWeight: '600', color: '#0f172a', margin: '2px 0 0' }}>{country.language || 'English'}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: '#64748b', fontSize: '10px' }}>Currency</span>
                        <p style={{ fontWeight: '600', color: '#0f172a', margin: '2px 0 0' }}>{country.currency_symbol || '$'} {country.currency || 'USD'}</p>
                      </div>
                    </div>

                    <button onClick={(e) => { e.stopPropagation(); handleCountryClick(country.name, country.id); }}
                      style={{ width: '100%', padding: '12px 16px', background: hoveredCard === idx ? 'linear-gradient(135deg, #059669, #10b981)' : 'transparent', color: hoveredCard === idx ? 'white' : '#0f172a', border: hoveredCard === idx ? 'none' : '1.5px solid #e9ecef', borderRadius: '12px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s ease' }}>
                      Explore Universities
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredCountries.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}
            >
              <Globe size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px', display: 'block' }} />
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#0a0f1e', margin: '0 0 8px' }}>No destinations match your filters</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px' }}>Try adjusting your range filters</p>
              <button
                onClick={() => { setVisaRange([0, 100]); setTuitionRange([0, 100]); }}
                style={{
                  padding: '10px 24px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13.5px',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* ─── PREMIUM CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            marginTop: '40px',
            background: '#0a0f1e',
            borderRadius: '24px',
            padding: '40px 48px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(16,185,129,0.15)'
          }}
        >
          <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
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
        </motion.div>
      </div>

      {/* ─── NOTIFICATIONS PANEL ─── */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.5)', backdropFilter: 'blur(4px)', zIndex: 200 }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "tween", duration: 0.28 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '460px',
                height: '100%',
                background: 'white',
                zIndex: 201,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.12)'
              }}
            >
              <div style={{ padding: '24px 28px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#0a0f1e', letterSpacing: '-0.02em' }}>Notifications</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>
                    {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      style={{
                        padding: '8px 12px',
                        background: '#f8fafc',
                        border: '1px solid #e9ecef',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#10b981',
                        fontFamily: "'Outfit', sans-serif"
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    style={{
                      padding: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e9ecef',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={17} color="#64748b" />
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {notificationsLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid #f1f5f9', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                ) : notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                    <div style={{ width: '72px', height: '72px', background: '#f8fafc', borderRadius: '20px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BellRing size={32} color="#cbd5e1" />
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#0a0f1e' }}>No notifications yet</p>
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>When your application status changes, you'll see it here</p>
                    <button
                      onClick={() => { setShowNotifications(false); navigate('/all-universities'); }}
                      style={{
                        padding: '11px 24px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '13.5px',
                        fontFamily: "'Outfit', sans-serif"
                      }}
                    >
                      Browse Universities
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notifications.map((notif, idx) => {
                      const statusInfo = getStatusInfo(notif.status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          onClick={() => {
                            markAsRead(notif.id);
                            if (notif.applicationId) {
                              setSelectedApplication(applications.find(app => app.id === notif.applicationId));
                            }
                          }}
                          style={{
                            background: notif.read ? '#ffffff' : '#f0fdf4',
                            borderRadius: '14px',
                            padding: '16px 18px',
                            cursor: 'pointer',
                            border: notif.read ? '1px solid #e9ecef' : '1px solid rgba(16,185,129,0.3)',
                            transition: 'all 0.2s',
                            position: 'relative'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = notif.read ? '#ffffff' : '#f0fdf4'; }}
                          className="notification-item"
                        >
                          {!notif.read && (
                            <div style={{
                              position: 'absolute',
                              top: '16px',
                              right: '16px',
                              width: '8px',
                              height: '8px',
                              background: '#10b981',
                              borderRadius: '50%',
                              animation: 'pulse 1.5s infinite'
                            }} />
                          )}
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              background: notif.read ? '#f8fafc' : 'rgba(16,185,129,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {getNotificationIcon(notif.status)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                                <h3 style={{ fontWeight: '700', margin: 0, color: '#0a0f1e', fontSize: '14px' }}>{notif.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '50px', background: statusInfo.bg }}>
                                  <StatusIcon size={11} color={statusInfo.color} />
                                  <span style={{ fontSize: '10px', fontWeight: '700', color: statusInfo.color, letterSpacing: '0.05em' }}>{statusInfo.label}</span>
                                </div>
                              </div>
                              <p style={{ fontSize: '13px', margin: '0 0 6px', color: '#475569', lineHeight: '1.5' }}>{notif.message}</p>
                              {notif.universityName && (
                                <p style={{ fontSize: '11px', margin: '0', color: '#94a3b8' }}>
                                  {notif.universityName} {notif.countryName && `· ${notif.countryName}`}
                                </p>
                              )}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                <p style={{ fontSize: '10px', margin: 0, color: '#94a3b8' }}>
                                  {getTimeAgo(notif.createdAt)}
                                </p>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notif.id);
                                  }}
                                  style={{
                                    fontSize: '11px',
                                    color: '#10b981',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontFamily: "'Outfit', sans-serif"
                                  }}
                                >
                                  {notif.read ? 'Already read' : 'Mark as read'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Application Details Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'white',
                borderRadius: '20px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '80vh',
                overflow: 'auto',
                padding: '24px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Application Details</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* University Info */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px' }}>{selectedApplication.university_name}</h3>
                <p style={{ color: '#666', margin: 0 }}>{selectedApplication.country_name}</p>
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Program</p>
                  <p style={{ fontWeight: '500', margin: 0 }}>{selectedApplication.program_name || 'Not specified'}</p>
                </div>

                <div>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Status</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: selectedApplication.status === 'Accepted' ? '#10b981' :
                        selectedApplication.status === 'Rejected' ? '#ef4444' : '#f59e0b'
                    }} />
                    <p style={{ fontWeight: '500', margin: 0 }}>{selectedApplication.status || 'Pending'}</p>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Applied Date</p>
                  <p style={{ fontWeight: '500', margin: 0 }}>{selectedApplication.applied_date || 'N/A'}</p>
                </div>

                <div>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Decision Date</p>
                  <p style={{ fontWeight: '500', margin: 0 }}>{selectedApplication.decision_date || 'Pending'}</p>
                </div>
              </div>

              {selectedApplication.notes && (
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Notes</p>
                  <p style={{ margin: 0, lineHeight: '1.5' }}>{selectedApplication.notes}</p>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setSelectedApplication(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ddd',
                    background: 'white',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedApplication(null);
                    navigate('/all-universities');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Browse More
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;