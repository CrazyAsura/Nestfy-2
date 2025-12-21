import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";

type ProductState = {
    selectedProduct: Product | null;
};

const initialState: ProductState = {
    selectedProduct: null,
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        selectProduct(state, action: PayloadAction<Product>) {
            state.selectedProduct = action.payload;
        }
    }
})

export const { selectProduct } = productSlice.actions;
export default productSlice.reducer;