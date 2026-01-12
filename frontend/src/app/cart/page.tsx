'use client';

import { 
    Box, 
    Typography, 
    Paper, 
    Container, 
    Button, 
    Grid, 
    Divider, 
    IconButton, 
    Stack,
    TextField,
    Alert,
    Snackbar
} from '@mui/material';
import { 
    ShoppingCart as ShoppingCartIcon, 
    Add as AddIcon, 
    Remove as RemoveIcon, 
    DeleteOutline as DeleteIcon,
    ArrowBack as ArrowBackIcon,
    LocalMall as LocalMallIcon,
    ConfirmationNumber as CouponIcon,
    Star
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/libs/hooks/useCart';
import { useProductsCaroussel } from '@/app/libs/hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const MotionPaper = motion(Paper);

export default function CartPage() {
    const { items, totalPrice, updateQty, removeItem, clearCart, totalItems } = useCart();
    const { data: recommendedProducts } = useProductsCaroussel();
    
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const handleApplyCoupon = () => {
        const code = couponCode.toUpperCase();
        if (code === 'NESTFY10') {
            setDiscount(totalPrice * 0.1);
            setSnackbar({ open: true, message: 'Cupom NESTFY10 aplicado! 10% de desconto.', severity: 'success' });
        } else if (code === 'BEMVINDO20') {
            setDiscount(totalPrice * 0.2);
            setSnackbar({ open: true, message: 'Cupom BEMVINDO20 aplicado! 20% de desconto.', severity: 'success' });
        } else {
            setSnackbar({ open: true, message: 'Cupom inválido.', severity: 'error' });
            setDiscount(0);
        }
    };

    const finalPrice = totalPrice - discount;

    if (items.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: { xs: 4, md: 8 }, 
                        textAlign: 'center', 
                        borderRadius: 4, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        bgcolor: 'background.paper'
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.disabled', opacity: 0.5 }} />
                    </Box>
                    <Typography variant="h4" fontWeight={900} mb={2}>
                        Seu carrinho está vazio
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={4} maxWidth="sm" mx="auto">
                        Parece que você ainda não adicionou nenhum produto. Explore nossas categorias e encontre as melhores ofertas!
                    </Typography>
                    <Button 
                        component={Link} 
                        href="/" 
                        variant="contained" 
                        size="large"
                        startIcon={<LocalMallIcon />}
                        sx={{ 
                            fontWeight: 'bold',
                            borderRadius: 3,
                            px: 6,
                            py: 1.5,
                            boxShadow: 4
                        }}
                    >
                        IR ÀS COMPRAS
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                        Meu Carrinho
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
                        ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
                    </Typography>
                </Box>
                <Button 
                    variant="text" 
                    color="error" 
                    onClick={clearCart}
                    startIcon={<DeleteIcon />}
                    sx={{ fontWeight: 700 }}
                >
                    Limpar Carrinho
                </Button>
            </Box>

            <Grid container spacing={4}>
                {/* Lista de Produtos */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Stack spacing={2}>
                        <AnimatePresence>
                            {items.map((item) => (
                                <MotionPaper
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    elevation={0}
                                    sx={{ 
                                        p: 2, 
                                        borderRadius: 3, 
                                        border: '1px solid', 
                                        borderColor: 'divider',
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: 'primary.light', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }
                                    }}
                                >
                                    <Grid container spacing={2} alignItems="center">
                                        {/* Imagem */}
                                        <Grid size={{ xs: 4, sm: 2 }}>
                                            <Box sx={{ 
                                                position: 'relative', 
                                                paddingTop: '100%', 
                                                borderRadius: 2, 
                                                overflow: 'hidden',
                                                bgcolor: 'grey.50'
                                            }}>
                                                <Image 
                                                    src={item.images?.[0]?.url || '/placeholder-product.png'} 
                                                    alt={item.name}
                                                    fill
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </Box>
                                        </Grid>

                                        {/* Info */}
                                        <Grid size={{ xs: 8, sm: 5 }}>
                                            <Link href={`/products/${item.id}/product-details`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <Typography variant="subtitle1" fontWeight={800} noWrap>
                                                    {item.name}
                                                </Typography>
                                            </Link>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Vendido e entregue por Nestfy
                                            </Typography>
                                        </Grid>

                                        {/* Quantidade */}
                                        <Grid size={{ xs: 6, sm: 3 }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                border: '1px solid', 
                                                borderColor: 'divider',
                                                borderRadius: 2,
                                                width: 'fit-content'
                                            }}>
                                                <IconButton size="small" onClick={() => updateQty(item.id, item.quantity - 1)}>
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ mx: 2, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton size="small" onClick={() => updateQty(item.id, item.quantity + 1)}>
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>

                                        {/* Preço e Remover */}
                                        <Grid size={{ xs: 6, sm: 2 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="h6" fontWeight={900} color="primary">
                                                {formatPrice((item.discountPrice || item.price) * item.quantity)}
                                            </Typography>
                                            <IconButton color="error" size="small" onClick={() => removeItem(item.id)} sx={{ mt: 1 }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </MotionPaper>
                            ))}
                        </AnimatePresence>
                    </Stack>

                    <Button 
                        component={Link} 
                        href="/" 
                        startIcon={<ArrowBackIcon />}
                        sx={{ mt: 4, fontWeight: 700 }}
                    >
                        Continuar Comprando
                    </Button>
                </Grid>

                {/* Resumo */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 4, 
                            borderRadius: 4, 
                            border: '1px solid', 
                            borderColor: 'divider',
                            position: 'sticky',
                            top: 100,
                            bgcolor: 'grey.50'
                        }}
                    >
                        <Typography variant="h5" fontWeight={900} mb={4}>
                            Resumo do Pedido
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                                Tem um cupom?
                            </Typography>
                            <Box display="flex" gap={1}>
                                <TextField 
                                    size="small" 
                                    fullWidth 
                                    placeholder="Ex: NESTFY10" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    sx={{ bgcolor: 'white' }}
                                />
                                <Button variant="outlined" onClick={handleApplyCoupon}>Aplicar</Button>
                            </Box>
                        </Box>

                        <Stack spacing={2} mb={4}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Subtotal ({totalItems} itens)</Typography>
                                <Typography fontWeight={600}>{formatPrice(totalPrice)}</Typography>
                            </Box>
                            {discount > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="success.main">Desconto Cupom</Typography>
                                    <Typography color="success.main" fontWeight={600}>-{formatPrice(discount)}</Typography>
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Frete</Typography>
                                <Typography color="success.main" fontWeight={600}>Grátis</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Typography variant="h6" fontWeight={900}>Total</Typography>
                                <Typography variant="h4" fontWeight={900} color="primary">
                                    {formatPrice(finalPrice)}
                                </Typography>
                            </Box>
                        </Stack>

                        <Button 
                            component={Link} 
                            href="/checkout" 
                            variant="contained" 
                            fullWidth 
                            size="large"
                            sx={{ 
                                py: 2, 
                                borderRadius: 3, 
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                boxShadow: 4
                            }}
                        >
                            FINALIZAR COMPRA
                        </Button>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Pagamento seguro com SSL e criptografia
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Recomendações */}
            {recommendedProducts && recommendedProducts.length > 0 && (
                <Box sx={{ mt: 10 }}>
                    <Typography variant="h4" fontWeight={900} mb={4} textTransform="uppercase">
                        Aproveite e leve também
                    </Typography>
                    <Grid container spacing={3}>
                        {recommendedProducts.slice(0, 5).map((product) => (
                            <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={product.id}>
                                <Link href={`/products/${product.id}/product-details`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Paper 
                                        elevation={0} 
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: 3, 
                                            border: '1px solid', 
                                            borderColor: 'divider',
                                            transition: '0.3s',
                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 }
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', height: 180, width: '100%', mb: 2 }}>
                                            <Image
                                                src={product.images?.[0]?.url || '/placeholder-product.png'}
                                                alt={product.name}
                                                fill
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </Box>
                                        <Typography variant="subtitle2" fontWeight="bold" noWrap>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                            {formatPrice(product.discountPrice || product.price)}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                                            <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                                            <Typography variant="caption" color="text.secondary">4.8</Typography>
                                        </Box>
                                    </Paper>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity} 
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

