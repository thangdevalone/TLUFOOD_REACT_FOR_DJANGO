import { Maybe } from "yup"

export interface InfoForm {
  sdt: string
  accountName: string
  img_user?: string
  msv: string
  email?: Maybe<string | undefined>
}
