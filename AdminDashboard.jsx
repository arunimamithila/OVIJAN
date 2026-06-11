import { useState } from "react";

// ── SVG ICON SYSTEM ──────────────────────────────────────────────────────────
const ICON_PATHS = {
  "layout-dashboard":  "M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z",
  "chart-bar":         "M3 3v18h18M7 16v-4m4 4V8m4 8V9",
  "building-community":"M2 20h20M5 20V8l7-5 7 5v12M9 20v-5h6v5",
  "building":          "M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 10h.01M15 10h.01",
  "users":             "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2 6v-2a3 3 0 0 0-3-3",
  "briefcase":         "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  "file-description":  "M14 3v4a1 1 0 0 0 1 1h4M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5zM9 13h6m-6 4h4",
  "bell":              "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9m-4.27 13a2 2 0 0 1-3.46 0",
  "shield":            "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  "sliders":           "M4 6h16M4 12h16M4 18h16M8 6V4m0 4V6M16 12v-2m0 4v-2M12 18v-2m0 4v-2",
  "eye":               "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  "pencil":            "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  "lock":              "M18 11H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  "trash":             "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6v14a2 2 0 1-2 2H7a2 2 0 0 1-2-2V6",
  "check":             "M20 6L9 17l-5-5",
  "x":                 "M18 6L6 18M6 6l12 12",
  "plus":              "M12 5v14M5 12h14",
  "search":            "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  "speakerphone":      "M18 8a3 3 0 0 1 0 6M5 8v11a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3m10-9L9 11H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4l9 4V8z",
  "device-floppy":     "M6 4h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm4 14v-5h4v5M8 4v4h8V4",
  "arrow-up-right":    "M7 17L17 7M7 7h10v10",
  "arrow-down-right":  "M7 7l10 10M17 7v10H7",
  "book":              "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
  "medal":             "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0 0v6m-3-3h6",
  "circle-dot":        "M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0",
  "hourglass":         "M5 4h14M5 20h14M7 4v5l5 3-5 3v5M17 4v5l-5 3 5 3v5",
  "log-in":            "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
  "log-out":           "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  "user-circle":       "M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 0 1 14 0",
  "school":            "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zm6 13V12h6v10",
  "graduation-cap":    "M22 9L12 5 2 9l10 4 10-4zM6 11v5c0 2 2.686 4 6 4s6-2 6-4v-5M2 9v6",
  "chevron-left":      "M15 18l-6-6 6-6",
  "chevron-right":     "M9 18l6-6-6-6",
};

function Icon({ name, size = 16, color = "currentColor", style: sx }) {
  const d = ICON_PATHS[name];
  if (!d) return <span style={{ width: size, height: size, display: "inline-block" }} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={color} strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0, display: "block", ...sx }}>
    <path d={d} />
    </svg>
  );
}

// ── DATA ─────────────────────────────────────────────────────────────────────
const UNIS_ALL = [
  { name: "Massachusetts Institute of Technology", short: "MIT", country: "USA", programs: 47, students: 312, status: "active" },
{ name: "University of Oxford", short: "OXF", country: "UK", programs: 62, students: 489, status: "active" },
{ name: "Stanford University", short: "STA", country: "USA", programs: 54, students: 401, status: "active" },
{ name: "ETH Zurich", short: "ETH", country: "Switzerland", programs: 38, students: 215, status: "active" },
{ name: "University of Melbourne", short: "UOM", country: "Australia", programs: 44, students: 287, status: "pending" },
{ name: "TU Berlin", short: "TUB", country: "Germany", programs: 29, students: 196, status: "active" },
{ name: "University of Toronto", short: "UOT", country: "Canada", programs: 51, students: 334, status: "suspended" },
{ name: "National Univ. Singapore", short: "NUS", country: "Singapore", programs: 41, students: 278, status: "active" },
{ name: "Harvard University", short: "HAR", country: "USA", programs: 71, students: 520, status: "active" },
{ name: "Cambridge University", short: "CAM", country: "UK", programs: 65, students: 490, status: "active" },
{ name: "Caltech", short: "CAL", country: "USA", programs: 22, students: 142, status: "active" },
{ name: "Imperial College London", short: "ICL", country: "UK", programs: 34, students: 255, status: "active" },
{ name: "University of Tokyo", short: "UTK", country: "Japan", programs: 48, students: 310, status: "active" },
{ name: "Peking University", short: "PKU", country: "China", programs: 55, students: 380, status: "active" },
{ name: "Seoul National University", short: "SNU", country: "South Korea", programs: 39, students: 270, status: "pending" },
{ name: "University of Amsterdam", short: "UVA", country: "Netherlands", programs: 31, students: 200, status: "active" },
{ name: "TU Munich", short: "TUM", country: "Germany", programs: 36, students: 245, status: "active" },
{ name: "McGill University", short: "MCG", country: "Canada", programs: 43, students: 290, status: "active" },
{ name: "University of Sydney", short: "USY", country: "Australia", programs: 47, students: 315, status: "active" },
{ name: "Nanyang Tech University", short: "NTU", country: "Singapore", programs: 38, students: 250, status: "active" },
{ name: "EPFL", short: "EPF", country: "Switzerland", programs: 28, students: 188, status: "active" },
{ name: "KU Leuven", short: "KUL", country: "Belgium", programs: 33, students: 210, status: "suspended" },
{ name: "Univ. of Copenhagen", short: "KU", country: "Denmark", programs: 29, students: 175, status: "pending" },
{ name: "Uppsala University", short: "UPP", country: "Sweden", programs: 26, students: 160, status: "active" },
].map((u, i) => ({ ...u, id: i }));

const COMPANIES_ALL = [
  { name: "Google LLC", short: "G", industry: "Technology", jobs: 24, applicants: 1203, status: "active" },
{ name: "Microsoft Corporation", short: "MS", industry: "Technology", jobs: 18, applicants: 987, status: "active" },
{ name: "Amazon", short: "AMZ", industry: "E-Commerce", jobs: 31, applicants: 1456, status: "active" },
{ name: "Goldman Sachs", short: "GS", industry: "Finance", jobs: 9, applicants: 621, status: "active" },
{ name: "McKinsey & Company", short: "MCK", industry: "Consulting", jobs: 7, applicants: 834, status: "active" },
{ name: "NovaBuild Inc", short: "NB", industry: "Construction", jobs: 4, applicants: 89, status: "pending" },
{ name: "TechVision Corp", short: "TV", industry: "Technology", jobs: 0, applicants: 0, status: "pending" },
{ name: "Pfizer Global", short: "PFZ", industry: "Healthcare", jobs: 12, applicants: 445, status: "suspended" },
{ name: "Apple Inc", short: "AP", industry: "Technology", jobs: 21, applicants: 1102, status: "active" },
{ name: "Meta Platforms", short: "MT", industry: "Technology", jobs: 15, applicants: 876, status: "active" },
{ name: "JPMorgan Chase", short: "JPM", industry: "Finance", jobs: 11, applicants: 543, status: "active" },
{ name: "Deloitte", short: "DLT", industry: "Consulting", jobs: 8, applicants: 712, status: "active" },
{ name: "Boston Consulting Group", short: "BCG", industry: "Consulting", jobs: 6, applicants: 680, status: "active" },
{ name: "Siemens AG", short: "SIE", industry: "Engineering", jobs: 9, applicants: 320, status: "active" },
{ name: "HSBC", short: "HSB", industry: "Finance", jobs: 7, applicants: 410, status: "active" },
{ name: "Airbus", short: "AIR", industry: "Aerospace", jobs: 5, applicants: 280, status: "pending" },
{ name: "Samsung Electronics", short: "SAM", industry: "Technology", jobs: 19, applicants: 930, status: "active" },
{ name: "TotalEnergies", short: "TE", industry: "Energy", jobs: 4, applicants: 190, status: "active" },
{ name: "Nestlé", short: "NES", industry: "Consumer Goods", jobs: 3, applicants: 145, status: "suspended" },
{ name: "Unilever", short: "UNI", industry: "Consumer Goods", jobs: 5, applicants: 230, status: "active" },
{ name: "Shell", short: "SHL", industry: "Energy", jobs: 6, applicants: 310, status: "active" },
{ name: "Roche", short: "ROC", industry: "Healthcare", jobs: 8, applicants: 390, status: "active" },
{ name: "LVMH", short: "LVM", industry: "Luxury", jobs: 2, applicants: 85, status: "pending" },
{ name: "BMW Group", short: "BMW", industry: "Automotive", jobs: 7, applicants: 340, status: "active" },
{ name: "Volkswagen AG", short: "VW", industry: "Automotive", jobs: 6, applicants: 290, status: "active" },
{ name: "BNP Paribas", short: "BNP", industry: "Finance", jobs: 5, applicants: 220, status: "active" },
{ name: "Ericsson", short: "ERI", industry: "Telecom", jobs: 4, applicants: 170, status: "active" },
{ name: "AstraZeneca", short: "AZ", industry: "Healthcare", jobs: 9, applicants: 425, status: "active" },
{ name: "SAP SE", short: "SAP", industry: "Technology", jobs: 11, applicants: 540, status: "active" },
{ name: "Bosch", short: "BSH", industry: "Engineering", jobs: 7, applicants: 305, status: "pending" },
{ name: "Accenture", short: "ACC", industry: "Consulting", jobs: 14, applicants: 760, status: "active" },
{ name: "IBM Corporation", short: "IBM", industry: "Technology", jobs: 10, applicants: 480, status: "active" },
{ name: "Oracle Corp", short: "ORC", industry: "Technology", jobs: 8, applicants: 390, status: "active" },
{ name: "Salesforce", short: "SF", industry: "Technology", jobs: 9, applicants: 420, status: "active" },
{ name: "Spotify", short: "SPT", industry: "Technology", jobs: 6, applicants: 380, status: "active" },
{ name: "Adidas AG", short: "ADS", industry: "Retail", jobs: 3, applicants: 210, status: "active" },
{ name: "KPMG", short: "KPM", industry: "Consulting", jobs: 5, applicants: 350, status: "active" },
{ name: "PwC", short: "PWC", industry: "Consulting", jobs: 7, applicants: 470, status: "active" },
{ name: "EY", short: "EY", industry: "Consulting", jobs: 6, applicants: 430, status: "active" },
{ name: "Barclays", short: "BAR", industry: "Finance", jobs: 4, applicants: 198, status: "active" },
{ name: "Novartis", short: "NVS", industry: "Healthcare", jobs: 7, applicants: 360, status: "active" },
{ name: "Tata Consultancy", short: "TCS", industry: "Technology", jobs: 16, applicants: 820, status: "active" },
{ name: "Infosys", short: "INF", industry: "Technology", jobs: 12, applicants: 640, status: "active" },
{ name: "Wipro", short: "WIP", industry: "Technology", jobs: 10, applicants: 510, status: "active" },
{ name: "Grab Holdings", short: "GRB", industry: "Technology", jobs: 5, applicants: 270, status: "active" },
{ name: "Sea Limited", short: "SEA", industry: "Technology", jobs: 8, applicants: 380, status: "pending" },
{ name: "Petronas", short: "PTR", industry: "Energy", jobs: 4, applicants: 165, status: "active" },
{ name: "DHL Group", short: "DHL", industry: "Logistics", jobs: 5, applicants: 220, status: "active" },
{ name: "Maersk", short: "MAE", industry: "Logistics", jobs: 3, applicants: 140, status: "active" },
{ name: "Zalando", short: "ZAL", industry: "E-Commerce", jobs: 4, applicants: 195, status: "active" },
{ name: "Delivery Hero", short: "DH", industry: "E-Commerce", jobs: 3, applicants: 145, status: "suspended" },
{ name: "N26 Bank", short: "N26", industry: "Finance", jobs: 3, applicants: 130, status: "pending" },
{ name: "Klarna", short: "KLA", industry: "Finance", jobs: 4, applicants: 175, status: "active" },
{ name: "Revolut", short: "REV", industry: "Finance", jobs: 5, applicants: 250, status: "active" },
{ name: "Stripe Inc", short: "STR", industry: "Technology", jobs: 7, applicants: 380, status: "active" },
{ name: "Notion Labs", short: "NOT", industry: "Technology", jobs: 3, applicants: 190, status: "active" },
{ name: "Slack Technologies", short: "SLK", industry: "Technology", jobs: 2, applicants: 110, status: "inactive" },
{ name: "Zoom Video", short: "ZOM", industry: "Technology", jobs: 4, applicants: 210, status: "active" },
{ name: "Dropbox", short: "DBX", industry: "Technology", jobs: 2, applicants: 95, status: "inactive" },
{ name: "HubSpot", short: "HBS", industry: "Technology", jobs: 5, applicants: 270, status: "active" },
].map((c, i) => ({ ...c, id: i }));

