'use client';

import { Box, Typography, Paper, Container } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function OrdersPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>
            MEUS PEDIDOS
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 8 }}>
          Você ainda não possui pedidos realizados.
        </Typography>
      </Paper>
    </Container>
  );
}
