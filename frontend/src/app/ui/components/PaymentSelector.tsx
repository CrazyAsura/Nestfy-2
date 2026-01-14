'use client';

import { 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Radio,
    FormControlLabel,
    RadioGroup
} from '@mui/material';
import { Security } from '@mui/icons-material';

export type PaymentMethod = 'mercadopago';

interface PaymentSelectorProps {
    value: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
}

export default function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
    const methods = [
        { id: 'mercadopago', label: 'Pagamento Seguro', icon: <Security />, description: 'Cartão de Crédito, Pix e Boleto' },
    ];

    return (
        <Box mb={4}>
            <Typography variant="h6" fontWeight={800} mb={3}>
                Método de Pagamento
            </Typography>

            <Grid container spacing={2}>
                {methods.map((method) => (
                    <Grid size={{ xs: 12 }} key={method.id}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                borderRadius: 4, 
                                border: '2px solid', 
                                borderColor: 'primary.main',
                                bgcolor: 'rgba(25, 118, 210, 0.04)',
                                cursor: 'default',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3
                            }}
                        >
                            <Box sx={{ 
                                color: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'white',
                                p: 1.5,
                                borderRadius: '50%',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                                <Security sx={{ fontSize: 32 }} />
                            </Box>
                            
                            <Box>
                                <Typography variant="h6" fontWeight={800} color="text.primary">
                                    {method.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                    {method.description}
                                </Typography>
                            </Box>

                            <Box sx={{ 
                                ml: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 0.5,
                                bgcolor: 'success.main',
                                borderRadius: 2,
                                color: 'white'
                            }}>
                                <Security sx={{ fontSize: 16 }} />
                                <Typography variant="caption" fontWeight={800}>
                                    PROTEGIDO
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