const STUDENTS_ALL = [
  { name: "Aisha Rahman", email: "aisha.r@email.com", level: "Masters", apps: 4, joined: "Jan 2024", status: "active" },
{ name: "Carlos Mota", email: "c.mota@email.com", level: "Undergraduate", apps: 2, joined: "Sep 2023", status: "active" },
{ name: "Lena Bauer", email: "l.bauer@email.com", level: "PhD", apps: 3, joined: "Mar 2024", status: "active" },
{ name: "Priya Nair", email: "p.nair@email.com", level: "Masters", apps: 5, joined: "Jun 2023", status: "active" },
{ name: "James Wu", email: "j.wu@email.com", level: "Undergraduate", apps: 1, joined: "Sep 2023", status: "active" },
{ name: "Aria Kovacs", email: "a.kovacs@email.com", level: "Masters", apps: 3, joined: "Jan 2024", status: "pending" },
{ name: "Omar Hassan", email: "o.hassan@email.com", level: "PhD", apps: 2, joined: "May 2023", status: "suspended" },
{ name: "Yuki Tanaka", email: "y.tanaka@email.com", level: "Undergraduate", apps: 6, joined: "Sep 2024", status: "active" },
{ name: "Sofia Herrera", email: "s.herrera@email.com", level: "Masters", apps: 4, joined: "Feb 2024", status: "active" },
{ name: "Kwame Asante", email: "k.asante@email.com", level: "PhD", apps: 2, joined: "Apr 2023", status: "active" },
{ name: "Elena Popescu", email: "e.popescu@email.com", level: "Undergraduate", apps: 3, joined: "Sep 2023", status: "active" },
{ name: "Tariq Al-Farsi", email: "t.alfarsi@email.com", level: "Masters", apps: 5, joined: "Jan 2024", status: "active" },
{ name: "Mei Lin Chen", email: "m.chen@email.com", level: "PhD", apps: 1, joined: "Aug 2023", status: "active" },
{ name: "Dmitri Volkov", email: "d.volkov@email.com", level: "Masters", apps: 6, joined: "Oct 2023", status: "active" },
{ name: "Isabelle Dupont", email: "i.dupont@email.com", level: "Undergraduate", apps: 2, joined: "Sep 2024", status: "pending" },
{ name: "Aarav Singh", email: "a.singh@email.com", level: "Masters", apps: 4, joined: "Mar 2024", status: "active" },
{ name: "Chloe Martin", email: "c.martin@email.com", level: "Undergraduate", apps: 3, joined: "Sep 2023", status: "active" },
{ name: "Nikolaj Petersen", email: "n.petersen@email.com", level: "PhD", apps: 2, joined: "May 2024", status: "active" },
{ name: "Fatima Zahra", email: "f.zahra@email.com", level: "Masters", apps: 5, joined: "Jan 2024", status: "active" },
{ name: "Lucas Ferreira", email: "l.ferreira@email.com", level: "Undergraduate", apps: 1, joined: "Sep 2023", status: "suspended" },
].map((s, i) => ({ ...s, id: i }));

const JOBS_ALL = [
  { title: "Senior Software Engineer", company: "Google LLC", type: "Full-time", salary: "$120–180k", deadline: "Jul 30", status: "active" },
{ title: "Data Scientist", company: "Microsoft", type: "Full-time", salary: "$100–150k", deadline: "Aug 15", status: "active" },
{ title: "Product Manager", company: "Amazon", type: "Full-time", salary: "$110–160k", deadline: "Jul 25", status: "active" },
{ title: "ML Research Intern", company: "Google LLC", type: "Internship", salary: "$8k/mo", deadline: "Jun 30", status: "active" },
{ title: "Investment Analyst", company: "Goldman Sachs", type: "Full-time", salary: "$90–130k", deadline: "Aug 1", status: "active" },
{ title: "Strategy Consultant", company: "McKinsey", type: "Full-time", salary: "$95–140k", deadline: "Jul 20", status: "active" },
{ title: "Frontend Developer", company: "NovaBuild Inc", type: "Part-time", salary: "$60–80k", deadline: "Aug 10", status: "pending" },
{ title: "Medical Researcher", company: "Pfizer Global", type: "Full-time", salary: "$85–120k", deadline: "Sep 1", status: "pending" },
{ title: "Backend Engineer", company: "Meta Platforms", type: "Full-time", salary: "$130–190k", deadline: "Aug 5", status: "active" },
{ title: "UX Designer", company: "Apple Inc", type: "Full-time", salary: "$100–140k", deadline: "Aug 20", status: "active" },
{ title: "Cloud Architect", company: "Amazon", type: "Full-time", salary: "$140–200k", deadline: "Aug 25", status: "active" },
{ title: "Quant Analyst", company: "JPMorgan Chase", type: "Full-time", salary: "$95–145k", deadline: "Jul 28", status: "active" },
{ title: "DevOps Engineer", company: "IBM Corporation", type: "Full-time", salary: "$90–130k", deadline: "Sep 5", status: "active" },
{ title: "Data Engineer", company: "Salesforce", type: "Full-time", salary: "$105–155k", deadline: "Aug 30", status: "active" },
{ title: "Mobile Developer", company: "Spotify", type: "Full-time", salary: "$110–160k", deadline: "Aug 12", status: "active" },
{ title: "AI Research Intern", company: "Meta Platforms", type: "Internship", salary: "$9k/mo", deadline: "Jul 15", status: "active" },
{ title: "Finance Analyst", company: "Barclays", type: "Full-time", salary: "$70–100k", deadline: "Sep 10", status: "active" },
{ title: "Cybersecurity Analyst", company: "Microsoft", type: "Full-time", salary: "$95–140k", deadline: "Aug 18", status: "active" },
{ title: "Marketing Manager", company: "Unilever", type: "Full-time", salary: "$80–110k", deadline: "Sep 3", status: "active" },
{ title: "Operations Analyst", company: "DHL Group", type: "Full-time", salary: "$65–90k", deadline: "Aug 22", status: "pending" },
].map((j, i) => ({ ...j, id: i }));

