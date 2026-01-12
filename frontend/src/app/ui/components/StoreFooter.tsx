'use client'

import Link from 'next/link'
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider
} from '@mui/material'

// Ícones
import StoreIcon from '@mui/icons-material/Store'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

export function StoreFooter() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        pt: 10,
        pb: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-playfair)',
                  letterSpacing: '0.2em',
                  background: 'linear-gradient(45deg, #AF944F 30%, #D4AF37 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                NESTFY
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 2, letterSpacing: '0.05em' }}>
              Elevando o conceito de e-commerce com curadoria exclusiva e experiência premium. 
              Sua jornada de luxo começa aqui.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: '0.2em', mb: 3, display: 'block' }}>
              EXPLORE
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em', '&:hover': { color: 'primary.main' } }}>HOME</Typography>
              </Link>
              <Link href="/categories" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em', '&:hover': { color: 'primary.main' } }}>COLEÇÕES</Typography>
              </Link>
              <Link href="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em', '&:hover': { color: 'primary.main' } }}>CARRINHO</Typography>
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: '0.2em', mb: 3, display: 'block' }}>
              SUPORTE
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link href="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em', '&:hover': { color: 'primary.main' } }}>FAQ</Typography>
              </Link>
              <Link href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em', '&:hover': { color: 'primary.main' } }}>POLÍTICA DE PRIVACIDADE</Typography>
              </Link>
              <Link href="/terms-of-service" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em', '&:hover': { color: 'primary.main' } }}>TERMOS DE SERVIÇO</Typography>
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: '0.2em', mb: 3, display: 'block' }}>
              REDES SOCIAIS
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                <WhatsAppIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, opacity: 0.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em' }} suppressHydrationWarning>
            &copy; {new Date().getFullYear()} NESTFY LUXURY STORE. TODOS OS DIREITOS RESERVADOS.
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em' }}>
            DESENVOLVIDO COM EXCELÊNCIA
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}