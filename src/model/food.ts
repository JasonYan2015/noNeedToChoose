import { useState } from "react"

export interface Food {
  name: string
  description?: string
  randomNumber?: number
  barrageList?: string[]
}
export const useFoodResult = () => {
  const [food, setFood] = useState({} as Food)

  console.log('🚧 || food', food);
  return {
    food,
    setFood: (res) => {
      console.log('🚧 || setFood res', res);
      setFood(res)
    }
  }
}