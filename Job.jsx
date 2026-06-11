import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../images/logo.png';
import defaultCompanyImg from '../images/default-company.png'; // Add a default company image in your images folder
import axios from 'axios';
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  Share2,
  X,
  Star,
  Building2,
  Users,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F7F6F3;
    --surface: #FFFFFF;
    --surface-2: #F0EFE9;
    --border: #E5E3DA;
    --text-primary: #1A1917;
    --text-primaryhero: #ffffff;
     --text-secondaryone: #efefef;
    --text-secondary: #6B6860;
    --text-tertiary: #9C9A94;
    --accent: #199c49;
    --accent-light: #EEF2FF;
    --accent-dark: #1E3FA8;
    --success: #16ae4e;
    --success-light: #DCFCE7;
    --warning: #92400E;
    --warning-light: #FEF3C7;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
    --shadow-lg: 0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06);
    --radius: 16px;
    --radius-sm: 10px;
    --radius-xs: 6px;
    --hero: #0F172A;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text-primary); }

  .app { min-height: 100vh; }

  /* HEADER */
  .header {
    background: var(--hero);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .logo-mark {
    width: 36px;
    height: 36px;
    background: var(--accent);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.3px;
  }

  .search-wrap {
    flex: 1;
    max-width: 520px;
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    height: 42px;
    padding: 0 16px 0 42px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .search-input::placeholder { color: var(--text-tertiary); }
  .search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(42,90,224,0.1); }

  .header-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px;
    height: 38px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-secondary);
    border: 1.5px solid var(--border);
  }
  .btn-ghost:hover { background: var(--surface); color: var(--text-primary); }

  .btn-primary {
    background: var(--accent);
    color: #fff;
  }
  .btn-primary:hover { background: var(--accent-dark); }

  /* HERO */
  .hero {
    background: var(--hero);
    border-bottom: 1px solid var(--border);
    padding: 48px 32px;
  }

  .hero-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }

  .hero-left { flex: 1; }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: var(--accent-light);
    color: var(--accent);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
    margin-bottom: 16px;
  }

  .hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3vw, 42px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -1px;
    color: var(--text-primaryhero);
    margin-bottom: 12px;
  }

  .hero-title span { color: var(--accent); }

  .hero-sub {
    font-size: 15px;
    color: var(--text-secondaryone);
    line-height: 1.6;
    max-width: 420px;
  }

  .hero-stats {
    display: flex;
    gap: 32px;
    margin-top: 32px;
  }

  .stat { display: flex; flex-direction: column; gap: 2px; }
  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.5px;
  }
  .stat-label { font-size: 13px; color: var(--text-tertiary); }

  .hero-visual {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .featured-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: var(--accent-light);
    border: 1.5px solid rgba(42,90,224,0.15);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--accent);
    white-space: nowrap;
  }

  /* MAIN LAYOUT */
  .main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 32px;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 28px;
    align-items: start;
  }

  /* SIDEBAR */
  .sidebar {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    position: sticky;
    top: 88px;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .sidebar-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.2px;
  }

  .clear-btn {
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--accent);
    cursor: pointer;
    font-weight: 500;
    padding: 0;
  }
  .clear-btn:hover { color: var(--accent-dark); }

  .filter-group { margin-bottom: 24px; }
  .filter-group:last-child { margin-bottom: 0; }

  .filter-group-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--text-tertiary);
    margin-bottom: 12px;
  }

  .filter-divider {
    height: 1px;
    background: var(--border);
    margin-bottom: 24px;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .checkbox-item:last-child { margin-bottom: 0; }

  .checkbox-custom {
    width: 17px;
    height: 17px;
    border: 1.5px solid var(--border);
    border-radius: 5px;
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .checkbox-custom.checked {
    background: var(--accent);
    border-color: var(--accent);
  }

  .checkbox-check {
    width: 10px;
    height: 10px;
    stroke: white;
    stroke-width: 2.5;
    fill: none;
  }

  .checkbox-label {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1;
    user-select: none;
  }

  /* JOB LISTINGS */
  .listings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .listings-count {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.3px;
  }

  .listings-sub {
    font-size: 13px;
    color: var(--text-tertiary);
    margin-top: 2px;
  }

  .sort-select {
    appearance: none;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 0 36px 0 14px;
    height: 38px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    outline: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239C9A94' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }

  .sort-select:focus { border-color: var(--accent); }

  /* JOB CARD */
  .job-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 12px;
    position: relative;
    overflow: hidden;
  }

  .job-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), #7C3AED);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .job-card:hover {
    border-color: rgba(42,90,224,0.25);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .job-card:hover::before { opacity: 1; }

  .job-card.featured-card {
    border-color: rgba(42,90,224,0.2);
    background: linear-gradient(135deg, rgba(238,242,255,0.5) 0%, #fff 60%);
  }

  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .card-left { display: flex; gap: 16px; flex: 1; min-width: 0; }

  .company-logo {
    width: 48px;
    height: 48px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    letter-spacing: 0.5px;
    background-size: cover;
    background-position: center;
  }

  .card-info { flex: 1; min-width: 0; }

  .card-title-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 6px;
  }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.3px;
    transition: color 0.15s;
  }

  .job-card:hover .card-title { color: var(--accent); }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  .badge-featured {
    background: var(--warning-light);
    color: var(--warning);
  }

  .badge-remote {
    background: var(--success-light);
    color: var(--success);
  }

  .card-company {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .card-company-sep { color: var(--border); }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 12px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: var(--text-tertiary);
  }

  .card-actions { display: flex; gap: 6px; flex-shrink: 0; }

  .icon-btn {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-2);
    border: 1.5px solid var(--border);
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.15s;
    color: var(--text-tertiary);
  }

  .icon-btn:hover { background: var(--surface); color: var(--text-primary); border-color: var(--text-tertiary); }
  .icon-btn.saved { background: var(--accent-light); border-color: rgba(42,90,224,0.3); color: var(--accent); }

  .card-desc {
    font-size: 13.5px;
    color: var(--text-secondary);
    line-height: 1.65;
    margin-top: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
  }

  .tag {
    padding: 5px 11px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    transition: all 0.15s;
  }

  .job-card:hover .tag { border-color: rgba(42,90,224,0.2); }

  /* EMPTY STATE */
  .empty-state {
    text-align: center;
    padding: 80px 32px;
    color: var(--text-tertiary);
  }

  .empty-icon {
    width: 56px;
    height: 56px;
    background: var(--surface-2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .empty-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }

  .empty-sub { font-size: 14px; }

  /* MODAL */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,14,12,0.6);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .modal {
    background: var(--surface);
    border-radius: 20px;
    width: 100%;
    max-width: 680px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid var(--border);
  }

  .modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .modal-header-title {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-2);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.15s;
  }
  .close-btn:hover { background: var(--border); color: var(--text-primary); }

  .modal-body { overflow-y: auto; flex: 1; padding: 28px 24px; }

  .modal-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }

  .modal-job-info { display: flex; gap: 16px; flex: 1; }

  .modal-logo {
    width: 56px;
    height: 56px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    background-size: cover;
    background-position: center;
  }

  .modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.5px;
    line-height: 1.25;
    margin-bottom: 6px;
  }

  .apply-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 20px;
    height: 42px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
    align-self: flex-start;
  }
  .apply-btn:hover { background: var(--accent-dark); transform: translateY(-1px); }

  .modal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 20px;
    background: var(--surface-2);
    border-radius: var(--radius-sm);
    margin-bottom: 24px;
    border: 1px solid var(--border);
  }

  .modal-grid-item { display: flex; align-items: center; gap: 12px; }

  .grid-icon {
    width: 36px;
    height: 36px;
    background: var(--surface);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    flex-shrink: 0;
  }

  .grid-label { font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
  .grid-value { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-top: 2px; }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.2px;
    margin-bottom: 12px;
  }

  .section { margin-bottom: 24px; }

  .modal-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

  .req-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }

  .req-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .benefits-grid { display: flex; flex-wrap: wrap; gap: 8px; }

  .benefit-chip {
    padding: 6px 14px;
    background: var(--success-light);
    color: var(--success);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
  }
