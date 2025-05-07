import axios from 'axios'
import { toast } from 'react-toastify';
import { router } from '../App';
axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
    response => response,
    error => {
      if (!error.response) {
        toast.error("Sunucuya ulaşılamadı");
        return Promise.reject({ message: "Sunucuya ulaşılamadı" });
      }
  
      const { data, status } = error.response;
  
      switch (status) {
        case 400:
        case 401:
          toast.error(data.message || "İstek hatalı.");
          break;
        case 403:
          toast.error(data.message || "Erişim reddedildi.");
          break;
        case 404:
          router.navigate("/errors/not-found", {
            state: { error: data, status }
          });
          break;
        case 500:
          router.navigate("/errors/server-error", {
            state: { error: data, status }
          });
          break;
        default:
          toast.error("Bilinmeyen bir hata oluştu.");
          break;
      }
  
      // ❗ Burada hata verisini `createAsyncThunk`'a aktar
      return Promise.reject(error.response);
    }
  );
  
  const instance = axios.create({
    baseURL: "http://localhost:5000/api",
  });
  
const methods = {
    get : (url) => axios.get(url).then((response)=>response.data),
    post : (url,body) => axios.post(url,body).then((response)=>response.data),
    put : (url,body) => axios.put(url,body).then((response)=>response.data),
    delete : (url) => axios.delete(url).then((response)=>response.data),
};

const products = {
    list: (query) => instance.get("/products", { params: query }),
    details : (id) => methods.get(`api/products/${id}`),
    addProduct: (FormData) =>methods.post("api/products", FormData, {}),
    addStock: (id) => methods.put(`/api/products/${id}/increase`),
    removeStock: (id) => methods.put(`/api/products/${id}/decrease`),
    removeAll : (id) => methods.delete(`/api/products/${id}`),
    update: (id, data) => methods.put(`api/products/${id}`, data),
    popular : () => methods.get('/api/products/popular'),
};

const orders = {
  createOrder : (FormData) => methods.post("/order/add",FormData),
  getOrders : () => methods.get("order/get"),
  removeOrder : (id) =>methods.delete(`order/${id}`)
}

const account = {
    login : (FormData) => methods.post('user/login',FormData),
    register : (FormData) => methods.post('user/register', FormData), 
    getUser : () => methods.get('user/getMe'),
    updateUser : (FormData) => methods.put('user',FormData),
    logout : () => methods.post('user/logout'),
    addAddress: (formData) => methods.post('user/address', formData),
    deleteAdress : (id) => methods.delete(`user/address/${id}`),
    updateAddress : (id,FormData) => methods.put(`user/address/${id}`,FormData),
    getAddressses : () => methods.get('user/address')
}

const cart = {
  get: () => methods.get("api/cart/get"),
  addItem: (productId) => methods.post("api/cart/add", { productId }),
  removeItem: (productId, quantity = 1) => methods.post("api/cart/remove", { productId, quantity }),
};


const requests = {
    products,
    account,
    cart,
    orders
}

export default requests;