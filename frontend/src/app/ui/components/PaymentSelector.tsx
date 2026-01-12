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
import { CreditCard, Pix, Description } from '@mui/icons-material';

export type PaymentMethod = 'card' | 'pix' | 'boleto';

interface PaymentSelectorProps {
    value: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
}

export default function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
    const methods = [
        { id: 'card', label: 'Cartão de Crédito', icon: <CreditCard />, description: 'Até 12x sem juros' },
        { id: 'pix', label: 'PIX', icon: <Pix />, description: 'Aprovação instantânea' },
        { id: 'boleto', label: 'Boleto Bancário', icon: <Description />, description: 'Até 3 dias úteis para compensar' },
    ];

    return (
        <Box mb={4}>
            <Typography variant="h6" fontWeight={800} mb={3}>
                Escolha o Método de Pagamento
            </Typography>

            <RadioGroup value={value} onChange={(e) => onChange(e.target.value as PaymentMethod)}>
                <Grid container spacing={2}>
                    {methods.map((method) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={method.id}>
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: 2, 
                                    borderRadius: 3, 
                                    border: '2px solid', 
                                    borderColor: value === method.id ? 'primary.main' : 'divider',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: 'primary.light',
                                        bgcolor: 'rgba(0,0,0,0.01)'
                                    },
                                    position: 'relative'
                                }}
                                onClick={() => onChange(method.id as PaymentMethod)}
                            >
                                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={1}>
                                    <Box sx={{ 
                                        color: value === method.id ? 'primary.main' : 'text.secondary',
                                        fontSize: 32
                                    }}>
                                        {method.icon}
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={700}>
                                        {method.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {method.description}
                                    </Typography>
                                </Box>
                                <Radio 
                                    value={method.id}
                                    sx={{ 
                                        position: 'absolute', 
                                        top: 8, 
                                        right: 8,
                                        p: 0
                                    }}
                                />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </RadioGroup>
        </Box>
    );
}
