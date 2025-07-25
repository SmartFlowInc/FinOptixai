import React from 'react';
import { ArrowRight, Database, Cloud, Shield, Cpu, Globe, Users, BarChart3, Zap, Settings } from 'lucide-react';

const SystemArchitecture = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            FinOptix System Architecture
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enterprise-grade financial planning platform built with modern microservices architecture,
            AI-powered analytics, and real-time collaboration capabilities
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
          <svg
            viewBox="0 0 1200 800"
            className="w-full h-auto"
            style={{ maxHeight: '600px' }}
          >
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
              
              {/* Gradients */}
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              
              <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            
            <rect width="1200" height="800" fill="url(#grid)" opacity="0.5"/>

            {/* Client Layer */}
            <g>
              <rect x="50" y="50" width="1100" height="120" fill="url(#blueGradient)" rx="10" opacity="0.1"/>
              <text x="70" y="80" className="fill-blue-700 font-bold text-lg">Client Layer</text>
              
              {/* Web App */}
              <rect x="80" y="100" width="200" height="60" fill="url(#blueGradient)" rx="8"/>
              <text x="180" y="125" className="fill-white font-semibold text-center" textAnchor="middle">React Frontend</text>
              <text x="180" y="140" className="fill-blue-100 text-sm text-center" textAnchor="middle">TypeScript • Tailwind</text>
              
              {/* Mobile App */}
              <rect x="320" y="100" width="200" height="60" fill="url(#blueGradient)" rx="8"/>
              <text x="420" y="125" className="fill-white font-semibold text-center" textAnchor="middle">Mobile Dashboard</text>
              <text x="420" y="140" className="fill-blue-100 text-sm text-center" textAnchor="middle">PWA • Responsive</text>
              
              {/* Desktop App */}
              <rect x="560" y="100" width="200" height="60" fill="url(#blueGradient)" rx="8"/>
              <text x="660" y="125" className="fill-white font-semibold text-center" textAnchor="middle">Desktop Client</text>
              <text x="660" y="140" className="fill-blue-100 text-sm text-center" textAnchor="middle">Electron • Native</text>
              
              {/* API Dashboard */}
              <rect x="800" y="100" width="200" height="60" fill="url(#blueGradient)" rx="8"/>
              <text x="900" y="125" className="fill-white font-semibold text-center" textAnchor="middle">API Dashboard</text>
              <text x="900" y="140" className="fill-blue-100 text-sm text-center" textAnchor="middle">GraphQL • REST</text>
            </g>

            {/* Load Balancer */}
            <g>
              <rect x="450" y="220" width="300" height="50" fill="url(#greenGradient)" rx="25"/>
              <text x="600" y="240" className="fill-white font-semibold text-center" textAnchor="middle">Load Balancer</text>
              <text x="600" y="255" className="fill-green-100 text-sm text-center" textAnchor="middle">NGINX • Auto-scaling • SSL Termination</text>
            </g>

            {/* API Gateway */}
            <g>
              <rect x="400" y="310" width="400" height="60" fill="url(#purpleGradient)" rx="10"/>
              <text x="600" y="335" className="fill-white font-bold text-center" textAnchor="middle">API Gateway</text>
              <text x="600" y="350" className="fill-purple-100 text-sm text-center" textAnchor="middle">Rate Limiting • Authentication • Request Routing</text>
            </g>

            {/* Microservices Layer */}
            <g>
              <rect x="50" y="420" width="1100" height="180" fill="url(#orangeGradient)" rx="10" opacity="0.1"/>
              <text x="70" y="450" className="fill-orange-700 font-bold text-lg">Microservices Layer</text>
              
              {/* Auth Service */}
              <rect x="80" y="470" width="160" height="80" fill="url(#orangeGradient)" rx="8"/>
              <text x="160" y="495" className="fill-white font-semibold text-center" textAnchor="middle">Auth Service</text>
              <text x="160" y="510" className="fill-orange-100 text-xs text-center" textAnchor="middle">OAuth 2.0</text>
              <text x="160" y="525" className="fill-orange-100 text-xs text-center" textAnchor="middle">JWT Tokens</text>
              <text x="160" y="540" className="fill-orange-100 text-xs text-center" textAnchor="middle">RBAC</text>
              
              {/* Financial Service */}
              <rect x="260" y="470" width="160" height="80" fill="url(#orangeGradient)" rx="8"/>
              <text x="340" y="495" className="fill-white font-semibold text-center" textAnchor="middle">Financial Service</text>
              <text x="340" y="510" className="fill-orange-100 text-xs text-center" textAnchor="middle">Budget Analysis</text>
              <text x="340" y="525" className="fill-orange-100 text-xs text-center" textAnchor="middle">Forecasting</text>
              <text x="340" y="540" className="fill-orange-100 text-xs text-center" textAnchor="middle">KPI Tracking</text>
              
              {/* AI Service */}
              <rect x="440" y="470" width="160" height="80" fill="url(#orangeGradient)" rx="8"/>
              <text x="520" y="495" className="fill-white font-semibold text-center" textAnchor="middle">AI Service</text>
              <text x="520" y="510" className="fill-orange-100 text-xs text-center" textAnchor="middle">GPT-4o</text>
              <text x="520" y="525" className="fill-orange-100 text-xs text-center" textAnchor="middle">Anomaly Detection</text>
              <text x="520" y="540" className="fill-orange-100 text-xs text-center" textAnchor="middle">Insights Engine</text>
              
              {/* Notification Service */}
              <rect x="620" y="470" width="160" height="80" fill="url(#orangeGradient)" rx="8"/>
              <text x="700" y="495" className="fill-white font-semibold text-center" textAnchor="middle">Notification</text>
              <text x="700" y="510" className="fill-orange-100 text-xs text-center" textAnchor="middle">Real-time Alerts</text>
              <text x="700" y="525" className="fill-orange-100 text-xs text-center" textAnchor="middle">Email & SMS</text>
              <text x="700" y="540" className="fill-orange-100 text-xs text-center" textAnchor="middle">WebSocket</text>
              
              {/* Integration Service */}
              <rect x="800" y="470" width="160" height="80" fill="url(#orangeGradient)" rx="8"/>
              <text x="880" y="495" className="fill-white font-semibold text-center" textAnchor="middle">Integration</text>
              <text x="880" y="510" className="fill-orange-100 text-xs text-center" textAnchor="middle">APIs</text>
              <text x="880" y="525" className="fill-orange-100 text-xs text-center" textAnchor="middle">Data Sources</text>
              <text x="880" y="540" className="fill-orange-100 text-xs text-center" textAnchor="middle">ETL Pipelines</text>
              
              {/* Collaboration Service */}
              <rect x="980" y="470" width="160" height="80" fill="url(#orangeGradient)" rx="8"/>
              <text x="1060" y="495" className="fill-white font-semibold text-center" textAnchor="middle">Collaboration</text>
              <text x="1060" y="510" className="fill-orange-100 text-xs text-center" textAnchor="middle">Workflows</text>
              <text x="1060" y="525" className="fill-orange-100 text-xs text-center" textAnchor="middle">Comments</text>
              <text x="1060" y="540" className="fill-orange-100 text-xs text-center" textAnchor="middle">Approvals</text>
            </g>

            {/* Data Layer */}
            <g>
              <rect x="50" y="650" width="1100" height="120" fill="url(#greenGradient)" rx="10" opacity="0.1"/>
              <text x="70" y="680" className="fill-green-700 font-bold text-lg">Data Layer</text>
              
              {/* PostgreSQL */}
              <rect x="120" y="700" width="180" height="60" fill="url(#greenGradient)" rx="8"/>
              <text x="210" y="725" className="fill-white font-semibold text-center" textAnchor="middle">PostgreSQL</text>
              <text x="210" y="740" className="fill-green-100 text-sm text-center" textAnchor="middle">Primary Database</text>
              
              {/* Redis Cache */}
              <rect x="320" y="700" width="180" height="60" fill="url(#greenGradient)" rx="8"/>
              <text x="410" y="725" className="fill-white font-semibold text-center" textAnchor="middle">Redis Cache</text>
              <text x="410" y="740" className="fill-green-100 text-sm text-center" textAnchor="middle">Session & Cache</text>
              
              {/* Data Warehouse */}
              <rect x="520" y="700" width="180" height="60" fill="url(#greenGradient)" rx="8"/>
              <text x="610" y="725" className="fill-white font-semibold text-center" textAnchor="middle">Data Warehouse</text>
              <text x="610" y="740" className="fill-green-100 text-sm text-center" textAnchor="middle">Analytics & BI</text>
              
              {/* File Storage */}
              <rect x="720" y="700" width="180" height="60" fill="url(#greenGradient)" rx="8"/>
              <text x="810" y="725" className="fill-white font-semibold text-center" textAnchor="middle">File Storage</text>
              <text x="810" y="740" className="fill-green-100 text-sm text-center" textAnchor="middle">Documents & Assets</text>
              
              {/* Backup System */}
              <rect x="920" y="700" width="180" height="60" fill="url(#greenGradient)" rx="8"/>
              <text x="1010" y="725" className="fill-white font-semibold text-center" textAnchor="middle">Backup System</text>
              <text x="1010" y="740" className="fill-green-100 text-sm text-center" textAnchor="middle">Automated Backup</text>
            </g>

            {/* Connection Lines */}
            {/* Client to Load Balancer */}
            <line x1="180" y1="160" x2="550" y2="220" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="420" y1="160" x2="580" y2="220" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="660" y1="160" x2="620" y2="220" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="900" y1="160" x2="650" y2="220" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            
            {/* Load Balancer to API Gateway */}
            <line x1="600" y1="270" x2="600" y2="310" stroke="#6b7280" strokeWidth="3" markerEnd="url(#arrowhead)"/>
            
            {/* API Gateway to Services */}
            <line x1="600" y1="370" x2="160" y2="470" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="600" y1="370" x2="340" y2="470" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="600" y1="370" x2="520" y2="470" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="600" y1="370" x2="700" y2="470" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="600" y1="370" x2="880" y2="470" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="600" y1="370" x2="1060" y2="470" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            
            {/* Services to Data Layer */}
            <line x1="160" y1="550" x2="210" y2="700" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="340" y1="550" x2="410" y2="700" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="520" y1="550" x2="610" y2="700" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="700" y1="550" x2="810" y2="700" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="880" y1="550" x2="1010" y2="700" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>

            {/* Arrow marker definition */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280"/>
              </marker>
            </defs>
          </svg>
        </div>

        {/* Technical Specifications */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Performance Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-yellow-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Performance</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Response Time:</strong> &lt; 200ms</li>
              <li>• <strong>Throughput:</strong> 10K req/sec</li>
              <li>• <strong>Availability:</strong> 99.9% uptime</li>
              <li>• <strong>Data Processing:</strong> 50M+ data points</li>
              <li>• <strong>Concurrent Users:</strong> 10,000+</li>
            </ul>
          </div>

          {/* Security Features */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Security</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Authentication:</strong> OAuth 2.0 + MFA</li>
              <li>• <strong>Encryption:</strong> AES-256 at rest</li>
              <li>• <strong>Transport:</strong> TLS 1.3</li>
              <li>• <strong>Compliance:</strong> SOC 2 Type II</li>
              <li>• <strong>Access Control:</strong> RBAC + ABAC</li>
            </ul>
          </div>

          {/* Scalability */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <Cloud className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Scalability</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Auto-scaling:</strong> Kubernetes HPA</li>
              <li>• <strong>Load Balancing:</strong> Multi-region</li>
              <li>• <strong>CDN:</strong> Global edge locations</li>
              <li>• <strong>Database:</strong> Read replicas</li>
              <li>• <strong>Caching:</strong> Multi-layer strategy</li>
            </ul>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Technology Stack</h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Frontend */}
            <div>
              <h4 className="font-bold text-blue-600 mb-3">Frontend</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>React 18.2.0</li>
                <li>TypeScript 5.0</li>
                <li>Tailwind CSS 3.3</li>
                <li>Vite 4.4</li>
                <li>Wouter (Routing)</li>
                <li>TanStack Query</li>
                <li>Framer Motion</li>
                <li>Nivo Charts</li>
              </ul>
            </div>

            {/* Backend */}
            <div>
              <h4 className="font-bold text-green-600 mb-3">Backend</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Node.js 20 LTS</li>
                <li>Express 4.18</li>
                <li>TypeScript 5.0</li>
                <li>Drizzle ORM</li>
                <li>Passport.js</li>
                <li>OpenAI API</li>
                <li>WebSocket (ws)</li>
                <li>Zod Validation</li>
              </ul>
            </div>

            {/* Database */}
            <div>
              <h4 className="font-bold text-purple-600 mb-3">Database</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>PostgreSQL 15</li>
                <li>Redis 7.0</li>
                <li>Neon Serverless</li>
                <li>Connection Pooling</li>
                <li>Automated Backups</li>
                <li>Read Replicas</li>
                <li>Data Encryption</li>
                <li>Migration Tools</li>
              </ul>
            </div>

            {/* DevOps */}
            <div>
              <h4 className="font-bold text-orange-600 mb-3">DevOps</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Docker</li>
                <li>Kubernetes</li>
                <li>GitHub Actions</li>
                <li>NGINX</li>
                <li>Prometheus</li>
                <li>Grafana</li>
                <li>ELK Stack</li>
                <li>Terraform</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Flow */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Data Flow Architecture</h3>
          
          <div className="grid md:grid-cols-5 gap-4 items-center">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold">User Input</h4>
              <p className="text-sm text-gray-600">Financial data entry</p>
            </div>
            
            <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <Cpu className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold">Processing</h4>
              <p className="text-sm text-gray-600">AI analysis & validation</p>
            </div>
            
            <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <Database className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold">Storage</h4>
              <p className="text-sm text-gray-600">Secure data persistence</p>
            </div>
          </div>
          
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold">Analytics</h4>
              <p className="text-sm text-gray-600">Real-time insights</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <Globe className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="font-semibold">Distribution</h4>
              <p className="text-sm text-gray-600">Multi-channel delivery</p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <Settings className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="font-semibold">Optimization</h4>
              <p className="text-sm text-gray-600">Continuous improvement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitecture;