import axios from 'axios'
import { toast } from 'react-toastify';
import { router } from '../App';
axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(response=>{
    return response
},(error)=>{
    if(!error.response){
        toast.error("Sunucuya ulaşılamadı");
        return Promise.reject("Sunucuya Ulaşılamadı");
    }
    const { data, status } = error.response;
    switch (status) {
        case 400:
            toast.error(data.message);
            break;
        case 401:
            toast.error(data.message);
            break;
        case 403:
            if(data.errors){
                const errors = [];
                for(const key in data.errors){
                    errors.push(data.errors[key]);
                }
                let result = { errors : errors , message : data.message}
                throw result;
            }
            break;
        case 404:
            router.navigate("/errors/not-found",{
                state : { error : data , status : status },
            });            
            break;
        case 500:
            router.navigate("/errors/server-error",{
                state : { error : data , status : status },
            });
            break;
        default:
            break;
    }
    return Promise.reject(error.message);
})

const methods = {
    get : (url) => axios.get(url).then((response)=>response.data),
    post : (url,body) => axios.post(url,body).then((response)=>response.data),
    put : (url,body) => axios.put(url,body).then((response)=>response.data),
    delete : (url) => axios.delete(url).then((response)=>response.data),
};

const products = {
    list : () => methods.get("api/products"),
    details : (id) => methods.get(`api/products/${id}`),
    addProduct: (FormData) =>methods.post("api/products", FormData, {})
};

const account = {
    login : (FormData) => methods.post('admin/login',FormData),
    register : (FormData) => methods.post('users/register',FormData),
    getUser : () => methods.get('admin/getAdmin'),
    logout : () => methods.post('admin/logout'),
}


const requests = {
    products,
    account,
}

export default requests;