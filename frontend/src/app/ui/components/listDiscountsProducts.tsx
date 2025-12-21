'use client';

import { useProductsCaroussel } from '@/app/libs/hooks/useProducts';
import { calculateDiscountPercent } from '@/app/libs/utils/function/calculateDiscountPercent';
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    Skeleton, 
    Container,
    Grid,
    Chip,
    Pagination
} from '@mui/material';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { selectProduct } from '@/app/libs/stores/slices/products.slice';

const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

export default function ListDiscountsProducts() {
    const { data: products, isLoading } = useProductsCaroussel();
    const dispatch = useDispatch();
    
    // Paginação
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

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

    const sortedProducts = [...(products ?? [])]
        .filter(p => p.discountPrice && p.discountPrice < p.price)
        .sort((a, b) => {
            const discountA = calculateDiscountPercent(a.price, a.discountPrice || 0);
            const discountB = calculateDiscountPercent(b.price, b.discountPrice || 0);
            return discountB - discountA;
        });

    const startIndex = (page - 1) * itemsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <Container sx={{ py: 6 }}>
                <Typography 
                    variant='h4' 
                    fontWeight={900} 
                    mb={4} 
                    textTransform="uppercase"
                >
                    Produtos em Destaque
                </Typography>
                <Grid container spacing={3}>
                    {[...Array(5)].map((_, i) => (
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
                    🔥 Produtos em Destaque
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
                    {paginatedProducts.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={product.id}>
                            <Link 
                                href={`/product/${product.id}`} 
                                style={{ textDecoration: 'none' }}
                                onClick={() => dispatch(selectProduct(product))}
                            >
                                <MotionCard
                                    variants={cardVariants}
                                    whileHover="hover"
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        position: 'relative'
                                    }}
                                >
                                    {product.discountPrice && (
                                        <Chip
                                            label={`-${calculateDiscountPercent(product.price, product.discountPrice)}%`}
                                            color="error"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                fontWeight: 800,
                                                zIndex: 1,
                                                borderRadius: 1.5
                                            }}
                                        />
                                    )}

                                    <Box sx={{ position: 'relative', pt: '125%', overflow: 'hidden' }}>
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                        <Typography 
                                            variant="subtitle1" 
                                            fontWeight={700}
                                            sx={{
                                                mb: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                lineHeight: 1.2,
                                                minHeight: '2.4em'
                                            }}
                                        >
                                            {product.name}
                                        </Typography>

                                        <Box sx={{ mt: 'auto' }}>
                                            <Typography 
                                                variant="caption" 
                                                color="text.secondary"
                                                sx={{ textDecoration: 'line-through', display: 'block' }}
                                            >
                                                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </Typography>
                                            <Typography 
                                                variant="h6" 
                                                color="primary" 
                                                fontWeight={900}
                                            >
                                                R$ {product.discountPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </MotionCard>
                            </Link>
                        </Grid>
                    ))}
                </MotionGrid>
            </AnimatePresence>

            {totalPages > 1 && (
                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange}
                        color="primary" 
                        size="large"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontWeight: 700,
                                borderRadius: 2
                            }
                        }}
                    />
                </Box>
            )}
        </Container>
    );
}
