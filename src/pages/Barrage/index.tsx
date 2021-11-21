import {
  getCurrentInstance,
  getUserProfile,
  showModal as TaroShowModal,
  showToast as TaroShowToast,
 } from '@tarojs/taro'
import { Button, Input, View } from '@tarojs/components'
import React, { useEffect, useRef, useState } from 'react'
import { DB } from '@/db/index'
import { useShare } from '@/utils/share'

import './index.less'

const FC: React.FC = (props) => {
  const [text, setText] = useState('')
  const barrageListDB = useRef(DB.collection('barrage_group'))

  /**
   * 分享
   */
  useShare({
    title: '今天吃什么？👨‍🍳我帮你决定，还可以领红包哦',
    path: 'pages/Index/index',
  })

  useEffect(() => {
    // barrageListDB.current
    //   .where({
    //     couldShow: true,
    //   })
    //   .limit(20)
    //   .get()
    //   .then(res => {
    //     console.log('🚧 || barrageList res', res);
    //   })

    // getUserProfile({
    //   desc: '标记你是谁',
    //   success: res => {
    //     console.log('🚧 || getUserProfile res', res);
    //   }
    // })
  }, [])

  console.log('🚧 || props', getCurrentInstance().router?.params?.result);
  const handleSubmit = () => {
    if (!text.trim()) return

    const result = getCurrentInstance().router?.params?.result || '吃啥呢'
    barrageListDB.current
      .add({
        data: {
          couldShow: false,
          content: text,
          userId: 'unknown',
          result
        }
      })
  }

  return <View className="container">
    <View className="body">
      <View className="title">
        说点什么吧
      </View>
      <View className="tips">
        由于内容安全等原因，需要管理员审批后才能上墙哦～
      </View>
    </View>
    <View className='footer-fixed'>
      <Input
        autoFocus
        value={text}
        onInput={(e) => setText(e.detail.value)}
        className='input'
        type='text'
        placeholder='请输入'
        // TODO: 是JS变量，没法用 theme.less
        placeholderStyle="color: #b97843"
        // focus
        maxlength={16}
      />
      <Button className='btn' onClick={handleSubmit}>增加</Button>
    </View>
  </View>
}

export default FC