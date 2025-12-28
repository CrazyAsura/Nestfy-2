export const API_ROUTES = {
    AUTH: {
        LOGIN: 'auth/login',
        REGISTER_PF: 'auth/register/pf',
        REGISTER_PJ: 'auth/register/pj',
        PROFILE: 'auth/profile',
        RESET_PASSWORD: 'auth/reset-password',
    },
    PRODUCTS: {
        BASE: 'products',
        BY_ID: (id: string) => `products/${id}`,
    },
    CATEGORIES: {
        BASE: 'category',
    },
} as const;
