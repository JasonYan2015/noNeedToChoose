import { cloud } from "@tarojs/taro";

if (process.env.TARO_ENV === "weapp") {
  cloud.init({
    env: "prod-8gh7tzsa12ad7e1b",
  });
}
const DB = process.env.TARO_ENV === "weapp" ? cloud.database() : undefined;

export { DB };