const APPLICATIONS_ALL = [
  { student: "Aisha Rahman", target: "MIT — CS Masters", type: "University", date: "Jun 01", status: "pending" },
{ student: "Carlos Mota", target: "Google — SWE", type: "Job", date: "Jun 01", status: "active" },
{ student: "Lena Bauer", target: "Stanford — MBA", type: "University", date: "May 31", status: "active" },
{ student: "Priya Nair", target: "Amazon — PM Role", type: "Job", date: "May 31", status: "active" },
{ student: "James Wu", target: "Oxford — Engineering", type: "University", date: "May 30", status: "pending" },
{ student: "Aria Kovacs", target: "Goldman Sachs", type: "Job", date: "May 30", status: "pending" },
{ student: "Omar Hassan", target: "ETH Zurich — PhD", type: "University", date: "May 29", status: "suspended" },
{ student: "Yuki Tanaka", target: "McKinsey Analyst", type: "Job", date: "May 28", status: "active" },
{ student: "Sofia Herrera", target: "Harvard — MBA", type: "University", date: "May 27", status: "active" },
{ student: "Kwame Asante", target: "Microsoft — Data Sci", type: "Job", date: "May 27", status: "active" },
{ student: "Elena Popescu", target: "Cambridge — Law", type: "University", date: "May 26", status: "pending" },
{ student: "Tariq Al-Farsi", target: "Apple — iOS Eng", type: "Job", date: "May 26", status: "active" },
{ student: "Mei Lin Chen", target: "Caltech — PhD CS", type: "University", date: "May 25", status: "active" },
{ student: "Dmitri Volkov", target: "Deloitte Analyst", type: "Job", date: "May 25", status: "pending" },
{ student: "Isabelle Dupont", target: "ETH Zurich — Masters", type: "University", date: "May 24", status: "pending" },
{ student: "Aarav Singh", target: "JPMorgan — Quant", type: "Job", date: "May 24", status: "active" },
{ student: "Chloe Martin", target: "Imperial — Engineering", type: "University", date: "May 23", status: "active" },
{ student: "Nikolaj Petersen", target: "Spotify — Mobile Dev", type: "Job", date: "May 23", status: "active" },
{ student: "Fatima Zahra", target: "Sorbonne — PhD", type: "University", date: "May 22", status: "pending" },
{ student: "Lucas Ferreira", target: "Amazon — Operations", type: "Job", date: "May 22", status: "suspended" },
{ student: "Aisha Rahman", target: "Stanford — AI Masters", type: "University", date: "May 21", status: "active" },
{ student: "Priya Nair", target: "Google — PM Role", type: "Job", date: "May 21", status: "active" },
{ student: "James Wu", target: "MIT — PhD CS", type: "University", date: "May 20", status: "pending" },
{ student: "Yuki Tanaka", target: "BCG Consultant", type: "Job", date: "May 20", status: "active" },
].map((a, i) => ({ ...a, id: i }));

const MONTHS_CHART = [
  { l: "Sep", v: 1100 }, { l: "Oct", v: 970 }, { l: "Nov", v: 830 },
{ l: "Dec", v: 760 }, { l: "Jan", v: 420 }, { l: "Feb", v: 610 },
{ l: "Mar", v: 540 }, { l: "Apr", v: 790 },
];
const TOP_PROGRAMS = [
  { name: "Computer Science (MS)", pct: 88 },
  { name: "MBA — Business Admin", pct: 74 },
{ name: "Data Science (MS)", pct: 68 },
{ name: "Electrical Engineering (PhD)", pct: 52 },
{ name: "Artificial Intelligence (MS)", pct: 47 },
];
const TOP_COMPANIES = [
  { name: "Google LLC", pct: 92 },
{ name: "Amazon", pct: 81 },
{ name: "Microsoft", pct: 74 },
{ name: "Goldman Sachs", pct: 60 },
{ name: "McKinsey & Co.", pct: 53 },
];
const PENDING_APPROVALS = [
  { label: "TechVision Corp", desc: "new company account request" },
{ label: "Univ. of Melbourne", desc: "program addition request" },
{ label: "NovaBuild Inc", desc: "job posting approval" },
{ label: "HarvardX Ext.", desc: "scholarship posting" },
{ label: "Aria Kovacs", desc: "student document verification" },
];
const RECENT_ACTIVITY = [
  { student: "Aisha Rahman", target: "MIT — CS Masters", time: "2m ago" },
{ student: "Carlos Mota", target: "Google — SWE", time: "14m ago" },
{ student: "Lena Bauer", target: "Stanford — MBA", time: "1h ago" },
{ student: "Priya Nair", target: "Amazon — PM Role", time: "2h ago" },
{ student: "James Wu", target: "Oxford — Engineering", time: "3h ago" },
];

// ── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  green: "#22c55e", greenLight: "#dcfce7", greenDark: "#16a34a", greenMid: "#bbf7d0",
  navy: "#0f172a", navyMid: "#1e293b", navyLight: "#334155",
  white: "#ffffff", surface: "#f8fafc", surfaceMid: "#f1f5f9",
  border: "rgba(15,23,42,0.08)", borderMid: "rgba(15,23,42,0.14)",
  muted: "#64748b", light: "#94a3b8", text: "#0f172a",
};
const STATUS = {
  active:    { bg: "#dcfce7", color: "#15803d" },
  pending:   { bg: "#fef9c3", color: "#a16207" },
  suspended: { bg: "#fee2e2", color: "#b91c1c" },
  inactive:  { bg: "#f1f5f9", color: "#475569" },
};
const initials = (n) => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

// ── SIDEBAR CONSTANTS ────────────────────────────────────────────────────────
const SB_COLLAPSED = 68;
const SB_EXPANDED  = 240;
const SB_GAP       = 20;
const NAV_ITEM_H   = 48;
const ICON_SIZE    = 20;

// ── PRIMITIVES ───────────────────────────────────────────────────────────────
function Badge({ status }) {
  const s = STATUS[status] || STATUS.inactive;
  return (
    <span style={{ ...s, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, display: "inline-block", letterSpacing: "0.2px" }}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function Avatar({ text, bg = C.navy, size = 32, radius = 8 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <span style={{ fontSize: Math.floor(size * 0.34), fontWeight: 700, color: "#fff" }}>{text}</span>
    </div>
  );
}

function Btn({ children, variant = "primary", icon, onClick, style: sx }) {
  const [hov, setHov] = useState(false);
  const base = { height: 34, padding: "0 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s", ...sx };
  const v = {
    primary: { background: hov ? C.greenDark : C.green, color: "#fff" },
    ghost:   { background: hov ? C.surfaceMid : "transparent", border: `1px solid ${C.border}`, color: C.text },
    sm:      { height: 28, fontSize: 11, background: hov ? C.surfaceMid : "transparent", border: `1px solid ${C.border}`, color: C.text },
  };
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick} style={{ ...base, ...v[variant] }}>
    {icon && <Icon name={icon} size={14} />}
    {children}
    </button>
  );
}

function IconBtn({ icon, title, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onClick={onClick}
    onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: hov ? C.surfaceMid : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: hov ? C.navy : C.muted, transition: "all 0.15s" }}>
    <Icon name={icon} size={14} />
    </button>
  );
}

function SearchBox({ placeholder = "Search...", width = 180, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "0 12px", height: 34, width }}>
    <Icon name="search" size={15} color={C.muted} />
    <input placeholder={placeholder} value={value} onChange={e => onChange?.(e.target.value)}
    style={{ border: "none", background: "none", fontSize: 13, color: C.text, width: "100%", outline: "none" }} />
    </div>
  );
}

