import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function DataExport({ weatherData, cropData }) {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Weather Data', 20, 10);
    doc.autoTable({
      head: [['Date', 'Max Temperature', 'Precipitation']],
      body: weatherData.map(item => [item.date, item.temperature_max, item.precipitation]),
    });
    doc.text('Crop Data', 20, 50);
    doc.autoTable({
      head: [['Crop Name', 'Yield', 'Date']],
      body: cropData.map(item => [item.crop_name, item.yield, item.date]),
    });
    doc.save('report.pdf');
  };

  return (
    <Button variant="contained" color="primary" onClick={exportPDF}>
      Download Report
    </Button>
  );
}

export default DataExport;
