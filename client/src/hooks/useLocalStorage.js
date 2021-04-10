import { useState, useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  useEffect(() => {
    let item = JSON.stringify(value)
    // определение имени как unknown  в случае если пользователь заходит в превый раз по ссылке на комнату
    if (value === undefined) item = JSON.stringify("unknown");
    window.localStorage.setItem(key, item)
    // eslint-disable-next-line
  }, [value])

  return [value, setValue]
}