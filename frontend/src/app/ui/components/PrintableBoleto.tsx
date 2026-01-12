'use client'; 
 
import { Box, Typography, Paper } from '@mui/material'; 
import Barcode from 'react-barcode'; 
 
interface PrintableBoletoProps { 
  linhaDigitavel: string; 
  codigoBarras: string; // 44 dígitos 
  valor: number; 
  vencimento: string; 
  beneficiario: string; 
  pagador: string; 
  pedidoId: string; 
  totalTaxAmount?: number;
} 
 
export default function PrintableBoleto({ 
  linhaDigitavel, 
  codigoBarras, 
  valor, 
  vencimento, 
  beneficiario, 
  pagador, 
  pedidoId,
  totalTaxAmount
}: PrintableBoletoProps) { 
  return ( 
    <Box 
      sx={{ 
        bgcolor: '#fff', 
        color: '#000', 
        p: 4, 
        '@media print': { 
          p: 0, 
          m: 0, 
          boxShadow: 'none' 
        } 
      }} 
    > 
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid #000', 
          p: 3, 
          fontFamily: 'monospace' 
        }} 
      > 
        {/* CABEÇALHO */} 
        <Box display="flex" alignItems="center" borderBottom="2px solid #000" pb={1} mb={2}> 
          <Typography fontWeight="bold" fontSize={20} mr={2}> 
            237-2 
          </Typography> 
 
          <Typography 
            fontSize={14} 
            fontWeight="bold" 
            sx={{ flex: 1, textAlign: 'right' }} 
          > 
            {linhaDigitavel} 
          </Typography> 
        </Box> 
 
        {/* DADOS PRINCIPAIS */} 
        <Box border="1px solid #000" mb={2}> 
          <Row label="Local de Pagamento" value="Pagável em qualquer banco até o vencimento" /> 
          <Row label="Beneficiário" value={beneficiario} /> 
          <Row label="Pagador" value={pagador} /> 
          <Row label="Pedido" value={pedidoId} /> 
 
          <Box display="flex"> 
            <Row label="Vencimento" value={vencimento} width="50%" /> 
            <Row 
              label="Valor do Documento" 
              value={valor.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              })} 
              width="50%" 
              highlight 
            /> 
          </Box> 
 
          <Row 
            label="Instruções" 
            value={`Não receber após o vencimento. Documento válido somente para pagamento. ${
                totalTaxAmount && totalTaxAmount > 0 
                ? `(Incluso R$ ${totalTaxAmount.toFixed(2)} de tributos totais incidentes sobre a operação conforme Lei 12.741/12)` 
                : ''
            }`} 
            large 
          /> 
        </Box> 
 
        {/* CÓDIGO DE BARRAS */} 
        <Box mt={2} display="flex" justifyContent="flex-start"> 
          <Barcode 
            value={codigoBarras} 
            format="ITF" 
            width={2} 
            height={90} 
            displayValue={false} 
          /> 
        </Box> 
      </Paper> 
    </Box> 
  ); 
} 
 
/* COMPONENTE AUXILIAR */ 
 
function Row({ 
  label, 
  value, 
  width = '100%', 
  highlight = false, 
  large = false 
}: { 
  label: string; 
  value: string; 
  width?: string; 
  highlight?: boolean; 
  large?: boolean; 
}) { 
  return ( 
    <Box 
      sx={{ 
        width, 
        borderBottom: '1px solid #000', 
        p: 1, 
        bgcolor: highlight ? '#f5f5f5' : 'transparent' 
      }} 
    > 
      <Typography fontSize={10} fontWeight="bold"> 
        {label.toUpperCase()} 
      </Typography> 
      <Typography fontSize={large ? 14 : 12} fontWeight={highlight ? 'bold' : 'normal'}> 
        {value} 
      </Typography> 
    </Box> 
  ); 
} 
