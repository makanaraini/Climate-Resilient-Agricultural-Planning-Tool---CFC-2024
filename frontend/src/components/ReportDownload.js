import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

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
        responseType: 'blob', // Important for file download
      });

      // Create a blob from the response data
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
    <div>
      <Typography variant="h6" gutterBottom>Download Reports</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FileDownloadIcon />}
        onClick={() => handleDownload('pdf')}
        disabled={loading}
        style={{ marginRight: '10px' }}
      >
        Download PDF
      </Button>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<FileDownloadIcon />}
        onClick={() => handleDownload('xlsx')}
        disabled={loading}
      >
        Download Excel
      </Button>
      {loading && <CircularProgress size={24} style={{ marginLeft: '10px' }} />}
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default ReportDownload;
