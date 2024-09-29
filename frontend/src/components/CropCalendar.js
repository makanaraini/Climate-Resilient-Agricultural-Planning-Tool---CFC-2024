import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar.js'; // Added .js extension
import moment from 'moment.js'; // Added .js extension
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Tooltip, Paper, Typography } from '@mui/material/index.js';
import WbSunnyIcon from '@mui/icons-material/WbSunny.js';
import CloudIcon from '@mui/icons-material/Cloud.js';
import { styled } from '@mui/material/styles/index.js';

const localizer = momentLocalizer(moment);

// Define a color map for different crop types
const cropColors = {
  'Corn': '#FFA500',
  'Wheat': '#FFD700',
  'Soybean': '#90EE90',
  'Rice': '#87CEFA',
  // Add more crops and colors as needed
};

const StyledCalendarContainer = styled(Paper)(({ theme }) => ({
  height: '500px',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const StyledCalendar = styled(Calendar)(({ theme }) => ({
  '& .rbc-header': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1),
  },
  '& .rbc-event': {
    borderRadius: theme.shape.borderRadius,
  },
  '& .rbc-today': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
}));

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
      return <Typography variant="body2">{event.title}</Typography>;
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
    <StyledCalendarContainer>
      <StyledCalendar
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
      <StyledDialog open={!!selectedEvent} onClose={handleCloseDialog}>
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
                variant="outlined"
              />
              <TextField
                name="area"
                label="Area (hectares)"
                type="number"
                value={editedPlan.area}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                name="planting_date"
                label="Planting Date"
                type="date"
                value={editedPlan.planting_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSaveChanges} color="primary" variant="contained">Save Changes</Button>
        </DialogActions>
      </StyledDialog>
    </StyledCalendarContainer>
  );
}

export default CropCalendar;
