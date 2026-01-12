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
import Link from 'next/link';
import { useCategories } from '@/app/libs/hooks/useCategories';
import { Category } from '@/app/libs/types/category';

const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

export default function ListCategories() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useCategories(page, limit);

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
                                height={200} 
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
      <Container sx={{ py: 10 }}>
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
             >
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography 
                        variant='h4' 
                        sx={{ 
                            fontFamily: 'var(--font-playfair)',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            mb: 2
                        }}
                    >
                        Nossas Categorias
                    </Typography>
                    <Box sx={{ width: 40, height: 1, bgcolor: 'primary.main', mx: 'auto' }} />
                </Box>
             </motion.div>
     
             <AnimatePresence mode='wait'>
                 <MotionGrid 
                container 
                spacing={4}
                key={page}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                sx={{ justifyContent: 'center' }}
            >
                {data?.data && data.data.length > 0 ? (
                    data.data.map((category: Category) => (
                        <Grid size={{ xs: 6, sm: 4, md: 2 }} key={category.id}>
                            <Link href={`/categories/${category.id}`} style={{ textDecoration: 'none' }}>
                                <MotionCard
                                    variants={cardVariants}
                                    whileHover="hover"
                                    sx={{
                                        borderRadius: '50%',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        bgcolor: 'background.paper',
                                        aspectRatio: '1/1',
                                        transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            boxShadow: '0 10px 30px rgba(175, 148, 79, 0.15)',
                                        }
                                    }}
                                    elevation={0}
                                >
                                    <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                                        <Image
                                            src={category.imageUrl || '/next.svg'}
                                            alt={category.name}
                                            fill
                                            style={{ 
                                                objectFit: 'cover', 
                                                opacity: 0.9,
                                                transition: 'transform 0.8s ease'
                                            }}
                                        />
                                        <Box sx={{ 
                                            position: 'absolute', 
                                            bottom: 0, 
                                            left: 0, 
                                            width: '100%', 
                                            height: '40%', 
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            justifyContent: 'center',
                                            pb: 3,
                                            px: 2
                                        }}>
                                            <Typography 
                                                variant='body2' 
                                                sx={{ 
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.65rem',
                                                    textAlign: 'center',
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                {category.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MotionCard>
                            </Link>
                        </Grid>
                    ))
                ) : (
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
                            NENHUMA CATEGORIA ENCONTRADA.
                        </Typography>
                    </Grid>
                )}
            </MotionGrid>
             </AnimatePresence>
     
             <Box display='flex' justifyContent='center' mt={10}>
                 <Pagination 
                     count={data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0}
                     page={page}
                     onChange={(_, value) => {
                         setPage(value);
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                     }}
                     color='primary'
                     shape="rounded"
                     size="small"
                     sx={{
                        '& .MuiPaginationItem-root': {
                            borderRadius: 0,
                            fontSize: '0.7rem'
                        }
                     }}
                 />
             </Box>
          </Container>
    )
}