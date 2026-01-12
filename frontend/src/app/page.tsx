import Hero from "./ui/components/Hero";
import CarousselProducts from "./ui/components/carousselProducts";
import ListDiscountsProducts from "./ui/components/listDiscountsProducts";
import ListProducts from "./ui/components/listProducts";
import ListCategories from "./ui/components/listCategories";
import { Box, Container, Typography, Grid, Stack } from "@mui/material";
import { LocalShipping, VerifiedUser, Star, SupportAgent } from "@mui/icons-material";

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Seção de Benefícios */}
      <Box sx={{ py: 10, bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container>
          <Grid container spacing={4}>
            {[
              { icon: <LocalShipping sx={{ fontSize: 40 }} />, title: "Entrega VIP", desc: "Logística dedicada para todo o Brasil" },
              { icon: <VerifiedUser sx={{ fontSize: 40 }} />, title: "Autenticidade", desc: "Certificado de garantia em cada peça" },
              { icon: <Star sx={{ fontSize: 40 }} />, title: "Curadoria", desc: "Seleção exclusiva de marcas globais" },
              { icon: <SupportAgent sx={{ fontSize: 40 }} />, title: "Concierge", desc: "Atendimento personalizado 24/7" },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Stack alignItems="center" textAlign="center" spacing={2}>
                  <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                  <Typography variant="h6" sx={{ fontFamily: 'var(--font-playfair)', fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <ListCategories />
      <CarousselProducts />
      
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container>
           <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontFamily: 'var(--font-playfair)', 
                        fontWeight: 700,
                        mb: 2
                    }}
                >
                    Nossa Coleção
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ letterSpacing: '0.1em', maxWidth: '600px', mx: 'auto' }}>
                    Peças atemporais selecionadas para quem busca o extraordinário em cada detalhe.
                </Typography>
           </Box>
           <ListProducts />
        </Container>
      </Box>
      
      <ListDiscountsProducts />
    </>
  );
}
