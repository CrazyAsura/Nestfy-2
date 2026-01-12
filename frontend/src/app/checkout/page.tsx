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
import PixPayment from '../ui/components/PixPayment';
import BoletoPayment from '../ui/components/BoletoPayment';
import CreditCardPayment from '../ui/components/CreditCardPayment';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [cardConfirmed, setCardConfirmed] = useState(false);
    const [orderData, setOrderData] = useState<{ orderId: string, status: string } | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();

    if (!user) {
        redirect('/login?redirect=/checkout');
    }

    const handleCheckout = async () => {
        try {
            setLoading(true);

            const checkoutItems = items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.discountPrice || item.price,
                quantity: item.quantity,
                image: item.images?.[0]?.url || ''
            }));

            const { data } = await api.post('/payment/create-checkout-session', {
                items: checkoutItems,
                paymentMethod
            });

            if (paymentMethod === 'card') {
                const stripe = await getStripe();
                if (!stripe) {
                    alert('Erro ao carregar o Stripe');
                    return;
                }

                if (data.url) {
                    window.location.href = data.url;
                } else {
                    const result = await (stripe as any).redirectToCheckout({
                        sessionId: data.sessionId,
                    });

                    if (result.error) {
                        alert(result.error.message);
                    }
                }
            } else {
                // Para PIX e Boleto, mostramos os detalhes do pagamento
                setOrderData(data);
                clearCart();
            }
        } catch (error) {
            console.error('Erro no checkout:', error);
            alert('Erro ao processar o pagamento. Tente novamente.');
        } finally {
            setLoading(false);
        }
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

                    <Box maxWidth={600} mx="auto">
                        {paymentMethod === 'pix' ? (
                            <PixPayment amount={totalPrice} orderId={orderData.orderId} />
                        ) : (
                            <BoletoPayment amount={totalPrice} orderId={orderData.orderId} />
                        )}
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
                            {paymentMethod === 'card' && (
                                <CreditCardPayment 
                                    amount={totalPrice} 
                                    onConfirm={(data) => setCardConfirmed(!!data)} 
                                />
                            )}
                            {paymentMethod === 'pix' && (
                                <Box sx={{ opacity: 0.9 }}>
                                    <PixPayment amount={totalPrice} orderId="DEMO-ORDER" />
                                    <Typography variant="caption" color="warning.main" sx={{ textAlign: 'center', display: 'block', mt: -2, mb: 2, fontWeight: 'bold' }}>
                                        * Visualize o exemplo do QR Code acima. Ele será gerado oficialmente após finalizar o pedido.
                                    </Typography>
                                </Box>
                            )}
                            {paymentMethod === 'boleto' && (
                                <Box sx={{ opacity: 0.9 }}>
                                    <BoletoPayment amount={totalPrice} orderId="DEMO-ORDER" />
                                    <Typography variant="caption" color="warning.main" sx={{ textAlign: 'center', display: 'block', mt: -2, mb: 2, fontWeight: 'bold' }}>
                                        * Visualize o exemplo do boleto acima. Ele será gerado oficialmente após finalizar o pedido.
                                    </Typography>
                                </Box>
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

                        <Button 
                            variant="contained" 
                            fullWidth 
                            size="large" 
                            onClick={handleCheckout}
                            disabled={loading || (paymentMethod === 'card' && !cardConfirmed)}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Lock />}
                            sx={{ 
                                borderRadius: 3, 
                                py: 2, 
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                boxShadow: 4,
                                opacity: (paymentMethod === 'card' && !cardConfirmed) ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Processando...' : paymentMethod === 'card' ? 'Pagar com Cartão' : 'Finalizar Pedido'}
                        </Button>
                        
                        {(paymentMethod === 'card' && !cardConfirmed) && (
                            <Typography variant="caption" color="error" textAlign="center" display="block" mt={1} fontWeight="bold">
                                * Por favor, confirme os dados do cartão acima antes de prosseguir.
                            </Typography>
                        )}
                        
                        <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={2}>
                            {paymentMethod === 'card' 
                                ? 'Pagamento seguro processado pelo Stripe' 
                                : 'Finalize o pedido para gerar os dados de pagamento'}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
