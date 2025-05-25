import axios from 'axios'
import { toast } from 'react-toastify';
import { router } from '../App';

// Environment variable kontrolü
const isDevelopment = import.meta.env.DEV;
const baseURL = import.meta.env.VITE_API_BASE_URL || (isDevelopment ? "http://localhost:5000" : "https://market-reacat-node-production.up.railway.app");

// Debug logs
console.log('🌍 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🔍 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🚀 Final baseURL:', baseURL);

// URL düzeltmesi
const cleanBaseURL = baseURL.startsWith('http') ? baseURL : `https://${baseURL}`;

// Axios global config
axios.defaults.baseURL = cleanBaseURL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000; // 30 saniye timeout

axios.interceptors.response.use(
    response => {
      console.log('✅ API Response:', response.config.url, response.status);
      return response;
    },
    error => {
      console.error('❌ API Error:', error.config?.url, error.response?.status);
      
      if (!error.response) {
        // Network error
        if (error.code === 'ECONNABORTED') {
          toast.error("İstek zaman aşımına uğradı");
        } else {
          toast.error("Sunucuya ulaşılamadı - Ağ bağlantınızı kontrol edin");
        }
        return Promise.reject({ message: "Sunucuya ulaşılamadı" });
      }
  
      const { data, status } = error.response;
  
      switch (status) {
        case 400:
          toast.error(data.message || "Geçersiz istek");
          break;
        case 401:
          toast.error(data.message || "Oturum açmanız gerekiyor");
          // Auto redirect to login if needed
          if (window.location.pathname !== '/login') {
            router.navigate('/login');
          }
          break;
        case 403:
          toast.error(data.message || "Bu işlem için yetkiniz yok");
          break;
        case 404:
          // API 404'ü sayfa 404'ünden ayır
          if (error.config?.url?.includes('/api/')) {
            toast.error("İstenen veri bulunamadı");
          } else {
            router.navigate("/errors/not-found", {
              state: { error: data, status }
            });
          }
          break;
        case 500:
          toast.error("Sunucu hatası oluştu");
          router.navigate("/errors/server-error", {
            state: { error: data, status }
          });
          break;
        default:
          toast.error("Bilinmeyen bir hata oluştu");
          break;
      }
  
      return Promise.reject(error.response);
    }
  );
  
  const instance = axios.create({
    baseURL: `${cleanBaseURL}/api`,
    withCredentials: true,
    timeout: 30000
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
  createOrder : (FormData) => axios.post("/order/add", FormData).then((response)=>response.data),
  getOrders : () => axios.get("order/get").then((response)=>response.data),
  removeOrder : (id) => axios.delete(`order/${id}`).then((response)=>response.data)
}

const account = {
    login : (FormData) => axios.post('user/login', FormData).then((response)=>response.data),
    register : (FormData) => axios.post('user/register', FormData).then((response)=>response.data), 
    getUser : () => axios.get('user/getMe').then((response)=>response.data),
    updateUser : (FormData) => axios.put('user', FormData).then((response)=>response.data),
    logout : () => axios.post('user/logout').then((response)=>response.data),
    addAddress: (formData) => axios.post('user/address', formData).then((response)=>response.data),
    deleteAdress : (id) => axios.delete(`user/address/${id}`).then((response)=>response.data),
    updateAddress : (id,FormData) => axios.put(`user/address/${id}`, FormData).then((response)=>response.data),
    getAddressses : () => axios.get('user/address').then((response)=>response.data)
}

const cart = {
  get: () => axios.get("api/cart/get").then((response)=>response.data),
  addItem: (productId) => axios.post("api/cart/add", { productId }).then((response)=>response.data),
  removeItem: (productId, quantity = 1) => axios.post("api/cart/remove", { productId, quantity }).then((response)=>response.data),
};


const requests = {
    products,
    account,
    cart,
    orders
}

export default requests;