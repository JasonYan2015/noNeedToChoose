import React from 'react'
import { View } from '@tarojs/components';
import { initRandomNumber } from '@/utils/random';

import './barrage.less';

const FC: React.FC<{
  textList: string[]
}> = ({textList}) => {
  if (!Array.isArray(textList) || !textList?.length) return null

  const renderList = textList.map((item, index) => {
    const randomNumber = initRandomNumber(index)
    return {
      text: item,
      top: randomNumber
    }
  })

  return <View className="barrage-container">
    {renderList.map((item, index) => {
      return <View key={index} className="text" style={{top: item.top}}>{item.text}</View>
    })}
  </View>
}

export default FC