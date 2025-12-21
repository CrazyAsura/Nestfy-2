'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Pagination,
  CircularProgress,
  Skeleton,
  Container,
} from '@mui/material';
import { useProducts } from '@/app/libs/hooks/useProducts';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

export default function ListProducts() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useProducts(page, limit);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
        hover: {
            y: -8,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    if (isLoading) {
        return (
            <Container sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    {[...Array(10)].map((_, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={i}>
                            <Skeleton 
                                variant="rectangular" 
                                height={350} 
                                sx={{ borderRadius: 2, bgcolor: 'rgba(0,0,0,0.05)' }} 
                                animation="wave"
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    return (
     <Container sx={{ py: 6 }}>
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Typography 
                variant='h4' 
                fontWeight={900} 
                mb={4} 
                textTransform="uppercase"
                sx={{ letterSpacing: '0.02em' }}
            >
                🛍️ Nossos Produtos
            </Typography>
        </motion.div>

        <AnimatePresence mode='wait'>
            <MotionGrid 
                container 
                spacing={3}
                key={page}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {data?.data && data.data.length > 0 ? (
                    data.data.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={product.id}>
                            <MotionCard
                                variants={cardVariants}
                                whileHover="hover"
                                sx={{
                                    borderRadius: 2,
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    bgcolor: 'background.paper',
                                    height: '100%',
                                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                                    }
                                }}
                                elevation={0}
                            >
                                <Box sx={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                                    <Image
                                        src={product.imageUrl || '/next.svg'}
                                        alt={product.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Box>

                                <CardContent sx={{ p: 2.5 }}>
                                    <Typography 
                                        variant='subtitle1' 
                                        fontWeight="bold"
                                        sx={{ 
                                            mb: 1,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            minHeight: '3em'
                                        }}
                                    >
                                        {product.name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                                        <Typography variant="h6" fontWeight={900} color="primary.main">
                                            R$ {product.discountPrice ?? product.price}
                                        </Typography>
                                        
                                        {product.discountPrice && (
                                            <Typography
                                                variant="caption"
                                                sx={{ 
                                                    textDecoration: 'line-through', 
                                                    color: 'text.disabled',
                                                    fontWeight: 500
                                                }}
                                            >
                                                R$ {product.price}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </MotionCard>
                        </Grid>
                    ))
                ) : (
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body1" textAlign="center" color="text.secondary">
                            Nenhum produto encontrado.
                        </Typography>
                    </Grid>
                )}
            </MotionGrid>
        </AnimatePresence>

        <Box display='flex' justifyContent='center' mt={8}>
            <Pagination 
                count={data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0}
                page={page}
                onChange={(_, value) => {
                    setPage(value);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                color='primary'
                size="large"
                sx={{
                    '& .MuiPaginationItem-root': {
                        fontWeight: 'bold',
                        borderRadius: 2
                    }
                }}
            />
        </Box>
     </Container>
    )
}
