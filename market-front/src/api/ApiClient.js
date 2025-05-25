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