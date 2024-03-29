import userApi from "@/api/userApi"
import { BillUser, PageConfig, RootBillUser } from "@/models"
import { Box, Divider, Pagination, Tab, Tabs } from "@mui/material"
import queryString from "query-string"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import BillItem from "./Components/BillItem"
export interface UserOrdersProps {}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}
export function UserOrders(props: UserOrdersProps) {
  const [tabs, setTabs] = React.useState(0)
  const location = useLocation() // Get the current location object
  const queryParams = queryString.parse(location.search) // Parse query parameters from the location
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<BillUser[]>([])
  const [rowCount, setRowCount] = useState(0)

  //table state
  const [status, setStatus] = useState<string>("ALL")
  const [pagination, setPagination] = useState<PageConfig>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [isDel, setIsDel] = useState(false)
  const [open, setOpen] = useState(false)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const tabLabels = ["ALL", "PENDING", "PROCESSING", "DELIVERED", "CANCELED"]
    setStatus(tabLabels[newValue])
    setTabs(newValue)
  }

  const handleOnChangePaging = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageIndex: value - 1,
    }))
  }
  const fetchData = async () => {
    try {
      if (status === "ALL") {
        const response = await userApi.getBill(pagination, null)
        const myRes = response as unknown as RootBillUser
        setInvoice(myRes.data)
        setRowCount(Math.ceil(myRes.totalRow/pagination.pageSize))
      } else {
        const response = await userApi.getBill(pagination, status)
        const myRes = response as unknown as RootBillUser
        setInvoice(myRes.data)
        setRowCount(Math.ceil(myRes.totalRow/pagination.pageSize))
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    
    fetchData()
  }, [status, pagination])

  return (
    <>
      <div className="mb-5">
        <h1 className="text-18-500">Đơn mua Của tôi</h1>
        <p className="text-[#999798]">
          Quản lý thông tin đơn mua xem lại, hủy đơn, đánh giá,..
        </p>
      </div>
      <Divider />
      <div style={{minHeight:"calc(100% - 95px)"}} className="flex flex-col gap-5">
        <Box>
          <Tabs
            value={tabs}
            variant="scrollable"
            scrollButtons="auto"
            sx={{"& .MuiTabs-scrollButtons.Mui-disabled": {
              opacity: 0.3,
            }}}
            onChange={handleChange}
          >
            <Tab label="Tất cả" {...a11yProps(0)} />
            <Tab label="Chờ xác nhận" {...a11yProps(1)} />
            <Tab label="Đang vận chuyển" {...a11yProps(2)} />
            <Tab label="Thành công" {...a11yProps(3)} />
            <Tab label="Đã hủy" {...a11yProps(4)} />
          </Tabs>
        </Box>
        <Box className="flex flex-1 justify-between flex-col gap-4 ">
          {invoice?.map((item) => (
            <BillItem onUpdate={fetchData} key={item.id} data={item}/>
          ))}
          {rowCount > 0 && (
            <div className="flex mt-1 items-center justify-center">
              <Pagination
                count={rowCount}
                color="primary"
                page={pagination.pageIndex + 1}
                onChange={handleOnChangePaging}
              />
            </div>
          )}
        </Box>
      </div>
    </>
  )
}
