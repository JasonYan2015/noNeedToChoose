import { caculateEarnings, toFixed } from '@/utils/number';
import { View } from '@tarojs/components';
import React, { cloud } from '@tarojs/taro'
import { useEffect, useState } from 'react';
import './index.less';

const testData = {
  "result": {
    "result": {
      "Datas": [
        {
          "FCODE": "003494",
          "SHORTNAME": "富国天惠成长混合C",
          "PDATE": "2022-01-21",
          "NAV": "3.3220",
          "ACCNAV": "3.6270",
          "NAVCHGRT": "-0.85",
          "GSZ": "3.3319",
          "GSZZL": "-0.55",
          "GZTIME": "2022-01-21 15:00",
          "NEWPRICE": null,
          "CHANGERATIO": null,
          "ZJL": null,
          "HQDATE": null,
          "ISHAVEREDPACKET": false
        },
        {
          "FCODE": "005827",
          "SHORTNAME": "易方达蓝筹精选混合",
          "PDATE": "2022-01-21",
          "NAV": "2.5895",
          "ACCNAV": "2.5895",
          "NAVCHGRT": "0.72",
          "GSZ": "2.5858",
          "GSZZL": "0.57",
          "GZTIME": "2022-01-21 15:00",
          "NEWPRICE": null,
          "CHANGERATIO": null,
          "ZJL": null,
          "HQDATE": null,
          "ISHAVEREDPACKET": false
        },
        {
          "FCODE": "003095",
          "SHORTNAME": "中欧医疗健康混合A",
          "PDATE": "2022-01-21",
          "NAV": "2.7070",
          "ACCNAV": "2.9450",
          "NAVCHGRT": "-2.03",
          "GSZ": "2.7333",
          "GSZZL": "-1.08",
          "GZTIME": "2022-01-21 15:00",
          "NEWPRICE": null,
          "CHANGERATIO": null,
          "ZJL": null,
          "HQDATE": null,
          "ISHAVEREDPACKET": false
        },
        {
          "FCODE": "290011",
          "SHORTNAME": "泰信中小盘精选混合",
          "PDATE": "2022-01-21",
          "NAV": "4.2290",
          "ACCNAV": "4.4890",
          "NAVCHGRT": "-2.51",
          "GSZ": "4.2655",
          "GSZZL": "-1.67",
          "GZTIME": "2022-01-21 15:00",
          "NEWPRICE": null,
          "CHANGERATIO": null,
          "ZJL": null,
          "HQDATE": null,
          "ISHAVEREDPACKET": false
        },
        {
          "FCODE": "398051",
          "SHORTNAME": "中海环保新能源混合",
          "PDATE": "2022-01-21",
          "NAV": "2.6240",
          "ACCNAV": "2.9110",
          "NAVCHGRT": "-0.57",
          "GSZ": "2.6353",
          "GSZZL": "-0.14",
          "GZTIME": "2022-01-21 15:00",
          "NEWPRICE": null,
          "CHANGERATIO": null,
          "ZJL": null,
          "HQDATE": null,
          "ISHAVEREDPACKET": false
        }
      ],
      "ErrCode": 0,
      "Success": true,
      "ErrMsg": null,
      "Message": null,
      "ErrorCode": "0",
      "ErrorMessage": null,
      "ErrorMsgLst": null,
      "TotalCount": 5,
      "Expansion": {
        "GZTIME": "2022-01-21",
        "FSRQ": "2022-01-21"
      }
    },
    "openid": "oFoIM5rPr9JFdmfYumvfwTckv8oc",
    "appid": "wx3ea38674871ccb59"
  },
  "requestID": "local_debug_1642858836590-0.32074202738950475"
}

interface FundItem {
  name: string
  code: string
  price: string // 今日估值
  percent: string // 当日估值没有取前日（海外基）
  yestpercent: string
  yestclose: string // 昨日净值
  earnings: number // 盈亏
  isUpdated: string // // 判断闭市的时候
  amount: number // 持仓金额
  unitPrice: number // 成本价
  priceDate: number
  earningPercent: number // 收益率
  t2: boolean // 海外基金t2
  time: string // 更新时间
  showEarnings: boolean
  yestPriceDate: string
}

const FC: React.FC = () => {
  const [data, setData] = useState<FundItem[]>([])

  const fundCodes = [
    "003494",
    "005827",
    "003095",
    "290011",
    "398051"
  ]
  useEffect(() => {
    // const res = testData
    cloud.callFunction({
      name: 'getFundInfo',
      data: {fundCodes},
      success: (res) => {
        const {Datas, Success} = res?.result?.result || []

        if (!Success) {
          return Taro.showToast({title: '请求基金数据失败'})
        }
        const fundAmountObj: any = {};
        const keyLength = Object.keys(fundAmountObj).length;
        const formatedData = Datas.map((item: any) => {
          const { SHORTNAME, FCODE, GSZ, NAV, PDATE, GZTIME, GSZZL, NAVCHGRT } = item;
          const time = item.GZTIME.substr(0, 10);
          const isUpdated = item.PDATE.substr(0, 10) === time;
          let earnings = 0;
          let amount = 0;
          let unitPrice = 0;
          let earningPercent = 0;
          let profitPercent = 0;
          let priceDate = '';
          // 不填写的时候不计算
          if (keyLength) {
            amount = fundAmountObj[FCODE]?.amount || 0;
            unitPrice = fundAmountObj[FCODE]?.unitPrice || 0;
            priceDate = fundAmountObj[FCODE]?.priceDate || '';
            const price = fundAmountObj[FCODE]?.price || 0;
            const yestEarnings = fundAmountObj[FCODE]?.earnings || 0;
            const latestProfit = caculateEarnings(amount, price, GSZ);
            // 闭市的时候显示上一次盈亏
            earnings = amount === 0 ? 0 : isUpdated ? yestEarnings : latestProfit;
            profitPercent = (price - unitPrice) / unitPrice;
            // 收益率
            earningPercent = toFixed(profitPercent, 2, 100);
          }

          const obj = {
            name: SHORTNAME,
            code: FCODE,
            price: GSZ, // 今日估值
            percent: Number.isNaN(Number(GSZZL)) ? NAVCHGRT : GSZZL, // 当日估值没有取前日（海外基）
            yestpercent: NAVCHGRT,
            yestclose: NAV, // 昨日净值
            earnings: toFixed(earnings), // 盈亏
            isUpdated,
            amount, // 持仓金额
            unitPrice, // 成本价
            priceDate,
            earningPercent, // 收益率
            t2: GSZZL === '--' ? true : false, // 海外基金t2
            time: GSZZL === '--' ? PDATE : GZTIME, // 更新时间
            showEarnings: keyLength > 0 && amount !== 0,
            yestPriceDate: PDATE,
          };
          return obj;
        });

        console.log('🚧 || formatedData', formatedData);
        setData(formatedData)
      },
      fail: console.error
    })
  }, [])

  return <View className='container'>
    {data.map(fund => {
      return <View className='fund-container' key={fund.code}>
        <View className="left">
          <View className="title">{fund.name}</View>
          <View className="update-time">更新时间：{fund.time}</View>
        </View>
        <View className="right">
          <View className={`percent ${Number(fund.percent) >= 0 ? 'up' : 'down'}`}>{fund.percent}%</View>
          <View className="price">¥{fund.price}</View>
        </View>
      </View>
    })}
  </View>
}

export default FC