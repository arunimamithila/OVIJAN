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
  console.log('Original image_url from DB:', imageUrl); // Debug log
  
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            <GraduationCap className="absolute inset-0 m-auto w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-slate-600 font-medium">Loading university details...</p>
          <p className="text-slate-400 text-sm mt-1">Preparing your academic journey</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Unable to Load Data</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/universities')}
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20"
            >
              Browse Universities
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No University Data</h2>
          <button onClick={() => navigate('/universities')} className="mt-4 px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200">Browse Universities</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <style>{`
        .premium-gradient { background: linear-gradient(135deg, #0a0f1a 0%, #0f172a 50%, #0a0f1a 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(12px); }
        .glass-card-dark { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); }
        .hover-lift { transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1); }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 25px 40px -12px rgba(0, 0, 0, 0.2); }
        .tab-active { position: relative; color: #10b981; font-weight: 600; }
        .tab-active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2.5px; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 2px; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .shimmer-text { background: linear-gradient(90deg, #0f172a 0%, #334155 50%, #0f172a 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 3s linear infinite; }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-2px); background: linear-gradient(135deg, #f0fdf4, #ecfdf5); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Premium Navigation Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-card shadow-2xl border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button 
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/universities')} 
              className="flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <ArrowLeft size={18} className="group-hover:text-emerald-600 transition-colors" />
              <span className="text-sm font-medium group-hover:text-emerald-600 transition-colors">Back to Universities</span>
            </motion.button>
            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSaved(!saved)} 
                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Heart size={18} className={`transition-all duration-300 ${saved ? 'fill-emerald-500 stroke-emerald-500' : 'text-slate-600'}`} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Share2 size={18} className="text-slate-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[65vh] min-h-[550px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getImageUrl(universityData.image_url)} 
            alt={universityData.name} 
            className="w-full h-full object-cover transform scale-105"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop'; }}
          />
          <div className="absolute inset-0 premium-gradient opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 animate-fade-in-up">
          <div className="flex flex-wrap gap-3 mb-5">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold rounded-full shadow-lg"
            >
              #{safeRender(universityData.rank)} World University Rank
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="px-3.5 py-1.5 bg-slate-800/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full"
            >
              {safeRender(universityData.type)}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="px-3.5 py-1.5 bg-amber-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full"
            >
              Founded {safeRender(universityData.estavlished)}
            </motion.span>
            {universityData.flag && (
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="px-3.5 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full"
              >
                {universityData.flag} {universityData.country}
              </motion.span>
            )}
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-tight"
          >
            {universityData.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-emerald-300 italic mb-4 flex items-center gap-2"
          >
            <Quote size={28} className="opacity-70" />
            "{safeRender(universityData.motto)}"
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center gap-2 text-slate-300 text-lg"
          >
            <MapPin size={20} />
            <span>{safeRender(universityData.location)}, {safeRender(universityData.country)}</span>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Premium Tabs */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto py-4 scrollbar-hide">
            {['overview', 'departments', 'research', 'cost', 'admissions'].map((tab, idx) => (
              <motion.button 
                key={tab} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setActiveTab(tab)} 
                className={`px-2 py-2 text-sm font-medium capitalize transition-all duration-300 ${
                  activeTab === tab 
                    ? 'tab-active text-emerald-600' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg'
                }`}
              >
                {tab === 'overview' && <Building size={14} className="inline mr-1.5" />}
                {tab === 'departments' && <GraduationCap size={14} className="inline mr-1.5" />}
                {tab === 'research' && <FlaskConical size={14} className="inline mr-1.5" />}
                {tab === 'cost' && <DollarSign size={14} className="inline mr-1.5" />}
                {tab === 'admissions' && <FileText size={14} className="inline mr-1.5" />}
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {universityData.campusStats && universityData.campusStats.map((stat, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="stat-card bg-white rounded-2xl p-5 text-center shadow-lg shadow-slate-200/30 border border-slate-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-center mb-3">
                      <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                        {getIconComponent(stat.icon, 22, "text-emerald-500")}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{safeRender(stat.value)}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{safeRender(stat.label)}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* About Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/30 border border-slate-100 hover:shadow-2xl transition-all duration-500"
                  >
                    <h2 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                      <Building size={24} className="text-emerald-500" />
                      About the University
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg">{safeRender(universityData.description)}</p>
                  </motion.div>

                  {/* Country Information */}
                  {(universityData.capital || universityData.language || universityData.currency || universityData.visa_success_rate) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-3xl p-8 border border-blue-100/50 backdrop-blur-sm"
                    >
                      <h3 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
                        <Globe size={20} className="text-blue-500" />
                        Country & Location Insights
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {universityData.capital && (
                          <div className="bg-white/60 rounded-xl p-3 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Capital</p>
                            <p className="font-semibold text-slate-700 text-lg">{universityData.capital}</p>
                          </div>
                        )}
                        {universityData.language && (
                          <div className="bg-white/60 rounded-xl p-3 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Language</p>
                            <p className="font-semibold text-slate-700 text-lg">{universityData.language}</p>
                          </div>
                        )}
                        {universityData.currency && (
                          <div className="bg-white/60 rounded-xl p-3 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Currency</p>
                            <p className="font-semibold text-slate-700 text-lg">{universityData.currency}</p>
                          </div>
                        )}
                        {universityData.visa_success_rate && (
                          <div className="bg-white/60 rounded-xl p-3 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Visa Success</p>
                            <p className="font-semibold text-emerald-600 text-lg">{universityData.visa_success_rate}</p>
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
                    className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-3xl p-8 border border-emerald-100/50"
                  >
                    <h3 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
                      <TrendingUp size={20} className="text-emerald-500" />
                      Institutional Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{safeRender(universityData.students)}</p>
                        <p className="text-xs text-slate-500 mt-1">Total Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{safeRender(universityData.international_percent)}</p>
                        <p className="text-xs text-slate-500 mt-1">International Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{safeRender(universityData.acceptance_rate)}</p>
                        <p className="text-xs text-slate-500 mt-1">Acceptance Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{safeRender(universityData.undergraduate)}</p>
                        <p className="text-xs text-slate-500 mt-1">Undergraduates</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Sidebar - Contact & Why Choose */}
                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/30 border border-slate-100"
                  >
                    <h3 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 rounded-xl">
                        <Mail size={16} className="text-emerald-600" />
                      </div>
                      Connect With Us
                    </h3>
                    <div className="space-y-4">
                      <motion.a 
                        whileHover={{ x: 5 }}
                        href={`mailto:${universityData.email}`} 
                        className="flex items-center gap-3 text-sm text-slate-600 hover:text-emerald-600 transition-colors group break-all"
                      >
                        <Mail size={16} className="text-slate-400 group-hover:text-emerald-500 flex-shrink-0" />
                        <span className="group-hover:underline">{safeRender(universityData.email)}</span>
                      </motion.a>
                      <motion.a 
                        whileHover={{ x: 5 }}
                        href={`tel:${universityData.phone}`} 
                        className="flex items-center gap-3 text-sm text-slate-600 hover:text-emerald-600 transition-colors group"
                      >
                        <Phone size={16} className="text-slate-400 group-hover:text-emerald-500 flex-shrink-0" />
                        <span>{safeRender(universityData.phone)}</span>
                      </motion.a>
                      <motion.a 
                        whileHover={{ x: 5 }}
                        href={`https://${universityData.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 text-sm text-slate-600 hover:text-emerald-600 transition-colors group break-all"
                      >
                        <LinkIcon size={16} className="text-slate-400 group-hover:text-emerald-500 flex-shrink-0" />
                        <span className="group-hover:underline">{safeRender(universityData.website)}</span>
                        <ExternalLink size={12} className="text-slate-400 group-hover:text-emerald-500 ml-auto flex-shrink-0" />
                      </motion.a>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl"
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-400" />
                      Why Choose This University?
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>World-class education with global recognition</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>Cutting-edge research facilities and labs</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>Diverse international student community</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
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
              className="space-y-6"
            >
              <div className="text-center mb-10">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4"
                >
                  <Layers size={16} className="text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-semibold">Academic Excellence</span>
                </motion.div>
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Academic Departments</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">Explore our world-class departments and innovative programs designed to shape future leaders</p>
              </div>
              {universityData.departments && universityData.departments.length > 0 ? (
                <div className="space-y-4">
                  {universityData.departments.map((dept, idx) => (
                    <motion.div 
                      key={dept.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover-lift"
                    >
                      <div 
                        className="p-6 cursor-pointer bg-gradient-to-r from-slate-50 to-white hover:from-emerald-50/30 hover:to-white transition-all duration-300" 
                        onClick={() => toggleDepartment(dept.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                              <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl shadow-sm">
                                <GraduationCap size={22} className="text-emerald-600" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-800">{safeRender(dept.name)}</h3>
                              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">{safeRender(dept.short_name)}</span>
                            </div>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{safeRender(dept.description)}</p>
                            <div className="flex flex-wrap gap-3 text-sm">
                              {dept.total_cridits && (
                                <span className="bg-slate-100 px-3 py-1.5 rounded-full text-slate-700">
                                  <strong className="font-semibold">Total Credits:</strong> {dept.total_cridits}
                                </span>
                              )}
                              {dept.cridit_fee && (
                                <span className="bg-slate-100 px-3 py-1.5 rounded-full text-slate-700">
                                  <strong className="font-semibold">Credit Fee:</strong> {dept.cridit_fee}
                                </span>
                              )}
                              {dept.total_tution && (
                                <span className="bg-emerald-50 px-3 py-1.5 rounded-full text-emerald-700">
                                  <strong className="font-semibold">Total Tuition:</strong> {dept.total_tution}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronDown size={20} className={`text-slate-400 transition-all duration-300 ${expandedDept === dept.id ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedDept === dept.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50/30">
                              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 mb-5">
                                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                  <Target size={18} className="text-emerald-600" />
                                  Program Structure
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                  {dept.total_cridits && (
                                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                                      <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Required Credits</p>
                                      <p className="text-2xl font-bold text-emerald-700">{dept.total_cridits}</p>
                                    </div>
                                  )}
                                  {dept.cridit_fee && (
                                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                                      <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Cost Per Credit</p>
                                      <p className="text-2xl font-bold text-emerald-700">{dept.cridit_fee}</p>
                                    </div>
                                  )}
                                  {dept.total_tution && (
                                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                                      <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Total Program Cost</p>
                                      <p className="text-2xl font-bold text-emerald-700">{dept.total_tution}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                  <BookOpen size={16} className="text-emerald-600" />
                                  Department Overview
                                </h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{safeRender(dept.description)}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={32} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500">No department information available for this university.</p>
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
            >
              <div className="text-center mb-10">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4"
                >
                  <FlaskConical size={16} className="text-purple-600" />
                  <span className="text-purple-700 text-sm font-semibold">Innovation Hub</span>
                </motion.div>
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Research & Innovation</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">Pioneering discoveries and breakthrough innovations that shape the future of science and humanity</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {universityData.researchHighlights && universityData.researchHighlights.length > 0 ? (
                  universityData.researchHighlights.map((highlight, idx) => {
                    const colors = [
                      "from-amber-500 to-orange-600", "from-blue-500 to-indigo-600", 
                      "from-emerald-500 to-teal-600", "from-purple-500 to-pink-600", 
                      "from-rose-500 to-red-600", "from-cyan-500 to-blue-600"
                    ];
                    const icons = ['Trophy', 'FlaskConical', 'Brain', 'Rocket', 'Award', 'Microscope'];
                    return (
                      <motion.div 
                        key={highlight.id || idx} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/30 border border-slate-100 transition-all duration-300"
                      >
                        <div className={`h-1.5 bg-gradient-to-r ${colors[idx % colors.length]}`}></div>
                        <div className="p-6">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${colors[idx % colors.length]} p-3 mb-5 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                            {getIconComponent(icons[idx % icons.length], 24, "text-white")}
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">{safeRender(highlight.title)}</h3>
                          <p className="text-slate-500 leading-relaxed">{safeRender(highlight.description)}</p>
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <span className="inline-block text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">{safeRender(highlight.category)}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-3 text-center py-16 bg-white rounded-2xl shadow-sm">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Microscope size={32} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500">No research highlights available for this university.</p>
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
            >
              <div className="text-center mb-10">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4"
                >
                  <DollarSign size={16} className="text-amber-600" />
                  <span className="text-amber-700 text-sm font-semibold">Investment in Future</span>
                </motion.div>
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Tuition & Financial Aid</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">Comprehensive breakdown of costs and available financial support to make your education accessible</p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <CreditCard size={22} className="text-emerald-500" />
                  Tuition by Department
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-4 px-4 font-semibold text-slate-600">Department</th>
                        <th className="text-left py-4 px-4 font-semibold text-slate-600">Total Credits</th>
                        <th className="text-left py-4 px-4 font-semibold text-slate-600">Credit Fee</th>
                        <th className="text-left py-4 px-4 font-semibold text-slate-600">Total Tuition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {universityData.departments && universityData.departments.map((dept, idx) => (
                        <motion.tr 
                          key={idx} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-4 font-medium text-slate-700">{safeRender(dept.name)}</td>
                          <td className="py-4 px-4 text-slate-600">{safeRender(dept.total_cridits)}</td>
                          <td className="py-4 px-4 text-slate-600">{safeRender(dept.cridit_fee)}</td>
                          <td className="py-4 px-4 font-semibold text-emerald-700">{safeRender(dept.total_tution)}</td>
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
                className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl"
              >
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Award size={24} className="text-amber-300" />
                  Financial Aid Opportunities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-2">
                    <span>🎓</span> Merit-based Scholarships: Up to 100% tuition
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-2">
                    <span>💰</span> Need-based Grants: Available based on financial need
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-2">
                    <span>🏅</span> Research Assistantships: Tuition + monthly stipend
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-2">
                    <span>🌍</span> International Student Scholarships: Merit-based available
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 w-full bg-white/20 backdrop-blur-sm py-3.5 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg"
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
            >
              <div className="text-center mb-10">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4"
                >
                  <Calendar size={16} className="text-blue-600" />
                  <span className="text-blue-700 text-sm font-semibold">Begin Your Journey</span>
                </motion.div>
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Admissions Information</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">Your journey to joining our community starts here - everything you need to know about applying</p>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
                >
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calendar size={22} className="text-emerald-500" />
                    Important Dates
                  </h3>
                  {universityData.admissionSeasons && universityData.admissionSeasons.length > 0 ? (
                    <div className="space-y-4">
                      {universityData.admissionSeasons.map((season, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors"
                        >
                          <span className="font-semibold text-slate-700">{safeRender(season.semester_name)}</span>
                          <span className="text-slate-500 text-sm bg-white px-3 py-1 rounded-full">{season.start_date} - {season.end_date}</span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">No admission seasons available</p>
                  )}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
                >
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FileText size={22} className="text-emerald-500" />
                    Required Documents
                  </h3>
                  <ul className="space-y-4">
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
                        className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{doc}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-10 text-white text-center shadow-2xl"
              >
                <h3 className="text-3xl font-bold mb-4">Ready to Apply?</h3>
                <p className="text-lg mb-6 opacity-95">Take the first step toward your future at {universityData.short_name || universityData.name}</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 bg-white text-emerald-700 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
                >
                  Start Your Application
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default UniversityDetails;