function FilterSelect({ options, value, onChange }) {
  return (
    <select value={value} onChange={e => onChange?.(e.target.value)}
    style={{ height: 34, border: `1px solid ${C.border}`, borderRadius: 8, background: C.surface, fontSize: 12, color: C.text, padding: "0 10px", cursor: "pointer", outline: "none" }}>
    {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function SectionHeader({ title, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "-0.2px" }}>{title}</div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{children}</div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", ...style }}>
    {children}
    </div>
  );
}

function CardHeader({ title, children }) {
  return (
    <div style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{title}</span>
    {children}
    </div>
  );
}

function TH({ children }) {
  return <th style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", padding: "10px 16px", textAlign: "left", background: C.surface }}>{children}</th>;
}

function TD({ children, style }) {
  return <td style={{ padding: "11px 16px", borderTop: `1px solid ${C.border}`, ...style }}>{children}</td>;
}

// ── WORKING PAGINATION ────────────────────────────────────────────────────────
function Pagination({ page, totalPages, total, perPage, label, onPageChange }) {
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  const btnBase = { width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.12s" };

  return (
    <div style={{ padding: "11px 16px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <span style={{ fontSize: 12, color: C.muted }}>Showing {start}–{end} of {total} {label}</span>
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
    <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
    style={{ ...btnBase, background: "transparent", color: page === 1 ? C.light : C.text, opacity: page === 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Icon name="chevron-left" size={14} />
    </button>
    {pages.map((p, i) =>
      p === "…"
      ? <span key={`e${i}`} style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.muted }}>…</span>
      : <button key={p} onClick={() => onPageChange(p)}
      style={{ ...btnBase, background: p === page ? C.navy : "transparent", color: p === page ? "#fff" : C.text }}>
      {p}
      </button>
    )}
    <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
    style={{ ...btnBase, background: "transparent", color: page === totalPages ? C.light : C.text, opacity: page === totalPages ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Icon name="chevron-right" size={14} />
    </button>
    </div>
    </div>
  );
}

// ── PAGINATION HOOK ───────────────────────────────────────────────────────────
function usePagination(allData, perPage = 8) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(allData.length / perPage));
  const safePage = Math.min(page, totalPages);
  const slice = allData.slice((safePage - 1) * perPage, safePage * perPage);
  return { page: safePage, setPage, totalPages, slice, total: allData.length, perPage };
}

// ── CHARTS ───────────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 96 }}>
    {data.map((d, i) => (
      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div
      style={{ width: "100%", height: Math.round((d.v / max) * 86), background: C.greenMid, borderRadius: "3px 3px 0 0", cursor: "pointer", transition: "background 0.15s" }}
      onMouseEnter={e => e.target.style.background = C.green}
      onMouseLeave={e => e.target.style.background = C.greenMid}
      />
      <span style={{ fontSize: 10, color: C.muted }}>{d.l}</span>
      </div>
    ))}
    </div>
  );
}

function RankBar({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {data.map((d, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.light, width: 14, flexShrink: 0 }}>{i + 1}</span>
      <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 4 }}>{d.name}</div>
      <div style={{ height: 5, background: C.surfaceMid, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${d.pct}%`, background: C.green, borderRadius: 3, transition: "width 0.6s" }} />
      </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.green, width: 30, textAlign: "right" }}>{d.pct}%</span>
      </div>
    ))}
    </div>
  );
}

// ── MODAL / DRAWER ───────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", height: 36, border: `1px solid ${C.border}`, borderRadius: 8,
  padding: "0 12px", fontSize: 13, color: C.text, background: C.white, outline: "none",
  boxSizing: "border-box",
};

function FG({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</label>
    {children}
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 14, width: 480, maxWidth: "95vw", maxHeight: "88vh", overflowY: "auto", padding: 24, boxShadow: "0 20px 60px rgba(15,23,42,0.18)" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
    <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{title}</span>
    <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
    <Icon name="x" size={15} />
    </button>
    </div>
    {children}
    </div>
    </div>
  );
}

function ViewDrawer({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
    <div onClick={e => e.stopPropagation()} style={{ width: 360, background: C.white, height: "100%", overflowY: "auto", boxShadow: "-8px 0 32px rgba(15,23,42,0.12)", display: "flex", flexDirection: "column" }}>
    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{title}</span>
    <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
    <Icon name="x" size={14} />
    </button>
    </div>
    <div style={{ padding: 20, flex: 1 }}>{children}</div>
    </div>
    </div>
  );
}

function ConfirmDialog({ open, onClose, onConfirm, title, message, danger }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 14, width: 380, padding: 24, boxShadow: "0 20px 60px rgba(15,23,42,0.18)" }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>{message}</div>
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
    <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
    <button onClick={onConfirm} style={{ height: 34, padding: "0 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: danger ? "#ef4444" : C.green, color: "#fff" }}>
    {danger ? "Delete" : "Confirm"}
    </button>
    </div>
    </div>
    </div>
  );
}

function DrawerField({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

// ── MODAL CONTENTS ────────────────────────────────────────────────────────────
function UniversityModal({ onClose }) {
  return <>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
  <FG label="University Name"><input style={inputStyle} placeholder="e.g. Harvard University" /></FG>
  <FG label="Country"><input style={inputStyle} placeholder="e.g. USA" /></FG>
  <FG label="Website"><input style={inputStyle} placeholder="https://..." /></FG>
  <FG label="Contact Email"><input style={inputStyle} placeholder="admin@uni.edu" /></FG>
  <FG label="Password"><input style={inputStyle} type="password" /></FG>
  <FG label="Status"><select style={{ ...inputStyle, height: 36 }}><option>Active</option><option>Pending</option></select></FG>
  </div>
  <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
  <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
  <Btn icon="check">Save University</Btn>
  </div>
  </>;
}

function CompanyModal({ onClose }) {
  return <>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
  <FG label="Company Name"><input style={inputStyle} placeholder="e.g. Tesla Inc." /></FG>
  <FG label="Industry"><select style={{ ...inputStyle, height: 36 }}>{["Technology","Finance","Healthcare","Education","E-Commerce"].map(o => <option key={o}>{o}</option>)}</select></FG>
  <FG label="Website"><input style={inputStyle} placeholder="https://..." /></FG>
  <FG label="Contact Email"><input style={inputStyle} placeholder="hr@company.com" /></FG>
  <FG label="Password"><input style={inputStyle} type="password" /></FG>
  <FG label="Status"><select style={{ ...inputStyle, height: 36 }}><option>Active</option><option>Pending</option></select></FG>
  </div>
  <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
  <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
  <Btn icon="check">Save Company</Btn>
  </div>
  </>;
}

function JobModal({ onClose }) {
  return <>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
  <FG label="Job Title"><input style={inputStyle} placeholder="e.g. Data Analyst" /></FG>
  <FG label="Type"><select style={{ ...inputStyle, height: 36 }}>{["Full-time","Part-time","Internship","Contract"].map(o => <option key={o}>{o}</option>)}</select></FG>
  <FG label="Min Salary"><input style={inputStyle} placeholder="80000" /></FG>
  <FG label="Max Salary"><input style={inputStyle} placeholder="120000" /></FG>
  <FG label="Experience (yrs)"><input style={inputStyle} type="number" placeholder="2" /></FG>
  <FG label="Deadline"><input style={inputStyle} type="date" /></FG>
  </div>
  <FG label="Required Skills"><input style={inputStyle} placeholder="Python, SQL, ML..." /></FG>
  <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
  <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
  <Btn icon="check">Post Job</Btn>
  </div>
  </>;
}

function NotificationModal({ onClose }) {
  return <>
  <FG label="Target Audience"><select style={{ ...inputStyle, height: 36 }}>{["All Users","Students Only","Universities Only","Companies Only"].map(o => <option key={o}>{o}</option>)}</select></FG>
  <FG label="Type"><select style={{ ...inputStyle, height: 36 }}>{["Platform Announcement","Alert","Reminder","Update"].map(o => <option key={o}>{o}</option>)}</select></FG>
  <FG label="Title"><input style={inputStyle} placeholder="Notification title..." /></FG>
  <FG label="Message"><textarea style={{ ...inputStyle, height: 90, padding: "8px 12px", resize: "none" }} placeholder="Enter your message..." /></FG>
  <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
  <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
  <Btn icon="speakerphone">Send Now</Btn>
  </div>
  </>;
}

function ProfileModal({ onClose }) {
  return <>
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
  <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>SA</span>
  </div>
  <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Super Admin</div>
  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>admin@educareer.ai</div>
  <span style={{ marginTop: 8, ...STATUS.active, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Active</span>
  </div>
  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
  <FG label="Full Name"><input style={inputStyle} defaultValue="Super Admin" /></FG>
  <FG label="Role"><input style={inputStyle} defaultValue="Administrator" disabled /></FG>
  <FG label="Email"><input style={inputStyle} defaultValue="admin@educareer.ai" /></FG>
  <FG label="Phone"><input style={inputStyle} placeholder="+1 000 000 0000" /></FG>
  </div>
  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginBottom: 14 }}>
  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 12 }}>Change Password</div>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
  <FG label="New Password"><input style={inputStyle} type="password" placeholder="••••••••" /></FG>
  <FG label="Confirm Password"><input style={inputStyle} type="password" placeholder="••••••••" /></FG>
  </div>
  </div>
  </div>
  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
  <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
  <Btn icon="check">Save Profile</Btn>
  </div>
  </>;
}

// ── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, trend, trendUp, icon, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    style={{ background: C.white, border: `1px solid ${hov ? C.borderMid : C.border}`, borderRadius: 12, padding: 16, position: "relative", overflow: "hidden", cursor: onClick ? "pointer" : "default", transform: hov ? "translateY(-2px)" : "none", boxShadow: hov ? "0 6px 20px rgba(15,23,42,0.06)" : "none", transition: "all 0.18s" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.border }} />
    <div style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, background: C.surfaceMid, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Icon name={icon} size={17} color={C.muted} />
    </div>
    <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.5px" }}>{value}</div>
    <div style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4, color: trendUp ? C.green : "#ef4444" }}>
    <Icon name={trendUp ? "arrow-up-right" : "arrow-down-right"} size={13} />
    {trend}
    </div>
    </div>
  );
}

// ── PAGES ─────────────────────────────────────────────────────────────────────
function DashboardPage({ setPage, openModal }) {
  return (
    <div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
    <StatCard label="Universities" value="24" trend="+3 this month" trendUp icon="building-community" onClick={() => setPage("universities")} />
    <StatCard label="Companies" value="61" trend="+8 this month" trendUp icon="building" onClick={() => setPage("companies")} />
    <StatCard label="Students" value="3,214" trend="+127 this week" trendUp icon="users" onClick={() => setPage("students")} />
    <StatCard label="Active Jobs" value="189" trend="+22 this month" trendUp icon="briefcase" onClick={() => setPage("jobs")} />
    <StatCard label="Uni Programs" value="342" trend="+14 added" trendUp icon="book" />
    <StatCard label="Applications" value="8,741" trend="+312 this week" trendUp icon="file-description" onClick={() => setPage("applications")} />
    <StatCard label="Scholarships" value="87" trend="+5 new" trendUp icon="graduation-cap" />
    <StatCard label="Active Users" value="1,429" trend="Online now" trendUp icon="circle-dot" />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
    <Card>
    <div style={{ padding: 16 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>Applications by Month</div>
    <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>University & job applications combined</div>
    <BarChart data={MONTHS_CHART} />
    </div>
    </Card>
    <Card>
    <div style={{ padding: 16 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>Platform Breakdown</div>
    <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Users by role</div>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <svg width="86" height="86" viewBox="0 0 86 86">
    <circle cx="43" cy="43" r="33" fill="none" stroke={C.surfaceMid} strokeWidth="11" />
    <circle cx="43" cy="43" r="33" fill="none" stroke={C.green} strokeWidth="11" strokeDasharray="104 104" strokeLinecap="round" transform="rotate(-90 43 43)" />
    <circle cx="43" cy="43" r="33" fill="none" stroke={C.navy} strokeWidth="11" strokeDasharray="52 156" strokeDashoffset="-104" strokeLinecap="round" transform="rotate(-90 43 43)" />
    <circle cx="43" cy="43" r="33" fill="none" stroke={C.light} strokeWidth="11" strokeDasharray="52 156" strokeDashoffset="-156" strokeLinecap="round" transform="rotate(-90 43 43)" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
    {[{ c: C.green, l: "Students", p: "50%" }, { c: C.navy, l: "Universities", p: "25%" }, { c: C.light, l: "Companies", p: "25%" }].map(r => (
      <div key={r.l} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.c }} />
      <span style={{ color: C.text }}>{r.l} <strong>{r.p}</strong></span>
      </div>
    ))}
    </div>
    </div>
    </div>
    </Card>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    <Card>
    <CardHeader title="Recent Applications">
    <Btn variant="sm" onClick={() => setPage("applications")}>View all</Btn>
    </CardHeader>
    {RECENT_ACTIVITY.map((a, i) => (
      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px", borderTop: `1px solid ${C.border}` }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, flexShrink: 0, marginTop: 5 }} />
      <div style={{ fontSize: 12, color: C.text, flex: 1, lineHeight: 1.5 }}>
      <strong>{a.student}</strong> applied to <strong>{a.target}</strong>
      </div>
      <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{a.time}</span>
      </div>
    ))}
    </Card>
    <Card>
    <CardHeader title="Pending Approvals"><Badge status="pending" /></CardHeader>
    {PENDING_APPROVALS.map((a, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderTop: `1px solid ${C.border}` }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
      <div style={{ fontSize: 12, color: C.text, flex: 1 }}>
      <strong>{a.label}</strong> — {a.desc}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
      <IconBtn icon="check" title="Approve" />
      <IconBtn icon="x" title="Reject" />
      </div>
      </div>
    ))}
    </Card>
    </div>
    </div>
  );
}

function UniversitiesPage({ openModal }) {
  const [rows, setRows] = useState(UNIS_ALL);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const filtered = rows.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (countryFilter !== "All Countries" && r.country !== countryFilter) return false;
    if (statusFilter !== "All Status" && r.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    return true;
  });

  const { page, setPage, totalPages, slice, total, perPage } = usePagination(filtered, 8);

  const toggleSuspend = (id) => setRows(rows.map(r => r.id === id ? { ...r, status: r.status === "suspended" ? "active" : "suspended" } : r));
  const deleteRow = (id) => { setRows(rows.filter(r => r.id !== id)); setDeleteItem(null); };

  return (
    <div>
    <SectionHeader title="University Accounts">
    <SearchBox value={search} onChange={v => { setSearch(v); setPage(1); }} />
    <FilterSelect options={["All Countries","USA","UK","Germany","Australia","Switzerland","Canada","Singapore","Japan","China","South Korea","Netherlands","Belgium","Denmark","Sweden"]} value={countryFilter} onChange={v => { setCountryFilter(v); setPage(1); }} />
    <FilterSelect options={["All Status","Active","Pending","Suspended"]} value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} />
    <Btn icon="plus" onClick={() => openModal("university")}>Add University</Btn>
    </SectionHeader>
    <Card>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead><tr>{["University","Country","Programs","Students","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
    <tbody>
    {slice.map(u => (
      <tr key={u.id}>
      <TD><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar text={u.short} size={32} radius={8} />
      <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{u.name}</div>
      <div style={{ fontSize: 11, color: C.muted }}>{u.country}</div>
      </div>
      </div></TD>
      <TD><span style={{ fontSize: 12, color: C.muted }}>{u.country}</span></TD>
      <TD><span style={{ fontSize: 13, fontWeight: 600 }}>{u.programs}</span></TD>
      <TD><span style={{ fontSize: 13, fontWeight: 600 }}>{u.students}</span></TD>
      <TD><Badge status={u.status} /></TD>
      <TD><div style={{ display: "flex", gap: 4 }}>
      <IconBtn icon="eye" title="View" onClick={() => setViewItem(u)} />
      <IconBtn icon="pencil" title="Edit" onClick={() => setEditItem(u)} />
      <IconBtn icon="lock" title={u.status === "suspended" ? "Unsuspend" : "Suspend"} onClick={() => toggleSuspend(u.id)} />
      <IconBtn icon="trash" title="Delete" onClick={() => setDeleteItem(u)} />
      </div></TD>
      </tr>
    ))}
    </tbody>
    </table>
    <Pagination page={page} totalPages={totalPages} total={total} perPage={perPage} label="universities" onPageChange={setPage} />
    </Card>

    <ViewDrawer open={!!viewItem} onClose={() => setViewItem(null)} title="University Details">
    {viewItem && <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
      <Avatar text={viewItem.short} size={48} radius={12} />
      <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{viewItem.name}</div>
      <Badge status={viewItem.status} />
      </div>
      </div>
      <DrawerField label="Country" value={viewItem.country} />
      <DrawerField label="Programs" value={viewItem.programs} />
      <DrawerField label="Enrolled Students" value={viewItem.students} />
      <DrawerField label="Status" value={viewItem.status.charAt(0).toUpperCase() + viewItem.status.slice(1)} />
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
      <Btn variant="ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setViewItem(null); setEditItem(viewItem); }}>Edit</Btn>
      <Btn style={{ flex: 1, justifyContent: "center" }} onClick={() => setViewItem(null)}>Close</Btn>
      </div>
      </>}
      </ViewDrawer>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit University">
      {editItem && <>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FG label="University Name"><input style={inputStyle} defaultValue={editItem.name} /></FG>
        <FG label="Country"><input style={inputStyle} defaultValue={editItem.country} /></FG>
        <FG label="Programs"><input style={inputStyle} type="number" defaultValue={editItem.programs} /></FG>
        <FG label="Students"><input style={inputStyle} type="number" defaultValue={editItem.students} /></FG>
        <FG label="Status">
        <select style={{ ...inputStyle, height: 36 }} defaultValue={editItem.status}>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="suspended">Suspended</option>
        </select>
        </FG>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={() => setEditItem(null)}>Cancel</Btn>
        <Btn icon="check" onClick={() => setEditItem(null)}>Save Changes</Btn>
        </div>
        </>}
        </Modal>

        <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={() => deleteRow(deleteItem.id)}
        title="Delete University" message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`} danger />
        </div>
  );
}

function CompaniesPage({ openModal }) {
  const [rows, setRows] = useState(COMPANIES_ALL);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const filtered = rows.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (industryFilter !== "All Industries" && r.industry !== industryFilter) return false;
    if (statusFilter !== "All Status" && r.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    return true;
  });

  const { page, setPage, totalPages, slice, total, perPage } = usePagination(filtered, 8);
  const toggleSuspend = (id) => setRows(rows.map(r => r.id === id ? { ...r, status: r.status === "suspended" ? "active" : "suspended" } : r));
  const deleteRow = (id) => { setRows(rows.filter(r => r.id !== id)); setDeleteItem(null); };

  return (
    <div>
    <SectionHeader title="Company Accounts">
    <SearchBox value={search} onChange={v => { setSearch(v); setPage(1); }} />
    <FilterSelect options={["All Industries","Technology","Finance","Healthcare","E-Commerce","Consulting","Engineering","Automotive","Energy","Logistics","Retail","Luxury","Telecom","Aerospace","Consumer Goods"]} value={industryFilter} onChange={v => { setIndustryFilter(v); setPage(1); }} />
    <FilterSelect options={["All Status","Active","Pending","Suspended","Inactive"]} value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} />
    <Btn icon="plus" onClick={() => openModal("company")}>Add Company</Btn>
    </SectionHeader>
    <Card>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead><tr>{["Company","Industry","Active Jobs","Applicants","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
    <tbody>
    {slice.map(c => (
      <tr key={c.id}>
      <TD><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar text={c.short} size={32} radius={8} bg={C.green} />
      <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.name}</div>
      <div style={{ fontSize: 11, color: C.muted }}>{c.industry}</div>
      </div>
      </div></TD>
      <TD><span style={{ fontSize: 12, color: C.muted }}>{c.industry}</span></TD>
      <TD><span style={{ fontSize: 13, fontWeight: 600 }}>{c.jobs}</span></TD>
      <TD><span style={{ fontSize: 13, fontWeight: 600 }}>{c.applicants.toLocaleString()}</span></TD>
      <TD><Badge status={c.status} /></TD>
      <TD><div style={{ display: "flex", gap: 4 }}>
      <IconBtn icon="eye" title="View" onClick={() => setViewItem(c)} />
      <IconBtn icon="pencil" title="Edit" onClick={() => setEditItem(c)} />
      <IconBtn icon="lock" title={c.status === "suspended" ? "Unsuspend" : "Suspend"} onClick={() => toggleSuspend(c.id)} />
      <IconBtn icon="trash" title="Delete" onClick={() => setDeleteItem(c)} />
      </div></TD>
      </tr>
    ))}
    </tbody>
    </table>
    <Pagination page={page} totalPages={totalPages} total={total} perPage={perPage} label="companies" onPageChange={setPage} />
    </Card>

    <ViewDrawer open={!!viewItem} onClose={() => setViewItem(null)} title="Company Details">
    {viewItem && <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
      <Avatar text={viewItem.short} size={48} radius={12} bg={C.green} />
      <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{viewItem.name}</div>
      <Badge status={viewItem.status} />
      </div>
      </div>
      <DrawerField label="Industry" value={viewItem.industry} />
      <DrawerField label="Active Jobs" value={viewItem.jobs} />
      <DrawerField label="Total Applicants" value={viewItem.applicants.toLocaleString()} />
      <DrawerField label="Status" value={viewItem.status.charAt(0).toUpperCase() + viewItem.status.slice(1)} />
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
      <Btn variant="ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setViewItem(null); setEditItem(viewItem); }}>Edit</Btn>
      <Btn style={{ flex: 1, justifyContent: "center" }} onClick={() => setViewItem(null)}>Close</Btn>
      </div>
      </>}
      </ViewDrawer>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Company">
      {editItem && <>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FG label="Company Name"><input style={inputStyle} defaultValue={editItem.name} /></FG>
        <FG label="Industry"><select style={{ ...inputStyle, height: 36 }} defaultValue={editItem.industry}>{["Technology","Finance","Healthcare","Education","E-Commerce","Consulting","Construction"].map(o => <option key={o}>{o}</option>)}</select></FG>
        <FG label="Active Jobs"><input style={inputStyle} type="number" defaultValue={editItem.jobs} /></FG>
        <FG label="Status"><select style={{ ...inputStyle, height: 36 }} defaultValue={editItem.status}><option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select></FG>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={() => setEditItem(null)}>Cancel</Btn>
        <Btn icon="check" onClick={() => setEditItem(null)}>Save Changes</Btn>
        </div>
        </>}
        </Modal>

        <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={() => deleteRow(deleteItem.id)}
        title="Delete Company" message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`} danger />
        </div>
  );
}

function StudentsPage() {
  const [rows, setRows] = useState(STUDENTS_ALL);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const filtered = rows.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (levelFilter !== "All Levels" && r.level !== levelFilter) return false;
    if (statusFilter !== "All Status" && r.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    return true;
  });

  const { page, setPage, totalPages, slice, total, perPage } = usePagination(filtered, 8);
  const toggleSuspend = (id) => setRows(rows.map(r => r.id === id ? { ...r, status: r.status === "suspended" ? "active" : "suspended" } : r));
  const deleteRow = (id) => { setRows(rows.filter(r => r.id !== id)); setDeleteItem(null); };

  return (
    <div>
    <SectionHeader title="Student Directory">
    <SearchBox placeholder="Search students..." value={search} onChange={v => { setSearch(v); setPage(1); }} />
    <FilterSelect options={["All Levels","Undergraduate","Masters","PhD"]} value={levelFilter} onChange={v => { setLevelFilter(v); setPage(1); }} />
    <FilterSelect options={["All Status","Active","Pending","Suspended"]} value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} />
    </SectionHeader>
    <Card>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead><tr>{["Student","Level","Applications","Joined","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
    <tbody>
    {slice.map(s => (
      <tr key={s.id}>
      <TD><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar text={initials(s.name)} size={32} radius="50%" bg={C.navyMid} />
      <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.name}</div>
      <div style={{ fontSize: 11, color: C.muted }}>{s.email}</div>
      </div>
      </div></TD>
      <TD><span style={{ fontSize: 12, color: C.muted }}>{s.level}</span></TD>
      <TD><span style={{ fontSize: 13, fontWeight: 600 }}>{s.apps}</span></TD>
      <TD><span style={{ fontSize: 12, color: C.muted }}>{s.joined}</span></TD>
      <TD><Badge status={s.status} /></TD>
      <TD><div style={{ display: "flex", gap: 4 }}>
      <IconBtn icon="eye" title="View" onClick={() => setViewItem(s)} />
      <IconBtn icon="lock" title={s.status === "suspended" ? "Unsuspend" : "Suspend"} onClick={() => toggleSuspend(s.id)} />
      <IconBtn icon="trash" title="Delete" onClick={() => setDeleteItem(s)} />
      </div></TD>
      </tr>
    ))}
    </tbody>
    </table>
    <Pagination page={page} totalPages={totalPages} total={total} perPage={perPage} label="students" onPageChange={setPage} />
    </Card>

    <ViewDrawer open={!!viewItem} onClose={() => setViewItem(null)} title="Student Profile">
    {viewItem && <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
      <Avatar text={initials(viewItem.name)} size={56} radius="50%" bg={C.navyMid} />
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginTop: 10 }}>{viewItem.name}</div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{viewItem.email}</div>
      <Badge status={viewItem.status} />
      </div>
      <DrawerField label="Education Level" value={viewItem.level} />
      <DrawerField label="Applications Submitted" value={viewItem.apps} />
      <DrawerField label="Member Since" value={viewItem.joined} />
      <DrawerField label="Status" value={viewItem.status.charAt(0).toUpperCase() + viewItem.status.slice(1)} />
      <div style={{ marginTop: 20 }}>
      <Btn variant="ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => setViewItem(null)}>Close</Btn>
      </div>
      </>}
      </ViewDrawer>

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={() => deleteRow(deleteItem.id)}
      title="Remove Student" message={`Are you sure you want to remove "${deleteItem?.name}"? This action cannot be undone.`} danger />
      </div>
  );
}

function JobsPage({ openModal }) {
  const [tab, setTab] = useState("jobs");
  const [search, setSearch] = useState("");
  const tabs = [{ id: "jobs", l: "Job Posts" }, { id: "programs", l: "Uni Programs" }, { id: "scholarships", l: "Scholarships" }];

  const filtered = JOBS_ALL.filter(j => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const { page, setPage, totalPages, slice, total, perPage } = usePagination(filtered, 8);

  return (
    <div>
    <div style={{ display: "flex", background: C.surfaceMid, borderRadius: 9, padding: 3, marginBottom: 16, border: `1px solid ${C.border}`, width: "fit-content" }}>
    {tabs.map(t => (
      <div key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 16px", textAlign: "center", fontSize: 12, fontWeight: 500, borderRadius: 7, cursor: "pointer", transition: "all 0.15s", background: tab === t.id ? C.white : "transparent", color: tab === t.id ? C.text : C.muted, boxShadow: tab === t.id ? "0 1px 4px rgba(15,23,42,0.08)" : "none" }}>{t.l}</div>
    ))}
    </div>
    <SectionHeader title={tabs.find(t => t.id === tab)?.l}>
    <SearchBox value={search} onChange={v => { setSearch(v); setPage(1); }} />
    <Btn icon="plus" onClick={() => openModal("job")}>Add New</Btn>
    </SectionHeader>
    <Card>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead><tr>{["Job Title","Company","Type","Salary","Deadline","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
    <tbody>
    {slice.map(j => (
      <tr key={j.id}>
      <TD><span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{j.title}</span></TD>
      <TD><span style={{ fontSize: 12, color: C.muted }}>{j.company}</span></TD>
      <TD><Badge status={j.type === "Internship" ? "pending" : "inactive"} /></TD>
      <TD><span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{j.salary}</span></TD>
      <TD><span style={{ fontSize: 12, color: C.muted }}>{j.deadline}</span></TD>
      <TD><Badge status={j.status} /></TD>
      <TD><div style={{ display: "flex", gap: 4 }}>
      <IconBtn icon="eye" title="View" />
      <IconBtn icon="pencil" title="Edit" />
      <IconBtn icon="trash" title="Delete" />
      </div></TD>
      </tr>
    ))}
    </tbody>
    </table>
    <Pagination page={page} totalPages={totalPages} total={total} perPage={perPage} label="jobs" onPageChange={setPage} />
    </Card>
    </div>
  );
}

function ApplicationsPage() {
  const [rows, setRows] = useState(APPLICATIONS_ALL);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewItem, setViewItem] = useState(null);
  const [confirmItem, setConfirmItem] = useState(null); // { item, action: "approve"|"reject" }

  const filtered = rows.filter(a => {
    if (search && !a.student.toLowerCase().includes(search.toLowerCase()) && !a.target.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "All Types" && a.type !== typeFilter) return false;
    if (statusFilter !== "All Status" && a.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    return true;
  });

  const { page, setPage, totalPages, slice, total, perPage } = usePagination(filtered, 8);

  const approve = (id) => {
    setRows(rows.map(r => r.id === id ? { ...r, status: "active" } : r));
    setConfirmItem(null);
    if (viewItem?.id === id) setViewItem(prev => ({ ...prev, status: "active" }));
  };
  const reject = (id) => {
    setRows(rows.map(r => r.id === id ? { ...r, status: "suspended" } : r));
    setConfirmItem(null);
    if (viewItem?.id === id) setViewItem(prev => ({ ...prev, status: "suspended" }));
  };

  // keep viewItem in sync with rows
  const liveView = viewItem ? rows.find(r => r.id === viewItem.id) : null;

  return (
    <div>
    <SectionHeader title="All Applications">
    <SearchBox value={search} onChange={v => { setSearch(v); setPage(1); }} />
    <FilterSelect options={["All Types","University","Job","Scholarship"]} value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }} />
    <FilterSelect options={["All Status","Pending","Active","Suspended"]} value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} />
    </SectionHeader>
    <Card>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead><tr>{["Student","Target","Type","Applied","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
    <tbody>
    {slice.map(a => {
      const live = rows.find(r => r.id === a.id) || a;
      return (
        <tr key={a.id}>
        <TD><span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.student}</span></TD>
        <TD><span style={{ fontSize: 12, color: C.muted }}>{a.target}</span></TD>
        <TD><Badge status={a.type === "University" ? "inactive" : "pending"} /></TD>
        <TD><span style={{ fontSize: 12, color: C.muted }}>{a.date}</span></TD>
        <TD><Badge status={live.status} /></TD>
        <TD><div style={{ display: "flex", gap: 4 }}>
        <IconBtn icon="eye" title="View" onClick={() => setViewItem(live)} />
        <IconBtn
        icon="check"
        title="Approve"
        onClick={() => live.status === "active"
          ? null
          : setConfirmItem({ item: live, action: "approve" })
        }
        />
        <IconBtn
        icon="x"
        title="Reject"
        onClick={() => live.status === "suspended"
          ? null
          : setConfirmItem({ item: live, action: "reject" })
        }
        />
        </div></TD>
        </tr>
      );
    })}
    </tbody>
    </table>
    <Pagination page={page} totalPages={totalPages} total={total} perPage={perPage} label="applications" onPageChange={setPage} />
    </Card>

    {/* View Drawer */}
    <ViewDrawer open={!!liveView} onClose={() => setViewItem(null)} title="Application Details">
    {liveView && <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
      <Avatar text={initials(liveView.student)} size={52} radius="50%" bg={C.navyMid} />
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginTop: 10 }}>{liveView.student}</div>
      <div style={{ marginTop: 6 }}><Badge status={liveView.status} /></div>
      </div>
      <DrawerField label="Applying To" value={liveView.target} />
      <DrawerField label="Application Type" value={liveView.type} />
      <DrawerField label="Date Applied" value={liveView.date} />
      <DrawerField label="Status" value={liveView.status.charAt(0).toUpperCase() + liveView.status.slice(1)} />
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
      <button
      onClick={() => liveView.status !== "active" && setConfirmItem({ item: liveView, action: "approve" })}
      disabled={liveView.status === "active"}
      style={{ flex: 1, height: 34, borderRadius: 8, border: "none", cursor: liveView.status === "active" ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 500, background: liveView.status === "active" ? C.surfaceMid : C.green, color: liveView.status === "active" ? C.muted : "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: liveView.status === "active" ? 0.6 : 1 }}>
      <Icon name="check" size={14} color={liveView.status === "active" ? C.muted : "#fff"} /> Approve
      </button>
      <button
      onClick={() => liveView.status !== "suspended" && setConfirmItem({ item: liveView, action: "reject" })}
      disabled={liveView.status === "suspended"}
      style={{ flex: 1, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, cursor: liveView.status === "suspended" ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 500, background: liveView.status === "suspended" ? C.surfaceMid : "transparent", color: liveView.status === "suspended" ? C.muted : "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: liveView.status === "suspended" ? 0.6 : 1 }}>
      <Icon name="x" size={14} color={liveView.status === "suspended" ? C.muted : "#ef4444"} /> Reject
      </button>
      </div>
      <Btn variant="ghost" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => setViewItem(null)}>Close</Btn>
      </>}
      </ViewDrawer>

      {/* Approve / Reject Confirm */}
      <ConfirmDialog
      open={!!confirmItem}
      onClose={() => setConfirmItem(null)}
      onConfirm={() => confirmItem?.action === "approve" ? approve(confirmItem.item.id) : reject(confirmItem.item.id)}
      title={confirmItem?.action === "approve" ? "Approve Application" : "Reject Application"}
      message={
        confirmItem?.action === "approve"
        ? `Approve ${confirmItem?.item.student}'s application to ${confirmItem?.item.target}?`
        : `Reject ${confirmItem?.item.student}'s application to ${confirmItem?.item.target}? This will mark it as suspended.`
      }
      danger={confirmItem?.action === "reject"}
      />
      </div>
  );
}

