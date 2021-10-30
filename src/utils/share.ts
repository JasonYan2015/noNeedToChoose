import { useShareAppMessage, useShareTimeline } from '@tarojs/taro'

export const useShare = ({title, path}) => {
  useShareAppMessage(() => {
    return { title, path }
  })
  useShareTimeline(() => {
    return { title, path }
  })

  return {
    useShareAppMessage,
    useShareTimeline
  }
}