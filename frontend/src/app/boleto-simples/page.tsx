'use client';

import React, { useEffect, useState } from 'react';
import Barcode from 'react-barcode';
import { Box, Typography, Paper, Divider } from '@mui/material';

export default function SimpleBoletoPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Opcional: disparar impressão automaticamente após carregar
        // setTimeout(() => window.print(), 1000);
    }, []);

    const data = {
        banco: "237-2",
        linhaDigitavel: "23793.38128 60083.015488 63002.214320 1 9543000000000007500",
        localPagamento: "Pagável em qualquer banco até o vencimento",
        beneficiario: "NESTFY ECOMMERCE LTDA - CNPJ: 00.000.000/0001-00",
        pagador: "CLIENTE NESTFY (CPF: 000.000.000-00)",
        pedido: "DEMO-ORDER",
        vencimento: "15/01/2026",
        valor: "R$ 75,00",
        instrucoes: "Não receber após o vencimento. Documento válido somente para pagamento.",
        barcodeValue: "23791954300000000753381260083015486300221432" // Exemplo de barcode 44 dígitos derivado ou fixo
    };

    // Para o código de barras, se não temos o de 44 dígitos exato, usamos a linha digitável limpa ou o que for mais próximo
    const cleanBarcode = data.linhaDigitavel.replace(/[^0-9]/g, '');

    if (!mounted) return null;

    return (
        <Box 
            sx={{ 
                bgcolor: '#fff', 
                minHeight: '100vh', 
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '@media print': {
                    p: 0,
                    m: 0,
                }
            }}
        >
            <style jsx global>{`
                @page {
                    size: auto;
                    margin: 10mm;
                }
                @media print {
                    button {
                        display: none !important;
                    }
                }
            `}</style>

            <Paper 
                elevation={0}
                sx={{ 
                    width: '100%', 
                    maxWidth: '800px', 
                    border: '1px solid #000',
                    p: 2,
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                {/* Topo do Boleto */}
                <Box sx={{ display: 'flex', borderBottom: '2px solid #000', pb: 1, mb: 1, alignItems: 'flex-end' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '24px', pr: 2, borderRight: '2px solid #000' }}>Bradesco</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px', px: 2, borderRight: '2px solid #000' }}>{data.banco}</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', flex: 1, textAlign: 'right' }}>{data.linhaDigitavel}</Typography>
                </Box>

                {/* Campos do Boleto */}
                <Box sx={{ border: '1px solid #000', mb: 1 }}>
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
                        <Box sx={{ flex: 3, p: 0.5, borderRight: '1px solid #000' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Local de Pagamento</Typography>
                            <Typography sx={{ fontSize: '12px' }}>{data.localPagamento}</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 0.5 }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Vencimento</Typography>
                            <Typography sx={{ fontSize: '12px', textAlign: 'right', fontWeight: 'bold' }}>{data.vencimento}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
                        <Box sx={{ flex: 3, p: 0.5, borderRight: '1px solid #000' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Beneficiário</Typography>
                            <Typography sx={{ fontSize: '12px' }}>{data.beneficiario}</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 0.5 }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Agência / Código Beneficiário</Typography>
                            <Typography sx={{ fontSize: '12px', textAlign: 'right' }}>1234 / 56789-0</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
                        <Box sx={{ flex: 1, p: 0.5, borderRight: '1px solid #000' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Data do Documento</Typography>
                            <Typography sx={{ fontSize: '12px' }}>{new Date().toLocaleDateString('pt-BR')}</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 0.5, borderRight: '1px solid #000' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Número do Documento</Typography>
                            <Typography sx={{ fontSize: '12px' }}>{data.pedido}</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 0.5, borderRight: '1px solid #000' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Espécie Doc.</Typography>
                            <Typography sx={{ fontSize: '12px' }}>DM</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 0.5, borderRight: '1px solid #000' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Aceite</Typography>
                            <Typography sx={{ fontSize: '12px' }}>N</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 0.5 }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Data Processamento</Typography>
                            <Typography sx={{ fontSize: '12px', textAlign: 'right' }}>{new Date().toLocaleDateString('pt-BR')}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
                        <Box sx={{ flex: 1, p: 0.5, borderRight: '1px solid #000' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Uso do Banco</Typography>
                            <Typography sx={{ fontSize: '12px' }}>&nbsp;</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 0.5, borderRight: '1px solid #000' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Carteira</Typography>
                            <Typography sx={{ fontSize: '12px' }}>09</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 0.5, borderRight: '1px solid #000' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Espécie</Typography>
                            <Typography sx={{ fontSize: '12px' }}>R$</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 0.5, borderRight: '1px solid #000' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Quantidade</Typography>
                            <Typography sx={{ fontSize: '12px' }}>&nbsp;</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 0.5 }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>(=) Valor do Documento</Typography>
                            <Typography sx={{ fontSize: '12px', textAlign: 'right', fontWeight: 'bold' }}>{data.valor}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ flex: 3, p: 0.5, borderRight: '1px solid #000', minHeight: '100px' }}>
                            <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Instruções (Texto de Responsabilidade do Beneficiário)</Typography>
                            <Typography sx={{ fontSize: '12px', whiteSpace: 'pre-line', mt: 1 }}>{data.instrucoes}</Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ p: 0.5, borderBottom: '1px solid #000' }}>
                                <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>(-) Desconto / Abatimento</Typography>
                                <Typography sx={{ fontSize: '12px', textAlign: 'right' }}>&nbsp;</Typography>
                            </Box>
                            <Box sx={{ p: 0.5, borderBottom: '1px solid #000' }}>
                                <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>(-) Outras Deduções</Typography>
                                <Typography sx={{ fontSize: '12px', textAlign: 'right' }}>&nbsp;</Typography>
                            </Box>
                            <Box sx={{ p: 0.5, borderBottom: '1px solid #000' }}>
                                <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>(+) Mora / Multa</Typography>
                                <Typography sx={{ fontSize: '12px', textAlign: 'right' }}>&nbsp;</Typography>
                            </Box>
                            <Box sx={{ p: 0.5 }}>
                                <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>(=) Valor Cobrado</Typography>
                                <Typography sx={{ fontSize: '12px', textAlign: 'right' }}>&nbsp;</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Pagador */}
                <Box sx={{ border: '1px solid #000', p: 0.5, mb: 2 }}>
                    <Typography sx={{ fontSize: '10px', textTransform: 'uppercase' }}>Pagador</Typography>
                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>{data.pagador}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>RUA EXEMPLO, 123 - BAIRRO - CIDADE/UF - CEP: 00000-000</Typography>
                </Box>

                {/* Código de Barras */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                    <Barcode 
                        value={cleanBarcode.substring(0, 44)} 
                        width={1.5} 
                        height={60} 
                        displayValue={false} 
                        format="CODE128"
                    />
                    <Typography sx={{ fontSize: '10px', mt: 1 }}>Autenticação Mecânica - Ficha de Compensação</Typography>
                </Box>
            </Paper>

            <Box sx={{ mt: 4 }} className="no-print">
                <button 
                    onClick={() => window.print()}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Imprimir Boleto
                </button>
            </Box>
        </Box>
    );
}
