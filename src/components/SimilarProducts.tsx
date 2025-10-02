import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, CardActions, IconButton, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../services/productsApi';
import { Product } from '../services/productsApi';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

interface SimilarProductsProps {
  currentProductId: string;
  category: string;
  limit?: number;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ 
  currentProductId, 
  category, 
  limit = 4 
}) => {
  const theme = useTheme();
  
  // Fetch similar products by category, excluding the current product
  const { data, error, isLoading } = useGetProductsQuery({
    category,
    limit,
    exclude: currentProductId,
  });
  
  // Show loading skeleton if data is loading
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', py: 1, px: 1 }}>
        {[...Array(4)].map((_, index) => (
          <Box key={index} sx={{ minWidth: 220, maxWidth: 280, flex: 1 }}>
            <Card elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Skeleton variant="rectangular" height={180} animation="wave" />
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Skeleton width="80%" height={24} animation="wave" sx={{ mb: 1 }} />
                <Skeleton width="60%" height={20} animation="wave" sx={{ mb: 2 }} />
                <Skeleton width="40%" height={24} animation="wave" />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    );
  }
  
  // Show error message if there was an error
  if (error || !data?.products || data.products.length === 0) {
    return null; // Don't show anything if there's an error or no similar products
  }
  
  const similarProducts = data.products;
  
  return (
    <Box sx={{ position: 'relative' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 3, 
          overflowX: 'auto', 
          py: 1,
          px: 1,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
          },
        }}
      >
        {similarProducts.map((product: Product) => (
          <Card 
            key={product.id} 
            elevation={0}
            sx={{ 
              minWidth: 220, 
              maxWidth: 280, 
              flex: 1,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
              },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Product Image */}
            <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={product.image_url || 'https://via.placeholder.com/300x300'}
                alt={product.name}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  p: 2,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              
              {/* Quick Actions */}
              <Box 
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  opacity: 0,
                  transition: 'opacity 0.2s, transform 0.2s',
                  transform: 'translateX(10px)',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(0)',
                  },
                  '&:focus-within': {
                    opacity: 1,
                    transform: 'translateX(0)',
                  },
                }}
              >
                <IconButton 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1,
                    '&:hover': {
                      backgroundColor: 'background.paper',
                      color: 'primary.main',
                    },
                  }}
                  aria-label="Add to wishlist"
                >
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1,
                    '&:hover': {
                      backgroundColor: 'background.paper',
                      color: 'primary.main',
                    },
                  }}
                  aria-label="Add to cart"
                >
                  <ShoppingCartOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  component={Link}
                  to={`/products/${product.id}`}
                  sx={{ 
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1,
                    '&:hover': {
                      backgroundColor: 'background.paper',
                      color: 'primary.main',
                    },
                  }}
                  aria-label="View details"
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
              
              {/* Sale/Discount Badge */}
              {product.discount && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: 'error.main',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    zIndex: 1,
                  }}
                >
                  -{product.discount}%
                </Box>
              )}
            </Box>
            
            {/* Product Info */}
            <CardContent sx={{ p: 2, pb: 1, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography 
                variant="subtitle2" 
                component={Link} 
                to={`/products/${product.id}`}
                sx={{ 
                  mb: 1, 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  color: 'text.primary',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {product.name}
              </Typography>
              
              <Box sx={{ mt: 'auto' }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center" mr={1}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Box 
                        key={star}
                        component="span"
                        sx={{
                          color: star <= Math.floor(product.rating || 0) 
                            ? theme.palette.warning.main 
                            : theme.palette.grey[300],
                          fontSize: '1rem',
                          lineHeight: 1,
                          '&:not(:last-child)': {
                            mr: 0.25,
                          },
                        }}
                      >
                        ★
                      </Box>
                    ))}
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      ({product.reviewCount || 0})
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 700,
                      mr: 1,
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                  
                  {product.originalPrice && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        textDecoration: 'line-through',
                        mr: 1,
                      }}
                    >
                      ${product.originalPrice.toFixed(2)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
            
            {/* Add to Cart Button */}
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="small"
                startIcon={<ShoppingCartOutlinedIcon />}
                sx={{
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  py: 1,
                }}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      
      {/* Navigation Arrows (for larger screens) */}
      {similarProducts.length > 3 && (
        <>
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'background.paper',
              },
              display: { xs: 'none', md: 'flex' },
            }}
            aria-label="Previous"
            // TODO: Implement scroll functionality
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </IconButton>
          
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'background.paper',
              },
              display: { xs: 'none', md: 'flex' },
            }}
            aria-label="Next"
            // TODO: Implement scroll functionality
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default SimilarProducts;
