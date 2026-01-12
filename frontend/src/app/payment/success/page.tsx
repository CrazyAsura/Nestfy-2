'use client';

import { 
    Container, 
    Typography, 
    Box, 
    Button, 
    Paper, 
    Stack 
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PaymentSuccessPage() {
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
                            color: 'success.main'
                        }}
                    >
                        <CheckCircle sx={{ fontSize: 100 }} />
                    </Box>

                    <Typography variant="h3" fontWeight={900} mb={2} color="text.primary">
                        PAGAMENTO APROVADO!
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={6} sx={{ fontSize: '1.1rem' }}>
                        Obrigado por sua compra! Seu pedido foi processado com sucesso e em breve você receberá um e-mail com os detalhes do envio.
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
