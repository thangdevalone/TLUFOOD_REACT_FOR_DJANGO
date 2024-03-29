import { User } from "."

export interface searchRoot {
  id: number
  title: string
}

export interface ProductRoot {
  totalRow: number
  data: ProductItem[]
}
export interface VoucherRoot {
  totalRow: number
  data: VoucherItem[]
}

export interface RestaurantRoot {
  totalRow: number
  responList: TypeRestaurant[]
}

export interface ProductItem {
  id: number
  foodName: string
  price: number
  detail: string | null
  nameRestaurantFood: string
  imgFood: string
  distance: number | null
  time: number
  star: number
  quantity: number
  createBy: string | null
  createAt: string | null
  quantityPurchased: number
  typeFoodEntityId: number
  restaurantEntityId: number
  status: boolean | null
}

export interface TypeRoot {
  data: TypeItem[]
  totalRow: number
}
export interface TypeItem {
  id: number
  imgType: string | null
  nameType: string
  status: string | null
}

export interface TypeRestaurant {
  id: number
  restaurantName: string
  quantitySold: number
  timeStart: string
  timeClose: string
  distance: number
  phoneNumber: string
  address: string
  imgRes: string
  time: null
  detail: string
  star: number
}
export interface VoucherItem {
  id: number
  create_by: string
  create_date: string
  status: boolean
  detail: string
  expired: string
  quantity: number
  discount: number
  title: string
  code: string
  createAt: string
}
export interface RoleUser {
  id: number
  createDate: any
  status: any
  authority: string
}

export interface UserItem {
  id: number
  role: RoleUser[]
  token: any
  sdt: string
  accountName: string
  imgUser: string
  msv: string
}

export interface InvoiceRoot {
  totalRow: number
  data: BillUser[]
}

export interface FoodResponseBill {
  foodId: number
  nameFood: string
  priceFood: number
  quantity: number
  nameRes: string
  resId: number
  item_list: ItemTopping[]
}

export interface ItemTopping {
  name: string
  price: number
}
export interface VoucherResponseBill {
  code: string
  discount: number
  expired: string
  createDate: string
}
export interface BillUser {
  id: number
  accountName:string,
  create_date: string
  orderStatus: "PENDING"| "PROCESSING"|"DELIVERED"|"CANCELED"
  ship_fee: number
  finish_time: string
  user?:User
  accountId: number
  total_amount: number
  note: string
  voucherResponseBill: string
  foodResponseBills: FoodResponseBill[]
}

export interface RootBillUser {
  totalRow: number
  data: BillUser[]
}
