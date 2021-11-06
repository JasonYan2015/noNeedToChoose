import {
  showModal as TaroShowModal,
  showToast as TaroShowToast,
 } from '@tarojs/taro'
import { Button, Input, View } from '@tarojs/components'
import React, { useEffect, useState } from 'react'
import { useRandomList } from '../../model/list'
import './index.less'

const FC: React.FC = () => {
  const [text, setText] = useState('')
  const [activeIndex, setActiveIndex] = useState<boolean | number>(false)
  const {randomList, setRandomList, resetRandomList} = useRandomList()
  const handleSubmit = () => {
    if (!text.trim()) return
    setRandomList([...randomList, {
      name: text
    }])
    setText('')
  }

  const handleDelete = (index) => {
    setActiveIndex(false)

    const newList = randomList.slice()
    newList.splice(index, 1)
    setRandomList(newList)
  }

  console.log('🚧 || activeIndex', activeIndex);
  useEffect(() => {
    console.log('🚧 || effect activeIndex', activeIndex);
  }, [activeIndex])

  const handleClickOutSide = () => {
    setActiveIndex(false)
  }
  const handleActive = (e, index) => {
    e.stopPropagation()
    if (index === activeIndex) {
      handleDelete(index)
    } else {
      setActiveIndex(index)
    }
  }

  const handleReset = () => {
    TaroShowModal({
      title: '提示',
      content: '确认重置吗？这将会清空当前随机池，且无法恢复',
      success: function (res) {
        if (res.confirm) {
          resetRandomList()
          TaroShowToast({title: '重置成功', icon: 'none'})
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  return <View className="container" onClick={handleClickOutSide}>
    <View className="body">
      <View className="title">
        现在有哪些呢
        <View className="reset" onClick={handleReset}>重置</View>
      </View>
      <View className="list">
        <View className="tag-container">
          {randomList.map((item, index) => {
            return <View
              key={item.name}
              className={`tag ${index === activeIndex ? 'active' : ''}`}
              onClick={(e) => handleActive(e, index)}
            >
              <View className="content">{item.name}</View>
              <View className="delete">X</View>
            </View>
          })}
        </View>
      </View>
    </View>
    <View className='footer-fixed'>
      <Input
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