import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Award, DollarSign, Calendar, Building,
  TrendingUp, Users, BookOpen, Clock, ChevronDown, ChevronUp,
  Filter, X, GraduationCap, Globe, Star, BarChart3,
  Send, AlertCircle, CheckCircle,
  Eye, LayoutDashboard, LogOut,
  Settings, UserCircle, Bookmark, FileText, Shield, Upload,
  User, Languages, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../images/logo.png';

const Universities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { countryName, countryId } = location.state || {};

  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedUniForApply, setSelectedUniForApply] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('all-universities');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [expandedSubmenu, setExpandedSubmenu] = useState(false);
  const [activeCountry, setActiveCountry] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState({ countries: [], universities: [] });
  const [applications, setApplications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [filters, setFilters] = useState({
    type: 'all',
    minRanking: '',
    maxTuition: '',
    sortBy: 'ranking'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Complete application form data
  const [applicationForm, setApplicationForm] = useState({
    full_name: '',
    date_of_birth: '',
    nationality: '',
    passport_number: '',
    email: '',
    phone_number: '',
    current_address: '',
    highest_qualification: '',
    graduation_year: '',
    gpa_or_percentage: '',
    english_test_type: '',
    english_test_score: '',
    standardized_test_type: '',
    standardized_test_score: '',
    program_name: '',
    program_level: '',
    intake_session: '',
    statement_of_purpose: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    transcript: null,
    english_certificate: null,
    resume_cv: null
  });

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = userData.name || 'Student';
  const userId = localStorage.getItem('userId') || userData.userID || null;

  // Auto-fill user data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.email || storedUser.name) {
      setApplicationForm(prev => ({
        ...prev,
        email: storedUser.email || prev.email,
        full_name: storedUser.name || prev.full_name
      }));
    }
  }, []);

  // FETCH COUNTRIES from database
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/countries');
        const data = await response.json();
        console.log('Countries fetched:', data);
        
        let countriesData = [];
        if (Array.isArray(data)) {
          countriesData = data;
        } else if (data.data && Array.isArray(data.data)) {
          countriesData = data.data;
        } else if (data.countries && Array.isArray(data.countries)) {
          countriesData = data.countries;
        }
        
        setCountries(countriesData);
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => setIsPageLoaded(true), 100);
        }, 500);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries data');
        setLoading(false);
        setIsPageLoaded(true);
      }
    };
    
    fetchCountries();
  }, []);

  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/universities');
        const data = await response.json();
        console.log('Universities fetched:', data);
        
        let uniData = [];
        if (Array.isArray(data)) {
          uniData = data;
        } else if (data.data && Array.isArray(data.data)) {
          uniData = data.data;
        } else if (data.universities && Array.isArray(data.universities)) {
          uniData = data.universities;
        }
        
        setUniversities(uniData);
        setFilteredUniversities(uniData);
      } catch (err) {
        console.error('Error fetching universities:', err);
        setError('Failed to load universities data');
      }
    };
    
    fetchUniversities();
  }, []);

  // Filter universities by country when countryId changes
  useEffect(() => {
    if (countryId && countries.length > 0) {
      const filtered = universities.filter(uni => uni.country_id === countryId);
      setFilteredUniversities(filtered);
      const foundCountry = countries.find(c => c.id === countryId);
      if (foundCountry) {
        setActiveCountry(foundCountry);
        setActiveNav('dashboard');
      }
    } else if (universities.length > 0) {
      setFilteredUniversities(universities);
      setActiveCountry(null);
    }
  }, [countryId, universities, countries]);

  // Apply filters
  useEffect(() => {
    if (Array.isArray(universities) && universities.length > 0) {
      applyFilters();
    }
  }, [universities, filters, countryId]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults({ countries: [], universities: [] });
      setShowSearchResults(false);
      return;
    }
    const query = searchQuery.toLowerCase();
    const matchedCountries = countries.filter(country =>
      country.name?.toLowerCase().includes(query)
    );
    const matchedUniversities = universities.filter(uni =>
      uni.name?.toLowerCase().includes(query) ||
      (uni.location && uni.location.toLowerCase().includes(query))
    );
    setSearchResults({ countries: matchedCountries, universities: matchedUniversities });
    setShowSearchResults(true);
  }, [searchQuery, countries, universities]);

  const fetchUserApplications = async () => {
    if (!userId) return;
    setNotificationsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/applications/user/${userId}`);
      const data = await response.json();
      const applicationsList = data.data || data || [];
      setApplications(applicationsList);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Just for scroll tracking
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getInitials = () => userName.charAt(0).toUpperCase();

  const formatCurrency = (value, symbol = '$') => {
    if (!value) return 'Varies';
    const numericMatch = value.match(/\d[\d,]*/);
    if (numericMatch) {
      return `${symbol}${numericMatch[0]}`;
    }
    return value.split(' ')[0];
  };

  // Navigation items with dynamic countries from database
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
        flag: country.flag || '🌍',
        icon: Globe
      }))
    },
    { id: 'all-universities', icon: Building, label: 'Universities', path: '/all-universities' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', path: '/calendar' },
    { id: 'community', icon: Users, label: 'Community', path: '/community' },
    { id: 'bookmarks', icon: Bookmark, label: 'Saved', path: '/bookmarks' },
    { id: 'visa', icon: Shield, label: 'Visa Tracker', path: '/visatracker' },
    { id: 'visaguide', icon: FileText, label: 'Visa Application', path: '/visaguide' },
  ];

  const secondaryNavItems = [
    { id: 'profile', icon: UserCircle, label: 'Profile', path: '/profile' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    { id: 'logout', icon: LogOut, label: 'Logout', action: () => { localStorage.clear(); navigate('/login'); } },
  ];

  const handleNavigation = (item, submenuItem = null) => {
    setActiveNav(item.id);
    if (item.hasSubmenu && !submenuItem) {
      setExpandedSubmenu(!expandedSubmenu);
      return;
    }
    if (submenuItem) {
      setActiveCountry({
        name: submenuItem.label,
        id: submenuItem.state?.countryId,
        flag: submenuItem.flag
      });
      setExpandedSubmenu(false);
      if (submenuItem.path && submenuItem.state) {
        navigate(submenuItem.path, { state: submenuItem.state });
      }
      return;
    }
    if (item.action) item.action();
    else if (item.path) navigate(item.path);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/university-placeholder.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `/universitys/${imageUrl}`;
  };

  const handleUniversityClick = (university) => {
    navigate('/uvdetails', { 
      state: { 
        university: {
          id: university.id,
          name: university.name,
          short_name: university.short_name,
          rank: university.rank,
          location: university.location,
          country: university.country,
        }
      } 
    });
  };

  const applyFilters = () => {
    if (!Array.isArray(universities) || universities.length === 0) {
      setFilteredUniversities([]);
      return;
    }

    let filtered = [...universities];

    if (countryId) {
      filtered = filtered.filter(uni => uni.country_id === countryId);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(uni => uni.type === filters.type);
    }

    if (filters.minRanking) {
      filtered = filtered.filter(uni => uni.ranking && uni.ranking <= parseInt(filters.minRanking));
    }

    if (filters.maxTuition) {
      filtered = filtered.filter(uni => {
        const tuitionNum = parseInt(uni.tuition?.replace(/\D/g, '') || '0');
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
      default:
        break;
    }

    setFilteredUniversities(filtered);
  };

  const handleApplyClick = (uni, e) => {
    e.stopPropagation();
    console.log('Apply button clicked for university:', uni);
    setSelectedUniForApply(uni);
    setCurrentStep(1);
    setSubmitSuccess(false);
    setSubmitError(null);
    setShowApplyModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (fileType, file) => {
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [fileType]: file }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!applicationForm.full_name || !applicationForm.email || !applicationForm.phone_number) {
        setSubmitError('Please fill in all required personal information');
        return;
      }
    }
    if (currentStep === 2) {
      if (!applicationForm.highest_qualification) {
        setSubmitError('Please select your highest qualification');
        return;
      }
    }
    if (currentStep === 4) {
      if (!applicationForm.program_name || !applicationForm.program_level) {
        setSubmitError('Please enter program name and select program level');
        return;
      }
    }
    setSubmitError(null);
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
    setSubmitError(null);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    console.log('Submitting application...');
    console.log('User ID:', userId);
    console.log('Selected University:', selectedUniForApply);

    if (!userId) {
      setSubmitError('Please login to apply for universities');
      setSubmitting(false);
      return;
    }

    if (!selectedUniForApply || !selectedUniForApply.id) {
      setSubmitError('Invalid university selection');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // Map form fields to match database columns
      formData.append('full_name', applicationForm.full_name);
      formData.append('date_of_birth', applicationForm.date_of_birth);
      formData.append('nationality', applicationForm.nationality);
      formData.append('passport_number', applicationForm.passport_number);
      formData.append('email', applicationForm.email);
      formData.append('phone_number', applicationForm.phone_number);
      formData.append('current_address', applicationForm.current_address);
      formData.append('highest_qualification', applicationForm.highest_qualification);
      formData.append('graduation_year', applicationForm.graduation_year);
      formData.append('gpa_or_percentage', applicationForm.gpa_or_percentage);
      formData.append('english_test_type', applicationForm.english_test_type);
      formData.append('english_test_score', applicationForm.english_test_score);
      formData.append('standardized_test_type', applicationForm.standardized_test_type);
      formData.append('standardized_test_score', applicationForm.standardized_test_score);
      formData.append('program_name', applicationForm.program_name);
      formData.append('program_level', applicationForm.program_level);
      formData.append('intake_session', applicationForm.intake_session);
      formData.append('statement_of_purpose', applicationForm.statement_of_purpose);
      
      // Add IDs
      formData.append('user_id', parseInt(userId));
      formData.append('university_id', selectedUniForApply.id);
      
      // Add files
      if (uploadedFiles.transcript) {
        formData.append('transcript', uploadedFiles.transcript);
      }
      if (uploadedFiles.english_certificate) {
        formData.append('english_certificate', uploadedFiles.english_certificate);
      }
      if (uploadedFiles.resume_cv) {
        formData.append('resume_cv', uploadedFiles.resume_cv);
      }
      
      console.log('Sending form data...');
      
      const response = await fetch('http://127.0.0.1:8000/api/applications', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log('Response from server:', data);
      
      if (response.ok && data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowApplyModal(false);
          setCurrentStep(1);
          setApplicationForm({
            full_name: '',
            date_of_birth: '',
            nationality: '',
            passport_number: '',
            email: userData.email || '',
            phone_number: '',
            current_address: '',
            highest_qualification: '',
            graduation_year: '',
            gpa_or_percentage: '',
            english_test_type: '',
            english_test_score: '',
            standardized_test_type: '',
            standardized_test_score: '',
            program_name: '',
            program_level: '',
            intake_session: '',
            statement_of_purpose: ''
          });
          setUploadedFiles({ transcript: null, english_certificate: null, resume_cv: null });
        }, 2000);
      } else {
        setSubmitError(data.message || data.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      minRanking: '',
      maxTuition: '',
      sortBy: 'ranking'
    });
  };

  // Render step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#0a0f1e' }}>
              <User size={18} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
              Personal Information
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                  <input type="text" name="full_name" value={applicationForm.full_name} onChange={handleFormChange} required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Date of Birth *</label>
                  <input type="date" name="date_of_birth" value={applicationForm.date_of_birth} onChange={handleFormChange}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Nationality</label>
                  <input type="text" name="nationality" value={applicationForm.nationality} onChange={handleFormChange}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Passport Number</label>
                  <input type="text" name="passport_number" value={applicationForm.passport_number} onChange={handleFormChange}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Email *</label>
                  <input type="email" name="email" value={applicationForm.email} onChange={handleFormChange} required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                  <input type="tel" name="phone_number" value={applicationForm.phone_number} onChange={handleFormChange} required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Current Address</label>
                <textarea name="current_address" value={applicationForm.current_address} onChange={handleFormChange} rows="2"
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px', resize: 'vertical' }} />
              </div>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#0a0f1e' }}>
              <GraduationCap size={18} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
              Academic Information
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Highest Qualification *</label>
                <select name="highest_qualification" value={applicationForm.highest_qualification} onChange={handleFormChange} required
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }}>
                  <option value="">Select</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Associate Degree">Associate Degree</option>
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Graduation Year</label>
                  <input type="number" name="graduation_year" value={applicationForm.graduation_year} onChange={handleFormChange} placeholder="e.g., 2020"
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>GPA / Percentage</label>
                  <input type="text" name="gpa_or_percentage" value={applicationForm.gpa_or_percentage} onChange={handleFormChange} placeholder="e.g., 3.5 or 85%"
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Transcript / Marksheet</label>
                <div style={{ border: '1.5px dashed #e9ecef', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => document.getElementById('transcript-upload').click()}>
                  <input type="file" id="transcript-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload('transcript', e.target.files[0])} accept=".pdf,.jpg,.png" />
                  <Upload size={24} color="#10b981" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    {uploadedFiles.transcript ? uploadedFiles.transcript.name : 'Click to upload transcript (PDF, JPG, PNG)'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#0a0f1e' }}>
              <Languages size={18} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
              English Proficiency & Test Scores
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>English Test Type</label>
                  <select name="english_test_type" value={applicationForm.english_test_type} onChange={handleFormChange}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }}>
                    <option value="">Select</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="PTE">PTE</option>
                    <option value="Duolingo">Duolingo</option>
                    <option value="Cambridge">Cambridge</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Score</label>
                  <input type="text" name="english_test_score" value={applicationForm.english_test_score} onChange={handleFormChange} placeholder="e.g., 7.5"
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>English Certificate</label>
                <div style={{ border: '1.5px dashed #e9ecef', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => document.getElementById('english-cert-upload').click()}>
                  <input type="file" id="english-cert-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload('english_certificate', e.target.files[0])} accept=".pdf,.jpg,.png" />
                  <Upload size={24} color="#10b981" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    {uploadedFiles.english_certificate ? uploadedFiles.english_certificate.name : 'Upload English test certificate'}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Standardized Test</label>
                  <select name="standardized_test_type" value={applicationForm.standardized_test_type} onChange={handleFormChange}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }}>
                    <option value="">Select</option>
                    <option value="SAT">SAT</option>
                    <option value="ACT">ACT</option>
                    <option value="GRE">GRE</option>
                    <option value="GMAT">GMAT</option>
                    <option value="LSAT">LSAT</option>
                    <option value="MCAT">MCAT</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Score</label>
                  <input type="text" name="standardized_test_score" value={applicationForm.standardized_test_score} onChange={handleFormChange}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#0a0f1e' }}>
              <FileText size={18} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
              Program & Documents
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Program Name *</label>
                <input type="text" name="program_name" value={applicationForm.program_name} onChange={handleFormChange} required
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Program Level *</label>
                  <select name="program_level" value={applicationForm.program_level} onChange={handleFormChange} required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }}>
                    <option value="">Select</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Certificate">Certificate</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Intake Session</label>
                  <select name="intake_session" value={applicationForm.intake_session} onChange={handleFormChange}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px' }}>
                    <option value="">Select</option>
                    <option value="Fall">Fall (September)</option>
                    <option value="Spring">Spring (January)</option>
                    <option value="Summer">Summer (May)</option>
                    <option value="Winter">Winter (December)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Statement of Purpose</label>
                <textarea name="statement_of_purpose" value={applicationForm.statement_of_purpose} onChange={handleFormChange} rows="4"
                  placeholder="Tell us why you want to study this program and why you're a good fit..."
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '10px', fontSize: '13px', resize: 'vertical' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Resume/CV *</label>
                <div style={{ border: '1.5px dashed #e9ecef', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => document.getElementById('resume-upload').click()}>
                  <input type="file" id="resume-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload('resume_cv', e.target.files[0])} accept=".pdf,.doc,.docx" required />
                  <Upload size={24} color="#10b981" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    {uploadedFiles.resume_cv ? uploadedFiles.resume_cv.name : 'Upload your resume/CV (PDF, DOC)'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
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
        transition={{ duration: 0.3 }}
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
          transition: 'width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 32px 64px -16px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{
          padding: '20px 16px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <img src={logoImg} alt="Ovijan Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '10px' }} />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: 'white', fontWeight: '700', fontSize: '17px', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                  Ovijan
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ padding: '4px 10px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {primaryNavItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            const isExpanded = expandedSubmenu && item.id === 'dashboard';

            return (
              <div key={item.id} style={{ marginBottom: '2px' }}>
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02, duration: 0.2 }}
                  style={{ position: 'relative' }}
                >
                  <button
                    onClick={() => handleNavigation(item)}
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
                      transition: 'all 0.15s ease'
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {isActive && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', background: '#10b981', borderRadius: '0 3px 3px 0' }} />}
                      <Icon size={18} style={{ flexShrink: 0 }} />
                      <AnimatePresence mode="wait">
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            style={{ fontSize: '13.5px', fontWeight: isActive ? '600' : '400', whiteSpace: 'nowrap', letterSpacing: '-0.01em', overflow: 'hidden' }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {!sidebarCollapsed && item.hasSubmenu && (
                      <ChevronDown
                        size={14}
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          opacity: 0.5
                        }}
                      />
                    )}
                  </button>
                </motion.div>

                <AnimatePresence>
                  {!sidebarCollapsed && item.hasSubmenu && isExpanded && item.submenuItems && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden', marginLeft: '28px', marginTop: '4px' }}
                    >
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0 }}
                        onClick={() => {
                          navigate('/dashboard');
                          handleNavigation(item);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          background: activeNav === item.id ? 'rgba(16,185,129,0.08)' : 'transparent',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          marginBottom: '4px',
                          color: activeNav === item.id ? '#10b981' : 'rgba(255,255,255,0.5)',
                          fontSize: '12.5px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = activeNav === item.id ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.06)';
                          e.currentTarget.style.color = activeNav === item.id ? '#10b981' : 'rgba(255,255,255,0.8)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = activeNav === item.id ? 'rgba(16,185,129,0.08)' : 'transparent';
                          e.currentTarget.style.color = activeNav === item.id ? '#10b981' : 'rgba(255,255,255,0.5)';
                        }}
                      >
                        <LayoutDashboard size={14} />
                        <span style={{ flex: 1, textAlign: 'left' }}>Main Dashboard</span>
                      </motion.button>

                      <div style={{
                        height: '1px',
                        background: 'rgba(255,255,255,0.06)',
                        margin: '8px 8px',
                      }} />

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

                      {item.submenuItems.map((subItem, subIdx) => {
                        const isCountryActive = activeCountry?.id === subItem.state?.countryId;
                        return (
                          <motion.button
                            key={subItem.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (subIdx + 1) * 0.02 }}
                            onClick={() => handleNavigation(item, subItem)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              background: isCountryActive ? 'rgba(16,185,129,0.08)' : 'transparent',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              marginBottom: '2px',
                              color: isCountryActive ? '#10b981' : 'rgba(255,255,255,0.5)',
                              transition: 'all 0.15s ease',
                              fontSize: '12.5px'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = isCountryActive ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.06)';
                              e.currentTarget.style.color = isCountryActive ? '#10b981' : 'rgba(255,255,255,0.8)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = isCountryActive ? 'rgba(16,185,129,0.08)' : 'transparent';
                              e.currentTarget.style.color = isCountryActive ? '#10b981' : 'rgba(255,255,255,0.5)';
                            }}
                          >
                            <span style={{ fontSize: '14px' }}>{subItem.flag}</span>
                            <span style={{ flex: 1, textAlign: 'left' }}>{subItem.label}</span>
                            {isCountryActive && <CheckCircle size={10} color="#10b981" />}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', margin: '4px 16px' }} />

        <div style={{ padding: '8px 10px 10px', flexShrink: 0 }}>
          {!sidebarCollapsed && <div style={{ padding: '4px 4px 8px' }}><span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Account</span></div>}
         
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isLogout = item.id === 'logout';
            return (
              <button key={item.id} onClick={() => handleNavigation(item)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px', minHeight: '46px', padding: '0 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start', background: 'transparent', border: 'none', borderRadius: '12px',
                cursor: 'pointer', marginBottom: '2px', color: isLogout ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = isLogout ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = isLogout ? '#ef4444' : 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isLogout ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.4)'; }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.15 }}
                      style={{ fontSize: '13.5px', fontWeight: '400', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarCollapsed ? '100px' : '288px', transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', minHeight: '100vh', padding: '16px 20px 32px' }}>

        {/* Navbar */}
        <div style={{ background: 'white', borderRadius: '20px', marginBottom: '28px', boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -6px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ width: '32px', height: '32px', background: '#f8fafc', border: '1px solid #e9ecef', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ArrowLeft size={16} color="#64748b" />
                </button>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={16} color="white" />
                </div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, color: '#0a0f1e', letterSpacing: '-0.03em' }}>
                  Universities in <span style={{ color: '#10b981' }}>{countryName ? countryName.toUpperCase() : (activeCountry ? activeCountry.name.toUpperCase() : 'ALL COUNTRIES')}</span>
                </h1>
              </div>
              <p style={{ color: '#94a3b8', margin: '0', fontSize: '13px' }}>
                {filteredUniversities.length} universities found • Sorted by {filters.sortBy}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: showFilters ? '#0a0f1e' : '#f8fafc', border: `1.5px solid ${showFilters ? '#0a0f1e' : '#e9ecef'}`, borderRadius: '40px', fontSize: '13px', color: showFilters ? 'white' : '#475569', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: '500', transition: 'all 0.15s' }}>
                <Filter size={15} /><span>Filters</span>{showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', cursor: 'pointer' }}>
                {getInitials()}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={20} color="#10b981" />
              </div>
              <TrendingUp size={14} color="#10b981" />
            </div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', margin: '0 0 4px', textTransform: 'uppercase' }}>Total Universities</p>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#0a0f1e', margin: 0 }}>{filteredUniversities.length}</p>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={20} color="#6366f1" />
              </div>
              <TrendingUp size={14} color="#6366f1" />
            </div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', margin: '0 0 4px', textTransform: 'uppercase' }}>Country</p>
            <p style={{ fontSize: '20px', fontWeight: '800', color: '#0a0f1e', margin: 0 }}>{countryName || (activeCountry ? activeCountry.name : 'Global')}</p>
          </div>
          
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ background: 'white', borderRadius: '20px', marginBottom: '28px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>University Type</label>
                    <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#f8fafc' }}>
                      <option value="all">All Types</option>
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Max Ranking (≤)</label>
                    <input type="number" placeholder="e.g., 100" value={filters.minRanking} onChange={(e) => setFilters({ ...filters, minRanking: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#f8fafc' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Max Tuition (USD)</label>
                    <input type="number" placeholder="e.g., 50000" value={filters.maxTuition} onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#f8fafc' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Sort By</label>
                    <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e9ecef', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#f8fafc' }}>
                      <option value="ranking">Ranking (Best First)</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Showing <span style={{ color: '#10b981', fontWeight: '700' }}>{filteredUniversities.length}</span> universities</span>
                  <button onClick={clearFilters} style={{ padding: '8px 20px', background: '#f8fafc', border: '1px solid #e9ecef', borderRadius: '40px', fontSize: '12px', color: '#64748b', cursor: 'pointer', fontWeight: '500', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#10b981'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e9ecef'; }}>Clear All Filters</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Universities Grid */}
        {!loading && filteredUniversities.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            {filteredUniversities.map((uni, idx) => (
              <div key={uni.id || idx} className="premium-card" onMouseEnter={() => setHoveredCard(idx)} onMouseLeave={() => setHoveredCard(null)}
                style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -6px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', transform: hoveredCard === idx ? 'translateY(-8px)' : 'translateY(0)' }}>

                {/* Image Section */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <img src={getImageUrl(uni.image_url)} alt={uni.name} className="card-image"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hoveredCard === idx ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    onError={(e) => { e.target.src = '/images/university-placeholder.jpg'; e.target.onerror = null; }} loading="lazy" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.9) 0%, rgba(10,15,30,0.2) 55%, transparent 100%)' }} />

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <div style={{ background: 'rgba(16,185,129,0.95)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'white', letterSpacing: '0.5px' }}>#{uni.ranking || 'TOP'}</span>
                    </div>
                  </div>

                  <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#0f172a' }}>{uni.type || 'University'}</span>
                    </div>
                  </div>

                  {/* Overlay Text */}
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white', margin: '0 0 6px', letterSpacing: '-0.02em', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{uni.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="rgba(255,255,255,0.8)" />
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{uni.location || 'Location N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
                      <DollarSign size={14} color="#059669" style={{ margin: '0 auto 6px' }} />
                      <p style={{ fontSize: '9px', fontWeight: '700', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase' }}>Tuition</p>
                      <p style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{uni.tuition ? formatCurrency(uni.tuition) : 'Varies'}</p>
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
                      <Calendar size={14} color="#10b981" style={{ margin: '0 auto 6px' }} />
                      <p style={{ fontSize: '9px', fontWeight: '700', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase' }}>Established</p>
                      <p style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{uni.established || 'N/A'}</p>
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
                      <Users size={14} color="#f59e0b" style={{ margin: '0 auto 6px' }} />
                      <p style={{ fontSize: '9px', fontWeight: '700', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase' }}>Students</p>
                      <p style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{uni.students || '25k+'}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.55', margin: '0 0 20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {uni.description || `${uni.name} is a prestigious institution offering world-class education and research opportunities in ${countryName || (activeCountry ? activeCountry.name : 'the world')}.`}
                  </p>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleUniversityClick(uni)}
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
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.background = '#f8fafc';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#e9ecef';
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      <Eye size={12} /> Details
                    </button>
                    <button onClick={(e) => handleApplyClick(uni, e)} style={{ flex: 1, padding: '11px', background: hoveredCard === idx ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.3s ease', boxShadow: hoveredCard === idx ? '0 4px 12px rgba(16,185,129,0.4)' : 'none' }}>
                      <Send size={12} /> Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
            <button onClick={clearFilters} style={{ padding: '12px 32px', background: '#10b981', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Clear All Filters</button>
          </div>
        )}
      </div>

      {/* Multi-Step Application Modal */}
      <AnimatePresence>
        {showApplyModal && selectedUniForApply && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}
            onClick={() => !submitting && setShowApplyModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: 'white', borderRadius: '28px', maxWidth: '700px', width: '90%', maxHeight: '85vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{ padding: '24px 28px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(135deg, #f8fafc, #ffffff)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#0a0f1e' }}>Application Form</h2>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>{selectedUniForApply.name} • {countryName || activeCountry?.name || 'Global'}</p>
                  </div>
                  <button onClick={() => setShowApplyModal(false)} style={{ background: '#f8fafc', border: '1px solid #e9ecef', borderRadius: '12px', width: '36px', height: '36px', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                
                {/* Step Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                  {[1, 2, 3, 4].map(step => (
                    <React.Fragment key={step}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%', background: currentStep >= step ? '#10b981' : '#e9ecef',
                            color: currentStep >= step ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '700', transition: 'all 0.3s'
                          }}>{step}</div>
                          <span style={{ fontSize: '10px', marginTop: '6px', color: currentStep >= step ? '#10b981' : '#94a3b8' }}>
                            {step === 1 ? 'Personal' : step === 2 ? 'Academic' : step === 3 ? 'Tests' : 'Program'}
                          </span>
                        </div>
                      </div>
                      {step < 4 && <div style={{ flex: 2, height: '2px', background: currentStep > step ? '#10b981' : '#e9ecef', margin: '0 8px' }} />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              {/* Modal Body */}
              <div style={{ padding: '28px' }}>
                {submitSuccess ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <CheckCircle size={40} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#0a0f1e' }}>Application Submitted!</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Your application has been successfully submitted. You will receive updates via email.</p>
                    <button onClick={() => setShowApplyModal(false)} style={{ padding: '12px 32px', background: '#10b981', color: 'white', border: 'none', borderRadius: '40px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitApplication}>
                    {renderStepContent()}
                    
                    {submitError && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '14px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertCircle size={16} color="#dc2626" />
                        <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{submitError}</p>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
                      {currentStep > 1 && (
                        <button type="button" onClick={handlePreviousStep} style={{ flex: 1, padding: '14px', border: '1.5px solid #e9ecef', background: 'white', borderRadius: '14px', fontWeight: '600', cursor: 'pointer' }}>
                          Previous
                        </button>
                      )}
                      {currentStep < 4 ? (
                        <button type="button" onClick={handleNextStep} style={{ flex: 1, padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          Next <ChevronRight size={16} />
                        </button>
                      ) : (
                        <button type="submit" disabled={submitting} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: submitting ? 0.7 : 1 }}>
                          {submitting ? <><div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Submitting...</> : <><Send size={14} /> Submit Application</>}
                        </button>
                      )}
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

export default Universities;