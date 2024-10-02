import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography, Box, Paper } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';

const ReportDownload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async (format) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/generate-report/${format}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `agricultural_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} className="p-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl shadow-2xl">
      <Typography variant="h4" className="text-gray-800 font-bold mb-6 text-center">
        Download Reports
      </Typography>
      <Box className="flex flex-col sm:flex-row gap-6 justify-center">
        <Button
          variant="contained"
          className="bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          startIcon={<PictureAsPdfIcon />}
          onClick={() => handleDownload('pdf')}
          disabled={loading}
          fullWidth
          size="large"
        >
          Download PDF
        </Button>
        <Button
          variant="contained"
          className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          startIcon={<TableChartIcon />}
          onClick={() => handleDownload('xlsx')}
          disabled={loading}
          fullWidth
          size="large"
        >
          Download Excel
        </Button>
      </Box>
      {loading && (
        <Box className="flex justify-center mt-6">
          <CircularProgress size={36} className="text-green-600" />
        </Box>
      )}
      {error && (
        <Typography color="error" className="mt-6 text-center text-lg font-semibold">
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default ReportDownload;
