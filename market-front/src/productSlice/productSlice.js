import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import Product from "../../../market-backend/models/Product";
import requests from "../api/ApiClient";


export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async () => {
      const res = await requests.products.list();
      return res.products;
    }
  );
  

export const fetchProductById = createAsyncThunk(
    "product/fetchProductById",
    async(productId) => {
        return await requests.products.details(productId);
    }
)

// INCREASE STOCK
export const increaseStock = createAsyncThunk(
    "product/increaseStock",
    async (id) => {        
      const res = await requests.products.addStock(id);
      return res; 
    }
  );
  
  // DECREASE STOCK
export const decreaseStock = createAsyncThunk(
    "product/decreaseStock",
    async (id) => {
      const res = await requests.products.removeStock(id);
      return res;
    }
  );

  export const removeAllStock = createAsyncThunk(
    "product/removeAllStock",
    async (id) => {
      await requests.products.removeAll(id); 
      return id; 
    }
  );
  
  export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async ({ id, data }) => {
      const res = await requests.products.update(id, data);
      return res.product;
    }
  );
  
  export const selectTopSoldProducts = (state, count = 4) => {
    const allProducts = selectAllProducts(state);
    return allProducts
      .filter(p => typeof p.soldCount === "number")
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, count);
  };

const productAdapter = createEntityAdapter({
    selectId: (product) => product._id
  });
  
  const initialState = productAdapter.getInitialState({
    status: "idle",
    isLoaded: false,
    increaseLoadingIds: [],
    decreaseLoadingIds: [],
    deleteLoadingIds: [],
  });
  


export const productSlice = createSlice({
    name : "product",
    initialState,
    reducers : {
        addProductToState: (state, action) => {
            productAdapter.addOne(state, action.payload);
          }    
        },
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
        // INCREASE
        builder.addCase(increaseStock.pending, (state, action) => {
          state.increaseLoadingIds.push(action.meta.arg);
        });
        builder.addCase(increaseStock.fulfilled, (state, action) => {
          productAdapter.upsertOne(state, action.payload);
          state.increaseLoadingIds = state.increaseLoadingIds.filter(id => id !== action.meta.arg);
        });
        builder.addCase(increaseStock.rejected, (state, action) => {
          state.increaseLoadingIds = state.increaseLoadingIds.filter(id => id !== action.meta.arg);
        });

        // DECREASE
        builder.addCase(decreaseStock.pending, (state, action) => {
          state.decreaseLoadingIds.push(action.meta.arg);
        });
        builder.addCase(decreaseStock.fulfilled, (state, action) => {
          productAdapter.upsertOne(state, action.payload);
          state.decreaseLoadingIds = state.decreaseLoadingIds.filter(id => id !== action.meta.arg);
        });
        builder.addCase(decreaseStock.rejected, (state, action) => {
          state.decreaseLoadingIds = state.decreaseLoadingIds.filter(id => id !== action.meta.arg);
        });
        builder.addCase(removeAllStock.pending, (state, action) => {
          state.deleteLoadingIds.push(action.meta.arg);
        });
        builder.addCase(removeAllStock.fulfilled, (state, action) => {
          productAdapter.removeOne(state, action.meta.arg);
          state.deleteLoadingIds = state.deleteLoadingIds.filter(id => id !== action.meta.arg);
        });
        builder.addCase(removeAllStock.rejected, (state, action) => {
          state.deleteLoadingIds = state.deleteLoadingIds.filter(id => id !== action.meta.arg);
        });
        
        builder.addCase(updateProduct.fulfilled, (state, action) => {
          productAdapter.upsertOne(state, action.payload);
        });
        
    }
})

export const {
    selectById: selectProductById,
    selectIds: selectProductIds,
    selectAll: selectAllProducts,
    selectTotal: selectTotalProducts,
} = productAdapter.getSelectors((state) => state.product);
export const {addProductToState} = productSlice.actions;