// VisaGuide.jsx - Professional Visa Application Guide with Ovhijan Color Theme
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe, CheckCircle, Clock, Shield, FileText, Users,
  ChevronRight, MapPin, Briefcase, GraduationCap, Plane,
  Heart, Building, DollarSign,
  Phone, Mail, MessageCircle, Star, Award, TrendingUp,
  AlertCircle, Download, Search,
  BookOpen, Lightbulb, Target, CreditCard,
  Home, ArrowRight, UserCheck, FileCheck, Crown,
  Flag, Luggage,
  Lock, Smartphone,
  Send, ClipboardList, Menu, X, Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Logo Component with Ovhijan Text
const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <img
      src="/src/images/logo.png"
      alt="Ovhijan Visa"
      style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
    <div style={{ display: 'none', alignItems: 'center', gap: '6px' }}>
      <Globe size={28} color="#10b981" />
      <span style={{ fontWeight: '800', fontSize: '1.4rem', letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #0F2B3D 0%, #1B4F6E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Ovhijan
      </span>
    </div>
  </div>
);

// Skeleton Components
const SkeletonCountryCard = () => (
  <div style={{
    background: '#F5F7FA',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    animation: 'pulse 1.5s ease-in-out infinite'
  }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E2E8F0' }} />
    <div style={{ flex: 1 }}>
      <div style={{ height: '16px', width: '80%', background: '#E2E8F0', borderRadius: '8px', marginBottom: '8px' }} />
      <div style={{ height: '12px', width: '60%', background: '#E2E8F0', borderRadius: '8px', marginBottom: '4px' }} />
      <div style={{ height: '10px', width: '40%', background: '#E2E8F0', borderRadius: '8px' }} />
    </div>
  </div>
);


const SkeletonVisaCard = () => (
  <div style={{
    background: '#F5F7FA',
    borderRadius: '20px',
    padding: '24px',
    animation: 'pulse 1.5s ease-in-out infinite'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '16px', background: '#E2E8F0' }} />
      <div>
        <div style={{ height: '16px', width: '100px', background: '#E2E8F0', borderRadius: '8px', marginBottom: '6px' }} />
        <div style={{ height: '12px', width: '80px', background: '#E2E8F0', borderRadius: '8px' }} />
      </div>
    </div>
    <div style={{ height: '40px', width: '100%', background: '#E2E8F0', borderRadius: '8px', marginBottom: '12px' }} />
    <div style={{ height: '14px', width: '60px', background: '#E2E8F0', borderRadius: '8px' }} />
  </div>
);

const SkeletonStep = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '40px',
    background: '#F5F7FA',
    animation: 'pulse 1.5s ease-in-out infinite'
  }}>
    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E2E8F0' }} />
    <div style={{ height: '12px', width: '80px', background: '#E2E8F0', borderRadius: '8px' }} />
  </div>
);

