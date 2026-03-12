import axios from "axios";

const api=axios.create({
    baseURL: "https://localhost:5000/api"
})

api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("accessToken");
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config;
});

api.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const original = error.config;

        if(error.response?.status === 401 && !original._retry){
            original._retry=true;
            try{
                const refreshToken=localStorage.getItem("refeshToken");
                const {data}=await axios.post(
                    "https://localhost:5000/api/auth/refresh",
                    (refreshToken)
                )
                localStorage.setItem("accessToken",data.accessToken)
                return api(original);
            }catch{
                localStorage.clear();
                window.location.href="/login";
            }
        }
        return Promise.reject(error);
    }
);
export default api;