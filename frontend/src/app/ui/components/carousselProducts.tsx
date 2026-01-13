'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Image from 'next/image';
import Link from 'next/link';
import { useProductsCaroussel } from '@/app/libs/hooks/useProducts';
import { calculateDiscountPercent } from '@/app/libs/utils/function/calculateDiscountPercent';
import { useDispatch } from 'react-redux';
import { selectProduct } from '@/app/libs/stores/slices/products.slice';
import { motion, Variants } from 'framer-motion';
import { getUploadsURL } from '@/app/libs/api/services/axios';
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    CardMedia, 
    Skeleton, 
    Container,
    Chip,
    IconButton,
    Stack,
    Button,
    useTheme,
    Grid
} from '@mui/material';
import { ChevronLeft, ChevronRight, ShoppingBagOutlined } from '@mui/icons-material';

const MotionCard = motion(Card);
const MotionImage = motion(Image);
const MotionChip = motion(Chip);

export default function CarousselProducts() {
    const { data: products, isLoading } = useProductsCaroussel();
    const dispatch = useDispatch();
    const theme = useTheme();

    if (isLoading) {
        return (
            <Box sx={{ py: 10 }}>
                <Container>
                    <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={300} height={20} sx={{ mb: 6 }} />
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4].map((i) => (
                            <Grid size={{xs: 12, sm: 6, md: 3}} key={i}>
                                <Skeleton variant="rectangular" height={400} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        );
    }

    const sortedProducts = [...(products ?? [])]
        .filter(p => p.discountPrice && p.discountPrice < p.price)
        .sort((a, b) => {
            const discountA = calculateDiscountPercent(a.price, a.discountPrice || 0);
            const discountB = calculateDiscountPercent(b.price, b.discountPrice || 0);
            return discountB - discountA;
        });

    const cardVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: i * 0.05,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

   return (
    <Box sx={{ 
        py: 12, 
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden'
    }}>
      <Container maxWidth="xl">
        <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="flex-end" 
            sx={{ mb: 8, px: { xs: 2, md: 0 } }}
        >
            <Box>
                <Typography
                    variant="overline"
                    sx={{ 
                        color: 'primary.main', 
                        fontWeight: 700, 
                        letterSpacing: '0.3em',
                        mb: 1,
                        display: 'block'
                    }}
                >
                    CURADORIA EXCLUSIVA
                </Typography>
                <Typography
                    variant="h3"
                    sx={{ 
                        fontFamily: 'var(--font-playfair)',
                        fontWeight: 700,
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        lineHeight: 1.1
                    }}
                >
                    Ofertas de <Box component="span" sx={{ color: 'primary.main' }}>Elite</Box>
                </Typography>
            </Box>

            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton 
                    className="swiper-button-prev-custom"
                    sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider',
                        width: 50,
                        height: 50,
                        transition: 'all 0.3s ease',
                        '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
                    }}
                >
                    <ChevronLeft />
                </IconButton>
                <IconButton 
                    className="swiper-button-next-custom"
                    sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider',
                        width: 50,
                        height: 50,
                        transition: 'all 0.3s ease',
                        '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
                    }}
                >
                    <ChevronRight />
                </IconButton>
            </Stack>
        </Stack>
      </Container>

      <Box sx={{ position: 'relative', px: { xs: 0, md: 4 } }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.2}
            grabCursor={true}
            navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
            }}
            pagination={{ 
                clickable: true,
                dynamicBullets: true,
                el: '.swiper-pagination-custom',
            }}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            }}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.5 },
              1440: { slidesPerView: 4.5 },
            }}
            style={{ padding: '20px 0 60px 0' }}
          >
            {sortedProducts.map((product, index) => {
              const discount = calculateDiscountPercent(
                product.price,
                product.discountPrice || 0,
              );

              return (
                <SwiperSlide key={product.id}>
                    <MotionCard
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={cardVariants}
                      sx={{
                        borderRadius: 0,
                        bgcolor: 'background.paper',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                        '&:hover': {
                            transform: 'translateY(-8px)',
                            '& .quick-add': {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                      }}
                      elevation={0}
                    >
                      <Link 
                        href={`/products/${product.id}/product-details`}
                        onClick={() => dispatch(selectProduct(product))}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'block', position: 'relative' }}
                      >
                        {discount > 0 && (
                            <Chip
                                label={`-${discount}%`}
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 20,
                                    left: 20,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    fontWeight: 700,
                                    borderRadius: 0,
                                    zIndex: 2,
                                    height: 24,
                                    fontSize: '0.7rem'
                                }}
                            />
                        )}

                        <Box sx={{ 
                            position: 'relative', 
                            height: { xs: '300px', md: '400px' },
                            bgcolor: '#F5F5F5',
                            overflow: 'hidden'
                        }}>
                            <MotionImage
                                src={getUploadsURL(product.imageUrl || product.images?.[0]?.url || '/next.svg')}
                                alt={product.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                            
                            {/* Overlay de Quick Add */}
                            <Box 
                                className="quick-add"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    p: 2,
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                    backdropFilter: 'blur(4px)',
                                    opacity: 0,
                                    transform: 'translateY(100%)',
                                    transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    zIndex: 3
                                }}
                            >
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<ShoppingBagOutlined />}
                                    sx={{ 
                                        borderRadius: 0,
                                        py: 1.5,
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.1em'
                                    }}
                                >
                                    ADICIONAR À SACOLA
                                </Button>
                            </Box>
                        </Box>

                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: 'text.secondary',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                    mb: 1,
                                    display: 'block'
                                }}
                            >
                                {product.brand?.name || 'COLEÇÃO PRIVADA'}
                            </Typography>
                            
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontFamily: 'var(--font-playfair)',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    mb: 1.5,
                                    height: '1.5em',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {product.name}
                            </Typography>

                            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        textDecoration: 'line-through',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        color: 'primary.main',
                                        fontWeight: 700,
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.discountPrice ?? product.price)}
                                </Typography>
                            </Stack>
                        </CardContent>
                      </Link>
                    </MotionCard>
                </SwiperSlide>
              );
            })}
          </Swiper>
          
          <Box className="swiper-pagination-custom" sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: -2,
              '& .swiper-pagination-bullet': {
                  bgcolor: 'divider',
                  opacity: 1,
                  width: 12,
                  height: 2,
                  borderRadius: 0,
                  transition: 'all 0.3s ease'
              },
              '& .swiper-pagination-bullet-active': {
                  bgcolor: 'primary.main',
                  width: 40
              }
          }} />
      </Box>
    </Box>
  );
}