'use client';

import { 
    Container, 
    Typography, 
    Box, 
    Button, 
    Paper, 
    Stack,
    CircularProgress 
} from '@mui/material';
import { CheckCircle, ErrorOutline } from '@mui/icons-material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/app/libs/api/services/axios';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(!!sessionId);
    const [status, setStatus] = useState<any>(null);

    useEffect(() => {
        if (sessionId) {
            const checkStatus = async () => {
                try {
                    const { data } = await api.post('/payment/session-status', { sessionId });
                    setStatus(data);
                    if (data.status === 'paid') {
                        setLoading(false);
                    } else {
                        // Tentar novamente em 2 segundos se ainda não estiver pago
                        setTimeout(checkStatus, 2000);
                    }
                } catch (error) {
                    console.error('Erro ao verificar status:', error);
                    setLoading(false);
                }
            };
            checkStatus();
        }
    }, [sessionId]);

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ mb: 4 }} />
                <Typography variant="h5">Confirmando seu pagamento...</Typography>
                <Typography variant="body2" color="text.secondary" mt={2}>
                    Isso levará apenas alguns segundos.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 12 }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 6, 
                        textAlign: 'center', 
                        borderRadius: 6, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.04)'
                    }}
                >
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            mb: 4,
                            color: status?.status === 'paid' || !sessionId ? 'success.main' : 'warning.main'
                        }}
                    >
                        {status?.status === 'paid' || !sessionId ? (
                            <CheckCircle sx={{ fontSize: 100 }} />
                        ) : (
                            <ErrorOutline sx={{ fontSize: 100 }} />
                        )}
                    </Box>

                    <Typography variant="h3" fontWeight={900} mb={2} color="text.primary">
                        {status?.status === 'paid' || !sessionId ? 'PAGAMENTO APROVADO!' : 'PROCESSANDO PAGAMENTO'}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={6} sx={{ fontSize: '1.1rem' }}>
                        {status?.status === 'paid' || !sessionId 
                            ? `Obrigado por sua compra! Seu pedido ${status?.orderNumber ? '#' + status.orderNumber : ''} foi processado com sucesso e em breve você receberá um e-mail com os detalhes do envio.`
                            : 'Estamos aguardando a confirmação do seu pagamento. Você pode acompanhar o status na sua conta.'}
                    </Typography>

                    <Stack spacing={2}>
                        <Button 
                            variant="contained" 
                            size="large" 
                            component={Link} 
                            href="/orders"
                            sx={{ 
                                borderRadius: 3, 
                                py: 2, 
                                fontWeight: 800,
                                fontSize: '1.1rem'
                            }}
                        >
                            Ver Meus Pedidos
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large" 
                            component={Link} 
                            href="/"
                            sx={{ 
                                borderRadius: 3, 
                                py: 2, 
                                fontWeight: 800
                            }}
                        >
                            Continuar Comprando
                        </Button>
                    </Stack>
                </Paper>
            </motion.div>
        </Container>
    );
}
