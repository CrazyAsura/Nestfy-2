'use client';

import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '90vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        bgcolor: 'black',
      }}
    >
      {/* Background Image with Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)',
          },
        }}
      />

      <Container sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4} maxWidth="700px">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: '0.4em',
                mb: 2,
                display: 'block',
              }}
            >
              COLEÇÃO EXCLUSIVA 2026
            </Typography>
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontFamily: 'var(--font-playfair)',
                fontWeight: 700,
                fontSize: { xs: '3.5rem', md: '5rem' },
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              A Arte do Luxo e da Tecnologia
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 300,
                letterSpacing: '0.05em',
                mb: 4,
                maxWidth: '500px',
              }}
            >
              Descubra uma curadoria impecável de produtos que definem o seu estilo de vida sofisticado.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={Link}
                href="/categories"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '0.9rem',
                }}
              >
                Explorar Agora
              </Button>
              <Button
                component={Link}
                href="/products"
                variant="outlined"
                size="large"
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '0.9rem',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    bgcolor: 'transparent',
                  },
                }}
              >
                Ver Coleções
              </Button>
            </Stack>
          </motion.div>
        </Stack>
      </Container>

      {/* Decorative Elements */}
      <Box
        component={motion.div}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          color: 'rgba(255,255,255,0.3)',
        }}
      >
        <Typography variant="caption" sx={{ letterSpacing: '0.2em' }}>
          SCROLL
        </Typography>
        <Box sx={{ width: '1px', height: '40px', bgcolor: 'rgba(255,255,255,0.3)' }} />
      </Box>
    </Box>
  );
}
