'use client'

import { Box, Container, Paper, Skeleton, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../libs/stores'
import { useProfile } from '@/app/libs/hooks/useProfile'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import ProfileHeader from "../ui/components/profileHeader";
import ProfileContent from "../ui/components/profileContent";
import { Profile as UserProfile } from '../libs/types/profile'
const MotionPaper = motion(Paper)


export default function Profile() {
    const userRedux = useSelector((state: RootState) => state.auth.user)
    const {data: profile, isLoading} = useProfile();

    if (!userRedux) redirect('/login')

    if (isLoading || !profile) {
        return (
            <Box sx={{ py: 6 }}>
                <Container maxWidth="sm">
                    <Typography variant="h4" sx={{ mb: 4 }}>Perfil</Typography>
                    <Skeleton animation="wave" height={400} />
                </Container>    
            </Box>
        )
    }
    return (
        <>
            <Box minHeight="100vh" bgcolor="background.defaul" py={6}>
                <Container maxWidth='sm'>
                    <MotionPaper
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration:0.3 }}
                    elevation={0}
                    sx={{
                        p: 4,
                        border: '1px solid #000',
                        borderRadius: 0,
                    }}>
                        <ProfileHeader 
                        name={profile.name}
                        email={profile.email}
                        image={profile.image}
                         />
                        <ProfileContent 
                        profile={profile}
                        />
                    </MotionPaper>
                </Container>
            </Box>
        </>
    )
}