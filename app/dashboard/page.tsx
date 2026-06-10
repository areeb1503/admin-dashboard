'use client';

import { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Skeleton, Avatar, Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as ProductsIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { fetchUsers, fetchProducts } from '@/lib/api';

interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StatCard[] | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [usersData, productsData] = await Promise.all([
          fetchUsers(1, 0) as any,
          fetchProducts(1, 0) as any,
        ]);
        setStats([
          {
            label: 'Total Users',
            value: usersData.total.toLocaleString(),
            sub: 'Registered accounts',
            icon: <PeopleIcon />,
            color: '#3B82F6',
          },
          {
            label: 'Total Products',
            value: productsData.total.toLocaleString(),
            sub: 'Items in catalog',
            icon: <ProductsIcon />,
            color: '#10B981',
          },
          {
            label: 'Avg. Rating',
            value: '4.2',
            sub: 'Across all products',
            icon: <StarIcon />,
            color: '#F59E0B',
          },
          {
            label: 'Active Today',
            value: '128',
            sub: 'Sessions this hour',
            icon: <TrendingIcon />,
            color: '#E94560',
          },
        ]);
      } catch {
        setStats([]);
      }
    }
    loadStats();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          {greeting}, {session?.user?.name?.split(' ')[0]} 👋
        </Typography>
        <Typography color="text.secondary">
          Here's what's happening in your admin panel today.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {(stats ?? Array(4).fill(null)).map((stat, i) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                {stat ? (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }} gutterBottom>
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.sub}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${stat.color}15`, width: 48, height: 48 }}>
                      <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                    </Avatar>
                  </Box>
                ) : (
                  <Box>
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="40%" height={40} />
                    <Skeleton width="70%" height={16} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick links */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Quick Access
      </Typography>
      <Grid container spacing={2}>
        {[
          { label: 'Browse Users', href: '/dashboard/users', color: '#3B82F6', desc: 'Search and manage user accounts' },
          { label: 'Browse Products', href: '/dashboard/products', color: '#10B981', desc: 'View and filter the product catalog' },
        ].map((item) => (
          <Grid size={{ xs: 12, sm: 6 }} key={item.href}>
            <Card
              component="a"
              href={item.href}
              sx={{
                textDecoration: 'none',
                display: 'block',
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 48,
                      borderRadius: 3,
                      bgcolor: item.color,
                    }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
