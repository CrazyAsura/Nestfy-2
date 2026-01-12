'use client';

import { 
    Box, 
    Typography, 
    Paper, 
    Container, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon,
    IconButton,
    CircularProgress,
    Stack,
    Button,
    Chip
} from '@mui/material';
import { 
    Notifications as NotificationsIcon, 
    CheckCircle, 
    Info, 
    Warning, 
    Error as ErrorIcon,
    DeleteOutline,
    DoneAll
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/app/libs/hooks/useNotifications';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
    SUCCESS: <CheckCircle color="success" />,
    INFO: <Info color="info" />,
    WARNING: <Warning color="warning" />,
    ERROR: <ErrorIcon color="error" />,
};

export default function NotificationsPage() {
    const { data: notifications = [], isLoading } = useNotifications();
    const { mutate: markAsRead } = useMarkNotificationAsRead();
    const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

    if (isLoading) {
        return (
            <Container sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <NotificationsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h3" sx={{ fontWeight: 900 }}>
                        NOTIFICAÇÕES
                    </Typography>
                    {unreadCount > 0 && (
                        <Chip label={`${unreadCount} novas`} color="primary" sx={{ fontWeight: 700 }} />
                    )}
                </Box>
                {unreadCount > 0 && (
                    <Button 
                        startIcon={<DoneAll />} 
                        onClick={() => markAllAsRead()}
                        variant="outlined"
                        size="small"
                    >
                        Marcar todas como lidas
                    </Button>
                )}
            </Box>

            {notifications.length === 0 ? (
                <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" color="text.secondary">
                        Você não possui notificações no momento.
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {notifications.map((notification: Notification) => (
                        <Paper 
                            key={notification.id} 
                            elevation={0} 
                            onClick={() => !notification.isRead && markAsRead(notification.id)}
                            sx={{ 
                                p: 3, 
                                borderRadius: 3, 
                                border: '1px solid', 
                                borderColor: notification.isRead ? 'divider' : 'primary.main',
                                bgcolor: notification.isRead ? 'background.paper' : 'rgba(var(--mui-palette-primary-mainChannel), 0.05)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 2
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                <ListItemIcon sx={{ minWidth: 'auto', mt: 0.5 }}>
                                    {typeIcons[notification.type] || <Info color="info" />}
                                </ListItemIcon>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                            {notification.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {format(new Date(notification.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="text.secondary">
                                        {notification.message}
                                    </Typography>
                                </Box>
                                {!notification.isRead && (
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main', mt: 1.5 }} />
                                )}
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Container>
    );
}