// FAQ Item Component with smooth animation
const SmoothFaqItem = ({ faq, index, isOpen, onToggle, theme }) => {
  return (
    <motion.div
      style={{
        borderBottom: `1px solid ${theme.border}`,
        borderRadius: '12px',
        marginBottom: '8px',
        background: isOpen ? `${theme.primary}04` : 'transparent',
        transition: 'background 0.3s ease'
      }}
      initial={false}
    >
      <motion.div
        onClick={() => onToggle(index)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0',
          cursor: 'pointer',
        }}
        whileHover={{ backgroundColor: `${theme.primary}04` }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          style={{
            fontWeight: '600',
            color: theme.primary,
            fontSize: '1rem',
            flex: 1,
            paddingRight: '16px'
          }}
        >
          {faq.q}
        </motion.span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px'
          }}
        >
          <ChevronRight size={18} color={theme.accent} />
        </motion.div>
      </motion.div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: 'hidden' }}
          >
            <motion.p
              style={{
                fontSize: '0.9rem',
                color: theme.textLight,
                paddingBottom: '20px',
                lineHeight: '1.6',
                borderTop: `1px dashed ${theme.border}`,
                paddingTop: '12px'
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {faq.a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const VisaGuide = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedVisaType, setSelectedVisaType] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visaTypesLoading, setVisaTypesLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [countries, setCountries] = useState([]);
  const [visaTypes, setVisaTypes] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/countries');
        const data = await response.json();
        console.log('Fetched countries:', data);

        let countriesData = [];
        if (Array.isArray(data)) {
          countriesData = data;
        } else if (data.data && Array.isArray(data.data)) {
          countriesData = data.data;
        } else if (data.countries && Array.isArray(data.countries)) {
          countriesData = data.countries;
        }

        // Map the database fields to match our component structure
        const mappedCountries = countriesData.map(country => ({
          id: country.id,
          name: country.name,
          flag: country.flag || getFlagEmoji(country.name),
          capital: country.capital || 'N/A',
          currency: country.currency || 'N/A',
          processingTime: country.processing_time || '2-8 weeks',
          description: country.description || `Study, work, or settle in ${country.name} with our visa assistance.`,
          requirements: country.requirements ? (typeof country.requirements === 'string' ? JSON.parse(country.requirements) : country.requirements) : ['Valid passport', 'Proof of funds', 'Completed application form', 'Visa fee payment']
        }));

        setCountries(mappedCountries);
        setFetchError(null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setFetchError('Failed to load countries. Please check your connection.');
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchCountries();
  }, []);

  // Fetch visa types for selected country
  const fetchVisaTypesForCountry = async (countryId, countryName) => {
    setVisaTypesLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/visa-types/country/${countryId}`);
      const data = await response.json();
      console.log('Fetched visa types for country:', data);

      let visaTypesData = [];
      if (Array.isArray(data)) {
        visaTypesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        visaTypesData = data.data;
      } else if (data.visa_types && Array.isArray(data.visa_types)) {
        visaTypesData = data.visa_types;
      }

      // FIXED: Map the database fields correctly
      const mappedVisaTypes = visaTypesData.map(visa => {
        // Get visa type name based on the 'type' field from database
        let visaName = '';
        let category = '';
        
        if (visa.type === 'student') {
          visaName = 'Student Visa';
          category = 'student';
        } else if (visa.type === 'job_seeker') {
          visaName = 'Job Seeker Visa';
          category = 'work';
        } else {
          visaName = visa.type || 'Visa';
          category = visa.type || 'other';
        }

        // Get icon based on category
        const icon = category === 'student' ? GraduationCap : Briefcase;

        // Parse details if it's a JSON string, otherwise use as is
        let description = visa.details || `Apply for ${visaName} to ${countryName}`;
        
        return {
          id: visa.id,
          name: visaName,
          type: visa.type, // Store original type
          icon: icon,
          description: description,
          duration: visa.duration || 'Varies',
          fee: visa.visa_fee ? `$${visa.visa_fee}` : 'Contact for details',
          category: category,
          requirements: []
        };
      });

      console.log('Mapped visa types:', mappedVisaTypes);
      setVisaTypes(mappedVisaTypes);
    } catch (err) {
      console.error('Error fetching visa types:', err);
      setVisaTypes([]);
    } finally {
      setVisaTypesLoading(false);
    }
  };

  // Helper function to get flag emoji from country name
  const getFlagEmoji = (countryName) => {
    const flagMap = {
      'United Kingdom': '🇬🇧', 'USA': '🇺🇸', 'United States': '🇺🇸',
      'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Germany': '🇩🇪',
      'France': '🇫🇷', 'UAE': '🇦🇪', 'Singapore': '🇸🇬',
      'New Zealand': '🇳🇿', 'Ireland': '🇮🇪'
    };
    return flagMap[countryName] || '🌍';
  };

  // Handle scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ovhijan Color Theme
  const theme = {
    primary: '#0F2B3D',
    secondary: '#1B4F6E',
    accent: '#10b981',
    light: '#F5F7FA',
    dark: '#0A1C28',
    success: '#2E7D64',
    warning: '#D4A13E',
    info: '#3A7CA5',
    text: '#2C3E50',
    textLight: '#6B7B8F',
    border: '#E2E8F0',
    cardBg: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #0a1a24 0%, #143649 100%)'
  };

  // Application Steps
  const applicationSteps = [
    { id: 1, title: 'Determine Your Eligibility', icon: Target },
    { id: 2, title: 'Prepare Documents', icon: FileText },
    { id: 3, title: 'Complete Application Form', icon: FileCheck },
    { id: 4, title: 'Pay Visa Fees', icon: CreditCard },
    { id: 5, title: 'Schedule Biometrics', icon: UserCheck },
    { id: 6, title: 'Attend Interview', icon: Users },
    { id: 7, title: 'Wait for Decision', icon: Clock },
    { id: 8, title: 'Receive Visa', icon: CheckCircle }
  ];

  // FAQs
  const faqs = [
    { q: 'How long does the visa process take?', a: 'Processing times vary by country and visa type, typically ranging from 2-12 weeks. We recommend applying at least 3-4 months in advance to account for any delays.' },
    { q: 'Can I work while on a student visa?', a: 'Most countries allow limited part-time work for international students, usually 20 hours per week during academic sessions and full-time during scheduled breaks.' },
    { q: 'What is the success rate for visa applications?', a: 'Applications with complete documentation and clear purpose have higher success rates. Our platform maintains a 95% success rate across all visa types.' },
    { q: 'Do I need travel insurance?', a: 'Most countries require travel/health insurance covering the duration of your stay. We recommend getting comprehensive coverage including medical emergencies and trip cancellation.' },
    { q: 'Can I extend my visa?', a: 'Many visa types allow extensions or conversions to other visa categories. The process typically requires submitting new documentation and paying additional fees.' },
    { q: 'What if my visa is rejected?', a: 'You can appeal the decision or reapply after addressing the reasons for rejection. Our team provides guidance on next steps and documentation improvement.' }
  ];

  // Tips for success
  const tips = [
    { text: 'Apply well in advance (at least 3-4 months before your intended travel)', icon: Clock },
    { text: 'Double-check all documents for accuracy and completeness', icon: FileCheck },
    { text: 'Provide genuine and verifiable information throughout', icon: Shield },
    { text: 'Maintain sufficient funds in your bank account', icon: DollarSign },
    { text: 'Keep copies of all submitted documents', icon: FileText },
    { text: 'Prepare for interview questions about your travel plans', icon: MessageCircle }
  ];

  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    setSelectedVisaType(null);
    setShowGuide(false);
    setActiveStep(1);
    setVisaTypes([]);
    await fetchVisaTypesForCountry(country.id, country.name);
  };

  const handleVisaTypeSelect = (visaType) => {
    setSelectedVisaType(visaType);
    setShowGuide(true);
  };

  const resetSelection = () => {
    setSelectedCountry(null);
    setSelectedVisaType(null);
    setShowGuide(false);
    setActiveStep(1);
    setVisaTypes([]);
  };

  const handleApplyNow = () => {
    if (selectedCountry && selectedVisaType) {
      const serializableCountry = {
        id: selectedCountry.id,
        name: selectedCountry.name,
        flag: selectedCountry.flag,
        capital: selectedCountry.capital,
        currency: selectedCountry.currency,
        processingTime: selectedCountry.processingTime,
        description: selectedCountry.description,
        requirements: selectedCountry.requirements
      };

      const serializableVisaType = {
        id: selectedVisaType.id,
        name: selectedVisaType.name,
        type: selectedVisaType.type,
        description: selectedVisaType.description,
        duration: selectedVisaType.duration,
        fee: selectedVisaType.fee,
        category: selectedVisaType.category
      };

      navigate('/visaapplication', {
        state: {
          selectedCountry: serializableCountry,
          selectedVisaType: serializableVisaType
        }
      });
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getStepDescription = (stepId, country, visaType) => {
    const descriptions = {
      1: `To apply for a ${visaType.name} to ${country.name}, you must meet specific eligibility criteria including age requirements (usually 18+), financial stability, clean criminal record, and genuine intent. Check your eligibility against the official requirements.`,
      2: `Gather all necessary documents including your valid passport with at least 6 months validity, recent photographs, completed application form, proof of financial means, travel itinerary, and accommodation details.`,
      3: `Complete the online visa application form accurately. Provide truthful information about your personal details, travel history, employment, education, and purpose of visit.`,
      4: `Pay the visa application fee of ${visaType.fee} using the accepted payment methods. Keep the payment receipt as proof.`,
      5: `Schedule and attend your biometric appointment at a Visa Application Centre. Your fingerprints and photograph will be taken.`,
      6: `If required, attend a visa interview at the embassy or consulate. Be prepared to answer questions about your travel plans.`,
      7: `After submission, wait for the visa processing to complete. Standard processing for ${country.name} takes ${country.processingTime}.`,
      8: `Once approved, collect your passport with the visa sticker or receive electronic approval. Check all details for accuracy.`
    };
    return descriptions[stepId] || `Follow the official guidelines for ${visaType.name} to ${country.name}.`;
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(145deg, ${theme.light} 0%, #EFF3F8 100%)`,
      fontFamily: "'Inter', -apple-system, sans-serif",
    },
    navbar: {
      background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
      padding: '0 32px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
    },
    navbarContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: scrolled ? '70px' : '85px',
      transition: 'height 0.3s ease',
    },
    navLinks: {
      display: 'flex',
      gap: '32px',
      alignItems: 'center',
    },
    navLink: {
      textDecoration: 'none',
      color: theme.text,
      fontWeight: '500',
      transition: 'color 0.2s',
      cursor: 'pointer',
      fontSize: '0.95rem',
    },
    header: {
      background: theme.gradient,
      padding: '120px 32px 80px 32px',
      color: 'white',
      marginTop: 0,
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    title: {
      fontSize: '3.2rem',
      fontWeight: '800',
      marginBottom: '16px',
    },
    subtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      maxWidth: '600px',
      marginBottom: '32px',
    },
    heroCard: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '24px 32px',
      display: 'inline-flex',
      gap: '24px',
      flexWrap: 'wrap',
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    statValue: { fontSize: '1.5rem', fontWeight: '700' },
    statLabel: { fontSize: '0.8rem', opacity: 0.8 },
    mainContent: {
      maxWidth: '1400px',
      margin: '-40px auto 0 auto',
      padding: '0 32px 60px 32px',
      position: 'relative',
      zIndex: 3,
    },
    selectionCard: {
      background: theme.cardBg,
      borderRadius: '32px',
      padding: '32px',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
      marginBottom: '40px',
    },
    sectionTitle: { fontSize: '1.5rem', fontWeight: '700', color: theme.primary, marginBottom: '8px' },
    sectionSubtitle: { fontSize: '0.9rem', color: theme.textLight, marginBottom: '24px' },
    countryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    countryCard: {
      background: theme.light,
      borderRadius: '20px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: `2px solid transparent`,
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    visaTypeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
    visaCard: {
      background: theme.light,
      borderRadius: '20px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: `1px solid ${theme.border}`,
    },
    guideContainer: {
      background: theme.cardBg,
      borderRadius: '32px',
      overflow: 'hidden',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
    },
    progressBar: {
      display: 'flex',
      background: theme.light,
      padding: '16px 24px',
      borderBottom: `1px solid ${theme.border}`,
      flexWrap: 'wrap',
      gap: '8px',
    },
    progressStep: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '40px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    stepContent: { padding: '32px' },
    tipCard: {
      background: `linear-gradient(135deg, ${theme.primary}10, ${theme.secondary}05)`,
      borderRadius: '20px',
      padding: '20px',
      borderLeft: `4px solid ${theme.accent}`,
    },
    faqItem: {
      borderBottom: `1px solid ${theme.border}`,
      padding: '20px 0',
      cursor: 'pointer',
    },
    button: {
      background: theme.gradient,
      color: 'white',
      border: 'none',
      padding: '12px 28px',
      borderRadius: '40px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    buttonOutline: {
      background: 'transparent',
      border: `2px solid ${theme.accent}`,
      color: theme.accent,
      padding: '10px 24px',
      borderRadius: '40px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    applyButton: {
      background: theme.accent,
      color: theme.light,
      border: 'none',
      padding: '16px 40px',
      borderRadius: '50px',
      fontWeight: '700',
      fontSize: '1.1rem',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: `0 8px 20px ${theme.accent}30`,
    },
  };

  // Error state
  if (fetchError) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <AlertCircle size={48} color="#ef4444" />
          <h3 style={{ marginTop: '16px', color: theme.text }}>Error Loading Countries</h3>
          <p style={{ color: theme.textLight, marginTop: '8px' }}>{fetchError}</p>
          <button onClick={() => window.location.reload()} style={{ ...styles.button, marginTop: '24px' }}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Professional Transparent Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navbarContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/src/images/logo.png"
              alt="Ovhijan Visa"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{ display: 'none', alignItems: 'center', gap: '6px' }}>
              <Globe size={24} color="#10b981" />
              <span style={{ fontWeight: '800', fontSize: '1.3rem', letterSpacing: '-0.2px', background: 'linear-gradient(135deg, #0F2B3D 0%, #1B4F6E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Ovhijan
              </span>
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.2rem', color: theme.primary, letterSpacing: '-0.3px' }}>Ovhijan</span>
          </div>

          {/* Desktop Navigation */}
          <div style={{ ...styles.navLinks, display: 'flex' }}>
            <a href="#" style={styles.navLink} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Destinations</a>
            <a href="#" style={styles.navLink} onClick={(e) => { e.preventDefault(); const faq = document.getElementById('faq-section'); if (faq) faq.scrollIntoView({ behavior: 'smooth' }); }}>FAQs</a>
            <a href="#" style={styles.navLink} onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a>
            <button style={{ ...styles.buttonOutline, padding: '8px 20px' }} onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div style={{ display: 'none', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 style={styles.title}>
              Hassle-Free Visa Application
              <br />
              <span style={{ color: theme.accent }}>Your Journey Starts Here</span>
            </h1>
            <p style={styles.subtitle}>
              Select your destination country and visa type to get personalized guidance from our experts.
            </p>
            <div style={styles.heroCard}>
              <div style={styles.stat}><Globe size={28} /><div><div style={styles.statValue}>{countries.length}+</div><div style={styles.statLabel}>Countries</div></div></div>
              <div style={styles.stat}><FileText size={28} /><div><div style={styles.statValue}>20+</div><div style={styles.statLabel}>Visa Types</div></div></div>
              <div style={styles.stat}><CheckCircle size={28} /><div><div style={styles.statValue}>95%</div><div style={styles.statLabel}>Success Rate</div></div></div>
              <div style={styles.stat}><Users size={28} /><div><div style={styles.statValue}>50K+</div><div style={styles.statLabel}>Applicants</div></div></div>
            </div>
          </motion.div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Country Selection Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={styles.selectionCard}>
          {!selectedCountry ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div><h2 style={styles.sectionTitle}>Select Your Destination</h2><p style={styles.sectionSubtitle}>Choose the country you want to apply for a visa</p></div>
              </div>
              <div style={styles.countryGrid}>
                {loading ? (
                  Array(6).fill(0).map((_, i) => <SkeletonCountryCard key={i} />)
                ) : (
                  countries.map((country) => (
                    <motion.div
                      key={country.id}
                      whileHover={{ scale: 1.02, y: -4, borderColor: theme.accent }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCountrySelect(country)}
                      style={{ ...styles.countryCard, cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: '3rem' }}>{country.flag}</span>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: theme.primary }}>{country.name}</div>
                        <div style={{ fontSize: '0.8rem', color: theme.textLight }}>{country.capital} · {country.currency}</div>
                        <div style={{ fontSize: '0.75rem', color: theme.accent, marginTop: '4px' }}>Processing: {country.processingTime}</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </>
          ) : !selectedVisaType ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '2rem' }}>{selectedCountry.flag}</span>
                    <h2 style={styles.sectionTitle}>{selectedCountry.name} Visa Types</h2>
                  </div>
                  <p style={styles.sectionSubtitle}>Select the visa category that matches your purpose</p>
                </div>
                <button onClick={resetSelection} style={styles.buttonOutline}>← Change Country</button>
              </div>
              <div style={styles.visaTypeGrid}>
                {visaTypesLoading ? (
                  Array(4).fill(0).map((_, i) => <SkeletonVisaCard key={i} />)
                ) : visaTypes.length > 0 ? (
                  visaTypes.map((visa) => {
                    const Icon = visa.icon;
                    return (
                      <motion.div
                        key={visa.id}
                        whileHover={{ scale: 1.02, y: -4, borderColor: theme.accent }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVisaTypeSelect(visa)}
                        style={{ ...styles.visaCard, cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ background: `${theme.accent}15`, padding: '10px', borderRadius: '16px' }}><Icon size={24} color={theme.accent} /></div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem', color: theme.primary }}>{visa.name}</div>
                            <div style={{ fontSize: '0.7rem', color: theme.textLight }}>Duration: {visa.duration}</div>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: theme.text, marginBottom: '12px', lineHeight: '1.5' }}>{visa.description}</p>
                        <div style={{ fontSize: '0.75rem', color: theme.accent, fontWeight: '600' }}>Fee: {visa.fee}</div>
                        <div style={{ marginTop: '12px', display: 'inline-block', background: visa.category === 'student' ? `${theme.info}15` : `${theme.accent}15`, padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', color: visa.category === 'student' ? theme.info : theme.accent }}>
                          {visa.category === 'student' ? '🎓 Student Visa' : '💼 Work Visa'}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1/-1' }}>
                    <AlertCircle size={48} color={theme.textLight} />
                    <p style={{ marginTop: '16px', color: theme.textLight }}>No visa types available for this country yet.</p>
                    <button onClick={resetSelection} style={{ ...styles.buttonOutline, marginTop: '20px' }}>← Back to Countries</button>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </motion.div>

        {/* Apply Now Card */}
        {selectedCountry && selectedVisaType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: `linear-gradient(135deg, ${theme.primary}08, ${theme.accent}05)`,
              borderRadius: '28px',
              padding: '28px 40px',
              marginBottom: '40px',
              border: `1px solid ${theme.accent}20`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '2rem' }}>{selectedCountry.flag}</span>
                  <span style={{ fontWeight: '700', fontSize: '1.4rem', color: theme.primary }}>{selectedCountry.name}</span>
                  <ChevronRight size={20} color={theme.textLight} />
                  <span style={{ fontWeight: '600', fontSize: '1.2rem', color: theme.accent }}>{selectedVisaType.name}</span>
                </div>
                <p style={{ color: theme.textLight, maxWidth: '500px' }}>{selectedVisaType.description}</p>
                <p style={{ fontSize: '0.8rem', color: theme.textLight, marginTop: '8px' }}>
                  <Lock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                  Complete your application in 15-20 minutes. All information is encrypted.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: `0 8px 25px ${theme.accent}40` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApplyNow}
                  style={styles.applyButton}
                >
                  <Send size={20} /> Apply Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetSelection}
                  style={{ ...styles.buttonOutline, padding: '12px 24px', fontSize: '0.9rem' }}
                >
                  Start Over
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Visa Guide - only shown when a visa type is selected */}
        {showGuide && selectedCountry && selectedVisaType && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={styles.guideContainer}>
            <div style={{ background: theme.gradient, padding: '28px 32px', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '2rem' }}>{selectedCountry.flag}</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{selectedCountry.name}</span>
                    <ChevronRight size={20} />
                    <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>{selectedVisaType.name}</span>
                  </div>
                  <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>{selectedVisaType.description}</p>
                </div>
              </div>
            </div>

            <div style={styles.progressBar}>
              {applicationSteps.map(step => (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  style={{
                    ...styles.progressStep,
                    background: activeStep === step.id ? theme.accent : 'white',
                    color: activeStep === step.id ? 'white' : theme.text,
                    boxShadow: activeStep === step.id ? `0 4px 12px ${theme.accent}40` : 'none'
                  }}
                >
                  <span style={{ fontWeight: '700', fontSize: '0.8rem' }}>{step.id}</span>
                  <span style={{ fontSize: '0.8rem' }}>{step.title}</span>
                </div>
              ))}
            </div>

            <div style={styles.stepContent}>
              {applicationSteps.map(step => (
                <AnimatePresence key={step.id}>
                  {activeStep === step.id && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ background: `${theme.accent}15`, padding: '16px', borderRadius: '24px' }}><step.icon size={32} color={theme.accent} /></div>
                        <div><div style={{ fontSize: '0.8rem', color: theme.accent, fontWeight: '600' }}>Step {step.id} of 8</div><h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.primary }}>{step.title}</h3></div>
                      </div>
                      <p style={{ fontSize: '1rem', color: theme.text, marginBottom: '24px', lineHeight: 1.6 }}>{getStepDescription(step.id, selectedCountry, selectedVisaType)}</p>

                      {step.id === 2 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: theme.light, borderRadius: '20px', padding: '24px', marginTop: '16px' }}>
                          <h4 style={{ fontWeight: '600', marginBottom: '16px', color: theme.primary }}>Required Documents Checklist</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                            {(selectedVisaType.requirements && selectedVisaType.requirements.length > 0 ? selectedVisaType.requirements : selectedCountry.requirements).map((req, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                              >
                                <CheckCircle size={16} color={theme.accent} />
                                <span style={{ fontSize: '0.85rem' }}>{req}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${theme.border}` }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                          disabled={activeStep === 1}
                          style={{ ...styles.buttonOutline, opacity: activeStep === 1 ? 0.5 : 1 }}
                        >
                          ← Previous Step
                        </motion.button>
                        {activeStep === 8 ?
                          <motion.button
                            whileHover={{ scale: 1.02, boxShadow: `0 4px 12px ${theme.accent}40` }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleApplyNow}
                            style={styles.button}
                          >
                            Apply Now <Send size={16} />
                          </motion.button> :
                          <motion.button
                            whileHover={{ scale: 1.02, boxShadow: `0 4px 12px ${theme.accent}40` }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveStep(Math.min(8, activeStep + 1))}
                            style={styles.button}
                          >
                            Next Step →
                          </motion.button>
                        }
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </motion.div>
        )}

        {/* Only show Tips, FAQ, and CTA when no country is selected */}
        {!selectedCountry && (
          <>
            {/* Tips Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} style={{ ...styles.selectionCard, marginTop: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}><Lightbulb size={28} color={theme.accent} /><h2 style={styles.sectionTitle}>Pro Tips for Success</h2></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {tips.map((tip, idx) => {
                  const Icon = tip.icon;
                  return (
                    <motion.div
                      key={idx}
                      style={styles.tipCard}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Icon size={18} color={theme.accent} />
                        <span style={{ fontWeight: '600', color: theme.primary }}>Tip {idx + 1}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: theme.text, lineHeight: '1.5' }}>{tip.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Smooth FAQ Section */}
            <motion.div
              id="faq-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={styles.selectionCard}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <MessageCircle size={28} color={theme.accent} />
                <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
              </div>
              <div>
                {faqs.map((faq, idx) => (
                  <SmoothFaqItem
                    key={idx}
                    faq={faq}
                    index={idx}
                    isOpen={openFaqIndex === idx}
                    onToggle={toggleFaq}
                    theme={theme}
                  />
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ background: theme.gradient, borderRadius: '32px', padding: '56px 48px', textAlign: 'center', color: 'white' }}
            >
              <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: '700' }}>Ready to Start Your Visa Application?</h2>
              <p style={{ marginBottom: '28px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 28px auto', lineHeight: '1.6' }}>
                Get personalized assistance from our visa experts. We've helped over 50,000 applicants achieve their dreams.
              </p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: 'white', color: theme.primary, border: 'none', padding: '14px 36px', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}
                >
                  <MessageCircle size={20} /> Chat with Expert
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: 'transparent', border: '2px solid white', color: 'white', padding: '14px 36px', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}
                >
                  <Download size={20} /> Download Checklist
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: theme.primary, color: 'rgba(255,255,255,0.7)', padding: '40px 32px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Globe size={24} color={theme.accent} />
              <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'white', letterSpacing: '-0.3px' }}>Ovhijan</span>
            </div>
            <p style={{ fontSize: '0.85rem', maxWidth: '300px', lineHeight: '1.5' }}>Making visa applications simple, transparent, and successful for students and professionals worldwide.</p>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); resetSelection(); }}>Destinations</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.85rem' }}>Student Visas</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.85rem' }}>Work Visas</a>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.85rem' }}>Contact Us</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.85rem' }}>FAQs</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.85rem' }}>Privacy Policy</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1400px', margin: '32px auto 0', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '0.75rem' }}>
          © 2024 Ovhijan Visa Services. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default VisaGuide;