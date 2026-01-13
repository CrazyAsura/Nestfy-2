'use client';

import { useParams } from 'next/navigation';
import { 
    Container, 
    Typography, 
    Box, 
    CircularProgress,
    Grid,
    Breadcrumbs,
    Link as MuiLink
} from '@mui/material';
import { useCategory } from '@/app/libs/hooks/useCategories';
import ListProducts from '@/app/ui/components/listProducts';
import Link from 'next/link';

export default function CategoryDetails() {
    const { id } = useParams();
    const { data: category, isLoading, error } = useCategory(id as string);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !category) {
        return (
            <Container sx={{ py: 10 }}>
                <Typography variant="h5" color="error" textAlign="center">
                    Categoria não encontrada.
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 6 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
                <Link href="/" passHref>
                    <MuiLink underline="hover" color="inherit">Home</MuiLink>
                </Link>
                <Link href="/categories" passHref>
                    <MuiLink underline="hover" color="inherit">Categorias</MuiLink>
                </Link>
                <Typography color="text.primary">{category.name}</Typography>
            </Breadcrumbs>

            <Box mb={6}>
                <Typography variant="h3" fontWeight={900} mb={2}>
                    {category.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Explorar todos os produtos da categoria {category.name}
                </Typography>
            </Box>

            {/* Filtra o ListProducts pela categoria selecionada */}
            <ListProducts categoryId={id as string} showTitle={false} />
        </Container>
    );
}
