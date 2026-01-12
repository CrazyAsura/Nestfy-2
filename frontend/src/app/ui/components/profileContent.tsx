import { Box, Typography, Divider, Grid } from '@mui/material'
import { Profile as UserProfile } from '../../libs/types/profile'
import { maskCPF, maskCNPJ } from '../../libs/utils/function/masks'
import { UserType } from '../../libs/types/enums'

type Props = {
  profile: UserProfile
}

export default function ProfileContent({ profile }: Props) {
    const formatDocument = (doc: any, type?: UserType) => {
        // Garantir que doc seja uma string e não esteja vazio
        const docString = String(doc || '').trim()
        if (!docString) return 'Não informado'

        try {
            if (type === UserType.LEGAL_ENTITY) {
                return maskCNPJ(docString)
            }
            if (type === UserType.INDIVIDUAL) {
                return maskCPF(docString)
            }
            // Fallback: se o tipo for desconhecido, tenta inferir pelo tamanho ou mostra o original
            return docString.length > 11 ? maskCNPJ(docString) : maskCPF(docString)
        } catch (error) {
            return docString // Em caso de erro na máscara, mostra o valor original
        }
    }

    const formatUserType = (type?: UserType) => {
        switch (type) {
            case UserType.INDIVIDUAL: return 'Pessoa Física'
            case UserType.LEGAL_ENTITY: return 'Pessoa Jurídica'
            default: return type || '-'
        }
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Informações Pessoais
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Tipo de Usuário</Typography>
                    <Typography variant="body1">{formatUserType(profile.userType)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">Cargo / Função</Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                        {profile.role?.toLowerCase() || '-'}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">Documento (CPF/CNPJ)</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {formatDocument(profile.document, profile.userType)}
                    </Typography>
                </Grid>
            </Grid>

            {(profile.ddi || profile.ddd || profile.numberPhone || profile.phone) && (
                <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
                        Contato
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" color="text.secondary">Telefone</Typography>
                            <Typography variant="body1">
                                {profile.numberPhone ? (
                                    <>
                                        {profile.ddi && typeof profile.ddi === 'string' && profile.ddi.includes('_') 
                                            ? `+${profile.ddi.split('_')[1]} ` 
                                            : profile.ddi && `+${profile.ddi} `}
                                        {profile.ddd && typeof profile.ddd === 'string' && profile.ddd.includes('_') 
                                            ? `(${profile.ddd.split('_')[1]}) ` 
                                            : profile.ddd && `(${profile.ddd}) `}
                                        {profile.numberPhone}
                                    </>
                                ) : (
                                    profile.phone || '-'
                                )}
                            </Typography>
                        </Grid>
                    </Grid>
                </>
            )}

            {(profile.street || profile.city || profile.address || profile.zipCode) && (
                <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
                        Endereço
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {profile.street || profile.city ? (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <Typography variant="subtitle2" color="text.secondary">Rua</Typography>
                                <Typography variant="body1">{profile.street || '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Número</Typography>
                                <Typography variant="body1">{profile.number || '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">Bairro</Typography>
                                <Typography variant="body1">{profile.neighborhood || '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">CEP</Typography>
                                <Typography variant="body1">{profile.zipCode || '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Cidade</Typography>
                                <Typography variant="body1">{profile.city || '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                                <Typography variant="body1">{profile.state || '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">País</Typography>
                                <Typography variant="body1">{profile.country || '-'}</Typography>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle2" color="text.secondary">Endereço Completo</Typography>
                                <Typography variant="body1">{profile.address || '-'}</Typography>
                            </Grid>
                            {profile.zipCode && (
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle2" color="text.secondary">CEP</Typography>
                                    <Typography variant="body1">{profile.zipCode}</Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </>
            )}
        </Box>
    )
}