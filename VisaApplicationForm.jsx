// VisaApplicationForm.jsx - Professional Multi-Step Form for Students & Job Seekers
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User, IdCard, Calendar, Briefcase, DollarSign,
  Shield, FileText, CheckCircle, ChevronRight,
  ChevronLeft, AlertCircle, Upload, GraduationCap,
  Building, Phone, Mail, Home, Globe, Flag, Plane,
  Lock, Smartphone, Clock, Users,
  BookOpen, Stethoscope, Wrench, Languages,
  University, Briefcase as BriefcaseIcon,
  Send, LogOut, Settings, HelpCircle, Menu, X, Edit2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const VisaApplicationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { selectedCountry, selectedVisaType } = location.state || {};
  
  const [currentStep, setCurrentStep] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [secureAccessCode, setSecureAccessCode] = useState('');
  const [stepError, setStepError] = useState('');
  
  // University and Department Data
  const [universities, setUniversities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [selectedUniversityId, setSelectedUniversityId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [departmentDetails, setDepartmentDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportExpiryDate: '',
    phoneNumber: '',
    homeAddress: '',
    intendedTravelDate: '',
    universityName: '',
    courseName: '',
    acceptanceLetter: null,
    jobTitle: '',
    companyName: '',
    jobOfferLetter: null,
    proofOfFunds: null,
    hasCriminalRecord: false,
    hasVisaRefusal: false,
    agreeTerms: false,
    agreeAccuracy: false
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

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
    gradient: 'linear-gradient(135deg, #0F2B3D 0%, #1B4F6E 100%)'
  };

  // IMPORTANT: Move this BEFORE the useEffect that uses it
  const isStudentVisa = selectedVisaType?.category === 'student' || selectedVisaType?.type === 'student';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize EmailJS with your public key
  useEffect(() => {
    emailjs.init('FkjwiVZo6TEcze8uU');
  }, []);

  // Fetch universities when country is selected and visa type is student
  useEffect(() => {
    if (isStudentVisa && selectedCountry && selectedCountry.id) {
      fetchUniversitiesByCountry(selectedCountry.id);
    }
  }, [selectedCountry, isStudentVisa]);

  // Fetch departments when university is selected
  useEffect(() => {
    if (selectedUniversityId) {
      fetchDepartmentsByUniversity(selectedUniversityId);
    } else {
      setDepartments([]);
      setSelectedDepartmentId('');
      setDepartmentDetails(null);
      setFormData(prev => ({ ...prev, universityName: '', courseName: '' }));
    }
  }, [selectedUniversityId]);

  // Update form data when department is selected
  useEffect(() => {
    if (selectedDepartmentId && departmentDetails) {
      setFormData(prev => ({ 
        ...prev, 
        courseName: departmentDetails.name 
      }));
    }
  }, [selectedDepartmentId, departmentDetails]);

  const fetchUniversitiesByCountry = async (countryId) => {
    setLoadingUniversities(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/universities/country/${countryId}`);
      const data = await response.json();
      console.log('Universities:', data);
      
      let universitiesData = [];
      if (Array.isArray(data)) {
        universitiesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        universitiesData = data.data;
      } else if (data.universities && Array.isArray(data.universities)) {
        universitiesData = data.universities;
      }
      
      setUniversities(universitiesData);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setUniversities([]);
    } finally {
      setLoadingUniversities(false);
    }
  };

  const fetchDepartmentsByUniversity = async (universityId) => {
    setLoadingDepartments(true);
    setDepartments([]);
    setSelectedDepartmentId('');
    setDepartmentDetails(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/departments/university/${universityId}`);
      const data = await response.json();
      console.log('Departments API response:', data);
      
      let departmentsData = [];
      if (Array.isArray(data)) {
        departmentsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        departmentsData = data.data;
      } else if (data.departments && Array.isArray(data.departments)) {
        departmentsData = data.departments;
      }
      
      setDepartments(departmentsData);
      
      // Update university name in form
      const selectedUniv = universities.find(u => u.id == universityId);
      if (selectedUniv) {
        setFormData(prev => ({ ...prev, universityName: selectedUniv.name }));
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleUniversityChange = (e) => {
    const universityId = e.target.value;
    setSelectedUniversityId(universityId);
    if (!universityId) {
      setFormData(prev => ({ ...prev, universityName: '', courseName: '' }));
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartmentId(departmentId);
    const selectedDept = departments.find(d => d.id == departmentId);
    setDepartmentDetails(selectedDept || null);
  };

  const navLinks = [
    { name: 'Visa Guide', path: '/visaguide', icon: Globe },
    { name: 'Track Application', path: '/visatracker', icon: Clock },
  ];

  const getInitials = () => formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'GU';

  const generateSecureAccessCode = () => {
    const prefix = 'VISA';
    const random = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${random}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (stepError) setStepError('');
  };

  const handleBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    }
    
    if (currentStep === 2) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    }
    
    if (currentStep === 3) {
      if (!formData.passportNumber) newErrors.passportNumber = 'Passport number is required';
      if (!formData.passportExpiryDate) newErrors.passportExpiryDate = 'Passport expiry date is required';
    }
    
    if (currentStep === 4) {
      if (!formData.homeAddress) newErrors.homeAddress = 'Home address is required';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (currentStep === 5) {
      if (!formData.intendedTravelDate) newErrors.intendedTravelDate = 'Intended travel date is required';
    }
    
    if (currentStep === 6) {
      if (isStudentVisa) {
        if (!selectedUniversityId) newErrors.universityName = 'Please select a university';
        if (!selectedDepartmentId) newErrors.courseName = 'Please select a course/department';
        if (!formData.acceptanceLetter) newErrors.acceptanceLetter = 'Acceptance letter is required';
      } else {
        if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required';
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.jobOfferLetter) newErrors.jobOfferLetter = 'Job offer letter is required';
      }
    }
    
    if (currentStep === 7) {
      if (!formData.proofOfFunds) newErrors.proofOfFunds = 'Proof of funds is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setStepError('Please fill all required fields before proceeding');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 9));
      setStepError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setStepError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendEmailNotification = async (accessCode, applicationRef) => {
    const templateParams = {
      to_email: formData.email,
      to_name: formData.fullName,
      secure_access_code: accessCode,
      application_reference: applicationRef,
      visa_type: isStudentVisa ? 'Student Visa' : 'Job Seeker Visa',
      country: selectedCountry?.name || 'Not specified',
      submission_date: new Date().toLocaleDateString()
    };

    try {
      await emailjs.send(
        'service_h9ebed8',
        'template_luy6v8v',
        templateParams
      );
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Email send error:', error);
    }
  };

  const validateFinalStep = () => {
    const newErrors = {};
    
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    if (!formData.agreeAccuracy) newErrors.agreeAccuracy = 'You must confirm accuracy of information';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setStepError('Please agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFinalStep()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const accessCode = generateSecureAccessCode();
      setSecureAccessCode(accessCode);
      
      const formDataToSend = new FormData();
      
      // Basic Info
      formDataToSend.append('email', formData.email);
      formDataToSend.append('full_name', formData.fullName);
      formDataToSend.append('date_of_birth', formData.dateOfBirth);
      formDataToSend.append('nationality', formData.nationality);
      formDataToSend.append('passport_number', formData.passportNumber);
      formDataToSend.append('passport_expiry_date', formData.passportExpiryDate);
      formDataToSend.append('phone_number', formData.phoneNumber);
      formDataToSend.append('home_address', formData.homeAddress);
      formDataToSend.append('intended_travel_date', formData.intendedTravelDate);
      formDataToSend.append('visa_type', isStudentVisa ? 'student' : 'job_seeker');
      formDataToSend.append('has_criminal_record', formData.hasCriminalRecord ? '1' : '0');
      formDataToSend.append('has_visa_refusal', formData.hasVisaRefusal ? '1' : '0');
      formDataToSend.append('agree_terms', formData.agreeTerms ? '1' : '0');
      formDataToSend.append('agree_accuracy', formData.agreeAccuracy ? '1' : '0');
      formDataToSend.append('secure_access_code', accessCode);
      
      // Country Info
      if (selectedCountry) {
        formDataToSend.append('selected_country_id', selectedCountry.id || '');
        formDataToSend.append('selected_country_name', selectedCountry.name || '');
      }
      
      // Student Visa Fields
      if (isStudentVisa) {
        const universityName = formData.universityName || (universities.find(u => u.id == selectedUniversityId)?.name || '');
        const courseName = formData.courseName || (departmentDetails?.name || '');
        
        formDataToSend.append('university_name', universityName);
        formDataToSend.append('course_name', courseName);
        
        if (formData.acceptanceLetter) {
          formDataToSend.append('acceptance_letter', formData.acceptanceLetter);
        }
      } else {
        // Job Seeker Fields
        formDataToSend.append('job_title', formData.jobTitle);
        formDataToSend.append('company_name', formData.companyName);
        if (formData.jobOfferLetter) {
          formDataToSend.append('job_offer_letter', formData.jobOfferLetter);
        }
      }
      
      // Proof of Funds
      if (formData.proofOfFunds) {
        formDataToSend.append('proof_of_funds', formData.proofOfFunds);
      }
      
      // Log what we're sending for debugging
      console.log('Sending data:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await fetch('http://127.0.0.1:8000/api/visa/apply', {
        method: 'POST',
        body: formDataToSend
      });
      
      const result = await response.json();
      console.log('Response:', result);
      
      if (result.success) {
        await sendEmailNotification(accessCode, result.data.application_reference);
        
        const applications = JSON.parse(localStorage.getItem('visaApplications') || '[]');
        applications.push({
          ...formData,
          selectedCountry,
          selectedVisaType,
          secure_access_code: accessCode,
          application_reference: result.data.application_reference,
          application_status: result.data.application_status,
          submittedAt: result.data.submitted_at
        });
        localStorage.setItem('visaApplications', JSON.stringify(applications));
        
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/visatracker');
        }, 3000);
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join('\n');
          alert('Validation Error:\n' + errorMessages);
        } else {
          alert('Error: ' + (result.message || 'Failed to submit application'));
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error: ' + error.message + '\n\nMake sure Laravel is running on http://127.0.0.1:8000');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, name: 'Account', icon: Mail },
    { number: 2, name: 'Personal', icon: User },
    { number: 3, name: 'Passport', icon: IdCard },
    { number: 4, name: 'Contact', icon: Phone },
    { number: 5, name: 'Travel', icon: Plane },
    { number: 6, name: isStudentVisa ? 'Education' : 'Employment', icon: isStudentVisa ? GraduationCap : BriefcaseIcon },
    { number: 7, name: 'Financial', icon: DollarSign },
    { number: 8, name: 'Background', icon: Shield },
    { number: 9, name: 'Review', icon: CheckCircle }
  ];

  const getDisplayValue = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof File) return value.name;
    return value;
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '12px 16px',
    border: `1.5px solid ${hasError ? '#EF4444' : theme.border}`,
    borderRadius: '12px',
    fontSize: '14px',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    outline: 'none',
    background: 'white'
  });

  const buttonStyle = {
    primary: {
      background: theme.gradient,
      color: 'white',
      border: 'none',
      padding: '14px 32px',
      borderRadius: '40px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    secondary: {
      background: 'transparent',
      border: `2px solid ${theme.accent}`,
      color: theme.accent,
      padding: '12px 28px',
      borderRadius: '40px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    outline: {
      background: 'transparent',
      border: `1.5px solid ${theme.border}`,
      color: theme.text,
      padding: '8px 16px',
      borderRadius: '40px',
      fontWeight: '500',
      fontSize: '12px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: `linear-gradient(145deg, ${theme.light} 0%, #EFF3F8 100%)`,
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: ${theme.accent} !important; outline: none; box-shadow: 0 0 0 3px ${theme.accent}20; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <motion.nav initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        style={{
          position: 'sticky', top: 0, zIndex: 1000,
          background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'white',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          padding: '12px 24px',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.04)',
          transition: 'all 0.3s ease'
        }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}>
            <img src="/src/images/logo.png" alt="Ovhijan Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40x40?text=O'; }} />
            <div><h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0, background: 'linear-gradient(135deg, #0F2B3D 0%, #1B4F6E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ovhijan</h1>
           </div>
          </div>

          {/* <div style={{   display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '24px', }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button key={link.name} onClick={() => navigate(link.path)}
                  style={{ background: 'transparent', border: 'none', fontSize: '14px', fontWeight: '500', color: '#475569', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.background = '#f0fdf4'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}>
                  <Icon size={16} /> {link.name}
                </button>
              );
            })}
          </div> */}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none', padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>{showSuccessModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            style={{ background: 'white', borderRadius: '24px', padding: '32px', textAlign: 'center', maxWidth: '400px', margin: '20px' }}>
            <div style={{ width: '60px', height: '60px', background: `${theme.success}15`, borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} color={theme.success} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: theme.primary, marginBottom: '8px' }}>Application Submitted!</h3>
            <p style={{ color: theme.textLight, fontSize: '14px', marginBottom: '20px' }}>Your visa application has been successfully submitted. A secure access code has been sent to your email.</p>
            <div style={{ background: theme.light, padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
             </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 60px 24px', width: '100%' }}>
        <div style={{ background: theme.cardBg, borderRadius: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', overflow: 'hidden', width: '100%' }}>
          
          <div style={{ background: theme.gradient, padding: '32px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '2rem', marginRight: '12px' }}>{selectedCountry?.flag || '🌍'}</span>
                <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>{selectedCountry?.name || 'Visa Application'}</span>
                <ChevronRight size={16} style={{ margin: '0 8px' }} />
                <span style={{ fontWeight: '500', fontSize: '1rem' }}>{selectedVisaType?.name || 'Application Form'}</span>
              </div>
              <button onClick={() => navigate('/visaguide')}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 20px', borderRadius: '40px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>
                ← Back to Guide
              </button>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>Visa Application Form</h2>
            <p style={{ opacity: 0.9, fontSize: '0.85rem' }}>Complete all sections accurately.</p>
          </div>

          <div style={{ background: theme.light, padding: '16px 24px', borderBottom: `1px solid ${theme.border}`, overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', minWidth: 'max-content' }}>
              {steps.map(step => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isActive = currentStep === step.number;
                return (
                  <div key={step.number} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '40px',
                      background: isActive ? theme.accent : isCompleted ? `${theme.success}15` : 'white',
                      color: isActive ? 'white' : isCompleted ? theme.success : theme.text,
                      border: isActive ? 'none' : `1px solid ${theme.border}` }}>
                    {isCompleted ? <CheckCircle size={14} /> : <Icon size={14} />}
                    <span style={{ fontSize: '13px', fontWeight: isActive ? '600' : '500', whiteSpace: 'nowrap' }}>{step.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding: '32px' }}>
              {/* Step Error Message */}
              {stepError && (
                <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={18} color="#EF4444" />
                  <span style={{ color: '#B91C1C', fontSize: '13px' }}>{stepError}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: theme.primary, marginBottom: '8px' }}>Account Information</h3>
                    <p style={{ fontSize: '0.85rem', color: theme.textLight, marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}` }}>Enter your email address</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Mail size={14} /> Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} style={inputStyle(errors.email && touchedFields.email)} placeholder="your@email.com" />
                        {errors.email && touchedFields.email && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: theme.primary, marginBottom: '8px' }}>Personal Information</h3>
                    <p style={{ fontSize: '0.85rem', color: theme.textLight, marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}` }}>As it appears in your passport</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><User size={14} /> Full Name *</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={() => handleBlur('fullName')} style={inputStyle(errors.fullName && touchedFields.fullName)} placeholder="As in passport" />
                        {errors.fullName && touchedFields.fullName && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Calendar size={14} /> Date of Birth *</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} onBlur={() => handleBlur('dateOfBirth')} style={inputStyle(errors.dateOfBirth && touchedFields.dateOfBirth)} />
                        {errors.dateOfBirth && touchedFields.dateOfBirth && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.dateOfBirth}</span>}
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Globe size={14} /> Nationality *</label>
                        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} onBlur={() => handleBlur('nationality')} style={inputStyle(errors.nationality && touchedFields.nationality)} placeholder="Your country of citizenship" />
                        {errors.nationality && touchedFields.nationality && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.nationality}</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: theme.primary, marginBottom: '8px' }}>Passport Details</h3>
                    <p style={{ fontSize: '0.85rem', color: theme.textLight, marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}` }}>Your current valid passport information</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><IdCard size={14} /> Passport Number *</label>
                        <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} onBlur={() => handleBlur('passportNumber')} style={inputStyle(errors.passportNumber && touchedFields.passportNumber)} placeholder="Your passport number" />
                        {errors.passportNumber && touchedFields.passportNumber && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.passportNumber}</span>}
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Calendar size={14} /> Date of Expiry *</label>
                        <input type="date" name="passportExpiryDate" value={formData.passportExpiryDate} onChange={handleChange} onBlur={() => handleBlur('passportExpiryDate')} style={inputStyle(errors.passportExpiryDate && touchedFields.passportExpiryDate)} />
                        {errors.passportExpiryDate && touchedFields.passportExpiryDate && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.passportExpiryDate}</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: theme.primary, marginBottom: '8px' }}>Contact Information</h3>
                    <p style={{ fontSize: '0.85rem', color: theme.textLight, marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}` }}>Where we can reach you</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Home size={14} /> Home Address *</label>
                        <input type="text" name="homeAddress" value={formData.homeAddress} onChange={handleChange} onBlur={() => handleBlur('homeAddress')} style={inputStyle(errors.homeAddress && touchedFields.homeAddress)} placeholder="Street address" />
                        {errors.homeAddress && touchedFields.homeAddress && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.homeAddress}</span>}
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Smartphone size={14} /> Phone Number *</label>
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} onBlur={() => handleBlur('phoneNumber')} style={inputStyle(errors.phoneNumber && touchedFields.phoneNumber)} placeholder="+1234567890" />
                        {errors.phoneNumber && touchedFields.phoneNumber && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.phoneNumber}</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: theme.primary, marginBottom: '8px' }}>Travel Details</h3>
                    <p style={{ fontSize: '0.85rem', color: theme.textLight, marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}` }}>Information about your planned trip</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Calendar size={14} /> Intended Travel Date *</label>
                        <input type="date" name="intendedTravelDate" value={formData.intendedTravelDate} onChange={handleChange} onBlur={() => handleBlur('intendedTravelDate')} style={inputStyle(errors.intendedTravelDate && touchedFields.intendedTravelDate)} />
                        {errors.intendedTravelDate && touchedFields.intendedTravelDate && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.intendedTravelDate}</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 6 && (
                  <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: theme.primary, marginBottom: '8px' }}>{isStudentVisa ? 'Education Details' : 'Employment Details'}</h3>
                    <p style={{ fontSize: '0.85rem', color: theme.textLight, marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}` }}>
                      {isStudentVisa ? 'Information about your academic background' : 'Information about your job offer'}
                    </p>
                    
                    {isStudentVisa ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><University size={14} /> Select University *</label>
                          <select 
                            value={selectedUniversityId} 
                            onChange={handleUniversityChange}
                            style={inputStyle(errors.universityName)}
                            disabled={loadingUniversities}
                          >
                            <option value="">-- Select University --</option>
                            {universities.map(univ => (
                              <option key={univ.id} value={univ.id}>{univ.name}</option>
                            ))}
                          </select>
                          {loadingUniversities && <span style={{ fontSize: '11px', color: theme.textLight }}>Loading universities...</span>}
                          {errors.universityName && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.universityName}</span>}
                        </div>
                        
                        {selectedUniversityId && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><BookOpen size={14} /> Select Course/Department *</label>
                            <select 
                              value={selectedDepartmentId} 
                              onChange={handleDepartmentChange}
                              style={inputStyle(errors.courseName)}
                              disabled={loadingDepartments || departments.length === 0}
                            >
                              <option value="">-- Select Department --</option>
                              {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name} {dept.short_name && `(${dept.short_name})`}</option>
                              ))}
                            </select>
                            {loadingDepartments && <span style={{ fontSize: '11px', color: theme.textLight }}>Loading departments...</span>}
                            {departments.length === 0 && selectedUniversityId && !loadingDepartments && (
                              <span style={{ fontSize: '11px', color: theme.warning }}>No departments found for this university</span>
                            )}
                            {errors.courseName && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.courseName}</span>}
                          </div>
                        )}
                        
                        {departmentDetails && (
                          <div style={{ gridColumn: '1 / -1', background: theme.light, borderRadius: '12px', padding: '16px', marginTop: '8px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '600', color: theme.primary, marginBottom: '8px' }}>Course Details:</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12px' }}>
                              {departmentDetails.total_cridits && <div><strong>Total Credits:</strong> {departmentDetails.total_cridits}</div>}
                              {departmentDetails.cridit_fee && <div><strong>Credit Fee:</strong> ${departmentDetails.cridit_fee}</div>}
                              {departmentDetails.total_tution && <div><strong>Total Tuition:</strong> ${departmentDetails.total_tution}</div>}
                              {departmentDetails.description && <div style={{ gridColumn: '1 / -1' }}><strong>Description:</strong> {departmentDetails.description}</div>}
                            </div>
                          </div>
                        )}
                        
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Upload size={14} /> Acceptance Letter *</label>
                          <input type="file" name="acceptanceLetter" onChange={handleChange} style={{ padding: '10px', border: `1.5px dashed ${theme.border}`, borderRadius: '12px', fontSize: '13px', background: theme.light, cursor: 'pointer', width: '100%' }} accept=".pdf,.jpg,.png" />
                          {errors.acceptanceLetter && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.acceptanceLetter}</span>}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><BriefcaseIcon size={14} /> Job Title *</label>
                          <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} onBlur={() => handleBlur('jobTitle')} style={inputStyle(errors.jobTitle && touchedFields.jobTitle)} placeholder="e.g., Software Engineer" />
                          {errors.jobTitle && touchedFields.jobTitle && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.jobTitle}</span>}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Building size={14} /> Company Name *</label>
                          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} onBlur={() => handleBlur('companyName')} style={inputStyle(errors.companyName && touchedFields.companyName)} placeholder="Company name" />
                          {errors.companyName && touchedFields.companyName && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.companyName}</span>}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Upload size={14} /> Job Offer Letter *</label>
                          <input type="file" name="jobOfferLetter" onChange={handleChange} style={{ padding: '10px', border: `1.5px dashed ${theme.border}`, borderRadius: '12px', fontSize: '13px', background: theme.light, cursor: 'pointer', width: '100%' }} accept=".pdf,.jpg,.png" />
                          {errors.jobOfferLetter && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.jobOfferLetter}</span>}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 7 && (
                  <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: theme.primary, marginBottom: '8px' }}>Financial Information</h3>
                    <p style={{ fontSize: '0.85rem', color: theme.textLight, marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}` }}>Proof that you can support yourself</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '6px', display: 'block' }}><Upload size={14} /> Proof of Funds *</label>
                        <input type="file" name="proofOfFunds" onChange={handleChange} style={{ padding: '10px', border: `1.5px dashed ${theme.border}`, borderRadius: '12px', fontSize: '13px', background: theme.light, cursor: 'pointer', width: '100%' }} accept=".pdf" />
                        {errors.proofOfFunds && <span style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.proofOfFunds}</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 8 && (
                  <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: theme.primary, marginBottom: '8px' }}>Background Information</h3>
                    <p style={{ fontSize: '0.85rem', color: theme.textLight, marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}` }}>Please answer all questions truthfully</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ background: theme.light, borderRadius: '16px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <input type="checkbox" name="hasCriminalRecord" checked={formData.hasCriminalRecord} onChange={handleChange} />
                          <span style={{ fontWeight: '500' }}>Have you ever been convicted of a criminal offense?</span>
                        </div>
                      </div>
                      <div style={{ background: theme.light, borderRadius: '16px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <input type="checkbox" name="hasVisaRefusal" checked={formData.hasVisaRefusal} onChange={handleChange} />
                          <span style={{ fontWeight: '500' }}>Have you ever been refused a visa for any country?</span>
                        </div>
                      </div>
                      <div style={{ background: `${theme.warning}10`, borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertCircle size={20} color={theme.warning} />
                        <span style={{ fontSize: '13px' }}>Providing false information may result in visa refusal.</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 9 && (
                  <motion.div key="step9" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: theme.primary, marginBottom: '8px' }}>Review & Submit</h3>
                    <p style={{ fontSize: '0.85rem', color: theme.textLight, marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}` }}>Please review your information before submitting</p>
                    
                    <div style={{ background: theme.light, borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontWeight: '600', color: theme.primary, display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> Personal Information</h4>
                        <button type="button" onClick={() => setCurrentStep(2)} style={buttonStyle.outline}><Edit2 size={14} /> Edit</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                        <div><strong>Full Name:</strong> {getDisplayValue(formData.fullName)}</div>
                        <div><strong>Date of Birth:</strong> {getDisplayValue(formData.dateOfBirth)}</div>
                        <div><strong>Nationality:</strong> {getDisplayValue(formData.nationality)}</div>
                      </div>
                    </div>

                    <div style={{ background: theme.light, borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontWeight: '600', color: theme.primary, display: 'flex', alignItems: 'center', gap: '8px' }}><IdCard size={18} /> Passport Details</h4>
                        <button type="button" onClick={() => setCurrentStep(3)} style={buttonStyle.outline}><Edit2 size={14} /> Edit</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                        <div><strong>Passport Number:</strong> {getDisplayValue(formData.passportNumber)}</div>
                        <div><strong>Expiry Date:</strong> {getDisplayValue(formData.passportExpiryDate)}</div>
                      </div>
                    </div>

                    <div style={{ background: theme.light, borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontWeight: '600', color: theme.primary, display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={18} /> Contact Details</h4>
                        <button type="button" onClick={() => setCurrentStep(4)} style={buttonStyle.outline}><Edit2 size={14} /> Edit</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                        <div><strong>Email:</strong> {getDisplayValue(formData.email)}</div>
                        <div><strong>Phone:</strong> {getDisplayValue(formData.phoneNumber)}</div>
                        <div><strong>Address:</strong> {getDisplayValue(formData.homeAddress)}</div>
                      </div>
                    </div>

                    <div style={{ background: theme.light, borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontWeight: '600', color: theme.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>{isStudentVisa ? <GraduationCap size={18} /> : <BriefcaseIcon size={18} />} {isStudentVisa ? 'Education' : 'Employment'}</h4>
                        <button type="button" onClick={() => setCurrentStep(6)} style={buttonStyle.outline}><Edit2 size={14} /> Edit</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                        {isStudentVisa ? (
                          <>
                            <div><strong>University:</strong> {getDisplayValue(formData.universityName)}</div>
                            <div><strong>Course:</strong> {getDisplayValue(formData.courseName)}</div>
                          </>
                        ) : (
                          <>
                            <div><strong>Job Title:</strong> {getDisplayValue(formData.jobTitle)}</div>
                            <div><strong>Company:</strong> {getDisplayValue(formData.companyName)}</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ background: theme.light, borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontWeight: '600', color: theme.primary, display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} /> Background</h4>
                        <button type="button" onClick={() => setCurrentStep(8)} style={buttonStyle.outline}><Edit2 size={14} /> Edit</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                        <div><strong>Criminal Record:</strong> {formData.hasCriminalRecord ? 'Yes' : 'No'}</div>
                        <div><strong>Visa Refusal:</strong> {formData.hasVisaRefusal ? 'Yes' : 'No'}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} />
                        <span style={{ fontSize: '13px' }}>I agree to the Terms and Conditions</span>
                      </div>
                      {errors.agreeTerms && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginBottom: '8px' }}>{errors.agreeTerms}</span>}
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <input type="checkbox" name="agreeAccuracy" checked={formData.agreeAccuracy} onChange={handleChange} />
                        <span style={{ fontSize: '13px' }}>I confirm that all information provided is true and accurate</span>
                      </div>
                      {errors.agreeAccuracy && <span style={{ color: '#EF4444', fontSize: '11px', display: 'block' }}>{errors.agreeAccuracy}</span>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '24px', borderTop: `1px solid ${theme.border}` }}>
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} style={buttonStyle.secondary}>
                    <ChevronLeft size={18} /> Previous
                  </button>
                )}
                {currentStep < 9 && currentStep > 1 && <div style={{ flex: 1 }} />}
                
                {currentStep < 9 ? (
                  <button type="button" onClick={nextStep} style={buttonStyle.primary}>
                    Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} style={{ ...buttonStyle.primary, opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? (
                      <><div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Submitting...</>
                    ) : (
                      <><Send size={16} /> Submit</>
                    )}
                  </button>
                )}
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', color: theme.textLight }}>Step {currentStep} of 9 • {Math.round((currentStep / 9) * 100)}% Complete</span>
                <div style={{ width: '100%', height: '4px', background: theme.light, borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: '0%' }} animate={{ width: `${(currentStep / 9) * 100}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', background: theme.accent, borderRadius: '2px' }} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisaApplicationForm;