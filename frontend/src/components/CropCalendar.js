import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Tooltip } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';

const localizer = momentLocalizer(moment);

// Define a color map for different crop types
const cropColors = {
  'Corn': '#FFA500',
  'Wheat': '#FFD700',
  'Soybean': '#90EE90',
  'Rice': '#87CEFA',
  // Add more crops and colors as needed
};

function CropCalendar({ plans, onUpdatePlan, weatherForecast }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedPlan, setEditedPlan] = useState(null);

  const events = plans.map(plan => ({
    title: `Plant ${plan.crop}`,
    start: new Date(plan.planting_date),
    end: new Date(plan.planting_date),
    allDay: true,
    resource: plan,
  }));

  const weatherEvents = weatherForecast.map(forecast => ({
    title: `${forecast.main.temp}°C, ${forecast.weather[0].main}`,
    start: new Date(forecast.dt * 1000),
    end: new Date(forecast.dt * 1000),
    allDay: true,
    resource: forecast,
  }));

  const allEvents = [...events, ...weatherEvents];

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEditedPlan({ ...event.resource });
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
    setEditedPlan(null);
  };

  const handleSaveChanges = () => {
    onUpdatePlan(editedPlan);
    handleCloseDialog();
  };

  const handleInputChange = (e) => {
    setEditedPlan({ ...editedPlan, [e.target.name]: e.target.value });
  };

  const eventStyleGetter = (event) => {
    if (event.resource.crop) {
      const backgroundColor = cropColors[event.resource.crop] || '#3174ad';
      return { style: { backgroundColor } };
    }
    return {};
  };

  const EventComponent = ({ event }) => {
    if (event.resource.crop) {
      return <span>{event.title}</span>;
    }
    return (
      <Tooltip title={event.title}>
        <span>
          {event.resource.weather[0].main === 'Clear' ? <WbSunnyIcon /> : <CloudIcon />}
        </span>
      </Tooltip>
    );
  };

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent,
        }}
      />
      <Dialog open={!!selectedEvent} onClose={handleCloseDialog}>
        <DialogTitle>Edit Crop Plan</DialogTitle>
        <DialogContent>
          {editedPlan && (
            <>
              <TextField
                name="crop"
                label="Crop"
                value={editedPlan.crop}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="area"
                label="Area (hectares)"
                type="number"
                value={editedPlan.area}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="planting_date"
                label="Planting Date"
                type="date"
                value={editedPlan.planting_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CropCalendar;
