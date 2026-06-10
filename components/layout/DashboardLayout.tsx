'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  Inventory as ProductsIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 68;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  { label: 'Users', icon: <PeopleIcon />, href: '/dashboard/users' },
  { label: 'Products', icon: <ProductsIcon />, href: '/dashboard/products' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleDrawerToggle = useCallback(() => setMobileOpen((p) => !p), []);
  const handleCollapse = useCallback(() => setCollapsed((p) => !p), []);

  const drawerWidth = isMobile ? DRAWER_WIDTH : collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box
        sx={{
          px: collapsed && !isMobile ? 1 : 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
          minHeight: 64,
        }}
      >
        {(!collapsed || isMobile) && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #1A1A2E, #E94560)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            AdminHub
          </Typography>
        )}
        {!isMobile && (
          <IconButton size="small" onClick={handleCollapse}>
            {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Nav Items */}
      <List sx={{ px: 1, pt: 1, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed && !isMobile ? item.label : ''} placement="right">
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={isMobile ? handleDrawerToggle : undefined}
                  sx={{
                    borderRadius: 2,
                    minHeight: 44,
                    justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                    px: collapsed && !isMobile ? 1.5 : 2,
                    bgcolor: active ? 'primary.main' : 'transparent',
                    color: active ? 'white' : 'text.secondary',
                    '& .MuiListItemIcon-root': { color: active ? 'white' : 'text.secondary' },
                    '&:hover': {
                      bgcolor: active ? 'primary.dark' : 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  {(!collapsed || isMobile) && (
                    <ListItemText
                      primary={item.label}
                      slotProps={{ primary: { style: { fontSize: '0.875rem', fontWeight: active ? 600 : 400 } } }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User info + logout */}
      <Box sx={{ p: collapsed && !isMobile ? 1 : 2 }}>
        {(!collapsed || isMobile) ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Avatar
              src={session?.user?.image || ''}
              sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}
            >
              {session?.user?.name?.[0]}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {session?.user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {session?.user?.email}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Avatar src={session?.user?.image || ''} sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {session?.user?.name?.[0]}
            </Avatar>
          </Box>
        )}
        <Tooltip title={collapsed && !isMobile ? 'Sign Out' : ''} placement="right">
          <ListItemButton
            onClick={() => signOut({ callbackUrl: '/login' })}
            sx={{
              borderRadius: 2,
              color: 'error.main',
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              px: collapsed && !isMobile ? 1.5 : 2,
              '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 36, color: 'error.main' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            {(!collapsed || isMobile) && (
              <ListItemText primary="Sign Out" slotProps={{ primary: { style: { fontSize: '0.875rem' } } }} />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: 'white',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800 }} color="primary">
              AdminHub
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            transition: theme.transitions.create('width', { duration: 200 }),
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              overflowX: 'hidden',
              transition: theme.transitions.create('width', { duration: 200 }),
              borderRight: '1px solid rgba(0,0,0,0.08)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          pt: isMobile ? 8 : 0,
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
