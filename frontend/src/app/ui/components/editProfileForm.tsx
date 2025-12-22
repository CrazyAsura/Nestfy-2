'use client';

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    MenuItem,
    Autocomplete,
    InputAdornment,
    Divider,
    CircularProgress,
    Grid,
    IconButton,
    Avatar,
    Tooltip,
    Tab,
    Tabs,
    Fade,
    Alert,
    Stack,
    Card,
    CardContent,
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditProfileFormData, editProfileSchema } from '../../libs/schema/editProfile.schema';
import { useUpdateProfile } from '../../libs/hooks/useUpdateProfile';
import { useRouter } from 'next/navigation';
import { maskCEP, maskPhone, maskCPF, maskCNPJ } from '../../libs/utils/function/masks';
import { fetchAddressByCEP } from '../../libs/api/services/cep.service';
import { useEffect, useState, useRef, useMemo } from 'react';
import { fetchCitiesByState, fetchStates, IBGECity, IBGEUF, fetchCountries } from '../../libs/api/services/ibge.service';
import { 
    ArrowBack, 
    Save, 
    Person, 
    LocationOn, 
    Phone as PhoneIcon, 
    PhotoCamera, 
    Email, 
    Badge, 
    Work,
    ContactPhone,
    Home,
    AccountCircle,
    PhoneInTalk
} from '@mui/icons-material';
import { Profile } from '../../libs/types/profile';
import { motion, AnimatePresence } from 'framer-motion';
import { DDD } from '../../libs/types/enums';

type Props = {
    profile: Profile;
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
            style={{ display: value === index ? 'block' : 'none' }}
        >
            <Box sx={{ py: 4 }}>
                {children}
            </Box>
        </div>
    );
}

