'use client';

import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { api } from '@/app/libs/api/services/axios';

export default function MercadoPagoBrick({ amount, items, onSuccess }: { amount: number, items: any[], onSuccess?: (result: any) => void }) {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (publicKey) {
            initMercadoPago(publicKey, { locale: 'pt-BR' });
            setIsInitialized(true);
        } else {
            console.error('Mercado Pago Public Key não encontrada em process.env.NEXT_PUBLIC_MP_PUBLIC_KEY');
        }
    }, [publicKey]);

    const initialization = {
        amount: amount,
    };

    const customization = {
        paymentMethods: {
            ticket: "all" as const,
            bankTransfer: "all" as const,
            creditCard: "all" as const,
            debitCard: "all" as const,
            mercadoPago: "all" as const,
        },
        visual: {
            style: {
                theme: 'default' as const,
            }
        }
    };

    const onSubmit = async ({ selectedPaymentMethod, formData }: any) => {
        try {
            // Adicionar itens ao metadata para processamento no backend
            const paymentData = {
                ...formData,
                metadata: {
                    items: JSON.stringify(items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })))
                }
            };

            const { data } = await api.post('/payment/process-mercadopago', paymentData);
            
            if (onSuccess) {
                onSuccess(data);
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            throw error;
        }
    };

    const onReady = () => {
        setLoading(false);
    };

    const onError = (error: any) => {
        console.error('Erro no Brick do Mercado Pago:', error);
    };

    if (!publicKey) {
        return (
            <Typography color="error">
                Erro: NEXT_PUBLIC_MP_PUBLIC_KEY não configurada.
            </Typography>
        );
    }

    return (
        <Box sx={{ position: 'relative', minHeight: 400, width: '100%' }}>
            {loading && (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: 2,
                    py: 8
                }}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary">
                        Carregando Checkout Seguro...
                    </Typography>
                </Box>
            )}
            {isInitialized && (
                <Payment
                    initialization={initialization}
                    customization={customization}
                    onSubmit={onSubmit}
                    onReady={onReady}
                    onError={onError}
                />
            )}
        </Box>
    );
}
