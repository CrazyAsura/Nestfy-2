'use client';

import { 
    Container, 
    Typography, 
    Box, 
    Button, 
    Paper, 
    Stack 
} from '@mui/material';
import { Cancel } from '@mui/icons-material';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PaymentCancelPage() {
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
                            color: 'error.main'
                        }}
                    >
                        <Cancel sx={{ fontSize: 100 }} />
                    </Box>

                    <Typography variant="h3" fontWeight={900} mb={2} color="text.primary">
                        PAGAMENTO CANCELADO
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={6} sx={{ fontSize: '1.1rem' }}>
                        Ops! Ocorreu um problema ao processar seu pagamento ou a transação foi cancelada. Não se preocupe, nenhum valor foi cobrado.
                    </Typography>

                    <Stack spacing={2}>
                        <Button 
                            variant="contained" 
                            size="large" 
                            component={Link} 
                            href="/checkout"
                            sx={{ 
                                borderRadius: 3, 
                                py: 2, 
                                fontWeight: 800,
                                fontSize: '1.1rem'
                            }}
                        >
                            Tentar Novamente
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large" 
                            component={Link} 
                            href="/cart"
                            sx={{ 
                                borderRadius: 3, 
                                py: 2, 
                                fontWeight: 800
                            }}
                        >
                            Voltar para o Carrinho
                        </Button>
                    </Stack>
                </Paper>
            </motion.div>
        </Container>
    );
}
