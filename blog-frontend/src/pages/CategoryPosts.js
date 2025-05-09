import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import PostCard from '../components/PostCard';
import { getCategory } from '../services/api';

function CategoryPosts() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await getCategory(id);
        setCategory(response.data);
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Failed to load category. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

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

  if (!category) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Category not found.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {category.name}
      </Typography>

      {category.description && (
        <Typography variant="body1" paragraph>
          {category.description}
        </Typography>
      )}

      {category.posts.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No posts found in this category.
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {category.posts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default CategoryPosts;

