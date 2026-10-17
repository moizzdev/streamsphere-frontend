import axios from 'axios'

let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

const api = axios.create({
    baseURL: API_BASE_URL
})

api.interceptors.request.use((config) => {
    let token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = "application/json"
    }

    return config
})

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        console.log(JSON.stringify(error?.response?.data), "Error response body from backend")
        console.log(error?.response?.status, "Error status code")
        return Promise.reject(error)
    }
)

export default api