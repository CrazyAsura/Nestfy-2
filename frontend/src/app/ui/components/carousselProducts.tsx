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
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    CardMedia, 
    Skeleton, 
    Container,
    Chip
} from '@mui/material';

const MotionCard = motion(Card);
const MotionImage = motion(Image);
const MotionChip = motion(Chip);

export default function CarousselProducts() {
    const { data: products, isLoading } = useProductsCaroussel();
    const dispatch = useDispatch();

    if (isLoading) {
        return (
            <Container sx={{ py: 8 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, textTransform: 'uppercase' }}>
                    Destaques
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton 
                            key={i} 
                            variant="rectangular" 
                            width={280} 
                            height={400} 
                            sx={{ 
                                flexShrink: 0,
                                borderRadius: 1,
                                bgcolor: 'rgba(0,0,0,0.05)'
                            }} 
                            animation="wave"
                        />
                    ))}
                </Box>
            </Container>
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
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1],
            }
        }),
        hover: {
            y: -10,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const titleVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

   return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container>
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={titleVariants}
        >
            <Box sx={{ mb: 6 }}>
                <Typography
                    variant="h4"
                    sx={{ 
                        fontFamily: 'var(--font-playfair)',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        mb: 1
                    }}
                >
                    Ofertas de Prestígio
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Oportunidades exclusivas em nossa curadoria
                </Typography>
            </Box>
        </motion.div>
      </Container>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1.2}
        grabCursor={true}
        loop={true}
        autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        }}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4.5 },
        }}
        style={{ padding: '0 5%' }}
      >
        {sortedProducts.map((product, index) => {
          const discount = calculateDiscountPercent(
            product.price,
            product.discountPrice || 0,
          );

          return (
            <SwiperSlide key={product.id}>
              <Link 
                href={`/products/${product.id}/product-details`}
                onClick={() => dispatch(selectProduct(product))}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <MotionCard
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
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
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  elevation={0}
                >
                  {discount > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 600,
                        zIndex: 2,
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em'
                      }}
                    >
                      -{discount}%
                    </Box>
                  )}

                  <Box sx={{ 
                    overflow: 'hidden', 
                    position: 'relative', 
                    height: '400px',
                    mb: 2
                  }}>
                    <MotionImage
                      src={product.imageUrl || product.images?.[0]?.url || '/next.svg'}
                      alt={product.name}
                      width={400}
                      height={400}
                      variants={{
                        hover: { 
                            scale: 1.1
                        }
                      }}
                      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>

                  <CardContent sx={{ p: 0, textAlign: 'center' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        letterSpacing: '0.05em', 
                        textTransform: 'uppercase',
                        mb: 1,
                        color: 'text.primary'
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.discountPrice ?? product.price)}
                      </Typography>
                      <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </Typography>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
}