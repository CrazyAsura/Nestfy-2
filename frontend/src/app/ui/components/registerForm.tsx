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
  CheckCircle,
  Policy
} from '@mui/icons-material';
import { FormControlLabel, Checkbox } from '@mui/material';

const steps = ['Identificação', 'Segurança', 'Endereço & Contato', 'Privacidade'];

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
            privacyPolicy: false,
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
        } else if (activeStep === 2) {
            fieldsToValidate = ['zipCode', 'number', 'street', 'neighborhood', 'city', 'state', 'ddd', 'numberPhone'];
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
            confirmPassword: '[REDACTED]',
            privacyPolicy: '[CHECKED]'
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
            justifyContent: 'center',
            background: (theme) => theme.palette.mode === 'light' 
                ? 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f0f0f0 100%)'
                : 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%)',
            position: 'relative',
            overflow: 'hidden',
            py: 8,
            '&::before': {
                content: '""',
                position: 'absolute',
                width: '150%',
                height: '150%',
                background: (theme) => theme.palette.mode === 'light'
                    ? 'url("https://www.transparenttextures.com/patterns/cubes.png")'
                    : 'url("https://www.transparenttextures.com/patterns/dark-matter.png")',
                opacity: 0.03,
                animation: 'pulse 20s infinite alternate',
            },
            '@keyframes pulse': {
                '0%': { transform: 'scale(1) rotate(0deg)' },
                '100%': { transform: 'scale(1.1) rotate(3deg)' }
            }
        }}>
            <Container maxWidth='md' sx={{ position: 'relative', zIndex: 1 }}>
                <MotionPaper 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 8 },
                        borderRadius: 0,
                        bgcolor: (theme) => theme.palette.mode === 'light' 
                            ? 'rgba(255, 255, 255, 0.8)' 
                            : 'rgba(13, 13, 13, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        boxShadow: (theme) => theme.palette.mode === 'light'
                            ? '0 20px 40px rgba(0,0,0,0.1)'
                            : '0 20px 40px rgba(0,0,0,0.4)',
                    }}
                >
                    <Typography 
                        variant='h3'
                        align='center'
                        sx={{ 
                            fontFamily: 'var(--font-playfair)',
                            fontWeight: 700, 
                            mb: 1, 
                            color: 'text.primary',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        CRIAR CONTA
                    </Typography>
                    <Typography 
                        variant='body2'
                        align='center'
                        sx={{ 
                            color: 'text.secondary', 
                            mb: 6,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            fontSize: '0.75rem'
                        }}
                    >
                        Junte-se à nossa comunidade exclusiva
                    </Typography>

                    <Stepper 
                        activeStep={activeStep} 
                        sx={{ 
                            mb: 8, 
                            display: { xs: 'none', sm: 'flex' },
                            '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' },
                            '& .MuiStepIcon-root.Mui-completed': { color: 'primary.main' },
                            '& .MuiStepLabel-label': { 
                                fontFamily: 'var(--font-playfair)',
                                fontSize: '0.7rem',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase'
                            }
                        }}
                    >
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
                                    transition={{ duration: 0.5 }}
                                >
                                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                        <Person sx={{ color: 'primary.main', fontSize: 24 }} />
                                        <Typography variant="h6" sx={{ 
                                            fontFamily: 'var(--font-playfair)',
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase'
                                        }}>
                                            Identificação
                                        </Typography>
                                    </Box>
                                    
                                    <TextField 
                                        label="NOME COMPLETO"
                                        fullWidth
                                        variant="standard"
                                        autoComplete="name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        {...register('name')}
                                        sx={{ 
                                            mb: 4,
                                            '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                        }}
                                    />
                                    <TextField 
                                        label="E-MAIL PROFISSIONAL"
                                        fullWidth
                                        variant="standard"
                                        autoComplete="email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        {...register('email')}
                                        sx={{ 
                                            mb: 4,
                                            '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                        }}
                                    />
                                    
                                    <Box sx={{ display: 'flex', gap: 4, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <TextField 
                                            select
                                            label="TIPO DE CONTA"
                                            variant="standard"
                                            sx={{ 
                                                flex: 1,
                                                '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                            }}
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
                                                    variant="standard"
                                                    label={userType === 'LEGAL_ENTITY' ? "CNPJ" : "CPF"}
                                                    sx={{ 
                                                        flex: 2,
                                                        '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                                    }}
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
                                    transition={{ duration: 0.5 }}
                                >
                                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                        <Lock sx={{ color: 'primary.main', fontSize: 24 }} />
                                        <Typography variant="h6" sx={{ 
                                            fontFamily: 'var(--font-playfair)',
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase'
                                        }}>
                                            Segurança
                                        </Typography>
                                    </Box>

                                    <TextField 
                                        type={showPassword ? 'text' : 'password'}
                                        label="CRIE SUA SENHA"
                                        fullWidth
                                        variant="standard"
                                        autoComplete="new-password"
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        {...register('password')}
                                        sx={{ 
                                            mb: 4,
                                            '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                                                        {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <TextField 
                                        type={showPassword ? 'text' : 'password'}
                                        label="CONFIRME SUA SENHA"
                                        fullWidth
                                        variant="standard"
                                        autoComplete="new-password"
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                        {...register('confirmPassword')}
                                        sx={{ 
                                            mb: 2,
                                            '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                        }}
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
                                    transition={{ duration: 0.5 }}
                                >
                                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                        <LocationOn sx={{ color: 'primary.main', fontSize: 24 }} />
                                        <Typography variant="h6" sx={{ 
                                            fontFamily: 'var(--font-playfair)',
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase'
                                        }}>
                                            Endereço & Contato
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 4, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Controller
                                            name="zipCode"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField 
                                                    {...field}
                                                    variant="standard"
                                                    label="CEP"
                                                    sx={{ 
                                                        flex: 1,
                                                        '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                                    }}
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
                                            label="NÚMERO"
                                            variant="standard"
                                            sx={{ 
                                                flex: 1,
                                                '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                            }}
                                            autoComplete="address-line2"
                                            error={!!errors.number}
                                            helperText={errors.number?.message} 
                                            InputLabelProps={{ shrink: true }}
                                            {...register('number')}
                                        />
                                    </Box>

                                    <TextField 
                                        label="RUA / LOGRADOURO"
                                        fullWidth
                                        variant="standard"
                                        autoComplete="address-line1"
                                        error={!!errors.street}
                                        helperText={errors.street?.message}
                                        InputLabelProps={{ shrink: true }}
                                        {...register('street')}
                                        sx={{ 
                                            mb: 4,
                                            '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                        }}
                                    />
                                    
                                    <Box sx={{ display: 'flex', gap: 4, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <TextField 
                                            label="BAIRRO"
                                            variant="standard"
                                            sx={{ 
                                                flex: 1,
                                                '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                            }}
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
                                                            variant="standard"
                                                            label="CIDADE"
                                                            error={!!errors.city}
                                                            helperText={errors.city?.message}
                                                            InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
                                                            sx={{ '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' } }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 4, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
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
                                                            variant="standard"
                                                            label="ESTADO"
                                                            error={!!errors.state}
                                                            helperText={errors.state?.message}
                                                            InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
                                                            sx={{ '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' } }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        <TextField 
                                            label="PAÍS"
                                            variant="standard"
                                            sx={{ 
                                                flex: 1,
                                                '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                            }}
                                            error={!!errors.country}
                                            helperText={errors.country?.message} 
                                            InputLabelProps={{ shrink: true }}
                                            {...register('country')}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 6, borderColor: 'divider' }} />

                                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                        <PhoneIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                                        <Typography variant="h6" sx={{ 
                                            fontFamily: 'var(--font-playfair)',
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase'
                                        }}>
                                            Contato
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
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
                                                        <TextField 
                                                            {...params} 
                                                            variant="standard"
                                                            label="DDI" 
                                                            error={!!errors.ddi} 
                                                            helperText={errors.ddi?.message} 
                                                            InputLabelProps={{ ...params.InputLabelProps, shrink: true }} 
                                                            sx={{ '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' } }}
                                                        />
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
                                                    variant="standard"
                                                    label="CELULAR"
                                                    sx={{ 
                                                        flex: 3,
                                                        '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                                                    }}
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

                            {activeStep === 3 && (
                                <motion.div
                                    key="step4"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.5 }}
                                >
                                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                                        <Policy sx={{ color: 'primary.main', fontSize: 24 }} />
                                        <Typography variant="h6" sx={{ 
                                            fontFamily: 'var(--font-playfair)',
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase'
                                        }}>
                                            Privacidade & Termos
                                        </Typography>
                                    </Box>

                                    <Paper 
                                        elevation={0}
                                        sx={{ 
                                            p: 3, 
                                            maxHeight: 250, 
                                            overflowY: 'auto', 
                                            bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            mb: 4,
                                            fontSize: '0.8rem',
                                            color: 'text.secondary',
                                            '&::-webkit-scrollbar': { width: '4px' },
                                            '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.main', borderRadius: '0px' }
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                            Política de Privacidade (LGPD)
                                        </Typography>
                                        <Typography variant="body2" paragraph sx={{ fontSize: '0.8rem', lineHeight: 1.8 }}>
                                            Ao utilizar nossos serviços, você concorda com a coleta e uso de suas informações pessoais conforme descrito nesta política. 
                                            Nós respeitamos sua privacidade e estamos comprometidos em proteger seus dados pessoais.
                                        </Typography>
                                        <Typography variant="body2" paragraph sx={{ fontSize: '0.8rem', lineHeight: 1.8 }}>
                                            <strong>1. Coleta de Dados:</strong> Coletamos dados como nome, e-mail, documento (CPF/CNPJ), endereço e telefone para fins de cadastro, 
                                            processamento de pedidos e comunicação.
                                        </Typography>
                                        <Typography variant="body2" paragraph sx={{ fontSize: '0.8rem', lineHeight: 1.8 }}>
                                            <strong>2. Uso de Dados:</strong> Seus dados são utilizados para garantir a segurança da sua conta, processar transações e 
                                            personalizar sua experiência em nossa plataforma.
                                        </Typography>
                                        <Typography variant="body2" paragraph sx={{ fontSize: '0.8rem', lineHeight: 1.8 }}>
                                            <strong>3. Segurança:</strong> Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, 
                                            perda ou alteração.
                                        </Typography>
                                        <Typography variant="body2" paragraph sx={{ fontSize: '0.8rem', lineHeight: 1.8 }}>
                                            <strong>4. Seus Direitos:</strong> Sob a LGPD, você tem o direito de acessar, corrigir ou excluir seus dados a qualquer momento através 
                                            de nossas configurações de conta ou suporte.
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.8 }}>
                                            Para mais detalhes, consulte nossa página completa de Política de Privacidade no rodapé do site.
                                        </Typography>
                                    </Paper>

                                    <Controller
                                        name="privacyPolicy"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox 
                                                        {...field} 
                                                        checked={field.value}
                                                        color="primary"
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.8rem', letterSpacing: '0.02em' }}>
                                                        Li e concordo com os termos da Política de Privacidade e LGPD.
                                                    </Typography>
                                                }
                                            />
                                        )}
                                    />
                                    {errors.privacyPolicy && (
                                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1, letterSpacing: '0.02em' }}>
                                            {errors.privacyPolicy.message}
                                        </Typography>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {submitError && (
                            <Typography 
                                color="error" 
                                variant="body2" 
                                align="center" 
                                sx={{ mt: 4, mb: 1, fontWeight: 600, letterSpacing: '0.02em' }}
                            >
                                {submitError}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8, gap: 2 }}>
                            {activeStep !== 0 && (
                                <Button
                                    type="button"
                                    onClick={handleBack}
                                    startIcon={<ArrowBack />}
                                    sx={{ 
                                        color: 'text.secondary', 
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        fontSize: '0.75rem',
                                        '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                                    }}
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
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        fontWeight: 700,
                                        px: 6,
                                        py: 2,
                                        borderRadius: 0,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        boxShadow: '0 10px 20px rgba(175, 148, 79, 0.2)'
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
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        fontWeight: 700,
                                        px: 8,
                                        py: 2,
                                        borderRadius: 0,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        boxShadow: '0 10px 20px rgba(175, 148, 79, 0.2)'
                                    }}
                                >
                                    {isPending ? "Finalizando..." : "Concluir Cadastro"}
                                </Button>
                            )}
                        </Box>

                        <Box sx={{ mt: 6, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                JÁ FAZ PARTE DA NOSSA LOJA? 
                                <Link 
                                    href="/login"
                                    style={{ 
                                        color: '#AF944F', 
                                        fontWeight: 700, 
                                        marginLeft: '12px',
                                        textDecoration: 'none',
                                        borderBottom: '1px solid #AF944F',
                                        paddingBottom: '2px'
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