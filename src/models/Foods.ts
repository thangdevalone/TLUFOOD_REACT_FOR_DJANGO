
export interface TypeFoodsData {
  id: number
  nameType: string
  imgType: string
}

export interface RestaurantData {
  id: number
  restaurantName: string
  quantitySold: number
  timeStart: string
  timeClose: string
  distance: number
  imgRes: string
  time: null
  detail: string
  star: number
}
export interface StoreDetailData {
  id: number
  create_date: string
  status: boolean
  restaurant_name: string
  quantity_sold: number
  distance: number
  star: number
  time_start: string
  time_close: string
  detail: string
  img_res: string
  toppingList: ToppingEntityList[]
  foods: foodData[]
}

export interface ToppingEntityList {
  id: number
  itemList: ItemToppingEntity[]
  status: boolean
  title: string
  requi: boolean
  restaurantEntityId: number
}

export interface ItemToppingEntity {
  name: string
  price: number
}
export interface foodData {
  id: number
  foodName: string
  price: number
  detail: string
  nameRestaurantFood: string
  imgFood: string
  createBy: string
  createAt: string
  quantityPurchased: number
  typeFoodEntityId: number
  toppingList: ToppingEntityList[]
  restaurantEntityId: number
  status: boolean
  distance: number
  nameType: string
}

export interface CartItemData {
  idFood: number
  name: string
  price: number
  quantity: number
  idStore: number
  distance: number
  nameStore: string
  type?: boolean
  imgFood: string
}

export interface FoodRoot {
  totalRow: number
  data: foodData[]
}
export interface TypeFoodRoot {
  nameType: string
  data: foodData[]
}
export interface ResFood {
  totalRow: number
  data: RestaurantData[]
}
