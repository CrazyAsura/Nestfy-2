'use client';

import { 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    Button, 
    Box, 
    IconButton, 
    CircularProgress,
    Paper,
    Divider
} from '@mui/material';
import { Delete, ShoppingCart, Favorite } from '@mui/icons-material';
import { useWishlist, useRemoveFromWishlist } from '@/app/libs/hooks/useWishlist';
import { useCart } from '@/app/libs/hooks/useCart';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
    const { data: wishlist, isLoading } = useWishlist();
    const { mutate: removeFromWishlist } = useRemoveFromWishlist();
    const { addItem, setOpen } = useCart();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    const handleAddToCart = (product: any) => {
        addItem(product);
        setOpen(true);
    };

    return (
        <Container sx={{ py: 6 }}>
            <Box display="flex" alignItems="center" gap={2} mb={6}>
                <Favorite color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h3" fontWeight={900}>Minha Lista de Desejos</Typography>
            </Box>

            {!wishlist || wishlist.items?.length === 0 ? (
                <Paper elevation={0} sx={{ p: 10, textAlign: 'center', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h5" color="text.secondary" mb={3}>
                        Sua lista de desejos está vazia.
                    </Typography>
                    <Button variant="contained" component={Link} href="/" size="large">
                        Explorar Produtos
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    {wishlist.items.map((item: any) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                            <Card 
                                elevation={0} 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    borderRadius: 4, 
                                    border: '1px solid', 
                                    borderColor: 'divider',
                                    transition: '0.3s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                                }}
                            >
                                <Link href={`/products/${item.product?.id}`} style={{ textDecoration: 'none' }}>
                                    <Box sx={{ position: 'relative', height: 250, width: '100%' }}>
                                        <Image
                                            src={item.product?.imageUrl || item.product?.images?.[0]?.url || '/images/placeholder.png'}
                                            alt={item.product?.name}
                                            fill
                                            style={{ objectFit: 'contain', padding: '16px' }}
                                        />
                                    </Box>
                                </Link>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" noWrap gutterBottom>
                                        {item.product?.name}
                                    </Typography>
                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product?.discountPrice || item.product?.price)}
                                    </Typography>
                                </CardContent>
                                <Divider />
                                <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                                    <Button 
                                        variant="contained" 
                                        fullWidth 
                                        startIcon={<ShoppingCart />}
                                        onClick={() => handleAddToCart(item.product)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Carrinho
                                    </Button>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => removeFromWishlist(item.id)}
                                        sx={{ border: '1px solid', borderColor: 'error.light' }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
