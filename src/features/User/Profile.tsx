import userApi from "@/api/userApi"
import { useAppDispatch } from "@/app/hooks"
import { InputField } from "@/components/FormControls"
import { useInforUser } from "@/hooks"
import { InfoUserChange, UserInfo } from "@/models"
import { InfoForm } from "@/models/InfoForm"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  Grid,
  TextField,
} from "@mui/material"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { useSnackbar } from "notistack"
import * as React from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"
import { authActions } from "../auth/AuthSlice"
import cloudAPI from "@/api/axiosCloud"

export interface ProfileProps {}

export function Profile(props: ProfileProps) {
  const user = useInforUser()
  const { enqueueSnackbar } = useSnackbar()
  const [file, setFile] = React.useState<File | null>(null)
  const imgRef = React.useRef<HTMLInputElement | null>(null)
  const [otpValue, setOptValue] = React.useState<string>("")
  const [pw, setPw] = React.useState<string>("")
  const [openPw, setOpenPw] = React.useState<boolean>(false)
  const [userInfo, setUserInfo] = React.useState<UserInfo>()
  const [checkUpdateUser, setCheckUpdateUser] = React.useState<string[]>(["a"])
  const [image, setImage] = React.useState<string>(user?.img_user || '')

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target
    if (inputElement.files) {
      const images = new FormData()
      const selectedFiles = inputElement.files
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        images.append("file", file)
        images.append("upload_preset", "oksl1k1o")
        try {
          const response = await cloudAPI.uploadImage(images)
          if (response.status === 200) {
            setImage(response.data.secure_url)
          }
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  const [payload, setPayload] = React.useState({
    name: "",
    sdt: "",
    email: "",
  })
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const schema = yup.object().shape({
    msv: yup.string().required("Vui lòng nhập mã sinh viên của bạn !"),
    email: yup.string().notRequired().email("Vui lòng nhập đúng định dạng !"),
    accountName: yup
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
    sdt: yup
      .string()
      .required("Điền số điện thoại")
      .matches(phoneRegExp, "Số điện thoại không hợp lệ")
      .min(9, "Quá ngắn")
      .max(11, "Quá dài"),
  })

  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit: SubmitHandler<InfoForm> = async (data) => {
    try {
      const dataNew = {
        email: data.email || "",
        account_name: data.accountName,
        sdt: data.sdt,
        img_user: image,
      }
      handleSendOtp(dataNew)
    } catch (error) {
      console.log(error)
    }
  }
  const dispatch = useAppDispatch()

  const handleSendOtp = async (data: InfoUserChange) => {
    setLoading(true)
   try {
     const res = await userApi.sendOtpChangeInfoUser(data, user?.id + "")
   } catch (error) {
    enqueueSnackbar("Bạn nhập OTP sai vui lòng thử lại !", {
      variant: "error",
    })
   }
    
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    // confirmOtp(otpValue)
    await userApi
      .finalOtpChangeInfoUser(otpValue)
      .then((res: any) => {
        enqueueSnackbar("Thay đổi thành công !", {
          variant: "success",
        })
        dispatch(authActions.updateInfor(res))
        setLoading(false)
        setOpen(false)
      })
      .catch(() => {
        setLoading(false)
        enqueueSnackbar("Bạn nhập OTP sai vui lòng thử lại !", {
          variant: "error",
        })
        setOptValue('')
      })
  }

  const form = useForm<InfoForm>({
    defaultValues: {
      accountName: userInfo?.accountName || user?.account_name,
      sdt: userInfo?.sdt || user?.sdt,
      msv: userInfo?.username || user?.username,
      email: userInfo?.email || user?.email || undefined,
    },
    resolver: yupResolver(schema),
  })

  React.useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const response = await userApi.getUserInfo()
        if (response.status) {
          setUserInfo(response.data)
          setImage(response.data.img || user?.img_user || "")
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchDataUser()
  }, [checkUpdateUser])

  return (
    <div className="relative w-full">
      <div className="mb-5">
        <h1 className="text-18-500">Hồ Sơ Của Tôi</h1>
        <p className="text-[#999798]">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
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
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <Grid container columnSpacing={2}>
                <Grid item xs={12} sm={6}>
                  <InputField label="Tên của bạn" name="accountName" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField label="Mã sinh viên" name="msv" disabled />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField label="Số điện thoại" name="sdt" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    label="Email"
                    name="email"
                    disabled={user?.email?.length ? true : false}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px" }}
                disabled={loading}
              >
                Lưu
              </Button>
            </form>
          </FormProvider>
        </Container>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Box className="flex items-center justify-center flex-col w-[250px]">
          <input
            ref={imgRef}
            hidden={true}
            type="file"
            id="imageInput"
            onChange={(e) => handleFiles(e)}
            name="imageInput"
            accept="image/png, image/jpeg"
          ></input>
          <Avatar
            variant="circular"
            alt="avatar"
            sx={{ width: "100px", height: "100px", mr: 1, mb: 3 }}
            src={image}
            onClick={() => {
              imgRef.current?.click()
            }}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              imgRef.current?.click()
            }}
          >
            Chọn ảnh
          </Button>
        </Box>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Vui lòng kiểm tra gmail để lấy mã OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="OTP"
            type="email"
            fullWidth
            variant="standard"
            style={{ width: "20vw" }}
            value={otpValue}
            onChange={(e) => setOptValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleConfirm}>Xác Nhận</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
