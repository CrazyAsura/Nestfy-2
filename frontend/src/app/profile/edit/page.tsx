'use client'

import { Box, Container, Paper, Skeleton, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../libs/stores'
import { useProfile } from '@/app/libs/hooks/useProfile'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import EditProfileForm from "../../ui/components/editProfileForm"

const MotionPaper = motion(Paper)

export default function EditProfilePage() {
    const userRedux = useSelector((state: RootState) => state.auth.user)
    const { data: profile, isLoading } = useProfile()

    if (!userRedux) redirect('/login')

    if (isLoading || !profile) {
        return (
            <Box sx={{ py: 6 }}>
                <Container maxWidth="md">
                    <Skeleton animation="wave" height={600} />
                </Container>    
            </Box>
        )
    }

    return (
        <Box minHeight="100vh" bgcolor="#f5f5f5" py={6}>
            <Container maxWidth='md'>
                <MotionPaper
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    elevation={0}
                    sx={{
                        p: 4,
                        border: '1px solid #000',
                        borderRadius: 0,
                    }}
                >
                    <EditProfileForm profile={profile} />
                </MotionPaper>
            </Container>
        </Box>
    )
}
