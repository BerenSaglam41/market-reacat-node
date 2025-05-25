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
    }
);

export const updateUser = createAsyncThunk(
    'account/updateUser',
    async (userData, thunkAPI) => {
      try {        
        const response = await requests.account.updateUser(userData); // PUT /user/update
        console.log(response);
        
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue({ message: error.message });
      }
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

// Adres ekleme işlemi
export const addAddress = createAsyncThunk(
    'account/addAddress',
    async (addressData, thunkAPI) => {
        try {
            console.log(addressData);
            const response = await requests.account.addAddress(addressData); 
            console.log(response);
            
            return response.data; // Yeni adresi döndür
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
);

// Adres güncelleme işlemi
export const updateAddress = createAsyncThunk(
    'account/updateAddress',
    async ({ addressId, addressData }, thunkAPI) => {
      try {
        // Sadece id URL'de, data body'de
        const response = await requests.account.updateAddress(addressId, addressData);
        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
  );
  

// Adres silme işlemi
export const deleteAddress = createAsyncThunk(
    'account/deleteAddress',
    async (addressId, thunkAPI) => {
        try {
            await requests.account.deleteAdress(addressId); // Adres silme
            return addressId; // Silinen adresin id'si
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
);

export const getAddresses = createAsyncThunk(
    'account/getAddresses',
    async (_, thunkAPI) => {
      try {
        const response = await requests.account.getAddressses();         
        return response; // adres listesini döndür
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

            .addCase(getUser.pending, (state) => {
                state.status = "pending";
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = "idle";
            })
            .addCase(getUser.rejected, (state, action) => {
                state.user = null;
                state.status = "idle";
                // Sadece localStorage'ı temizle, otomatik redirect yapma
                localStorage.removeItem("user");
                console.log('⚠️ getUser rejected:', action.payload);
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
            })
            .addCase(getAddresses.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.addresses = action.payload;
                }
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                if (state.user && Array.isArray(state.user.addresses)) {
                    state.user.addresses.push(action.payload);
                }
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                if (state.user && Array.isArray(state.user.addresses)) {
                    const index = state.user.addresses.findIndex(addr => addr._id === action.payload._id);
                    if (index !== -1) {
                        state.user.addresses[index] = action.payload;
                    }
                }
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                if (state.user && Array.isArray(state.user.addresses)) {
                    state.user.addresses = state.user.addresses.filter(addr => addr._id !== action.payload);
                }
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload;
              })
              
    }
});

export const { setUser, logout } = accountSlice.actions;
