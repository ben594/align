import { useCallback, useState } from 'react'

const useRerender = (): [number, () => void] => {
  const [count, setCount] = useState(0)

  return [count, useCallback(() => setCount(count => count + 1), [])]
}

export default useRerender
