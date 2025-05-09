import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { getPost } from '../services/api';
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const currentUserId = localStorage.getItem('userId');
  const isOwner = post && currentUserId && parseInt(currentUserId) === post.user_id;

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await getPost(id);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setPost({
      ...post,
      comments: [newComment, ...post.comments]
    });
  };

  const handleCommentUpdated = (updatedComment) => {
    setPost({
      ...post,
      comments: post.comments.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    });
  };

  const handleCommentDeleted = (commentId) => {
    setPost({
      ...post,
      comments: post.comments.filter(comment => comment.id !== commentId)
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!post) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Post not found.
      </Alert>
    );
  }

  return (
    <Box>
      {post.featured_image && (
        <Box 
          component="img"
          src={post.featured_image}
          alt={post.title}
          sx={{ 
            width: '100%', 
            height: 400, 
            objectFit: 'cover',
            borderRadius: 1,
            mb: 3
          }}
        />
      )}

      <Typography variant="h3" component="h1" gutterBottom>
        {post.title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Chip 
          label={post.category?.name || 'Uncategorized'} 
          color="primary" 
          component={RouterLink}
          to={`/categories/${post.category?.id}`}
          sx={{ mr: 2, cursor: 'pointer' }}
        />
        
        <Typography variant="body2" color="text.secondary">
          By {post.user?.name || 'Anonymous'} • 
          {post.published_at && ` Published on ${format(new Date(post.published_at), 'MMMM d, yyyy')}`}
        </Typography>

        {isOwner && (
          <Button 
            startIcon={<EditIcon />}
            component={RouterLink}
            to={`/edit-post/${post.id}`}
            sx={{ ml: 'auto' }}
          >
            Edit
          </Button>
        )}
      </Box>

      <Typography variant="body1" paragraph>
        {post.content}
      </Typography>

      <Divider sx={{ my: 4 }} />

      <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />

      <Typography variant="h5" gutterBottom>
        Comments ({post.comments.length})
      </Typography>

      {post.comments.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No comments yet. Be the first to comment!
        </Alert>
      ) : (
        post.comments.map(comment => (
          <Comment 
            key={comment.id} 
            comment={comment} 
            postId={post.id}
            onCommentUpdated={handleCommentUpdated}
            onCommentDeleted={handleCommentDeleted}
          />
        ))
      )}
    </Box>
  );
}

export default PostDetail;

