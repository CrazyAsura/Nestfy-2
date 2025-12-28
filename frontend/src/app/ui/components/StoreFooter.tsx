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
        bgcolor: 'background.paper',
        color: 'text.primary',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StoreIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                LOJA VIRTUAL
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Loja moderna, segura e feita para você comprar com tranquilidade.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Navegação
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="body2" component="span" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>Home</Typography>
              </Link>
              <Link href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="body2" component="span" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>Produtos</Typography>
              </Link>
              <Link href="/categories" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="body2" component="span" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>Categorias</Typography>
              </Link>
              <Link href="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography variant="body2" component="span" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>Carrinho</Typography>
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contato
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              (11) 99999-9999
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              contato@lojavirtual.com
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="WhatsApp">
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }} suppressHydrationWarning>
          &copy; {new Date().getFullYear()} LOJA VIRTUAL. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  )
}