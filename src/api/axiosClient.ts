import axios, { AxiosError } from "axios"
import { STATIC_HOST } from "../constants/common"

const axiosClient = axios.create({
  baseURL: `${STATIC_HOST}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})
// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: { data: any }) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data
  },
  function (error: AxiosError ) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.status === 401) {
      // Đăng xuất người dùng và chuyển hướng sang trang đăng nhập
      // Xóa token khỏi localStorage hoặc thực hiện bất kỳ thao tác cần thiết để đăng xuất người dùng

      console.log("het han token")
    }
    return Promise.reject(error.response?.data)
  },
)

export default axiosClient
