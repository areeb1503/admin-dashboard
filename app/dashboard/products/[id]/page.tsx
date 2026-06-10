'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button,
  Skeleton, Divider, Rating, LinearProgress, Avatar,
  IconButton, Paper,
} from '@mui/material';
import {
  ArrowBack, ChevronLeft, ChevronRight, LocalShipping,
  Replay, Inventory, Star,
} from '@mui/icons-material';
import Link from 'next/link';
import { useProductsStore } from '@/store/productsStore';

// Image carousel component
const ImageCarousel = memo(({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#F9FAFB',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 1.5,
          aspectRatio: '1/1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={images[current]}
          alt={`Product image ${current + 1}`}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: 16 }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
        />
        {images.length > 1 && (
          <>
            <IconButton
              onClick={prev}
              size="small"
              sx={{
                position: 'absolute', left: 8, bgcolor: 'white',
                boxShadow: 1, '&:hover': { bgcolor: 'white' },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={next}
              size="small"
              sx={{
                position: 'absolute', right: 8, bgcolor: 'white',
                boxShadow: 1, '&:hover': { bgcolor: 'white' },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
          {images.map((img, i) => (
            <Box
              key={i}
              onClick={() => setCurrent(i)}
              sx={{
                width: 60,
                height: 60,
                flexShrink: 0,
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: i === current ? 'primary.main' : 'transparent',
                bgcolor: '#F9FAFB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
});
ImageCarousel.displayName = 'ImageCarousel';

export default function ProductPage({ params }: { params: { id: string } }) {
      const { id } = React.use(params);
  
  const { currentProduct, loading, error, loadProductById, clearCurrentProduct } = useProductsStore();

  useEffect(() => {
    loadProductById(Number(id));
    return () => clearCurrentProduct();
  }, [id, loadProductById, clearCurrentProduct]);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Skeleton width={140} height={36} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            {[80, 60, 40, 100, 60].map((w, i) => (
              <Skeleton key={i} width={`${w}%`} height={30} sx={{ mb: 1 }} />
            ))}
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !currentProduct) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error || 'Product not found.'}</Typography>
        <Button component={Link} href="/dashboard/products" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Box>
    );
  }

  const p = currentProduct;
  const discountedPrice = p.price * (1 - p.discountPercentage / 100);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Button
        component={Link}
        href="/dashboard/products"
        startIcon={<ArrowBack />}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to Products
      </Button>

      <Grid container spacing={3}>
        {/* Images */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2 }}>
            <ImageCarousel images={p.images?.length ? p.images : [p.thumbnail]} />
          </Card>
        </Grid>

        {/* Details */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
            <Chip label={p.category} size="small" sx={{ textTransform: 'capitalize', bgcolor: '#F3F4F6' }} />
            {p.tags?.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
            {p.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Rating value={p.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              {p.rating.toFixed(1)} rating
            </Typography>
            {p.reviews && (
              <Typography variant="body2" color="text.secondary">
                · {p.reviews.length} reviews
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }} color="primary">
              ${discountedPrice.toFixed(2)}
            </Typography>
            {p.discountPercentage > 0 && (
              <>
                <Typography variant="h6" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                  ${p.price.toFixed(2)}
                </Typography>
                <Chip
                  label={`-${p.discountPercentage.toFixed(0)}%`}
                  size="small"
                  sx={{ bgcolor: '#FEF2F2', color: '#EF4444', fontWeight: 700 }}
                />
              </>
            )}
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            {p.description}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Specs */}
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {[
              { label: 'Brand', value: p.brand },
              { label: 'Stock', value: `${p.stock} units` },
              { label: 'Min Order', value: p.minimumOrderQuantity ? `${p.minimumOrderQuantity} units` : '1 unit' },
              { label: 'Status', value: p.availabilityStatus || 'Available' },
            ].map((spec) => spec.value ? (
              <Grid size={6} key={spec.label}>
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {spec.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{spec.value}</Typography>
                </Paper>
              </Grid>
            ) : null)}
          </Grid>

          {/* Logistics */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {p.shippingInformation && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <LocalShipping fontSize="small" sx={{ color: 'success.main' }} />
                <Typography variant="body2">{p.shippingInformation}</Typography>
              </Box>
            )}
            {p.warrantyInformation && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Inventory fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography variant="body2">{p.warrantyInformation}</Typography>
              </Box>
            )}
            {p.returnPolicy && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Replay fontSize="small" sx={{ color: 'warning.main' }} />
                <Typography variant="body2">{p.returnPolicy}</Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Reviews */}
        {p.reviews && p.reviews.length > 0 && (
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Customer Reviews ({p.reviews.length})
                </Typography>
                <Grid container spacing={2}>
                  {p.reviews.map((review, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                            {review.reviewerName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{review.reviewerName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(review.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Rating value={review.rating} size="small" readOnly sx={{ mb: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
