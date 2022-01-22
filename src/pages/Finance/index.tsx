import React, { cloud } from '@tarojs/taro'
import { useEffect, useState } from 'react';
import './index.less';

const FC: React.FC = () => {
  const [data, setData] = useState()

  const fundCodes = [
    "003494",
    "005827",
    "003095",
    "290011",
    "398051"
  ]
  useEffect(() => {
    cloud.callFunction({
      name: 'getFundInfo',
      data: {fundCodes},
      success: (res) => {
        console.log('🚧 || res', res);
        setData(res)
      },
      fail: console.error
    })
  }, [])

  return <div className='container'>
    {JSON.stringify(data)}
  </div>
}

export default FC