export default function EditProfileForm({ profile }: Props) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [states, setStates] = useState<IBGEUF[]>([]);
    const [cities, setCities] = useState<IBGECity[]>([]);
    const [countries, setCountries] = useState<{ name: string, ddi: string, flag: string, code: string }[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(profile.image || null);
    const [activeTab, setActiveTab] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const formatDocument = (doc: string, type: string) => {
        if (!doc) return '';
        const cleanDoc = doc.replace(/\D/g, '');
        return type === 'LEGAL_ENTITY' ? maskCNPJ(cleanDoc) : maskCPF(cleanDoc);
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        trigger,
        reset,
        setError,
        formState: { errors, isDirty }
    } = useForm<EditProfileFormData>({
        resolver: zodResolver(editProfileSchema),
        mode: 'onBlur',
        defaultValues: {
            name: profile.name || '',
            email: profile.email || '',
            userType: profile.userType || 'INDIVIDUAL',
            document: formatDocument(profile.document || '', profile.userType || 'INDIVIDUAL'),
            ddi: profile.ddi ? (profile.ddi.includes('_') ? profile.ddi.split('_')[1] : profile.ddi) : '55',
            ddd: profile.ddd ? (profile.ddd.includes('_') ? profile.ddd.split('_')[1] : profile.ddd) : '',
            numberPhone: profile.numberPhone || '',
            zipCode: profile.zipCode || '',
            number: profile.number || '',
            street: profile.street || '',
            neighborhood: profile.neighborhood || '',
            city: profile.city || '',
            state: profile.state || '',
            country: profile.country || 'Brasil',
            image: profile.image || '',
        }
    });

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Criar URL de preview para visualização imediata
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            
            // Salvar o arquivo original no formulário em vez de Base64
            setValue('image', file, { shouldDirty: true });
        }
    };

    const selectedState = watch('state');
    const userType = watch('userType');

    useEffect(() => {
        // Limpar ou formatar o documento quando o tipo de usuário mudar
        const currentDoc = watch('document');
        if (currentDoc) {
            const cleanDoc = currentDoc.replace(/\D/g, '');
            const newMasked = userType === 'LEGAL_ENTITY' ? maskCNPJ(cleanDoc) : maskCPF(cleanDoc);
            setValue('document', newMasked, { shouldValidate: true });
        }
    }, [userType, setValue, watch]);

    useEffect(() => {
        const loadInitialData = async () => {
            const [statesData, countriesData] = await Promise.all([
                fetchStates(),
                fetchCountries()
            ]);
            setStates(statesData);
            setCountries(countriesData);
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const loadCities = async () => {
            if (selectedState) {
                setLoadingCities(true);
                const stateUF = selectedState.length === 2 
                    ? selectedState 
                    : states.find(s => s.nome === selectedState)?.sigla;
                
                if (stateUF) {
                    const data = await fetchCitiesByState(stateUF);
                    setCities(data);
                }
                setLoadingCities(false);
            }
        };
        loadCities();
    }, [selectedState, states]);

    // Mapeamento de erros comuns do backend para mensagens amigáveis
    const backendErrorMap: Record<string, { field: keyof EditProfileFormData, message: string }> = {
        'email_already_exists': { field: 'email', message: 'Este e-mail já está em uso por outra conta. Tente outro ou recupere sua senha.' },
        'document_already_exists': { field: 'document', message: 'Este CPF/CNPJ já está cadastrado em nosso sistema.' },
        'invalid_zip_code': { field: 'zipCode', message: 'O CEP informado parece ser inválido ou não foi encontrado.' },
        'phone_format_invalid': { field: 'numberPhone', message: 'O formato do telefone não é válido para o país selecionado.' },
    };

    const handleCEPBlur = async (cep: string) => {
        const cleanCEP = cep.replace(/\D/g, '');
        if (cleanCEP.length !== 8) return;

        try {
            const address = await fetchAddressByCEP(cleanCEP);
            if (address && !address.erro) {
                setValue('street', address.logradouro, { shouldDirty: true });
                setValue('neighborhood', address.bairro, { shouldDirty: true });
                setValue('city', address.localidade, { shouldDirty: true });
                setValue('state', address.uf, { shouldDirty: true });
                setValue('ddd', address.ddd, { shouldDirty: true });
                trigger(['street', 'neighborhood', 'city', 'state', 'ddd']);
                setSubmitError(null);
            } else {
                setSubmitError('Não conseguimos localizar o endereço para este CEP. Por favor, preencha manualmente.');
                setError('zipCode', { 
                    type: 'manual', 
                    message: 'CEP não encontrado. Verifique se o número está correto.' 
                });
            }
        } catch (error) {
            setSubmitError('Ocorreu um erro ao buscar o CEP. Tente preencher os campos de endereço manualmente.');
        }
    };

    const onSubmit: SubmitHandler<EditProfileFormData> = (data) => {
        setSubmitError(null);
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('userType', data.userType);
        formData.append('document', (data.document || '').replace(/\D/g, ''));
        formData.append('ddi', (data.ddi || '').replace(/\+/g, ''));
        formData.append('ddd', (data.ddd || '').replace(/\D/g, ''));
        formData.append('numberPhone', (data.numberPhone || '').replace(/\D/g, ''));
        formData.append('zipCode', (data.zipCode || '').replace(/\D/g, ''));
        formData.append('number', data.number || '');
        formData.append('street', data.street || '');
        formData.append('neighborhood', data.neighborhood || '');
        formData.append('city', data.city || '');
        formData.append('state', data.state || '');
        formData.append('country', data.country || '');

        if (data.image instanceof File) {
            formData.append('image', data.image);
        }

        updateProfile(formData, {
            onSuccess: () => {
                reset(data);
                router.push('/profile');
            },
            onError: (error: any) => {
                 const errorData = error?.response?.data;
                 const errorCode = errorData?.code;
                 const backendMessage = errorData?.message;
 
                 if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                     setSubmitError('Não foi possível conectar ao servidor. O serviço pode estar temporariamente fora do ar ou você pode estar sem internet. Tente novamente em alguns instantes.');
                 } else if (errorCode && backendErrorMap[errorCode]) {
                     const { field, message } = backendErrorMap[errorCode];
                     setError(field, { type: 'manual', message });
                     setSubmitError(`Problema no campo ${field}: ${message}`);
                 } else if (backendMessage) {
                     setSubmitError(backendMessage);
                 } else {
                     setSubmitError('Não foi possível salvar as alterações devido a um erro inesperado. Se o problema persistir, entre em contato com o suporte.');
                 }
                 
                 // Scroll para o topo para mostrar o erro
                 window.scrollTo({ top: 0, behavior: 'smooth' });
             }
        });
    };

    const tabsContent = [
        { label: 'Perfil', icon: <AccountCircle /> },
        { label: 'Contato', icon: <ContactPhone /> },
        { label: 'Endereço', icon: <Home /> },
    ];

    return (
        <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}
        >
            {/* Header Sticky */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 2, 
                    mb: 4, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'sticky',
                    top: 80,
                    zIndex: 10,
                    backdropFilter: 'blur(8px)',
                    bgcolor: 'rgba(255, 255, 255, 0.8)'
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={() => router.back()} sx={{ bgcolor: 'action.hover' }}>
                        <ArrowBack />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" fontWeight={800} color="primary.main">
                            Editar Perfil
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Mantenha seus dados atualizados para uma melhor experiência
                        </Typography>
                    </Box>
                </Stack>

                <Button 
                    type="submit"
                    form="edit-profile-form"
                    variant="contained" 
                    color="primary" 
                    disabled={isPending || !isDirty}
                    startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    sx={{ 
                        borderRadius: 2, 
                        px: 4, 
                        py: 1, 
                        boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                        '&:hover': {
                            boxShadow: '0 6px 20px rgba(0,118,255,0.23)',
                        }
                    }}
                >
                    Salvar Alterações
                </Button>
            </Paper>

            <AnimatePresence mode="wait">
                {submitError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 3, 
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'error.light',
                                '& .MuiAlert-message': {
                                    width: '100%'
                                }
                            }}
                            onClose={() => setSubmitError(null)}
                        >
                            <Typography variant="subtitle2" fontWeight={700}>
                                Ops! Encontramos um problema:
                            </Typography>
                            <Typography variant="body2">
                                {submitError}
                            </Typography>
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                                Dica: Verifique se todos os campos obrigatórios estão preenchidos corretamente.
                            </Typography>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            <Grid container spacing={4}>
                {/* Lado Esquerdo: Preview e Navegação */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={3}>
                        <Card sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }} elevation={0}>
                            <Box sx={{ height: 100, bgcolor: 'primary.main', opacity: 0.1 }} />
                            <CardContent sx={{ textAlign: 'center', mt: -8 }}>
                                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                                    <Avatar
                                        src={imagePreview || ''}
                                        sx={{ 
                                            width: 120, 
                                            height: 120, 
                                            mx: 'auto', 
                                            boxShadow: '0 0 0 4px #fff',
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        {!imagePreview && <Person sx={{ fontSize: 60 }} />}
                                    </Avatar>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                    />
                                    <Tooltip title="Alterar foto">
                                        <IconButton
                                            onClick={() => fileInputRef.current?.click()}
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                bgcolor: 'background.paper',
                                                color: 'primary.main',
                                                '&:hover': { bgcolor: 'action.hover' },
                                                boxShadow: 2,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                            size="small"
                                        >
                                            <PhotoCamera fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Typography variant="h6" fontWeight={800}>{watch('name') || 'Seu Nome'}</Typography>
                                <Typography variant="body2" color="text.secondary">{watch('email')}</Typography>
                                
                                <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2, textAlign: 'left' }}>
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Work sx={{ fontSize: 18, color: 'primary.main' }} />
                                            <Typography variant="body2" fontWeight={500}>
                                                {watch('userType') === 'INDIVIDUAL' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Badge sx={{ fontSize: 18, color: 'primary.main' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDocument(watch('document') || '', watch('userType') || 'INDIVIDUAL')}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>

                        <Paper sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
                            <Tabs
                                orientation="vertical"
                                value={activeTab}
                                onChange={handleTabChange}
                                sx={{
                                    borderRight: 0,
                                    '& .MuiTabs-indicator': { left: 0, width: 4, borderRadius: '0 4px 4px 0' },
                                    '& .MuiTab-root': {
                                        alignItems: 'flex-start',
                                        textAlign: 'left',
                                        py: 2,
                                        px: 3,
                                        minHeight: 64,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        '&.Mui-selected': { color: 'primary.main', bgcolor: 'primary.lighter' }
                                    }
                                }}
                            >
                                {tabsContent.map((tab, idx) => (
                                    <Tab 
                                        key={idx} 
                                        icon={tab.icon} 
                                        iconPosition="start" 
                                        label={tab.label} 
                                        id={`profile-tab-${idx}`}
                                    />
                                ))}
                            </Tabs>
                        </Paper>
                    </Stack>
                </Grid>

                {/* Lado Direito: Formulário */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', minHeight: 500 }} elevation={0}>
                        <form 
                            id="edit-profile-form" 
                            onSubmit={handleSubmit(onSubmit, (errors) => {
                                console.error('Form validation errors:', errors);
                            })}
                        >
                            <CustomTabPanel value={activeTab} index={0}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Informações Básicas</Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Nome Completo"
                                            fullWidth
                                            {...register('name')}
                                            error={!!errors.name}
                                            helperText={errors.name?.message || "Insira seu nome como consta em seus documentos"}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="E-mail"
                                            fullWidth
                                            {...register('email')}
                                            error={!!errors.email}
                                            helperText={errors.email?.message || "Este e-mail será usado para comunicações e acesso"}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="userType"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    label="Tipo de Conta"
                                                    fullWidth
                                                    error={!!errors.userType}
                                                    helperText={errors.userType?.message}
                                                >
                                                    <MenuItem value='INDIVIDUAL'>Pessoa Física</MenuItem>
                                                    <MenuItem value='LEGAL_ENTITY'>Pessoa Jurídica</MenuItem>
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="document"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label={watch('userType') === 'LEGAL_ENTITY' ? 'CNPJ' : 'CPF'}
                                                    fullWidth
                                                    error={!!errors.document}
                                                    helperText={errors.document?.message || "O documento é usado para identificação"}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const masked = watch('userType') === 'LEGAL_ENTITY' ? maskCNPJ(val) : maskCPF(val);
                                                        field.onChange(masked);
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Badge fontSize="small" color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CustomTabPanel>

                            <CustomTabPanel value={activeTab} index={1}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Dados de Contato</Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller
                                            name="ddi"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    label="DDI"
                                                    fullWidth
                                                    error={!!errors.ddi}
                                                    helperText={errors.ddi?.message}
                                                >
                                                    {countries.map((c) => (
                                                        <MenuItem key={c.code} value={c.ddi}>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Box component="img" src={c.flag} sx={{ width: 20, height: 14, borderRadius: 0.5 }} />
                                                                <Typography variant="body2">+{c.ddi}</Typography>
                                                            </Stack>
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 3 }}>
                                        <Controller
                                            name="ddd"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    label="DDD"
                                                    fullWidth
                                                    error={!!errors.ddd}
                                                    helperText={errors.ddd?.message}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        field.onChange(val);
                                                    }}
                                                >
                                                    {Object.entries(DDD).map(([key, value]) => (
                                                        <MenuItem key={key} value={value.replace('DDD_', '')}>
                                                            {value.replace('DDD_', '')}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 5 }}>
                                        <Controller
                                            name="numberPhone"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Telefone"
                                                    fullWidth
                                                    error={!!errors.numberPhone}
                                                    helperText={errors.numberPhone?.message}
                                                    onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PhoneIcon fontSize="small" color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CustomTabPanel>

                            <CustomTabPanel value={activeTab} index={2}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Endereço Residencial</Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 5 }}>
                                        <Controller
                                            name="zipCode"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="CEP"
                                                    fullWidth
                                                    error={!!errors.zipCode}
                                                    helperText={errors.zipCode?.message || "Ao preencher o CEP, buscaremos seu endereço automaticamente"}
                                                    onChange={(e) => field.onChange(maskCEP(e.target.value))}
                                                    onBlur={(e) => {
                                                        field.onBlur();
                                                        handleCEPBlur(e.target.value);
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn fontSize="small" color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 7 }}>
                                        <TextField
                                            label="Rua"
                                            fullWidth
                                            {...register('street')}
                                            error={!!errors.street}
                                            helperText={errors.street?.message}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            label="Número"
                                            fullWidth
                                            {...register('number')}
                                            error={!!errors.number}
                                            helperText={errors.number?.message}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <TextField
                                            label="Bairro"
                                            fullWidth
                                            {...register('neighborhood')}
                                            error={!!errors.neighborhood}
                                            helperText={errors.neighborhood?.message}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="city"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    options={cities}
                                                    getOptionLabel={(option) => typeof option === 'string' ? option : option.nome}
                                                    loading={loadingCities}
                                                    freeSolo
                                                    onChange={(_, newValue) => {
                                                        const value = typeof newValue === 'string' ? newValue : (newValue?.nome || '');
                                                        field.onChange(value);
                                                    }}
                                                    onInputChange={(_, newInputValue) => field.onChange(newInputValue)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Cidade"
                                                            error={!!errors.city}
                                                            helperText={errors.city?.message}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="state"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    label="Estado"
                                                    fullWidth
                                                    error={!!errors.state}
                                                    helperText={errors.state?.message}
                                                >
                                                    {states.map((s) => (
                                                        <MenuItem key={s.sigla} value={s.sigla}>
                                                            {s.nome}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="País"
                                            fullWidth
                                            {...register('country')}
                                            error={!!errors.country}
                                            helperText={errors.country?.message}
                                        />
                                    </Grid>
                                </Grid>
                            </CustomTabPanel>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
