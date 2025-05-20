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
      <section id="features" className="py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white relative">
        {/* Background decorations */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute left-0 bottom-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-block">
              <span className="bg-blue-50 text-blue-600 text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-4 inline-block">Features</span>
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F1829] leading-tight">
              Enterprise-Grade <span className="gradient-text-animated">Financial Intelligence</span>
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              FinOptix delivers a comprehensive suite of tools designed by finance executives for finance teams, 
              combining powerful analytics with intuitive design.
            </p>
          </div>
          
          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <LineChart className="h-8 w-8 text-white" />,
                iconBg: 'from-[#4D8EC3] to-[#2D71A8]',
                title: "AI-Powered Forecasting",
                description: "Machine learning algorithms analyze historical data and external factors to deliver 30% more accurate forecasts than traditional methods."
              },
              {
                icon: <Layers className="h-8 w-8 text-white" />,
                iconBg: 'from-[#3579B7] to-[#255E95]',
                title: "Dynamic Scenario Planning",
                description: "Model multiple financial scenarios with adjustable parameters to visualize outcomes across various market conditions and business strategies."
              },
              {
                icon: <Users className="h-8 w-8 text-white" />,
                iconBg: 'from-[#2D71A8] to-[#1D5A8A]',
                title: "Collaborative Workspace",
                description: "Real-time collaboration with role-based permissions, approval workflows, and annotation tools to streamline cross-departmental planning."
              },
              {
                icon: <BarChart className="h-8 w-8 text-white" />,
                iconBg: 'from-[#255E95] to-[#174B7F]',
                title: "Advanced Analytics",
                description: "Customizable dashboards with interactive visualizations that transform complex financial data into actionable business intelligence."
              },
              {
                icon: <Shield className="h-8 w-8 text-white" />,
                iconBg: 'from-[#1D5A8A] to-[#0D4A7A]',
                title: "Enterprise Data Integration",
                description: "Bidirectional connectors for major ERP systems, accounting software, and banking platforms with automated data validation and reconciliation."
              },
              {
                icon: <Workflow className="h-8 w-8 text-white" />,
                iconBg: 'from-[#174B7F] to-[#0A3660]',
                title: "Automated Reporting",
                description: "Generate board-ready financial reports and presentations with customizable templates that update automatically as your data changes."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group hover-lift shine-effect rounded-xl overflow-hidden transition-all duration-300 bg-white shadow-sm"
              >
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg bg-gradient-to-br ${feature.iconBg} transform transition-transform group-hover:scale-110 duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#0F1829] mb-3 group-hover:text-[#2D71A8] transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-[#2D71A8] group-hover:to-[#4D8EC3] transition-all duration-500"></div>
              </div>
            ))}
          </div>
          
          {/* Features showcase */}
          <div className="mt-24 bg-gradient-to-br from-slate-100 to-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="inline-block rounded-full px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold mb-6">
                  Advanced Capabilities
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0F1829] leading-tight mb-4">
                  Beyond Traditional <br />Financial Planning
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  FinOptix goes beyond standard FP&A tools by combining advanced predictive modeling with real-time 
                  collaborative features in a single platform.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Reduce forecast variance by up to 40%",
                    "Cut budget cycle time by 60%",
                    "Identify revenue opportunities 2.5x faster",
                    "Decrease manual reporting time by 75%"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10">
                  <button
                    className="group inline-flex items-center text-[#2D71A8] font-medium hover:text-[#1D5A8A]"
                    onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span>Explore all capabilities</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              <div className="relative h-96 lg:h-auto overflow-hidden bg-gradient-to-br from-[#0F1829] to-[#162436]">
                {/* Abstract decoration */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl"></div>
                <div className="absolute top-20 -left-20 w-64 h-64 bg-blue-300/10 rounded-full filter blur-3xl"></div>
                
                {/* Feature visualization */}
                <div className="relative h-full flex items-center justify-center p-8">
                  <div className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-white font-medium">Quarterly Revenue Forecast</h4>
                      <div className="bg-blue-500/20 rounded px-2 py-1">
                        <span className="text-xs text-blue-300">AI-Generated</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Confidence indicator */}
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white/70 text-sm">Forecast confidence</span>
                          <span className="text-white font-medium">89%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-[89%]"></div>
                        </div>
                      </div>
                      
                      {/* Chart preview */}
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="h-32 flex items-end space-x-1">
                          {[65, 72, 84, 91, 87, 94].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full rounded-t"
                                style={{ 
                                  height: `${height}%`,
                                  background: `linear-gradient(to top, rgba(45, 113, 168, 0.7), rgba(77, 142, 195, 0.7))`
                                }}
                              ></div>
                              <div className="text-[9px] mt-1 text-blue-300">{`Q${i+1}`}</div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between mt-3">
                          <div className="text-xs text-white/70">
                            <span className="text-green-400">↑</span> 18.5% YoY
                          </div>
                          <div className="text-xs text-white/70">
                            <span className="text-blue-400">•</span> 92% accuracy
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded transition-colors">
                          Adjust Parameters
                        </button>
                        <button className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white text-xs py-2 rounded transition-colors">
                          Export Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-28 bg-gradient-to-br from-[#1A2A40] via-[#162436] to-[#0F1829] relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0'
            }}
          ></div>
          
          {/* Floating 3D shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 -rotate-12 blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-gradient-to-r from-blue-400/10 to-blue-600/10 blur-xl"></div>
          <div className="absolute top-3/4 left-2/3 w-24 h-24 rounded-lg bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rotate-12 blur-lg"></div>
          
          {/* Highlight beams */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-1/4 h-80 bg-gradient-to-b from-blue-400/30 to-transparent opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 left-1/3 w-1/5 h-80 bg-gradient-to-t from-blue-500/30 to-transparent opacity-20 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-block mb-4">
              <span className="bg-blue-500/20 text-blue-300 text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full">Business Impact</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Transform Your Financial <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">Decision-Making</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-sm"></span>
              </span>
            </h2>
            <p className="mt-6 text-lg text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
              FinOptix delivers measurable impact across your organization by streamlining workflows,
              enhancing decision quality, and uncovering hidden opportunities.
            </p>
          </div>
          
          {/* Interactive tabbed benefits */}
          <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
            <div className="lg:col-span-5 space-y-8">
              {[
                {
                  id: 'finance',
                  title: 'Finance Leadership',
                  icon: <BarChart2 className="h-6 w-6 text-blue-300" />,
                  description: 'Gain strategic visibility and control over financial operations.',
                  items: [
                    "Reduce forecast variance by up to 40%",
                    "Cut budget cycle time by 60%",
                    "Increase cash flow visibility by 85%",
                    "Automate 75% of routine financial reporting"
                  ],
                  color: 'green'
                },
                {
                  id: 'business',
                  title: 'Business Growth',
                  icon: <LineChart className="h-6 w-6 text-blue-300" />,
                  description: 'Accelerate growth with data-driven decision making.',
                  items: [
                    "Make decisions 3x faster with real-time data",
                    "Identify revenue opportunities with AI-powered insights",
                    "Improve cross-functional alignment on financial goals",
                    "Scale financial operations without adding headcount"
                  ],
                  color: 'blue'
                },
                {
                  id: 'operations',
                  title: 'Operational Excellence',
                  icon: <Workflow className="h-6 w-6 text-blue-300" />,
                  description: 'Streamline processes and eliminate inefficiencies.',
                  items: [
                    "Reduce manual data entry by 90%",
                    "Cut report generation time from days to minutes",
                    "Automate reconciliation processes",
                    "Track financial KPIs in real-time dashboards"
                  ],
                  color: 'purple'
                }
              ].map((benefit, i) => (
                <div 
                  key={i}
                  className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer transition-all hover:bg-white/10 hover:border-white/20 ${
                    i === 0 ? 'ring-2 ring-blue-400/30 shadow-lg shadow-blue-500/10' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="shrink-0 p-2 rounded-lg bg-white/10 mr-4">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{benefit.title}</h3>
                      <p className="text-blue-200/80 mt-1">{benefit.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    {benefit.items.map((item, j) => (
                      <div key={j} className="flex items-start">
                        <div className={`rounded-full ${
                          benefit.color === 'green' 
                            ? 'bg-green-500/20 text-green-400' 
                            : benefit.color === 'blue'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                        } p-1 mr-3 mt-1`}>
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <span className="text-blue-100/90 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Visual showcase */}
            <div className="lg:col-span-7">
              <div className="bg-gradient-to-br from-[#0F1829]/60 to-[#1A2A40]/60 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                {/* Dashboard Visualization */}
                <div className="relative">
                  {/* Dashboard header */}
                  <div className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
                      <span className="text-white font-medium">Financial Leadership Dashboard</span>
                    </div>
                    <div className="flex space-x-3">
                      <div className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">Live Data</div>
                      <div className="px-2 py-1 bg-white/10 rounded text-xs text-white/70">Last updated: Just now</div>
                    </div>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="p-6">
                    {/* Header metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Forecast Accuracy', value: '94.3%', trend: '+12.6%', color: 'green' },
                        { label: 'Budget Variance', value: '-3.2%', trend: 'On target', color: 'blue' },
                        { label: 'Time Saved', value: '240 hrs', trend: '75% reduction', color: 'purple' },
                      ].map((metric, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5">
                          <div className="text-sm text-white/70 mb-1">{metric.label}</div>
                          <div className="text-xl font-bold text-white">{metric.value}</div>
                          <div className={`text-xs ${
                            metric.color === 'green' ? 'text-green-400' : 
                            metric.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                          } mt-1`}>{metric.trend}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Main visualization */}
                    <div className="bg-white/5 rounded-lg border border-white/10 p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-medium">Finance Team Productivity</h4>
                        <div className="flex space-x-2 text-xs">
                          <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300">Before FinOptix</span>
                          <span className="px-2 py-1 rounded bg-green-500/20 text-green-300">After FinOptix</span>
                        </div>
                      </div>
                      
                      {/* Comparison chart */}
                      <div className="h-64 relative">
                        <div className="absolute inset-x-0 bottom-0 text-xs text-white/60 grid grid-cols-4 gap-4">
                          <div className="text-center">Planning</div>
                          <div className="text-center">Reporting</div>
                          <div className="text-center">Analysis</div>
                          <div className="text-center">Strategic</div>
                        </div>
                        
                        <div className="absolute inset-0 pt-6 pb-8 grid grid-cols-4 gap-4">
                          {['Planning', 'Reporting', 'Analysis', 'Strategic'].map((category, i) => (
                            <div key={i} className="flex flex-col justify-end items-center space-y-2">
                              {/* After bar */}
                              <div 
                                className="w-4/5 bg-gradient-to-t from-green-500/70 to-green-400/70 rounded-t-sm"
                                style={{ 
                                  height: `${i === 0 ? 20 : i === 1 ? 15 : i === 2 ? 35 : 50}%` 
                                }}
                              ></div>
                              
                              {/* Before bar */}
                              <div 
                                className="w-4/5 bg-gradient-to-t from-blue-500/70 to-blue-400/70 rounded-t-sm"
                                style={{ 
                                  height: `${i === 0 ? 60 : i === 1 ? 65 : i === 2 ? 15 : 5}%` 
                                }}
                              ></div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Chart labels */}
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <div className="transform -rotate-90 translate-y-6 text-xs text-white/60">
                            Time Spent (%)
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded p-3">
                          <div className="text-xs text-white/70 mb-1">Time spent on strategic tasks</div>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-lg font-bold text-white">+45%</span>
                            </div>
                            <div className="px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-300">
                              Significant improvement
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded p-3">
                          <div className="text-xs text-white/70 mb-1">Manual reporting time</div>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-lg font-bold text-white">-75%</span>
                            </div>
                            <div className="px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-300">
                              Automation benefit
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom action button */}
                    <div className="flex justify-end">
                      <button 
                        className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-all shadow-lg shadow-blue-500/20"
                        onClick={() => navigate("/")}
                      >
                        <span>See your potential ROI</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial highlight */}
          <div className="relative py-10 px-8 md:py-16 md:px-12 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <svg className="absolute right-0 top-0 h-full opacity-20" viewBox="0 0 120 480" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 128C62.0914 128 80 110.091 80 88C80 65.9086 62.0914 48 40 48C17.9086 48 0 65.9086 0 88C0 110.091 17.9086 128 40 128Z" fill="white" />
                <path d="M40 328C62.0914 328 80 310.091 80 288C80 265.909 62.0914 248 40 248C17.9086 248 0 265.909 0 288C0 310.091 17.9086 328 40 328Z" fill="white" />
                <path d="M120 128C120 154.51 98.5097 176 72 176C45.4903 176 24 154.51 24 128C24 101.49 45.4903 80 72 80C98.5097 80 120 101.49 120 128Z" fill="white" />
                <path d="M120 288C120 314.51 98.5097 336 72 336C45.4903 336 24 314.51 24 288C24 261.49 45.4903 240 72 240C98.5097 240 120 261.49 120 288Z" fill="white" />
              </svg>
            </div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div>
                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <blockquote className="text-2xl font-light italic text-white leading-relaxed mb-6">
                  "FinOptix has revolutionized our financial operations. The AI-generated insights have helped us identify opportunities we would have missed, and the collaborative planning features have cut our budget cycle time by more than half."
                </blockquote>
                
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4D8EC3] to-[#2D71A8] flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                    MJ
                  </div>
                  <div>
                    <div className="text-white font-medium">Michael Johnson</div>
                    <div className="text-blue-200">CFO, Global Innovations Inc.</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">Results with FinOptix:</h3>
                
                <div className="space-y-4">
                  {[
                    { metric: 'Budget cycle reduction', value: '58%', desc: 'From 45 days to 19 days' },
                    { metric: 'Forecast accuracy improvement', value: '32%', desc: 'Year-over-year improvement' },
                    { metric: 'Strategic decision time', value: '3.2x', desc: 'Faster executive decision-making' },
                    { metric: 'Annual cost savings', value: '$1.7M', desc: 'Through process automation' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-2 border-b border-white/10">
                      <div className="text-blue-100">{item.metric}</div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">{item.value}</div>
                        <div className="text-xs text-blue-200">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded flex justify-center items-center font-medium shadow-lg"
                  onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span>View more success stories</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"></div>
          
          {/* Quote marks */}
          <div className="absolute top-20 left-10 text-[300px] font-serif text-blue-100 leading-none opacity-30">
            "
          </div>
          <div className="absolute bottom-20 right-10 text-[300px] font-serif text-blue-100 leading-none opacity-30">
            "
          </div>
          
          {/* Abstract pattern */}
          <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full opacity-[0.02]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1.5" fill="#2D71A8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-block">
              <span className="bg-blue-50 text-blue-600 text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-4 inline-block">Success Stories</span>
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F1829] leading-tight">
              Trusted by Financial <span className="gradient-text-animated">Leaders Worldwide</span>
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              See how organizations across industries are transforming their financial operations
              and achieving measurable results with FinOptix.
            </p>
          </div>
          
          {/* Featured testimonial */}
          <div className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <blockquote className="text-2xl font-light text-slate-800 leading-relaxed mb-6 relative">
                  <span className="text-[#2D71A8] font-medium">"FinOptix</span> has completely transformed our financial planning process. The AI insights helped us identify $2.4M in revenue opportunities, and we've reduced our forecast variance by 42%. Our finance team now spends more time on strategic advisory rather than data collection.
                </blockquote>
                
                <div className="flex items-center mt-4 border-t border-slate-100 pt-6">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#4D8EC3] to-[#2D71A8] flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                    JW
                  </div>
                  <div>
                    <div className="text-[#0F1829] font-bold text-lg">Jennifer Wallace</div>
                    <div className="text-slate-600">CFO, Global Retail Innovations</div>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { metric: 'Forecast Accuracy', value: '+42%' },
                    { metric: 'Revenue Increase', value: '$2.4M' },
                    { metric: 'Budget Cycle', value: '68% faster' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-xs text-slate-500">{item.metric}</div>
                      <div className="text-lg font-bold text-[#2D71A8]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2 relative bg-gradient-to-br from-[#0F1829] to-[#2D71A8] min-h-[300px] md:min-h-full">
                {/* Company logo background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="text-white text-9xl font-bold">GRI</div>
                </div>
                
                {/* Company details */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <h4 className="text-white font-medium mb-2">Company Profile:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white/80">
                        <span>Industry:</span>
                        <span className="text-white font-medium">Retail</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>Size:</span>
                        <span className="text-white font-medium">Enterprise (5,000+ employees)</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>Use case:</span>
                        <span className="text-white font-medium">Financial Planning & Forecasting</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>ROI:</span>
                        <span className="text-white font-medium">312% in first year</span>
                      </div>
                    </div>
                    
                    <button 
                      className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white text-sm py-2 rounded-md flex items-center justify-center transition-colors"
                      onClick={() => window.open("#case-studies", "_blank")}
                    >
                      <span>Read full case study</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "FinOptix has revolutionized our budgeting process. What took weeks now takes days, with greater accuracy and collaboration.",
                author: "Sarah Chen",
                role: "CFO, TechGrowth Inc.",
                industry: "Technology",
                image: "SC"
              },
              {
                quote: "The AI-powered forecasting has given us insights we would have missed using traditional methods. Our cash flow management is the best it's ever been.",
                author: "Michael Rodriguez",
                role: "VP of Finance, Global Retail",
                industry: "Retail",
                image: "MR"
              },
              {
                quote: "I can't imagine going back to our old financial planning tools. FinOptix has transformed how we approach our quarterly reviews and strategic planning.",
                author: "Aisha Johnson",
                role: "Financial Controller, Innovation Health",
                industry: "Healthcare",
                image: "AJ"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="group bg-white rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover-lift"
              >
                <div className="h-2 w-full bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3]"></div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
                      {testimonial.industry}
                    </div>
                  </div>
                  
                  <blockquote className="text-slate-700 mb-6 h-36 overflow-hidden">"{testimonial.quote}"</blockquote>
                  
                  <div className="flex items-center pt-4 border-t border-slate-100">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium shadow-md bg-gradient-to-br from-[#4D8EC3] to-[#2D71A8]">
                      {testimonial.image}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-[#0F1829]">{testimonial.author}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Company logos */}
          <div className="mt-20 pt-12 border-t border-slate-200">
            <h3 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
              Trusted by companies worldwide
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
              {[
                'Goldman Sachs', 'JP Morgan', 'Morgan Stanley', 
                'BlackRock', 'Fidelity', 'Vanguard'
              ].map((company, i) => (
                <div 
                  key={i} 
                  className="h-12 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  <div className="bg-slate-800 text-white px-3 py-1 rounded text-sm font-medium">
                    {company}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-20 text-center">
            <Button 
              className="bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3] hover:from-[#256191] hover:to-[#3D7EB3] text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all text-lg py-6 px-10"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore pricing options <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle background shapes */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl -mb-48 -mr-48"></div>
          <div className="absolute top-1/4 left-20 w-64 h-64 rounded-full border border-blue-200/20"></div>
          <div className="absolute bottom-1/3 right-20 w-40 h-40 rounded-full border border-blue-300/10"></div>
          
          {/* Abstract grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" 
            style={{
              backgroundImage: 'radial-gradient(#2D71A8 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block">
              <span className="bg-blue-50 text-blue-600 text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-4 inline-block">Pricing</span>
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F1829] leading-tight">
              Simple, <span className="gradient-text-animated">Transparent Pricing</span>
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Choose the plan that best fits your business needs. All plans include a 14-day trial with no credit card required.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$99",
                description: "Perfect for small teams just getting started",
                features: [
                  "Financial dashboards",
                  "Basic reporting",
                  "Limited data visualization",
                  "Up to 3 team members",
                  "Basic access controls",
                  "Data import/export",
                  "Email support"
                ],
                cta: "Start free trial",
                highlight: false
              },
              {
                name: "Professional",
                price: "$299",
                description: "Ideal for growing companies with advanced needs",
                features: [
                  "Everything in Starter",
                  "AI-powered insights",
                  "Scenario planning",
                  "Advanced analytics",
                  "Up to 10 team members",
                  "Role-based access",
                  "Workflow approvals",
                  "Priority support"
                ],
                cta: "Start free trial",
                highlight: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For organizations with complex financial operations",
                features: [
                  "Everything in Professional",
                  "Unlimited team members",
                  "Custom integrations",
                  "Premium on-site training",
                  "Dedicated account manager",
                  "SLA guarantees",
                  "Custom security controls"
                ],
                cta: "Contact sales",
                highlight: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`group relative rounded-xl overflow-hidden hover-lift transition-all duration-300 ${
                  plan.highlight 
                    ? 'shadow-xl shadow-blue-500/10 z-10 scale-105 md:scale-100 md:hover:scale-105' 
                    : 'shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Card background and border effect */}
                <div className="absolute inset-0 bg-white"></div>
                <div className={`absolute inset-0 border-2 rounded-xl transition-colors ${
                  plan.highlight ? 'border-blue-500' : 'border-slate-200 group-hover:border-slate-300'
                }`}></div>
                {plan.highlight && (
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                )}
                
                {/* Card content */}
                <div className="relative p-8">
                  {plan.highlight && (
                    <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-[#0F1829] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-[#0F1829]">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-slate-500 ml-2">/month</span>}
                  </div>
                  <p className="text-slate-600 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-6 ${
                      plan.highlight 
                        ? 'bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white hover:shadow-lg transition-shadow'
                        : 'bg-white border border-[#2D71A8] text-[#2D71A8] hover:bg-slate-50'
                    }`}
                    onClick={() => navigate("/")}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* FAQ Section */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-[#0F1829]">Frequently Asked Questions</h3>
              <p className="mt-4 text-slate-600">Everything you need to know about our pricing and plans</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  question: "Do you offer a free trial?",
                  answer: "Yes, all plans include a 14-day free trial with full access to all features. No credit card required."
                },
                {
                  question: "Can I change plans later?",
                  answer: "Absolutely! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle."
                },
                {
                  question: "How does billing work?",
                  answer: "We offer monthly and annual billing options. Annual plans receive a 15% discount compared to monthly billing."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, ACH transfers, and wire transfers for enterprise customers."
                },
                {
                  question: "Do you offer educational or non-profit discounts?",
                  answer: "Yes, we offer special pricing for qualified educational institutions and non-profit organizations. Contact our sales team for details."
                },
                {
                  question: "How secure is my financial data?",
                  answer: "FinOptix is SOC 2 compliant and uses bank-level encryption to protect your data. We never share your information with third parties."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h4 className="text-lg font-semibold text-[#0F1829] mb-2">{faq.question}</h4>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
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