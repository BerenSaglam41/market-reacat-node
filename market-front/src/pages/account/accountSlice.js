import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { router } from "../../App";
import requests from "../../api/ApiClient";
import { toast } from "react-toastify";

const initialState = {
    user: null,
    status: "idle"
};

// LOGIN
export const loginUser = createAsyncThunk(
    "account/login",
    async (data, thunkAPI) => {
        try {
            const user = await requests.account.login(data);
            localStorage.setItem("user", JSON.stringify(user));
            router.navigate('/');
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
);

// REGISTER
export const registerUser = createAsyncThunk(
    "account/register",
    async (data, thunkAPI) => {
      try {
        const result = await requests.account.register(data);
        
        toast.success("Kayıt başarılı!");
        return result;
      } catch (error) {        
        const errorData = error.data?.errors;
        console.log(errorData);
        if (errorData) {
            Object.values(errorData).forEach(msg => toast.error(msg));
        }
          else {
          toast.error(errorData?.message || "Kayıt başarısız!");
        }
  
        return thunkAPI.rejectWithValue(errorData); 
      }
    }
  );
  

// GET USER (From Cookie)
export const getUser = createAsyncThunk(
    "account/getUser",
    async (_, thunkAPI) => {
        try {
            const user = await requests.account.getUser();
            thunkAPI.dispatch(setUser(user));
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                message: error.response?.data?.message || error.message
            });
        }
    },{
        condition : () => {
            if(!localStorage.getItem("user")) return false;
        },
    }
);

// LOGOUT (Thunk ile async)
export const logoutThunk = createAsyncThunk(
    "account/logoutThunk",
    async (_, thunkAPI) => {
        try {
            await requests.account.logout(); // HttpOnly çerez temizlenir
            localStorage.removeItem("user");
            thunkAPI.dispatch(logout()); // Reducer'dan user null yapılır
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
);

// Slice
export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "pending";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = "idle";
            })
            .addCase(loginUser.rejected, (state) => {
                state.status = "idle";
            })

            .addCase(registerUser.pending, (state) => {
                state.status = "pending";
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = "registerSuccess";
            })
            .addCase(registerUser.rejected, (state) => {
                state.status = "idle";
            })

            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state) => {
                state.user = null;
                localStorage.removeItem("user");
                router.navigate('/login');
            })
            .addCase(logoutThunk.pending, (state) => {
                state.status = "pending";
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.status = "idle";
                state.user = null;
                router.navigate('/login', { replace: true });
            })
            .addCase(logoutThunk.rejected, (state) => {
                state.status = "idle";
            });
    }
});

export const { setUser, logout } = accountSlice.actions;
