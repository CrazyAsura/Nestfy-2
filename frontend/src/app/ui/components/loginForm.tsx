'use client'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, LoginFormData } from '../../libs/schema/login.schema';
import { useLogin } from '../../libs/hooks/useLogin';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Login as LoginIcon
} from '@mui/icons-material';

const MotionPaper = motion(Paper);

export default function LoginForm () {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { mutate: login, isPending } = useLogin();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = (data: LoginFormData) => {
        setSubmitError(null);
        console.log('Iniciando submissão do formulário de login:', data.email);
        login(data, {
            onSuccess: () => {
                console.log('Login bem-sucedido no frontend!');
                router.push('/');
            },
            onError: (error: any) => {
                console.error('Erro completo no login:', error);
                if (error.response) {
                    console.error('Dados do erro:', error.response.data);
                    console.error('Status do erro:', error.response.status);
                }
                const errorMessage = error?.response?.data?.message || error.message || 'Erro ao realizar login';
                setSubmitError(errorMessage);
            }
        });
    };

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
            <Container maxWidth='xs' sx={{ position: 'relative', zIndex: 1 }}>
                <MotionPaper 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 0, // Luxo costuma usar linhas retas e limpas
                        bgcolor: (theme) => theme.palette.mode === 'light' 
                            ? 'rgba(255, 255, 255, 0.8)' 
                            : 'rgba(13, 13, 13, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        boxShadow: (theme) => theme.palette.mode === 'light'
                            ? '0 20px 40px rgba(0,0,0,0.1)'
                            : '0 20px 40px rgba(0,0,0,0.4)',
                        textAlign: 'center'
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Typography 
                            variant='h4'
                            sx={{ 
                                fontFamily: 'var(--font-playfair)',
                                fontWeight: 700, 
                                mb: 1, 
                                color: 'text.primary',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase'
                            }}
                        >
                            Assinatura
                        </Typography>
                        <Box sx={{ 
                            width: '40px', 
                            height: '2px', 
                            bgcolor: 'primary.main', 
                            mx: 'auto',
                            mb: 2
                        }} />
                        <Typography 
                            variant='body2'
                            sx={{ 
                                color: 'text.secondary',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                fontSize: '0.75rem'
                            }}
                        >
                            Bem-vindo ao Exclusivo
                        </Typography>
                    </Box>

                    {submitError && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Box sx={{ 
                                mb: 3, 
                                p: 1.5, 
                                borderLeft: '3px solid',
                                borderColor: 'error.main',
                                bgcolor: 'rgba(211, 47, 47, 0.05)',
                                color: 'error.main',
                                textAlign: 'left'
                            }}>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{submitError}</Typography>
                            </Box>
                        </motion.div>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            fullWidth
                            label="E-MAIL"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            margin="normal"
                            variant="standard"
                            autoComplete="email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: 'primary.main', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ 
                                mb: 3,
                                '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' },
                                '& .MuiInput-underline:before': { borderColor: 'divider' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderColor: 'primary.main' },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="SENHA"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            margin="normal"
                            variant="standard"
                            autoComplete="current-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'primary.main', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ 
                                mb: 4,
                                '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' },
                                '& .MuiInput-underline:before': { borderColor: 'divider' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderColor: 'primary.main' },
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={isPending}
                            sx={{
                                py: 2,
                                fontSize: '0.9rem',
                                letterSpacing: '0.3em',
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: '0 10px 20px rgba(175, 148, 79, 0.2)',
                                }
                            }}
                        >
                            {isPending ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "AUTENTICAR"
                            )}
                        </Button>

                        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Link 
                                href="/reset-password" 
                                style={{ 
                                    color: 'inherit', 
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    opacity: 0.7
                                }}
                            >
                                Esqueceu sua senha?
                            </Link>
                            
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: 1,
                                mt: 1
                            }}>
                                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em' }}>OU</Typography>
                                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                            </Box>

                            <Typography variant="body2" sx={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                                Novo por aqui?{' '}
                                <Link 
                                    href="/register" 
                                    style={{ 
                                        color: '#AF944F',
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                        textTransform: 'uppercase',
                                        marginLeft: '8px'
                                    }}
                                >
                                    Criar Conta
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
}
