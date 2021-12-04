import { cloud } from "@tarojs/taro";

cloud.init({
  env: 'prod-8gh7tzsa12ad7e1b'
})
export const DB = cloud.database()

