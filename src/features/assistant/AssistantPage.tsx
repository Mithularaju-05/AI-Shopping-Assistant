import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, Avatar, Button, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import { useSendMessageMutation } from '../../services/assistantApi';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AssistantPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: 'Hello! I\'m your AI shopping assistant. How can I help you today?',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input
    setMessage('');

    try {
      // Send message to backend
      const response = await sendMessage({
        userId: 'demo-user', // In a real app, get this from auth context
        message: message,
      }).unwrap();

      // Add assistant's response to chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again later.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, upload the image and get a URL
    const imageUrl = URL.createObjectURL(file);
    
    // For demo purposes, we'll just show a message
    const imageMessage: Message = {
      id: Date.now().toString(),
      content: `[Image: ${file.name}]`,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, imageMessage]);
    
    // Here you would typically call the visual search API
    // and show the results in the chat
  };

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          mb: 2, 
          overflow: 'auto',
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            {msg.sender === 'assistant' && (
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1, alignSelf: 'flex-end' }}>
                AI
              </Avatar>
            )}
            <Paper
              sx={{
                p: 2,
                maxWidth: '70%',
                backgroundColor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                borderRadius: 4,
                borderBottomRightRadius: msg.sender === 'user' ? 4 : 0,
                borderBottomLeftRadius: msg.sender === 'assistant' ? 4 : 0,
              }}
            >
              <Typography variant="body1">{msg.content}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'right',
                  color: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                  mt: 0.5,
                }}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Paper>
            {msg.sender === 'user' && (
              <Avatar sx={{ bgcolor: 'secondary.main', ml: 1, alignSelf: 'flex-end' }}>
                U
              </Avatar>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-image"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="upload-image">
          <IconButton color="primary" component="span">
            <ImageIcon />
          </IconButton>
        </label>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '28px',
              backgroundColor: 'background.paper',
            },
          }}
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          sx={{
            borderRadius: '28px',
            minWidth: '100px',
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          }}
          endIcon={isLoading ? <div className="loading-spinner" /> : <SendIcon />}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </Box>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          AI Assistant may produce inaccurate information. Check important info.
        </Typography>
      </Box>
    </Box>
  );
};

export default AssistantPage;
