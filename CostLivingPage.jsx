import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  DollarSign,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Globe,
  Home,
  Loader,
  CheckCircle,
  Coffee,
  Bus,
  Wifi,
  Heart,
  Star,
  ArrowRight,
  Award,
  BarChart3,
  Shield,
  Sparkles,
  Compass,
  Building2,
  Wallet,
  PiggyBank,
  Zap,
  Crown,
  Target,
  ChevronRight,
  Navigation,
  Leaf,
  TreePine,
  Sprout,
  ThumbsUp,
  Flag,
  Rocket,
  ZoomIn,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons based on affordability level
const createCustomIcon = (affordabilityRatio, isSelected = false) => {
  let markerColor = "red";
  let colorCode = "#ef4444";

  if (affordabilityRatio >= 120) {
    markerColor = "green";
    colorCode = "#10b981";
  } else if (affordabilityRatio >= 100) {
    markerColor = "gold";
    colorCode = "#f59e0b";
  } else if (affordabilityRatio >= 80) {
    markerColor = "orange";
    colorCode = "#f97316";
  } else {
    markerColor = "red";
    colorCode = "#ef4444";
  }

  const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`;

  return new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    className: isSelected ? `selected-marker-${markerColor}` : "",
  });
};

// Smooth map controller
const MapController = ({ center, zoom, selectedCityId }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center.lat && center.lng && map) {
      map.flyTo([center.lat, center.lng], zoom || 12, {
        duration: 1.8,
        easeLinearity: 0.5,
        animate: true
      });

      if (selectedCityId) {
        setTimeout(() => {
          const currentZoom = map.getZoom();
          if (currentZoom < 14) {
            map.setZoom(currentZoom + 0.5);
            setTimeout(() => map.setZoom(currentZoom), 300);
          }
        }, 1800);
      }
    }
  }, [center, map, zoom, selectedCityId]);

  return null;
};

const API_BASE_URL = "http://localhost:8000/api";

// Skeleton Components
const SkeletonCard = () => (
  <div style={styles.skeletonCard}>
    <div style={styles.skeletonHeader}>
      <div style={styles.skeletonAvatar} />
      <div style={styles.skeletonLine} />
    </div>
    <div style={styles.skeletonStats}>
      <div style={styles.skeletonStat}>
        <div style={styles.skeletonLineShort} />
        <div style={styles.skeletonLineMedium} />
      </div>
      <div style={styles.skeletonStat}>
        <div style={styles.skeletonLineShort} />
        <div style={styles.skeletonLineMedium} />
      </div>
    </div>
    <div style={styles.skeletonProgress} />
    <div style={styles.skeletonFooter}>
      <div style={styles.skeletonBadge} />
      <div style={styles.skeletonLineSmall} />
    </div>
  </div>
);

const SkeletonMap = () => (
  <div style={styles.skeletonMap}>
    <div style={styles.skeletonMapContent}>
      <TreePine size={60} color="#d1d5db" />
      <div style={styles.skeletonMapText} />
      <div style={styles.skeletonMapTextSmall} />
    </div>
  </div>
);

const SkeletonCountryCard = () => (
  <div style={styles.skeletonCountryCard}>
    <div style={styles.skeletonCountryHeader}>
      <div style={styles.skeletonFlag} />
      <div>
        <div style={styles.skeletonLineMedium} />
        <div style={styles.skeletonLineSmall} />
      </div>
    </div>
    <div style={styles.skeletonCountryStats}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={styles.skeletonCountryStat}>
          <div style={styles.skeletonLineTiny} />
          <div style={styles.skeletonLineSmall} />
        </div>
      ))}
    </div>
  </div>
);

const CostLivingPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [budget, setBudget] = useState("");
  const [scholarship, setScholarship] = useState("");
  const [partTimeIncome, setPartTimeIncome] = useState("");
  const [lifestyle, setLifestyle] = useState("moderate");
  const [recommendedCities, setRecommendedCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [costBreakdown, setCostBreakdown] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 0 });
  const [mapZoom, setMapZoom] = useState(2);
  const [countries, setCountries] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [savingCalculation, setSavingCalculation] = useState(false);
  const [activeTab, setActiveTab] = useState("map");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCountryData, setSelectedCountryData] = useState(null);
  const [showCountryGrid, setShowCountryGrid] = useState(false);
  const [showCurrencySymbol, setShowCurrencySymbol] = useState(true);
  const [allCities, setAllCities] = useState([]);

  // Lifestyle multipliers
  const lifestyleMultipliers = {
    budget: 0.8,
    moderate: 1.0,
    luxury: 1.3
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/countries`);
      const data = await response.json();

      let countriesData = [];
      if (Array.isArray(data)) {
        countriesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        countriesData = data.data;
      }

      setCountries(countriesData);

      if (countriesData.length > 0 && !selectedCountry) {
        setSelectedCountry(countriesData[0].id.toString());
      }

    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchCitiesByCountry = async (countryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cities?country_id=${countryId}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setAllCities(data.data);
        return data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  };

  const analyzeBudget = async () => {
    if (!budget) {
      alert("Please enter your monthly budget");
      return;
    }

    if (!selectedCountry) {
      alert("Please select a country");
      return;
    }

    setLoading(true);

    try {
      // First fetch cities for the selected country
      const cities = await fetchCitiesByCountry(parseInt(selectedCountry));

      if (cities.length === 0) {
        alert("No cities found for selected country");
        setLoading(false);
        return;
      }

      // Calculate total monthly income based on lifestyle
      const monthlyBudgetAmount = parseFloat(budget) || 0;
      const scholarshipAmount = parseFloat(scholarship) || 0;
      const partTimeAmount = parseFloat(partTimeIncome) || 0;
      const baseTotal = monthlyBudgetAmount + scholarshipAmount + partTimeAmount;
      const totalMonthlyIncome = baseTotal * lifestyleMultipliers[lifestyle];

      // Calculate affordability for each city
      const citiesWithAnalysis = cities.map(city => {
        const totalExpenses = city.rent_shared_room + city.food_monthly +
          city.transport_monthly_pass + city.utilities_monthly;
        const monthlySavings = totalMonthlyIncome - totalExpenses;
        const affordabilityRatio = (totalMonthlyIncome / totalExpenses) * 100;

        let status = "";
        let color = "";
        let recommendation = "";
        let rating = 0;

        if (affordabilityRatio >= 120) {
          status = "Excellent";
          color = "#10b981";
          recommendation = "Highly recommended - comfortable living with good savings";
          rating = 5;
        } else if (affordabilityRatio >= 100) {
          status = "Good";
          color = "#f59e0b";
          recommendation = "Recommended - you can manage within your budget";
          rating = 4;
        } else if (affordabilityRatio >= 80) {
          status = "Moderate";
          color = "#f97316";
          recommendation = "Possible with careful budgeting";
          rating = 3;
        } else {
          status = "Risky";
          color = "#ef4444";
          recommendation = "Not recommended - expenses exceed income";
          rating = 2;
        }

        return {
          ...city,
          totalExpenses,
          monthlySavings,
          affordabilityRatio,
          status,
          color,
          recommendation,
          rating,
          totalMonthlyIncome,
        };
      });

      // Sort by affordability ratio (best first)
      const sortedCities = citiesWithAnalysis.sort((a, b) =>
        b.affordabilityRatio - a.affordabilityRatio
      );

      // Take top 8 cities
      const topCities = sortedCities.slice(0, 8);
      setRecommendedCities(topCities);

      if (topCities.length > 0) {
        setSelectedCity(topCities[0]);
        setCostBreakdown(topCities[0]);

        if (topCities[0].latitude && topCities[0].longitude) {
          setMapCenter({ lat: topCities[0].latitude, lng: topCities[0].longitude });
          setMapZoom(12);
        }
      }

      setAnalysisResult({
        total_monthly_income: totalMonthlyIncome,
        monthly_budget: monthlyBudgetAmount,
        scholarship: scholarshipAmount,
        part_time_income: partTimeAmount,
        lifestyle: lifestyle,
        total_cities_analyzed: cities.length
      });

      const selectedCountryInfo = countries.find(c => c.id === parseInt(selectedCountry));
      setSelectedCountryData(selectedCountryInfo);
      setShowCountryGrid(true);
      setShowCurrencySymbol(true);
      setActiveTab("map");

      if (isAuthenticated) {
        await saveCalculation({
          selected_country_id: parseInt(selectedCountry),
          monthly_budget_usd: monthlyBudgetAmount,
          scholarship_usd: scholarshipAmount,
          part_time_hours: 20,
          savings_usd: topCities[0]?.monthlySavings || 0,
          results_json: JSON.stringify(topCities),
        });
      }

    } catch (error) {
      console.error("Error analyzing budget:", error);
      alert("Error analyzing budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveCalculation = async (calculationData) => {
    setSavingCalculation(true);
    try {
      const token = localStorage.getItem("auth_token");
      await fetch(`${API_BASE_URL}/budget/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(calculationData),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    } finally {
      setSavingCalculation(false);
    }
  };

  const getCurrentCurrencySymbol = () => {
    if (recommendedCities.length > 0 && recommendedCities[0].currency_symbol) {
      return recommendedCities[0].currency_symbol;
    }
    return "$";
  };

  const getMotivationalMessage = (ratio) => {
    if (ratio >= 120) return { text: "Excellent! You're on fire! 🔥", icon: <Rocket size={20} /> };
    if (ratio >= 100) return { text: "Great! You've got this! 💪", icon: <ThumbsUp size={20} /> };
    if (ratio >= 80) return { text: "Keep going! Almost there! 🌱", icon: <Sprout size={20} /> };
    return { text: "Don't give up! Explore options! 🌟", icon: <Star size={20} /> };
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setCostBreakdown(city);
    setShowCurrencySymbol(true);

    if (city.latitude && city.longitude) {
      setMapCenter({ lat: city.latitude, lng: city.longitude });
      setMapZoom(14);
    }

    setActiveTab("map");
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGradient} />
      <div style={styles.bgPattern} />

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerBadge}>
            <Leaf size={16} />
            <span>Sustainable Living Analysis</span>
          </div>
          <h1 style={styles.title}>
            Smart Cost of Living Planner
          </h1>
          <p style={styles.subtitle}>
            Make informed decisions with AI-powered cost analysis and personalized recommendations
          </p>
        </div>

        {/* Main Grid */}
        <div style={styles.mainGrid}>
          {/* Left Sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <div style={styles.sidebarIcon}>
                <Wallet size={24} color="#059669" />
              </div>
              <h2 style={styles.sidebarTitle}>Your Financial Profile</h2>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Globe size={16} />
                Destination Country
              </label>
              <select
                style={styles.select}
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setShowCurrencySymbol(true);
                  const country = countries.find(c => c.id === parseInt(e.target.value));
                  if (country) {
                    setSelectedCountryData(country);
                    setShowCountryGrid(true);
                  }
                }}
              >
                <option value="">Select a country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <DollarSign size={16} />
                Monthly Budget
              </label>
              <div style={styles.inputWrapper}>
                {showCurrencySymbol && (
                  <span style={styles.currencySymbol}>$</span>
                )}
                <input
                  type="number"
                  placeholder="Enter your monthly budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <GraduationCap size={16} />
                Scholarship (Monthly)
              </label>
              <div style={styles.inputWrapper}>
                {showCurrencySymbol && (
                  <span style={styles.currencySymbol}>$</span>
                )}
                <input
                  type="number"
                  placeholder="Enter scholarship amount"
                  value={scholarship}
                  onChange={(e) => setScholarship(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Briefcase size={16} />
                Part-Time Income
              </label>
              <div style={styles.inputWrapper}>
                {showCurrencySymbol && (
                  <span style={styles.currencySymbol}>$</span>
                )}
                <input
                  type="number"
                  placeholder="Enter part-time income"
                  value={partTimeIncome}
                  onChange={(e) => setPartTimeIncome(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Target size={16} />
                Lifestyle Preference
              </label>
              <div style={styles.lifestyleOptions}>
                {[
                  { value: "budget", label: "Budget", icon: <PiggyBank size={16} />, color: "#10b981" },
                  { value: "moderate", label: "Moderate", icon: <Zap size={16} />, color: "#f59e0b" },
                  { value: "luxury", label: "Luxury", icon: <Crown size={16} />, color: "#8b5cf6" },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setLifestyle(option.value)}
                    style={{
                      ...styles.lifestyleOption,
                      background: lifestyle === option.value ? option.color + "15" : "transparent",
                      borderColor: lifestyle === option.value ? option.color : "#e2e8f0",
                      color: lifestyle === option.value ? option.color : "#64748b",
                    }}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                    <span style={{ fontSize: "10px", opacity: 0.7 }}></span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={analyzeBudget}
              disabled={loading || !selectedCountry}
              style={{
                ...styles.analyzeButton,
                opacity: (!selectedCountry || loading) ? 0.6 : 1,
                cursor: (!selectedCountry || loading) ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <Loader size={20} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze My Future
                </>
              )}
            </button>

            {savingCalculation && (
              <div style={styles.savingIndicator}>
                <Loader size={14} style={{ animation: "spin 1s linear infinite" }} />
                Saving your calculation...
              </div>
            )}
          </div>

          {/* Right Content */}
          <div style={styles.rightContent}>
            {/* Stats Overview */}
            {loading ? (
              <div style={styles.statsGrid}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={styles.skeletonStatCard}>
                    <div style={styles.skeletonStatIcon} />
                    <div>
                      <div style={styles.skeletonLineSmall} />
                      <div style={styles.skeletonLineMedium} />
                    </div>
                  </div>
                ))}
              </div>
            ) : analysisResult && (
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: "#d1fae5", color: "#059669" }}>
                    <PiggyBank size={20} />
                  </div>
                  <div>
                    <p style={styles.statLabel}>Total Monthly Income</p>
                    <p style={styles.statValue}>
                      ${Math.round(analysisResult.total_monthly_income || 0)}
                    </p>
                    <p style={styles.statSubtext}>
                      Budget + Scholarship + Part-time × {lifestyleMultipliers[lifestyle]}x
                    </p>
                  </div>
                </div>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: "#d1fae5", color: "#059669" }}>
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <p style={styles.statLabel}>Cities Analyzed</p>
                    <p style={styles.statValue}>{analysisResult.total_cities_analyzed || 0}</p>
                  </div>
                </div>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: "#d1fae5", color: "#059669" }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <p style={styles.statLabel}>Best Match</p>
                    <p style={styles.statValue}>{recommendedCities[0]?.city_name || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Country Highlight Card */}
            {loading && !selectedCountryData ? (
              <SkeletonCountryCard />
            ) : selectedCountryData && showCountryGrid && (
              <div id="country-grid" style={styles.countryHighlight}>
                <div style={styles.countryHighlightHeader}>
                  <div style={styles.countryFlagIcon}>
                    <Flag size={32} color="#059669" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.countryName}>{selectedCountryData.name}</h3>
                    <p style={styles.countryDescription}>
                      {selectedCountryData.name} offers excellent opportunities for international students
                    </p>
                  </div>
                </div>
                <div style={styles.countryStats}>
                  <div style={styles.countryStat}>
                    <span style={styles.countryStatLabel}>Total Cities</span>
                    <span style={styles.countryStatValue}>{allCities.length || "Loading..."}</span>
                  </div>
                  <div style={styles.countryStat}>
                    <span style={styles.countryStatLabel}>Avg Rent</span>
                    <span style={styles.countryStatValue}>
                      ${allCities.length > 0 ? Math.round(allCities.reduce((sum, c) => sum + c.rent_shared_room, 0) / allCities.length) : "..."}
                    </span>
                  </div>
                  <div style={styles.countryStat}>
                    <span style={styles.countryStatLabel}>Avg Food</span>
                    <span style={styles.countryStatValue}>
                      ${allCities.length > 0 ? Math.round(allCities.reduce((sum, c) => sum + c.food_monthly, 0) / allCities.length) : "..."}
                    </span>
                  </div>
                  <div style={styles.countryStat}>
                    <span style={styles.countryStatLabel}>Min Wage</span>
                    <span style={styles.countryStatValue}>
                      ${allCities.length > 0 ? Math.round(Math.min(...allCities.map(c => c.part_time_hourly_wage_avg))) : "..."}/hr
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div style={styles.tabNav}>
              <button
                onClick={() => setActiveTab("map")}
                style={{ ...styles.tabButton, ...(activeTab === "map" ? styles.tabButtonActive : {}) }}
              >
                <Navigation size={16} />
                Interactive Map
              </button>
              <button
                onClick={() => setActiveTab("cities")}
                style={{ ...styles.tabButton, ...(activeTab === "cities" ? styles.tabButtonActive : {}) }}
              >
                <Building2 size={16} />
                Top Cities
              </button>
            </div>

            {/* Map Section */}
            {activeTab === "map" && (
              <div style={styles.mapCard}>
                <div style={styles.legend}>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendDot, background: "#10b981" }} />
                    <span>Excellent (120%+)</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendDot, background: "#f59e0b" }} />
                    <span>Good (100-120%)</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendDot, background: "#f97316" }} />
                    <span>Moderate (80-100%)</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendDot, background: "#ef4444" }} />
                    <span>Risky (&lt;80%)</span>
                  </div>
                </div>

                {loading ? (
                  <SkeletonMap />
                ) : recommendedCities.length > 0 ? (
                  <MapContainer
                    key={`map-${mapCenter.lat}-${mapCenter.lng}`}
                    center={[mapCenter.lat, mapCenter.lng]}
                    zoom={mapZoom}
                    style={styles.map}
                    zoomControl={true}
                    scrollWheelZoom={true}
                    zoomAnimation={true}
                    fadeAnimation={true}
                    markerZoomAnimation={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <MapController center={mapCenter} zoom={mapZoom} selectedCityId={selectedCity?.id} />

                    {recommendedCities.map((city) => {
                      if (!city.latitude || !city.longitude) return null;

                      return (
                        <Marker
                          key={city.id}
                          position={[city.latitude, city.longitude]}
                          icon={createCustomIcon(city.affordabilityRatio, selectedCity?.id === city.id)}
                          eventHandlers={{
                            click: () => handleCityClick(city),
                          }}
                        >
                          <Popup>
                            <div style={styles.popupContent}>
                              <h3 style={styles.popupTitle}>{city.city_name}</h3>
                              <p style={styles.popupCountry}>
                                {countries.find(c => c.id === city.country_id)?.name || ""}
                              </p>
                              <div style={styles.popupStatus}>
                                <span style={{ ...styles.statusBadge, background: city.color + "20", color: city.color }}>
                                  {city.status}
                                </span>
                              </div>
                              <p style={styles.popupCost}>
                                ${Math.round(city.totalExpenses)}
                                <span style={styles.popupCostPeriod}>/month</span>
                              </p>
                              <p style={styles.popupSavings}>
                                Savings: ${Math.round(city.monthlySavings)}/month
                              </p>
                              <div style={styles.popupProgress}>
                                <div style={{ ...styles.popupProgressBar, width: `${Math.min(city.affordabilityRatio, 150)}%`, background: city.color }} />
                              </div>
                              <button
                                onClick={() => {
                                  handleCityClick(city);
                                  document.getElementById("cost-breakdown")?.scrollIntoView({ behavior: "smooth" });
                                }}
                                style={styles.popupButton}
                              >
                                View Details <ChevronRight size={14} />
                              </button>
                            </div>
                          </Popup>
                          <Tooltip permanent={false} direction="top" offset={[0, -20]}>
                            <div style={{ fontWeight: "600", color: city.color }}>
                              {city.city_name} - {Math.round(city.affordabilityRatio)}%
                            </div>
                          </Tooltip>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                ) : (
                  <div style={styles.mapPlaceholder}>
                    <TreePine size={60} color="rgba(255,255,255,0.3)" />
                    <p style={styles.mapPlaceholderText}>
                      Enter your budget and click "Analyze My Future" to see city recommendations
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Top Cities Section */}
            {activeTab === "cities" && (
              loading ? (
                <div style={styles.citiesGrid}>
                  {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : recommendedCities.length > 0 && (
                <div style={styles.citiesGrid}>
                  {recommendedCities.map((city, index) => (
                    <div
                      key={city.id || index}
                      onClick={() => handleCityClick(city)}
                      onMouseEnter={() => setHoveredCard(city.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        ...styles.cityCard,
                        ...(selectedCity?.id === city.id ? styles.cityCardSelected : {}),
                        ...(hoveredCard === city.id ? styles.cityCardHovered : {}),
                      }}
                    >
                      <div style={styles.cityCardHeader}>
                        <div>
                          <div style={styles.cityCardTitle}>
                            <h3>{city.city_name}</h3>
                            {index === 0 && <Star size={14} color="#fbbf24" fill="#fbbf24" />}
                          </div>
                          <p style={styles.cityCardCountry}>
                            {countries.find(c => c.id === city.country_id)?.name || ""}
                          </p>
                        </div>
                        <div style={{ ...styles.affordabilityBadge, background: city.color + "20" }}>
                          <span style={{ color: city.color }}>{Math.round(city.affordabilityRatio)}%</span>
                        </div>
                      </div>

                      <div style={styles.cityCardStats}>
                        <div>
                          <p style={styles.cityCardLabel}>Monthly Expenses</p>
                          <p style={styles.cityCardValue}>
                            ${Math.round(city.totalExpenses)}
                          </p>
                        </div>
                        <div>
                          <p style={styles.cityCardLabel}>Monthly Savings</p>
                          <p style={{ ...styles.cityCardValue, color: city.monthlySavings >= 0 ? "#059669" : "#ef4444" }}>
                            ${Math.round(city.monthlySavings)}
                          </p>
                        </div>
                      </div>

                      <div style={styles.progressBar}>
                        <div
                          style={{
                            width: `${Math.min(city.affordabilityRatio, 150)}%`,
                            background: city.color,
                            height: "4px",
                            borderRadius: "2px",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>

                      <div style={styles.cityCardFooter}>
                        <span style={{ ...styles.statusBadgeSmall, background: city.color + "20", color: city.color }}>
                          {city.status}
                        </span>
                        <span style={styles.affordabilityText}>
                          {Math.round(city.affordabilityRatio)}% affordable
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Cost Breakdown Section */}
            {loading ? (
              <div style={styles.skeletonBreakdownCard}>
                <div style={styles.skeletonBreakdownHeader}>
                  <div>
                    <div style={styles.skeletonLineLarge} />
                    <div style={styles.skeletonLineSmall} />
                  </div>
                  <div style={styles.skeletonRating} />
                </div>
                <div style={styles.skeletonBreakdownGrid}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={styles.skeletonBreakdownItem}>
                      <div style={styles.skeletonBreakdownItemHeader} />
                      <div style={styles.skeletonLineMedium} />
                      <div style={styles.skeletonLineSmall} />
                    </div>
                  ))}
                </div>
                <div style={styles.skeletonSummary}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={styles.skeletonSummaryItem}>
                      <div style={styles.skeletonLineTiny} />
                      <div style={styles.skeletonLineMedium} />
                    </div>
                  ))}
                </div>
              </div>
            ) : costBreakdown && (
              <div id="cost-breakdown" style={styles.breakdownCard}>
                <div style={styles.breakdownHeader}>
                  <div>
                    <h2 style={styles.breakdownTitle}>
                      📊 Cost Breakdown - {costBreakdown.city_name}
                    </h2>
                    <p style={styles.breakdownSubtitle}>
                      Based on shared accommodation and {lifestyle} lifestyle ({lifestyleMultipliers[lifestyle]}x multiplier)
                    </p>
                  </div>
                  <div style={styles.overallRating}>
                    <div style={{ ...styles.ratingCircle, borderColor: costBreakdown.color }}>
                      <span style={{ ...styles.ratingText, color: costBreakdown.color }}>
                        {Math.round(costBreakdown.affordabilityRatio)}%
                      </span>
                    </div>
                    <p style={styles.ratingLabel}>Affordability</p>
                  </div>
                </div>

                <div style={styles.breakdownGrid}>
                  <div style={styles.breakdownItem}>
                    <div style={styles.breakdownItemHeader}>
                      <Home size={18} color="#059669" />
                      <span>Shared Room Rent</span>
                    </div>
                    <p style={styles.breakdownAmount}>
                      ${costBreakdown.rent_shared_room}
                    </p>
                    <p style={styles.breakdownTip}>💡 Consider areas 15-20 mins from city center</p>
                  </div>
                  <div style={styles.breakdownItem}>
                    <div style={styles.breakdownItemHeader}>
                      <Coffee size={18} color="#059669" />
                      <span>Food & Groceries</span>
                    </div>
                    <p style={styles.breakdownAmount}>
                      ${costBreakdown.food_monthly}
                    </p>
                    <p style={styles.breakdownTip}>🍳 Cook at home to save 40-50%</p>
                  </div>
                  <div style={styles.breakdownItem}>
                    <div style={styles.breakdownItemHeader}>
                      <Bus size={18} color="#059669" />
                      <span>Transportation</span>
                    </div>
                    <p style={styles.breakdownAmount}>
                      ${costBreakdown.transport_monthly_pass}
                    </p>
                    <p style={styles.breakdownTip}>🎫 Get student discount pass</p>
                  </div>
                  <div style={styles.breakdownItem}>
                    <div style={styles.breakdownItemHeader}>
                      <Wifi size={18} color="#059669" />
                      <span>Utilities + Internet</span>
                    </div>
                    <p style={styles.breakdownAmount}>
                      ${costBreakdown.utilities_monthly}
                    </p>
                    <p style={styles.breakdownTip}>👥 Split with roommates</p>
                  </div>
                </div>

                {analysisResult && (
                  <div style={styles.motivationCard}>
                    <div style={styles.motivationIcon}>
                      {getMotivationalMessage(costBreakdown.affordabilityRatio).icon}
                    </div>
                    <p style={styles.motivationText}>
                      {getMotivationalMessage(costBreakdown.affordabilityRatio).text}
                    </p>
                  </div>
                )}

                <div style={styles.summarySection}>
                  <div style={styles.summaryItem}>
                    <p style={styles.summaryLabel}>Monthly Income</p>
                    <p style={styles.summaryValue}>
                      ${Math.round(costBreakdown.totalMonthlyIncome)}
                    </p>
                  </div>
                  <div style={styles.summaryItem}>
                    <p style={styles.summaryLabel}>Monthly Expenses</p>
                    <p style={{ ...styles.summaryValue, color: "#dc2626" }}>
                      ${Math.round(costBreakdown.totalExpenses)}
                    </p>
                  </div>
                  <div style={styles.summaryItem}>
                    <p style={styles.summaryLabel}>Monthly Savings</p>
                    <p style={{ ...styles.summaryValue, color: costBreakdown.monthlySavings >= 0 ? "#059669" : "#ef4444" }}>
                      ${Math.round(costBreakdown.monthlySavings)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCityClick(costBreakdown)}
                  style={styles.viewOnMapButton}
                >
                  <MapPin size={16} />
                  View on Map
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes skeleton-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          .leaflet-container {
            border-radius: 16px;
            font-family: inherit;
          }
          .selected-marker-green {
            filter: drop-shadow(0 0 8px rgba(16,185,129,0.8));
            animation: pulse 0.5s ease-in-out 2;
          }
          .selected-marker-gold {
            filter: drop-shadow(0 0 8px rgba(245,158,11,0.8));
            animation: pulse 0.5s ease-in-out 2;
          }
          .selected-marker-orange {
            filter: drop-shadow(0 0 8px rgba(249,115,22,0.8));
            animation: pulse 0.5s ease-in-out 2;
          }
          .selected-marker-red {
            filter: drop-shadow(0 0 8px rgba(239,68,68,0.8));
            animation: pulse 0.5s ease-in-out 2;
          }
          .leaflet-marker-icon {
            transition: all 0.3s ease;
          }
          .leaflet-marker-icon:hover {
            transform: scale(1.1);
            transition: transform 0.2s ease;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    position: "relative",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    overflowX: "hidden",
  },
  bgGradient: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)",
    zIndex: 0,
  },
  bgPattern: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    zIndex: 0,
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "32px 24px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  headerBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(5,150,105,0.9)",
    backdropFilter: "blur(10px)",
    padding: "6px 16px",
    borderRadius: "100px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: "20px",
  },
  title: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#064e3b",
    marginBottom: "16px",
    letterSpacing: "-0.02em",
  },
  titleIcon: {
    marginLeft: "12px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#065f46",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: "24px",
  },
  sidebar: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    height: "fit-content",
    position: "sticky",
    top: "24px",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "2px solid #ecfdf5",
  },
  sidebarIcon: {
    width: "40px",
    height: "40px",
    background: "#ecfdf5",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#064e3b",
    margin: 0,
  },
  formGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#065f46",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #d1fae5",
    fontSize: "14px",
    fontWeight: "500",
    color: "#064e3b",
    background: "#ffffff",
    outline: "none",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1.5px solid #d1fae5",
    borderRadius: "12px",
    padding: "0 16px",
    background: "#ffffff",
    transition: "all 0.2s",
  },
  currencySymbol: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#059669",
  },
  input: {
    width: "100%",
    padding: "12px 0",
    border: "none",
    outline: "none",
    fontSize: "14px",
    fontWeight: "500",
    color: "#064e3b",
  },
  lifestyleOptions: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
  },
  lifestyleOption: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "10px",
    border: "1.5px solid #d1fae5",
    borderRadius: "12px",
    background: "transparent",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  analyzeButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "transform 0.2s, box-shadow 0.2s",
    marginTop: "8px",
  },
  savingIndicator: {
    marginTop: "12px",
    textAlign: "center",
    fontSize: "12px",
    color: "#059669",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  rightContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#064e3b",
  },
  statSubtext: {
    fontSize: "10px",
    color: "#6b7280",
    marginTop: "4px",
  },
  countryHighlight: {
    background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "2px solid #10b981",
  },
  countryHighlightHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  countryFlagIcon: {
    width: "60px",
    height: "60px",
    background: "#ecfdf5",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  countryName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#064e3b",
    margin: "0 0 4px 0",
  },
  countryDescription: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },
  countryStats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #d1fae5",
  },
  countryStat: {
    textAlign: "center",
  },
  countryStatLabel: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "4px",
  },
  countryStatValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#059669",
  },
  tabNav: {
    display: "flex",
    gap: "12px",
    background: "#ffffff",
    padding: "6px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  tabButton: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "12px",
    background: "transparent",
    fontSize: "14px",
    fontWeight: "600",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabButtonActive: {
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    color: "#ffffff",
  },
  mapCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  },
  legend: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
    padding: "10px",
    background: "#f8fafc",
    borderRadius: "12px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#475569",
  },
  legendDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  map: {
    height: "500px",
    width: "100%",
    borderRadius: "16px",
    zIndex: 1,
  },
  mapPlaceholder: {
    height: "500px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #064e3b, #059669)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  mapPlaceholderText: {
    color: "#ffffff",
    marginTop: "16px",
    textAlign: "center",
    maxWidth: "300px",
  },
  popupContent: {
    padding: "16px",
    minWidth: "260px",
  },
  popupTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#064e3b",
    margin: "0 0 4px 0",
  },
  popupCountry: {
    fontSize: "12px",
    color: "#6b7280",
    margin: "0 0 12px 0",
  },
  popupStatus: {
    marginBottom: "12px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },
  popupCost: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#064e3b",
    margin: "0 0 4px 0",
  },
  popupCostPeriod: {
    fontSize: "12px",
    fontWeight: "normal",
    color: "#6b7280",
  },
  popupSavings: {
    fontSize: "13px",
    color: "#059669",
    fontWeight: "500",
    margin: "0 0 10px 0",
  },
  popupProgress: {
    background: "#e5e7eb",
    borderRadius: "4px",
    height: "6px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  popupProgressBar: {
    height: "100%",
    transition: "width 0.3s ease",
  },
  popupButton: {
    width: "100%",
    padding: "8px 16px",
    background: "#059669",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  citiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "16px",
  },
  cityCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.3s",
    border: "2px solid transparent",
    position: "relative",
  },
  cityCardSelected: {
    borderColor: "#059669",
    background: "#ecfdf5",
  },
  cityCardHovered: {
    transform: "translateY(-4px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
  },
  cityCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "16px",
  },
  cityCardTitle: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "4px",
  },
  affordabilityBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  cityCardCountry: {
    fontSize: "12px",
    color: "#6b7280",
  },
  cityCardStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  cityCardLabel: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "4px",
  },
  cityCardValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#064e3b",
  },
  progressBar: {
    background: "#e5e7eb",
    borderRadius: "2px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  cityCardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadgeSmall: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },
  affordabilityText: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#6b7280",
  },

  breakdownCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  },
  breakdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  breakdownTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#064e3b",
    margin: "0 0 8px 0",
  },
  breakdownSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },
  overallRating: {
    textAlign: "center",
  },
  ratingCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "3px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  ratingText: {
    fontSize: "22px",
    fontWeight: "700",
  },
  ratingLabel: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#6b7280",
  },
  breakdownGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "28px",
  },
  breakdownItem: {
    padding: "16px",
    background: "#f0fdf4",
    borderRadius: "16px",
  },
  breakdownItemHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#064e3b",
    marginBottom: "12px",
  },
  breakdownAmount: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#064e3b",
    margin: "0 0 8px 0",
  },
  breakdownTip: {
    fontSize: "11px",
    color: "#6b7280",
    margin: 0,
  },
  motivationCard: {
    background: "linear-gradient(135deg, #fef3c7, #fde68a)",
    padding: "16px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  motivationIcon: {
    fontSize: "24px",
  },
  motivationText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#92400e",
    margin: 0,
  },
  summarySection: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    paddingTop: "20px",
    borderTop: "2px solid #ecfdf5",
    marginBottom: "20px",
  },
  summaryItem: {
    textAlign: "center",
  },
  summaryLabel: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "6px",
  },
  summaryValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#064e3b",
  },
  viewOnMapButton: {
    width: "100%",
    padding: "12px",
    background: "#059669",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "8px",
    transition: "all 0.2s",
  },
  // Skeleton Styles
  skeletonStatCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  skeletonStatIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    background: "#e5e7eb",
    animation: "skeleton-pulse 1.5s ease-in-out infinite",
  },
  skeletonCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    animation: "skeleton-pulse 1.5s ease-in-out infinite",
  },
  skeletonHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  skeletonAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#e5e7eb",
  },
  skeletonLine: {
    height: "20px",
    width: "60%",
    background: "#e5e7eb",
    borderRadius: "4px",
  },
  skeletonLineShort: {
    height: "12px",
    width: "40%",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "8px",
  },
  skeletonLineMedium: {
    height: "18px",
    width: "80%",
    background: "#e5e7eb",
    borderRadius: "4px",
  },
  skeletonLineLarge: {
    height: "24px",
    width: "70%",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "8px",
  },
  skeletonLineSmall: {
    height: "10px",
    width: "50%",
    background: "#e5e7eb",
    borderRadius: "4px",
  },
  skeletonLineTiny: {
    height: "8px",
    width: "60%",
    background: "#e5e7eb",
    borderRadius: "4px",
  },
  skeletonStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  skeletonStat: {
    textAlign: "center",
  },
  skeletonProgress: {
    height: "4px",
    background: "#e5e7eb",
    borderRadius: "2px",
    marginBottom: "12px",
  },
  skeletonFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skeletonBadge: {
    width: "60px",
    height: "20px",
    background: "#e5e7eb",
    borderRadius: "20px",
  },
  skeletonMap: {
    height: "500px",
    borderRadius: "16px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonMapContent: {
    textAlign: "center",
  },
  skeletonMapText: {
    width: "200px",
    height: "16px",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginTop: "16px",
  },
  skeletonMapTextSmall: {
    width: "150px",
    height: "12px",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginTop: "8px",
  },
  skeletonCountryCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    border: "2px solid #e5e7eb",
    animation: "skeleton-pulse 1.5s ease-in-out infinite",
  },
  skeletonCountryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  skeletonFlag: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#e5e7eb",
  },
  skeletonCountryStats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
  skeletonCountryStat: {
    textAlign: "center",
  },
  skeletonBreakdownCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    animation: "skeleton-pulse 1.5s ease-in-out infinite",
  },
  skeletonBreakdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  skeletonRating: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#e5e7eb",
  },
  skeletonBreakdownGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "28px",
  },
  skeletonBreakdownItem: {
    padding: "16px",
    background: "#f8fafc",
    borderRadius: "16px",
  },
  skeletonBreakdownItemHeader: {
    width: "60%",
    height: "16px",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "12px",
  },
  skeletonSummary: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    paddingTop: "20px",
    borderTop: "2px solid #e5e7eb",
  },
  skeletonSummaryItem: {
    textAlign: "center",
  },
};

export default CostLivingPage;