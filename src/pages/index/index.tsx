import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { useCallback, useEffect, useState } from 'react'
import {commonDescription} from '../../constants/food'
import { useRandomList } from '../../model/list'

import './index.less'

const getRandom = (list) => {
  console.log('🚧 || list', list);
  const foodLength = list.length
  const index = Math.floor(Math.random() * foodLength)
  return list[index]
}
const getDescriptionRandom = () => getRandom(commonDescription)

const FC = () => {
  useShareAppMessage(() => {
    return {
      title: '今天吃什么？',
      path: 'pages/index/index'
    }
  })
  useShareTimeline(() => {
    return {
      title: '今天吃什么？',
      path: 'pages/index/index'
    }
  })

  const {randomList} = useRandomList()
  const getFoodRandom = useCallback(() => {
    console.log('🚧 || randomList', randomList);
    const t = getRandom(randomList)
    console.log('🚧 || t', t);
    return t
  }, [randomList])

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

  const reRandom = useCallback(() => {
    const newRandom = getFoodRandom()
    setFood(newRandom)
  }, [setFood, getFoodRandom])

  let clock
  const startInterval = () => {
    clock = setInterval(() => {
      reRandom()
    }, 66)
  }

  const handleClick = useCallback(() => {
    if (clock) return
    setLoading(true)
    startInterval()
  }, [])

  const handleStop = useCallback(() => {
    clearInterval(clock)
    clock = undefined
    setLoading(false)
  }, [])

  const handleDIY = () => {
    Taro.navigateTo({
      url: '/pages/new/index'
    })
  }

  console.log('🚧 || food', food);
  return <View className='container'>
    <View className='body'>
      <View className={`content ${loading ? 'loading' : null}`}>{food?.name || '🤯 没啥好吃了'}</View>
      {!loading ? <View className='description'>{food?.description || description}</View> : null}
    </View>
    <View className='footer'>
      <View className='btn-group'>
        <Button className={`button ${!loading ? 'start' : 'stop'}`} onClick={!loading ? handleClick : handleStop}>
          {!loading ? '🤔 换一个' : '🤟 就它了'}
        </Button>
        {/* {!loading
          ? <Button className='button' onClick={handleClick}>🤔 换一个</Button>
          : <Button className='button' onClick={handleStop}>🤟 就它了</Button>
        } */}
        <View className='link' onClick={handleDIY}>定制我的随机池</View>
      </View>
    </View>
  </View>
}

export default FC