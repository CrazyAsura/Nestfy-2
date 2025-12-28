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
  Box
} from '@mui/material'

// Ícones
import MenuIcon from '@mui/icons-material/Menu'
import StoreIcon from '@mui/icons-material/Store'
import CategoryIcon from '@mui/icons-material/Category'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PersonIcon from '@mui/icons-material/Person'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { ThemeToggle } from './ThemeToggle'

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
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 800,
                letterSpacing: '-0.5px'
              }}
            >
              LOJA VIRTUAL
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
          </Box>
        </Toolbar>
      </MotionAppBar>

      {/* DRAWER */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            width: 280,
            overflowX: 'hidden',
            backgroundImage: 'none'
          }
        }}
      >
        <MotionBox 
          sx={{ p: 2 }}
          variants={menuVariants}
          initial="hidden"
          animate={open ? "visible" : "hidden"}
        >
          <Typography 
            variant="h5" 
            sx={{ fontWeight: 900, mb: 2 }}
          >
            MENU
          </Typography>

          <List>
            <AnimatePresence>
              {/* HOME */}
              <MotionListItem 
                key="home" 
                variants={itemVariants}
                whileHover={{ x: 10, backgroundColor: 'action.hover' }}
                whileTap={{ scale: 0.95 }}
              >
                <ListItemButton component={Link} href="/" onClick={toggleDrawer(false)}>
                  <ListItemIcon sx={{ color: 'inherit' }}><StoreIcon /></ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </MotionListItem>

              {/* CATEGORIES */}
              <MotionListItem 
                key="categories" 
                variants={itemVariants}
                whileHover={{ x: 10, backgroundColor: 'action.hover' }}
                whileTap={{ scale: 0.95 }}
              >
                <ListItemButton component={Link} href="/categories" onClick={toggleDrawer(false)}>
                  <ListItemIcon sx={{ color: 'inherit' }}><CategoryIcon /></ListItemIcon>
                  <ListItemText primary="Categories" />
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
