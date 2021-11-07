import Taro, { useDidShow, reportAnalytics, showActionSheet } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {COMMON_DESCRIPTION, SENTENCE_LIST} from '@/constants/food'
import { useRandomList } from '@/model/list'
import { useShare } from '@/utils/share'
import elipsisImage from '@/assets/elipsis.png'

import { bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14, bg15, bg16, bg17, bg18, bg19 } from '@/assets/foodIcon'
import './index.less'

const getRandomIndex = (length) => Math.floor(Math.random() * length)
const splitArrayIntoTwo: <T>(arr: T[], size: number) => [T[], T[]] = (arr, size) => {
  const res = []
  const remaining = arr.slice()

  while (res.length < size) {
    const randomIndex = getRandomIndex(remaining.length)
    const movingItem = remaining[randomIndex]
    remaining.splice(randomIndex, 1)
    // @ts-ignore-next-line
    res.push(movingItem)
  }

  return [res, remaining]
}

const getGreetings = () => {
  const currentHour = dayjs().hour()
  if (currentHour < 11) return '上午好'
  else if (currentHour > 18) return '晚上好'
  else if (currentHour > 14) return '下午好'
  else return '中午好'
}

const BG_ICON_LIST = [ bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14, bg15, bg16, bg17, bg18, bg19 ]
const BG_ICON_LIST_SIDE_LENGTH = Math.floor(BG_ICON_LIST.length / 2)

const getRandom = (list) => {
  const foodLength = list.length
  const index = Math.floor(Math.random() * foodLength)
  return list[index]
}
const getDescriptionRandom = () => getRandom(COMMON_DESCRIPTION)

const useClock = () => {
  const [clock, setClock] = useState<any>()
  const clearClock = useCallback(() => {
    clearInterval(clock)
    setClock(undefined)
  }, [clock, setClock])
  return {
    clock,
    setClock,
    clearClock
  }
}

