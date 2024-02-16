import { LoginForm } from "../models/LoginForm"
import { RegisterForm } from "../models/RegisterForm"
import axiosClient from "./axiosClient"

const authApi = {
  login(data: LoginForm) {
    const url = "auth/login"
    return axiosClient.post(url, data)
  },
  register(data: RegisterForm) {
    const url = "auth/register"
    return axiosClient.post(url, data)
  },
  hello() {
    const url = "auth/hello"
    return axiosClient.get(url)
  },
}
export default authApi
