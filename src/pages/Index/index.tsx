import Taro, { useDidShow, reportAnalytics, showActionSheet, showModal } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {COMMON_DESCRIPTION, SENTENCE_LIST} from '@/constants/food'
import { useRandomList } from '@/model/list'
import { useShare } from '@/utils/share'
// import elipsisImage from '@/assets/elipsis.png'

import { bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14, bg15, bg16, bg17, bg18, bg19 } from '@/assets/foodIcon'
// import { useFoodResult } from '@/model/food'

import Barrage from './components/Barrage'

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

const BG_RANDOM_STEP_LENGTH = 4

const getRandom = (list) => {
  const length = list.length
  const index = Math.floor(Math.random() * length)
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
  // const {food, setFood} = useFoodResult()
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
  // useEffect(() => {


  // }, [food])

  /**
   * 分享
   */
   useShare({
    title: needWelcome || !food?.name ? '今天吃什么？👨‍🍳我帮你决定，还可以领红包哦' : `吃${food?.name}吧🥳你的红包已经准备好啦`,
    path: 'pages/Index/index',
  })

  /**
   * 摇
   */
  const reRandom = useCallback((tk) => {
    const newRandom = getFoodRandom()
    setFood(newRandom)

    // 这个除法是取步长，因为每一次random都会执行一次当前函数
    const steps = tk / BG_RANDOM_STEP_LENGTH
    const newBgIndex = Math.floor(steps)
    // 取余，这样进位后就可以从头开始
    setBgRandomIndex(newBgIndex % BG_ICON_LIST.length)
  }, [setFood, getFoodRandom])

  /**
   * 摇 时钟
   * 66ms
   */
  const startInterval = useCallback((startIndex = 0) => {
    let tk = 0 * BG_RANDOM_STEP_LENGTH
    setClock(setInterval(() => {
      tk++
      reRandom(tk)
    }, 1000 / 12))
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
    const randomBgStartIndex = ~~(Math.random() * BG_ICON_LIST.length)
    startInterval(randomBgStartIndex)
  }, [clock, startInterval, count, needWelcome])

  /**
   * “就它了”
   */
  const handleStop = useCallback(() => {
    clearClock()

    setLoading(false)
    setBgRandomIndex(-1)
    setDescription(getDescriptionRandom())

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
   * 跳转弹幕编辑页
   */
  const goBarrageInput = () => {
    handleStop()

    // authorize({
    //   scope: 'scope.userInfo',
    //   success: () => {
        Taro.navigateTo({
          url: `/pages/Barrage/index?result=${food.name}`
        })
      // },
      // fail: () => {
      //   showToast({
      //     title: '好像还没登陆，记得授权登陆哦～',
      //     icon: 'none',
      //   })
      // }
    // })
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
   * 从池子里去掉这个食物
   */
  const handleDislike = () => {
    showModal({
      title: '提示',
      content: '真的要从备选池中删除这个食物吗？',
      success: res => {
        if (res.confirm) {
          const indexInRandomList = randomList.findIndex(item => item?.name === food?.name)
          const newList = randomList.slice()
          newList.splice(indexInRandomList, 1)
          setRandomList(newList)

          handleStartRandom()
        }
      }
    })
  }
  /**
   * 更多按钮
   */
  const handleMore = () => {
    showActionSheet({
      itemList: ['👎 不再出现这个食物', '📝 定制我的备选池', '💬 发送弹幕'],
      success: (res) => {
        switch(res.tapIndex) {
          case 0: {
            handleDislike()
            break
          }
          case 1: {
            handleDIY()
            break
          }
          case 2: {
            goBarrageInput()
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
        {/* 今天 xx 人选择 */}
        {!loading && food?.randomNumber &&<View className="description" style={{marginBottom: 40}}>今天{food.randomNumber}人选择类似结果</View>}
        {/* 食物内容 */}
        <View className={`content ${loading ? 'loading' : ''}`}>
          {food?.name || '🤯 没啥好吃了'}
        </View>
        {/* 食物描述 */}
        {!loading ? <View className='description'>{food?.description || description}</View> : null}

        {/* 弹幕 */}
        <Barrage />
      </View>

      {/* 底部操作区 */}
      <View className='footer'>
        <View className='btn-group'>
          {!loading ? <Button className='button primary' openType="share" onClick={goOrder}>🍻 分享并领取专属红包</Button> : null}
          <View className="btn-row">
            {!loading && <Button className="button sub" onClick={handleDislike}>👎</Button>}
            <Button className={`button main ${!loading ? 'start' : 'stop'}`} onClick={!loading ? handleStartRandom : handleStop}>
              {!loading ? '🤔 换一个' : '🤟 就它了'}
            </Button>
          </View>
          {!loading ? <View className='link fix-foot' onClick={handleMore}>查看更多</View> : null}
        </View>
      </View>
    </> : null}
  </View>
}

export default FC