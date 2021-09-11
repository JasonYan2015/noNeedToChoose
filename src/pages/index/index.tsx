import { View, Button } from '@tarojs/components'
import { useCallback, useState } from 'react'
import {foodList} from '../../constants/food'
import './index.less'

const getRandom = () => {
  const foodLength = foodList.length
  const index = Math.floor(Math.random() * foodLength)
  return foodList[index]
}

const FC = () => {
  const [food, setFood] = useState(getRandom())
  const [loading, setLoading] = useState(false)

  const reRandom = () => {
    const newRandom = getRandom()
    setFood(newRandom)
  }

  let clock
  const every3Sec = () => {
    clock = setInterval(() => {
      console.log('~~~~~~~~~~~~~~~~~~~~~~ interval');
      reRandom()
    }, 100)
  }

  const handleClick = useCallback(() => {
    setLoading(true)
    every3Sec()
    setTimeout(() => {
      console.log('~~~~~~~~~~~~~~~~~~~~~~ stop');
      clearInterval(clock)
      setLoading(false)
    }, 2000)
  }, [])

  return <View className='container'>
    <View className={`content ${loading ? 'loading' : null}`}>{food}</View>
    <View className='footer'>
      <Button type='primary' onClick={handleClick}>再摇一次</Button>
    </View>
  </View>
}

export default FC