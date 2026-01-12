'use client';

import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Stack,
    TextField,
    InputAdornment
} from '@mui/material';
import { 
    ExpandMore, 
    Search, 
    LocalShipping, 
    Payment, 
    ShoppingBag, 
    Replay, 
    HelpOutline 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';

const faqData = [
    {
        category: 'Pedidos',
        icon: <ShoppingBag />,
        questions: [
            {
                q: 'Como posso acompanhar meu pedido?',
                a: 'Você pode acompanhar seu pedido acessando a seção "Meus Pedidos" em seu perfil. Além disso, enviaremos e-mails de atualização para cada mudança no status do seu pedido.'
            },
            {
                q: 'Posso alterar o endereço de entrega após a finalização do pedido?',
                a: 'Por motivos de segurança, não realizamos alterações no endereço de entrega após a confirmação do pedido. Caso precise alterar, recomendamos o cancelamento e a realização de uma nova compra.'
            }
        ]
    },
    {
        category: 'Pagamentos',
        icon: <Payment />,
        questions: [
            {
                q: 'Quais são as formas de pagamento aceitas?',
                a: 'Aceitamos Cartões de Crédito (Visa, Mastercard, Elo, American Express), Pix e Boleto Bancário.'
            },
            {
                q: 'Quanto tempo leva para confirmar meu pagamento?',
                a: 'Pagamentos via Pix são confirmados instantaneamente. Cartão de crédito pode levar até 24h para análise. Boletos levam de 1 a 2 dias úteis para compensação.'
            }
        ]
    },
    {
        category: 'Entregas',
        icon: <LocalShipping />,
        questions: [
            {
                q: 'Qual o prazo de entrega?',
                a: 'O prazo de entrega varia de acordo com seu CEP e o método de envio escolhido. Você pode consultar o prazo inserindo seu CEP na página do produto ou no carrinho.'
            },
            {
                q: 'A NESTFY entrega em todo o Brasil?',
                a: 'Sim, realizamos entregas em todo o território nacional através de parceiros logísticos renomados.'
            }
        ]
    },
    {
        category: 'Trocas e Devoluções',
        icon: <Replay />,
        questions: [
            {
                q: 'Como solicito uma troca ou devolução?',
                a: 'Você tem até 7 dias corridos após o recebimento para solicitar a devolução por arrependimento. Entre em contato com nosso suporte informando o número do pedido.'
            },
            {
                q: 'O que fazer se meu produto chegar com defeito?',
                a: 'Caso receba um produto com defeito, tire fotos e entre em contato conosco imediatamente. Resolveremos o problema com a máxima prioridade, sem custos adicionais.'
            }
        ]
    }
];

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFaq = faqData.map(category => ({
        ...category,
        questions: category.questions.filter(
            item => item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   item.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 50%, #1A1A1A 0%, #0A0A0A 100%)',
            pt: { xs: 12, md: 15 },
            pb: 8
        }}>
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Box textAlign="center" mb={8}>
                        <Typography 
                            variant="h2" 
                            sx={{ 
                                fontFamily: 'var(--font-playfair)',
                                fontWeight: 700,
                                color: '#AF944F',
                                mb: 2,
                                textTransform: 'uppercase',
                                letterSpacing: 4
                            }}
                        >
                            Perguntas Frequentes
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 5, fontWeight: 300 }}>
                            Como podemos ajudar você hoje?
                        </Typography>

                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Busque por uma dúvida..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                maxWidth: 600,
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    borderRadius: '50px',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(175, 148, 79, 0.3)',
                                    '& fieldset': { border: 'none' },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.08)',
                                    },
                                    '&.Mui-focused': {
                                        border: '1px solid #AF944F',
                                        boxShadow: '0 0 15px rgba(175, 148, 79, 0.2)'
                                    }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#AF944F' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Stack spacing={4}>
                        {filteredFaq.length > 0 ? (
                            filteredFaq.map((category, index) => (
                                <Box key={index}>
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, ml: 1 }}>
                                        <Box sx={{ color: '#AF944F' }}>{category.icon}</Box>
                                        <Typography variant="h5" sx={{ 
                                            color: 'white', 
                                            fontWeight: 600,
                                            fontFamily: 'var(--font-playfair)'
                                        }}>
                                            {category.category}
                                        </Typography>
                                    </Stack>
                                    
                                    <Paper sx={{ 
                                        overflow: 'hidden', 
                                        borderRadius: 3,
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        {category.questions.map((item, qIndex) => (
                                            <Accordion 
                                                key={qIndex}
                                                sx={{ 
                                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                                    color: 'white',
                                                    '&:before': { display: 'none' },
                                                    borderBottom: qIndex !== category.questions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                                    '&.Mui-expanded': {
                                                        backgroundColor: 'rgba(255,255,255,0.06)'
                                                    }
                                                }}
                                            >
                                                <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#AF944F' }} />}>
                                                    <Typography sx={{ fontWeight: 500 }}>{item.q}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                                                        {item.a}
                                                    </Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </Paper>
                                </Box>
                            ))
                        ) : (
                            <Box textAlign="center" py={10}>
                                <HelpOutline sx={{ fontSize: 60, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                    Nenhuma dúvida encontrada para "{searchTerm}"
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </motion.div>
            </Container>
        </Box>
    );
}
