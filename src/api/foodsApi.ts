import axiosClient from "./axiosClient"
import { PageConfig } from "@/models"

const foodsApis = {
  getRecommendFoods() {
    const url = "prod/rec-food"
    return axiosClient.get(url)
  },
  getTypeFoods() {
    const url = "prod/all-type"
    return axiosClient.get(url)
  },
  getRecommendRestaurants() {
    const url = "prod/rec-res"
    return axiosClient.get(url)
  },
  getDetailStore(id: number) {
    const url = `prod/detail-res/${id}`
    return axiosClient.get(url)
  },
  getDetailFood(id: number) {
    const url = `auth/get-detail-food?id=${id}`
    return axiosClient.post(url)
  },
  getDetailType(id: number) {
    const url = `prod/paging-food-type/${id}`
    return axiosClient.get(url)
  },
  searchFoods(search: string) {
    const url = `prod/search-food?searchString=${search}`
    return axiosClient.get(url)
  },
  pagingFood(page: PageConfig) {
    const url = `prod/paging-food?pageSize=${page.pageSize}&pageIndex=${page.pageIndex+1}`
    return axiosClient.get(url)
  },
  pagingRes(page: PageConfig) {
    const url = `prod/paging-res?pageSize=${page.pageSize}&pageIndex=${page.pageIndex+1}`
    return axiosClient.get(url)
  },
}

export default foodsApis
