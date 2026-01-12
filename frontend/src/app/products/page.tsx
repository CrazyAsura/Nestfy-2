'use client'

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  InputAdornment,
  Divider,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ListProducts from "../ui/components/listProducts";
import { useCategories } from "../libs/hooks/useCategories";

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const { data: categoriesData } = useCategories();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSortChange = (event: any) => {
    const value = event.target.value;
    setSortBy(value.split(':')[0]);
    setOrder(value.split(':')[1]);
  };

  const Filters = () => (
    <Stack spacing={3} sx={{ p: { xs: 3, md: 0 } }}>
      <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '0.1em' }}>FILTROS</Typography>
      
      <Box>
        <Typography variant="body2" fontWeight={600} mb={1} sx={{ letterSpacing: '0.1em' }}>BUSCAR</Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="O que você procura?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={600} mb={1} sx={{ letterSpacing: '0.1em' }}>CATEGORIA</Typography>
        <FormControl fullWidth size="small">
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 0 }}
          >
            <MenuItem value="">Todas as Categorias</MenuItem>
            {categoriesData?.data?.map((cat: any) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={600} mb={1} sx={{ letterSpacing: '0.1em' }}>ORDENAR POR</Typography>
        <FormControl fullWidth size="small">
          <Select
            value={`${sortBy}:${order}`}
            onChange={handleSortChange}
            sx={{ borderRadius: 0 }}
          >
            <MenuItem value="createdAt:desc">Mais Recentes</MenuItem>
            <MenuItem value="price:asc">Menor Preço</MenuItem>
            <MenuItem value="price:desc">Maior Preço</MenuItem>
            <MenuItem value="name:asc">Nome (A-Z)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button 
        variant="outlined" 
        fullWidth 
        onClick={() => {
          setSearch('');
          setCategoryId('');
          setSortBy('createdAt');
          setOrder('desc');
        }}
        sx={{ borderRadius: 0, mt: 2 }}
      >
        LIMPAR FILTROS
      </Button>
    </Stack>
  );

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: 'var(--font-playfair)', 
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Nossos Produtos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ letterSpacing: '0.2em', maxWidth: '600px', mx: 'auto', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            Descubra a elegância em cada detalhe de nossa coleção
          </Typography>
          <Box sx={{ width: 40, height: 2, bgcolor: 'primary.main', mx: 'auto', mt: 4 }} />
        </Box>

        <Grid container spacing={4}>
          {/* Sidebar Filters (Desktop) */}
          {!isMobile && (
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ position: 'sticky', top: 120 }}>
                <Filters />
              </Box>
            </Grid>
          )}

          {/* Product List */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Mobile Filter Button */}
            {isMobile && (
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  startIcon={<FilterListIcon />} 
                  onClick={() => setIsFilterDrawerOpen(true)}
                  variant="outlined"
                  sx={{ borderRadius: 0 }}
                >
                  Filtros
                </Button>
              </Box>
            )}

            <ListProducts 
              search={search}
              categoryId={categoryId}
              sortBy={sortBy}
              order={order}
              showTitle={false}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Filters />
      </Drawer>
    </Box>
  );
}
