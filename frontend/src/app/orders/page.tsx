'use client';

import { 
    Box, 
    Typography, 
    Paper, 
    Container, 
    Grid, 
    Chip, 
    Divider, 
    Button,
    CircularProgress,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    ReceiptLong as ReceiptIcon,
    LocalShipping as ShippingIcon,
    CheckCircle as DeliveredIcon,
    Error as ErrorIcon,
    Pending as PendingIcon,
    ChevronRight as DetailsIcon,
    ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { useOrders } from '@/app/libs/hooks/useOrders';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product?: {
        name: string;
        images?: { url: string }[];
        imageUrl?: string;
    };
}

interface Order {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    items: OrderItem[];
}

const statusConfig: Record<string, { color: any, icon: any, label: string }> = {
    PENDING: { color: 'warning', icon: <PendingIcon fontSize="small" />, label: 'Pendente' },
    PROCESSING: { color: 'info', icon: <CircularProgress size={16} sx={{ mr: 1 }} />, label: 'Processando' },
    SHIPPED: { color: 'primary', icon: <ShippingIcon fontSize="small" />, label: 'Enviado' },
    DELIVERED: { color: 'success', icon: <DeliveredIcon fontSize="small" />, label: 'Entregue' },
    CANCELLED: { color: 'error', icon: <ErrorIcon fontSize="small" />, label: 'Cancelado' },
};

const MotionPaper = motion(Paper);

export default function OrdersPage() {
    const { data: orders = [], isLoading } = useOrders();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    if (isLoading) {
        return (
            <Container sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" color="text.secondary">Carregando seus pedidos...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 6, gap: 2 }}>
                <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                    Histórico de Compras
                </Typography>
            </Box>

            {orders.length === 0 ? (
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: { xs: 4, md: 10 }, 
                        textAlign: 'center', 
                        borderRadius: 4, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        bgcolor: 'background.paper'
                    }}
                >
                    <Box sx={{ mb: 3 }}>
                        <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.disabled', opacity: 0.3 }} />
                    </Box>
                    <Typography variant="h5" fontWeight={800} mb={2}>
                        Você ainda não realizou nenhum pedido
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={4} maxWidth="sm" mx="auto">
                        Que tal começar a encher seu carrinho agora mesmo? Temos milhares de produtos esperando por você!
                    </Typography>
                    <Button 
                        variant="contained" 
                        component={Link} 
                        href="/" 
                        size="large"
                        sx={{ px: 6, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
                    >
                        EXPLORAR PRODUTOS
                    </Button>
                </Paper>
            ) : (
                <Stack spacing={4}>
                    <AnimatePresence>
                        {orders.map((order: Order, index: number) => {
                            const config = statusConfig[order.status] || statusConfig.PENDING;
                            
                            return (
                                <MotionPaper 
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    elevation={0} 
                                    sx={{ 
                                        borderRadius: 4, 
                                        border: '1px solid', 
                                        borderColor: 'divider',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            borderColor: 'primary.main',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    {/* Header do Pedido */}
                                    <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                                                    Pedido
                                                </Typography>
                                                <Typography variant="body1" fontWeight={800}>
                                                    #{order.orderNumber}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                                                    Data
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {format(new Date(order.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                                                    Total
                                                </Typography>
                                                <Typography variant="body1" fontWeight={900} color="primary">
                                                    {formatPrice(order.totalAmount)}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: { sm: 'right' } }}>
                                                <Chip 
                                                    icon={config.icon}
                                                    label={config.label} 
                                                    color={config.color} 
                                                    size="small"
                                                    sx={{ fontWeight: 800, px: 1 }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Itens do Pedido */}
                                    <Box sx={{ p: 3 }}>
                                        <Stack spacing={3}>
                                            {order.items.map((item) => (
                                                <Box key={item.id} sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                                    <Box sx={{ 
                                                        position: 'relative', 
                                                        width: 80, 
                                                        height: 80, 
                                                        borderRadius: 2, 
                                                        overflow: 'hidden', 
                                                        flexShrink: 0,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        bgcolor: '#fff'
                                                    }}>
                                                        <Image 
                                                            src={item.product?.images?.[0]?.url || item.product?.imageUrl || '/placeholder-product.png'} 
                                                            alt={item.product?.name || 'Produto'}
                                                            fill
                                                            style={{ objectFit: 'contain', padding: '4px' }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                                                            {item.product?.name || 'Produto não identificado'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                                            Quantidade: {item.quantity} • {formatPrice(item.price)} cada
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1" fontWeight={900}>
                                                        {formatPrice(item.price * item.quantity)}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>

                                        <Divider sx={{ my: 3 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                            <Button 
                                                variant="outlined" 
                                                color="primary"
                                                startIcon={<ReceiptIcon />}
                                                onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/finance/invoice/${order.id}`, '_blank')}
                                                sx={{ borderRadius: 2, fontWeight: 700 }}
                                            >
                                                Ver Nota Fiscal
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                component={Link} 
                                                href={`/orders/${order.id}`}
                                                endIcon={<DetailsIcon />}
                                                sx={{ borderRadius: 2, fontWeight: 700 }}
                                            >
                                                Ver Detalhes do Pedido
                                            </Button>
                                        </Box>
                                    </Box>
                                </MotionPaper>
                            );
                        })}
                    </AnimatePresence>
                </Stack>
            )}
        </Container>
    );
}
