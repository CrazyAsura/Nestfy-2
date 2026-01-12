'use client';

import { 
    Drawer, 
    Box, 
    Typography, 
    IconButton, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemAvatar, 
    Avatar, 
    Button, 
    Divider,
    Stack
} from '@mui/material';
import { Close, Add, Remove, DeleteOutline, ShoppingBag } from '@mui/icons-material';
import { useCart } from '@/app/libs/hooks/useCart';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
    const { items, isOpen, setOpen, updateQty, removeItem, totalPrice, totalItems } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        setOpen(false);
        router.push('/checkout');
    };

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={() => setOpen(false)}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 400 }, p: 3 }
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight={900}>
                    Seu Carrinho ({totalItems})
                </Typography>
                <IconButton onClick={() => setOpen(false)}>
                    <Close />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {items.length === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
                    <ShoppingBag sx={{ fontSize: 64, color: 'text.disabled' }} />
                    <Typography variant="h6" color="text.secondary">
                        Seu carrinho está vazio
                    </Typography>
                    <Button variant="contained" onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>
                        Continuar Comprando
                    </Button>
                </Box>
            ) : (
                <>
                    <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        {items.map((item) => (
                            <ListItem 
                                key={item.id}
                                sx={{ 
                                    px: 0, 
                                    py: 2, 
                                    borderBottom: '1px solid', 
                                    borderColor: 'divider' 
                                }}
                            >
                                <ListItemAvatar sx={{ mr: 2 }}>
                                    <Avatar 
                                        variant="rounded" 
                                        sx={{ width: 80, height: 80, bgcolor: 'background.default' }}
                                    >
                                        <Image 
                                            src={item.images?.[0]?.url || '/images/placeholder.png'} 
                                            alt={item.name} 
                                            width={80} 
                                            height={80} 
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography fontWeight={700} variant="body1">
                                            {item.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Stack spacing={1} mt={1}>
                                            <Typography variant="body2" color="primary" fontWeight={800}>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.discountPrice || item.price)}
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <IconButton size="small" onClick={() => updateQty(item.id, item.quantity - 1)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                <Typography variant="body2" fontWeight={700}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton size="small" onClick={() => updateQty(item.id, item.quantity + 1)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                                                    <Add fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => removeItem(item.id)} sx={{ ml: 'auto' }}>
                                                    <DeleteOutline fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Stack>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Box sx={{ mt: 'auto', pt: 3 }}>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h6" fontWeight={700}>Total</Typography>
                            <Typography variant="h6" color="primary" fontWeight={900}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                            </Typography>
                        </Box>
                        <Button 
                            variant="contained" 
                            fullWidth 
                            size="large" 
                            onClick={handleCheckout}
                            sx={{ 
                                borderRadius: 3, 
                                py: 2, 
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                boxShadow: 4
                            }}
                        >
                            Finalizar Compra
                        </Button>
                    </Box>
                </>
            )}
        </Drawer>
    );
}
