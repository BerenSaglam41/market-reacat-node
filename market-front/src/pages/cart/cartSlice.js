import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../api/ApiClient";
import { toast } from "react-toastify";

const initialState = {
  cart: null,
  status: "idle", 
  error: null
};

export const getCart = createAsyncThunk(
    "carts/getCart",
    async (_,thunkAPI) => {
        try{
            return await requests.cart.get()
        }
        catch(error){
            return thunkAPI.rejectWithValue({message : error.message})
        }
    }       
)

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await requests.cart.get(); 
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async (productId, thunkAPI) => {
    try {
      const response = await requests.cart.addItem(productId);
      if(response.success) return toast.success(`${response.product.name} sepete eklendi!`)       
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const response = await requests.cart.removeItem(productId, quantity); 
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.status = "success";
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state, action) => {
        state.status = "loading";
        state.loadingIds.push(action.meta.arg);  
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.status = "idle";
      })
      .addCase(addToCart.rejected, (state,) => {
        state.status = "idle";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.status = "success";
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export const { clearCart, setCart } = cartSlice.actions;

export default cartSlice.reducer;
