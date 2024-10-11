import React, { useState } from 'react';
import DataInputForm from './DataInputForm'; // Adjust the path if necessary

const YourParentComponent = () => {
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [region, setRegion] = useState('');
  const [altitude, setAltitude] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [waterAvailability, setWaterAvailability] = useState('');
  const [season, setSeason] = useState('');
  const [previousCrop, setPreviousCrop] = useState('');
  const [farmingMethod, setFarmingMethod] = useState('');
  const [equipment, setEquipment] = useState('');
  const [marketDemand, setMarketDemand] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      location,
      soilType,
      region,
      altitude,
      farmSize,
      waterAvailability,
      season,
      previousCrop,
      farmingMethod,
      equipment,
      marketDemand,
    });
  };

  console.log('setLocation:', setLocation); // Check if this is a function

  return (
    <DataInputForm
      location={location}
      setLocation={setLocation}
      soilType={soilType}
      setSoilType={setSoilType}
      region={region}
      setRegion={setRegion}
      altitude={altitude}
      setAltitude={setAltitude}
      farmSize={farmSize}
      setFarmSize={setFarmSize}
      waterAvailability={waterAvailability}
      setWaterAvailability={setWaterAvailability}
      season={season}
      setSeason={setSeason}
      previousCrop={previousCrop}
      setPreviousCrop={setPreviousCrop}
      farmingMethod={farmingMethod}
      setFarmingMethod={setFarmingMethod}
      equipment={equipment}
      setEquipment={setEquipment}
      marketDemand={marketDemand}
      setMarketDemand={setMarketDemand}
      handleSubmit={handleSubmit}
    />
  );
};

export default YourParentComponent;
