'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Grid, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar
} from '@mui/material';

// Icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CategoryIcon from '@mui/icons-material/Category';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import { 
  useAdminStats, 
  useAdminActivityLogs, 
  useAdminUsers, 
  useAdminProducts, 
  useAdminCategories,
  useAdminOrders,
  useDeleteUser,
  useDeleteProduct,
  useDeleteCategory,
  useUpdateUser,
  useCreateProduct,
  useUpdateProduct,
  useCreateCategory,
  useUpdateCategory,
  useBanUser,
  useUnbanUser
} from '@/app/libs/hooks/useAdmin';
import { Role } from '@/app/libs/types/enums';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

type Section = 'dashboard' | 'users' | 'products' | 'categories' | 'orders' | 'activity-logs' | 'finance';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Stats and Logs
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: activityLogs, isLoading: logsLoading, error: logsError } = useAdminActivityLogs(page + 1, rowsPerPage);

  // Users, Products, Categories, Orders
  const { data: users, isLoading: usersLoading, error: usersError } = useAdminUsers();
  const { data: products, isLoading: productsLoading, error: productsError } = useAdminProducts();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useAdminCategories();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useAdminOrders();

  // Mutations
  const deleteUserMutation = useDeleteUser();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const deleteProductMutation = useDeleteProduct();
  const deleteCategoryMutation = useDeleteCategory();
  
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const updateUserMutation = useUpdateUser();

  // Dialog States
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '' });

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    brandId: '',
    materialId: '',
    imageUrl: '',
    icms: 18,
    ipi: 5,
    pis: 1.65,
    cofins: 7.6
  });

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: Role.USER
  });

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Error and Feedback State
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const showFeedback = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Password Visibility State
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const formatDate = (dateString: any) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid' : date.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: any) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid' : date.toLocaleString('pt-BR');
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setSearchTerm('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setRoleFilter('ALL');
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteUserMutation.mutate(id, {
        onSuccess: () => showFeedback('Usuário excluído com sucesso!', 'success'),
        onError: () => showFeedback('Erro ao excluir usuário.', 'error')
      });
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProductMutation.mutate(id, {
        onSuccess: () => showFeedback('Produto excluído com sucesso!', 'success'),
        onError: () => showFeedback('Erro ao excluir produto.', 'error')
      });
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategoryMutation.mutate(id, {
        onSuccess: () => showFeedback('Categoria excluída com sucesso!', 'success'),
        onError: () => showFeedback('Erro ao excluir categoria.', 'error')
      });
    }
  };

  const handleOpenCategoryDialog = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setCategoryFormData({ name: '', description: '' });
    }
    setIsCategoryDialogOpen(true);
  };

  const handleOpenProductDialog = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId || '',
      brandId: product.brandId || '',
      materialId: product.materialId || '',
      imageUrl: product.imageUrl || product.images?.[0]?.url || '',
      icms: product.icms ?? 18,
      ipi: product.ipi ?? 5,
      pis: product.pis ?? 1.65,
      cofins: product.cofins ?? 7.6
    });
  } else {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      brandId: '',
      materialId: '',
      imageUrl: '',
      icms: 18,
      ipi: 5,
      pis: 1.65,
      cofins: 7.6
    });
  }
    setIsProductDialogOpen(true);
  };

  const handleOpenUserDialog = (user: any) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role || Role.USER
    });
    setIsUserDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, categoryData: categoryFormData }, {
        onSuccess: () => {
          setIsCategoryDialogOpen(false);
          showFeedback('Categoria atualizada com sucesso!', 'success');
        },
        onError: (error: any) => {
          const message = error.response?.data?.message || 'Erro ao atualizar categoria.';
          showFeedback(message, 'error');
        }
      });
    } else {
      createCategoryMutation.mutate({ id: 'admin', categoryData: categoryFormData }, {
        onSuccess: () => {
          setIsCategoryDialogOpen(false);
          showFeedback('Categoria criada com sucesso!', 'success');
        },
        onError: (error: any) => {
          const message = error.response?.data?.message || 'Erro ao criar categoria.';
          showFeedback(message, 'error');
        }
      });
    }
  };

  const handleSaveProduct = () => {
    const data = {
      ...productFormData,
    };

     if (editingProduct) {
       updateProductMutation.mutate({ id: editingProduct.id, productData: data }, {
         onSuccess: () => {
           setIsProductDialogOpen(false);
           showFeedback('Produto atualizado com sucesso!', 'success');
         },
         onError: () => showFeedback('Erro ao atualizar produto.', 'error')
       });
     } else {
       createProductMutation.mutate({ id: 'admin', productData: data }, {
         onSuccess: () => {
           setIsProductDialogOpen(false);
           showFeedback('Produto criado com sucesso!', 'success');
         },
         onError: () => showFeedback('Erro ao criar produto.', 'error')
       });
     }
   };
 
   const handleSaveUser = () => {
     if (editingUser) {
       updateUserMutation.mutate({ userId: editingUser.id, userData: userFormData }, {
         onSuccess: () => {
           setIsUserDialogOpen(false);
           showFeedback('Usuário atualizado com sucesso!', 'success');
         },
         onError: () => showFeedback('Erro ao atualizar usuário.', 'error')
       });
     }
   };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        if (statsError) {
          return (
            <Alert severity="error" sx={{ mb: 3 }}>
              Erro ao carregar estatísticas do dashboard. Por favor, tente novamente mais tarde.
            </Alert>
          );
        }

        const chartData = stats?.recentOrders?.map((order: any) => ({
          date: formatDate(order.createdAt),
          total: order.total
        })).reverse() || [];

        const pieData = [
          { name: 'Usuários', value: stats?.totalUsers || 0 },
          { name: 'Produtos', value: stats?.productCount || 0 },
          { name: 'Pedidos', value: stats?.orderCount || 0 },
        ];

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', border: '1px solid rgba(25, 118, 210, 0.2)' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total de Usuários</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statsLoading ? <CircularProgress size={24} /> : stats?.totalUsers || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ bgcolor: 'rgba(46, 125, 50, 0.1)', border: '1px solid rgba(46, 125, 50, 0.2)' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Vendas Totais</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statsLoading ? <CircularProgress size={24} /> : `R$ ${stats?.totalSales?.toFixed(2) || '0.00'}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ bgcolor: 'rgba(237, 108, 2, 0.1)', border: '1px solid rgba(237, 108, 2, 0.2)' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Pedidos Pendentes</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statsLoading ? <CircularProgress size={24} /> : stats?.pendingOrders || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 3, height: 400, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>Tendência de Vendas (Pedidos Recentes)</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" name="Valor (R$)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, height: 400, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>Distribuição do Sistema</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Pedidos Recentes</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats?.recentOrders?.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id.substring(0, 8)}...</TableCell>
                        <TableCell>{order.user?.name}</TableCell>
                        <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip label={order.status} size="small" color={order.status === 'COMPLETED' || order.status === 'DELIVERED' ? 'success' : 'warning'} />
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Nenhum pedido recente</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        );

      case 'users':
        if (usersError) {
          return (
            <Alert severity="error" sx={{ mb: 3 }}>
              Erro ao carregar lista de usuários.
            </Alert>
          );
        }

        const filteredUsers = users?.filter((user: any) => {
          const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               user.email.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
          return matchesSearch && matchesRole;
        });

        return (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1, maxWidth: 400 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Função</InputLabel>
                <Select
                  value={roleFilter}
                  label="Função"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Todas</MenuItem>
                  <MenuItem value={Role.USER}>Usuário</MenuItem>
                  <MenuItem value={Role.ADMIN}>Administrador</MenuItem>
                  <MenuItem value={Role.SELLER}>Vendedor</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Senha (Hash)</TableCell>
                    <TableCell>IP</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersLoading ? (
                    <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
                  ) : filteredUsers?.length === 0 ? (
                    <TableRow><TableCell colSpan={7} align="center">Nenhum usuário encontrado</TableCell></TableRow>
                  ) : filteredUsers?.map((user: any) => (
                    <TableRow key={user.id} hover sx={{ opacity: user.isBanned ? 0.6 : 1 }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ 
                            fontFamily: 'monospace', 
                            bgcolor: 'action.hover', 
                            px: 1, 
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            filter: showPasswords[user.id] ? 'none' : 'blur(4px)',
                            transition: 'filter 0.2s'
                          }}>
                            {user.password ? (showPasswords[user.id] ? user.password : '********') : 'N/A'}
                          </Typography>
                          <IconButton size="small" onClick={() => togglePasswordVisibility(user.id)}>
                            {showPasswords[user.id] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {user.lastIp || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={user.role} size="small" color={user.role === Role.ADMIN ? 'primary' : 'default'} />
                      </TableCell>
                      <TableCell>
                        {user.isBanned ? (
                          <Chip label="BANIDO" size="small" color="error" variant="filled" />
                        ) : (
                          <Chip label="ATIVO" size="small" color="success" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Editar">
                            <IconButton size="small" color="primary" onClick={() => handleOpenUserDialog(user)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {user.isBanned ? (
                            <Tooltip title="Desbanir">
                              <IconButton size="small" color="success" onClick={() => unbanUserMutation.mutate(user.id)}>
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Banir">
                              <IconButton size="small" color="warning" onClick={() => banUserMutation.mutate(user.id)}>
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip title="Remover (Soft Delete)">
                            <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={isUserDialogOpen} onClose={() => setIsUserDialogOpen(false)}>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
                <TextField 
                  label="Nome" 
                  fullWidth 
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                />
                <TextField 
                  label="Email" 
                  fullWidth 
                  disabled
                  value={userFormData.email}
                />
                <TextField
                  select
                  label="Função (Role)"
                  fullWidth
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as Role })}
                >
                  <MenuItem value={Role.USER}>Usuário</MenuItem>
                  <MenuItem value={Role.ADMIN}>Administrador</MenuItem>
                  <MenuItem value={Role.SELLER}>Vendedor</MenuItem>
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsUserDialogOpen(false)}>Cancelar</Button>
                <Button variant="contained" onClick={handleSaveUser}>Salvar</Button>
              </DialogActions>
            </Dialog>
          </Box>
        );

      case 'products':
        if (productsError) {
          return (
            <Alert severity="error" sx={{ mb: 3 }}>
              Erro ao carregar lista de produtos.
            </Alert>
          );
        }

        const filteredProducts = products?.filter((product: any) => {
          const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = categoryFilter === 'ALL' || product.categoryId === categoryFilter;
          return matchesSearch && matchesCategory;
        });

        return (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1, maxWidth: 400 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Categoria"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Todas</MenuItem>
                  {categories?.map((cat: any) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={() => handleOpenProductDialog()}>
                Novo Produto
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Preço</TableCell>
                    <TableCell>Estoque</TableCell>
                    <TableCell>Atualizado</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsLoading ? (
                    <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                  ) : filteredProducts?.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center">Nenhum produto encontrado</TableCell></TableRow>
                  ) : filteredProducts?.map((product: any) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {product.images?.[0] && (
                            <Box 
                              component="img" 
                              src={product.images[0].url} 
                              sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                            />
                          )}
                          <Typography variant="body2" fontWeight="medium">{product.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{product.category?.name}</TableCell>
                      <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{formatDate(product.updatedAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleOpenProductDialog(product)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteProduct(product.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={isProductDialogOpen} onClose={() => setIsProductDialogOpen(false)} maxWidth="md" fullWidth>
              <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
              <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField 
                      label="Nome do Produto" 
                      fullWidth 
                      value={productFormData.name}
                      onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      select
                      label="Categoria"
                      fullWidth
                      value={productFormData.categoryId}
                      onChange={(e) => setProductFormData({ ...productFormData, categoryId: e.target.value })}
                    >
                      {categories?.map((cat: any) => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField 
                      label="Descrição" 
                      fullWidth 
                      multiline 
                      rows={3}
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField 
                      label="Preço" 
                      type="number"
                      fullWidth 
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: parseFloat(e.target.value) })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField 
                      label="Estoque" 
                      type="number"
                      fullWidth 
                      value={productFormData.stock}
                      onChange={(e) => setProductFormData({ ...productFormData, stock: parseInt(e.target.value) })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField 
                      label="URL da Imagem" 
                      fullWidth 
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={productFormData.imageUrl}
                      onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                      helperText="Cole aqui o link da imagem do produto"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 1 }}>
                      <Chip label="Impostos (%)" size="small" />
                    </Divider>
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                      label="ICMS (%)" 
                      type="number"
                      fullWidth 
                      value={productFormData.icms}
                      onChange={(e) => setProductFormData({ ...productFormData, icms: parseFloat(e.target.value) })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                      label="IPI (%)" 
                      type="number"
                      fullWidth 
                      value={productFormData.ipi}
                      onChange={(e) => setProductFormData({ ...productFormData, ipi: parseFloat(e.target.value) })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                      label="PIS (%)" 
                      type="number"
                      fullWidth 
                      value={productFormData.pis}
                      onChange={(e) => setProductFormData({ ...productFormData, pis: parseFloat(e.target.value) })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                      label="COFINS (%)" 
                      type="number"
                      fullWidth 
                      value={productFormData.cofins}
                      onChange={(e) => setProductFormData({ ...productFormData, cofins: parseFloat(e.target.value) })}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsProductDialogOpen(false)}>Cancelar</Button>
                <Button variant="contained" onClick={handleSaveProduct}>Salvar</Button>
              </DialogActions>
            </Dialog>
          </Box>
        );

      case 'categories':
        if (categoriesError) {
          return (
            <Alert severity="error" sx={{ mb: 3 }}>
              Erro ao carregar lista de categorias.
            </Alert>
          );
        }

        const filteredCategories = categories?.filter((category: any) => {
          return category.name.toLowerCase().includes(searchTerm.toLowerCase());
        });

        return (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1, maxWidth: 400 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={() => handleOpenCategoryDialog()}>
                Nova Categoria
              </Button>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Produtos</TableCell>
                    <TableCell>Atualizado</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoriesLoading ? (
                    <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
                  ) : filteredCategories?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} align="center">Nenhuma categoria encontrada</TableCell></TableRow>
                  ) : filteredCategories?.map((category: any) => (
                    <TableRow key={category.id} hover>
                      <TableCell sx={{ fontWeight: 'medium' }}>{category.name}</TableCell>
                      <TableCell>{category.description || '-'}</TableCell>
                      <TableCell>{category._count?.products || 0}</TableCell>
                      <TableCell>{formatDate(category.updatedAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleOpenCategoryDialog(category)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteCategory(category.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={isCategoryDialogOpen} onClose={() => setIsCategoryDialogOpen(false)}>
              <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
              <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
                <TextField 
                  label="Nome" 
                  fullWidth 
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                />
                <TextField 
                  label="Descrição" 
                  fullWidth 
                  multiline 
                  rows={3}
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsCategoryDialogOpen(false)}>Cancelar</Button>
                <Button variant="contained" onClick={handleSaveCategory}>Salvar</Button>
              </DialogActions>
            </Dialog>
          </Box>
         );
 
       case 'orders':
        if (ordersError) {
          return (
            <Alert severity="error" sx={{ mb: 3 }}>
              Erro ao carregar lista de pedidos.
            </Alert>
          );
        }

        const filteredOrders = orders?.filter((order: any) => {
          const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
          return matchesSearch && matchesStatus;
        });

        return (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Buscar pedidos (ID, cliente...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1, maxWidth: 400 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Todos</MenuItem>
                  <MenuItem value="PENDING">Pendente</MenuItem>
                  <MenuItem value="PROCESSING">Processando</MenuItem>
                  <MenuItem value="SHIPPED">Enviado</MenuItem>
                  <MenuItem value="DELIVERED">Entregue</MenuItem>
                  <MenuItem value="CANCELLED">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Valor Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordersLoading ? (
                    <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                  ) : filteredOrders?.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center">Nenhum pedido encontrado</TableCell></TableRow>
                  ) : filteredOrders?.map((order: any) => (
                    <TableRow key={order.id} hover>
                      <TableCell>#{order.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">{order.user?.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{order.user?.email}</Typography>
                      </TableCell>
                      <TableCell>R$ {order.totalAmount?.toFixed(2) || order.total?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          size="small" 
                          color={order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'success' : 'warning'} 
                        />
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary">
                          <AssessmentIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
 
       case 'activity-logs':
        if (logsError) {
          return (
            <Alert severity="error" sx={{ mb: 3 }}>
              Erro ao carregar logs de atividade.
            </Alert>
          );
        }

        return (
          <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Usuário</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Ação</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Rota</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>IP</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Duração</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logsLoading ? (
                  <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                ) : activityLogs?.data?.map((log: any) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">{log.user?.name || 'N/A'}</Typography>
                      <Typography variant="caption" color="textSecondary">{log.user?.email || 'Sistema'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={log.action} 
                        size="small" 
                        color={log.method === 'GET' ? 'info' : 'warning'} 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.path}
                    </TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>{log.duration}ms</TableCell>
                    <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={activityLogs?.meta?.total || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Itens por página"
            />
          </TableContainer>
        );

      default:
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="textSecondary">
              Seção "{activeSection}" em desenvolvimento.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 0, borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Grid container>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3, lg: 2 }} sx={{ borderRight: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <AdminPanelSettingsIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">Admin Panel</Typography>
            </Box>
            <Divider />
            <List component="nav" sx={{ p: 1 }}>
              <ListItemButton selected={activeSection === 'dashboard'} onClick={() => handleSectionChange('dashboard')} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon><DashboardIcon color={activeSection === 'dashboard' ? 'primary' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton selected={activeSection === 'users'} onClick={() => handleSectionChange('users')} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon><PeopleIcon color={activeSection === 'users' ? 'primary' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="Usuários" />
              </ListItemButton>
              <ListItemButton selected={activeSection === 'products'} onClick={() => handleSectionChange('products')} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon><ShoppingBagIcon color={activeSection === 'products' ? 'primary' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="Produtos" />
              </ListItemButton>
              <ListItemButton selected={activeSection === 'categories'} onClick={() => handleSectionChange('categories')} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon><CategoryIcon color={activeSection === 'categories' ? 'primary' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="Categorias" />
              </ListItemButton>
              <ListItemButton selected={activeSection === 'orders'} onClick={() => handleSectionChange('orders')} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon><ShoppingCartIcon color={activeSection === 'orders' ? 'primary' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="Pedidos" />
              </ListItemButton>
              <ListItemButton selected={activeSection === 'activity-logs'} onClick={() => handleSectionChange('activity-logs')} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon><HistoryIcon color={activeSection === 'activity-logs' ? 'primary' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="Logs de Atividade" />
              </ListItemButton>
              <ListItemButton selected={activeSection === 'finance'} component={Link} href="/admin/finance" sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon><AccountBalanceIcon color={activeSection === 'finance' ? 'primary' : 'inherit'} /></ListItemIcon>
                <ListItemText primary="Financeiro" />
              </ListItemButton>
            </List>
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9, lg: 10 }}>
            <Box sx={{ p: 4 }}>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="900" sx={{ textTransform: 'uppercase' }}>
                  {activeSection.replace('-', ' ')}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Bem-vindo, Administrador
                </Typography>
              </Box>
              {renderContent()}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
