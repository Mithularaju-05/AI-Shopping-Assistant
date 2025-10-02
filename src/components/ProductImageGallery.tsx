import React, { useState } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight, Fullscreen, FullscreenExit } from '@mui/icons-material';

interface ProductImageGalleryProps {
  images: string[];
  alt?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, alt = 'Product' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // If no images are provided, use a placeholder
  const imageUrls = images && images.length > 0 ? images : ['https://via.placeholder.com/800x800?text=No+Image+Available'];
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };
  
  // Handle fullscreen change
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        height: isMobile ? '300px' : '500px',
        overflow: 'hidden',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      {/* Main Image */}
      <Box
        component="img"
        src={imageUrls[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transition: 'opacity 0.3s ease-in-out',
          cursor: 'zoom-in',
          '&:hover': {
            opacity: 0.9,
          },
        }}
        onClick={toggleFullscreen}
      />
      
      {/* Navigation Arrows */}
      {imageUrls.length > 1 && (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            sx={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
            aria-label="Previous image"
          >
            <ChevronLeft />
          </IconButton>
          
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            sx={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
            aria-label="Next image"
          >
            <ChevronRight />
          </IconButton>
        </>
      )}
      
      {/* Fullscreen Toggle */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
      >
        {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
      </IconButton>
      
      {/* Image Counter */}
      {imageUrls.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 4,
            fontSize: '0.8rem',
          }}
        >
          {currentIndex + 1} / {imageUrls.length}
        </Box>
      )}
      
      {/* Thumbnail Navigation */}
      {imageUrls.length > 1 && !isMobile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: 2,
            px: 2,
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '3px',
            },
          }}
        >
          {imageUrls.map((image, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 60,
                height: 60,
                minWidth: 60,
                borderRadius: 1,
                overflow: 'hidden',
                border: `2px solid ${currentIndex === index ? theme.palette.primary.main : 'transparent'}`,
                cursor: 'pointer',
                opacity: currentIndex === index ? 1 : 0.7,
                transition: 'opacity 0.2s, transform 0.2s',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductImageGallery;
