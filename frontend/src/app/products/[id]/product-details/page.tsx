'use client';

import { useParams } from 'next/navigation';
import { 
    Container, 
    Grid, 
    Typography, 
    Box, 
    Button, 
    Chip, 
    Divider, 
    CircularProgress,
    Paper,
    Rating,
    Avatar,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';
import { useProduct, useRelatedProducts } from '@/app/libs/hooks/useProducts';
import { useCart } from '@/app/libs/hooks/useCart';
import { useReviews, useCreateReview, useToggleLikeReview, useReplyToReview } from '@/app/libs/hooks/useReviews';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/app/libs/hooks/useWishlist';
import { useProfile } from '@/app/libs/hooks/useProfile';
import Image from 'next/image';
import Link from 'next/link';
import { 
    ShoppingCart, 
    Favorite, 
    FavoriteBorder, 
    Share, 
    ThumbUp, 
    ThumbDown, 
    MoreVert,
    LocalShipping,
    VerifiedUser,
    Undo,
    Star
} from '@mui/icons-material';
import { useState } from 'react';

export default function ProductDetails() {
    const { id } = useParams();
    const { data: product, isLoading: productLoading, error } = useProduct(id as string);
    const { data: reviews, isLoading: reviewsLoading } = useReviews(id as string);
    const { data: profile } = useProfile();
    const { mutate: createReview, isPending: isCreatingReview } = useCreateReview();
    const { mutate: toggleLike } = useToggleLikeReview();
    const { mutate: replyToReview, isPending: isReplying } = useReplyToReview();
    
    // Wishlist hooks
    const { data: wishlist } = useWishlist();
    const { mutate: addToWishlist } = useAddToWishlist();
    const { mutate: removeFromWishlist } = useRemoveFromWishlist();
    
    // Related products hook
    const { data: relatedProducts, isLoading: relatedLoading } = useRelatedProducts(
        product?.category?.id || '', 
        id as string
    );
    
    const [selectedImage, setSelectedImage] = useState(0);
    const { addItem, setOpen } = useCart();
    
    // Review states
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
    const [replyComment, setReplyComment] = useState('');
    const [newRating, setNewRating] = useState<number | null>(5);
    const [newComment, setNewComment] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const isProductInWishlist = wishlist?.items?.some((item: any) => item.productId === id);
    const wishlistItemId = wishlist?.items?.find((item: any) => item.productId === id)?.id;

    const handleToggleWishlist = () => {
        if (isProductInWishlist) {
            removeFromWishlist(wishlistItemId, {
                onSuccess: () => setSnackbar({ open: true, message: 'Removido da lista de desejos', severity: 'success' })
            });
        } else {
            addToWishlist(id as string, {
                onSuccess: () => setSnackbar({ open: true, message: 'Adicionado à lista de desejos', severity: 'success' }),
                onError: () => setSnackbar({ open: true, message: 'Faça login para salvar produtos', severity: 'error' })
            });
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addItem(product);
            setOpen(true);
        }
    };

    const handleLike = (reviewId: string) => {
        toggleLike({ reviewId, productId: id as string }, {
            onError: () => setSnackbar({ open: true, message: 'Faça login para curtir', severity: 'error' })
        });
    };

    const handleOpenReplyDialog = (reviewId: string) => {
        setSelectedReviewId(reviewId);
        setIsReplyDialogOpen(true);
    };

    const handleCloseReplyDialog = () => {
        setIsReplyDialogOpen(false);
        setSelectedReviewId(null);
        setReplyComment('');
    };

    const handleSubmitReply = () => {
        if (!replyComment.trim() || !selectedReviewId) return;

        replyToReview({
            reviewId: selectedReviewId,
            productId: id as string,
            comment: replyComment
        }, {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'Resposta enviada!', severity: 'success' });
                handleCloseReplyDialog();
            },
            onError: () => {
                setSnackbar({ open: true, message: 'Erro ao enviar resposta. Faça login.', severity: 'error' });
            }
        });
    };

    const handleOpenReviewDialog = () => {
        setIsReviewDialogOpen(true);
    };

    const handleCloseReviewDialog = () => {
        setIsReviewDialogOpen(false);
        setNewRating(5);
        setNewComment('');
    };

    const handleSubmitReview = () => {
        if (!newRating) {
            setSnackbar({ open: true, message: 'Por favor, selecione uma nota.', severity: 'error' });
            return;
        }

        createReview({
            productId: id as string,
            rating: newRating,
            comment: newComment
        }, {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'Avaliação enviada com sucesso!', severity: 'success' });
                handleCloseReviewDialog();
            },
            onError: () => {
                setSnackbar({ open: true, message: 'Erro ao enviar avaliação. Tente novamente.', severity: 'error' });
            }
        });
    };

    if (productLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Container sx={{ py: 10 }}>
                <Typography variant="h5" color="error" textAlign="center">
                    Erro ao carregar produto ou produto não encontrado.
                </Typography>
            </Container>
        );
    }

    const mainImage = product.images?.[selectedImage]?.url || product.imageUrl || '/images/placeholder.png';
    const averageRating = reviews?.length 
        ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length 
        : 0;

    return (
        <Container sx={{ py: 6 }}>
            <Grid container spacing={6}>
                {/* Galeria de Imagens */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ position: 'relative', height: 500, width: '100%', mb: 2 }}>
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>
                        <Box display="flex" gap={2} overflow="auto" pb={1}>
                            {product.images?.map((img: any, index: number) => (
                                <Box 
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    sx={{ 
                                        width: 80, 
                                        height: 80, 
                                        position: 'relative', 
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        border: '2px solid',
                                        borderColor: selectedImage === index ? 'primary.main' : 'transparent'
                                    }}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`${product.name} - ${index}`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Informações do Produto */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography variant="overline" color="primary" fontWeight="bold">
                            {product.category?.name}
                        </Typography>
                        <Typography variant="h3" fontWeight={900} mb={2}>
                            {product.name}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <Rating value={averageRating} precision={0.5} readOnly />
                            <Typography variant="body2" color="text.secondary">
                                ({reviews?.length || 0} avaliações)
                            </Typography>
                        </Box>

                        <Typography variant="h4" color="primary" fontWeight="bold" mb={1}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.discountPrice || product.price)}
                        </Typography>
                        
                        {product.discountPrice && (
                            <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }} mb={3}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                            </Typography>
                        )}

                        <Box sx={{ mt: 2, mb: 3, p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }}>
                            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VerifiedUser sx={{ fontSize: 18 }} /> Detalhes dos Impostos (Inclusos)
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" display="block" color="text.secondary">ICMS</Typography>
                                    <Typography variant="body2" fontWeight="medium">{product.icms || 18}%</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" display="block" color="text.secondary">IPI</Typography>
                                    <Typography variant="body2" fontWeight="medium">{product.ipi || 5}%</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" display="block" color="text.secondary">PIS</Typography>
                                    <Typography variant="body2" fontWeight="medium">{product.pis || 1.65}%</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" display="block" color="text.secondary">COFINS</Typography>
                                    <Typography variant="body2" fontWeight="medium">{product.cofins || 7.6}%</Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="primary" fontWeight="bold">
                                        Total em impostos: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                            ((product.discountPrice || product.price) * ((product.icms || 18) + (product.ipi || 5) + (product.pis || 1.65) + (product.cofins || 7.6))) / 100
                                        )}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Typography variant="body1" color="text.secondary" mb={4} lineHeight={1.8}>
                            {product.description}
                        </Typography>

                        <Divider sx={{ mb: 4 }} />

                        <Box display="flex" gap={2} mb={4}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                startIcon={<ShoppingCart />}
                                fullWidth
                                onClick={handleAddToCart}
                                sx={{ borderRadius: 3, py: 2, fontSize: '1.1rem' }}
                            >
                                Adicionar ao Carrinho
                            </Button>
                            <Button 
                                variant="outlined" 
                                size="large"
                                onClick={handleToggleWishlist}
                                sx={{ borderRadius: 3, px: 3, borderColor: isProductInWishlist ? 'primary.main' : 'divider' }}
                            >
                                {isProductInWishlist ? <Favorite color="primary" /> : <FavoriteBorder />}
                            </Button>
                        </Box>

                        <Box sx={{ bgcolor: 'action.hover', p: 3, borderRadius: 4, mb: 4 }}>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <LocalShipping color="primary" />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">Entrega Grátis</Typography>
                                    <Typography variant="caption" color="text.secondary">Para todo o Brasil em compras acima de R$ 199</Typography>
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <VerifiedUser color="primary" />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">Compra Segura</Typography>
                                    <Typography variant="caption" color="text.secondary">Seus dados protegidos de ponta a ponta</Typography>
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Undo color="primary" />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">Devolução em 7 dias</Typography>
                                    <Typography variant="caption" color="text.secondary">Arrependeu? Devolvemos seu dinheiro sem burocracia</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* Produtos Relacionados */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h5" fontWeight="bold" mb={4}>
                                Quem viu este produto também comprou
                            </Typography>
                            <Grid container spacing={3}>
                                {relatedProducts.slice(0, 4).map((item: any) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
                                        <Link href={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Paper 
                                                elevation={0} 
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 4, 
                                                    border: '1px solid', 
                                                    borderColor: 'divider',
                                                    transition: '0.3s',
                                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 }
                                                }}
                                            >
                                                <Box sx={{ position: 'relative', height: 200, width: '100%', mb: 2 }}>
                                                    <Image
                                                        src={item.images?.[0]?.url || '/images/placeholder.png'}
                                                        alt={item.name}
                                                        fill
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </Box>
                                                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="h6" color="primary" fontWeight="bold">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.discountPrice || item.price)}
                                                </Typography>
                                                <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                                                    <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                                                    <Typography variant="caption" color="text.secondary">4.5</Typography>
                                                </Box>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                )}

                {/* Seção de Comentários e Reviews */}
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ mt: 8 }}>
                        <Divider sx={{ mb: 6 }} />
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h4" fontWeight="bold">
                                Avaliações dos Clientes
                            </Typography>
                            <Button 
                                variant="contained" 
                                sx={{ borderRadius: 2 }}
                                onClick={handleOpenReviewDialog}
                            >
                                Escrever Avaliação
                            </Button>
                        </Box>

                        {reviewsLoading ? (
                            <CircularProgress />
                        ) : (
                            <Grid container spacing={4}>
                                {/* Resumo das Avaliações */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                                        <Typography variant="h2" fontWeight="bold" color="primary">
                                            {averageRating.toFixed(1)}
                                        </Typography>
                                        <Rating value={averageRating} precision={0.5} readOnly sx={{ mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            Média baseada em {reviews?.length || 0} avaliações
                                        </Typography>
                                        
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = reviews?.filter((r: any) => r.rating === star).length || 0;
                                            const percentage = reviews?.length ? (count / reviews.length) * 100 : 0;
                                            return (
                                                <Box key={star} display="flex" alignItems="center" gap={2} mb={0.5}>
                                                    <Typography variant="body2" sx={{ minWidth: 20 }}>{star}</Typography>
                                                    <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'action.hover', borderRadius: 4, overflow: 'hidden' }}>
                                                        <Box sx={{ width: `${percentage}%`, height: '100%', bgcolor: 'primary.main' }} />
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30 }}>
                                                        {Math.round(percentage)}%
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Paper>
                                </Grid>

                                {/* Lista de Comentários */}
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <Box display="flex" flexDirection="column" gap={4}>
                                        {reviews?.map((review: any) => (
                                            <Box key={review.id}>
                                                <Box display="flex" justifyContent="space-between" mb={2}>
                                                    <Box display="flex" gap={2}>
                                                        <Avatar sx={{ bgcolor: 'primary.light' }} src={review.user?.image}>
                                                            {review.user?.name?.[0]}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {review.user?.name}
                                                            </Typography>
                                                            <Rating value={review.rating} size="small" readOnly />
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                                    </Typography>
                                                </Box>
                                                
                                                <Typography variant="body1" mb={2} color="text.primary">
                                                    {review.comment}
                                                </Typography>

                                                <Box display="flex" gap={2} alignItems="center">
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleLike(review.id)}
                                                            color={profile?.id && review.likes?.includes(profile.id) ? 'primary' : 'default'}
                                                        >
                                                            <ThumbUp fontSize="small" />
                                                        </IconButton>
                                                        <Typography variant="caption">{review.likes?.length || 0}</Typography>
                                                    </Box>
                                                    <Button 
                                                        size="small" 
                                                        sx={{ ml: 'auto', textTransform: 'none' }}
                                                        onClick={() => handleOpenReplyDialog(review.id)}
                                                    >
                                                        Responder
                                                    </Button>
                                                </Box>

                                                {/* Respostas */}
                                                {review.replies && review.replies.length > 0 && (
                                                    <Box sx={{ mt: 2, ml: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                        {review.replies.map((reply: any, index: number) => (
                                                            <Box key={index} sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
                                                                <Box display="flex" justifyContent="space-between" mb={1}>
                                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                                        {reply.userName}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {new Date(reply.createdAt).toLocaleDateString('pt-BR')}
                                                                    </Typography>
                                                                </Box>
                                                                <Typography variant="body2">
                                                                    {reply.comment}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                )}
                                                <Divider sx={{ mt: 4 }} />
                                            </Box>
                                        ))}
                                        {reviews?.length === 0 && (
                                            <Typography color="text.secondary" textAlign="center" py={4}>
                                                Nenhuma avaliação ainda. Seja o primeiro a avaliar!
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                </Grid>
            </Grid>
            
            {/* Dialog de Avaliação */}
            <Dialog open={isReviewDialogOpen} onClose={handleCloseReviewDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Avaliar Produto</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={3} py={1}>
                        <Box>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Sua nota
                            </Typography>
                            <Rating 
                                value={newRating} 
                                onChange={(_, value) => setNewRating(value)} 
                                size="large"
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Seu comentário
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Conte o que achou do produto..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseReviewDialog} color="inherit">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmitReview} 
                        variant="contained" 
                        disabled={isCreatingReview}
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        {isCreatingReview ? <CircularProgress size={24} /> : 'Enviar Avaliação'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Dialog de Resposta */}
            <Dialog open={isReplyDialogOpen} onClose={handleCloseReplyDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Responder Comentário</DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Escreva sua resposta..."
                            value={replyComment}
                            onChange={(e) => setReplyComment(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseReplyDialog} color="inherit">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmitReply} 
                        variant="contained" 
                        disabled={isReplying || !replyComment.trim()}
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        {isReplying ? <CircularProgress size={24} /> : 'Responder'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar de Feedback */}
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
