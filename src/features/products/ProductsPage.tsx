import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  TextField, 
  InputAdornment, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent, 
  Pagination, 
  CircularProgress,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useGetProductsQuery } from '../../services/productsApi';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get query parameters
  const category = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  
  // State for mobile filters
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Fetch products with query parameters
  const { data, error, isLoading } = useGetProductsQuery({
    category: category || undefined,
    search: searchQuery || undefined,
    page,
    sort: sortBy,
    limit: 12
  });
  
  // Available categories (in a real app, this would come from an API)
  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Books',
    'Toys & Games'
  ];
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newSearchParams.set('q', e.target.value);
      newSearchParams.delete('page'); // Reset to first page on new search
    } else {
      newSearchParams.delete('q');
    }
    setSearchParams(newSearchParams);
  };
  
  // Handle category filter
  const handleCategoryChange = (newCategory: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newCategory) {
      newSearchParams.set('category', newCategory);
    } else {
      newSearchParams.delete('category');
    }
    newSearchParams.delete('page'); // Reset to first page on category change
    setSearchParams(newSearchParams);
  };
  
  // Handle sort change
  const handleSortChange = (e: SelectChangeEvent) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sort', newSort);
    setSearchParams(newSearchParams);
  };
  
  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    setSearchParams(newSearchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
    setSortBy('featured');
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          {category || 'All Products'}
          {searchQuery && (
            <Typography variant="subtitle1" color="text.secondary">
              Search results for: "{searchQuery}"
            </Typography>
          )}
        </Typography>
        
        {/* Search and filter bar */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: 2,
            mb: 3
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { 
                backgroundColor: 'background.paper',
                borderRadius: '50px',
                '& fieldset': { border: 'none' },
                boxShadow: 1,
              }
            }}
            sx={{ 
              maxWidth: isMobile ? '100%' : '400px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
              },
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              sx={{
                display: { xs: 'flex', md: 'none' },
                borderRadius: '50px',
                textTransform: 'none',
                px: 3,
              }}
            >
              Filters
            </Button>
            
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 200,
                display: { xs: 'none', md: 'block' },
              }}
            >
              <InputLabel id="sort-by-label">Sort by</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by"
                value={sortBy}
                label="Sort by"
                onChange={handleSortChange}
                sx={{ 
                  borderRadius: '50px',
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  boxShadow: 1,
                }}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest Arrivals</MenuItem>
                <MenuItem value="rating">Top Rated</MenuItem>
              </Select>
            </FormControl>
            
            {(category || searchQuery) && (
              <Button
                variant="text"
                onClick={clearFilters}
                sx={{
                  textTransform: 'none',
                  textDecoration: 'underline',
                  color: 'text.secondary',
                  '&:hover': {
                    textDecoration: 'underline',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Clear all filters
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Mobile filters */}
        {mobileFiltersOpen && (
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
              display: { xs: 'block', md: 'none' },
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => handleCategoryChange(cat)}
                  variant={category === cat ? 'filled' : 'outlined'}
                  color={category === cat ? 'primary' : 'default'}
                  size="small"
                />
              ))}
            </Box>
            
            <FormControl fullWidth size="small" sx={{ mt: 2, mb: 1 }}>
              <InputLabel id="mobile-sort-label">Sort by</InputLabel>
              <Select
                labelId="mobile-sort-label"
                id="mobile-sort"
                value={sortBy}
                label="Sort by"
                onChange={handleSortChange}
                fullWidth
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest Arrivals</MenuItem>
                <MenuItem value="rating">Top Rated</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
        
        {/* Active filters */}
        {(category || searchQuery) && (
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {category && (
              <Chip
                label={`Category: ${category}`}
                onDelete={() => handleCategoryChange('')}
                color="primary"
                size="small"
                sx={{ '& .MuiChip-deleteIcon': { color: 'primary.contrastText' } }}
              />
            )}
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                onDelete={() => {
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.delete('q');
                  setSearchParams(newSearchParams);
                }}
                color="secondary"
                size="small"
                sx={{ '& .MuiChip-deleteIcon': { color: 'secondary.contrastText' } }}
              />
            )}
          </Box>
        )}
      </Box>
      
      {/* Category filters (desktop) */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="All"
            onClick={() => handleCategoryChange('')}
            variant={!category ? 'filled' : 'outlined'}
            color={!category ? 'primary' : 'default'}
            clickable
          />
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => handleCategoryChange(cat)}
              variant={category === cat ? 'filled' : 'outlined'}
              color={category === cat ? 'primary' : 'default'}
              clickable
            />
          ))}
        </Box>
      </Box>
      
      {/* Products grid */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box textAlign="center" py={8}>
          <Typography color="error" gutterBottom>
            Error loading products. Please try again later.
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      ) : data && data.products && data.products.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {data.products.map((product: any) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
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
                  <Box sx={{ position: 'relative', pt: '100%' }}>
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
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3" noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                      {product.category}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <Box 
                          key={i} 
                          component="span" 
                          sx={{ 
                            color: i < (product.rating || 4) ? '#ffc107' : '#e0e0e0',
                            fontSize: '1.2rem',
                            lineHeight: 1,
                          }}
                        >
                          ★
                        </Box>
                      ))}
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviewCount || '0'})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${product.price.toFixed(2)}
                    </Typography>
                    {product.originalPrice && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          textDecoration: 'line-through',
                          display: 'inline-block',
                          mr: 1,
                        }}
                      >
                        ${product.originalPrice.toFixed(2)}
                      </Typography>
                    )}
                    {product.discount && (
                      <Typography 
                        variant="body2" 
                        color="error" 
                        fontWeight="medium"
                        display="inline"
                      >
                        {product.discount}% OFF
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      color="primary"
                      component={Link}
                      to={`/products/${product.id}`}
                      fullWidth
                      variant="contained"
                      sx={{
                        borderRadius: '50px',
                        textTransform: 'none',
                        fontWeight: 'medium',
                        py: 1,
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {data.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '50%',
                    minWidth: '40px',
                    height: '40px',
                    '&.Mui-selected': {
                      boxShadow: '0 0 0 1px rgba(25, 118, 210, 0.5)',
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography color="text.secondary" paragraph>
            We couldn't find any products matching your criteria.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={clearFilters}
            sx={{ mt: 2 }}
          >
            Clear all filters
          </Button>
        </Box>
      )}
      
      {/* Quick Links */}
      <Box sx={{ mt: 8, mb: 4 }}>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Customer Service
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li><Button component={Link} to="/contact" color="inherit" sx={{ textTransform: 'none', px: 0, justifyContent: 'flex-start' }}>Contact Us</Button></li>
              <li><Button component={Link} to="/faq" color="inherit" sx={{ textTransform: 'none', px: 0, justifyContent: 'flex-start' }}>FAQs</Button></li>
              <li><Button component={Link} to="/shipping" color="inherit" sx={{ textTransform: 'none', px: 0, justifyContent: 'flex-start' }}>Shipping Information</Button></li>
              <li><Button component={Link} to="/returns" color="inherit" sx={{ textTransform: 'none', px: 0, justifyContent: 'flex-start' }}>Returns & Exchanges</Button></li>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              About Us
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li><Button component={Link} to="/about" color="inherit" sx={{ textTransform: 'none', px: 0, justifyContent: 'flex-start' }}>Our Story</Button></li>
              <li><Button component={Link} to="/careers" color="inherit" sx={{ textTransform: 'none', px: 0, justifyContent: 'flex-start' }}>Careers</Button></li>
              <li><Button component={Link} to="/blog" color="inherit" sx={{ textTransform: 'none', px: 0, justifyContent: 'flex-start' }}>Blog</Button></li>
              <li><Button component={Link} to="/press" color="inherit" sx={{ textTransform: 'none', px: 0, justifyContent: 'flex-start' }}>Press</Button></li>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <IconButton color="primary" component="a" href="https://facebook.com" target="_blank">
                <span className="fab fa-facebook-f"></span>
              </IconButton>
              <IconButton color="primary" component="a" href="https://twitter.com" target="_blank">
                <span className="fab fa-twitter"></span>
              </IconButton>
              <IconButton color="primary" component="a" href="https://instagram.com" target="_blank">
                <span className="fab fa-instagram"></span>
              </IconButton>
              <IconButton color="primary" component="a" href="https://pinterest.com" target="_blank">
                <span className="fab fa-pinterest"></span>
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Sign up for our newsletter to receive updates on new arrivals, special offers, and more.
            </Typography>
            <Box component="form" sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Your email"
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px',
                    backgroundColor: 'background.paper',
                  },
                }}
              />
              <Button 
                variant="contained" 
                color="primary"
                sx={{ 
                  borderRadius: '50px',
                  textTransform: 'none',
                  px: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductsPage;
