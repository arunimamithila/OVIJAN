// Profile.jsx - Complete

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Award, DollarSign, Calendar, Building,
  TrendingUp, Users, BookOpen, Clock, ChevronDown, ChevronUp,
  Filter, X, GraduationCap, Globe, Star, BarChart3, HardDrive,
  Terminal, Cpu, Server, Grid, Layers, Send, AlertCircle, CheckCircle,
  Eye, Heart, Crown, Sparkles, ArrowRight, LayoutDashboard, LogOut,
  Settings, UserCircle, Bookmark, FileText, Shield, Briefcase, Code,
  Brain, Target, Zap, UserCheck, Loader, Compass, Plus, ThumbsUp,
  Share2, MessageCircle, MoreHorizontal, Link2, Mail, Phone, Camera, Trash2, Edit3, Image, School, University
} from 'lucide-react';
import Sidebar from './Sidebar';

const API_BASE_URL = 'http://127.0.0.1:8000';


const getImageUrl = (imageName) => {
  if (!imageName) return null;

  if (!imageName.includes('profile_images/') &&
      !imageName.includes('cover_images/')) {
    return `/Posts/${imageName}`;
  }

  return `/${imageName}`;
};


const EditIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const SkeletonLoader = () => (
  <div style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
    <style>
      {`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}
    </style>
    <div style={{ background: 'white', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e9eef3', overflow: 'hidden' }}>
      <div style={{ height: '180px', background: '#e5e7eb' }} />
      <div style={{ padding: '0 24px 24px', position: 'relative' }}>
        <div style={{ marginTop: '-60px', marginBottom: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#e5e7eb', border: '4px solid white' }} />
          <div style={{ width: '100px', height: '36px', background: '#e5e7eb', borderRadius: '20px' }} />
        </div>
        <div style={{ width: '200px', height: '28px', background: '#e5e7eb', borderRadius: '8px', marginBottom: '8px' }} />
        <div style={{ width: '150px', height: '20px', background: '#e5e7eb', borderRadius: '8px', marginBottom: '12px' }} />
        <div style={{ width: '180px', height: '16px', background: '#e5e7eb', borderRadius: '8px' }} />
      </div>
    </div>
    <div style={{ background: 'white', borderRadius: '16px', padding: '0 24px', marginBottom: '24px', border: '1px solid #e9eef3', height: '56px', display: 'flex', alignItems: 'center', gap: '32px' }}>
      <div style={{ width: '60px', height: '20px', background: '#e5e7eb', borderRadius: '8px' }} />
      <div style={{ width: '60px', height: '20px', background: '#e5e7eb', borderRadius: '8px' }} />
      <div style={{ width: '120px', height: '20px', background: '#e5e7eb', borderRadius: '8px' }} />
    </div>
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ flex: 2, minWidth: '280px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid #e9eef3' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e5e7eb' }} />
              <div>
                <div style={{ width: '120px', height: '16px', background: '#e5e7eb', borderRadius: '8px', marginBottom: '6px' }} />
                <div style={{ width: '80px', height: '12px', background: '#e5e7eb', borderRadius: '8px' }} />
              </div>
            </div>
            <div style={{ width: '100%', height: '60px', background: '#e5e7eb', borderRadius: '8px', marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '24px', paddingTop: '12px', borderTop: '1px solid #e9eef3' }}>
              <div style={{ width: '60px', height: '20px', background: '#e5e7eb', borderRadius: '8px' }} />
              <div style={{ width: '60px', height: '20px', background: '#e5e7eb', borderRadius: '8px' }} />
              <div style={{ width: '60px', height: '20px', background: '#e5e7eb', borderRadius: '8px' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1.2, minWidth: '280px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #e9eef3' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ width: '100px', height: '16px', background: '#e5e7eb', borderRadius: '8px' }} />
            <div style={{ width: '40px', height: '16px', background: '#e5e7eb', borderRadius: '8px' }} />
          </div>
          <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', marginBottom: '16px' }} />
          <div style={{ width: '100%', height: '40px', background: '#e5e7eb', borderRadius: '20px' }} />
        </div>
        <div style={{ background: 'linear-gradient(135deg, #0a66c2 0%, #1e88e5 100%)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.3)', borderRadius: '8px' }} />
            <div style={{ width: '120px', height: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '8px' }} />
          </div>
          <div style={{ width: '100%', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '24px', marginTop: '16px' }} />
        </div>
      </div>
    </div>
  </div>
);

const ExperienceCard = ({ title, company, period, location, description }) => (
  <div style={{ display: 'flex', gap: '12px', padding: '16px 0', borderBottom: '1px solid #e9eef3' }}>
    <div style={{ width: '48px', height: '48px', background: '#f0f2f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Building size={24} color="#0a66c2" />
    </div>
    <div>
      <h4 style={{ fontWeight: 600, margin: 0, fontSize: '15px' }}>{title}</h4>
      <p style={{ fontSize: '13px', color: '#1d2c3c', margin: '2px 0' }}>Company: {company}</p>
      <p style={{ fontSize: '12px', color: '#6a737d', margin: '2px 0' }}>{period} • {location}</p>
      <p style={{ fontSize: '13px', color: '#6a737d', margin: '8px 0 0', lineHeight: '1.5' }}>Description: {description}</p>
    </div>
  </div>
);

const EducationCard = ({ education, onEdit, onDelete }) => {
  const getScore = () => {
    if (education.percentage_score) return `GPA/Percentage: ${education.percentage_score}`;
    if (education.cgpa) return `CGPA: ${education.cgpa}`;
    return null;
  };
  

  return (
    <div style={{ display: 'flex', gap: '12px', padding: '16px 0', borderBottom: '1px solid #e9eef3', position: 'relative' }}>
      <div style={{ width: '48px', height: '48px', background: '#f0f2f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {education.qualification_type === 'Higher Secondary' ? <School size={24} color="#0a66c2" /> : <University size={24} color="#0a66c2" />}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontWeight: 600, margin: 0, fontSize: '15px' }}>{education.qualification_type}</h4>
        <p style={{ fontSize: '13px', color: '#1d2c3c', margin: '2px 0' }}>{education.institution_name}</p>
        {education.board_university && <p style={{ fontSize: '12px', color: '#6a737d', margin: '2px 0' }}>{education.board_university}</p>}
        {education.degree_name && <p style={{ fontSize: '12px', color: '#6a737d', margin: '2px 0' }}>{education.degree_name} - {education.major_subject}</p>}
        <p style={{ fontSize: '12px', color: '#6a737d', margin: '2px 0' }}>Year: {education.completion_year}</p>
        {getScore() && <p style={{ fontSize: '13px', fontWeight: 500, color: '#0a66c2', margin: '8px 0 0' }}>{getScore()}</p>}
        {education.description && <p style={{ fontSize: '13px', color: '#6a737d', margin: '8px 0 0', lineHeight: '1.5' }}>{education.description}</p>}
      </div>
      {(onEdit || onDelete) && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          {onEdit && (
            <button onClick={() => onEdit(education)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0a66c2', padding: '4px' }}>
              <Edit3 size={16} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(education.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f', padding: '4px' }}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Dynamic Education Form based on selected qualification
const DynamicEducationForm = ({ qualification, formData, onChange, onCancel, onSave, isSaving }) => {
  if (!qualification) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6a737d' }}>
        <GraduationCap size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <p>Select a qualification to see the form</p>
      </div>
    );
  }

  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  if (qualification === 'Higher Secondary') {
    return (
      <div>
        <div style={{ background: '#f8faff', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <School size={20} color="#0a66c2" />
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#1d2c3c' }}>Higher Secondary Education</h4>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>School/College Name *</label>
            <input type="text" value={formData.institution_name || ''} onChange={(e) => handleFieldChange('institution_name', e.target.value)} placeholder="e.g., Delhi Public School" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Board/University</label>
            <input type="text" value={formData.board_university || ''} onChange={(e) => handleFieldChange('board_university', e.target.value)} placeholder="e.g., CBSE, ICSE, State Board" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Year of Completion *</label>
              <input type="text" value={formData.completion_year || ''} onChange={(e) => handleFieldChange('completion_year', e.target.value)} placeholder="e.g., 2022" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>GPA/Percentage</label>
              <input type="text" value={formData.percentage_score || ''} onChange={(e) => handleFieldChange('percentage_score', e.target.value)} placeholder="e.g., 5.00/80%" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Description (Optional)</label>
          <textarea value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} rows="3" placeholder="Any additional details..." style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', resize: 'vertical', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onCancel} style={{ padding: '10px 20px', border: '1px solid #e9eef3', background: 'white', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Cancel</button>
          <button onClick={onSave} disabled={isSaving || !formData.institution_name || !formData.completion_year} style={{ padding: '10px 24px', background: (!formData.institution_name || !formData.completion_year) ? '#e9eef3' : '#0a66c2', color: (!formData.institution_name || !formData.completion_year) ? '#6a737d' : 'white', border: 'none', borderRadius: '30px', cursor: (!formData.institution_name || !formData.completion_year) ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600 }}>Save Education</button>
        </div>
      </div>
    );
  }

  if (qualification === 'Undergraduate') {
    return (
      <div>
        <div style={{ background: '#f8faff', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <University size={20} color="#0a66c2" />
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#1d2c3c' }}>Undergraduate Education</h4>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>University/College Name *</label>
            <input type="text" value={formData.institution_name || ''} onChange={(e) => handleFieldChange('institution_name', e.target.value)} placeholder="e.g., Stanford University" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Degree Name *</label>
            <input type="text" value={formData.degree_name || ''} onChange={(e) => handleFieldChange('degree_name', e.target.value)} placeholder="e.g., B.Tech, B.Sc, B.A" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Major/Specialization</label>
            <input type="text" value={formData.major_subject || ''} onChange={(e) => handleFieldChange('major_subject', e.target.value)} placeholder="e.g., Computer Science" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Year of Completion *</label>
              <input type="text" value={formData.completion_year || ''} onChange={(e) => handleFieldChange('completion_year', e.target.value)} placeholder="e.g., 2024" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>CGPA/Percentage</label>
              <input type="text" value={formData.cgpa || ''} onChange={(e) => handleFieldChange('cgpa', e.target.value)} placeholder="e.g., 8.5/10 or 85%" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Description (Optional)</label>
          <textarea value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} rows="3" placeholder="Any additional details..." style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', resize: 'vertical', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onCancel} style={{ padding: '10px 20px', border: '1px solid #e9eef3', background: 'white', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Cancel</button>
          <button onClick={onSave} disabled={isSaving || !formData.institution_name || !formData.degree_name || !formData.completion_year} style={{ padding: '10px 24px', background: (!formData.institution_name || !formData.degree_name || !formData.completion_year) ? '#e9eef3' : '#0a66c2', color: (!formData.institution_name || !formData.degree_name || !formData.completion_year) ? '#6a737d' : 'white', border: 'none', borderRadius: '30px', cursor: (!formData.institution_name || !formData.degree_name || !formData.completion_year) ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600 }}>Save Education</button>
        </div>
      </div>
    );
  }

  if (qualification === 'Postgraduate') {
    return (
      <div>
        <div style={{ background: '#f8faff', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <GraduationCap size={20} color="#0a66c2" />
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#1d2c3c' }}>Postgraduate Education</h4>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>University Name *</label>
            <input type="text" value={formData.institution_name || ''} onChange={(e) => handleFieldChange('institution_name', e.target.value)} placeholder="e.g., MIT, Harvard" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Degree Name *</label>
            <input type="text" value={formData.degree_name || ''} onChange={(e) => handleFieldChange('degree_name', e.target.value)} placeholder="e.g., M.Tech, MBA, M.Sc" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Major/Specialization</label>
            <input type="text" value={formData.major_subject || ''} onChange={(e) => handleFieldChange('major_subject', e.target.value)} placeholder="e.g., Data Science, Marketing" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Year of Completion *</label>
              <input type="text" value={formData.completion_year || ''} onChange={(e) => handleFieldChange('completion_year', e.target.value)} placeholder="e.g., 2023" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>CGPA/Percentage</label>
              <input type="text" value={formData.cgpa || ''} onChange={(e) => handleFieldChange('cgpa', e.target.value)} placeholder="e.g., 8.2/10 or 82%" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Description (Optional)</label>
          <textarea value={formData.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} rows="3" placeholder="Any additional details..." style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', resize: 'vertical', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onCancel} style={{ padding: '10px 20px', border: '1px solid #e9eef3', background: 'white', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Cancel</button>
          <button onClick={onSave} disabled={isSaving || !formData.institution_name || !formData.degree_name || !formData.completion_year} style={{ padding: '10px 24px', background: (!formData.institution_name || !formData.degree_name || !formData.completion_year) ? '#e9eef3' : '#0a66c2', color: (!formData.institution_name || !formData.degree_name || !formData.completion_year) ? '#6a737d' : 'white', border: 'none', borderRadius: '30px', cursor: (!formData.institution_name || !formData.degree_name || !formData.completion_year) ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600 }}>Save Education</button>
        </div>
      </div>
    );
  }

  return null;
};

// Social Links Component
const SocialLinks = ({ linkedin, github, twitter }) => {
  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
      {linkedin && linkedin.trim() !== '' && (
        <a
          href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: '#e8f0fe',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 500,
            color: '#0a66c2',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#d0e0fc'; e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#e8f0fe'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <LinkedinIcon /> LinkedIn
        </a>
      )}
      {github && github.trim() !== '' && (
        <a
          href={github.startsWith('http') ? github : `https://${github}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: '#e8f0fe',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 500,
            color: '#0a66c2',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#d0e0fc'; e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#e8f0fe'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <GithubIcon /> GitHub
        </a>
      )}
      {twitter && twitter.trim() !== '' && (
        <a
          href={twitter.startsWith('http') ? twitter : `https://${twitter}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: '#e8f0fe',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 500,
            color: '#0a66c2',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#d0e0fc'; e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#e8f0fe'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Twitter/X
        </a>
      )}
    </div>
  );
};

// LinkedIn Icon Component
const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
  </svg>
);

// GitHub Icon Component
const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [activeNav, setActiveNav] = useState('profile');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [countries, setCountries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [highestQualification, setHighestQualification] = useState('');
  const [educationEntries, setEducationEntries] = useState([]);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [selectedQualification, setSelectedQualification] = useState('');
  const [educationFormData, setEducationFormData] = useState({
    qualification_type: '',
    institution_name: '',
    board_university: '',
    degree_name: '',
    major_subject: '',
    completion_year: '',
    percentage_score: '',
    cgpa: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    user_role: '',
    headline: '',
    preferredCountries: [],
    currentCompany: '',
    jobTitle: '',
    yearsOfExperience: '',
    linkedin: '',
    github: '',
    twitter: ''
  });

  const API_BASE = 'http://127.0.0.1:8000/api';

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });
    return response;
  };

  const calculateCompletion = (data, role, highestQual, educationList) => {
    let totalFields = 0;
    let filledFields = 0;

    // Common fields for both roles (from user table)
    const commonFields = ['fullName', 'email', 'user_role', 'headline', 'location', 'bio', 'phone'];
    totalFields += commonFields.length;
    commonFields.forEach(field => {
      if (data[field] && data[field].trim() !== '') filledFields++;
    });

    if (role === 'student') {
      // Highest qualification from user table (edu_info_qn)
      if (highestQual && highestQual !== '') filledFields++;
      totalFields++;

      // Education entries from user_education table
      if (educationList && educationList.length > 0) {
        const hasValidEducation = educationList.some(edu =>
          edu.institution_name && edu.completion_year
        );
        if (hasValidEducation) filledFields++;
      }
      totalFields++;

      // Preferred countries
      if (data.preferredCountries && data.preferredCountries.length > 0) filledFields++;
      totalFields++;

    } else if (role === 'professional') {
      // Professional fields from user table
      const profFields = ['currentCompany', 'jobTitle', 'yearsOfExperience'];
      totalFields += profFields.length;
      profFields.forEach(field => {
        if (data[field] && data[field].trim() !== '') filledFields++;
      });

      // Social links (at least one counts)
      const hasSocialLink = (data.linkedin && data.linkedin.trim() !== '') ||
        (data.github && data.github.trim() !== '') ||
        (data.twitter && data.twitter.trim() !== '');
      if (hasSocialLink) filledFields++;
      totalFields++;
    }

    // Profile image (common for both)
    if (profileImagePreview) filledFields++;
    totalFields++;

    // Cover image (common for both)
    if (coverImagePreview) filledFields++;
    totalFields++;

    const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    return Math.min(percentage, 100);
  };

  // Update profile completion whenever any data changes
  const updateProfileCompletion = () => {
    const completion = calculateCompletion(formData, userRole, highestQualification, educationEntries);
    setProfileCompletion(completion);
  };

  // Call updateProfileCompletion when dependencies change
  useEffect(() => {
    updateProfileCompletion();
  }, [formData, userRole, highestQualification, educationEntries, profileImagePreview, coverImagePreview]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('userRole');
    const hasSelectedRole = localStorage.getItem('hasSelectedRole');

    if (!token) {
      navigate('/login');
      return;
    }

    if (savedRole && hasSelectedRole === 'true') {
      setUserRole(savedRole);
      loadAllData();
    } else {
      // Clear any stale role data to ensure fresh selection
      localStorage.removeItem('userRole');
      localStorage.removeItem('hasSelectedRole');
      setShowRoleModal(true);
      setIsLoading(false);
    }
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await loadCountries();
      await loadProfileData();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      const response = await fetch(`${API_BASE}/countries`);
      const data = await response.json();
      if (data) setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadProfileData = async () => {
    try {
      const response = await authFetch('/profile');
      const data = await response.json();

      if (data.success) {
        const user = data.data;
        setCurrentUserId(user.userID);

        if (user.user_role) {
          setUserRole(user.user_role);
          localStorage.setItem('userRole', user.user_role);
          localStorage.setItem('hasSelectedRole', 'true');
        } else {
          // If profile doesn't have a role but we're not showing modal, show it
          if (!showRoleModal) {
            setShowRoleModal(true);
            setIsLoading(false);
            return;
          }
        }

        setHighestQualification(user.edu_info_qn || '');

        const profileImg = user.profile_image ? getImageUrl(user.profile_image) : null;
        const coverImg = user.cover_image ? getImageUrl(user.cover_image) : null;

        setProfileImagePreview(profileImg);
        setCoverImagePreview(coverImg);

        const newFormData = {
          fullName: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          location: user.location || '',
          bio: user.bio || '',
          user_role: user.user_role || '',
          headline: user.headline || '',
          preferredCountries: user.preferred_countries || [],
          currentCompany: user.current_company || '',
          jobTitle: user.job_title || '',
          yearsOfExperience: user.years_of_experience || '',
          linkedin: user.linkedin || '',
          github: user.github || '',
          twitter: user.twitter || ''
        };

        setFormData(newFormData);

        if (data.education && data.education.length > 0) {
          setEducationEntries(data.education);
        } else if (user.education && user.education.length > 0) {
          setEducationEntries(user.education);
        } else {
          await loadUserEducation();
        }

        updateProfileCompletion();
      } else {
        // If profile fetch fails or user has no role, show role modal
        if (!userRole) {
          setShowRoleModal(true);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // If error occurs and no role, show modal
      if (!userRole) {
        setShowRoleModal(true);
        setIsLoading(false);
      }
    }
  };

  const loadUserEducation = async () => {
    try {
      const response = await authFetch('/profile/education');
      const data = await response.json();
      if (data.success) {
        setEducationEntries(data.data);
        updateProfileCompletion();
      }
    } catch (error) {
      console.error('Error loading education:', error);
    }
  };

  const handleAddEducation = async () => {
    if (!educationFormData.institution_name || !educationFormData.completion_year) {
      alert('Please fill required fields');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/profile/education`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(educationFormData)
      });
      const data = await response.json();
      if (data.success) {
        await loadUserEducation();
        setShowEducationForm(false);
        setSelectedQualification('');
        setEducationFormData({
          qualification_type: '',
          institution_name: '',
          board_university: '',
          degree_name: '',
          major_subject: '',
          completion_year: '',
          percentage_score: '',
          cgpa: '',
          description: ''
        });
        updateProfileCompletion();
        alert('Education added successfully!');
      }
    } catch (error) {
      console.error('Error adding education:', error);
      alert('Error adding education');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEducation = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/profile/education/${editingEducation.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(educationFormData)
      });
      const data = await response.json();
      if (data.success) {
        await loadUserEducation();
        setShowEducationForm(false);
        setEditingEducation(null);
        setSelectedQualification('');
        setEducationFormData({
          qualification_type: '',
          institution_name: '',
          board_university: '',
          degree_name: '',
          major_subject: '',
          completion_year: '',
          percentage_score: '',
          cgpa: '',
          description: ''
        });
        updateProfileCompletion();
        alert('Education updated successfully!');
      }
    } catch (error) {
      console.error('Error updating education:', error);
      alert('Error updating education');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEducation = async (educationId) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/profile/education/${educationId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          await loadUserEducation();
          updateProfileCompletion();
          alert('Education deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting education:', error);
        alert('Error deleting education');
      }
    }
  };

  const openAddEducationForm = () => {
    setEditingEducation(null);
    setSelectedQualification('');
    setEducationFormData({
      qualification_type: '',
      institution_name: '',
      board_university: '',
      degree_name: '',
      major_subject: '',
      completion_year: '',
      percentage_score: '',
      cgpa: '',
      description: ''
    });
    setShowEducationForm(true);
  };

  const openEditEducationForm = (education) => {
    setEditingEducation(education);
    setSelectedQualification(education.qualification_type);
    setEducationFormData({
      qualification_type: education.qualification_type,
      institution_name: education.institution_name || '',
      board_university: education.board_university || '',
      degree_name: education.degree_name || '',
      major_subject: education.major_subject || '',
      completion_year: education.completion_year || '',
      percentage_score: education.percentage_score || '',
      cgpa: education.cgpa || '',
      description: education.description || ''
    });
    setShowEducationForm(true);
  };

  const handleEducationFormChange = (field, value) => {
    setEducationFormData({ ...educationFormData, [field]: value });
  };

  const handleQualificationSelect = (qualification) => {
    setSelectedQualification(qualification);
    setEducationFormData({
      ...educationFormData,
      qualification_type: qualification,
      institution_name: '',
      board_university: '',
      degree_name: '',
      major_subject: '',
      completion_year: '',
      percentage_score: '',
      cgpa: '',
      description: ''
    });
  };

  const handleRoleSelect = async (role) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    localStorage.setItem('hasSelectedRole', 'true');

    try {
      const response = await authFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({ user_role: role }),
      });
      const data = await response.json();
      if (data.success) {
        setShowRoleModal(false);
        await loadAllData();
      } else {
        // If API fails, still close modal but show error
        console.error('Failed to save role to database');
        setShowRoleModal(false);
        await loadAllData();
      }
    } catch (error) {
      console.error('Error saving role:', error);
      // Still close modal and try to load data
      setShowRoleModal(false);
      await loadAllData();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
  };

  // Image upload handlers (no folder creation)
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formDataObj = new FormData();
      formDataObj.append('image', file);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/profile/profile-image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataObj,
        });
        const data = await response.json();
        if (data.success) {
          setProfileImagePreview(data.data.url);
          await loadProfileData();
          alert('Profile image uploaded successfully!');
        }
      } catch (error) {
        console.error('Error uploading profile image:', error);
        alert('Error uploading profile image');
      }
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formDataObj = new FormData();
      formDataObj.append('image', file);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/profile/cover-image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataObj,
        });
        const data = await response.json();
        if (data.success) {
          setCoverImagePreview(data.data.url);
          await loadProfileData();
          alert('Cover image uploaded successfully!');
        }
      } catch (error) {
        console.error('Error uploading cover image:', error);
        alert('Error uploading cover image');
      }
    }
  };

  const handleQualificationChange = (qualification) => {
    setHighestQualification(qualification);
  };

  const handleSaveProfile = async () => {
    try {
      const saveData = {
        ...formData,
        user_role: userRole,
        edu_info_qn: highestQualification,
        profile_completion: profileCompletion
      };

      const response = await authFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify(saveData),
      });
      const data = await response.json();

      if (data.success) {
        setIsEditing(false);
        await loadProfileData();
        alert('Profile saved successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  const handleDreamDestinationPrediction = () => {
    navigate('/prediction');
  };

  const displayData = formData;

  if (showRoleModal) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f2ef', fontFamily: "'Inter', sans-serif" }}>
        <AnimatePresence>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} style={{ position: 'relative', width: '90%', maxWidth: '480px', background: 'white', borderRadius: '24px', padding: '32px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', zIndex: 10000 }}>
              <div style={{ width: '64px', height: '64px', background: '#e8f0fe', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <UserCircle size={32} color="#0a66c2" />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: '#1d2c3c' }}>Welcome to Ovijan</h2>
              <p style={{ color: '#5e6f8d', marginBottom: '28px' }}>Choose your path to get started</p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => handleRoleSelect('student')} style={{ flex: 1, padding: '20px', background: 'white', border: '2px solid #e9eef3', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0a66c2'; e.currentTarget.style.background = '#e8f0fe'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9eef3'; e.currentTarget.style.background = 'white'; }}>
                  <GraduationCap size={32} color="#0a66c2" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ fontWeight: 600, marginBottom: '4px', color: '#1d2c3c' }}>Student</h3>
                  <p style={{ fontSize: '12px', color: '#5e6f8d' }}>Study abroad opportunities</p>
                </button>
                <button onClick={() => handleRoleSelect('professional')} style={{ flex: 1, padding: '20px', background: 'white', border: '2px solid #e9eef3', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0a66c2'; e.currentTarget.style.background = '#e8f0fe'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9eef3'; e.currentTarget.style.background = 'white'; }}>
                  <Briefcase size={32} color="#0a66c2" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ fontWeight: 600, marginBottom: '4px', color: '#1d2c3c' }}>Professional</h3>
                  <p style={{ fontSize: '12px', color: '#5e6f8d' }}>Work abroad opportunities</p>
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f2ef' }}>
        <Sidebar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} activeNav={activeNav} setActiveNav={setActiveNav} countries={countries} />
        <div style={{ marginLeft: sidebarCollapsed ? '88px' : '266px', transition: 'margin-left 0.35s ease', minHeight: '100vh', padding: '24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '1128px', width: '100%' }}><SkeletonLoader /></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f2ef', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap'); * { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; } @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }`}</style>

      <Sidebar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} activeNav={activeNav} setActiveNav={setActiveNav} countries={countries} />

      <div style={{ marginLeft: sidebarCollapsed ? '88px' : '266px', transition: 'margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)', minHeight: '100vh', padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1128px', width: '100%' }}>
          {/* Profile Header Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', border: '1px solid #e9eef3' }}>
            <div style={{ height: '180px', backgroundImage: coverImagePreview ? `url(${coverImagePreview})` : 'linear-gradient(135deg, #0a66c2 0%, #1e88e5 100%)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
              <button onClick={() => coverInputRef.current.click()} style={{ position: 'absolute', bottom: '16px', right: '24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'white', zIndex: 5 }}>
                <Camera size={14} /> {coverImagePreview ? 'Change cover' : 'Add cover'}
              </button>
              <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverImageUpload} style={{ display: 'none' }} />
            </div>
            <div style={{ padding: '0 24px 24px', position: 'relative' }}>
              <div style={{ marginTop: '-60px', marginBottom: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative' }}>
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid white', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', background: 'white' }} />
                  ) : (
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #0a66c2, #1e88e5)', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <span style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>{displayData.fullName?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                  )}
                  <button onClick={() => profileInputRef.current.click()} style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'white', borderRadius: '50%', padding: '8px', border: '1px solid #e9eef3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Camera size={14} color="#0a66c2" />
                  </button>
                  <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileImageUpload} style={{ display: 'none' }} />
                </div>
                <button onClick={() => setIsEditing(true)} style={{ background: 'white', border: '1px solid #e9eef3', borderRadius: '20px', padding: '8px 16px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#1d2c3c' }}>
                  <EditIcon /> Edit profile
                </button>
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0, color: '#1d2c3c' }}>{displayData.fullName || 'User'}</h1>
               <p style={{ fontSize: '16px', color: '#5e6f8d', margin: '4px 0 4px' }}>{displayData.headline || 'Add your headline'}</p>
<p style={{ fontSize: '13px', color: '#0a66c2', margin: '0 0 8px', fontWeight: 500 }}>
  {userRole === 'student' ? 'Student' : 'Professional'}
</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {displayData.location && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#5e6f8d' }}><MapPin size={14} /> {displayData.location}</div>}
                </div>
                <SocialLinks linkedin={displayData.linkedin} github={displayData.github} twitter={displayData.twitter} />
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'white', borderRadius: '16px', padding: '0 24px', marginBottom: '24px', border: '1px solid #e9eef3' }}>
            <nav style={{ display: 'flex', gap: '32px', overflowX: 'auto' }}>
              {['about', 'prediction'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '16px 4px', fontSize: '14px', fontWeight: 500, textTransform: 'capitalize', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === tab ? '#0a66c2' : '#6a737d', borderBottom: activeTab === tab ? '2px solid #0a66c2' : 'none', transition: 'all 0.2s' }}>
                  {tab === 'prediction' ? 'Dream Destination' : tab}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Tab Content */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* LEFT COLUMN - About Content */}
            <div style={{ flex: 2, minWidth: '280px' }}>
              {activeTab === 'about' && (
                <div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '16px', border: '1px solid #e9eef3' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#1d2c3c' }}>About</h3>
                      <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0a66c2', fontSize: '14px' }}><EditIcon /></button>
                    </div>
                    <p style={{ fontSize: '14px', color: '#5e6f8d', lineHeight: '1.6', margin: 0 }}>{displayData.bio || 'No bio added yet. Click Edit Profile to add your bio.'}</p>
                  </motion.div>

                  {userRole === 'student' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '16px', border: '1px solid #e9eef3' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#1d2c3c' }}>Education</h3>
                        <button onClick={openAddEducationForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0a66c2', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Plus size={18} /> Add
                        </button>
                      </div>
                      {educationEntries.length > 0 ? (
                        educationEntries.map((edu) => (
                          <EducationCard
                            key={edu.id}
                            education={edu}
                            onEdit={openEditEducationForm}
                            onDelete={handleDeleteEducation}
                          />
                        ))
                      ) : (
                        <p style={{ color: '#5e6f8d', fontSize: '14px', textAlign: 'center', padding: '20px' }}>Add your education details to showcase your academic background.</p>
                      )}
                    </motion.div>
                  )}

                  {userRole === 'professional' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '16px', border: '1px solid #e9eef3' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#1d2c3c' }}>Experience</h3>
                        <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0a66c2', fontSize: '14px' }}><Plus size={18} /></button>
                      </div>
                      {displayData.currentCompany && displayData.jobTitle ? (
                        <ExperienceCard title={displayData.jobTitle} company={displayData.currentCompany} period={`${displayData.yearsOfExperience || 0} years`} location={displayData.location || 'Remote'} description="Professional experience in the field." />
                      ) : (
                        <p style={{ color: '#5e6f8d', fontSize: '14px', textAlign: 'center', padding: '20px' }}>Add your work experience to showcase your career journey.</p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab === 'prediction' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'white', borderRadius: '16px', padding: '60px 28px', textAlign: 'center', border: '1px solid #e9eef3' }}>
                  <div style={{ width: '80px', height: '80px', background: '#e8f0fe', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Compass size={40} color="#0a66c2" /></div>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#1d2c3c' }}>Discover Your Dream Destination</h3>
                  <p style={{ color: '#5e6f8d', maxWidth: '400px', margin: '0 auto 24px' }}>Get AI-powered recommendations for your ideal study or work destination.</p>
                  {profileCompletion < 60 && (
                    <div style={{ display: 'inline-block', padding: '8px 20px', background: '#fef3c7', borderRadius: '40px' }}>
                      <p style={{ fontSize: '13px', color: '#d97706', margin: 0 }}>Complete at least 60% of your profile to unlock predictions</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ flex: 1.2, minWidth: '280px' }}>
              {profileCompletion < 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.05 }}
                  style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #e9eef3' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#1d2c3c' }}>Profile strength</h4>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0a66c2' }}>{profileCompletion}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#e9eef3', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompletion}%` }}
                      transition={{ duration: 0.5 }}
                      style={{ height: '100%', background: '#0a66c2', borderRadius: '3px' }}
                    />
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{ width: '100%', padding: '10px', background: '#e8f0fe', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#0a66c2' }}
                  >
                    Complete your profile
                  </button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ background: 'linear-gradient(135deg, #0a66c2 0%, #1e88e5 100%)', borderRadius: '16px', padding: '20px', marginBottom: '16px', color: 'white', position: 'sticky', top: '24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}><Compass size={24} /><h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Dream Destination</h4></div>
                <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '16px', lineHeight: '1.5' }}>Get AI-powered recommendations for your ideal study or work destination.</p>
                <button onClick={handleDreamDestinationPrediction} disabled={profileCompletion < 60} style={{ width: '100%', padding: '10px', background: 'white', border: 'none', borderRadius: '24px', fontSize: '13px', fontWeight: 600, cursor: profileCompletion < 60 ? 'not-allowed' : 'pointer', color: '#0a66c2', opacity: profileCompletion < 60 ? 0.6 : 1 }}>Get Prediction →</button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Education Modal */}
      <AnimatePresence>
        {showEducationForm && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }} onClick={() => { setShowEducationForm(false); setEditingEducation(null); setSelectedQualification(''); }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} style={{ background: 'white', borderRadius: '20px', width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e9eef3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{editingEducation ? 'Edit Education' : 'Add Education'}</h3>
                <button onClick={() => { setShowEducationForm(false); setEditingEducation(null); setSelectedQualification(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ padding: '24px' }}>
                {!editingEducation && (
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: '#1d2c3c' }}>Select Qualification *</label>
                    <select
                      value={selectedQualification}
                      onChange={(e) => handleQualificationSelect(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '10px', fontSize: '14px', outline: 'none', background: 'white', cursor: 'pointer' }}
                    >
                      <option value="">-- Select your qualification --</option>
                      <option value="Higher Secondary">Higher Secondary (12th Grade)</option>
                      <option value="Undergraduate">Undergraduate (Bachelor's Degree)</option>
                      <option value="Postgraduate">Postgraduate (Master's Degree)</option>
                    </select>
                  </div>
                )}

                <DynamicEducationForm
                  qualification={selectedQualification || (editingEducation?.qualification_type)}
                  formData={educationFormData}
                  onChange={handleEducationFormChange}
                  onCancel={() => { setShowEducationForm(false); setEditingEducation(null); setSelectedQualification(''); }}
                  onSave={editingEducation ? handleUpdateEducation : handleAddEducation}
                  isSaving={isSaving}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} style={{ position: 'relative', width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', background: 'white', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', zIndex: 10000 }}>
              <div style={{ padding: '24px 28px', borderBottom: '1px solid #e9eef3', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div><h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: '#1d2c3c' }}>Edit profile</h2><p style={{ fontSize: '13px', color: '#5e6f8d', margin: '4px 0 0' }}>Update your professional information</p></div>
                  <button onClick={() => setIsEditing(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0f2f5', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                </div>
              </div>
              <div style={{ padding: '28px' }}>
                <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
                <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Headline</label><input type="text" name="headline" value={formData.headline} onChange={handleInputChange} placeholder="e.g., Senior Software Engineer" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
                
                <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Bio</label><textarea name="bio" rows="3" value={formData.bio} onChange={handleInputChange} placeholder="Tell us about yourself..." style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', resize: 'vertical', outline: 'none' }} /></div>
                <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="City, Country" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
                <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
                <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Phone Number</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
                <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>LinkedIn URL</label><input type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/username" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Twitter/X URL</label>
                  <input type="text" name="twitter" value={formData.twitter} onChange={handleInputChange} placeholder="https://x.com/username" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>GitHub URL</label>
                  <input type="text" name="github" value={formData.github} onChange={handleInputChange} placeholder="https://github.com/username" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                </div>
                {userRole === 'student' ? (
                  <div style={{ marginBottom: '24px', display: 'none' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Highest Qualification</label>
                    <select value={highestQualification} onChange={(e) => handleQualificationChange(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white', cursor: 'pointer' }}>
                      <option value="">Select your highest qualification</option>
                      <option value="Higher Secondary">Higher Secondary (12th Grade)</option>
                      <option value="Undergraduate">Undergraduate (Bachelor's Degree)</option>
                      <option value="Postgraduate">Postgraduate (Master's Degree)</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Current Company</label><input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} placeholder="e.g., Google" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
                    <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Job Title</label><input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} placeholder="e.g., Senior Software Engineer" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
                    <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Years of Experience</label><input type="text" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleInputChange} placeholder="e.g., 5" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
                    <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>LinkedIn URL</label><input type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/username" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>Twitter/X URL</label>
                      <input type="text" name="twitter" value={formData.twitter} onChange={handleInputChange} placeholder="https://x.com/username" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#1d2c3c' }}>GitHub URL</label>
                      <input type="text" name="github" value={formData.github} onChange={handleInputChange} placeholder="https://github.com/username" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e9eef3', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                    </div>
                  </>
                )}
              </div>
              <div style={{ padding: '20px 28px', borderTop: '1px solid #e9eef3', display: 'flex', gap: '12px' }}>
                <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '10px', border: '1px solid #e9eef3', background: 'white', borderRadius: '24px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>Cancel</button>
                <button onClick={handleSaveProfile} style={{ flex: 1, padding: '10px', background: '#0a66c2', color: 'white', border: 'none', borderRadius: '24px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;