import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight, BarChart2, Layers, Users, Shield, ArrowRight, LineChart } from 'lucide-react';

const LandingPage = () => {
  const [_, navigate] = useLocation();
  
  return (
    <div className="landing-page">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-gradient-to-br from-[#2D71A8] to-[#1D5A8A] p-2 shadow-sm">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-semibold text-[#1A2A40]">FinOptix</span>
                <div className="text-[9px] text-[#4D8EC3] uppercase tracking-wider font-medium">Financial Intelligence</div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-10">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-[#2D71A8]">Features</a>
              <a href="#benefits" className="text-sm font-medium text-gray-600 hover:text-[#2D71A8]">Benefits</a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-[#2D71A8]">Testimonials</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-[#2D71A8]">Pricing</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                className="hidden md:inline-flex text-sm font-medium text-[#2D71A8] hover:text-[#1D5A8A]"
                onClick={() => navigate("/")}
              >
                Sign in
              </button>
              <Button 
                className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md hover:shadow-lg transition-shadow"
                onClick={() => navigate("/")}
              >
                Try for free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#1A2A40]">
                Transform Financial Planning with <span className="bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3] text-transparent bg-clip-text">Intelligence</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                FinOptix brings AI-powered insights, collaborative planning, and real-time analytics to your financial operations, helping you make smarter decisions faster.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-lg text-lg py-6 px-8 hover:shadow-xl transition-shadow"
                  onClick={() => navigate("/")}
                >
                  Start free trial <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  className="text-[#2D71A8] border-[#2D71A8] text-lg py-6 px-8"
                  onClick={() => window.open("#demo", "_blank")}
                >
                  Request demo
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full bg-[#${i * 2}D71A8]/30 border-2 border-white flex items-center justify-center`}>
                      <span className="text-[#2D71A8] text-xs font-medium">{i}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-slate-600">
                  <strong className="font-medium">500+</strong> financial leaders trust FinOptix
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2D71A8]/10 to-[#4D8EC3]/10 transform rotate-3 rounded-3xl"></div>
              <div className="relative z-10 bg-white p-6 rounded-2xl shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] p-4 rounded-xl">
                    <h3 className="text-sm font-medium text-[#1A2A40]">Revenue Forecast</h3>
                    <div className="h-32 mt-2">
                      <div className="w-full h-full flex items-end space-x-1">
                        {[40, 65, 55, 70, 85, 75, 90].map((height, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div 
                              className={`w-full bg-gradient-to-t from-[#2D71A8]/90 to-[#4D8EC3]/90 rounded-t`} 
                              style={{ height: `${height}%` }}
                            ></div>
                            <div className="text-[8px] mt-1 text-slate-500">{`Q${i+1}`}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-4 rounded-xl">
                    <h3 className="text-sm font-medium text-[#1A2A40]">Cash Flow</h3>
                    <div className="mt-2 text-2xl font-bold text-[#2D71A8]">+12.4%</div>
                    <div className="text-xs text-green-600 flex items-center mt-1">
                      <ArrowRight className="h-3 w-3 mr-1 transform rotate-45" /> Up from last month
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-4 rounded-xl">
                    <h3 className="text-sm font-medium text-[#1A2A40]">Budget Variance</h3>
                    <div className="mt-2 text-2xl font-bold text-[#1D5A8A]">-2.7%</div>
                    <div className="text-xs text-blue-600 flex items-center mt-1">
                      <ArrowRight className="h-3 w-3 mr-1 transform -rotate-45" /> Under budget
                    </div>
                  </div>
                  
                  <div className="col-span-2 bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-[#1A2A40]">AI Insights</h3>
                      <div className="bg-blue-100 text-blue-800 text-[10px] font-medium px-2 py-1 rounded-full">New</div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      Based on current cash flow trends and seasonal patterns, consider increasing inventory for Q3 to meet projected demand increase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Clients */}
          <div className="mt-20 border-t border-slate-200 pt-12">
            <p className="text-center text-sm font-medium text-slate-500 mb-8">TRUSTED BY INDUSTRY LEADERS</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                  <div className="bg-slate-600 rounded text-white flex items-center justify-center h-5 md:h-6 lg:h-8 w-24 md:w-28 lg:w-32">
                    <span className="text-xs md:text-sm font-medium">COMPANY {i+1}</span>
                  </div>
                </div>
              ))}
            </div>
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