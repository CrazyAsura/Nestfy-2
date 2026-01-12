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

interface BoletoPaymentProps {
    amount: number;
    orderId: string;
}

export default function BoletoPayment({ amount, orderId }: BoletoPaymentProps) {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false); // Para evitar hidratação incorreta do barcode
    const router = useRouter();
    const boletoRef = useRef<HTMLDivElement>(null);

    // Evita erro de hidratação no Next.js ao usar libs de terceiros
    useEffect(() => {
        setMounted(true);
    }, []);

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
                '& .printable-area': { border: 'none', boxShadow: 'none', p: 0 }
            }
        }}>
            <Typography variant="h6" fontWeight={800} mb={3} className="no-print">
                Pagamento via Boleto
            </Typography>

            <Paper 
                className="printable-area"
                elevation={0} 
                sx={{ 
                    p: 3, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 4,
                    bgcolor: '#fff',
                    maxWidth: '800px', // Largura padrão A4 aprox
                    margin: '0 auto'
                }}
            >
                {/* Visualização do Boleto - Layout Padrão Febraban */}
                <Box ref={boletoRef} sx={{ color: '#000', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    
                    {/* Cabeçalho do Banco */}
                    <Box display="flex" alignItems="center" borderBottom="2px solid #000" pb={0.5} mb={2}>
                        <Box sx={{ width: 50, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRight: '2px solid #000', pr: 2 }}>
                            {/* Logo Placeholder */}
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_of_America_logo.svg/2560px-Bank_of_America_logo.svg.png" alt="Banco" style={{maxHeight: 25, objectFit: 'contain'}} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold" sx={{ borderRight: '2px solid #000', px: 2, mx: 0 }}>
                            237-9
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" sx={{ flex: 1, textAlign: 'right', fontSize: '1.1rem', letterSpacing: 1 }}>
                            {linhaDigitavel}
                        </Typography>
                    </Box>

                    {/* Corpo do Boleto - Ficha de Compensação */}
                    <Box sx={{ border: '1px solid #000', borderBottom: 'none' }}>
                        <Box display="flex">
                            <GridContainer label="Local de Pagamento" value="PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO" width="70%" />
                            <GridContainer label="Vencimento" value={new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString('pt-BR')} width="30%" lastInRow />
                        </Box>

                        <Box display="flex">
                            <GridContainer label="Beneficiário" value="NESTFY ECOMMERCE LTDA - CNPJ: 00.000.000/0001-00" width="70%" />
                            <GridContainer label="Agência/Código Beneficiário" value="1234 / 56789-0" width="30%" lastInRow />
                        </Box>

                        <Box display="flex">
                            <GridContainer label="Data do Documento" value={new Date().toLocaleDateString('pt-BR')} width="20%" />
                            <GridContainer label="Número do Documento" value={orderId.substring(0, 10)} width="25%" />
                            <GridContainer label="Espécie Doc." value="DM" width="10%" />
                            <GridContainer label="Aceite" value="N" width="5%" />
                            <GridContainer label="Data Processamento" value={new Date().toLocaleDateString('pt-BR')} width="20%" />
                            <GridContainer label="Nosso Número" value="00000123-4" width="20%" lastInRow />
                        </Box>

                        <Box display="flex">
                            <GridContainer label="Uso do Banco" value="" width="20%" />
                            <GridContainer label="Carteira" value="09" width="10%" />
                            <GridContainer label="Espécie" value="R$" width="10%" />
                            <GridContainer label="Quantidade" value="" width="20%" />
                            <GridContainer label="Valor" value="" width="10%" />
                            <GridContainer label="(=) Valor do Documento" 
                                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)} 
                                width="30%" 
                                highlight 
                                lastInRow 
                            />
                        </Box>

                        <Box display="flex" sx={{ minHeight: 150 }}>
                            <Box sx={{ width: '70%', borderRight: '1px solid #000', p: 1 }}>
                                <Typography variant="caption" display="block" fontWeight="bold">Instruções (Texto de responsabilidade do beneficiário)</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>SR. CAIXA, NÃO RECEBER APÓS O VENCIMENTO.</Typography>
                                <Typography variant="body2">REFERENTE AO PEDIDO #{orderId}</Typography>
                                <Typography variant="body2">NÃO ACEITAR PAGAMENTO COM CHEQUE.</Typography>
                            </Box>
                            <Box sx={{ width: '30%' }}>
                                <GridContainer label="(-) Desconto / Abatimento" value="" width="100%" noBorderLeft />
                                <GridContainer label="(-) Outras Deduções" value="" width="100%" noBorderLeft />
                                <GridContainer label="(+) Mora / Multa" value="" width="100%" noBorderLeft />
                                <GridContainer label="(+) Outros Acréscimos" value="" width="100%" noBorderLeft />
                                <GridContainer label="(=) Valor Cobrado" value="" width="100%" noBorderLeft />
                            </Box>
                        </Box>

                        <Box sx={{ borderTop: '1px solid #000', p: 1 }}>
                            <Typography variant="caption" display="block" fontWeight="bold">Pagador</Typography>
                            <Typography variant="body2" fontWeight="bold">CLIENTE NESTFY</Typography>
                            <Typography variant="body2">RUA EXEMPLO, 123 - CENTRO - ARACAJU/SE - CEP 49000-000</Typography>
                            <Typography variant="body2">CPF: 000.000.000-00</Typography>
                        </Box>
                    </Box>

                    {/* Área do Código de Barras Real */}
                    <Box sx={{ borderTop: '1px dashed #000', mt: 3, pt: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ alignSelf: 'flex-end', mb: 1 }}>Autenticação Mecânica / Ficha de Compensação</Typography>
                        
                        {mounted && (
                            <Box sx={{ ml: -2 }}> {/* Margem negativa para compensar o padding do SVG */}
                                <Barcode 
                                    value={barcodeValue}
                                    format="ITF" // Interleaved 2 of 5 (Padrão boleto)
                                    width={2.5}  // Largura das barras (ajustado para caber)
                                    height={50}  // Altura das barras
                                    displayValue={false} // Não mostrar os números embaixo das barras (já mostramos em cima)
                                    margin={10}
                                />
                            </Box>
                        )}
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
                bgcolor: highlight ? '#f0f0f0' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                printColorAdjust: 'exact', // Garante que a cor de fundo saia na impressão
                WebkitPrintColorAdjust: 'exact'
            }}
        >
            <Typography variant="caption" display="block" sx={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: 1, mb: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={highlight ? 'bold' : 'normal'} sx={{ lineHeight: 1.1 }}>
                {value}&nbsp;
            </Typography>
        </Box>
    );
}