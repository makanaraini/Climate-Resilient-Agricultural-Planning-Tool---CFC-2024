import React from 'react';
import { Button } from '@mui/material';

function DataExport({ weatherData, cropData }) {
  const exportData = () => {
    const weatherCSV = convertToCSV(weatherData);
    const cropCSV = convertToCSV(cropData);

    const blob = new Blob([weatherCSV, '\n\n', cropCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'farm_data_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = `${Object.keys(array[0]).join(',')}\r\n`;

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line !== '') line += ',';
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  };

  return (
    <Button variant="contained" color="primary" onClick={exportData}>
      Export Data
    </Button>
  );
}

export default DataExport;