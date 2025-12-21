'use client';

import { Box, Typography, Paper, Container, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';

export default function CartPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>
            MEU CARRINHO
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
            Seu carrinho está vazio.
          </Typography>
          <Button 
            component={Link} 
            href="/" 
            variant="contained" 
            size="large"
            sx={{ 
              fontWeight: 'bold',
              borderRadius: 2,
              px: 4
            }}
          >
            VOLTAR À LOJA
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
