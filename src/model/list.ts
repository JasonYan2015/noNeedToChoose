import { initRandomNumber } from "@/utils/random";
import { getStorageSync, reportAnalytics, setStorageSync } from "@tarojs/taro";
import { useCallback, useEffect, useState } from "react";
import { RANDOM_LIST } from "../constants"
import { FOOD_LIST } from "../constants/food"
import type { Food } from "./food";

let _list: Food[] = []
// 原始列表
function getOriginList() {
  try {
    _list = getStorageSync(RANDOM_LIST)
  } catch (error) {
    // setStorageSync(RANDOM_LIST, foodList)
    console.error('❌ || getList error', error);
  }

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

/**
 * 获取加工后的列表
 * 1. 加上一个以日期为种子的随机数
 */
function getList() {
  const originList = getOriginList()
  return originList.map((item, index) => {
    const randomNumber = initRandomNumber(index)
    return {
      ...item,
      randomNumber
    }
  })
}

export const useRandomList = () => {
  const [randomList, setRandomList] = useState<{name: string, description: string, randomNumber: number}[]>([])
  useEffect(() => {
    const initList = getList()
    setRandomList(initList)

    reportAnalytics('currrent_random_pool', {
      random_list: initList.map(item => item.name).join(','),
    });
  }, [])

  const updateRandomList = useCallback((list) => {
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
