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
                console.error('Erro detalhado na redefinição de senha:', {
                    status: error?.response?.status,
                    data: error?.response?.data,
                    message: error.message,
                    headers: error?.response?.headers
                });
                const errorMessage = error?.response?.data?.message || error.message || 'Erro ao redefinir senha';
                setSubmitError(errorMessage);
                console.error('Mensagem de erro amigável:', errorMessage);
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
            <Container maxWidth="xs">
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
                        Nova Senha
                    </Typography>
                    <Typography 
                        variant='body2'
                        align='center'
                        sx={{ color: '#666', mb: 4 }}
                    >
                        Redefina sua senha de acesso
                    </Typography>

                    <Box 
                        component='form' 
                        onSubmit={handleSubmit(onSubmit)}
                    >
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
                            label="Nova Senha"
                            fullWidth
                            autoComplete="new-password"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 3 }}
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

                        <TextField 
                            type={showPassword ? 'text' : 'password'}
                            label="Confirmar Nova Senha"
                            fullWidth
                            autoComplete="new-password"
                            {...register('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 4 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockReset color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />

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
                            variant='contained'
                            fullWidth
                            disabled={isPending}
                            endIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <LockReset />}
                            sx={{ 
                                bgcolor: '#000',
                                '&:hover': { bgcolor: '#333' },
                                fontWeight: 700,
                                py: 1.5,
                                borderRadius: 2,
                                mb: 3
                            }}
                        >
                            {isPending ? "Processando..." : "Redefinir Senha"}
                        </Button>

                        <Button
                            component={Link}
                            href="/login"
                            fullWidth
                            startIcon={<ArrowBack />}
                            sx={{ color: '#666', fontWeight: 600 }}
                        >
                            Voltar para o Login
                        </Button>
                    </Box>
                </MotionPaper>
            </Container>
        </Box>
    );
}
