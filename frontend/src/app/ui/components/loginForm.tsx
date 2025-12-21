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
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
                        Bem-vindo
                    </Typography>
                    <Typography 
                        variant='body1'
                        align='center'
                        sx={{ color: '#666', mb: 4 }}
                    >
                        Acesse sua conta para continuar
                    </Typography>

                    <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label="E-mail" 
                            fullWidth
                            autoComplete="email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField 
                            type={showPassword ? 'text' : 'password'}
                            label="Senha"
                            fullWidth
                            autoComplete="current-password"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <Link 
                                href="/reset-password"
                                style={{ 
                                    color: '#666', 
                                    fontSize: '0.875rem',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Esqueceu a senha?
                            </Link>
                        </Box>

                        {submitError && (
                            <Typography 
                                color="error" 
                                variant="body2" 
                                align="center" 
                                sx={{ mb: 2, fontWeight: 600 }}
                            >
                                {submitError}
                            </Typography>
                        )}

                        <Button
                            type='submit'
                            variant="contained"
                            fullWidth
                            disabled={isPending}
                            endIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                            sx={{ 
                                bgcolor: '#000',
                                '&:hover': { bgcolor: '#333' },
                                fontWeight: 700,
                                py: 1.5,
                                borderRadius: 2,
                                mb: 4
                            }}
                        >
                            {isPending ? "Entrando..." : "Entrar"}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                Não tem uma conta? 
                                <Link 
                                    href="/register"
                                    style={{ 
                                        color: '#000', 
                                        fontWeight: 800, 
                                        marginLeft: '8px',
                                        textDecoration: 'none',
                                        borderBottom: '2px solid #000'
                                    }}
                                >
                                    CADASTRE-SE
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    )
}
