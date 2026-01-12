'use client';

import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    Button, 
    Stack,
    Divider
} from '@mui/material';
import { CheckCircle, LocalMall, ArrowForward, ReceiptLong } from '@mui/icons-material';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SuccessPage() {
    return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: { xs: 4, md: 6 }, 
                        textAlign: 'center', 
                        borderRadius: 6, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        >
                            <CheckCircle sx={{ fontSize: 100, color: 'success.main' }} />
                        </motion.div>
                    </Box>

                    <Typography variant="h3" fontWeight={900} gutterBottom sx={{ color: 'text.primary' }}>
                        Pedido Confirmado!
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" mb={4} sx={{ fontSize: '1.1rem' }}>
                        Uhul! Seu pagamento foi processado com sucesso. Já estamos preparando seus produtos com todo carinho.
                    </Typography>

                    <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 4, mb: 6, border: '1px dashed', borderColor: 'divider' }}>
                        <Stack spacing={2}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="text.secondary">Número do Pedido</Typography>
                                <Typography fontWeight="bold">#NS-{Math.floor(Math.random() * 900000 + 100000)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="text.secondary">Previsão de Entrega</Typography>
                                <Typography fontWeight="bold">3 a 5 dias úteis</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Stack spacing={2}>
                        <Button 
                            component={Link} 
                            href="/orders" 
                            variant="contained" 
                            size="large"
                            startIcon={<ReceiptLong />}
                            sx={{ py: 2, borderRadius: 3, fontWeight: 'bold', fontSize: '1rem' }}
                        >
                            Ver Meus Pedidos
                        </Button>
                        <Button 
                            component={Link} 
                            href="/" 
                            variant="text" 
                            size="large"
                            startIcon={<LocalMall />}
                            sx={{ fontWeight: 'bold' }}
                        >
                            Continuar Comprando
                        </Button>
                    </Stack>
                </Paper>
            </motion.div>
            
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={4}>
                Um e-mail de confirmação foi enviado para você com todos os detalhes.
            </Typography>
        </Container>
    );
}
