import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { createComment } from '../services/api';

function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isLoggedIn = !!localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await createComment(postId, { content });
      onCommentAdded(response.data);
      setContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Alert severity="info">
        Please log in to leave a comment.
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Leave a Comment
      </Typography>
      
      <TextField
        fullWidth
        label="Your comment"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={!!error}
        helperText={error}
        sx={{ mb: 2 }}
      />
      
      <Button 
        type="submit" 
        variant="contained" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Post Comment'}
      </Button>
    </Box>
  );
}

export default CommentForm;

