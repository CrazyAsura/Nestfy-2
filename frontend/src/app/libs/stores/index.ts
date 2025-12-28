import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import productReducer from './slices/products.slice';
import categoryReducer from './slices/categories.slice';
import themeReducer from './slices/theme.slice';



export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        categories: categoryReducer,
        theme: themeReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;