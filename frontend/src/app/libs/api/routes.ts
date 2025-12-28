export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER_PF: '/auth/register/pf',
        REGISTER_PJ: '/auth/register/pj',
        PROFILE: '/auth/profile',
        RESET_PASSWORD: '/auth/reset-password',
    },
    // Adicione outras rotas aqui conforme o projeto crescer
    // USERS: {
    //     BASE: '/users',
    //     BY_ID: (id: string) => `/users/${id}`,
    // }
} as const;
