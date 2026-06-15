import { useState, useCallback } from 'react'
import { GAS_URL } from '../config'

export function useSheets() {
  const [historyData, setHistoryData] = useState([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)

  const fetchByDate = useCallback(async (date) => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`${GAS_URL}?action=getByDate&date=${date.toISOString().slice(0,10)}`)
      const json = await res.json()
      setHistoryData(json.data ?? [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  const fetchByRange = useCallback(async (start, end) => {
    setLoading(true); setError(null)
    try {
      const s = start.toISOString().slice(0,10)
      const e = end.toISOString().slice(0,10)
      const res  = await fetch(`${GAS_URL}?action=getByRange&start=${s}&end=${e}`)
      const json = await res.json()
      setHistoryData(json.data ?? [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  return { historyData, loading, error, fetchByDate, fetchByRange }
}