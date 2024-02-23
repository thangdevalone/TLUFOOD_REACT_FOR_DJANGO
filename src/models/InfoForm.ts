import { Maybe } from "yup"

export interface InfoForm {
  sdt: string
  accountName: string
  img_user?: string
  msv: string
  email?: Maybe<string | undefined>
}
export interface TheSinhVien{
  username(arg0: string, username: any): unknown
  nganh:string
  ho_ten:string
  ngay_sinh:string
  ma_nganh:string
  nam_hoc:string
  msv:string
}