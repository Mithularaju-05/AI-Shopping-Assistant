import React from 'react';
import { Box, Typography, Avatar, Rating, Divider, IconButton, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { formatDistanceToNow } from 'date-fns';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ffb400',
  },
  '& .MuiRating-iconHover': {
    color: '#ffb400',
  },
});

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string | Date;
  title?: string;
  comment: string;
  verifiedPurchase?: boolean;
  likes?: number;
  dislikes?: number;
  isOwner?: boolean;
  images?: string[];
  productVariant?: string;
}

interface ProductReviewProps {
  review: Review;
  variant?: 'default' | 'compact';
}

const ProductReview: React.FC<ProductReviewProps> = ({ 
  review, 
  variant = 'default' 
}) => {
  const theme = useTheme();
  const isCompact = variant === 'compact';
  
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  if (isCompact) {
    return (
      <Box 
        sx={{ 
          mb: 2,
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          '&:last-child': {
            mb: 0,
          },
        }}
      >
        <Box display="flex" alignItems="flex-start" mb={1}>
          <Avatar 
            src={review.avatar} 
            alt={review.author}
            sx={{ width: 32, height: 32, mr: 1.5 }}
          >
            {review.author.charAt(0).toUpperCase()}
          </Avatar>
          <Box flexGrow={1}>
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle2" component="span" sx={{ mr: 1, fontWeight: 600 }}>
                {review.author}
              </Typography>
              <StyledRating 
                value={review.rating} 
                precision={0.5} 
                size="small" 
                readOnly 
                sx={{ mr: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(review.date)}
              </Typography>
            </Box>
            {review.title && (
              <Typography variant="subtitle2" sx={{ mt: 0.5, fontWeight: 600 }}>
                {review.title}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography variant="body2" sx={{ ml: 5.5, mb: 1 }}>
          {review.comment}
        </Typography>
        {review.verifiedPurchase && (
          <Box display="flex" alignItems="center" sx={{ ml: 5.5, mb: 1 }}>
            <Box 
              component="span" 
              sx={{ 
                backgroundColor: theme.palette.success.light, 
                color: theme.palette.success.contrastText,
                fontSize: '0.6rem',
                px: 0.75,
                py: 0.25,
                borderRadius: '4px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              ✓ Verified Purchase
            </Box>
          </Box>
        )}
        {review.productVariant && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 5.5, display: 'block' }}>
            <strong>Variant:</strong> {review.productVariant}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        mb: 4,
        '&:last-child': {
          mb: 0,
        },
      }}
    >
      <Box display="flex" alignItems="flex-start">
        <Avatar 
          src={review.avatar} 
          alt={review.author}
          sx={{ width: 48, height: 48, mr: 2 }}
        >
          {review.author.charAt(0).toUpperCase()}
        </Avatar>
        
        <Box flexGrow={1}>
          <Box 
            display="flex" 
            flexWrap="wrap" 
            alignItems="center" 
            justifyContent="space-between"
            mb={0.5}
          >
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle1" component="span" sx={{ mr: 1, fontWeight: 600 }}>
                {review.author}
              </Typography>
              
              {review.verifiedPurchase && (
                <Box 
                  component="span" 
                  sx={{ 
                    backgroundColor: theme.palette.success.light, 
                    color: theme.palette.success.contrastText,
                    fontSize: '0.65rem',
                    px: 0.75,
                    py: 0.25,
                    borderRadius: '4px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    mr: 1,
                  }}
                >
                  ✓ Verified Purchase
                </Box>
              )}
              
              {review.isOwner && (
                <Box 
                  component="span" 
                  sx={{ 
                    backgroundColor: theme.palette.primary.light, 
                    color: theme.palette.primary.contrastText,
                    fontSize: '0.65rem',
                    px: 0.75,
                    py: 0.25,
                    borderRadius: '4px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    mr: 1,
                  }}
                >
                  Owner
                </Box>
              )}
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              {formatDate(review.date)}
            </Typography>
          </Box>
          
          <Box mb={1}>
            <StyledRating 
              value={review.rating} 
              precision={0.5} 
              readOnly 
              sx={{ mr: 1 }}
            />
            {review.productVariant && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {review.productVariant}
              </Typography>
            )}
          </Box>
          
          {review.title && (
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              {review.title}
            </Typography>
          )}
          
          <Typography variant="body1" paragraph sx={{ mb: 1.5 }}>
            {review.comment}
          </Typography>
          
          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <Box display="flex" gap={1} mb={2} sx={{ overflowX: 'auto', py: 1 }}>
              {review.images.map((img, idx) => (
                <Box 
                  key={idx}
                  component="img"
                  src={img}
                  alt={`Review image ${idx + 1}`}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    objectFit: 'cover',
                    border: `1px solid ${theme.palette.divider}`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              ))}
            </Box>
          )}
          
          {/* Review Actions */}
          <Box display="flex" alignItems="center" mt={1.5}>
            <Box display="flex" alignItems="center" mr={3}>
              <IconButton size="small" sx={{ mr: 0.5 }}>
                <ThumbUpOutlinedIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                {review.likes || 0}
              </Typography>
              
              <IconButton size="small" sx={{ mr: 0.5 }}>
                <ThumbDownOutlinedIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                {review.dislikes || 0}
              </Typography>
            </Box>
            
            <IconButton size="small" sx={{ mr: 1 }}>
              <ReplyOutlinedIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Reply</Typography>
            </IconButton>
            
            <Box flexGrow={1} />
            
            <IconButton size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {/* Nested Replies */}
          {review.replies && review.replies.length > 0 && (
            <Box 
              sx={{ 
                mt: 2, 
                ml: 6, 
                pl: 2, 
                borderLeft: `2px solid ${theme.palette.divider}` 
              }}
            >
              {review.replies.map((reply: any, idx: number) => (
                <Box key={idx} mb={2}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mr: 1 }}>
                      {reply.author}
                    </Typography>
                    {reply.isOwner && (
                      <Box 
                        component="span" 
                        sx={{ 
                          backgroundColor: theme.palette.primary.light, 
                          color: theme.palette.primary.contrastText,
                          fontSize: '0.6rem',
                          px: 0.5,
                          borderRadius: '2px',
                          fontWeight: 600,
                          mr: 1,
                        }}
                      >
                        Owner
                      </Box>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(reply.date)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{reply.comment}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
      
      <Divider sx={{ mt: 3 }} />
    </Box>
  );
};

export default ProductReview;
