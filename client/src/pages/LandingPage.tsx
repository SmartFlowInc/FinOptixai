import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  BarChart2, 
  Layers, 
  Users, 
  Shield, 
  ArrowRight, 
  LineChart, 
  BarChart, 
  PieChart,
  Workflow,
  Globe,
  Lightbulb,
  CheckCircle,
  Zap,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const LandingPage = () => {
  const [_, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      // Update active section based on scroll position
      const sections = ['home', 'features', 'benefits', 'testimonials', 'pricing'];
      const sectionElements = sections.map(id => document.getElementById(id));
      
      // Find the current section
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="landing-page">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollPosition > 50 
          ? 'py-3 bg-white/95 backdrop-blur-md shadow-md' 
          : 'py-5 bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3 z-10">
              <div className={`rounded-lg shadow-lg transition-all ${
                scrollPosition > 50 
                  ? 'bg-gradient-to-br from-[#2D71A8] to-[#1D5A8A] p-2' 
                  : 'bg-gradient-to-br from-[#3D81B8] to-[#2D6A9A] p-2.5'
              }`}>
                <BarChart2 className={`${scrollPosition > 50 ? 'h-6 w-6' : 'h-7 w-7'} text-white transition-all`} />
              </div>
              <div>
                <span className={`font-bold transition-all duration-300 ${
                  scrollPosition > 50 
                    ? 'text-xl text-[#1A2A40]' 
                    : 'text-2xl text-white'
                }`}>FinOptix</span>
                <div className={`font-medium uppercase tracking-wider transition-all duration-300 ${
                  scrollPosition > 50 
                    ? 'text-[9px] text-[#4D8EC3]' 
                    : 'text-[10px] text-blue-200'
                }`}>Financial Intelligence</div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-10">
              {[
                { id: 'home', label: 'Home' },
                { id: 'features', label: 'Features' },
                { id: 'benefits', label: 'Benefits' },
                { id: 'testimonials', label: 'Testimonials' },
                { id: 'pricing', label: 'Pricing' }
              ].map(item => (
                <a 
                  key={item.id}
                  href={`#${item.id}`} 
                  className={`relative text-sm font-semibold transition-all ${
                    scrollPosition > 50 
                      ? activeSection === item.id
                        ? 'text-[#2D71A8]'
                        : 'text-gray-600 hover:text-[#2D71A8]'
                      : activeSection === item.id
                        ? 'text-white'
                        : 'text-blue-100 hover:text-white'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${
                      scrollPosition > 50 ? 'bg-[#2D71A8]' : 'bg-white'
                    }`}></span>
                  )}
                </a>
              ))}
            </nav>
            
            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-5">
              <button 
                className={`text-sm font-medium transition-all ${
                  scrollPosition > 50 
                    ? 'text-[#2D71A8] hover:text-[#1D5A8A]'
                    : 'text-blue-100 hover:text-white'
                }`}
                onClick={() => navigate("/")}
              >
                Sign in
              </button>
              <Button 
                className={`px-6 shadow-lg transition-all ${
                  scrollPosition > 50 
                    ? 'bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white hover:shadow-[#2D71A8]/20 hover:shadow-xl'
                    : 'bg-white text-[#1D5A8A] hover:bg-blue-50'
                }`}
                onClick={() => navigate("/")}
              >
                <span className="mr-2">Try for free</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 rounded-md focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={`h-6 w-6 ${scrollPosition > 50 ? 'text-[#1A2A40]' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${scrollPosition > 50 ? 'text-[#1A2A40]' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {[
              { id: 'home', label: 'Home' },
              { id: 'features', label: 'Features' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'testimonials', label: 'Testimonials' },
              { id: 'pricing', label: 'Pricing' }
            ].map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block py-2 px-3 rounded-md text-base font-medium ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-[#2D71A8]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#2D71A8]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-3">
              <button 
                className="w-full py-2 text-center text-[#2D71A8] hover:text-[#1D5A8A] font-medium"
                onClick={() => navigate("/")}
              >
                Sign in
              </button>
              <Button 
                className="w-full py-6 bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white font-medium"
                onClick={() => navigate("/")}
              >
                Try for free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-[#162436] via-[#0c3967] to-[#0a2744]">
        {/* Abstract shapes background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-r from-blue-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-[15%] w-96 h-96 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 left-[30%] w-80 h-80 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
          
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(#4D8EC3 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0'
            }}
          ></div>
          
          {/* Animated floating elements */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute opacity-20 rounded-lg"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                backgroundColor: i % 2 === 0 ? '#3D81B8' : '#2D6A9A',
                animation: `float ${Math.random() * 10 + 20}s ease-in-out infinite`,
                animationDelay: `${i * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-6 z-10">
              <div className="text-xs font-semibold tracking-widest text-blue-300 mb-6 uppercase inline-flex items-center">
                <span className="inline-block w-5 h-5 rounded-full bg-blue-400/30 mr-2"></span>
                Enterprise Financial Intelligence
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
                Transform Financial<br /> 
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-blue-300 to-blue-100 text-transparent bg-clip-text">
                    Decision Making
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-[#2D71A8]/30 to-[#4D8EC3]/30 blur-sm"></span>
                </span>
              </h1>
              
              <p className="mt-6 text-xl text-blue-100/90 leading-relaxed max-w-2xl">
                FinOptix empowers finance teams with AI-driven insights, predictive forecasting, and collaborative planning tools — all in one unified platform.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={() => navigate("/")}
                  className="group relative inline-flex items-center justify-center px-8 py-5 font-medium text-lg text-white bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center">
                    Start free trial
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#3D81B8] to-[#5D9ED3] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </button>
                
                <button 
                  onClick={() => window.open("#demo", "_blank")}
                  className="group relative inline-flex items-center justify-center px-8 py-5 font-medium text-lg text-white border border-white/20 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center">
                    Watch demo
                    <span className="ml-2 h-5 w-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </span>
                </button>
              </div>
              
              <div className="mt-10 pt-8 border-t border-blue-500/20">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="flex -space-x-3">
                    {['Emily', 'Mark', 'Sarah', 'John'].map((name, i) => (
                      <div 
                        key={i} 
                        className="w-12 h-12 rounded-full border-2 border-[#162436] flex items-center justify-center text-white font-medium shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${
                            ['#4D8EC3', '#3D81B8', '#2D71A8', '#1D5A8A'][i % 4]
                          }, ${
                            ['#3D81B8', '#2D71A8', '#1D5A8A', '#0D4A7A'][i % 4]
                          })`
                        }}
                      >
                        {name[0]}
                      </div>
                    ))}
                    <div className="w-12 h-12 rounded-full bg-blue-800/50 border-2 border-[#162436] flex items-center justify-center text-white text-xs font-medium">
                      +496
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-white font-semibold">4.9/5</span>
                    </div>
                    <p className="text-blue-200 text-sm">
                      Trusted by <span className="font-semibold text-white">500+</span> financial leaders worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="lg:col-span-6 perspective-1000">
              <div className="relative transform rotate-y-3 rotate-x-6 transition-all duration-500 hover:rotate-y-6 hover:rotate-x-12">
                {/* Dashboard background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10"></div>
                
                {/* Dashboard content */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  {/* Dashboard header */}
                  <div className="bg-[#0F1829]/90 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-white/70 text-xs font-medium">FinOptix Dashboard • Q2 Financial Analytics</div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-300 text-xs">JD</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="bg-gradient-to-br from-[#121c2e] to-[#0d1728] p-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[
                        { title: 'Revenue', value: '$1.47M', trend: '+14.5%', color: 'green' },
                        { title: 'Expenses', value: '$682K', trend: '-3.2%', color: 'blue' },
                        { title: 'Net Profit', value: '$788K', trend: '+22.8%', color: 'green' }
                      ].map((item, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/5">
                          <h3 className="text-xs font-medium text-white/60">{item.title}</h3>
                          <div className="mt-2 flex items-end justify-between">
                            <div className="text-xl font-bold text-white">{item.value}</div>
                            <div className={`text-xs ${
                              item.color === 'green' ? 'text-green-400' : 'text-blue-400'
                            }`}>
                              {item.trend}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Chart Area */}
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/5 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-white">Revenue Analysis</h3>
                        <div className="flex space-x-2">
                          {['1D', '1W', '1M', 'YTD', 'ALL'].map((period, i) => (
                            <div key={i} className={`text-xs px-2 py-1 rounded ${
                              i === 2 ? 'bg-blue-500/20 text-blue-300' : 'text-white/60'
                            }`}>
                              {period}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Chart */}
                      <div className="h-40">
                        <div className="w-full h-full flex items-end relative">
                          {/* Line chart area */}
                          <div className="absolute inset-0">
                            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#3D81B8" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#3D81B8" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path 
                                d="M0,35 L5,32 L10,33 L15,28 L20,25 L25,27 L30,20 L35,22 L40,19 L45,14 L50,15 L55,10 L60,12 L65,8 L70,5 L75,7 L80,3 L85,6 L90,2 L95,5 L100,0 L100,40 L0,40 Z" 
                                fill="url(#gradient)"
                              />
                              <path 
                                d="M0,35 L5,32 L10,33 L15,28 L20,25 L25,27 L30,20 L35,22 L40,19 L45,14 L50,15 L55,10 L60,12 L65,8 L70,5 L75,7 L80,3 L85,6 L90,2 L95,5 L100,0" 
                                fill="none"
                                stroke="#4D8EC3"
                                strokeWidth="0.5"
                              />
                            </svg>
                          </div>
                          
                          {/* Bar chart */}
                          {[40, 35, 45, 30, 35, 25, 30, 20, 25, 15, 20, 10].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-[70%] bg-gradient-to-t from-[#2D71A8]/80 to-[#4D8EC3]/80 rounded-sm"
                                style={{ height: `${height}%` }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom widgets */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xs font-medium text-white/60">Cash Flow</h3>
                            <div className="mt-1 text-lg font-bold text-white">+12.4%</div>
                          </div>
                          <div className="flex items-center p-1.5 rounded-full bg-emerald-500/20 text-emerald-300">
                            <ArrowRight className="h-4 w-4 transform rotate-45" />
                          </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">Current</span>
                            <span className="text-white">$1.24M</span>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-white/60">Previous</span>
                            <span className="text-white/80">$1.1M</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-xs font-medium text-white/60">AI Insights</h3>
                              <span className="ml-2 text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">New</span>
                            </div>
                            <div className="mt-1 text-white text-[9px] leading-tight">
                              Based on trends, consider increasing Q3 inventory to meet projected 18% demand increase.
                            </div>
                          </div>
                          <div className="flex items-center p-1.5 rounded-full bg-blue-500/20 text-blue-300">
                            <Lightbulb className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Reflection effect */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-blue-600/5 to-transparent blur-md transform translate-y-full scale-y-50 opacity-30"></div>
              </div>
            </div>
          </div>
          
          {/* Client logos */}
          <div className="relative mt-24 border-t border-blue-500/20 pt-12">
            <p className="text-center text-sm uppercase tracking-wider font-medium text-blue-300 mb-10">Trusted by industry leaders</p>
            
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {[
                'Goldman Sachs', 'JP Morgan', 'Morgan Stanley', 'BlackRock',
                'Fidelity', 'Vanguard'
              ].map((company, i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="px-6 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-blue-200/70 font-medium">
                    {company}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-blue-300/70 animate-bounce">
            <span className="text-xs uppercase tracking-wider font-medium mb-2">Scroll to explore</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A2A40]">
              Powerful Features for Financial Excellence
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Streamline your financial processes with tools designed by finance experts for finance experts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <LineChart className="h-8 w-8 text-[#2D71A8]" />,
                title: "AI-Powered Forecasting",
                description: "Leverage machine learning algorithms to predict financial outcomes with greater accuracy than traditional methods."
              },
              {
                icon: <Layers className="h-8 w-8 text-[#2D71A8]" />,
                title: "Dynamic Scenario Planning",
                description: "Create and compare multiple financial scenarios to prepare for different market conditions and business outcomes."
              },
              {
                icon: <Users className="h-8 w-8 text-[#2D71A8]" />,
                title: "Collaborative Workspace",
                description: "Enable real-time collaboration across departments with role-based permissions and approval workflows."
              },
              {
                icon: <BarChart2 className="h-8 w-8 text-[#2D71A8]" />,
                title: "Advanced Analytics",
                description: "Gain deeper insights with customizable dashboards and visualization tools designed for financial data."
              },
              {
                icon: <Shield className="h-8 w-8 text-[#2D71A8]" />,
                title: "Data Integration",
                description: "Connect seamlessly with ERP systems, accounting software, and other financial data sources."
              },
              {
                icon: <ArrowRight className="h-8 w-8 text-[#2D71A8]" />,
                title: "Automated Reporting",
                description: "Generate board-ready financial reports and presentations with a single click."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1A2A40] mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-[#1A2A40] to-[#0F1829]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Transform Your Financial Operations
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              See how FinOptix delivers measurable business impact across your organization.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">For Finance Leaders</h3>
              <ul className="space-y-4">
                {[
                  "Reduce forecast variance by up to 40%",
                  "Cut budget cycle time by 60%",
                  "Increase cash flow visibility by 85%",
                  "Automate 75% of routine financial reporting"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="rounded-full bg-green-500/20 p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">For Business Growth</h3>
              <ul className="space-y-4">
                {[
                  "Make decisions 3x faster with real-time data",
                  "Identify growth opportunities through AI-powered insights",
                  "Improve cross-functional alignment on financial goals",
                  "Scale financial operations without adding headcount"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="rounded-full bg-blue-500/20 p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              className="bg-white text-[#1A2A40] hover:bg-slate-100 text-lg py-6 px-10 shadow-xl"
              onClick={() => navigate("/")}
            >
              See the impact <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A2A40]">
              Trusted by Financial Leaders
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              See what finance professionals are saying about FinOptix.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "FinOptix has revolutionized our budgeting process. What took weeks now takes days, with greater accuracy and collaboration.",
                author: "Sarah Chen",
                role: "CFO, TechGrowth Inc."
              },
              {
                quote: "The AI-powered forecasting has given us insights we would have missed using traditional methods. Our cash flow management is the best it's ever been.",
                author: "Michael Rodriguez",
                role: "VP of Finance, Global Retail"
              },
              {
                quote: "I can't imagine going back to our old financial planning tools. FinOptix has transformed how we approach our quarterly reviews and strategic planning.",
                author: "Aisha Johnson",
                role: "Financial Controller, Innovation Health"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md relative">
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 28H20L16 44H8L12 28Z" fill="#E2E8F0"/>
                    <path d="M28 28H36L32 44H24L28 28Z" fill="#E2E8F0"/>
                    <path d="M12 16C12 11.5817 15.5817 8 20 8H24V20C24 24.4183 20.4183 28 16 28H12V16Z" fill="#E2E8F0"/>
                    <path d="M28 16C28 11.5817 31.5817 8 36 8H40V20C40 24.4183 36.4183 28 32 28H28V16Z" fill="#E2E8F0"/>
                  </svg>
                </div>
                
                <div className="mb-6">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className="inline-block h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-slate-600 mb-6 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mr-4">
                    <span className="text-[#2D71A8] font-medium">{testimonial.author.split(' ').map(name => name[0]).join('')}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1A2A40]">{testimonial.author}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A2A40]">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Choose the plan that's right for your business needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$99",
                description: "Perfect for small businesses and startups",
                features: [
                  "Financial dashboards",
                  "Basic forecasting tools",
                  "Up to 3 users",
                  "Data import/export",
                  "Email support"
                ],
                cta: "Start free trial",
                highlight: false
              },
              {
                name: "Professional",
                price: "$299",
                description: "Ideal for growing companies",
                features: [
                  "Everything in Starter",
                  "AI-powered insights",
                  "Scenario planning",
                  "Up to 10 users",
                  "API access",
                  "Priority support"
                ],
                cta: "Start free trial",
                highlight: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations with complex needs",
                features: [
                  "Everything in Professional",
                  "Unlimited users",
                  "Custom integrations",
                  "Dedicated account manager",
                  "Training & onboarding",
                  "SLA guarantees"
                ],
                cta: "Contact sales",
                highlight: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl p-8 border ${
                  plan.highlight 
                    ? 'border-[#2D71A8] shadow-xl shadow-[#2D71A8]/10 relative' 
                    : 'border-slate-200 shadow-md'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2D71A8] text-white text-xs font-bold px-4 py-1 rounded-full uppercase">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-semibold text-[#1A2A40] mb-1">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-[#1A2A40]">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-slate-500 ml-2">/month</span>}
                </div>
                <p className="text-slate-600 mb-6 mt-2">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-6 ${
                    plan.highlight 
                      ? 'bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-lg' 
                      : 'bg-white text-[#2D71A8] border border-[#2D71A8]'
                  }`}
                  variant={plan.highlight ? 'default' : 'outline'}
                  onClick={() => navigate("/")}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center text-slate-600">
            <p>All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#2D71A8] to-[#1D5A8A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to transform your financial planning?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join 500+ companies already making smarter financial decisions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-white text-[#2D71A8] hover:bg-blue-50 text-lg py-6 px-10 shadow-xl"
              onClick={() => navigate("/")}
            >
              Start your free trial
            </Button>
            <Button 
              variant="outline"
              className="text-white border-white hover:bg-white/10 text-lg py-6 px-10"
              onClick={() => navigate("/")}
            >
              Schedule a demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2A40] text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-white/10 p-2">
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-semibold text-white">FinOptix</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                Transforming financial planning with AI-powered intelligence and collaborative tools.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                {["Features", "Pricing", "Integrations", "Documentation", "Release Notes"].map((item, i) => (
                  <li key={i}><a href="#" className="hover:text-white">{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                {["About", "Customers", "Careers", "Blog", "Contact"].map((item, i) => (
                  <li key={i}><a href="#" className="hover:text-white">{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Subscribe</h3>
              <p className="text-sm text-slate-400 mb-4">
                Get the latest news and updates from FinOptix.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/10 rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <button className="bg-[#2D71A8] text-white px-4 py-2 rounded-r hover:bg-[#1D5A8A] transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} FinOptix. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy", "Terms", "Cookies", "Security"].map((item, i) => (
                <a key={i} href="#" className="text-sm text-slate-400 hover:text-white">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;