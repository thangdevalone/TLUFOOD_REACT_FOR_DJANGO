import userApi from "@/api/userApi"
import { PasswordField } from "@/components/FormControls"
import { useInforUser } from "@/hooks"
import { UpdatePassWord } from "@/models"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Divider,
} from "@mui/material"
import { useSnackbar } from "notistack"
import React, { useRef } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"

export interface ChangePasswordProps {}

export function ChangePassword(props: ChangePasswordProps) {
  const schema = yup.object().shape({
    current_password: yup.string().required("Vui lòng nhập mật khẩu cũ !"),
    new_password: yup
      .string()
      .required("Vui lòng nhập mật khẩu mới !")
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"),
    confirm_password: yup
      .string()
      .required("Vui lòng xác nhận mật khẩu mới !")
      .oneOf(
        [yup.ref("newPassword"), ""],
        "Mật khẩu xác nhận không trùng khớp với mật khẩu mới",
      ),
  })
  const user = useInforUser()
  const formRef = useRef<any>(null)
  const form = useForm<UpdatePassWord>({
    resolver: yupResolver(schema),
  })
  const [loading, setLoading] = React.useState<boolean>(false)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const reset = () => {
    if (formRef.current) {
      formRef.current.reset()
    }
  }
  const handleSubmitChangePw: SubmitHandler<UpdatePassWord> = async (data) => {
    try {
      setLoading(true)
      await userApi
        .changePasswordUser(user?.username || "", data)
        .then(() => {
          setLoading(false)
          reset()
          navigate("/user/profile")
          enqueueSnackbar("Đổi mật khẩu thành công !", {
            variant: "success",
          })
        })
        .catch(() => {
          setLoading(false)
          enqueueSnackbar("Đổi mật khẩu thất bại !", {
            variant: "error",
          })
        })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className="mb-5">
        <h1 className="text-18-500">Thay đổi mật khẩu</h1>
      </div>
      <Divider />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="flex mt-5">
        <Container className="!pl-0">
          <FormProvider {...form}>
            <form
              ref={formRef}
              style={{ display: "flex", flexDirection: "column" }}
              className="flex items-center justify-center"
              onSubmit={form.handleSubmit(handleSubmitChangePw)}
            >
              <PasswordField label="Mật khẩu cũ" name="current_password" />
              <PasswordField label="Mật khẩu mới" name="new_password" />
              <PasswordField
                label="Nhập lại mật khẩu mới"
                name="confirm_password"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px", width: "100%" }}
                // onClick={() =>
                //   handleSubmitChangePw({
                //     current_password: form.getValues("current_password"),
                //     new_password: form.getValues("new_password"),
                //     confirm_password: form.getValues("confirm_password"),
                //   })
                // }
              >
                Lưu
              </Button>
            </form>
          </FormProvider>
        </Container>
      </div>
    </>
  )
}
