import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { getPost, getCategories, updatePost, deletePost } from '../services/api';

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingData, setFetchingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setFetchingData(true);
      
      try {
        // Fetch post and categories in parallel
        const [postResponse, categoriesResponse] = await Promise.all([
          getPost(id),
          getCategories()
        ]);
        
        const post = postResponse.data;
        
        // Set form values
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setFeaturedImage(post.featured_image || '');
        setCategoryId(post.category_id.toString());
        setIsPublished(post.is_published);
        
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load post data. Please try again later.');
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content || !categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await updatePost(id, {
        title,
        content,
        excerpt,
        featured_image: featuredImage,
        category_id: categoryId,
        is_published: isPublished
      });
      
      navigate(`/posts/${response.data.id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        setError(validationErrors.join(', '));
      } else {
        setError(error.response?.data?.message || 'Failed to update post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePost(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Failed to delete post. Please try again.');
      }
    }
  };

  if (fetchingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Post
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Post Title"
          name="title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="normal"
          fullWidth
          id="excerpt"
          label="Excerpt (optional)"
          name="excerpt"
          multiline
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          sx={{ mb: 2 }}
          helperText="A short summary of your post"
        />
        
        <TextField
          margin="normal"
          fullWidth
          id="featuredImage"
          label="Featured Image URL (optional)"
          name="featuredImage"
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          select
          id="category"
          label="Category"
          name="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          sx={{ mb: 2 }}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="content"
          label="Post Content"
          name="content"
          multiline
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              name="isPublished"
              color="primary"
            />
          }
          label={isPublished ? 'Published' : 'Draft'}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete Post
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default EditPost;

