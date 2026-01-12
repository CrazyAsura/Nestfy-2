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
import { api, getBaseURL } from '@/app/libs/api/services/axios';
import { API_ROUTES } from '@/app/libs/api/routes';

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
        window.open(`${getBaseURL()}/finance/boleto/${orderId}`, '_blank');
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
                '& .no-print': { display: 'none !important' },
                '& .printable-area': { 
                    border: 'none !important', 
                    boxShadow: 'none !important', 
                    p: 0,
                    m: 0,
                    width: '100%',
                    maxWidth: '100%'
                },
                'body': { 
                    margin: 0, 
                    padding: 0,
                    backgroundColor: '#fff !important'
                }
            }
        }}>
            <style jsx global>{`
                @page {
                    size: auto;
                    margin: 10mm;
                }
            `}</style>
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
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
            >
                {/* Visualização Simplificada do Boleto */}
                <Box ref={boletoRef} sx={{ color: '#000', fontFamily: 'monospace' }}>
                    
                    {/* CABEÇALHO COM LOGO */}
                    <Box display="flex" alignItems="flex-end" borderBottom="2px solid #000" pb={1} mb={2}>
                        <Box sx={{ width: 160, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid #000', pr: 2 }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Bradesco_logo.svg/2560px-Bradesco_logo.svg.png" alt="Bradesco" style={{maxHeight: 25, objectFit: 'contain'}} />
                        </Box>
                        <Typography variant="h5" sx={{ borderRight: '2px solid #000', px: 2, height: 35, display: 'flex', alignItems: 'center', fontWeight: 900, fontSize: '1.5rem' }}>
                            237-2
                        </Typography>
                        <Typography variant="body1" sx={{ flex: 1, textAlign: 'right', fontSize: '1rem', fontWeight: 800, letterSpacing: 0.5 }}>
                            {linhaDigitavel}
                        </Typography>
                    </Box>

                    {/* CONTEÚDO DO BOLETO */}
                    <Box sx={{ border: '1px solid #000', mb: 2 }}>
                        <Box display="flex">
                            <GridContainer label="Local de Pagamento" value="PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO" width="75%" />
                            <GridContainer label="Vencimento" value={new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString('pt-BR')} width="25%" lastInRow highlight />
                        </Box>

                        <Box display="flex">
                            <GridContainer label="Beneficiário" value="NESTFY ECOMMERCE LTDA - CNPJ: 00.000.000/0001-00" width="75%" />
                            <GridContainer label="Agência/Código Beneficiário" value="1234 / 56789-0" width="25%" lastInRow />
                        </Box>

                        <Box display="flex">
                            <GridContainer label="Data do Documento" value={new Date().toLocaleDateString('pt-BR')} width="20%" />
                            <GridContainer label="Número do Documento" value={orderId.substring(0, 10)} width="25%" />
                            <GridContainer label="Espécie Doc." value="DM" width="15%" />
                            <GridContainer label="Aceite" value="N" width="15%" />
                            <GridContainer label="Nosso Número" value="00000123-4" width="25%" lastInRow />
                        </Box>

                        <Box display="flex">
                            <GridContainer label="Carteira" value="09" width="20%" />
                            <GridContainer label="Espécie" value="R$" width="20%" />
                            <GridContainer label="Quantidade" value="" width="25%" />
                            <GridContainer label="(=) Valor do Documento" 
                                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)} 
                                width="35%" 
                                highlight 
                                lastInRow 
                            />
                        </Box>

                        <Box display="flex" sx={{ minHeight: 80 }}>
                            <Box sx={{ width: '100%', p: 1 }}>
                                <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', fontSize: '0.6rem' }}>Instruções (Texto de responsabilidade do beneficiário)</Typography>
                                <Typography variant="body2" sx={{ mt: 1, fontSize: '0.8rem' }}>SR. CAIXA, NÃO RECEBER APÓS O VENCIMENTO.</Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>REFERENTE AO PEDIDO #{orderId}</Typography>
                                {orderData?.totalTaxAmount > 0 && (
                                    <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                        Valor aproximado dos tributos: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderData.totalTaxAmount)} ({((orderData.totalTaxAmount / orderData.totalAmount) * 100).toFixed(2)}%) conforme Lei 12.741/12.
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ borderTop: '1px solid #000', p: 1 }}>
                            <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', fontSize: '0.6rem' }}>Pagador</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>CLIENTE NESTFY (CPF: 000.000.000-00)</Typography>
                        </Box>
                    </Box>

                {/* CÓDIGO DE BARRAS */}
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {mounted && (
                        <Barcode 
                            value={barcodeValue}
                            format="ITF"
                            width={1.6}
                            height={70}
                            displayValue={false}
                            margin={0}
                        />
                    )}
                    <Typography variant="caption" sx={{ mt: 1, fontWeight: 700, fontSize: '0.65rem' }}>
                        Autenticação Mecânica - Ficha de Compensação
                    </Typography>
                </Box>
                </Box>
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

// Componente auxiliar ajustado para bordas perfeitas (colapso de bordas)
function GridContainer({ 
    label, 
    value, 
    width, 
    highlight = false, 
    lastInRow = false,
    noBorderLeft = false
}: { 
    label: string, 
    value: string, 
    width: string, 
    highlight?: boolean,
    lastInRow?: boolean,
    noBorderLeft?: boolean
}) {
    return (
        <Box 
            sx={{
                width: width,
                borderRight: lastInRow ? 'none' : '1px solid #000',
                borderBottom: '1px solid #000',
                borderLeft: noBorderLeft ? 'none' : undefined,
                p: 0.5,
                bgcolor: highlight ? '#f5f5f5' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                printColorAdjust: 'exact',
                WebkitPrintColorAdjust: 'exact',
                minHeight: 35
            }}
        >
            <Typography variant="caption" display="block" sx={{ fontSize: '0.55rem', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: 1, mb: 0.2, color: '#333' }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: highlight ? 'bold' : 'normal', fontSize: '0.75rem', lineHeight: 1.1, fontFamily: 'monospace' }}>
                {value}&nbsp;
            </Typography>
        </Box>
    );
}