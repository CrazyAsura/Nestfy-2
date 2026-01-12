'use client';

import { useState, useRef, useEffect } from 'react';
import { 
    Box, 
    Fab, 
    Paper, 
    Typography, 
    IconButton, 
    TextField, 
    List, 
    ListItem, 
    Avatar,
    Zoom,
    Fade,
    CircularProgress,
    Tooltip,
    Badge
} from '@mui/material';
import { Chat, Close, Send, SmartToy, Person, FiberManualRecord } from '@mui/icons-material';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/libs/stores';
import { getSocketBaseURL } from '@/app/libs/api/services/axios';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Olá! Sou o assistente virtual da loja. Como posso te ajudar hoje?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        // Inicializa o socket
        const socketUrl = getSocketBaseURL();
        const socket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Chatbot conectado ao servidor');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Chatbot desconectado do servidor');
            setIsConnected(false);
        });

        socket.on('receiveMessage', (data: { text: string; sender: 'bot'; timestamp: string }) => {
            const botMsg: Message = {
                id: Date.now().toString(),
                text: data.text,
                sender: 'bot',
                timestamp: new Date(data.timestamp)
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        });

        socket.on('error', (err: { message: string }) => {
            console.error('Erro no chatbot:', err.message);
            setIsTyping(false);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!message.trim() || !socketRef.current) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        
        // Envia via socket
        socketRef.current.emit('sendMessage', {
            message: message,
            userId: user?.id
        });

        setMessage('');
        setIsTyping(true);
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
            <Zoom in={true}>
                <Fab 
                    color="primary" 
                    onClick={() => setIsOpen(!isOpen)}
                    sx={{ boxShadow: 4 }}
                >
                    {isOpen ? <Close /> : <Chat />}
                </Fab>
            </Zoom>

            <Fade in={isOpen}>
                <Paper 
                    elevation={6}
                    sx={{ 
                        position: 'absolute', 
                        bottom: 80, 
                        right: 0, 
                        width: { xs: 'calc(100vw - 64px)', sm: 350 },
                        height: 450,
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    {/* Header */}
                    <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'primary.dark' }}><SmartToy /></Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">Suporte Virtual</Typography>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <FiberManualRecord sx={{ fontSize: 10, color: isConnected ? '#4caf50' : '#f44336' }} />
                                    <Typography variant="caption">{isConnected ? 'Online' : 'Offline'}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        {!isConnected && (
                            <Tooltip title="Tentando reconectar...">
                                <CircularProgress size={16} color="inherit" />
                            </Tooltip>
                        )}
                    </Box>

                    {/* Messages */}
                    <Box 
                        ref={scrollRef}
                        sx={{ 
                            flexGrow: 1, 
                            p: 2, 
                            overflowY: 'auto', 
                            bgcolor: 'background.default',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        {messages.map((msg) => (
                            <Box 
                                key={msg.id}
                                sx={{ 
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%'
                                }}
                            >
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 1.5, 
                                        borderRadius: 3,
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                                        border: msg.sender === 'bot' ? '1px solid' : 'none',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Paper>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>
                        ))}
                        {isTyping && (
                            <Box sx={{ alignSelf: 'flex-start', display: 'flex', gap: 1, alignItems: 'center' }}>
                                <CircularProgress size={16} />
                                <Typography variant="caption" color="text.secondary">Digitando...</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Input */}
                    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Box display="flex" gap={1}>
                            <TextField 
                                fullWidth 
                                size="small" 
                                placeholder="Digite sua mensagem..." 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                            <IconButton color="primary" onClick={handleSend} disabled={!message.trim()}>
                                <Send />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
}
