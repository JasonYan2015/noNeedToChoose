import { getStorageSync, reportAnalytics, setStorageSync } from "@tarojs/taro";
import { useCallback, useEffect, useState } from "react";
import { RANDOM_LIST } from "../constants"
import { FOOD_LIST } from "../constants/food"

let _list: {
  name: string;
  description: string;
}[] = []
export function getList() {
  try {
    _list = getStorageSync(RANDOM_LIST)
  } catch (error) {
    // setStorageSync(RANDOM_LIST, foodList)
    console.error('❌ || getList error', error);
  }
  console.log('🚧 || getList', _list);

  if (!_list || !Array.isArray(_list)) {
    resetList()
    return FOOD_LIST
  }
  return _list
}

export function setList(list) {
  setStorageSync(RANDOM_LIST, list)
  return _list = list
}

export function resetList() {
  setStorageSync(RANDOM_LIST, FOOD_LIST)
  _list = FOOD_LIST
}

export const useRandomList = () => {
  const [randomList, setRandomList] = useState<{name: string, description: string}[]>([])
  useEffect(() => {
    const initList = getList()
    setRandomList(initList)

    reportAnalytics('currrent_random_pool', {
      random_list: initList.map(item => item.name).join(','),
    });
  }, [])

  const updateRandomList = useCallback((list) => {
    console.log('🚧 || updateRandomList', updateRandomList);
    setList(list)
    setRandomList(list)
  }, [setRandomList])

  const refreshRandomList = useCallback(() => {
    const list = getList()
    setList(list)
    setRandomList(list)
  }, [setRandomList])

  const resetRandomList = useCallback(() => {
    resetList()
    refreshRandomList()
  }, [refreshRandomList])

  return {
    randomList,
    setRandomList: updateRandomList,
    refreshRandomList,
    resetRandomList
  }
}