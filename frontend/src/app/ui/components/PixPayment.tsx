'use client';

import { 
    Box, 
    Typography, 
    Button, 
    Paper, 
    Stack,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip
} from '@mui/material';
import { ContentCopy, CheckCircle, QrCodeScanner, Link as LinkIcon, ShoppingBag } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { api } from '@/app/libs/api/services/axios';
import { API_ROUTES } from '@/app/libs/api/routes';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

interface PixPaymentProps {
    amount: number;
    orderId: string;
}

export default function PixPayment({ amount, orderId }: PixPaymentProps) {
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    // Simulação de um código PIX (Copia e Cola)
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136nestfy-payments-pix@nestfy.com.br520400005303986540${amount.toFixed(2)}5802BR5915NESTFY ECOMM6009SAO PAULO62070503${orderId.substring(0, 8)}6304`;

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(pixCode);
            } else {
                // Fallback para contextos não seguros ou navegadores antigos
                const textArea = document.createElement("textarea");
                textArea.value = pixCode;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Falha ao copiar:', err);
            alert('Não foi possível copiar o código. Por favor, selecione e copie manualmente.');
        }
    };

    const handleGenerateUrl = () => {
        const url = `https://nestfy.com.br/pay/pix/${orderId}`;
        navigator.clipboard.writeText(url);
        alert('URL de pagamento PIX gerada e copiada!');
    };

    const handleConfirmPayment = async () => {
        try {
            setLoading(true);
            // Simula um delay de processamento
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            await api.post(API_ROUTES.PAYMENT.CONFIRM, { orderId });
            router.push('/checkout/success');
        } catch (error) {
            console.error('Erro ao confirmar pagamento:', error);
            alert('Não foi possível confirmar o pagamento. Tente novamente em alguns instantes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" fontWeight={800} mb={3}>
                Pagamento via PIX
            </Typography>

            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 4,
                    textAlign: 'center',
                    bgcolor: 'background.default',
                    mb: 4
                }}
            >
                <Typography variant="body1" mb={3} color="text.secondary">
                    Abra o app do seu banco e escaneie o QR Code abaixo:
                </Typography>

                <Box 
                    sx={{ 
                        display: 'inline-block', 
                        p: 2, 
                        bgcolor: '#fff', 
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        mb: 3
                    }}
                >
                    <QRCodeSVG 
                        value={pixCode} 
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </Box>

                <Typography variant="h5" fontWeight={900} color="primary" mb={4}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
                </Typography>

                <Divider sx={{ mb: 4 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ px: 2, fontWeight: 'bold' }}>
                        OU USE O PIX COPIA E COLA
                    </Typography>
                </Divider>

                <TextField
                    fullWidth
                    variant="outlined"
                    value={pixCode}
                    slotProps={{
                        input: {
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={copied ? "Copiado!" : "Copiar Código"}>
                                        <IconButton onClick={handleCopy} color={copied ? "success" : "primary"}>
                                            {copied ? <CheckCircle /> : <ContentCopy />}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 3, bgcolor: 'background.paper' }
                        }
                    }}
                />
            </Paper>

            <Stack direction="column" spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button 
                        variant="contained" 
                        fullWidth 
                        size="large" 
                        startIcon={<QrCodeScanner />}
                        sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}
                        onClick={handleCopy}
                    >
                        {copied ? "Código Copiado!" : "Copiar Código PIX"}
                    </Button>
                    <Button 
                        variant="outlined" 
                        fullWidth 
                        size="large" 
                        startIcon={<LinkIcon />}
                        sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}
                        onClick={handleGenerateUrl}
                    >
                        Gerar URL de Pagamento
                    </Button>
                </Stack>

                <Button 
                    variant="contained" 
                    fullWidth 
                    size="large" 
                    color="success"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShoppingBag />}
                    disabled={loading}
                    sx={{ 
                        borderRadius: 3, 
                        py: 2, 
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 14px 0 rgba(76, 175, 80, 0.39)'
                    }}
                    onClick={handleConfirmPayment}
                >
                    {loading ? 'Confirmando...' : 'Já realizei o pagamento'}
                </Button>
            </Stack>

            <Box mt={3} display="flex" alignItems="center" justifyContent="center" gap={1}>
                <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="text.secondary">
                    O pagamento é aprovado instantaneamente.
                </Typography>
            </Box>
        </Box>
    );
}

import { Divider as MuiDivider } from '@mui/material';
const Divider = MuiDivider;
