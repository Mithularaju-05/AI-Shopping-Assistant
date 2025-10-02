import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Divider, 
  Rating, 
  Tabs, 
  Tab, 
  Paper,
  IconButton,
  Breadcrumbs,
  Chip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { 
  AddShoppingCart, 
  FavoriteBorder, 
  Share, 
  ArrowBack, 
  CheckCircle,
  LocalShipping,
  Security,
  Replay,
  Star,
  StarHalf,
  StarBorder,
  Close
} from '@mui/icons-material';
import { useGetProductQuery } from '../../services/productsApi';
import ProductImageGallery from '../../components/ProductImageGallery';
import ProductReview from '../../components/ProductReview';
import SimilarProducts from '../../components/SimilarProducts';

// Tab panel component
function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Tab props for accessibility
function a11yProps(index: number) {
  return {
    id: `product-tab-${index}`,
    'aria-controls': `product-tabpanel-${index}`,
  };
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [tabValue, setTabValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [review, setReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    name: '',
    email: ''
  });
  
  // Fetch product data
  const { data: product, error, isLoading, refetch } = useGetProductQuery(id || '');
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle quantity change
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };
  
  // Handle variant selection
  const handleVariantChange = (event: any) => {
    setSelectedVariant(event.target.value);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    // In a real app, this would dispatch an action to add the item to the cart
    console.log('Added to cart:', { productId: id, quantity, variant: selectedVariant });
    // Show success message or navigate to cart
  };
  
  // Handle review input change
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    }));
  };
  
  // Handle review submission
  const handleSubmitReview = () => {
    // In a real app, this would submit the review to your backend
    console.log('Submitting review:', { ...review, productId: id });
    setOpenReviewDialog(false);
    // Reset form
    setReview({
      rating: 5,
      title: '',
      comment: '',
      name: '',
      email: ''
    });
  };
  
  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Calculate average rating
  const averageRating = product?.reviews?.length 
    ? product.reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / product.reviews.length
    : 0;
  
  // Calculate rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0];
  if (product?.reviews) {
    product.reviews.forEach((review: any) => {
      ratingDistribution[5 - review.rating]++;
    });
  }
  
  // Render loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Render error state
  if (error || !product) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="error" gutterBottom>
          Error loading product details.
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => refetch()}
          startIcon={<Replay />}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          to="/" 
          color="inherit" 
          startIcon={<ArrowBack />}
          sx={{ textTransform: 'none' }}
        >
          Back to Home
        </Button>
        <Button 
          component={Link} 
          to="/products" 
          color="inherit"
          sx={{ textTransform: 'none' }}
        >
          Products
        </Button>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      {/* Product details */}
      <Grid container spacing={4}>
        {/* Product images */}
        <Grid item xs={12} md={6} lg={7}>
          <ProductImageGallery images={product.images || [product.image_url]} />
        </Grid>
        
        {/* Product info */}
        <Grid item xs={12} md={6} lg={5}>
          <Box sx={{ position: 'sticky', top: '20px' }}>
            {/* Category */}
            <Chip 
              label={product.category} 
              size="small" 
              color="primary" 
              variant="outlined" 
              sx={{ mb: 2 }}
            />
            
            {/* Title */}
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {product.name}
            </Typography>
            
            {/* Rating */}
            <Box display="flex" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" mr={1}>
                <Rating 
                  value={averageRating} 
                  precision={0.5} 
                  readOnly 
                  size="medium"
                  emptyIcon={
                    <StarBorder fontSize="inherit" sx={{ color: 'text.secondary' }} />
                  }
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {averageRating.toFixed(1)}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                component={Button}
                onClick={() => setTabValue(2)}
                sx={{ 
                  textTransform: 'none',
                  textDecoration: 'underline',
                  minWidth: 'auto',
                  padding: 0,
                  '&:hover': {
                    textDecoration: 'underline',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                ({product.reviewCount || 0} reviews)
              </Typography>
              <Button 
                size="small" 
                color="primary" 
                onClick={() => setOpenReviewDialog(true)}
                sx={{ 
                  ml: 2,
                  textTransform: 'none',
                  fontWeight: 'medium',
                }}
              >
                Write a review
              </Button>
            </Box>
            
            {/* Price */}
            <Box mb={3}>
              <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 700 }}>
                {formatPrice(product.price)}
                {product.originalPrice && (
                  <Typography 
                    component="span" 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      textDecoration: 'line-through',
                      ml: 1.5,
                      display: 'inline-block',
                    }}
                  >
                    {formatPrice(product.originalPrice)}
                  </Typography>
                )}
                {product.discount && (
                  <Chip 
                    label={`${product.discount}% OFF`} 
                    color="error" 
                    size="small" 
                    sx={{ ml: 1.5, fontWeight: 'bold' }}
                  />
                )}
              </Typography>
              {product.taxInfo && (
                <Typography variant="caption" color="text.secondary">
                  {product.taxInfo}
                </Typography>
              )}
            </Box>
            
            {/* Description */}
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {product.shortDescription || 'No description available.'}
            </Typography>
            
            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="variant-select-label">
                  {product.variantLabel || 'Select Option'}
                </InputLabel>
                <Select
                  labelId="variant-select-label"
                  id="variant-select"
                  value={selectedVariant}
                  label={product.variantLabel || 'Select Option'}
                  onChange={handleVariantChange}
                  sx={{ borderRadius: '4px' }}
                >
                  {product.variants.map((variant: any) => (
                    <MenuItem key={variant.id} value={variant.id}>
                      {variant.name}
                      {variant.price && ` (${formatPrice(variant.price)})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            {/* Quantity */}
            <Box display="flex" alignItems="center" mb={4}>
              <Typography variant="subtitle1" sx={{ mr: 2, minWidth: '80px' }}>
                Quantity:
              </Typography>
              <TextField
                type="number"
                size="small"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: 10 }}
                sx={{ width: '80px', mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                {product.stock} available
              </Typography>
            </Box>
            
            {/* Action buttons */}
            <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                fullWidth={isMobile}
                sx={{
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  flexGrow: 1,
                }}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<FavoriteBorder />}
                fullWidth={isMobile}
                sx={{
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  flexGrow: 1,
                }}
              >
                Wishlist
              </Button>
              
              <IconButton
                color="primary"
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: '50%',
                  p: 1.5,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Share />
              </IconButton>
            </Box>
            
            {/* Shipping info */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <LocalShipping color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Free Shipping</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 1 }}>
                Free standard shipping on orders over $50
              </Typography>
              
              <Box display="flex" alignItems="center" mb={1}>
                <Security color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Secure Payment</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                All transactions are secure and encrypted
              </Typography>
            </Paper>
            
            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                  Highlights
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {product.highlights.map((highlight: string, index: number) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {highlight}
                      </Typography>
                    </li>
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Tags:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {product.tags.map((tag: string, index: number) => (
                    <Chip 
                      key={index} 
                      label={tag} 
                      size="small" 
                      variant="outlined" 
                      component={Link}
                      to={`/products?tag=${encodeURIComponent(tag)}`}
                      clickable
                      sx={{ textDecoration: 'none' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      
      {/* Product tabs */}
      <Box sx={{ width: '100%', mt: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="product tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Description" {...a11yProps(0)} />
            <Tab label="Specifications" {...a11yProps(1)} />
            <Tab label={`Reviews (${product.reviews?.length || 0})`} {...a11yProps(2)} />
            <Tab label="Shipping & Returns" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        {/* Description tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" whiteSpace="pre-line">
            {product.description || 'No description available.'}
          </Typography>
          
          {product.features && product.features.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                Key Features
              </Typography>
              <Grid container spacing={2}>
                {product.features.map((feature: any, index: number) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex">
                      <CheckCircle color="primary" sx={{ mr: 1, mt: 0.5, flexShrink: 0 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </TabPanel>
        
        {/* Specifications tab */}
        <TabPanel value={tabValue} index={1}>
          {product.specifications ? (
            <Box component="dl" sx={{ m: 0 }}>
              {Object.entries(product.specifications).map(([key, value]) => (
                <Box key={key} display="flex" py={1} borderBottom="1px solid" borderColor="divider">
                  <Typography component="dt" variant="subtitle2" sx={{ minWidth: '200px', fontWeight: 'medium' }}>
                    {key}:
                  </Typography>
                  <Typography component="dd" variant="body2" sx={{ flexGrow: 1, m: 0 }}>
                    {String(value)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>No specifications available.</Typography>
          )}
        </TabPanel>
        
        {/* Reviews tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {averageRating.toFixed(1)}
                  <Typography component="span" variant="h6" color="text.secondary">
                    /5
                  </Typography>
                </Typography>
                <Rating value={averageRating} precision={0.5} readOnly size="large" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  Based on {product.reviews?.length || 0} reviews
                </Typography>
                
                {/* Rating distribution */}
                <Box sx={{ mt: 3 }}>
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingDistribution[5 - rating] || 0;
                    const percentage = product.reviews?.length 
                      ? (count / product.reviews.length) * 100 
                      : 0;
                      
                    return (
                      <Box key={rating} display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ minWidth: '24px', mr: 1 }}>
                          {rating}
                        </Typography>
                        <Star fontSize="small" color="action" />
                        <Box 
                          sx={{ 
                            width: '150px', 
                            height: '8px', 
                            bgcolor: 'divider', 
                            borderRadius: '4px',
                            mx: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: `${percentage}%`, 
                              height: '100%', 
                              bgcolor: 'primary.main',
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: '24px' }}>
                          {count}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3, borderRadius: '50px' }}
                  onClick={() => setOpenReviewDialog(true)}
                >
                  Write a Review
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              {product.reviews && product.reviews.length > 0 ? (
                <Box>
                  {product.reviews.map((review: any, index: number) => (
                    <ProductReview key={review.id || index} review={review} />
                  ))}
                </Box>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No reviews yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Be the first to review this product.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenReviewDialog(true)}
                    sx={{ borderRadius: '50px' }}
                  >
                    Write a Review
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Shipping & Returns tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                Shipping Information
              </Typography>
              <Typography variant="body1" paragraph>
                We offer fast and reliable shipping to most countries worldwide. 
                Please allow 1-2 business days for order processing.
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mt: 3 }}>
                Standard Shipping
              </Typography>
              <Typography variant="body1" paragraph>
                Estimated delivery: 3-7 business days
                <br />
                Free on orders over $50
                <br />
                $4.99 for orders under $50
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mt: 3 }}>
                Express Shipping
              </Typography>
              <Typography variant="body1" paragraph>
                Estimated delivery: 1-3 business days
                <br />
                $9.99 flat rate
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                Returns & Exchanges
              </Typography>
              <Typography variant="body1" paragraph>
                We want you to be completely satisfied with your purchase. 
                If you're not happy with your order, we're here to help.
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mt: 3 }}>
                Return Policy
              </Typography>
              <Typography variant="body1" paragraph>
                • 30-day return policy
                <br />
                • Items must be in original condition with tags attached
                <br />
                • Original shipping fees are non-refundable
                <br />
                • Return shipping is the responsibility of the customer
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mt: 3 }}>
                How to Return
              </Typography>
              <Typography variant="body1" paragraph>
                1. Contact our customer service team to initiate a return
                <br />
                2. Package the item securely
                <br />
                3. Ship the item back to us
                <br />
                4. Once received, we'll process your refund
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
      
      {/* Similar products */}
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          You May Also Like
        </Typography>
        <SimilarProducts currentProductId={product.id} category={product.category} />
      </Box>
      
      {/* Review Dialog */}
      <Dialog 
        open={openReviewDialog} 
        onClose={() => setOpenReviewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div">
              Write a Review
            </Typography>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={() => setOpenReviewDialog(false)}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <Box mb={3}>
              <Typography gutterBottom>Your Rating *</Typography>
              <Rating
                name="rating"
                value={review.rating}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setReview({ ...review, rating: newValue });
                  }
                }}
                size="large"
              />
            </Box>
            
            <TextField
              name="title"
              label="Review Title"
              fullWidth
              margin="normal"
              value={review.title}
              onChange={handleReviewChange}
              required
            />
            
            <TextField
              name="comment"
              label="Your Review"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={review.comment}
              onChange={handleReviewChange}
              required
            />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Your Name"
                  fullWidth
                  margin="normal"
                  value={review.name}
                  onChange={handleReviewChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={review.email}
                  onChange={handleReviewChange}
                  required
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenReviewDialog(false)}
            sx={{ borderRadius: '50px', textTransform: 'none', px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmitReview}
            sx={{ borderRadius: '50px', textTransform: 'none', px: 4 }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetailPage;
