'use client';

import { 
    Box, 
    Typography, 
    Container, 
    Grid, 
    Paper, 
    CircularProgress, 
    Card, 
    CardContent, 
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    InputAdornment
} from '@mui/material';
import { 
    TrendingUp, 
    AccountBalanceWallet, 
    Receipt, 
    Search,
    Download,
    Info
} from '@mui/icons-material';
import { getBaseURL } from '@/app/libs/api/services/axios';
import { useFinanceStats } from '@/app/libs/hooks/useFinance';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useState } from 'react';

export default function FinancePage() {
    const { data, isLoading } = useFinanceStats();
    const [searchTerm, setSearchTerm] = useState('');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <Box mb={6}>
                <Typography variant="h3" fontWeight={900} mb={1}>
                    FINANCEIRO
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Dashboard completo de estatísticas, tributação e notas fiscais.
                </Typography>
            </Box>

            {/* Cards de Resumo */}
            <Grid container spacing={3} mb={6}>
                <Grid size={{xs:12, md:4}}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'primary.main', color: 'white' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Receita Total</Typography>
                                <TrendingUp />
                            </Box>
                            <Typography variant="h4" fontWeight={800}>
                                {formatPrice(data?.totalRevenue || 0)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs:12, md:4}}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" color="text.secondary">Receita Pendente</Typography>
                                <AccountBalanceWallet color="warning" />
                            </Box>
                            <Typography variant="h4" fontWeight={800}>
                                {formatPrice(data?.pendingRevenue || 0)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs:12, md:4}}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" color="text.secondary">Total de Pedidos</Typography>
                                <Receipt color="info" />
                            </Box>
                            <Typography variant="h4" fontWeight={800}>
                                {data?.orderCount || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {/* Gráfico de Vendas */}
                <Grid size={{xs:12, lg:8}}>
                    <Paper sx={{ p: 4, borderRadius: 4, height: 400 }}>
                        <Typography variant="h6" fontWeight={700} mb={4}>Evolução de Vendas</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(val) => `R$ ${val}`} />
                                <Tooltip formatter={(val: number | undefined) => val !== undefined ? formatPrice(val) : ''} />
                                <Area type="monotone" dataKey="value" stroke="#1976d2" fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Tributação (Webscraping Info) */}
                <Grid size={{xs:12, lg:4}}>
                    <Paper sx={{ p: 4, borderRadius: 4, height: 400 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <Info color="primary" />
                            <Typography variant="h6" fontWeight={700}>Tributação (Receita Federal)</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Stack spacing={3}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="text.secondary">ICMS</Typography>
                                <Typography fontWeight={700}>{data?.taxInfo?.icms}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="text.secondary">ISS</Typography>
                                <Typography fontWeight={700}>{data?.taxInfo?.iss}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="text.secondary">IPI</Typography>
                                <Typography fontWeight={700}>{data?.taxInfo?.ipi}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="text.secondary">Taxa SELIC</Typography>
                                <Typography fontWeight={700} color="success.main">{data?.taxInfo?.selic}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="text.secondary">Última Atualização</Typography>
                                <Typography variant="caption">{new Date(data?.taxInfo?.lastUpdate).toLocaleString('pt-BR')}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                Fonte: {data?.taxInfo?.source}
                            </Typography>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Histórico de Notas Fiscais */}
                <Grid size={{xs:12}}>
                    <Paper sx={{ p: 4, borderRadius: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h6" fontWeight={700}>Histórico de Notas Fiscais</Typography>
                            <TextField 
                                size="small"
                                placeholder="Buscar nota fiscal..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ width: 300 }}
                            />
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Número NF</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Valor</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.recentInvoices
                                        ?.filter((inv: any) => 
                                            inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((invoice: any) => (
                                            <TableRow key={invoice.orderId}>
                                                <TableCell>{invoice.invoiceNumber}</TableCell>
                                                <TableCell>{new Date(invoice.date).toLocaleDateString('pt-BR')}</TableCell>
                                                <TableCell>{formatPrice(invoice.amount)}</TableCell>
                                                <TableCell>{invoice.status}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton 
                                                        color="primary"
                                                        onClick={() => window.open(`${getBaseURL()}/finance/invoice/${invoice.orderId}`, '_blank')}
                                                    >
                                                        <Download />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    {(!data?.recentInvoices || data.recentInvoices.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">Nenhuma nota fiscal encontrada.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

function Stack({ children, spacing }: { children: React.ReactNode, spacing: number }) {
    return (
        <Box display="flex" flexDirection="column" gap={spacing}>
            {children}
        </Box>
    );
}
