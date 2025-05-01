import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import Product from "../../../market-backend/models/Product";
import requests from "../api/ApiClient";


export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async () => {
        return await requests.products.list();
    }
);

export const fetchProductById = createAsyncThunk(
    "product/fetchProductById",
    async(productId) => {
        return await requests.products.details(productId);
    }
)

const productAdapter = createEntityAdapter();

const initialState = productAdapter.getInitialState({
  status: "idle",
  isLoaded: false,
});


export const productSlice = createSlice({
    name : "product",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(fetchProducts.pending,(state)=>{
            state.status = "pendingFetchProducts"
        })
        builder.addCase(fetchProducts.fulfilled,(state,action)=>{
            productAdapter.setAll(state,action.payload);
            state.isLoaded = true;
            state.status = "idle"
        })
        builder.addCase(fetchProducts.rejected,(state) =>{
            state.status = "idle"
        });

        builder.addCase(fetchProductById.pending,(state) =>{
            state.status = "pendingFetchProductById"
        });
        
        builder.addCase(fetchProductById.fulfilled,(state,action) =>{
            productAdapter.upsertOne(state,action.payload);
            state.status = "idle";
        });

        builder.addCase(fetchProductById.rejected,(state) =>{
            state.status = "idle"
        });
    }
})

export const {
    selectById: selectProductById,
    selectIds: selectProductIds,
    selectAll: selectAllProducts,
    selectTotal: selectTotalProducts,
} = productAdapter.getSelectors((state) => state.product);