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
import { Cancel, HelpOutline, ShoppingCart, Replay } from '@mui/icons-material';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CancelPage() {
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
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Cancel sx={{ fontSize: 100, color: 'error.main' }} />
                        </motion.div>
                    </Box>

                    <Typography variant="h3" fontWeight={900} gutterBottom sx={{ color: 'text.primary' }}>
                        Pagamento Cancelado
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" mb={4} sx={{ fontSize: '1.1rem' }}>
                        Infelizmente não conseguimos processar o seu pagamento. Não se preocupe, nenhuma cobrança foi realizada.
                    </Typography>

                    <Box sx={{ bgcolor: 'error.light', p: 3, borderRadius: 4, mb: 6, opacity: 0.1 }}>
                        {/* Apenas fundo decorativo */}
                    </Box>
                    
                    <Box sx={{ mt: -9, mb: 6, position: 'relative', zIndex: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="error.main" mb={2}>
                            O que pode ter acontecido?
                        </Typography>
                        <Stack spacing={1} textAlign="left" sx={{ display: 'inline-block' }}>
                            <Typography variant="body2" color="text.secondary">• Dados do cartão digitados incorretamente</Typography>
                            <Typography variant="body2" color="text.secondary">• Saldo insuficiente ou limite excedido</Typography>
                            <Typography variant="body2" color="text.secondary">• Transação negada pelo banco emissor</Typography>
                        </Stack>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Stack spacing={2}>
                        <Button 
                            component={Link} 
                            href="/checkout" 
                            variant="contained" 
                            size="large"
                            startIcon={<Replay />}
                            sx={{ py: 2, borderRadius: 3, fontWeight: 'bold', fontSize: '1rem' }}
                        >
                            Tentar Novamente
                        </Button>
                        <Button 
                            component={Link} 
                            href="/cart" 
                            variant="outlined" 
                            size="large"
                            startIcon={<ShoppingCart />}
                            sx={{ py: 2, borderRadius: 3, fontWeight: 'bold' }}
                        >
                            Voltar ao Carrinho
                        </Button>
                        <Button 
                            variant="text" 
                            size="small"
                            startIcon={<HelpOutline />}
                            sx={{ fontWeight: 'bold', color: 'text.secondary' }}
                        >
                            Precisa de ajuda? Fale conosco
                        </Button>
                    </Stack>
                </Paper>
            </motion.div>
        </Container>
    );
}
