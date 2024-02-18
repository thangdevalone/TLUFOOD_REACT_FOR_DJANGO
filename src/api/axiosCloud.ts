import axios from "axios"

const cloudAPI = {
  uploadImage(image: FormData) {
    const url = `https://api.cloudinary.com/v1_1/drussspqf/image/upload`
    return axios.post(url, image)
  },
}

export default cloudAPI
