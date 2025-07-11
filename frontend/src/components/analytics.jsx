import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp,
  ArrowLeft,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart as RechartsLineChart, BarChart as RechartsBarChart, PieChart as RechartsPieChart, Line, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie } from 'recharts';
import ExcelAnalyzerNavbar from './navbar';
import axios from 'axios';

const AnalyticsPage = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    xAxis: '',
    yAxis: '',
    chartType: 'bar'
  });
  const [availableColumns, setAvailableColumns] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_BASE_URL;

  // Chart type options
  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: <BarChart3 className="w-4 h-4" /> },
    { value: 'line', label: 'Line Chart', icon: <LineChart className="w-4 h-4" /> },
    { value: 'pie', label: 'Pie Chart', icon: <PieChart className="w-4 h-4" /> },
    { value: 'area', label: 'Area Chart', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  // Colors for charts
  const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

  // Fetch file data and columns on component mount
  useEffect(() => {
    if (fileId) {
      fetchFileData();
    }
  }, [fileId]);

  const fetchFileData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/excel/${fileId}`);
      
      // Extract columns from the response
      if (response.data.columns) {
        setAvailableColumns(response.data.columns);
      } else if (response.data.data && response.data.data.length > 0) {
        // If data is array of objects, get keys from first object
        const firstRow = response.data.data[0];
        if (typeof firstRow === 'object' && firstRow !== null) {
          setAvailableColumns(Object.keys(firstRow));
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch file data:', err);
      setError('Failed to load file data. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Please enter a chart title');
      return false;
    }
    if (!formData.xAxis) {
      setError('Please select an X-axis column');
      return false;
    }
    if (!formData.yAxis) {
      setError('Please select a Y-axis column');
      return false;
    }
    if (!formData.chartType) {
      setError('Please select a chart type');
      return false;
    }
    return true;
  };

  const generateChart = async () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await axios.post(`${API_URL}/charts/data/${fileId}`, {
        title: formData.title,
        xAxis: formData.xAxis,
        yAxis: formData.yAxis,
        chartType: formData.chartType
      });
      
      // Transform the API response data to match what the chart expects
      const transformedData = response.data.data.map(item => ({
        [formData.xAxis]: item.x,
        [formData.yAxis]: item.y
      }));
      
      // Update the chart data with transformed data
      setChartData({
        ...response.data,
        data: transformedData
      });
      
      setSuccess(true);
      setIsGenerating(false);
      
    } catch (err) {
      console.error('Failed to generate chart:', err);
      setError(err.response?.data?.message || 'Failed to generate chart. Please try again.');
      setIsGenerating(false);
    }
  };

  const renderChart = () => {
    if (!chartData || !chartData.data) return null;

    const data = chartData.data;

    switch (formData.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsBarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey={formData.xAxis} 
                stroke="#9ca3af"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Legend />
              <Bar 
                dataKey={formData.yAxis} 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey={formData.xAxis} 
                stroke="#9ca3af"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={formData.yAxis} 
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey={formData.yAxis}
                nameKey={formData.xAxis}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey={formData.xAxis} 
                stroke="#9ca3af"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={formData.yAxis} 
                stroke="#10b981"
                strokeWidth={3}
                fill="#10b981"
                fillOpacity={0.3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-gray-400">Chart type not supported</div>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navbar */}
      <ExcelAnalyzerNavbar />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/upload_file')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-gray-400">File ID: {fileId}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={fetchFileData}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Configuration Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Chart Configuration</span>
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Chart Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Chart Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter chart title"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    />
                  </div>

                  {/* X-Axis Column */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      X-Axis Column
                    </label>
                    <select
                      name="xAxis"
                      value={formData.xAxis}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400"
                    >
                      <option value="">Select X-Axis</option>
                      {availableColumns.map(column => (
                        <option key={column} value={column}>{column}</option>
                      ))}
                    </select>
                  </div>

                  {/* Y-Axis Column */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Y-Axis Column
                    </label>
                    <select
                      name="yAxis"
                      value={formData.yAxis}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400"
                    >
                      <option value="">Select Y-Axis</option>
                      {availableColumns.map(column => (
                        <option key={column} value={column}>{column}</option>
                      ))}
                    </select>
                  </div>

                  {/* Chart Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Chart Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {chartTypes.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, chartType: type.value }))}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                            formData.chartType === type.value
                              ? 'bg-green-600 border-green-400 text-white'
                              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {type.icon}
                          <span className="text-sm">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={generateChart}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-5 h-5" />
                        <span>Generate Chart</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center space-x-2 p-3 bg-green-900/50 border border-green-500/50 rounded-lg mt-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 text-sm">Chart generated successfully!</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-900/50 border border-red-500/50 rounded-lg mt-4">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Chart Display */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {formData.title || 'Chart Preview'}
                </h2>
                {chartData && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Data Points: {chartData.dataPoints || 0}</span>
                    {chartData.generatedAt && (
                      <span>• Generated: {new Date(chartData.generatedAt).toLocaleString()}</span>
                    )}
                  </div>
                )}
              </div>

              {chartData ? (
                <div className="bg-gray-900/50 rounded-xl p-4">
                  {renderChart()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-900/50 rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No chart generated yet</p>
                    <p className="text-gray-500 text-sm">Configure your chart settings and click generate</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;