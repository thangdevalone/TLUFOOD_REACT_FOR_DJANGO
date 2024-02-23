import axiosClient from "./axiosClient"

export const checkSv=(data:FormData)=>{
  return axiosClient.post("auth/check_thesv", data, {
    headers: {
      "Content-Type": "multipart/form-data", // Thêm đoạn này để đảm bảo dữ liệu được gửi dưới dạng FormData
    },
  })
}