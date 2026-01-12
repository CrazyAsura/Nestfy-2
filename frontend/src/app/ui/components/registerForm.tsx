'use client';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, registerSchema } from '../../libs/schema/register.schema';
import { useRegister } from '../../libs/hooks/useRegister';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { maskCEP, maskCNPJ, maskCPF, maskPhone } from '../../libs/utils/function/masks';
import { fetchAddressByCEP } from '../../libs/api/services/cep.service';
import { useEffect, useState } from 'react';
import { fetchCitiesByState, fetchStates, IBGECity, IBGEUF, fetchCountries, BRAZIL_DDDS } from '../../libs/api/services/ibge.service';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Lock, 
  LocationOn, 
  Phone as PhoneIcon,
  ArrowBack,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material';

const steps = ['Identificação', 'Segurança', 'Endereço & Contato'];

const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
};

const MotionPaper = motion(Paper);

export default function RegisterForm () {
    const router = useRouter();

    const [activeStep, setActiveStep] = useState(0);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [states, setStates] = useState<IBGEUF[]>([]);
    const [cities, setCities] = useState<IBGECity[]>([]);
    const [countries, setCountries] = useState<{name: string, ddi: string, flag: string}[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    const { mutate: registerUser, isPending } = useRegister();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        trigger,
        formState: {
            errors,
            isValid
        }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
        defaultValues: {
            userType: 'INDIVIDUAL',
            ddi: '55',
            country: 'Brasil',
            name: '',
            email: '',
            document: '',
            password: '',
            confirmPassword: '',
            zipCode: '',
            number: '',
            street: '',
            neighborhood: '',
            city: '',
            state: '',
            ddd: '',
            numberPhone: '',
        }
    });

    const userType = watch('userType');
    const selectedState = watch('state');

    // Carregar estados e países ao montar o componente
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

    // Carregar cidades quando o estado mudar
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
            } else {
                setCities([]);
            }
        };
        loadCities();
    }, [selectedState, states]);

    const handleCEPBlur = async (cep: string) => {
        const address = await fetchAddressByCEP(cep);
        if (address) {
            setValue('street', address.logradouro);
            setValue('neighborhood', address.bairro);
            setValue('city', address.localidade);
            setValue('state', address.uf);
            setValue('ddd', address.ddd);
            trigger(['street', 'neighborhood', 'city', 'state', 'ddd']);
        }
    };

    const handleNext = async () => {
        let fieldsToValidate: (keyof RegisterFormData)[] = [];
        
        if (activeStep === 0) {
            fieldsToValidate = ['name', 'email', 'userType', 'document'];
        } else if (activeStep === 1) {
            fieldsToValidate = ['password', 'confirmPassword'];
        }

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const onSubmit = (data: RegisterFormData) => {
        setSubmitError(null);
        console.log('Dados enviados para registro:', {
            ...data,
            password: '[REDACTED]',
            confirmPassword: '[REDACTED]'
        });
        registerUser(data, {
            onSuccess: () => {
                console.log('Registro bem-sucedido no frontend!');
                router.push('/login');
            },
            onError: (error: any) => {
                console.error('Erro completo no registro:', error);
                if (error.response) {
                    console.error('Dados do erro:', error.response.data);
                    console.error('Status do erro:', error.response.status);
                }
                const errorMessage = error?.response?.data?.message || error.message || 'Erro ao realizar registro';
                setSubmitError(errorMessage);
            }
        })
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 4
        }}>
            <Container maxWidth='md'>
                <MotionPaper 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    elevation={10}
                    sx={{
                        p: { xs: 3, md: 6 },
                        borderRadius: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                >
                    <Typography 
                        variant='h4'
                        align='center'
                        sx={{ fontWeight: 900, mb: 1, color: '#1a1a1a' }}
                    >
                        Criar Conta
                    </Typography>
                    <Typography 
                        variant='body1'
                        align='center'
                        sx={{ color: '#666', mb: 4 }}
                    >
                        Junte-se à nossa comunidade exclusiva
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ mb: 6, display: { xs: 'none', sm: 'flex' } }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                        <AnimatePresence mode="wait">
                            {activeStep === 0 && (
                                <motion.div
                                    key="step1"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                >
                                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Person color="primary" />
                                        <Typography variant="h6" fontWeight={700}>Identificação</Typography>
                                    </Box>
                                    
                                    <TextField 
                                        label="Nome Completo"
                                        fullWidth
                                        autoComplete="name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        {...register('name')}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField 
                                        label="E-mail Profissional"
                                        fullWidth
                                        autoComplete="email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        {...register('email')}
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <TextField 
                                            select
                                            label="Tipo de Conta"
                                            sx={{ flex: 1 }}
                                            {...register('userType')}
                                        >
                                            <MenuItem value='INDIVIDUAL'>Pessoa Física</MenuItem>
                                            <MenuItem value='LEGAL_ENTITY'>Pessoa Jurídica</MenuItem>
                                        </TextField>

                                        <Controller
                                            name="document"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField 
                                                    {...field}
                                                    label={userType === 'LEGAL_ENTITY' ? "CNPJ" : "CPF"}
                                                    sx={{ flex: 2 }}
                                                    error={!!errors.document}
                                                    helperText={errors.document?.message} 
                                                    onChange={(e) => {
                                                        const maskedValue = userType === 'LEGAL_ENTITY' 
                                                            ? maskCNPJ(e.target.value) 
                                                            : maskCPF(e.target.value);
                                                        field.onChange(maskedValue);
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </motion.div>
                            )}

                            {activeStep === 1 && (
                                <motion.div
                                    key="step2"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                >
                                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Lock color="primary" />
                                        <Typography variant="h6" fontWeight={700}>Segurança</Typography>
                                    </Box>

                                    <TextField 
                                        type={showPassword ? 'text' : 'password'}
                                        label="Crie sua Senha"
                                        fullWidth
                                        autoComplete="new-password"
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        {...register('password')}
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <TextField 
                                        type={showPassword ? 'text' : 'password'}
                                        label="Confirme sua Senha"
                                        fullWidth
                                        autoComplete="new-password"
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                        {...register('confirmPassword')}
                                    />
                                </motion.div>
                            )}

                            {activeStep === 2 && (
                                <motion.div
                                    key="step3"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                >
                                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOn color="primary" />
                                        <Typography variant="h6" fontWeight={700}>Endereço & Contato</Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Controller
                                            name="zipCode"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField 
                                                    {...field}
                                                    label="CEP"
                                                    sx={{ flex: 1 }}
                                                    autoComplete="postal-code"
                                                    error={!!errors.zipCode}
                                                    helperText={errors.zipCode?.message} 
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={(e) => field.onChange(maskCEP(e.target.value))}
                                                    onBlur={(e) => {
                                                        field.onBlur();
                                                        handleCEPBlur(e.target.value);
                                                    }}
                                                />
                                            )}
                                        />
                                        <TextField 
                                            label="Número"
                                            sx={{ flex: 1 }}
                                            autoComplete="address-line2"
                                            error={!!errors.number}
                                            helperText={errors.number?.message} 
                                            InputLabelProps={{ shrink: true }}
                                            {...register('number')}
                                        />
                                    </Box>

                                    <TextField 
                                        label="Rua / Logradouro"
                                        fullWidth
                                        autoComplete="address-line1"
                                        error={!!errors.street}
                                        helperText={errors.street?.message}
                                        InputLabelProps={{ shrink: true }}
                                        {...register('street')}
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <TextField 
                                            label="Bairro"
                                            sx={{ flex: 1 }}
                                            error={!!errors.neighborhood}
                                            helperText={errors.neighborhood?.message} 
                                            InputLabelProps={{ shrink: true }}
                                            {...register('neighborhood')}
                                        />
                                        <Controller
                                            name="city"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    options={cities.map(city => city.nome)}
                                                    loading={loadingCities}
                                                    freeSolo
                                                    sx={{ flex: 1 }}
                                                    onChange={(_, newValue) => field.onChange(newValue)}
                                                    onInputChange={(_, newInputValue) => field.onChange(newInputValue)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Cidade"
                                                            error={!!errors.city}
                                                            helperText={errors.city?.message}
                                                            InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Controller
                                            name="state"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    options={states.map(state => state.sigla)}
                                                    getOptionLabel={(option) => {
                                                        const state = states.find(s => s.sigla === option || s.nome === option);
                                                        return state ? `${state.sigla} - ${state.nome}` : option;
                                                    }}
                                                    sx={{ flex: 1 }}
                                                    freeSolo
                                                    onChange={(_, newValue) => field.onChange(newValue)}
                                                    onInputChange={(_, newInputValue) => field.onChange(newInputValue)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Estado"
                                                            error={!!errors.state}
                                                            helperText={errors.state?.message}
                                                            InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        <TextField 
                                            label="País"
                                            sx={{ flex: 1 }}
                                            error={!!errors.country}
                                            helperText={errors.country?.message} 
                                            InputLabelProps={{ shrink: true }}
                                            {...register('country')}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PhoneIcon color="primary" />
                                        <Typography variant="h6" fontWeight={700}>Contato</Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Controller
                                            name="ddi"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    options={countries}
                                                    getOptionLabel={(option) => {
                                                        if (typeof option === 'string') return option;
                                                        return `${option.ddi} (${option.name})`;
                                                    }}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" {...props} key={option.name}>
                                                            <img loading="lazy" width="20" src={option.flag} alt="" style={{ marginRight: 8 }} />
                                                            {option.ddi} ({option.name})
                                                        </Box>
                                                    )}
                                                    sx={{ flex: 1 }}
                                                    freeSolo
                                                    onChange={(_, newValue) => {
                                                        const val = typeof newValue === 'string' ? newValue : newValue?.ddi;
                                                        field.onChange(val?.replace('+', ''));
                                                    }}
                                                    onInputChange={(_, newInputValue) => field.onChange(newInputValue.replace('+', ''))}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="DDI" error={!!errors.ddi} helperText={errors.ddi?.message} InputLabelProps={{ ...params.InputLabelProps, shrink: true }} />
                                                    )}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="ddd"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    options={BRAZIL_DDDS}
                                                    sx={{ flex: 1 }}
                                                    freeSolo
                                                    onChange={(_, newValue) => field.onChange(newValue)}
                                                    onInputChange={(_, newInputValue) => field.onChange(newInputValue)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="DDD" error={!!errors.ddd} helperText={errors.ddd?.message} InputLabelProps={{ ...params.InputLabelProps, shrink: true }} />
                                                    )}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="numberPhone"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField 
                                                    {...field}
                                                    label="Celular"
                                                    sx={{ flex: 3 }}
                                                    autoComplete="tel-national"
                                                    error={!!errors.numberPhone}
                                                    helperText={errors.numberPhone?.message} 
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                                />
                                            )}
                                        />
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {submitError && (
                            <Typography 
                                color="error" 
                                variant="body2" 
                                align="center" 
                                sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                            >
                                {submitError}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
                            {activeStep !== 0 && (
                                <Button
                                    type="button"
                                    onClick={handleBack}
                                    startIcon={<ArrowBack />}
                                    sx={{ color: '#666', fontWeight: 700 }}
                                >
                                    Voltar
                                </Button>
                            )}
                            
                            {activeStep < steps.length - 1 ? (
                                <Button
                                    type="button"
                                    variant="contained"
                                    onClick={handleNext}
                                    endIcon={<ArrowForward />}
                                    fullWidth={activeStep === 0}
                                    sx={{ 
                                        ml: 'auto',
                                        bgcolor: '#000',
                                        '&:hover': { bgcolor: '#333' },
                                        fontWeight: 700,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2
                                    }}
                                >
                                    Continuar
                                </Button>
                            ) : (
                                <Button
                                    type='submit'
                                    variant="contained"
                                    disabled={isPending}
                                    endIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                                    sx={{ 
                                        ml: 'auto',
                                        bgcolor: '#000',
                                        '&:hover': { bgcolor: '#333' },
                                        fontWeight: 700,
                                        px: 6,
                                        py: 1.5,
                                        borderRadius: 2
                                    }}
                                >
                                    {isPending ? "Finalizando..." : "Concluir Cadastro"}
                                </Button>
                            )}
                        </Box>

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                Já faz parte da nossa loja? 
                                <Link 
                                    href="/login"
                                    style={{ 
                                        color: '#000', 
                                        fontWeight: 800, 
                                        marginLeft: '8px',
                                        textDecoration: 'none',
                                        borderBottom: '2px solid #000'
                                    }}
                                >
                                    ENTRAR AGORA
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    )
}