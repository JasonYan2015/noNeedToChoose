import { View, Button } from '@tarojs/components'
import { useCallback, useEffect, useState } from 'react'
import {commonDescription, foodList} from '../../constants/food'
import './index.less'

const getRandom = (list) => {
  const foodLength = list.length
  const index = Math.floor(Math.random() * foodLength)
  return list[index]
}
const getFoodRandom = () => getRandom(foodList)
const getDescriptionRandom = () => getRandom(commonDescription)

const FC = () => {
  const [food, setFood] = useState(getFoodRandom())
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState(getDescriptionRandom())
  useEffect(() => {
    setDescription(getDescriptionRandom())
  }, [food])

  const reRandom = () => {
    const newRandom = getFoodRandom()
    setFood(newRandom)
  }

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

  return <View className='container'>
    <View className='body'>
      <View className={`content ${loading ? 'loading' : null}`}>{food.name || '🤯 没啥好吃了'}</View>
      {!loading ? <View className='description'>{food.description || description}</View> : null}
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
      </View>
    </View>
  </View>
}

export default FC