import { useEffect, useState } from 'react'
import CountdownTimeType from '@/type/CountdownType'
import { countdownTime } from '@/store/countdownTime'

interface UseCountdownOptions {
  targetTime: number | Date | string
  onExpire?: () => void
  interval?: number
}

export function useCountdown({ targetTime, onExpire, interval = 1000 }: UseCountdownOptions): CountdownTimeType {
  const [timeLeft, setTimeLeft] = useState<CountdownTimeType>(() => countdownTime(targetTime))

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = countdownTime(targetTime)
      setTimeLeft(newTimeLeft)

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        if (onExpire) {
          onExpire()
        }
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [targetTime, onExpire, interval])

  return timeLeft
}