const FC = () => {
  /**
   * 刚打开的指引
   */
  const [needWelcome, setNeedWelcome] = useState(false)
  /**
   * 摇的次数
   */
  const [count, setCount] = useState(1)
  /**
   * 时钟
   */
  const {clock, setClock, clearClock} = useClock()

  /**
   * 初始化食物列表
   */
  const {randomList, refreshRandomList, setRandomList} = useRandomList()
  const getFoodRandom = useCallback(() => getRandom(randomList), [randomList])
  useDidShow(() => {
    console.log('~~~~~~~~~~~~~~~~~~~~~~ refresh');
    refreshRandomList()
  })

  /**
   * 摇一个食物、描述、出现的食物底图
   */
  const [food, setFood] = useState(getFoodRandom())
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState(getDescriptionRandom())
  const [bgRandomIndex, setBgRandomIndex] = useState(-1)
  useEffect(() => {
    const newFood = getFoodRandom()
    setFood(newFood)
  }, [setFood, getFoodRandom])
  useEffect(() => {
    setDescription(getDescriptionRandom())
  }, [food])

  /**
   * 分享
   */
   useShare({
    title: needWelcome || !food?.name ? '今天吃什么？' : `今天吃${food?.name}？`,
    path: 'pages/Index/index',
  })

  /**
   * 摇
   */
  const reRandom = useCallback((tk, setTk) => {
    const newRandom = getFoodRandom()
    setFood(newRandom)

    const steps = tk / 5
    if (steps > BG_ICON_LIST.length) {
      setTk(0)
    }
    const newBgIndex = Math.floor(steps)
    setBgRandomIndex(newBgIndex)
  }, [setFood, getFoodRandom])

  /**
   * 摇 时钟
   * 66ms
   */
  const startInterval = useCallback(() => {
    let tk = 0
    const setTk = (t) => tk = t
    setClock(setInterval(() => {
      tk++;
      reRandom(tk, setTk)
    }, 66))
    return clearClock
  }, [setClock, clearClock, reRandom])

  /**
   * 开始摇
   * 点击事件
   */
  const handleStartRandom = useCallback(() => {
    // 计数+1
    setCount(count + 1)
    // 不用欢迎了
    if (needWelcome) setNeedWelcome(false)
    // 已经进行中，拦截（理论上不应该执行）
    if (clock) {
      return
    }

    setLoading(true)
    startInterval()
  }, [clock, startInterval, count, needWelcome])

  /**
   * “就它了”
   */
  const handleStop = useCallback(() => {
    clearClock()

    setLoading(false)
    setBgRandomIndex(-1)

    reportAnalytics('random_result', {
      result_name: food?.name,
      result_count: count,
    });
  }, [clearClock, food, count])

  /**
   * 自定义随机池
   */
  const handleDIY = () => {
    handleStop()
    Taro.navigateTo({
      url: '/pages/New/index'
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

  /**
   * 更多按钮
   */
  const handleMore = () => {
    showActionSheet({
      itemList: ['👎 不再出现这个食物', '📝 定制我的备选池'],
      success: (res) => {
        switch(res.tapIndex) {
          case 0: {
            // 从池子里去掉这个食物
            const indexInRandomList = randomList.findIndex(item => item?.name === food?.name)
            const newList = randomList.slice()
            newList.splice(indexInRandomList, 1)
            setRandomList(newList)

            handleStartRandom()
            break
          }
          case 1: {
            handleDIY()
            break
          }
        }
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  }

  return <View className='container'>

    {/* 背景 */}
    <View className={`background ${needWelcome || (bgRandomIndex === -1) ? 'show-all' : ''}`}>
      <View className="left">
        {bgLeftList.map((item, lIndex) => <Image
          className={`img ${lIndex === ~~bgRandomIndex ? 'show' : ''}`}
          key={item}
          mode="aspectFit"
          src={item}
        />)}
      </View>
      <View className="right">
        {bgRightList.map((item, rIndex) => <Image
          className={`img ${~~bgRandomIndex - BG_ICON_LIST_SIDE_LENGTH === rIndex ? 'show' : ''}`}
          key={item}
          mode="aspectFit"
          src={item}
        />)}
      </View>
    </View>

    {/* 引导区 */}
    {needWelcome ? <View className="welcome-container">
      <View className="body">
        <View className="greeting">
          <View>Hi, {getGreetings()}</View>
          <br />
          {SENTENCE_LIST[getRandomIndex(SENTENCE_LIST.length)]}
        </View>
        <View className="operation">那么，<Text className="bold">今天吃什么好呢？</Text></View>
      </View>
      <View className='footer'>
        <View className='btn-group'>
          <Button className="primary-btn" onClick={!loading ? handleStartRandom : handleStop}> 👨‍🍳 推荐一个吧 </Button>
        </View>
      </View>
    </View> : null}

    {!needWelcome ? <>

      {/* 结果和描述 */}
      <View className='body'>
        <View className={`content ${loading ? 'loading' : null}`}>
          {food?.name || '🤯 没啥好吃了'}
        </View>
        {!loading ? <View className='description'>{food?.description || description}</View> : null}
      </View>

      {/* 底部操作区 */}
      <View className='footer'>
        <View className='btn-group'>
          {!loading ? <Button className='button primary' onClick={goOrder}>🍻 优惠点餐</Button> : null}
          <Button className={`button ${!loading ? 'start' : 'stop'}`} onClick={!loading ? handleStartRandom : handleStop}>
            {!loading ? '🤔 换一个' : '🤟 就它了'}
          </Button>
          {/* {!loading
            ? <Button className='button' onClick={handleClick}>🤔 换一个</Button>
            : <Button className='button' onClick={handleStop}>🤟 就它了</Button>
          } */}
          {!loading ? <View className='link fix-foot' onClick={handleMore}>
            <Image style={{width: 40, height: 40}} mode="aspectFit" src={elipsisImage}></Image>
          </View> : null}
        </View>
      </View>
    </> : null}
  </View>
}

export default FC