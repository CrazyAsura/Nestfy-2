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
    <Box sx={{ py: 6 }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={titleVariants}
      >
        <Typography
            variant="h4"
            fontWeight={900}
            mb={4}
            textTransform="uppercase"
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.75rem', md: '2.5rem' }
            }}
        >
            <motion.span
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                }}
            >
                🔥
            </motion.span> 
            Maiores Descontos
        </Typography>
      </motion.div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1.2}
        grabCursor={true}
        loop={true}
        autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        }}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 5 },
        }}
        style={{ padding: '20px 0' }}
      >
        {sortedProducts.map((product, index) => {
          const discount = calculateDiscountPercent(
            product.price,
            product.discountPrice || 0,
          );

          return (
            <SwiperSlide key={product.id}>
              <Link 
                href={`/products/${product.id}`}
                onClick={() => dispatch(selectProduct(product))}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <MotionCard
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={cardVariants}
                  whileHover="hover"
                  sx={{
                    borderRadius: 0,
                    border: '2px solid #000',
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  elevation={0}
                >
                  {discount > 0 && (
                    <MotionChip
                      label={`-${discount}%`}
                      initial={{ x: -100 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 100 }}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        backgroundColor: '#000',
                        color: '#fff',
                        fontWeight: 900,
                        zIndex: 2,
                        borderRadius: 0,
                        px: 1,
                        fontSize: '0.875rem',
                      }}
                    />
                  )}

                  <Box sx={{ 
                    overflow: 'hidden', 
                    position: 'relative', 
                    height: '320px',
                    borderBottom: '2px solid #000'
                  }}>
                    <MotionImage
                      src={product.imageUrl || '/next.svg'}
                      alt={product.name}
                      width={400}
                      height={400}
                      variants={{
                        hover: { 
                            scale: 1.05,
                            filter: 'grayscale(0%)'
                        }
                      }}
                      initial={{ filter: 'grayscale(20%)' }}
                      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    <motion.div
                        variants={{
                            hover: { opacity: 1, y: 0 }
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: '#000',
                            color: '#fff',
                            padding: '12px',
                            textAlign: 'center',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.1em'
                        }}
                    >
                        Ver Detalhes
                    </motion.div>
                  </Box>

                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography 
                        variant="h6" 
                        fontWeight={800}
                        sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.2,
                            mb: 2,
                            textTransform: 'uppercase'
                        }}
                    >
                      {product.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                        <Typography 
                            variant="h5" 
                            fontWeight={900}
                        >
                            R$ {product.discountPrice ?? product.price}
                        </Typography>
                        
                        {product.discountPrice && (
                            <Typography
                                variant="body2"
                                sx={{ 
                                    textDecoration: 'line-through', 
                                    color: 'text.disabled',
                                    fontWeight: 600
                                }}
                            >
                                R$ {product.price}
                            </Typography>
                        )}
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