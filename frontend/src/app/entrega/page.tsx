'use client';

import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    Stepper, 
    Step, 
    StepLabel, 
    StepContent,
    CircularProgress,
    Stack,
    Chip,
    Divider,
    IconButton,
    TextField,
    Button,
    Grid
} from '@mui/material';
import { 
    LocalShipping, 
    CheckCircle, 
    Pending, 
    Search,
    LocationOn,
    History,
    ArrowBack
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useOrder, useOrders } from '@/app/libs/hooks/useOrders';
import { useTracking } from '@/app/libs/hooks/useShipping';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/libs/stores';
import { Tabs, Tab } from '@mui/material';

export default function EntregaPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [searchType, setSearchType] = useState(0); // 0 for Order ID, 1 for Correios Code
    const [orderNumber, setOrderNumber] = useState('');
    const [searchId, setSearchId] = useState('');
    const [trackingCode, setTrackingCode] = useState('');
    const [searchTrackCode, setSearchTrackCode] = useState('');

    const { data: order, isLoading: isLoadingOrder, isError: isErrorOrder } = useOrder(searchType === 0 ? searchId : '');
    const { data: trackingData, isLoading: isLoadingTracking, isError: isErrorTracking } = useTracking(searchType === 1 ? searchTrackCode : '');
    const { data: myOrders = [], isLoading: isLoadingOrders } = useOrders();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchType === 0 && orderNumber) {
            setSearchId(orderNumber);
            setSearchTrackCode('');
        } else if (searchType === 1 && trackingCode) {
            setSearchTrackCode(trackingCode);
            setSearchId('');
        }
    };

    const handleSelectOrder = (id: string) => {
        setSearchType(0);
        setSearchId(id);
        setOrderNumber(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStepIcon = (status: string) => {
        switch (status) {
            case 'DELIVERED': 
            case 'Objeto entregue ao destinatário':
                return <CheckCircle />;
            case 'SHIPPED': 
            case 'Objeto em trânsito - por favor aguarde':
                return <LocalShipping />;
            default: return <Pending />;
        }
    };

    const steps = searchType === 0 ? (order?.trackingHistory || []) : (trackingData?.events || []);
    const isLoading = searchType === 0 ? isLoadingOrder : isLoadingTracking;

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 50%, #1A1A1A 0%, #0A0A0A 100%)',
            pt: { xs: 12, md: 15 },
            pb: 8
        }}>
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Box textAlign="center" mb={8}>
                        <Typography 
                            variant="h2" 
                            sx={{ 
                                fontFamily: 'var(--font-playfair)',
                                fontWeight: 700,
                                color: '#AF944F',
                                mb: 2,
                                textTransform: 'uppercase',
                                letterSpacing: 4
                            }}
                        >
                            Rastreamento de Entrega
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 5, fontWeight: 300 }}>
                            Acompanhe sua jornada NESTFY em tempo real
                        </Typography>

                        <Tabs 
                            value={searchType} 
                            onChange={(_, newValue) => setSearchType(newValue)}
                            centered
                            sx={{
                                mb: 4,
                                '& .MuiTabs-indicator': { backgroundColor: '#AF944F' },
                                '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: '#AF944F' } }
                            }}
                        >
                            <Tab label="ID do Pedido" />
                            <Tab label="Código de Rastreio (Correios)" />
                        </Tabs>

                        <Box component="form" onSubmit={handleSearch} sx={{ maxWidth: 600, mx: 'auto', display: 'flex', gap: 2 }}>
                            {searchType === 0 ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Insira o ID do seu pedido (Ex: 65a...)"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(175, 148, 79, 0.3)',
                                            '& fieldset': { border: 'none' },
                                            '&.Mui-focused': {
                                                border: '1px solid #AF944F',
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Insira o código dos Correios (Ex: AA123456789BR)"
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(175, 148, 79, 0.3)',
                                            '& fieldset': { border: 'none' },
                                            '&.Mui-focused': {
                                                border: '1px solid #AF944F',
                                            }
                                        }
                                    }}
                                />
                            )}
                            <Button 
                                type="submit"
                                variant="contained"
                                sx={{ 
                                    borderRadius: '12px',
                                    px: 4,
                                    backgroundColor: '#AF944F',
                                    '&:hover': { backgroundColor: '#8E773F' }
                                }}
                            >
                                <Search />
                            </Button>
                        </Box>
                    </Box>

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <Box key="loading" textAlign="center" py={10}>
                                <CircularProgress sx={{ color: '#AF944F' }} />
                            </Box>
                        ) : (order || (trackingData && trackingData.status !== 'NOT_FOUND')) ? (
                            <Box key="result">
                                <Paper sx={{ 
                                    p: 4, 
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    borderRadius: 4,
                                    border: '1px solid rgba(175, 148, 79, 0.2)',
                                    mb: 4
                                }}>
                                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} mb={4}>
                                        <Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>{searchType === 0 ? 'Pedido:' : 'Código:'}</Typography>
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                                {searchType === 0 ? `#${order?.orderNumber}` : trackingData?.trackingCode}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>Status Atual:</Typography>
                                            <Chip 
                                                label={searchType === 0 ? order?.status : trackingData?.lastStatus} 
                                                sx={{ 
                                                    backgroundColor: 'rgba(175, 148, 79, 0.2)', 
                                                    color: '#AF944F',
                                                    fontWeight: 700,
                                                    borderRadius: '8px'
                                                }} 
                                            />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>{searchType === 0 ? 'Cód. Rastreio:' : 'Última Atualização:'}</Typography>
                                            <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                                {searchType === 0 ? (order?.trackingCode || 'Aguardando') : trackingData?.lastUpdate}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 4 }} />

                                    <Typography variant="h5" sx={{ 
                                        color: 'white', 
                                        mb: 4, 
                                        fontFamily: 'var(--font-playfair)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <History sx={{ color: '#AF944F' }} /> Histórico de Localização
                                    </Typography>

                                    {steps.length > 0 ? (
                                        <Stepper orientation="vertical" sx={{ 
                                            '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7)' },
                                            '& .MuiStepLabel-label.Mui-active': { color: '#AF944F' },
                                            '& .MuiStepLabel-label.Mui-completed': { color: 'white' },
                                            '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.2)' },
                                            '& .MuiStepIcon-root.Mui-active': { color: '#AF944F' },
                                            '& .MuiStepIcon-root.Mui-completed': { color: '#AF944F' },
                                            '& .MuiStepConnector-line': { borderColor: 'rgba(255,255,255,0.1)' }
                                        }}>
                                            {steps.map((step: any, index: number) => (
                                                <Step key={index} active={index === 0} completed={index > 0}>
                                                    <StepLabel icon={index === 0 ? <LocationOn /> : undefined}>
                                                        <Typography sx={{ fontWeight: 600, color: index === 0 ? '#AF944F' : 'white' }}>
                                                            {searchType === 0 ? `${step.status} - ${step.location}` : `${step.status} - ${step.unidade?.tipo || ''} ${step.unidade?.endereco?.cidade || ''}`}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                            {searchType === 0 ? format(new Date(step.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR }) : `${step.data} às ${step.hora}`}
                                                        </Typography>
                                                    </StepLabel>
                                                    <StepContent>
                                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                                            {searchType === 0 ? step.details : (step.detalhes || '')}
                                                        </Typography>
                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    ) : (
                                        <Box textAlign="center" py={4}>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                                Nenhum histórico de rastreamento disponível ainda.
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Box>
                        ) : (searchId || searchTrackCode) && (
                            <Box key="not-found" textAlign="center" py={10}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                    {searchType === 0 
                                        ? 'Pedido não encontrado. Verifique o ID e tente novamente.' 
                                        : (trackingData?.message || 'Código de rastreio não encontrado ou ainda não postado.')
                                    }
                                </Typography>
                            </Box>
                        )}
                    </AnimatePresence>

                    {user && myOrders.length > 0 && !searchId && (
                        <Box sx={{ mt: 8 }}>
                            <Typography variant="h4" sx={{ 
                                color: 'white', 
                                mb: 4, 
                                fontFamily: 'var(--font-playfair)',
                                textAlign: 'center'
                            }}>
                                Suas Entregas
                            </Typography>
                            <Grid container spacing={3}>
                                {myOrders.filter((o: any) => o.status !== 'CANCELLED').map((myOrder: any) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={myOrder.id}>
                                        <Paper 
                                            onClick={() => handleSelectOrder(myOrder.id)}
                                            sx={{ 
                                                p: 3, 
                                                backgroundColor: 'rgba(255,255,255,0.03)',
                                                borderRadius: 4,
                                                border: '1px solid rgba(175, 148, 79, 0.2)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(175, 148, 79, 0.05)',
                                                    borderColor: '#AF944F',
                                                    transform: 'translateY(-5px)'
                                                }
                                            }}
                                        >
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography sx={{ color: '#AF944F', fontWeight: 700, mb: 0.5 }}>
                                                        #{myOrder.orderNumber}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                        {format(new Date(myOrder.createdAt), "dd/MM/yyyy")}
                                                    </Typography>
                                                </Box>
                                                <Chip 
                                                    label={myOrder.status} 
                                                    size="small"
                                                    sx={{ 
                                                        backgroundColor: 'rgba(255,255,255,0.05)', 
                                                        color: 'white',
                                                        fontSize: '0.7rem'
                                                    }} 
                                                />
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Link href="/" passHref style={{ textDecoration: 'none' }}>
                            <Button 
                                startIcon={<ArrowBack />}
                                sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#AF944F' } }}
                            >
                                Voltar para a Loja
                            </Button>
                        </Link>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
