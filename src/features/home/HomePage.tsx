import React, { useEffect } from 'react';
import { Box, Button, Container, Typography, Grid, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../services/productsApi';
import { Product } from '../../services/productsApi';

const HomePage: React.FC = () => {
  const { data, error, isLoading } = useGetProductsQuery({ limit: 4 });
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);

  useEffect(() => {
    if (data) {
      setFeaturedProducts(data.products || []);
    }
  }, [data]);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2,
          backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              letterSpacing: '.1rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Welcome to AI Shopping Assistant
          </Typography>
          <Typography variant="h5" align="center" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Discover your perfect products with the help of our intelligent AI assistant
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
              }}
            >
              Shop Now
            </Button>
            <Button
              component={Link}
              to="/assistant"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Try AI Assistant
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
            Featured Products
          </Typography>
          <Button 
            component={Link} 
            to="/products" 
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          >
            View All Products →
          </Button>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <div className="loading-spinner" style={{ width: '40px', height: '40px' }} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" py={4}>
            Error loading products. Please try again later.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image_url || 'https://via.placeholder.com/300x200'}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3" noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                      {product.category}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${product.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      color="primary"
                      component={Link}
                      to={`/products/${product.id}`}
                      fullWidth
                      variant="outlined"
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* AI Assistant CTA */}
      <Box 
        sx={{ 
          bgcolor: 'grey.100', 
          py: 8, 
          mt: 8,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Need help finding the perfect product?
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 3 }}>
                Our AI shopping assistant is here to help you discover products that match your needs and preferences.
              </Typography>
              <Button
                component={Link}
                to="/assistant"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<span style={{ fontSize: '1.5rem' }}>🤖</span>}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                Try AI Assistant Now
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 3,
                  maxWidth: '100%',
                }}
              >
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56', mr: 1 }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e', mr: 1 }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f' }} />
                </Box>
                <Box
                  sx={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: 1,
                    p: 2,
                    mb: 2,
                    minHeight: '100px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.9rem',
                  }}
                >
                  {`> Hello! I'm your AI shopping assistant. How can I help you today?
> Looking for something specific? Just ask!`}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#27c93f',
                      mr: 1,
                      animation: 'blink 1s infinite',
                      '@keyframes blink': {
                        '0%': { opacity: 0.2 },
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0.2 },
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    AI Assistant is ready to help
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
