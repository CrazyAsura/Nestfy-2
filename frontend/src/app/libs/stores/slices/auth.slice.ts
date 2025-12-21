import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
    id: number,
    name: string,
    email: string,
    role: 'USER' | 'ADMIN',
    userType: 'CUSTOMER' | 'SELLER',
}

type AuthState = {
    user: User | null,
    accessToken: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<AuthState>) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        logout(state) {
            state.user = null;
            state.accessToken = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
            }
        },
        hydrate(state, action: PayloadAction<AuthState>) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        }
    }
})

export const { loginSuccess, logout, hydrate } = authSlice.actions;
export default authSlice.reducer;
