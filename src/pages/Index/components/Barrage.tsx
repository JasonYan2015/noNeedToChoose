
import { memo, useEffect, useRef, useState } from 'react';
import { View } from '@tarojs/components';
import { initRandomNumber } from '@/utils/random';
import { DB } from '@/db';

import './barrage.less';

const FC: React.FC = () => {
  const barrageListDB = useRef(DB.collection('barrage_group'))
  const [list, setList] = useState([] as string[])

  useEffect(() => {
    barrageListDB.current
      .where({
        couldShow: true,
      })
      .limit(20)
      .get()
      .then(res => {
        const resList = res.data.map(item => `${item.result || '吃啥呢'}：${item.content}`)
        console.log('🚧 || barrageList res', res, resList);
        setList(resList)
      })

    // getUserProfile({
    //   desc: '标记你是谁',
    //   success: res => {
    //     console.log('🚧 || getUserProfile res', res);
    //   }
    // })
  }, [])

  const baseTopPosition = useRef(initRandomNumber(Math.random()))
  const renderList = list.map((item, index) => {
    const randomNumber = baseTopPosition.current + index * 20
    const randomIndex = ~~(Math.random() * 1000 * 5)

    return {
      text: item,
      top: randomNumber,
      index: randomIndex + 'ms'
    }
  })

  if (!renderList.length) {
    return null
  }

  return <View className="barrage-container">
    {renderList.map((item, index) => {
      return <View
        key={index}
        className="text"
        style={{
          top: item.top,
          animationDelay: item.index,
          zIndex: index,
        }}
      >{item.text}</View>
    })}
  </View>
}

export default memo(FC)