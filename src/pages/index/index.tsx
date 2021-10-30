import Taro, { useDidShow } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { useCallback, useEffect, useState } from 'react'
import {commonDescription} from '@/constants/food'
import { useRandomList } from '@/model/list'
import { useShare } from '@/utils/share'

import { bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14, bg15, bg16, bg17, bg18, bg19 } from '@/assets/foodIcon'
import './index.less'

const splitArrayIntoTwo: <T>(arr: T[], size: number) => T[][] = (arr, size) => {
  const res = []
  const remaining = arr.slice()

  const getRandomIndex = (scope) => Math.floor(Math.random() * scope)
  while (res.length < size) {
    const randomIndex = getRandomIndex(remaining.length)
    const movingItem = remaining[randomIndex]
    remaining.splice(randomIndex, 1)
    res.push(movingItem)
  }

  return [res, remaining]
}

const BG_ICON_LIST = [ bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14, bg15, bg16, bg17, bg18, bg19 ]
const BG_ICON_LIST_SIDE_LENGTH = Math.floor(BG_ICON_LIST.length / 2)

const getRandom = (list) => {
  const foodLength = list.length
  const index = Math.floor(Math.random() * foodLength)
  return list[index]
}
const getDescriptionRandom = () => getRandom(commonDescription)

const FC = () => {
  /**
   * 刚打开的指引
   */
   const [needWelcome, setNeedWelcome] = useState(true)

  /**
   * 分享
   */
  useShare({
    title: '今天吃什么？',
    path: 'pages/index/index'
  })

  /**
   * 初始化食物列表
   */
  const {randomList, refreshRandomList} = useRandomList()
  const getFoodRandom = useCallback(() => getRandom(randomList), [randomList])
  useDidShow(() => {
    refreshRandomList()
  })

  /**
   * 摇一个食物、描述
   */
  const [food, setFood] = useState(getFoodRandom())
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState(getDescriptionRandom())
  useEffect(() => {
    const newFood = getFoodRandom()
    setFood(newFood)
  }, [setFood, getFoodRandom])
  useEffect(() => {
    setDescription(getDescriptionRandom())
  }, [food])

  /**
   * 摇
   */
  const reRandom = useCallback(() => {
    const newRandom = getFoodRandom()
    setFood(newRandom)
  }, [setFood, getFoodRandom])

  /**
   * 摇 时钟
   * 66ms
   */
  const [clock, setClock] = useState<any>()
  const startInterval = useCallback(() => {
    setClock(setInterval(() => {
      reRandom()
    }, 66))
    return () => clearInterval(clock)
  }, [clock, reRandom])

  /**
   * 开始摇
   * 点击事件
   */
  const handleClick = useCallback(() => {
    if (clock) return
    setLoading(true)
    startInterval()
  }, [clock, startInterval])

  /**
   * “就它了”
   */
  const handleStop = useCallback(() => {
    clearInterval(clock)
    setClock(undefined)
    setLoading(false)
  }, [setClock, clock])

  /**
   * 自定义随机池
   */
  const handleDIY = () => {
    Taro.navigateTo({
      url: '/pages/new/index'
    })
  }

  /**
   * 跳转美团
   */
  const goOrder = () => {
    Taro.navigateToMiniProgram({
      appId: 'wxde8ac0a21135c07d',
      path: '/index/pages/h5/h5?lch=cps:waimai:5:0997d7a7f07d93647eaa3d8d92b3a94f:chidianshahaone:33:139764&weburl=https%3A%2F%2Fdpurl.cn%2FUcGpvGQz&f_userId=1&f_token=1',
      success: function(res) {
        // 打开成功
        console.log('🚧 || res', res);
      }
    })
  }

  /**
   * 背景美食列表
   */
  const [bgLeftList, setBgLeftList] = useState([] as any[])
  const [bgRightList, setBgRightList] = useState([] as any[])
  useEffect(() => {
    const [left, right] = splitArrayIntoTwo(BG_ICON_LIST, BG_ICON_LIST_SIDE_LENGTH)
    setBgLeftList(left)
    setBgRightList(right)
  }, [])


  return <View className='container'>

    {/* 背景 */}
    <View className="background">
      <View className="left">
        {bgLeftList.map(item => <Image className="img" key={item} mode="aspectFit" src={item} />)}
      </View>
      <View className="right">
      {bgRightList.map(item => <Image className="img" key={item} mode="aspectFit" src={item} />)}
      </View>
    </View>

    {/* 引导区 */}
    {needWelcome ? <View className="welcome-container">

    </View> : null}

    {!needWelcome ? <View className="result-container">
      {/* 结果和描述 */}
      <View className='body'>
        <View className={`content ${loading ? 'loading' : null}`}>{food?.name || '🤯 没啥好吃了'}</View>
        {!loading ? <View className='description'>{food?.description || description}</View> : null}
      </View>

      {/* 底部操作区 */}
      <View className='footer'>
        <View className='btn-group'>
          {!loading ? <Button className='button primary' onClick={goOrder}>🍻 优惠点餐</Button> : null}
          <Button className={`button ${!loading ? 'start' : 'stop'}`} onClick={!loading ? handleClick : handleStop}>
            {!loading ? '🤔 换一个' : '🤟 就它了'}
          </Button>
          {/* {!loading
            ? <Button className='button' onClick={handleClick}>🤔 换一个</Button>
            : <Button className='button' onClick={handleStop}>🤟 就它了</Button>
          } */}
          <View className='link fix-foot' onClick={handleDIY}>定制我的随机池</View>
        </View>
      </View>
    </View> : null}
  </View>
}

export default FC