`;

const CheckboxGroup = ({ title, options, filterKey, filters, setFilters }) => {
  const selected = filters[filterKey] || [];

  const toggle = (val) => {
    if (selected.includes(val)) {
      setFilters({ ...filters, [filterKey]: selected.filter(v => v !== val) });
    } else {
      setFilters({ ...filters, [filterKey]: [...selected, val] });
    }
  };

  return (
    <div className="filter-group">
      <div className="filter-group-title">{title}</div>
      {options.map(opt => (
        <label key={opt} className="checkbox-item" onClick={() => toggle(opt)}>
          <div className={`checkbox-custom ${selected.includes(opt) ? 'checked' : ''}`}>
            {selected.includes(opt) && (
              <svg className="checkbox-check" viewBox="0 0 12 12">
                <polyline points="2,6 5,9 10,3" />
              </svg>
            )}
          </div>
          <span className="checkbox-label">{opt}</span>
        </label>
      ))}
    </div>
  );
};

const JobCard = ({ job, onSave, savedJobs, onClick }) => {
  const isSaved = savedJobs.includes(job.id);

  // Parse requirements if it's a string from API
  const requirements = typeof job.requirements === 'string'
    ? job.requirements.split('\n').filter(r => r.trim())
    : job.requirements;

  // Get company color from company relation or use default
  const companyColor = job.company?.color || job.companyColor || '#2563EB';
  const companyName = job.company?.name || job.company;
  
  // Always use default image instead of company logo
  const companyLogoUrl = defaultCompanyImg;

  return (
    <div className={`job-card ${job.is_featured ? 'featured-card' : ''}`} onClick={onClick}>
      <div className="card-top">
        <div className="card-left">
          <div 
            className="company-logo" 
            style={{ 
              background: companyColor,
              backgroundImage: `url(${companyLogoUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* No text fallback - image will show */}
          </div>
          <div className="card-info">
            <div className="card-title-row">
              <span className="card-title">{job.title}</span>
              {job.is_featured && (
                <span className="badge badge-featured">
                  <Star size={10} strokeWidth={0} fill="currentColor" /> Featured
                </span>
              )}
              {job.is_remote && (
                <span className="badge badge-remote">Remote</span>
              )}
            </div>
            <div className="card-company">
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Building2 size={13} /> {companyName}
              </span>
              <span className="card-company-sep">·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} /> {job.location}
              </span>
            </div>
            <div className="card-meta">
              <span className="meta-item"><Briefcase size={13} />{job.type}</span>
              <span className="meta-item"><DollarSign size={13} />{job.salary_range || `$${job.salary_min?.toLocaleString()} - $${job.salary_max?.toLocaleString()}`}</span>
              <span className="meta-item"><Clock size={13} />{new Date(job.posted_date).toLocaleDateString()}</span>
              <span className="meta-item"><Users size={13} />{job.applicants_count} applicants</span>
            </div>
          </div>
        </div>
        <div className="card-actions" onClick={e => e.stopPropagation()}>
          <button className={`icon-btn ${isSaved ? 'saved' : ''}`} onClick={() => onSave(job.id)}>
            <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button className="icon-btn">
            <Share2 size={15} />
          </button>
        </div>
      </div>
      <p className="card-desc">{job.description}</p>
      <div className="card-tags">
        {requirements?.slice(0, 3).map((req, i) => (
          <span key={i} className="tag">{req}</span>
        ))}
        {requirements?.length > 3 && (
          <span className="tag">+{requirements.length - 3} more</span>
        )}
      </div>
    </div>
  );
};

