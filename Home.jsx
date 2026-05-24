// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import ukImg from "../images/uk.jpg";
import gmImg from "../images/germany.jpg";
import caImg from "../images/canada.jpg";
import auImg from "../images/australia.jpg";
import frImg from "../images/france.jpg";
import nlImg from "../images/netherlands.jpg";
import spImg from "../images/spain.jpg";
import itImg from "../images/itali.jpeg";
import usImg from "../images/usa.jpg";
import irImg from "../images/ireland.jpg";
import swImg from "../images/sweden.jpg";
import jpImg from "../images/japan.jpg";

// Professional Premium Icons
const GlobeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 16.8 15.2 15 13 15H5C2.8 15 1 16.8 1 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M23 21V19C22.9 17.1 21.7 15.6 20 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 3.13C17.7 3.58 19 5.13 19 7C19 8.87 17.7 10.42 16 10.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AwardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PlaneIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RocketIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15L9 12M12 15L15 12M12 15V21M9 12L14 7M9 12H3M15 12H21M14 7L12 2L10 7L14 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 21V7L12 3L19 7V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 17H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ScholarshipIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 7H22L17 11L19 18L12 14.5L5 18L7 11L2 7H9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const vantaEffect = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [visibleCounters, setVisibleCounters] = useState({});
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Counter animation refs
  const countersRef = useRef([]);

  // List of 12 countries for the grid
  const countries = [
    { name: "United Kingdom", flag: "🇺🇸", programs: 124, image: ukImg, city: "London", rating: 4.8, universities: 45, tuition: "£15,000" },
    { name: "Germany", flag: "🇩🇪", programs: 98, image: gmImg, city: "Berlin", rating: 4.7, universities: 38, tuition: "€1,500" },
    { name: "Canada", flag: "🇨🇦", programs: 112, image: caImg, city: "Toronto", rating: 4.9, universities: 42, tuition: "CAD 35,000" },
    { name: "Australia", flag: "🇦🇺", programs: 87, image: auImg, city: "Sydney", rating: 4.8, universities: 36, tuition: "AUD 38,000" },
    { name: "France", flag: "🇫🇷", programs: 76, image: frImg, city: "Paris", rating: 4.6, universities: 32, tuition: "€2,500" },
    { name: "Netherlands", flag: "🇳🇱", programs: 65, image: nlImg, city: "Amsterdam", rating: 4.7, universities: 28, tuition: "€8,000" },
    { name: "Spain", flag: "🇪🇸", programs: 71, image: spImg, city: "Madrid", rating: 4.6, universities: 34, tuition: "€6,000" },
    { name: "Italy", flag: "🇮🇹", programs: 68, image: itImg, city: "Rome", rating: 4.7, universities: 30, tuition: "€4,000" },
    { name: "USA", flag: "🇺🇸", programs: 156, image: usImg, city: "New York", rating: 4.9, universities: 52, tuition: "$45,000" },
    { name: "Ireland", flag: "🇮🇪", programs: 54, image: irImg, city: "Dublin", rating: 4.8, universities: 24, tuition: "€12,000" },
    { name: "Sweden", flag: "🇸🇪", programs: 48, image: swImg, city: "Stockholm", rating: 4.7, universities: 22, tuition: "SEK 130,000" },
    { name: "Japan", flag: "🇯🇵", programs: 62, image: jpImg, city: "Tokyo", rating: 4.9, universities: 26, tuition: "¥800,000" }
  ];
  
  // Statistics data
  const statistics = [
    { id: 1, value: 200, label: "Partner Universities", suffix: "+", prefix: "", color: "#22c55e" },
    { id: 2, value: 12, label: "Countries", suffix: "", prefix: "", color: "#3b82f6" },
    { id: 3, value: 8.5, label: "Avg. Semester Cost", suffix: "k", prefix: "$", color: "#f59e0b" },
    { id: 4, value: 98, label: "Student Satisfaction", suffix: "%", prefix: "", color: "#8b5cf6" }
  ];

  // How It Works steps with premium icons
  const howItWorksSteps = [
    {
      title: "Explore Your Options",
      description: "Browse 200+ programs based on your goals, interests, and dream destinations with our intelligent matching system.",
      action: "Browse Programs",
      icon: GlobeIcon,
      color: "#22c55e",
      bgColor: "#22c55e10",
      stats: "200+ Programs"
    },
    {
      title: "Pick a Program",
      description: "Choose the best-fit program with expert guidance from our advisors and real student insights.",
      action: "Talk to Advisor",
      icon: UsersIcon,
      color: "#3b82f6",
      bgColor: "#3b82f610",
      stats: "98% Success Rate"
    },
    {
      title: "Submit Application",
      description: "Complete your application with our streamlined process and track progress easily online.",
      action: "Apply Now",
      icon: AwardIcon,
      color: "#f59e0b",
      bgColor: "#f59e0b10",
      stats: "2-4 Week Process"
    },
    {
      title: "Prepare to Travel",
      description: "Get comprehensive visa help, document preparation, and pre-departure orientation.",
      action: "Get Support",
      icon: PlaneIcon,
      color: "#8b5cf6",
      bgColor: "#8b5cf610",
      stats: "Visa Success 95%"
    },
    {
      title: "Start Your Journey",
      description: "Travel abroad confidently and begin your new academic life with our ongoing support.",
      action: "Join Now",
      icon: RocketIcon,
      color: "#ec4899",
      bgColor: "#ec489910",
      stats: "24/7 Support"
    }
  ];

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Counter animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.getAttribute('data-id'));
            setVisibleCounters(prev => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.5 }
    );

    countersRef.current.forEach((counter) => {
      if (counter) observer.observe(counter);
    });

    return () => observer.disconnect();
  }, []);

  // Animated Counter Component
  const AnimatedCounter = ({ value, suffix = "", prefix = "", id }) => {
    const [count, setCount] = useState(0);
    const isVisible = visibleCounters[id];

    useEffect(() => {
      if (isVisible) {
        let start = 0;
        const duration = 2000;
        const increment = value / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        return () => clearInterval(timer);
      }
    }, [isVisible, value]);

    return <span>{prefix}{count.toFixed(value % 1 === 0 ? 0 : 1)}{suffix}</span>;
  };

  // Initialize Vanta Globe effect
  useEffect(() => {
    const loadScripts = async () => {
      if (!window.THREE) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      if (!window.VANTA) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      if (window.VANTA && heroRef.current && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.GLOBE({
          el: heroRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x22c55e,
          backgroundColor: 0x0f172a,
          size: 0.9
        });
      }
    };

    loadScripts();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      background: "#ffffff",
      color: "#0f172a",
      overflowX: "hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: scrolled ? "12px 60px" : "18px 60px",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.05)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: scrolled ? "rgba(15,23,42,0.98)" : "rgba(15,23,42,0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 1000,
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.1)" : "none"
        }}
      >
        <motion.div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >
          {/* LOGO IMAGE */}
          <motion.img
            src="/src/images/logo.png"
            alt="Ovijan Logo"
            style={{
              width: 50,
              height: 40,
              borderRadius: 12,
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              marginTop: "-12px",
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

        <ul style={{
          display: "flex",
          gap: 36,
          listStyle: "none",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#e2e8f0",
          fontWeight: 500
        }}>
          {["Destinations", "How it Works", "About", "Contact"].map((i, idx) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ cursor: "pointer", transition: "color 0.2s", position: "relative" }}
              whileHover={{ color: "#22c55e" }}
            >
              {i}
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  height: 2,
                  background: "#22c55e",
                  borderRadius: 2
                }}
              />
            </motion.li>
          ))}
        </ul>

        <div style={{ display: "flex", gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn-outline-light"
            onClick={() => navigate("/login")}
          >
            Login
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
            onClick={() => navigate("/signup")}
          >
            SignUp →
          </motion.button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        style={{
          padding: "160px 20px 180px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <motion.div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 900,
            margin: "0 auto",
            opacity,
            scale
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-block",
              background: "rgba(34,197,94,0.15)",
              backdropFilter: "blur(10px)",
              padding: "8px 20px",
              borderRadius: 100,
              marginBottom: 24,
              border: "1px solid rgba(34,197,94,0.3)"
            }}
          >
            <span style={{ color: "#22c55e", fontSize: 14, fontWeight: 600 }}>✨ Global Education Made Accessible</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(48px, 8vw, 82px)",
              fontWeight: 800,
              marginBottom: 24,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "white",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)"
            }}
          >
            Study Abroad for{" "}
            <span style={{
              color: "#22c55e",
              position: "relative",
              display: "inline-block"
            }}>
              Everyone
              <motion.svg
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ position: "absolute", bottom: -8, left: 0 }}
                viewBox="0 0 200 8"
                fill="none"
              >
                <path d="M0 5C50 8 150 8 200 5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
              </motion.svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              maxWidth: 650,
              margin: "0 auto",
              fontSize: 18,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.6
            }}
          >
            Quality education, incredible destinations—your dream study abroad program, for less.
            Cut the cost, not the experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ marginTop: 40, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="btn-hero"
            >
              Find a Program →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="btn-hero-outline"
              style={{
                background: "transparent",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "white",
                padding: "14px 32px",
                borderRadius: 40,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              Watch Video ▶
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: 60,
              display: "flex",
              gap: 32,
              justifyContent: "center",
              flexWrap: "wrap"
            }}
          >
            {["Trusted by 50,000+ Students", "200+ University Partners", "98% Satisfaction Rate"].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#22c55e", fontSize: 20 }}>✓</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* PREMIUM FEATURES SECTION */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 32,
        maxWidth: 1280,
        margin: "-60px auto 60px",
        position: "relative",
        zIndex: 20,
        padding: "0 24px"
      }}>
        {[
          {
            gifSrc: "/src/icons/graduation-hat-diploma.gif",
            title: "Scholarship Assistance",
            description: "Access to exclusive scholarships worth up to $50,000",
            color: "#22c55e"
          },
          {
            gifSrc: "/src/icons/university.gif",
            title: "Top Universities",
            description: "Partnerships with 200+ prestigious institutions",
            color: "#3b82f6"
          },
          {
            gifSrc: "/src/icons/helpdesk.gif",
            title: "End-to-End Support",
            description: "From application to graduation, we're with you every step",
            color: "#f59e0b"
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{
              y: -4,
              scale: 1.01,
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            style={{
              background: "white",
              borderRadius: 28,
              padding: "32px",
              textAlign: "center",
              boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
              transition: "box-shadow 0.15s ease-out, border-color 0.15s ease-out",
              cursor: "pointer"
            }}
            whileTap={{ scale: 0.99 }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                margin: "0 auto 24px",
                background: `${feature.color}15`,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.15s ease-out"
              }}
            >
              <img
                src={feature.gifSrc}
                alt={feature.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 20
                }}
              />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: "#0f172a" }}>
              {feature.title}
            </h3>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6 }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </section>

      {/* COUNTRIES GRID SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{
          padding: "100px 60px",
          background: "#ffffff",
          position: "relative"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 600,
          background: "radial-gradient(circle at 80% 20%, rgba(34,197,94,0.02) 0%, transparent 60%)",
          pointerEvents: "none"
        }} />

        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #22c55e10 0%, #16a34a10 100%)",
              color: "#22c55e",
              padding: "8px 20px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20
            }}
          >
            🌍 12 Countries • 200+ Programs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              fontSize: 48,
              fontWeight: 800,
              marginBottom: 16,
              letterSpacing: "-0.02em",
              color: "#0f172a"
            }}
          >
            Top Study Destinations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ color: "#64748b", fontSize: 18, maxWidth: 600, margin: "0 auto" }}
          >
            Choose from our curated list of world-class destinations
          </motion.p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 28,
          maxWidth: 1400,
          margin: "0 auto"
        }}>
          {countries.map((country, idx) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.03 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              onHoverStart={() => setHoveredCountry(idx)}
              onHoverEnd={() => setHoveredCountry(null)}
              style={{
                background: "white",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: hoveredCountry === idx ? "0 30px 40px -20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid rgba(0,0,0,0.05)"
              }}
            >
              <div style={{
                height: 200,
                backgroundImage: `url(${country.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative"
              }}>
                <motion.div
                  animate={{ opacity: hoveredCountry === idx ? 0.85 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, #22c55e, #16a34a)`,
                    opacity: 0
                  }}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: hoveredCountry === idx ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    padding: "12px 20px",
                    borderRadius: 50,
                    fontWeight: 700,
                    color: "#22c55e",
                    whiteSpace: "nowrap"
                  }}
                >
                  Explore Programs →
                </motion.div>
                <span style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontSize: 32,
                  background: "rgba(255,255,255,0.95)",
                  width: 52,
                  height: 52,
                  borderRadius: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  {country.flag}
                </span>
                <div style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  background: "rgba(0,0,0,0.75)",
                  backdropFilter: "blur(4px)",
                  padding: "4px 12px",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}>
                  <span style={{ color: "#fbbf24", fontSize: 12 }}>★</span>
                  <span style={{ color: "white", fontSize: 12, fontWeight: 600 }}>{country.rating}</span>
                </div>
              </div>
              <div style={{ padding: "20px 20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 0 }}>{country.name}</h3>
                  <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>{country.universities} Uni</span>
                </div>
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 12 }}>{country.city}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12 }}>
                  <div>
                    <motion.p
                      animate={{ color: hoveredCountry === idx ? "#22c55e" : "#475569" }}
                      style={{ fontSize: 32, fontWeight: 800, marginBottom: 0 }}
                    >
                      {country.programs}+
                    </motion.p>
                    <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 500 }}>Programs</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 0 }}>{country.tuition}</p>
                    <p style={{ color: "#94a3b8", fontSize: 11 }}>Avg. Tuition</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="btn-primary"
            style={{ padding: "14px 36px", fontSize: 15, fontWeight: 600 }}
          >
            View All Destinations →
          </motion.button>
        </motion.div>
      </motion.section>

      {/* HOW IT WORKS SECTION - PROFESSIONAL EDITION */}
      <section id="how-it-works" style={{
        padding: "120px 24px",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.4,
          pointerEvents: "none"
        }} />

        <div style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 600,
          background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0) 70%)",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(34,197,94,0.1)",
              backdropFilter: "blur(8px)",
              padding: "4px 16px 4px 12px",
              borderRadius: 100,
              marginBottom: 24
            }}>
              <div style={{
                width: 8,
                height: 8,
                background: "#22c55e",
                borderRadius: "50%",
                boxShadow: "0 0 0 3px rgba(34,197,94,0.2)"
              }} />
              <span style={{ color: "#166534", fontSize: 13, fontWeight: 600, letterSpacing: "0.5px" }}>
                STRATEGIC FRAMEWORK
              </span>
            </div>

            <h2 style={{
              fontSize: "clamp(36px, 5vw, 52px)",
              fontWeight: 700,
              marginBottom: 20,
              letterSpacing: "-0.02em",
              color: "#0a0f1c",
              lineHeight: 1.2
            }}>
              Your Path to Global Success
            </h2>

            <p style={{
              color: "#475569",
              fontSize: 18,
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6
            }}>
              A data-driven approach combining AI intelligence with human expertise
            </p>
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 20,
            marginBottom: 48
          }}>
            {[
              {
                id: 0,
                title: "AI Profile Analysis",
                subtitle: "Personalized Intelligence",
                description: "Advanced AI analyzes your academic background, work experience, and career goals to calculate your exact success probability for target universities or employers.",
                stats: "Success Probability",
                statValue: "87%",
                statSubtext: "Based on 50+ data points",
                icon: "AI",
                color: "#22c55e",
                bgGradient: "linear-gradient(135deg, #22c55e15 0%, #16a34a15 100%)",
                metric: "95% Accuracy Rate"
              },
              {
                id: 1,
                title: "Strategic Roadmap",
                subtitle: "Visa & Documentation",
                description: "Country-specific visa guidance, real-time application tracking integrated with official portals, and professional document templates validated by immigration experts.",
                stats: "Documents",
                statValue: "25+",
                statSubtext: "Ready-to-use templates",
                icon: "Document",
                color: "#3b82f6",
                bgGradient: "linear-gradient(135deg, #3b82f615 0%, #2563eb15 100%)",
                metric: "98% Approval Rate"
              },
              {
                id: 2,
                title: "Integration Suite",
                subtitle: "Jobs, Housing & Finance",
                description: "Verified international job board with direct apply, curated housing listings, cost-of-living comparison across 200+ cities, and intelligent budget planning tools.",
                stats: "Coverage",
                statValue: "50+",
                statSubtext: "Countries supported",
                icon: "Integration",
                color: "#f59e0b",
                bgGradient: "linear-gradient(135deg, #f59e0b15 0%, #d9770615 100%)",
                metric: "10,000+ Listings"
              },
              {
                id: 3,
                title: "Expert Guidance",
                subtitle: "Mentorship & Practice",
                description: "Access verified mentors who've successfully navigated their own journey. AI-powered interview simulations with real-time feedback on answers, tone, and delivery.",
                stats: "Mentors",
                statValue: "1,200+",
                statSubtext: "Global network",
                icon: "Mentor",
                color: "#8b5cf6",
                bgGradient: "linear-gradient(135deg, #8b5cf615 0%, #7c3aed15 100%)",
                metric: "4.9/5 Rating"
              },
              {
                id: 4,
                title: "Success Management",
                subtitle: "Tracking & Outcomes",
                description: "Interactive timeline with automated reminders, real-time visa status updates, scholarship matching engine, and community success stories for continuous motivation.",
                stats: "Success Rate",
                statValue: "94%",
                statSubtext: "Of users achieve goals",
                icon: "Success",
                color: "#ec489a",
                bgGradient: "linear-gradient(135deg, #ec489a15 0%, #db277715 100%)",
                metric: "25,000+ Placed"
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                onHoverStart={() => setActiveStep(idx)}
                onHoverEnd={() => setActiveStep(null)}
                style={{
                  background: activeStep === idx ? "#ffffff" : "#ffffff",
                  borderRadius: 20,
                  padding: "28px 20px",
                  transition: "all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                  boxShadow: activeStep === idx
                    ? "0 20px 40px -16px rgba(0,0,0,0.15), 0 0 0 1px rgba(34,197,94,0.2)"
                    : "0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)",
                  border: "none",
                  position: "relative",
                  cursor: "pointer"
                }}
              >
                {idx < 4 && (
                  <div style={{
                    position: "absolute",
                    top: 60,
                    right: -20,
                    width: 40,
                    height: 2,
                    background: "linear-gradient(90deg, #cbd5e1 0%, #cbd5e1 50%, transparent 100%)",
                    zIndex: 0
                  }} />
                )}

                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  background: step.bgGradient,
                  color: step.color,
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 20,
                  fontFamily: "monospace"
                }}>
                  {(idx + 1).toString().padStart(2, '0')}
                </div>

                <div style={{ marginBottom: 24 }}>
                  {step.icon === "AI" && (
                    <div style={{
                      width: 64,
                      height: 64,
                      margin: "0 auto",
                      borderRadius: 16,
                      overflow: "hidden",
                      background: `linear-gradient(135deg, ${step.color}10 0%, ${step.color}20 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <img
                        src="/src/icons/ai-assistant.gif"
                        alt="AI Assistant"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  )}
                  {step.icon === "Document" && (
                    <div style={{
                      width: 64,
                      height: 64,
                      margin: "0 auto",
                      borderRadius: 16,
                      overflow: "hidden",
                      background: `linear-gradient(135deg, ${step.color}10 0%, ${step.color}20 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <img
                        src="/src/icons/roadmap.gif"
                        alt="Roadmap"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  )}
                  {step.icon === "Integration" && (
                    <div style={{
                      width: 64,
                      height: 64,
                      margin: "0 auto",
                      borderRadius: 16,
                      overflow: "hidden",
                      background: `linear-gradient(135deg, ${step.color}10 0%, ${step.color}20 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <img
                        src="/src/icons/integrity.gif"
                        alt="Integration"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  )}
                  {step.icon === "Mentor" && (
                    <div style={{
                      width: 64,
                      height: 64,
                      margin: "0 auto",
                      borderRadius: 16,
                      overflow: "hidden",
                      background: `linear-gradient(135deg, ${step.color}10 0%, ${step.color}20 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <img
                        src="/src/icons/customer-support.gif"
                        alt="Mentor"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  )}
                  {step.icon === "Success" && (
                    <div style={{
                      width: 64,
                      height: 64,
                      margin: "0 auto",
                      borderRadius: 16,
                      overflow: "hidden",
                      background: `linear-gradient(135deg, ${step.color}10 0%, ${step.color}20 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <img
                        src="/src/icons/award.gif"
                        alt="Success"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  )}
                </div>

                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 4,
                  color: "#0a0f1c"
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: step.color,
                  marginBottom: 16,
                  letterSpacing: "0.3px"
                }}>
                  {step.subtitle}
                </p>

                <p style={{
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.55,
                  marginBottom: 20
                }}>
                  {step.description}
                </p>

                <div style={{
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: 16,
                  marginTop: 8
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 4
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.3px" }}>
                      {step.stats}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: step.color }}>
                      {step.statValue}
                    </span>
                  </div>
                  <div style={{
                    height: 3,
                    background: "#e2e8f0",
                    borderRadius: 3,
                    overflow: "hidden"
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: step.statValue.replace(/[^0-9]/g, '') + '%' }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      style={{
                        height: "100%",
                        background: step.color,
                        borderRadius: 3,
                        width: step.statValue.replace(/[^0-9]/g, '') + '%'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 8 }}>
                    {step.statSubtext}
                  </p>
                </div>

                <div style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: step.bgGradient,
                  padding: "8px 12px",
                  borderRadius: 12
                }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    background: step.color,
                    borderRadius: "50%"
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: step.color }}>
                    {step.metric}
                  </span>
                </div>

                {(idx === 0 || idx === 4) && (
                  <motion.div
                    whileHover={{ x: 4 }}
                    style={{
                      marginTop: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: step.color,
                      cursor: "pointer"
                    }}
                  >
                    <span>{idx === 0 ? "Calculate your score →" : "Start your journey →"}</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            style={{
              marginTop: 48,
              paddingTop: 32,
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "center",
              gap: 48,
              flexWrap: "wrap"
            }}
          >
            {[
              { label: "Active Users", value: "50,000+", icon: "👥" },
              { label: "Success Rate", value: "94%", icon: "⭐" },
              { label: "Partner Institutions", value: "300+", icon: "🏛️" },
              { label: "Countries Covered", value: "45+", icon: "🌍" }
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#0a0f1c" }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding: "100px 20px",
        textAlign: "center",
        background: "#ffffff",
        position: "relative"
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "60px 48px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: 48,
            position: "relative",
            overflow: "hidden"
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              background: "radial-gradient(circle, rgba(34,197,94,0.2), transparent)",
              borderRadius: "50%"
            }}
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{
              position: "absolute",
              bottom: -50,
              left: -50,
              width: 250,
              height: 250,
              background: "radial-gradient(circle, rgba(34,197,94,0.15), transparent)",
              borderRadius: "50%"
            }}
          />

          <h2 style={{ fontSize: "clamp(32px, 5vw, 42px)", marginBottom: 16, color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ color: "#cbd5e1", marginBottom: 32, fontSize: 18, maxWidth: 500, margin: "0 auto 32px" }}>
            Join 50,000+ students who have already taken the leap toward their global education dreams.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="btn-gold"
              style={{ background: "#22c55e", color: "white", padding: "16px 40px" }}
            >
              Get Started Free →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "transparent",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "white",
                padding: "16px 40px",
                borderRadius: 40,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Schedule Consultation
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "60px 60px 40px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 48,
        background: "#f8fafc",
        borderTop: "1px solid #e2e8f0"
      }}>
        <div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: 20
            }}>O</div>
            <h3 style={{ fontSize: 20, fontWeight: 700 }}>Ovijan</h3>
          </motion.div>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, maxWidth: 250 }}>
            Making global education accessible for everyone.
          </p>
        </div>
        {[
          { title: "Explore", links: ["Destinations", "Programs", "Scholarships", "Study Guide"] },
          { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
          { title: "Resources", links: ["FAQs", "Student Stories", "Visa Guide", "Help Center"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"] }
        ].map((section, i) => (
          <div key={i}>
            <h4 style={{ marginBottom: 20, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a" }}>
              {section.title}
            </h4>
            {section.links.map(link => (
              <motion.p
                key={link}
                whileHover={{ x: 4, color: "#22c55e" }}
                style={{ marginBottom: 12, color: "#64748b", cursor: "pointer", fontSize: 14, transition: "all 0.2s" }}
              >
                {link}
              </motion.p>
            ))}
          </div>
        ))}
      </footer>

      <style>{`
        .btn-primary {
          padding: 10px 24px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
          font-size: 14px;
        }
        .btn-primary:hover {
          box-shadow: 0 8px 25px rgba(34,197,94,0.4);
        }

        .btn-outline-light {
          padding: 10px 24px;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          color: white;
          font-size: 14px;
        }
        .btn-outline-light:hover {
          border-color: #22c55e;
          background: rgba(34,197,94,0.1);
        }

        .btn-hero {
          padding: 16px 40px;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 700;
          font-size: 16px;
        }
        .btn-hero:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(34,197,94,0.4);
        }

        .btn-gold {
          padding: 14px 32px;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 15px;
        }
        .btn-gold:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(34,197,94,0.4);
        }

        @media (max-width: 1024px) {
          nav { padding: 12px 24px !important; }
          footer { padding: 40px 24px !important; }
        }
        @media (max-width: 768px) {
          nav ul { display: none; }
          .btn-outline-light { display: none; }
          footer { grid-template-columns: 1fr; text-align: center; }
        }
      `}</style>
    </div>
  );
}

export default Home;