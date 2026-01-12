'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/app/libs/stores'
import { logout } from '@/app/libs/stores/slices/auth.slice'

// Material UI
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Stack,
  Button
} from '@mui/material'

// Ícones
import MenuIcon from '@mui/icons-material/Menu'
import StoreIcon from '@mui/icons-material/Store'
import CategoryIcon from '@mui/icons-material/Category'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ReceiptIcon from '@mui/icons-material/Receipt'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { ThemeToggle } from './ThemeToggle'
import { CartDrawer } from './CartDrawer'
import { useCart } from '@/app/libs/hooks/useCart'
import { Badge } from '@mui/material'

import { motion, AnimatePresence, Variants } from 'framer-motion'


const MotionAppBar = motion(AppBar)
const MotionListItem = motion(ListItem)
const MotionBox = motion(Box)

const menuVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  },
  exit: { x: -20, opacity: 0 }
}

export function StoreMenu() {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const { totalItems, setOpen: setCartOpen } = useCart()


  const toggleDrawer = (value: boolean) => () => {
    setOpen(value)
  }

  const handleLogout = () => {
    dispatch(logout())
    setOpen(false)
  }

  return (
    <>
      {/* HEADER */}
      <MotionAppBar
        position="sticky"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        sx={{
          bgcolor: 'background.paper',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundImage: 'none'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: 90 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer(true)}
              sx={{ mr: 3 }}
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MenuIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <Typography
              variant="h4"
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 800,
                fontFamily: 'var(--font-playfair)',
                letterSpacing: '0.3em',
                background: 'linear-gradient(45deg, #AF944F 30%, #D4AF37 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              NESTFY
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, mr: 6 }}>
              {[
                { label: 'HOME', href: '/' },
                { label: 'COLEÇÕES', href: '/categories' },
                { label: 'PRODUTOS', href: '/products' },
                ...(user ? [{ label: 'PEDIDOS', href: '/orders' }] : [])
              ].map((item) => (
                <Typography 
                  key={item.label}
                  component={Link} 
                  href={item.href} 
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'text.primary', 
                    fontSize: '0.75rem', 
                    letterSpacing: '0.2em', 
                    fontWeight: 600, 
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: 0,
                      height: '1px',
                      bgcolor: 'primary.main',
                      transition: 'width 0.3s ease'
                    },
                    '&:hover': { 
                      color: 'primary.main',
                      '&::after': { width: '100%' }
                    } 
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                color="inherit"
                onClick={() => setCartOpen(true)}
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                sx={{ p: 1.5 }}
              >
                <Badge 
                  badgeContent={totalItems} 
                  color="primary" 
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      borderRadius: 0,
                      fontSize: '0.6rem',
                      height: 16,
                      minWidth: 16
                    } 
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 24 }} />
                </Badge>
              </IconButton>
              
              <Box sx={{ ml: 1 }}>
                <ThemeToggle />
              </Box>

              {user ? (
                <IconButton
                  component={Link}
                  href="/profile"
                  color="inherit"
                  sx={{ p: 1.5 }}
                >
                   <PersonIcon sx={{ fontSize: 24 }} />
                </IconButton>
              ) : (
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    ml: 2, 
                    px: 3, 
                    py: 1, 
                    fontSize: '0.7rem',
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                >
                  LOGIN
                </Button>
              )}
            </Stack>
          </Box>
        </Toolbar>
      </MotionAppBar>

      <CartDrawer />

      {/* DRAWER */}

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
            color: 'text.primary',
            width: 320,
            overflowX: 'hidden',
            backgroundImage: 'none',
            borderRadius: 0,
            p: 4
          }
        }}
      >
        <MotionBox 
          variants={menuVariants}
          initial="hidden"
          animate={open ? "visible" : "hidden"}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 6, 
              fontFamily: 'var(--font-playfair)',
              letterSpacing: '0.1em'
            }}
          >
            NESTFY
          </Typography>

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AnimatePresence>
              {/* HOME */}
              <MotionListItem 
                key="home" 
                disablePadding
                variants={itemVariants}
                whileHover={{ x: 10 }}
              >
                <ListItemButton component={Link} href="/" onClick={toggleDrawer(false)} sx={{ py: 1.5 }}>
                  <ListItemText 
                    primary="HOME" 
                    primaryTypographyProps={{ 
                      fontSize: '1rem', 
                      letterSpacing: '0.2em',
                      fontWeight: 400
                    }} 
                  />
                </ListItemButton>
              </MotionListItem>

              {/* CATEGORIES */}
              <MotionListItem 
                key="categories" 
                disablePadding
                variants={itemVariants}
                whileHover={{ x: 10 }}
              >
                <ListItemButton component={Link} href="/categories" onClick={toggleDrawer(false)} sx={{ py: 1.5 }}>
                  <ListItemText 
                    primary="COLEÇÕES" 
                    primaryTypographyProps={{ 
                      fontSize: '1rem', 
                      letterSpacing: '0.2em',
                      fontWeight: 400
                    }} 
                  />
                </ListItemButton>
              </MotionListItem>

              {/* CART (SÓ LOGADO) */}
              {user && (
                <MotionListItem 
                  key="cart" 
                  variants={itemVariants}
                  whileHover={{ x: 10, backgroundColor: 'action.hover' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ListItemButton component={Link} href="/cart" onClick={toggleDrawer(false)}>
                    <ListItemIcon sx={{ color: 'inherit' }}><ShoppingCartIcon /></ListItemIcon>
                    <ListItemText primary="Cart" />
                  </ListItemButton>
                </MotionListItem>
              )}

              {/* ORDERS (SÓ LOGADO) */}
              {user && (
                <MotionListItem 
                  key="orders" 
                  variants={itemVariants}
                  whileHover={{ x: 10, backgroundColor: 'action.hover' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ListItemButton component={Link} href="/orders" onClick={toggleDrawer(false)}>
                    <ListItemIcon sx={{ color: 'inherit' }}><ReceiptIcon /></ListItemIcon>
                    <ListItemText primary="Orders" />
                  </ListItemButton>
                </MotionListItem>
              )}

              {/* NOTIFICATIONS (SÓ LOGADO) */}
              {user && (
                <MotionListItem 
                  key="notifications" 
                  variants={itemVariants}
                  whileHover={{ x: 10, backgroundColor: 'action.hover' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ListItemButton component={Link} href="/notifications" onClick={toggleDrawer(false)}>
                    <ListItemIcon sx={{ color: 'inherit' }}><NotificationsIcon /></ListItemIcon>
                    <ListItemText primary="Notifications" />
                  </ListItemButton>
                </MotionListItem>
              )}

              {/* PROFILE */}
              {user && (
                <MotionListItem 
                  key="profile" 
                  variants={itemVariants}
                  whileHover={{ x: 10, backgroundColor: 'action.hover' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ListItemButton component={Link} href="/profile" onClick={toggleDrawer(false)}>
                    <ListItemIcon sx={{ color: 'inherit' }}><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </MotionListItem>
              )}

              {/* ADMIN */}
              {user?.role === 'ADMIN' && (
                <MotionListItem 
                  key="admin" 
                  variants={itemVariants}
                  whileHover={{ x: 10, backgroundColor: 'action.hover' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ListItemButton component={Link} href="/admin" onClick={toggleDrawer(false)}>
                    <ListItemIcon sx={{ color: 'inherit' }}><AdminPanelSettingsIcon /></ListItemIcon>
                    <ListItemText primary="Admin" />
                  </ListItemButton>
                </MotionListItem>
              )}

              {/* LOGIN */}
              {!user && (
                <MotionListItem 
                  key="login" 
                  variants={itemVariants}
                  whileHover={{ x: 10, backgroundColor: 'action.hover' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ListItemButton component={Link} href="/login" onClick={toggleDrawer(false)}>
                    <ListItemIcon sx={{ color: 'inherit' }}><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </MotionListItem>
              )}

              {/* LOGOUT */}
              {user && (
                <MotionListItem 
                  key="logout" 
                  variants={itemVariants}
                  whileHover={{ x: 10, backgroundColor: 'action.hover' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon sx={{ color: 'inherit' }}><ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </MotionListItem>
              )}

            </AnimatePresence>
          </List>
        </MotionBox>
      </Drawer>
    </>
  )
}
