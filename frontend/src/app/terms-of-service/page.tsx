'use client';

import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    Divider, 
    Stack 
} from '@mui/material';
import { 
    Gavel, 
    Assignment, 
    VerifiedUser, 
    LocalShipping, 
    Payment,
    ArrowBack
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';

const termSections = [
    {
        title: '1. Aceitação dos Termos',
        icon: <VerifiedUser />,
        content: 'Ao acessar e utilizar a plataforma NESTFY, você concorda expressamente com os presentes Termos de Serviço. Estes termos regem o uso de nossa loja online e todos os serviços relacionados. Caso não concorde com qualquer parte destes termos, recomendamos que não utilize nossos serviços.'
    },
    {
        title: '2. Cadastro e Conta',
        icon: <Assignment />,
        content: 'Para realizar compras, o usuário deverá criar uma conta fornecendo informações precisas e atualizadas. A segurança da senha é de inteira responsabilidade do usuário. A NESTFY reserva-se o direito de suspender contas que violem nossas políticas ou apresentem atividades suspeitas.'
    },
    {
        title: '3. Política de Preços e Pagamentos',
        icon: <Payment />,
        content: 'Os preços exibidos em nosso site estão sujeitos a alterações sem aviso prévio. O fechamento do pedido garante o preço vigente no momento da compra. Aceitamos diversas formas de pagamento, processadas através de gateways seguros. A entrega do produto está condicionada à confirmação do pagamento.'
    },
    {
        title: '4. Entregas e Prazos',
        icon: <LocalShipping />,
        content: 'Os prazos de entrega são estimativas fornecidas por nossos parceiros logísticos e começam a contar a partir da confirmação do pagamento. Não nos responsabilizamos por atrasos decorrentes de fatores externos (greves, condições climáticas ou erros no endereço fornecido pelo cliente).'
    },
    {
        title: '5. Propriedade Intelectual',
        icon: <Gavel />,
        content: 'Todo o conteúdo disponível na NESTFY, incluindo logos, textos, imagens e design, é de propriedade exclusiva da NESTFY ou de seus licenciantes. É proibida a reprodução, cópia ou uso não autorizado de qualquer material sem consentimento prévio por escrito.'
    }
];

export default function TermsOfServicePage() {
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
                    <Box sx={{ mb: 6 }}>
                        <Link href="/" passHref style={{ textDecoration: 'none' }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#AF944F', mb: 4, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                                <ArrowBack fontSize="small" />
                                <Typography variant="button" sx={{ fontWeight: 600 }}>Voltar para a Loja</Typography>
                            </Stack>
                        </Link>

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
                            Termos de Serviço
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
                            Vigente a partir de: 12 de Janeiro de 2026
                        </Typography>
                    </Box>

                    <Paper sx={{ 
                        p: { xs: 3, md: 6 }, 
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 4,
                        border: '1px solid rgba(175, 148, 79, 0.2)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>
                        <Stack spacing={6}>
                            {termSections.map((section, index) => (
                                <Box key={index}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                        <Box sx={{ 
                                            p: 1.5, 
                                            borderRadius: 2, 
                                            backgroundColor: 'rgba(175, 148, 79, 0.1)', 
                                            color: '#AF944F',
                                            display: 'flex'
                                        }}>
                                            {section.icon}
                                        </Box>
                                        <Typography variant="h5" sx={{ 
                                            color: 'white', 
                                            fontWeight: 600,
                                            fontFamily: 'var(--font-playfair)'
                                        }}>
                                            {section.title}
                                        </Typography>
                                    </Stack>

                                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                                        {section.content}
                                    </Typography>
                                    
                                    {index !== termSections.length - 1 && (
                                        <Divider sx={{ mt: 6, borderColor: 'rgba(255,255,255,0.05)' }} />
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Paper>

                    <Box sx={{ mt: 8, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2 }}>
                            NESTFY LUXURY RETAIL - Todos os direitos reservados.
                        </Typography>
                        <Box sx={{ 
                            width: 50, 
                            height: 2, 
                            backgroundColor: '#AF944F', 
                            margin: '0 auto' 
                        }} />
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
