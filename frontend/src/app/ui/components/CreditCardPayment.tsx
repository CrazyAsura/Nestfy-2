'use client';

import { 
    Box, 
    Typography, 
    TextField, 
    Grid, 
    Paper, 
    Stack,
    InputAdornment,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';
import { CreditCard, CalendarMonth, Lock, CheckCircle } from '@mui/icons-material';
import { useState } from 'react';

interface CreditCardPaymentProps {
    amount: number;
    onConfirm?: (cardData: any) => void;
}

export default function CreditCardPayment({ amount, onConfirm }: CreditCardPaymentProps) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').substring(0, 16);
        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
        if (status !== 'idle') {
            setStatus('idle');
            if (onConfirm) onConfirm(null);
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').substring(0, 4);
        const formatted = value.replace(/(\d{2})(?=\d)/g, '$1/');
        setExpiry(formatted);
        if (status !== 'idle') {
            setStatus('idle');
            if (onConfirm) onConfirm(null);
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').substring(0, 3);
        setCvv(value);
        if (status !== 'idle') {
            setStatus('idle');
            if (onConfirm) onConfirm(null);
        }
    };

    const handleConfirm = async () => {
        if (!cardNumber || !expiry || !cvv || !name) {
            setStatus('error');
            setMessage('Por favor, preencha todos os campos do cartão.');
            return;
        }

        if (cardNumber.length < 19) { // 16 dígitos + 3 espaços
            setStatus('error');
            setMessage('Número do cartão inválido.');
            return;
        }

        setLoading(true);
        setStatus('idle');

        try {
            // Simula uma validação de cartão
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setStatus('success');
            setMessage('Cartão validado com sucesso!');
            
            if (onConfirm) {
                onConfirm({ cardNumber, expiry, cvv, name });
            }
        } catch (error) {
            setStatus('error');
            setMessage('Erro ao validar o cartão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" fontWeight={800} mb={3}>
                Informações do Cartão
            </Typography>

            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    border: '1px solid', 
                    borderColor: status === 'success' ? 'success.main' : status === 'error' ? 'error.main' : 'divider',
                    borderRadius: 4,
                    bgcolor: 'background.default',
                    mb: 4,
                    transition: 'all 0.3s ease'
                }}
            >
                <Stack spacing={3}>
                    {status !== 'idle' && (
                        <Alert 
                            severity={status} 
                            sx={{ borderRadius: 2 }}
                            onClose={() => setStatus('idle')}
                        >
                            {message}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Nome no Cartão"
                        placeholder="COMO ESTÁ NO CARTÃO"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value.toUpperCase());
                            if (status !== 'idle') {
                                setStatus('idle');
                                if (onConfirm) onConfirm(null);
                            }
                        }}
                        variant="outlined"
                        disabled={loading || status === 'success'}
                    />

                    <TextField
                        fullWidth
                        label="Número do Cartão"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        variant="outlined"
                        disabled={loading || status === 'success'}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCard color={status === 'success' ? "success" : "action"} />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth
                                label="Validade"
                                placeholder="MM/AA"
                                value={expiry}
                                onChange={handleExpiryChange}
                                variant="outlined"
                                disabled={loading || status === 'success'}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarMonth color={status === 'success' ? "success" : "action"} />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth
                                label="CVV"
                                placeholder="000"
                                value={cvv}
                                onChange={handleCvvChange}
                                variant="outlined"
                                disabled={loading || status === 'success'}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color={status === 'success' ? "success" : "action"} />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleConfirm}
                        disabled={loading || status === 'success'}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : status === 'success' ? <CheckCircle /> : <CreditCard />}
                        sx={{ 
                            mt: 2,
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 'bold',
                            bgcolor: status === 'success' ? 'success.main' : 'primary.main',
                            '&:hover': {
                                bgcolor: status === 'success' ? 'success.dark' : 'primary.dark',
                            }
                        }}
                    >
                        {loading ? 'Validando...' : status === 'success' ? 'Cartão Confirmado' : 'Confirmar Dados do Cartão'}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
