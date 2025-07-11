import { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Eye, 
  BarChart3, 
  CheckCircle, 
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExcelAnalyzerNavbar from './navbar';
import axios from 'axios';

const ExcelUploadComponent = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const fileInputRef = useRef(null);

  // Accepted file types
  const acceptedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];

  const validateFile = (file) => {
    if (!file) return false;
    
    // Check file type
    if (!acceptedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError('Please upload only Excel files (.xlsx, .xls) or CSV files');
      return false;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return false;
    }
    
    return true;
  };

  const processFile = async (file) => {
    if (!validateFile(file)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Just set the selected file for now, don't upload yet
      setSelectedFile(file);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to process file. Please try again.');
      setIsLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_BASE_URL;

  const uploadFileToAPI = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await axios.post(`${API_URL}/excel/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setApiResponse(response.data);
      setUploadedFile(selectedFile);
      setIsUploading(false);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
      setIsUploading(false);
    }
  };

  const fetchPreviewData = async () => {
    if (!apiResponse?.fileId) return;
    
    setIsLoadingPreview(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/excel/${apiResponse.fileId}`);
      
      // Transform the API response to match our preview format
      const transformedData = {
        sheets: response.data.sheets || ['Sheet1'],
        rows: response.data.totalRows || response.data.data?.length || 0,
        columns: response.data.columns?.length || Object.keys(response.data.data?.[0] || {}).length || 0,
        preview: []
      };

      // Create preview array with headers and data
      if (response.data.columns && response.data.data) {
        // Add headers as first row
        transformedData.preview.push(response.data.columns);
        
        // Add data rows (limit to first 10 rows for preview)
        const previewRows = response.data.data.slice(0, 10);
        previewRows.forEach(row => {
          const rowData = response.data.columns.map(column => row[column] || '');
          transformedData.preview.push(rowData);
        });
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Handle case where data is array of arrays
        transformedData.preview = response.data.data.slice(0, 11); // Headers + 10 rows
      }
      
      setPreviewData(transformedData);
      setIsPreviewOpen(true);
      setIsLoadingPreview(false);
      
    } catch (err) {
      console.error('Failed to fetch preview data:', err);
      setError(err.response?.data?.message || 'Failed to fetch preview data. Please try again.');
      setIsLoadingPreview(false);
    }
  };

  const handlePreview = () => {
    if (!uploadedFile || !apiResponse) return;
    fetchPreviewData();
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAnalyze = () => {
    if (!uploadedFile || !apiResponse) return;
    
    // Navigate to analytics page with fileId
    navigate(`/analytics/${apiResponse.fileId}`);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    setPreviewData(null);
    setIsPreviewOpen(false);
    setError(null);
    setApiResponse(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
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

      {/* Navbar */}
      <ExcelAnalyzerNavbar />

      <div className="flex items-center justify-center p-4 pt-8 relative z-10">
        <div className="w-full max-w-4xl">
          {/* Upload Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-green-400/30 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Upload Excel File</h2>
              <p className="text-gray-400">Upload your Excel spreadsheet for advanced analysis</p>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-green-400 bg-green-400/10'
                  : selectedFile || uploadedFile
                  ? 'border-green-400 bg-green-400/5'
                  : 'border-gray-600 hover:border-green-400/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Processing file...</p>
                </div>
              ) : isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Uploading to server...</p>
                </div>
              ) : uploadedFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{uploadedFile.name}</h3>
                  <p className="text-gray-400 mb-2">{formatFileSize(uploadedFile.size)}</p>
                  {apiResponse && (
                    <p className="text-green-400 text-sm mb-4">
                      File ID: {apiResponse.fileId} • {apiResponse.columns.length} columns detected
                    </p>
                  )}
                  <div className="flex space-x-4">
                    <button
                      onClick={handlePreview}
                      disabled={isLoadingPreview}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      {isLoadingPreview ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Preview</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleAnalyze}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Analyze</span>
                    </button>
                    <button
                      onClick={resetUpload}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{selectedFile.name}</h3>
                  <p className="text-gray-400 mb-4">{formatFileSize(selectedFile.size)}</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={uploadFileToAPI}
                      disabled={isUploading}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload</span>
                    </button>
                    <button
                      onClick={resetUpload}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Drag & drop your Excel file here
                  </h3>
                  <p className="text-gray-400 mb-4">or click to browse</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Choose File</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: .xlsx, .xls, .csv (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-900/50 border border-red-500/50 rounded-lg mt-4">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && previewData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl border border-green-400/30 max-w-6xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-white">File Preview</h3>
                <p className="text-gray-400">
                  {previewData.rows} rows × {previewData.columns} columns
                </p>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-auto max-h-[60vh]">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">Data Preview</h4>
                <p className="text-gray-400 text-sm">
                  Showing first {Math.min(previewData.preview.length - 1, 10)} rows of data
                </p>
              </div>
              
              {previewData.preview.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-600 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-700">
                        {previewData.preview[0]?.map((header, index) => (
                          <th
                            key={index}
                            className="px-4 py-3 text-left text-sm font-medium text-gray-200 border-r border-gray-600 last:border-r-0"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.preview.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-gray-600">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-3 text-sm text-gray-300 border-r border-gray-600 last:border-r-0"
                            >
                              {cell || ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No data available to preview
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  handleAnalyze();
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analyze Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploadComponent;