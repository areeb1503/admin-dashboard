'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import {
  Box, Typography, TextField, Grid, Card, CardContent, CardMedia,
  CardActionArea, InputAdornment, CircularProgress, Alert,
  Chip, Rating, Select, MenuItem, FormControl, InputLabel,
  IconButton, Tooltip, Pagination,
} from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useProductsStore } from '@/store/productsStore';
import { Product } from '@/types';
import { useDebounce } from '@/lib/useDebounce';

const PAGE_SIZE = 12;

// Memoized product card
const ProductCard = memo(({ product }: { product: Product }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardActionArea component={Link} href={`/dashboard/products/${product.id}`} sx={{ flexGrow: 1 }}>
      <CardMedia
        component="img"
        image={product.thumbnail}
        alt={product.title}
        sx={{ height: 180, objectFit: 'contain', bgcolor: '#F9FAFB', p: 1 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Chip
          label={product.category}
          size="small"
          sx={{ mb: 1, fontSize: '0.7rem', textTransform: 'capitalize', bgcolor: '#F3F4F6' }}
        />
        <Typography variant="body2"  gutterBottom sx={{ fontWeight: 600, lineHeight: 1.4 }}>
          {product.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Rating value={product.rating} precision={0.1} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            ({product.rating.toFixed(1)})
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }} color="primary">
          ${product.price.toFixed(2)}
        </Typography>
        {product.discountPercentage > 0 && (
          <Chip
            label={`-${product.discountPercentage.toFixed(0)}%`}
            size="small"
            sx={{ bgcolor: '#FEF2F2', color: '#EF4444', fontWeight: 600, fontSize: '0.7rem' }}
          />
        )}
      </CardContent>
    </CardActionArea>
  </Card>
));
ProductCard.displayName = 'ProductCard';

export default function ProductsPage() {
  const { products, total, loading, error, categories, loadProducts, loadCategories, clearCache } =
    useProductsStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  // Reset page on filter change
  useEffect(() => setPage(1), [debouncedSearch, category]);

  useEffect(() => {
    loadProducts(PAGE_SIZE, (page - 1) * PAGE_SIZE, debouncedSearch, category);
  }, [page, debouncedSearch, category, loadProducts]);

  const handleRefresh = useCallback(() => {
    clearCache();
    loadProducts(PAGE_SIZE, (page - 1) * PAGE_SIZE, debouncedSearch, category);
  }, [clearCache, loadProducts, page, debouncedSearch, category]);

  const totalPages = useMemo(() => Math.ceil(total / PAGE_SIZE), [total]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Products</Typography>
          <Typography variant="body2" color="text.secondary">
            {total.toLocaleString()} items in catalog
          </Typography>
        </Box>
        <Tooltip title="Refresh & clear cache">
          <IconButton onClick={handleRefresh} size="small" sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: '12px !important' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: 200 }}
              slotProps={{ input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat} sx={{ textTransform: 'capitalize' }}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Grid */}
      {loading ? (
        <Grid container spacing={2}>
          {Array(PAGE_SIZE).fill(0).map((_, i) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
              <Box sx={{ bgcolor: 'grey.100', borderRadius: 3, height: 280 }} />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">No products found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
