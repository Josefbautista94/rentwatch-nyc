import axios from "axios"

const api = axios.create({
    baseUrl : "/",
    timeout :10000,
    headers: {"Accept": "application/json"}
})

export default api;