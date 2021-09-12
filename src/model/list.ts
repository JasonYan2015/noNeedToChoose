import { getStorageSync, setStorageSync } from "@tarojs/taro";
import { useState } from "react";
import { RANDOM_LIST } from "../constants"
import { foodList } from "../constants/food"

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

  if (!_list || !Array.isArray(_list)) {
    resetList()
    return foodList
  }
  return _list
}

export function setList(list) {
  setStorageSync(RANDOM_LIST, list)
  return _list = list
}

export function resetList() {
  setStorageSync(RANDOM_LIST, foodList)
  _list = foodList
}

export const useRandomList = () => {
    const initList = getList()
  const [randomList, setRandomList] = useState<{name: string, description: string}[]>(initList)

  const updateRandomList = (list) => {
    setList(list)
    setRandomList(list)
  }

  const refreshRandomList = () => {
    const list = getList()
    setList(list)
    setRandomList(list)
  }

  return {
    randomList,
    setRandomList: updateRandomList,
    refreshRandomList
  }
}