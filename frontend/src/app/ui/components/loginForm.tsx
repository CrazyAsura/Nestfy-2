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
            background: (theme) => theme.palette.mode === 'light' 
                ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            py: 4
        }}>
            <Container maxWidth='xs'>
                <MotionPaper 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    elevation={10}
                    sx={{
                        p: { xs: 3, md: 6 },
                        borderRadius: 4,
                        bgcolor: 'background.paper',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography 
                        variant='h4'
                        align='center'
                        sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}
                    >
                        Bem-vindo
                    </Typography>
                    <Typography 
                        variant='body1'
                        align='center'
                        sx={{ mb: 4, color: 'text.secondary' }}
                    >
                        Faça login para continuar comprando
                    </Typography>

                    {submitError && (
                        <Box sx={{ 
                            mb: 3, 
                            p: 2, 
                            borderRadius: 2, 
                            bgcolor: 'error.main',
                            color: 'error.contrastText'
                        }}>
                            <Typography variant="body2">{submitError}</Typography>
                        </Box>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            fullWidth
                            label="E-mail"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Senha"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={isPending}
                            sx={{
                                mt: 4,
                                mb: 2,
                                py: 1.5,
                                fontSize: '1.1rem',
                                position: 'relative'
                            }}
                        >
                            {isPending ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <>
                                    Entrar
                                    <LoginIcon sx={{ ml: 1 }} />
                                </>
                            )}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Não tem uma conta?{' '}
                                <Link 
                                    href="/register" 
                                    style={{ 
                                        color: 'inherit',
                                        fontWeight: 600,
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Cadastre-se
                                </Link>
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Link 
                                    href="/reset-password" 
                                    style={{ 
                                        color: 'inherit', 
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Esqueceu a senha?
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
}
