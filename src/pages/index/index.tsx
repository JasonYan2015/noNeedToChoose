import { View, Button } from '@tarojs/components'
import { useState } from 'react'
import {foodList} from '../../constants/food'
import './index.less'

const getRandom = () => {
  const foodLength = foodList.length
  const index = Math.floor(Math.random() * foodLength)
  return foodList[index]
}

const FC = () => {
  const [food, setFood] = useState(getRandom())

  const reRandom = () => {
    const newRandom = getRandom()
    setFood(newRandom)
  }

  return <View className='container'>
    <View className='content'>{food}</View>
    <View className='footer'>
      <Button type='primary' onClick={reRandom}>再摇一次</Button>
    </View>
  </View>
}

export default FC