function AnalyticsPage() {
  const uniD = [{ l:"Sep",v:560 },{ l:"Oct",v:490 },{ l:"Nov",v:410 },{ l:"Dec",v:350 },{ l:"Jan",v:180 },{ l:"Feb",v:240 },{ l:"Mar",v:310 },{ l:"Apr",v:420 }];
  const jobD = [{ l:"Sep",v:540 },{ l:"Oct",v:480 },{ l:"Nov",v:420 },{ l:"Dec",v:410 },{ l:"Jan",v:240 },{ l:"Feb",v:370 },{ l:"Mar",v:230 },{ l:"Apr",v:510 }];
  return (
    <div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
    <StatCard label="Admission Rate" value="68%" trend="+4% vs last quarter" trendUp icon="building-community" />
    <StatCard label="Hiring Rate" value="42%" trend="+7% vs last quarter" trendUp icon="briefcase" />
    <StatCard label="Avg App / Student" value="2.7" trend="-0.2 vs last month" trendUp={false} icon="file-description" />
    <StatCard label="Scholarship Fill Rate" value="91%" trend="High demand" trendUp icon="graduation-cap" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
    <Card><div style={{ padding: 16 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>University Application Trend</div>
    <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Monthly applications to universities</div>
    <BarChart data={uniD} />
    </div></Card>
    <Card><div style={{ padding: 16 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>Job Application Trend</div>
    <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Monthly job applications</div>
    <BarChart data={jobD} />
    </div></Card>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    <Card><div style={{ padding: 16 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>Top Programs</div>
    <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Most applied university programs</div>
    <RankBar data={TOP_PROGRAMS} />
    </div></Card>
    <Card><div style={{ padding: 16 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>Top Companies</div>
    <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Most active hiring companies</div>
    <RankBar data={TOP_COMPANIES} />
    </div></Card>
    </div>
    </div>
  );
}

function NotificationsPage({ openModal }) {
  const notifs = [
    { icon: "check",              title: "System Update Complete",    msg: "Platform upgraded to v3.2.1 — new AI matching engine deployed", time: "2h ago" },
    { icon: "hourglass",          title: "48 Applications Pending",   msg: "Multiple applications awaiting admin review and approval", time: "4h ago" },
    { icon: "building-community", title: "New University Registered", msg: "Univ. of Copenhagen submitted account registration request", time: "1d ago" },
    { icon: "users",              title: "Student Milestone",         msg: "Platform reached 3,000+ registered students this week", time: "2d ago" },
  ];
  return (
    <div>
    <SectionHeader title="Notification Center">
    <Btn icon="speakerphone" onClick={() => openModal("notification")}>Send Announcement</Btn>
    </SectionHeader>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    <Card>
    <CardHeader title="Recent Notifications" />
    {notifs.map((n, i) => (
      <div key={i} style={{ display: "flex", gap: 12, padding: "14px 16px", borderTop: `1px solid ${C.border}` }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: C.surfaceMid, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon name={n.icon} size={17} color={C.muted} />
      </div>
      <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{n.title}</div>
      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{n.msg}</div>
      </div>
      <span style={{ fontSize: 11, color: C.light, flexShrink: 0 }}>{n.time}</span>
      </div>
    ))}
    </Card>
    <Card>
    <CardHeader title="Send Notification" />
    <div style={{ padding: 16 }}>
    <FG label="Target Audience"><select style={{ ...inputStyle, height: 36 }}>{["All Users","Students Only","Universities Only","Companies Only"].map(o => <option key={o}>{o}</option>)}</select></FG>
    <FG label="Type"><select style={{ ...inputStyle, height: 36 }}>{["Platform Announcement","Alert","Reminder","Update"].map(o => <option key={o}>{o}</option>)}</select></FG>
    <FG label="Title"><input style={inputStyle} placeholder="Notification title..." /></FG>
    <FG label="Message"><textarea style={{ ...inputStyle, height: 80, padding: "8px 12px", resize: "none" }} placeholder="Enter your message..." /></FG>
    <Btn icon="speakerphone" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>Send Notification</Btn>
    </div>
    </Card>
    </div>
    </div>
  );
}

function SecurityPage() {
  const roles = [
    { role: "Admin",      desc: "Full platform access",                    status: "active" },
    { role: "University", desc: "Programs, admissions, scholarships",       status: "pending" },
    { role: "Company",    desc: "Jobs, candidates, communication",          status: "pending" },
    { role: "Student",    desc: "Browse, apply, track",                     status: "inactive" },
  ];
  const logins = [
    { user: "Super Admin", ip: "192.168.1.1 — Chrome",  time: "Just now" },
    { user: "MIT Admin",   ip: "18.9.22.14 — Safari",   time: "1h ago" },
    { user: "Google HR",   ip: "74.125.68.1 — Chrome",  time: "2h ago" },
  ];
  return (
    <div>
    <SectionHeader title="Security & Access Control" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    <Card>
    <div style={{ padding: 20 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
    <Icon name="shield" size={15} color={C.muted} /> Role-Based Access Control
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {roles.map(r => (
      <div key={r.role} style={{ padding: "11px 14px", borderRadius: 9, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.role}</div>
      <div style={{ fontSize: 11, color: C.muted }}>{r.desc}</div>
      </div>
      <Badge status={r.status} />
      </div>
    ))}
    </div>
    </div>
    </Card>
    <Card>
    <div style={{ padding: 20 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
    <Icon name="log-in" size={15} color={C.muted} /> Recent Login Activity
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {logins.map(l => (
      <div key={l.user} style={{ padding: "10px 14px", borderRadius: 9, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{l.user}</div>
      <div style={{ fontSize: 11, color: C.muted }}>{l.ip}</div>
      </div>
      <span style={{ fontSize: 11, color: C.muted }}>{l.time}</span>
      </div>
    ))}
    </div>
    </div>
    </Card>
    </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div>
    <SectionHeader title="Platform Settings">
    <Btn icon="device-floppy">Save Changes</Btn>
    </SectionHeader>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    <Card>
    <div style={{ padding: 20 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 18 }}>General Settings</div>
    <FG label="Platform Name"><input style={inputStyle} defaultValue="Ovhijan" /></FG>
    <FG label="Admin Email"><input style={inputStyle} defaultValue="admin@educareer.ai" /></FG>
    <FG label="Default Language"><select style={{ ...inputStyle, height: 36 }}><option>English</option><option>Arabic</option><option>German</option></select></FG>
    <FG label="Time Zone"><select style={{ ...inputStyle, height: 36 }}><option>UTC+0</option><option>UTC+6 (Dhaka)</option><option>UTC-5 (EST)</option></select></FG>
    </div>
    </Card>
    <Card>
    <div style={{ padding: 20 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 18 }}>Application Settings</div>
    <FG label="Auto-approval GPA threshold"><input style={inputStyle} type="number" defaultValue="3.5" /></FG>
    <FG label="Max applications / student"><input style={inputStyle} type="number" defaultValue="10" /></FG>
    <FG label="Document verification"><select style={{ ...inputStyle, height: 36 }}><option>Yes — mandatory</option><option>No — optional</option></select></FG>
    <FG label="AI Matching Sensitivity"><select style={{ ...inputStyle, height: 36 }}><option>High (recommended)</option><option>Medium</option><option>Low</option></select></FG>
    </div>
    </Card>
    </div>
    </div>
  );
}

// ── SIDEBAR CONFIG ────────────────────────────────────────────────────────────
const NAV = [
  { section: "Overview", items: [
    { id: "dashboard",   icon: "layout-dashboard",  label: "Dashboard" },
    { id: "analytics",   icon: "chart-bar",          label: "Analytics" },
  ]},
{ section: "Management", items: [
  { id: "universities", icon: "building-community", label: "Universities", badge: "24" },
  { id: "companies",    icon: "building",           label: "Companies",    badge: "61" },
  { id: "students",     icon: "users",              label: "Students",     badge: "3.2k" },
  { id: "jobs",         icon: "briefcase",          label: "Jobs & Programs" },
  { id: "applications", icon: "file-description",   label: "Applications", badge: "48" },
]},
{ section: "System", items: [
  { id: "notifications", icon: "bell",    label: "Notifications" },
  { id: "security",      icon: "shield",  label: "Security & Access" },
  { id: "settings",      icon: "sliders", label: "Settings" },
]},
];

const PAGE_TITLE = {
  dashboard: "Dashboard", universities: "University Management", companies: "Company Management",
  students: "Student Directory", jobs: "Jobs & Programs", applications: "Applications",
  analytics: "Analytics", notifications: "Notifications", security: "Security & Access", settings: "Settings",
};
const PAGE_SUB = {
  dashboard: "Welcome back, Admin", universities: "Manage all university accounts",
  companies: "Manage company accounts", students: "Browse and manage students",
  jobs: "Job posts and academic programs", applications: "Track all applications",
  analytics: "Platform performance overview", notifications: "Messages and alerts",
  security: "Access control and audit logs", settings: "System configuration",
};
const MODALS = {
  university:   { title: "Add University",     Component: UniversityModal },
  company:      { title: "Add Company",        Component: CompanyModal },
  job:          { title: "Post New Job",       Component: JobModal },
  notification: { title: "Send Announcement", Component: NotificationModal },
  profile:      { title: "My Profile",        Component: ProfileModal },
};

// ── SIDEBAR COMPONENTS ────────────────────────────────────────────────────────
function SidebarLogout({ expanded }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    title={!expanded ? "Log out" : undefined}
    style={{ height: NAV_ITEM_H, display: "flex", alignItems: "center", cursor: "pointer", position: "relative", margin: "4px 0 2px" }}>
    <div style={{ position: "absolute", top: 4, bottom: 4, left: 8, right: 8, borderRadius: 9, background: hov ? "rgba(239,68,68,0.12)" : "transparent", transition: "background 0.15s", pointerEvents: "none" }} />
    <div style={{ width: SB_COLLAPSED, minWidth: SB_COLLAPSED, height: NAV_ITEM_H, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
    <Icon name="log-out" size={ICON_SIZE} color={hov ? "#ef4444" : "rgba(255,255,255,0.4)"} />
    </div>
    <div style={{ maxWidth: expanded ? 160 : 0, opacity: expanded ? 1 : 0, overflow: "hidden", whiteSpace: "nowrap", transition: "max-width 0.2s, opacity 0.15s, color 0.15s", fontSize: 13, fontWeight: 500, color: hov ? "#ef4444" : "rgba(255,255,255,0.5)", position: "relative", zIndex: 1 }}>
    Log out
    </div>
    </div>
  );
}

function NavItem({ item, active, expanded, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    title={!expanded ? item.label : undefined}
    style={{ width: "100%", height: NAV_ITEM_H, display: "flex", alignItems: "center", cursor: "pointer", position: "relative", padding: 0, margin: "1px 0", boxSizing: "border-box" }}>
    <div style={{ position: "absolute", top: 4, bottom: 4, left: 8, right: 8, borderRadius: 9, background: active ? "rgba(34,197,94,0.14)" : hov ? "rgba(255,255,255,0.06)" : "transparent", transition: "background 0.15s", pointerEvents: "none" }} />
    <div style={{ width: SB_COLLAPSED, minWidth: SB_COLLAPSED, height: NAV_ITEM_H, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
    <Icon name={item.icon} size={ICON_SIZE} color={active ? "#22c55e" : hov ? "#fff" : "rgba(255,255,255,0.55)"} />
    </div>
    <div style={{ display: "flex", alignItems: "center", flex: 1, overflow: "hidden", maxWidth: expanded ? 200 : 0, opacity: expanded ? 1 : 0, transition: "max-width 0.2s cubic-bezier(.4,0,.2,1), opacity 0.15s", whiteSpace: "nowrap", paddingRight: 12, position: "relative", zIndex: 1 }}>
    <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#22c55e" : hov ? "#fff" : "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.15s" }}>
    {item.label}
    </span>
    {item.badge && (
      <span style={{ background: active ? "#22c55e" : "rgba(255,255,255,0.1)", color: active ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10, marginLeft: 6, flexShrink: 0, lineHeight: "16px" }}>
      {item.badge}
      </span>
    )}
    </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [page,     setPage]     = useState("dashboard");
  const [expanded, setExpanded] = useState(false);
  const [modal,    setModal]    = useState(null);

  const openModal  = (type) => setModal(type);
  const closeModal = ()     => setModal(null);

  const renderPage = () => {
    switch (page) {
      case "dashboard":     return <DashboardPage setPage={setPage} openModal={openModal} />;
      case "universities":  return <UniversitiesPage openModal={openModal} />;
      case "companies":     return <CompaniesPage openModal={openModal} />;
      case "students":      return <StudentsPage />;
      case "jobs":          return <JobsPage openModal={openModal} />;
      case "applications":  return <ApplicationsPage />;
      case "analytics":     return <AnalyticsPage />;
      case "notifications": return <NotificationsPage openModal={openModal} />;
      case "security":      return <SecurityPage />;
      case "settings":      return <SettingsPage />;
      default:              return null;
    }
  };

  const modalDef = modal ? MODALS[modal] : null;
  const sidebarW = expanded ? SB_EXPANDED : SB_COLLAPSED;
  const mainLeft = sidebarW + SB_GAP * 2;

  return (
    <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

    <div style={{ height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.surface, color: C.text, overflow: "hidden", position: "relative" }}>

    {/* ── FLOATING PILL SIDEBAR ── */}
    <nav
    onMouseEnter={() => setExpanded(true)}
    onMouseLeave={() => setExpanded(false)}
    style={{ position: "fixed", top: `${SB_GAP}px`, left: `${SB_GAP}px`, bottom: `${SB_GAP}px`, width: `${sidebarW}px`, background: "#0a0f1e", borderRadius: 16, zIndex: 100, display: "flex", flexDirection: "column", transition: "width 0.22s cubic-bezier(.4,0,.2,1)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.28)" }}
    >
    {/* Logo */}
    <div style={{ height: 72, flexShrink: 0, display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingLeft: `${(SB_COLLAPSED - 36) / 2}px`, overflow: "hidden" }}>
    <img src="./images/logo.png" alt="Ovhijan" style={{ width: 36, height: 36, minWidth: 36, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
    <div style={{ overflow: "hidden", maxWidth: expanded ? 160 : 0, opacity: expanded ? 1 : 0, transition: "max-width 0.2s, opacity 0.15s", whiteSpace: "nowrap", marginLeft: 10 }}>
    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>Ovhijan</div>
    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.7px" }}>Admin Portal</div>
    </div>
    </div>

    {/* Nav sections */}
    <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "6px 0", scrollbarWidth: "none" }}>
    {NAV.map(sec => (
      <div key={sec.section}>
      <div style={{ height: expanded ? 26 : 0, overflow: "hidden", transition: "height 0.18s", display: "flex", alignItems: "center", paddingLeft: `${SB_COLLAPSED + 2}px`, marginTop: expanded ? 4 : 0 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>{sec.section}</span>
      </div>
      {sec.items.map(item => (
        <NavItem key={item.id} item={item} active={page === item.id} expanded={expanded} onClick={() => setPage(item.id)} />
      ))}
      </div>
    ))}
    </div>

    {/* Footer */}
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, overflow: "hidden" }}>
    <SidebarLogout expanded={expanded} />
    <div
    onClick={() => openModal("profile")}
    title={!expanded ? "My Profile" : undefined}
    style={{ borderTop: "1px solid rgba(255,255,255,0.06)", height: 60, display: "flex", alignItems: "center", cursor: "pointer", paddingLeft: `${(SB_COLLAPSED - 36) / 2}px`, transition: "background 0.15s" }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
    <div style={{ minWidth: 36, width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px solid rgba(34,197,94,0.3)" }}>
    <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>SA</span>
    </div>
    <div style={{ overflow: "hidden", maxWidth: expanded ? 140 : 0, opacity: expanded ? 1 : 0, transition: "max-width 0.2s, opacity 0.15s", whiteSpace: "nowrap", marginLeft: 10, flex: 1 }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Super Admin</div>
    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>admin@educareer.ai</div>
    </div>
    <div style={{ maxWidth: expanded ? 20 : 0, opacity: expanded ? 0.4 : 0, transition: "max-width 0.2s, opacity 0.15s", overflow: "hidden", marginRight: expanded ? 10 : 0, flexShrink: 0 }}>
    <Icon name="pencil" size={13} color="#fff" />
    </div>
    </div>
    </div>
    </nav>

    {/* ── MAIN AREA ── */}
    <div style={{ position: "absolute", top: 0, left: mainLeft, right: 0, bottom: 0, display: "flex", flexDirection: "column", overflow: "hidden", transition: "left 0.22s cubic-bezier(.4,0,.2,1)" }}>
    {/* Topbar */}
    <header style={{ height: 56, background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0 }}>
    <div style={{ flex: 1 }}>
    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{PAGE_TITLE[page]}</span>
    <span style={{ fontSize: 12, color: C.muted, fontWeight: 400, marginLeft: 8 }}>{PAGE_SUB[page]}</span>
    </div>
    <SearchBox placeholder="Search anything..." width={200} />
    <Btn icon="plus" onClick={() => openModal("university")}>Quick Add</Btn>
    <button onClick={() => setPage("notifications")}
    style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
    <Icon name="bell" size={16} color={C.muted} />
    <span style={{ width: 7, height: 7, background: C.green, borderRadius: "50%", position: "absolute", top: 6, right: 6, border: "1.5px solid white" }} />
    </button>
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>SA</span>
    </div>
    </header>

    {/* Page content */}
    <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
    {renderPage()}
    </div>
    </div>

    {/* ── MODAL ── */}
    {modal && modalDef && (
      <Modal open onClose={closeModal} title={modalDef.title}>
      <modalDef.Component onClose={closeModal} />
      </Modal>
    )}
    </div>
    </>
  );
}
