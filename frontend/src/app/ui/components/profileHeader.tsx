'use client'

import { Avatar, Box, Typography, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { Edit } from '@mui/icons-material'
import Link from 'next/link'

type Props = {
  name: string
  email: string
  image?: string | null
}

export default function ProfileHeader({name, email, image}: Props) {
    const imageUrl = image ? (image.startsWith('http') ? image : `/uploads/${image}`) : undefined;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, position: 'relative' }}>
            <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
                <Button 
                    component={Link} 
                    href="/profile/edit" 
                    startIcon={<Edit />}
                    variant="outlined"
                    size="small"
                >
                    Editar Perfil
                </Button>
            </Box>
            <Avatar 
                src={imageUrl} 
                sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
            >
                {name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" component="h1" gutterBottom>
                {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {email}
            </Typography>
        </Box>
    )
}