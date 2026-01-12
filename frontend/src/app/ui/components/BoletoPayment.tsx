'use client';

import { 
    Box, 
    Typography, 
    Button, 
    Paper, 
    Stack,
    CircularProgress
} from '@mui/material';
import { Print, Download, ContentCopy, ShoppingBag, CheckCircle } from '@mui/icons-material';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Barcode from 'react-barcode'; // Biblioteca adicionada
import { api } from '@/app/libs/api/services/axios';
import { API_ROUTES } from '@/app/libs/api/routes';
import PrintableBoleto from './PrintableBoleto';

interface BoletoPaymentProps {
    amount: number;
    orderId: string;
}

export default function BoletoPayment({ amount, orderId }: BoletoPaymentProps) {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false); // Para evitar hidratação incorreta do barcode
    const [orderData, setOrderData] = useState<any>(null);
    const router = useRouter();
    const boletoRef = useRef<HTMLDivElement>(null);

    // Evita erro de hidratação no Next.js ao usar libs de terceiros
    useEffect(() => {
        setMounted(true);
        if (orderId && orderId !== 'DEMO-ORDER') {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await api.get(API_ROUTES.ORDERS.BY_ID(orderId));
            setOrderData(response.data);
        } catch (error) {
            console.error('Erro ao buscar detalhes do pedido:', error);
        }
    };

    // Geração simulada de dados reais de boleto
    // 1. Linha Digitável (o que aparece escrito em cima): Formato AAABC.CCCCX DDDDD.DDDDDY EEEEE.EEEEEZ K UUUUVVVVVVVVVV
    const linhaDigitavel = "23793.38128 60083.015488 63002.214320 1 954300000" + Math.floor(amount * 100).toString().padStart(10, '0');
    
    // 2. Código para as barras (44 dígitos limpos): Necessário limpar pontos e espaços
    // NOTA: Em um cenário real de backend, a string do código de barras é diferente da linha digitável (ordem dos campos muda).
    // Para esta visualização funcionar, usaremos apenas os números limpos.
    const barcodeValue = linhaDigitavel.replace(/[^0-9]/g, '').slice(0, 44); 

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        // Implementação ideal: Chamar endpoint que retorna o PDF binário
        window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/finance/boleto/${orderId}`, '_blank');
    };

    const handleCopyBarcode = async () => {
        const cleanBarcode = linhaDigitavel.replace(/\s/g, ''); // Copia a linha digitável para pagamento em app
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(cleanBarcode);
            } else {
                // Fallback antigo
                const textArea = document.createElement("textarea");
                textArea.value = cleanBarcode;
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
        }
    };

    const handleConfirmPayment = async () => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await api.post(API_ROUTES.PAYMENT.CONFIRM, { orderId });
            router.push('/checkout/success');
        } catch (error) {
            console.error('Erro ao confirmar:', error);
            alert('Erro na simulação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            '@media print': { 
                '& .no-print': { display: 'none' },
                '& .printable-area': { 
                    border: 'none', 
                    boxShadow: 'none', 
                    p: 0,
                    m: 0,
                    width: '100%'
                },
                'body': { margin: 0, padding: 0 }
            }
        }}>
            <Typography variant="h6" fontWeight={800} mb={3} className="no-print">
                Pagamento via Boleto
            </Typography>

            <Paper 
                className="printable-area"
                elevation={0} 
                sx={{ 
                    p: 4, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 4,
                    bgcolor: '#fff',
                    maxWidth: '850px', 
                    margin: '0 auto',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    '@media print': {
                        border: 'none',
                        p: 0,
                        m: 0,
                        boxShadow: 'none'
                    }
                }}
            >
                <PrintableBoleto 
                    linhaDigitavel={linhaDigitavel}
                    codigoBarras={barcodeValue}
                    valor={amount}
                    vencimento={new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString('pt-BR')}
                    beneficiario="NESTFY ECOMMERCE LTDA - CNPJ: 00.000.000/0001-00"
                    pagador="CLIENTE NESTFY (CPF: 000.000.000-00)"
                    pedidoId={orderId}
                    totalTaxAmount={orderData?.totalTaxAmount}
                />
            </Paper>

            <Stack direction="column" spacing={2} className="no-print">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button 
                        variant="outlined" 
                        startIcon={copied ? <CheckCircle /> : <ContentCopy />} 
                        onClick={handleCopyBarcode}
                        fullWidth
                        color={copied ? "success" : "primary"}
                    >
                        {copied ? 'Copiado!' : 'Copiar Código'}
                    </Button>
                    <Button 
                        variant="outlined" 
                        startIcon={<Print />} 
                        onClick={handlePrint}
                        fullWidth
                    >
                        Imprimir
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<Download />} 
                        onClick={handleDownloadPDF}
                        fullWidth
                    >
                        Baixar PDF
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
        </Box>
    );
}