const JobModal = ({ job, onClose }) => {
  if (!job) return null;

  const requirements = typeof job.requirements === 'string'
    ? job.requirements.split('\n').filter(r => r.trim())
    : job.requirements;

  const benefits = typeof job.benefits === 'string'
    ? job.benefits.split('\n').filter(b => b.trim())
    : job.benefits;

  const companyColor = job.company?.color || job.companyColor || '#2563EB';
  const companyName = job.company?.name || job.company;
  
  // Always use default image
  const companyLogoUrl = defaultCompanyImg;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-header-title">Job Details</span>
          <button className="close-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="modal-top">
            <div className="modal-job-info">
              <div 
                className="modal-logo" 
                style={{ 
                  background: companyColor,
                  backgroundImage: `url(${companyLogoUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div>
                <div className="modal-title">{job.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <Building2 size={14} /> {companyName}
                </div>
              </div>
            </div>
            <a href={job.job_link} target="_blank" rel="noopener noreferrer" className="apply-btn">
              Apply Now <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="modal-grid">
            {[
              { icon: <Briefcase size={16} color="var(--accent)" />, label: 'Job Type', val: job.type },
              { icon: <MapPin size={16} color="var(--accent)" />, label: 'Location', val: job.location },
              { icon: <DollarSign size={16} color="var(--accent)" />, label: 'Salary', val: job.salary_range || `$${job.salary_min?.toLocaleString()} - $${job.salary_max?.toLocaleString()}` },
              { icon: <Clock size={16} color="var(--accent)" />, label: 'Posted', val: new Date(job.posted_date).toLocaleDateString() },
            ].map(({ icon, label, val }) => (
              <div key={label} className="modal-grid-item">
                <div className="grid-icon">{icon}</div>
                <div>
                  <div className="grid-label">{label}</div>
                  <div className="grid-value">{val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="section">
            <div className="section-title">About the Role</div>
            <p className="modal-desc">{job.description}</p>
          </div>

          <div className="section">
            <div className="section-title">Requirements</div>
            <ul className="req-list">
              {requirements?.map((req, i) => (
                <li key={i} className="req-item">
                  <CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <div className="section-title">Benefits</div>
            <div className="benefits-grid">
              {benefits?.map((b, i) => (
                <span key={i} className="benefit-chip">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Job() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({ job_types: [], experience_levels: [], industries: [] });

  // Fetch jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.type?.length) params.append('type', filters.type.join(','));
      if (filters.experience?.length) params.append('experience', filters.experience.join(','));
      if (filters.industry?.length) params.append('industry', filters.industry.join(','));

      const response = await axios.get(`${API_URL}/jobs?${params.toString()}`);
      if (response.data.success) {
        setJobs(response.data.data.data);
        setFilteredJobs(response.data.data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs/filter-options`);
      if (response.data.success) {
        setFilterOptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  // Fetch saved jobs (if user is logged in)
  const fetchSavedJobs = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSavedJobs(response.data.data.map(job => job.id));
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  // Save/unsave job
  const handleSave = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to save jobs');
      return;
    }
    try {
      if (savedJobs.includes(jobId)) {
        await axios.delete(`${API_URL}/saved-jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs(prev => prev.filter(id => id !== jobId));
      } else {
        await axios.post(`${API_URL}/saved-jobs`, { job_id: jobId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, filters]);

  // Mock navigate function if needed
  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="header-inner">
              <motion.div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer"
                }}
                onClick={() => navigate('/dashboard')}
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
            
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search jobs, companies, skills..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="header-actions">

            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-left">
              <div className="hero-badge">
                <Sparkles size={11} /> {jobs.length}+ new roles this week
              </div>
              <h1 className="hero-title">
                Find your next<br /><span>dream role</span> today
              </h1>
              <p className="hero-sub">
                Discover top opportunities from leading companies. Filter by location, salary, and more.
              </p>
              <div className="hero-stats">
                <div className="stat"><span className="stat-num">{jobs.length}+</span><span className="stat-label">Active jobs</span></div>
                <div className="stat"><span className="stat-num">15+</span><span className="stat-label">Companies</span></div>
                <div className="stat"><span className="stat-num">94%</span><span className="stat-label">Placement rate</span></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="featured-pill">
                <Star size={13} fill="currentColor" /> {jobs.filter(j => j.is_featured).length} featured roles available
              </div>
              <div className="featured-pill" style={{ background: 'var(--success-light)', borderColor: 'rgba(21,128,61,0.15)', color: 'var(--success)' }}>
                🌍 Remote-friendly
              </div>
            </div>
          </div>
        </section>

        {/* Main */}
        <main className="main">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <span className="sidebar-title">Filters</span>
              <button className="clear-btn" onClick={() => setFilters({})}>Clear all</button>
            </div>

            <CheckboxGroup
              title="Job Type"
              options={filterOptions.job_types || ['Full-time', 'Part-time', 'Contract', 'Remote']}
              filterKey="type"
              filters={filters}
              setFilters={setFilters}
            />
            <div className="filter-divider" />
            <CheckboxGroup
              title="Experience"
              options={filterOptions.experience_levels || ['Entry Level', 'Mid Level', 'Senior Level']}
              filterKey="experience"
              filters={filters}
              setFilters={setFilters}
            />
            <div className="filter-divider" />
            <CheckboxGroup
              title="Industry"
              options={filterOptions.industries || ['Technology', 'Design', 'Marketing', 'Sales', 'Finance']}
              filterKey="industry"
              filters={filters}
              setFilters={setFilters}
            />
          </aside>

          {/* Listings */}
          <div>
            <div className="listings-header">
              <div>
                <div className="listings-count">{filteredJobs.length} Jobs Found</div>
                <div className="listings-sub">Showing latest opportunities</div>
              </div>
              <select className="sort-select">
                <option>Most relevant</option>
                <option>Most recent</option>
                <option>Salary (High to Low)</option>
              </select>
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="empty-icon"><Briefcase size={24} color="var(--text-tertiary)" /></div>
                <div className="empty-title">Loading jobs...</div>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSave={handleSave}
                  savedJobs={savedJobs}
                  onClick={() => setSelectedJob(job)}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><Search size={24} color="var(--text-tertiary)" /></div>
                <div className="empty-title">No jobs found</div>
                <div className="empty-sub">Try adjusting your search or filters</div>
              </div>
            )}
          </div>
        </main>

        {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      </div>
    </>
  );
}

export default Job;