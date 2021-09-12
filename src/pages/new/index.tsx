import { Button, Input, View } from '@tarojs/components'
import React, { useEffect, useState } from 'react'
import { useRandomList } from '../../model/list'
import './index.less'

const FC: React.FC = () => {
  const [text, setText] = useState('')
  const [activeIndex, setActiveIndex] = useState<boolean | number>(false)
  const {randomList, setRandomList} = useRandomList()
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
    setActiveIndex(index)
  }

  return <View className="container" onClick={handleClickOutSide}>
    <View className="body">
      <View className="title">现在有哪些呢</View>
      <View className="list">
        <View className="tag-container">
          {randomList.map((item, index) => {
            return <View
              key={item.name}
              className={`tag ${index === activeIndex ? 'active' : ''}`}
              onClick={(e) => handleActive(e, index)}
            >
              <View className="content">{item.name}</View>
              <View className="delete show" onClick={() => handleDelete(index)}>X</View>
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
        // focus
        maxlength={16}
        placeholderStyle='color: rgba(255,255,255,.7);'
      />
      <Button className='btn' onClick={handleSubmit}>增加</Button>
    </View>
  </View>
}

export default FC