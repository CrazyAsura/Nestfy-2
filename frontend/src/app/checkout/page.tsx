'use client';

import { 
    Container, 
    Typography, 
    Box, 
    Grid, 
    Paper, 
    Button, 
    Divider, 
    List, 
    ListItem, 
    ListItemText, 
    CircularProgress,
    Stack
} from '@mui/material';
import { useCart } from '@/app/libs/hooks/useCart';
import { useState } from 'react';
import { api } from '@/app/libs/api/services/axios';
import { getStripe } from '@/app/libs/stripe';
import { Lock, ArrowBack } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/libs/stores';
import { redirect, useRouter } from 'next/navigation';
import PaymentSelector, { PaymentMethod } from '../ui/components/PaymentSelector';
import MercadoPagoBrick from '../ui/components/MercadoPagoBrick';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercadopago');
    const [orderData, setOrderData] = useState<{ orderId: string, status: string } | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();

    if (!user) {
        redirect('/login?redirect=/checkout');
    }

    const handleMPSuccess = (result: any) => {
        setOrderData({ orderId: result.id, status: result.status });
        clearCart();
        router.push(`/payment/success?payment_id=${result.id}&status=${result.status}`);
    };

    if (items.length === 0 && !orderData) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={900} mb={3}>
                    Seu carrinho está vazio
                </Typography>
                <Button variant="contained" href="/" size="large">
                    Voltar para a Loja
                </Button>
            </Container>
        );
    }

    if (orderData) {
        return (
            <Container sx={{ py: 6 }}>
                <Box display="flex" alignItems="center" mb={4}>
                    <Button 
                        startIcon={<ArrowBack />} 
                        onClick={() => router.push('/')}
                        sx={{ fontWeight: 'bold' }}
                    >
                        Voltar para a Loja
                    </Button>
                </Box>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 6, border: '1px solid', borderColor: 'divider' }}>
                    <Box textAlign="center" mb={6}>
                        <Typography variant="h4" fontWeight={900} gutterBottom>
                            Pedido Realizado com Sucesso! 🎉
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Número do pedido: <strong>#{orderData.orderId}</strong>
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 6 }} />

                    <Box textAlign="center">
                        <Typography variant="h6" fontWeight={700} mb={2}>
                            Seu pagamento está sendo processado.
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={() => router.push('/orders')}
                            sx={{ borderRadius: 3, px: 4 }}
                        >
                            Ver Meus Pedidos
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 6 }}>
            <Typography variant="h3" fontWeight={900} mb={6} textAlign="center">
                Finalizar Pedido
            </Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={4}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h6" fontWeight={800} mb={3}>
                                Resumo do Pedido
                            </Typography>
                            <List disablePadding>
                                {items.map((item) => (
                                    <ListItem key={item.id} sx={{ px: 0, py: 2 }}>
                                        <ListItemText 
                                            primary={item.name} 
                                            secondary={`Quantidade: ${item.quantity}`} 
                                            primaryTypographyProps={{ fontWeight: 700 }}
                                        />
                                        <Typography variant="body1" fontWeight={700}>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.discountPrice || item.price) * item.quantity)}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>

                        <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />

                        <Box sx={{ mt: 2 }}>
                            {paymentMethod === 'mercadopago' && (
                                <MercadoPagoBrick 
                                    amount={totalPrice} 
                                    items={items} 
                                    onSuccess={handleMPSuccess} 
                                />
                            )}
                        </Box>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 4, 
                            borderRadius: 4, 
                            border: '1px solid', 
                            borderColor: 'divider',
                            bgcolor: 'background.default',
                            position: 'sticky',
                            top: 24
                        }}
                    >
                        <Typography variant="h6" fontWeight={800} mb={3}>
                            Total do Carrinho
                        </Typography>
                        
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography fontWeight={700}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                            </Typography>
                        </Box>
                        
                        <Box display="flex" justifyContent="space-between" mb={3}>
                            <Typography color="text.secondary">Frete</Typography>
                            <Typography color="success.main" fontWeight={700}>Grátis</Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box display="flex" justifyContent="space-between" mb={4}>
                            <Typography variant="h5" fontWeight={900}>Total</Typography>
                            <Typography variant="h5" color="primary" fontWeight={900}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                            </Typography>
                        </Box>

                        <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={2}>
                            Pagamento seguro processado pelo Mercado Pago
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
