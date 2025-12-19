'use client'

import { useState } from 'react'
import Link from 'next/link'

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

export function StoreMenu() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (value: boolean) => () => {
        setOpen(value);
    };

    return(
        <>
        <AppBar position='static' sx={{ bgcolor: 'black' }}>
            <Toolbar>
                <IconButton
                edge="start"
                color='inherit' 
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>

                <Typography variant='h6' component="div" sx={{ flexGrow: 1 }}>
                    Nestfy
                </Typography>
            </Toolbar>
        </AppBar>

        <Drawer  
        anchor='left'
        open={open}
        onClose={toggleDrawer(false)}>
            <Box width={250} role='presentation'>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/">
                            <ListItemIcon>
                                <StoreIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/categories">
                            <ListItemIcon>
                                <CategoryIcon />
                            </ListItemIcon>
                            <ListItemText primary="Categories" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/cart">
                            <ListItemIcon>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Cart" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/orders">
                            <ListItemIcon>
                                <ReceiptIcon />
                            </ListItemIcon>
                            <ListItemText primary="Orders" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/profile">
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
        </>
    )
}