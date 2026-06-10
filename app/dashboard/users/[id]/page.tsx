'use client';

import React, { useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Grid, Chip,
  Button, Skeleton, Divider, Paper,
} from '@mui/material';
import {
  ArrowBack, Email, Phone, Cake, LocationOn,
  Business, School, Favorite,
} from '@mui/icons-material';
import Link from 'next/link';
import { useUsersStore } from '@/store/usersStore';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <Box sx={{ color: 'text.secondary', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value || '—'}
        </Typography>
      </Box>
    </Box>
  );
}

export default function UserPage({ params }: { params: { id: string } }) {
    const { id } = React.use(params);
  
  const { currentUser, loading, error, loadUserById, clearCurrentUser } = useUsersStore();

  useEffect(() => {
    loadUserById(Number(id));
    return () => clearCurrentUser();
  }, [id, loadUserById, clearCurrentUser]);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Skeleton width={120} height={36} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !currentUser) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error || 'User not found.'}</Typography>
        <Button component={Link} href="/dashboard/users" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
          Back to Users
        </Button>
      </Box>
    );
  }

  const u = currentUser;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Back */}
      <Button
        component={Link}
        href="/dashboard/users"
        startIcon={<ArrowBack />}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to Users
      </Button>

      <Grid container spacing={3}>
        {/* Profile card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Avatar
              src={u.image}
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '4px solid', borderColor: 'primary.main' }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {u.firstName} {u.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              @{(u as any).username}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
              <Chip
                label={u.gender}
                size="small"
                sx={{
                  bgcolor: u.gender === 'male' ? '#EFF6FF' : '#FDF2F8',
                  color: u.gender === 'male' ? '#3B82F6' : '#EC4899',
                  textTransform: 'capitalize',
                }}
              />
              <Chip label={`Age ${u.age}`} size="small" variant="outlined" />
              <Chip label={u.bloodGroup} size="small" variant="outlined" />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'left' }}>
              <InfoRow icon={<Email fontSize="small" />} label="Email" value={u.email} />
              <InfoRow icon={<Phone fontSize="small" />} label="Phone" value={u.phone} />
              <InfoRow
                icon={<LocationOn fontSize="small" />}
                label="Address"
                value={`${u.address?.street}, ${u.address?.city}, ${u.address?.state}`}
              />
            </Box>
          </Card>
        </Grid>

        {/* Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            {/* Company */}
            <Grid size={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Business fontSize="small" sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Employment
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="caption" color="text.secondary">Company</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{u.company?.name}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="caption" color="text.secondary">Department</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{u.company?.department}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="caption" color="text.secondary">Title</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{u.company?.title}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Personal */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Cake fontSize="small" sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Personal
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Birth Date</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{u.birthDate}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Height / Weight</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{u.height} cm / {u.weight} kg</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Eye Color</Typography>
                      <Typography sx={{ fontWeight: 500, textTransform: 'capitalize' }}>{u.eyeColor}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Education */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <School fontSize="small" sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Education
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">University</Typography>
                    <Typography sx={{ fontWeight: 500 }}>{u.university || '—'}</Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">Location</Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {u.address?.city}, {u.address?.country}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
