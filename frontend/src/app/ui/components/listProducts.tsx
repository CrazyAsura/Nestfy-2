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
import { useDispatch } from 'react-redux';
import { selectProduct } from '@/app/libs/stores/slices/products.slice';

const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

interface ListProductsProps {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    showTitle?: boolean;
}

export default function ListProducts({ 
    search, 
    categoryId, 
    minPrice, 
    maxPrice, 
    sortBy, 
    order,
    showTitle = true 
}: ListProductsProps) {
    const [page, setPage] = useState(1);
    const limit = 12;

    const { data, isLoading } = useProducts(page, limit, search, categoryId, minPrice, maxPrice, sortBy, order);
    const dispatch = useDispatch();

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
                    {[...Array(limit)].map((_, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <Skeleton 
                                variant="rectangular" 
                                height={450} 
                                sx={{ borderRadius: 0, bgcolor: 'rgba(0,0,0,0.03)' }} 
                                animation="wave"
                            />
                            <Skeleton width="60%" sx={{ mt: 2, mx: 'auto' }} />
                            <Skeleton width="40%" sx={{ mt: 1, mx: 'auto' }} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    return (
     <Container sx={{ py: 6 }}>
        {showTitle && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography 
                        variant='h3' 
                        sx={{ 
                            fontFamily: 'var(--font-playfair)',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            mb: 2,
                            textTransform: 'uppercase'
                        }}
                    >
                        Coleção Exclusiva
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        Peças selecionadas com o mais alto padrão de qualidade
                    </Typography>
                    <Box sx={{ width: 60, height: 2, bgcolor: 'primary.main', mx: 'auto', mt: 3 }} />
                </Box>
            </motion.div>
        )}

        <AnimatePresence mode='wait'>
            <MotionGrid 
                container 
                spacing={4}
                key={page}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {data?.data && data.data.length > 0 ? (
                    data.data.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                            <Link 
                                href={`/products/${product.id}/product-details`}
                                onClick={() => dispatch(selectProduct(product))}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <MotionCard
                                    variants={cardVariants}
                                    whileHover="hover"
                                    sx={{
                                        borderRadius: 0,
                                        border: 'none',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        bgcolor: 'transparent',
                                        height: '100%',
                                        transition: 'all 0.4s ease',
                                    }}
                                    elevation={0}
                                >
                                    <Box sx={{ position: 'relative', height: 380, overflow: 'hidden', mb: 2 }}>
                                        <Image
                                            src={product.imageUrl || product.images?.[0]?.url || '/next.svg'}
                                            alt={product.name}
                                            fill
                                            style={{ objectFit: 'cover', transition: 'transform 0.8s ease' }}
                                            className="product-image"
                                        />
                                        <Box className="image-overlay" sx={{ 
                                            position: 'absolute', 
                                            top: 0, 
                                            left: 0, 
                                            width: '100%', 
                                            height: '100%', 
                                            bgcolor: 'rgba(0,0,0,0.02)',
                                            transition: 'background-color 0.4s ease'
                                        }} />
                                    </Box>

                                    <CardContent sx={{ p: 0, textAlign: 'center' }}>
                                        <Typography 
                                            variant='body2' 
                                            sx={{ 
                                                mb: 1,
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                fontWeight: 500,
                                                color: 'text.primary',
                                                height: '2.5em',
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {product.name}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main', letterSpacing: '0.05em' }}>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.discountPrice ?? product.price)}
                                            </Typography>
                                            
                                            {product.discountPrice && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{ 
                                                        textDecoration: 'line-through', 
                                                        color: 'text.disabled',
                                                        letterSpacing: '0.05em'
                                                    }}
                                                >
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </MotionCard>
                            </Link>
                        </Grid>
                    ))
                ) : (
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
                            NENHUM PRODUTO ENCONTRADO.
                        </Typography>
                    </Grid>
                )}
            </MotionGrid>
        </AnimatePresence>

        <Box display='flex' justifyContent='center' mt={12}>
            {data?.meta && data.meta.totalPages > 1 && (
                <Pagination 
                    count={data.meta.totalPages}
                    page={page}
                    onChange={(_, value) => {
                        setPage(value);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    color='primary'
                    shape="rounded"
                    size="large"
                    sx={{
                        '& .MuiPaginationItem-root': {
                            borderRadius: 0,
                            border: '1px solid transparent',
                            '&.Mui-selected': {
                                bgcolor: 'transparent',
                                color: 'primary.main',
                                border: '1px solid',
                                borderColor: 'primary.main',
                            },
                            '&:hover': {
                                bgcolor: 'rgba(175, 148, 79, 0.05)',
                            }
                        }
                    }}
                />
            )}
        </Box>
     </Container>
    )
}
