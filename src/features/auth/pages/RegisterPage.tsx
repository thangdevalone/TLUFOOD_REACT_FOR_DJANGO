import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { InputField, PasswordField } from "@/components/FormControls"
import { RegisterForm } from "@/models"
import { yupResolver } from "@hookform/resolvers/yup"
import "./styles.css"
import { checkSv } from "@/api/checkSV"
import { LockOutlined } from "@mui/icons-material"
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import * as yup from "yup"
import { authActions } from "../AuthSlice"
import { TheSinhVien as TheSinhVienI } from "@/models/InfoForm"
import  TheSinhVien  from "./TheSinhVien"
export interface RegisterPageProps {}
const options = {
  apiKey: "public_W142iH1DTtrDZfdVtpSbfny5htLw", // This is your API key.
  maxFileCount: 1,
}
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" to="#">
        Iot soup
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  )
}

export function RegisterPage(props: RegisterPageProps) {
  const dispatch = useAppDispatch()
  const registering = useAppSelector((state) => state.auth.registering)
  const actionAuth = useAppSelector((state) => state.auth.actionAuth)
  const [msv, setMsv] = useState<string>("")
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const [checked, setChecked] = useState(false)
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }
  const schema = yup.object().shape({
    account_name: yup
      .string()
      .required("Hãy nhập tên đầy đủ của bạn")
      .test(
        "Họ và tên nên gồm 2 từ trở lên",
        "Họ và tên gồm 2 từ trở lên chỉ bao gồm chữ cái",
        (value) => {
          const words = value.trim().split(" ")
          return (
            words.length >= 2 &&
            words.every(
              (word) => !/\d[@#$%^&*()_+{}\[\]:;<>,.?~\\|/]/.test(word),
            )
          )
        },
      ),
    username: yup
      .string()
      .required("Nhập mã sinh viên")
      .test(
        "Mã sinh viên có đủ 5 chữ số",
        "Mã sinh viên phải bắt đầu bằng A và có 5 chữ số đằng sau",
        (values) => {
          return values.length === 6 && values[0] === "A"
        },
      )
      .matches(/^A\d{5}$/, "Mã sinh viên không hợp lệ"),
    sdt: yup
      .string()
      .required("Điền số điện thoại")
      .matches(phoneRegExp, "Số điện thoại không hợp lệ")
      .min(9, "Quá ngắn")
      .max(11, "Quá dài"),
    password: yup
      .string()
      .required("Nhập mật khẩu")
      .min(8, "Mật khẩu phải dài hơn 8 kí tự")
      .max(32, "Mật khẩu quá dài")
      .matches(/[A-Z]+/, "Mật khẩu cần ít nhất 1 kí tự in hoa")
      .matches(/[a-z]+/, "Mật khẩu cần ít nhất 1 kí tự in thường"),
    re_password: yup
      .string()
      .required("Nhập lại mật khẩu")
      .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
  })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [anaData,setAnaData]=useState<TheSinhVienI>()
  const form = useForm<RegisterForm>({
    defaultValues: { username: msv },
    resolver: yupResolver(schema),
  })
  const handleRegister: SubmitHandler<RegisterForm> = (data) => {
    const rsData: RegisterForm = {
      ...data,
      account_name: data.account_name.replace(/\s+/g, " ").trim(),
    }
    dispatch(authActions.register(rsData))
  }
  useEffect(() => {
    if (actionAuth == "Failed") {
      enqueueSnackbar("Mã sinh viên đã được sử dụng", {
        variant: "error",
      })
    }
  }, [actionAuth])
  const handleNextRes2=()=>{
    if(anaData ===undefined) return
    setMsv(anaData.msv)
    form.setValue("account_name",anaData.ho_ten)
    form.setValue("username",anaData.msv)
  }
  const handleNextRes = () => {
    if (!file) return
    const formData = new FormData()
    formData.append("image", file)
    ;(async () => {
      try {
        setLoading(true)
        const res = (await checkSv(formData)) as unknown as TheSinhVienI
        setAnaData(res)
        enqueueSnackbar("Phân tích ảnh thành công bấm tiếp tục để đăng kí",{variant:"success"})
      } catch (error) {
        console.log(error)
        enqueueSnackbar("Phân tích ảnh thất bại",{variant:"error"})
      } finally {
        setLoading(false)
      }
    })()
  }
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      const file = fileInputRef.current.files && fileInputRef.current.files[0]
      if (file) {
        setFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target) {
            setSelectedImage(e.target?.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }
  const [next,setNext]=useState(false)
  return (
    <div className="dot-backg min-h-[100vh] w-screen">
      {registering ||
        (loading && (
          <LinearProgress
            sx={{ position: "fixed", top: "0px", left: "0px", width: "100%" }}
          />
        ))}
      <Container component="main" maxWidth={msv?.length === 0 && !next ? "sm" : "xs"}>
        <>
          {msv?.length === 0 && !next ? (
            <div className="flex items-center flex-col pt-[15vh]">
              <p className="font-semibold text-center mb-2 text-xl">
                Đăng kí ngay với thẻ sinh viên
              </p>
              <p className="text-gray-500 text-center text-sm mb-10">
                Chúng tôi sẽ không lưu ảnh của bạn, chỉ sử dụng để xác minh bạn
                có phải là sinh viên Thăng Long hay không. Do đây là chương
                trình thử nghiệm nên bạn có thể bấm bỏ qua
              </p>

              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <div className="flex flex-row gap-2">
                  <Button
                    variant="contained"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                  >
                    Tải Ảnh Lên
                  </Button>
                  <Button variant="outlined" onClick={()=>setNext(true)}>
                    Bỏ qua
                  </Button>
                </div>
                <br />
             <div className="flex flex-row gap-3">
             {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    style={{ maxWidth: "300px" }}
                  />
                )}
                {anaData && (       
                  <TheSinhVien data={anaData}/>
                )}
             </div>
              </div>
              {selectedImage && !anaData && (
                <Button
                  variant="outlined"
                  disabled={loading}
                  onClick={handleNextRes}
                  sx={{ mt: 2 }}
                >
                  Phân tích ảnh
                </Button>
              )}
              {
                anaData&&(
                  <Button
                  variant="outlined"
                  disabled={loading}
                  onClick={handleNextRes2}
                  sx={{ mt: 2 }}
                >
                  Tiếp tục với đăng kí
                </Button>
                )
              }
              <p className="text-gray-500 text-sm text-center mt-5">
                Ảnh phải rõ ràng không mờ, và đầy đủ mã sinh viên, mã vạch,..
                <a
                  href="https://ik.imagekit.io/TLIT/slug_dEDE-5Ajd.jpg?updatedAt=1697391726021"
                  target="_blank"
                  className="underline text-blue-500"
                >
                  Ví dụ (Bấm để xem - Có che chủ thẻ)
                </a>
                . Nếu trường hợp bị sai mã sinh viên vui lòng F5 để thực hiện
                lại
              </p>
            </div>
          ) : (
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlined />
              </Avatar>
              <Typography component="h1" variant="h5">
                Đăng ký (Sinh viên)
              </Typography>
              <FormProvider {...form}>
                <Box
                  component="form"
                  onSubmit={form.handleSubmit(handleRegister)}
                  sx={{ mt: 2 }}
                >
                  <InputField name="account_name" label="Họ và tên" />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <InputField
                        name="username"
                        disabled={Boolean(msv && msv?.length !== 0)}
                        label="Mã sinh viên"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputField name="sdt" label="Số điện thoại" />
                    </Grid>
                  </Grid>

                  <PasswordField name="password" label="Mật khẩu" />
                  <PasswordField name="re_password" label="Nhập lại mật khẩu" />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label={
                      <span>
                        Tôi đã đọc và đồng ý với{" "}
                        <a
                          target="_blank"
                          href="https://docs.google.com/document/d/1AzgImd9LS0Vs1wTFTgnxc51V4ETVlph7FeryDaOox_M/edit?usp=sharing"
                          style={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          Điều khoản và Chính sách bảo mật
                        </a>
                      </span>
                    }
                  />
                  <Button
                    type="submit"
                    disabled={registering || !checked}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Đăng ký
                  </Button>

                  <Grid container>
                    <Grid item xs></Grid>
                    <Grid item>
                      <Link
                        to="/login"
                        style={{
                          color: "blue",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {"Bạn đã có tài khoản? Đăng nhập"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </FormProvider>
            </Box>
          )}
        </>
        <Copyright sx={{ mt: 6, mb: 4 }} />
      </Container>
    </div>
  )
}
