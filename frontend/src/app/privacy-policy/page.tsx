'use client';

import { Container, Typography, Box, Paper, Divider } from '@mui/material';

export default function PrivacyPolicyPage() {
    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Paper elevation={0} sx={{ p: 6, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h3" sx={{ 
                    mb: 4, 
                    fontWeight: 700, 
                    fontFamily: 'var(--font-playfair)',
                    background: 'linear-gradient(45deg, #AF944F 30%, #D4AF37 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Política de Privacidade
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
                    Última atualização: 12 de Janeiro de 2026
                </Typography>

                <Divider sx={{ mb: 6 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>1. Introdução</Typography>
                        <Typography variant="body1" paragraph>
                            A NESTFY está comprometida com a proteção de seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>2. Coleta de Dados</Typography>
                        <Typography variant="body1" paragraph>
                            Coletamos dados necessários para a prestação de nossos serviços, tais como:
                        </Typography>
                        <ul>
                            <li><Typography variant="body1">Dados de identificação (Nome, CPF, E-mail)</Typography></li>
                            <li><Typography variant="body1">Dados de contato (Telefone, Endereço)</Typography></li>
                            <li><Typography variant="body1">Dados de navegação (Endereço IP, cookies)</Typography></li>
                        </ul>
                    </Box>

                    <Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>3. Finalidade do Tratamento</Typography>
                        <Typography variant="body1" paragraph>
                            Seus dados são utilizados para:
                        </Typography>
                        <ul>
                            <li><Typography variant="body1">Processar e entregar seus pedidos</Typography></li>
                            <li><Typography variant="body1">Garantir a segurança de sua conta</Typography></li>
                            <li><Typography variant="body1">Cumprir obrigações legais e regulatórias</Typography></li>
                            <li><Typography variant="body1">Melhorar sua experiência em nossa plataforma</Typography></li>
                        </ul>
                    </Box>

                    <Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>4. Seus Direitos</Typography>
                        <Typography variant="body1" paragraph>
                            Como titular dos dados, você possui direitos garantidos pela LGPD, incluindo o acesso aos seus dados, correção de dados incompletos ou inexatos, e a revogação do consentimento a qualquer momento.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>5. Contato</Typography>
                        <Typography variant="body1" paragraph>
                            Para qualquer dúvida sobre nossa política de privacidade ou sobre o tratamento de seus dados, entre em contato através do e-mail: privacidade@nestfy.com.br
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
