import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { formatDistanceToNow } from 'date-fns';
import { updateComment, deleteComment } from '../services/api';

function Comment({ comment, postId, onCommentUpdated, onCommentDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [error, setError] = useState('');
  
  const currentUserId = localStorage.getItem('userId');
  const isOwner = currentUserId && parseInt(currentUserId) === comment.user_id;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setContent(comment.content);
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      const response = await updateComment(postId, comment.id, { content });
      onCommentUpdated(response.data);
      setIsEditing(false);
      setError('');
    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(postId, comment.id);
        onCommentDeleted(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2 }}>{comment.user?.name?.charAt(0) || 'U'}</Avatar>
          <Box>
            <Typography variant="subtitle1">
              {comment.user?.name || 'Anonymous'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(comment.created_at))} ago
            </Typography>
          </Box>
          {isOwner && !isEditing && (
            <Box sx={{ ml: 'auto' }}>
              <IconButton size="small" onClick={handleEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
        
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1">{comment.content}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default Comment;

