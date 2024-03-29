import foodsApis from "@/api/foodsApi"
import { FoodRoot, foodData } from "@/models"
import { Box, Grid } from "@mui/material"
import * as React from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { ItemFood } from "@/components/Common"

export interface RecommendFoodProps {}

export function PagingFood(props: RecommendFoodProps) {
  const [data, setData] = React.useState<foodData[]>([])
  const [pageIndex, setPageIndex] = React.useState<number>(0)
  const [hasMore, setHasMore] = React.useState<boolean>(true)

  const fetchData = async () => {
    const response = await foodsApis.pagingFood({
      pageIndex,
      pageSize: 10,
    })
    if (response?.status) {
      const myFood = response as unknown as FoodRoot
      const newData = [...data, ...myFood.data]
      setData(newData)
      if (newData.length >= myFood.totalRow) {
        setHasMore(false)
      } else {
        setPageIndex(pageIndex + 1)
      }
    }
  }

  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!scrollContainerRef.current) return

    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current
      if (!scrollContainer) return
      const scrollTop = scrollContainer.scrollTop
      const scrollHeight = scrollContainer.scrollHeight
      const clientHeight = scrollContainer.clientHeight
      if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore) {
        fetchData()
      }
    }
    const scrollContainer = scrollContainerRef.current
    scrollContainer?.addEventListener("scroll", handleScroll)
    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll)
    }
  }, [hasMore])

  return (
    <Box
      className={`flex items-center justify-center mb-5`}
      ref={scrollContainerRef}
    >
      <Grid
        container
        sx={{
          "& .infinite-scroll-component__outerdiv": {
            width: "100%",
          },
          width: "100%",
          ml: "0px",
        }}
        columnSpacing={{ xs: 0, sm: 3, md: 4 }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          <Grid container spacing={{ xs: 2, sm: 1, md: 2, lg: 3 }}>
            {data?.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={item.id}
                className=""
              >
                <ItemFood
                  idFood={item.id}
                  detail={item.detail}
                  imgFood={item.imgFood}
                  idRes={item.restaurantEntityId}
                  toppingList={item.toppingList}
                  foodName={item.foodName}
                  price={item.price}
                  distance={item.distance || 0}
                  qSold={item.quantityPurchased || 0}
                  nameStore={item.nameRestaurantFood}
                  idStore={item.restaurantEntityId}
                  typeFoodEntityId={item.typeFoodEntityId}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </Grid>
    </Box>
  )
}
