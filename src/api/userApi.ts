import { BillConfig, PageConfig } from "./../models/Config"
import { ForgotPassword, ChangePassword } from "@/models/ForgotForm"
import { UpdateInformationUser, InfoUserChange, UpdatePassWord } from "@/models"
import axiosClient from "./axiosClient"

const userApi = {
  getAllVoucher() {
    const url = `auth/vouchers`
    return axiosClient.get(url)
  },
  getBill(page: PageConfig, status: string | null) {
    if (status) {
      const url = `payment/bill?pageIndex=${page.pageIndex+1}&pageSize=${page.pageSize}&orderStatus=${status}`
      return axiosClient.get(url)
    }
    const url = `payment/bill?pageIndex=${page.pageIndex+1}&pageSize=${page.pageSize}`
    return axiosClient.get(url)
  },
  cancelBill(id: number) {
    const url = `payment/bill?id=${id}`
    return axiosClient.patch(url)
  },
  forgotPassword(name: string) {
    // gửi otp quên mk
    const url = `auth/forgot-pass?username=${name}`
    return axiosClient.post(url)
  },
  verifyEmail(email: string) {
    // gửi otp để xác thực gmail
    const url = `user/verify-email?email=${email}`
    return axiosClient.post(url)
  },
  validate(otp: string) {
    // kiểm tra otp xác thực gmail
    const url = `user/validate-otp?otp=${otp}`
    return axiosClient.post(url)
  },
  finalOtpForgot(otp: string, username: string) {
    const url = "auth/validate-otp-forgot-pass"
    return axiosClient.post(url, { otp: otp, username: username })
  },
  finalPassword(data: ChangePassword) {
    const url = "auth/change-password"
    return axiosClient.post(url, data)
  },
  updateUserInformation(data: UpdateInformationUser) {
    const formData = new FormData()
    formData.append("password", data.password)
    if (data.newPassword !== null) {
      formData.append("newPassword", data.newPassword)
    }
    if (data.img !== null) {
      formData.append("img", data.img)
    }
    if (data.sdt !== null) {
      formData.append("sdt", data.sdt)
    }
    if (data.accountName !== null) {
      formData.append("accountName", data.accountName)
    }
    const url = "user/update-user-info"
    return axiosClient.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  getUserInfo() {
    const url = "user/get-user-info"
    return axiosClient.get(url)
  },

  sendOtpChangeInfoUser(data: InfoUserChange, idUser: string) {
    const url = `auth/update-info-user/${idUser}`
    return axiosClient.post(url, data)
  },
  finalOtpChangeInfoUser(otp: string) {
    const url = `auth/final-update-info-user/${otp}`
    return axiosClient.post(url)
  },
  forgotPasswordUser(username: string) {
    const url = `auth/forgot-password/${username}`
    return axiosClient.post(url)
  },
  changePasswordUser(username: string, data: UpdatePassWord) {
    const url = `auth/change-password/${username}`
    return axiosClient.post(url, data)
  },
}
export default userApi
