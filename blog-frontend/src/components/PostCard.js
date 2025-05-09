import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { formatDistanceToNow } from 'date-fns';

function PostCard({ post }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {post.featured_image && (
        <CardMedia
          component="img"
          height="200"
          image={post.featured_image}
          alt={post.title}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={post.category?.name || 'Uncategorized'} 
            size="small" 
            color="primary" 
            component={RouterLink}
            to={`/categories/${post.category?.id}`}
            sx={{ mr: 1, cursor: 'pointer' }}
          />
          <Typography variant="caption" color="text.secondary">
            {post.published_at ? 
              `Published ${formatDistanceToNow(new Date(post.published_at))} ago` : 
              'Draft'}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/posts/${post.id}`}
        >
          Read More
        </Button>
      </CardActions>
    </Card>
  );
}

export default PostCard;

