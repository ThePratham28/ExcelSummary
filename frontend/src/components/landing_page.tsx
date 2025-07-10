import React, { useState, useEffect } from 'react';
import { BarChart3, Upload, TrendingUp, Users, Shield, Sparkles, ArrowRight, FileSpreadsheet, PieChart, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExcelLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drop your Excel files (.xls or .xlsx) and watch the magic happen"
    },
    {
      icon: BarChart3,
      title: "Interactive Charts",
      description: "Generate stunning 2D and 3D visualizations with just a few clicks"
    },
    {
      icon: Sparkles,
      title: "AI Insights",
      description: "Get smart analytics and summary reports powered by AI"
    }
  ];

  const chartTypes = [
    { icon: BarChart3, name: "Bar Charts", color: "from-blue-500 to-cyan-500" },
    { icon: LineChart, name: "Line Charts", color: "from-green-500 to-emerald-500" },
    { icon: PieChart, name: "Pie Charts", color: "from-purple-500 to-pink-500" }
  ];
  const navigate=useNavigate();

  const onSign=()=>{
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Excel-inspired Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-px h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-green-400"></div>
          ))}
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Sign In Button */}
      <div className="absolute top-6 right-6 z-50">
        <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        onClick={onSign}>
          Sign In
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Hero Section */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl">
                <FileSpreadsheet className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent block">
              Excel Data
            </span>
            Into Insights
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Upload any Excel file and generate stunning interactive 2D and 3D charts. 
            Choose your axes, select chart types, and let AI provide smart insights—all in one powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 transition-all duration-500 hover:bg-gray-800/70 hover:border-gray-600 transform hover:scale-105 ${
                  activeFeature === index ? 'ring-2 ring-green-500/50' : ''
                }`}
              >
                <div className="mb-6 flex justify-center">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Types Preview */}
        <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Multiple Chart Types
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {chartTypes.map((chart, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 transition-all duration-500 hover:bg-gray-800/70 hover:border-gray-600 transform hover:scale-105"
              >
                <div className={`mb-4 flex justify-center p-6 rounded-xl bg-gradient-to-r ${chart.color} group-hover:scale-110 transition-transform duration-300`}>
                  <chart.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{chart.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Everything You Need
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-semibold">Excel Upload</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-semibold">Interactive Charts</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-semibold">User Dashboard</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-semibold">Admin Controls</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Visualize Your Data?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust our platform for their data visualization needs. 
              Start creating beautiful charts today.
            </p>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}