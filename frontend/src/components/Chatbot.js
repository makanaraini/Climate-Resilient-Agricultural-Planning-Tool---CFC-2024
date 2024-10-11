import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state

  const handleSend = async () => {
    if (!input) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    setLoading(true); // Set loading to true

    // Send message to your Flask backend
    try {
      const response = await fetch('http://localhost:5000/chatbot', {  // Adjust the URL if necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      if (response.ok) {
        const botMessage = data.response; // Adjust based on your response structure
        setMessages((prev) => [...prev, { text: botMessage, sender: 'bot' }]);
      } else {
        console.error('Error from chatbot:', data.error);
        setMessages((prev) => [...prev, { text: 'Error: ' + data.error, sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setMessages((prev) => [...prev, { text: 'Error: Unable to send message', sender: 'bot' }]);
    } finally {
      setLoading(false); // Reset loading state
    }

    setInput(''); // Clear input
  };

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 2 }}>
      <Typography variant="h6">Chat with Assistant</Typography>
      <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
        {messages.map((msg, index) => (
          <Typography key={index} align={msg.sender === 'user' ? 'right' : 'left'}>
            <strong>{msg.sender === 'user' ? 'You' : 'Assistant'}:</strong> {msg.text}
          </Typography>
        ))}
        {loading && <CircularProgress size={24} sx={{ margin: '16px auto', display: 'block' }} />} {/* Loading indicator */}
      </Box>
      <TextField
        label="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      />
      <Button variant="contained" onClick={handleSend} disabled={loading}>
        Send
      </Button>
    </Box>
  );
};

export default Chatbot;
