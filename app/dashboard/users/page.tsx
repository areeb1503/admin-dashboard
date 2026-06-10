'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import {
  Box, Typography, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Avatar, Chip,
  TablePagination, InputAdornment, CircularProgress, Alert,
  Card, CardContent, IconButton, Tooltip,
} from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon, OpenInNew } from '@mui/icons-material';
import Link from 'next/link';
import { useUsersStore } from '@/store/usersStore';
import { User } from '@/types';
import { useDebounce } from '@/lib/useDebounce';

const ROWS_PER_PAGE = 10;

// Memoized table row to avoid re-renders when unrelated state changes
const UserRow = memo(({ user }: { user: User }) => (
  <TableRow hover sx={{ '&:last-child td': { border: 0 }, cursor: 'pointer' }}>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar src={user.image} sx={{ width: 36, height: 36 }}>
          {user.firstName[0]}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            @{(user as any).username || 'n/a'}
          </Typography>
        </Box>
      </Box>
    </TableCell>
    <TableCell>
      <Typography variant="body2">{user.email}</Typography>
    </TableCell>
    <TableCell>
      <Chip
        label={user.gender}
        size="small"
        sx={{
          bgcolor: user.gender === 'male' ? '#EFF6FF' : '#FDF2F8',
          color: user.gender === 'male' ? '#3B82F6' : '#EC4899',
          fontWeight: 500,
          textTransform: 'capitalize',
        }}
      />
    </TableCell>
    <TableCell>
      <Typography variant="body2">{user.phone}</Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
        {user.company?.name || '—'}
      </Typography>
    </TableCell>
    <TableCell align="right">
      <Tooltip title="View profile">
        <IconButton
          component={Link}
          href={`/dashboard/users/${user.id}`}
          size="small"
          sx={{ color: 'primary.main' }}
        >
          <OpenInNew fontSize="small" />
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>
));
UserRow.displayName = 'UserRow';

export default function UsersPage() {
  const { users, total, loading, error, loadUsers, clearCache } = useUsersStore();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  // Reset page when search changes
  useEffect(() => setPage(0), [debouncedSearch]);

  useEffect(() => {
    loadUsers(ROWS_PER_PAGE, page * ROWS_PER_PAGE, debouncedSearch);
  }, [page, debouncedSearch, loadUsers]);

  const handleRefresh = useCallback(() => {
    clearCache();
    loadUsers(ROWS_PER_PAGE, page * ROWS_PER_PAGE, debouncedSearch);
  }, [clearCache, loadUsers, page, debouncedSearch]);

  // Memoize rendered rows
  const rows = useMemo(() => users.map((u) => <UserRow key={u.id} user={u} />), [users]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Users</Typography>
          <Typography variant="body2" color="text.secondary">
            {total.toLocaleString()} total users
          </Typography>
        </Box>
        <Tooltip title="Refresh & clear cache">
          <IconButton onClick={handleRefresh} size="small" sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: '12px !important' }}>
          <TextField
            placeholder="Search by name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            slotProps={{ input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}}
          />
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Company</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array(ROWS_PER_PAGE)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      {Array(6).fill(0).map((_, j) => (
                        <TableCell key={j}>
                          <Box sx={{ height: 20, bgcolor: 'grey.100', borderRadius: 1 }} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No users found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={ROWS_PER_PAGE}
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          onPageChange={(_, p) => setPage(p)}
        />
      </Card>
    </Box>
  );
}
