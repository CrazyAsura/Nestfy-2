import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../types/category"

type CategoryState = {
    selectedCategory: Category | null;
}

const initialState: CategoryState = {
    selectedCategory: null,
}

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        selectCategory(state, action: PayloadAction<Category>) {
            state.selectedCategory = action.payload;
        }
    }
})

export const { selectCategory } = categorySlice.actions;
export default categorySlice.reducer;