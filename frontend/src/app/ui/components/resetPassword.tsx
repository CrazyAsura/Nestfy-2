'use client';

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
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ResetPasswordFormData, resetPasswordSchema } from '@/app/libs/schema/resetPassword.schema';
import { useResetPassword } from '@/app/libs/hooks/useResetPassword';
import { useState } from 'react';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  LockReset,
  ArrowBack
} from '@mui/icons-material';

const MotionPaper = motion(Paper);

export default function ResetPasswordForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { mutate: resetPassword, isPending } = useResetPassword();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    const onSubmit = (data: ResetPasswordFormData) => {
        setSubmitError(null);
        console.log('Iniciando submissão do formulário de redefinição de senha:', data.email);
        resetPassword(data, {
            onSuccess: () => {
                console.log('Redefinição de senha bem-sucedida no frontend!');
                router.push('/login');
            },
            onError: (error: any) => {
                console.error('Erro completo na redefinição de senha:', error);
                if (error.response) {
                    console.error('Dados do erro:', error.response.data);
                    console.error('Status do erro:', error.response.status);
                }
                const errorMessage = error?.response?.data?.message || error.message || 'Erro ao redefinir senha';
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
            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
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
                        textAlign: 'center'
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
                        NOVA SENHA
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
                        Redefina sua senha de acesso
                    </Typography>

                    <Box 
                        component='form' 
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <TextField
                            label="E-MAIL" 
                            fullWidth
                            variant="standard"
                            autoComplete="email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={{ 
                                mb: 4,
                                '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: 'primary.main', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField 
                            type={showPassword ? 'text' : 'password'}
                            label="NOVA SENHA"
                            fullWidth
                            variant="standard"
                            autoComplete="new-password"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            sx={{ 
                                mb: 4,
                                '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'primary.main', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                            {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField 
                            type={showPassword ? 'text' : 'password'}
                            label="CONFIRMAR NOVA SENHA"
                            fullWidth
                            variant="standard"
                            autoComplete="new-password"
                            {...register('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            sx={{ 
                                mb: 6,
                                '& .MuiInputLabel-root': { letterSpacing: '0.1em', fontSize: '0.75rem' }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockReset sx={{ color: 'primary.main', fontSize: 20 }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        {submitError && (
                            <Typography 
                                color="error" 
                                variant="body2" 
                                align="center" 
                                sx={{ mb: 4, fontWeight: 600, letterSpacing: '0.02em' }}
                            >
                                {submitError}
                            </Typography>
                        )}

                        <Button
                            type='submit'
                            variant='contained'
                            fullWidth
                            disabled={isPending}
                            endIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <LockReset />}
                            sx={{ 
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': { bgcolor: 'primary.dark' },
                                fontWeight: 700,
                                py: 2,
                                borderRadius: 0,
                                mb: 4,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                boxShadow: '0 10px 20px rgba(175, 148, 79, 0.2)'
                            }}
                        >
                            {isPending ? "Processando..." : "Redefinir Senha"}
                        </Button>

                        <Button
                            component={Link}
                            href="/login"
                            fullWidth
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
                            Voltar para o Login
                        </Button>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
}
