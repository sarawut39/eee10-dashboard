import { useState, useEffect, useRef, useCallback } from 'react'
import mqtt from 'mqtt'
import { MQTT_BROKER, MQTT_CLIENT_ID, TOPICS, HEARTBEAT_TIMEOUT, MQTT_USER, MQTT_PASSWORD } from '../config'

export function useMQTT() {
  const clientRef         = useRef(null)
  const hbTimerRef        = useRef(null)

  const [mqttConnected, setMqttConnected] = useState(false)
  const [deviceOnline,  setDeviceOnline]  = useState(null)
  const [sensorData,    setSensorData]    = useState(null)
  const [lastHeartbeat, setLastHeartbeat] = useState(null)
  const [offlineReason, setOfflineReason] = useState('')
  const [mqttError,     setMqttError]     = useState(null)

  const resetHbTimer = useCallback(() => {
    if (hbTimerRef.current) clearTimeout(hbTimerRef.current)
    hbTimerRef.current = setTimeout(() => {
      setDeviceOnline(false)
      setOfflineReason('ไม่ได้รับสัญญาณจากบอร์ดนานกว่า 60 วินาที  WiFi หรือ MQTT อาจหลุด')
    }, HEARTBEAT_TIMEOUT)
  }, [])

useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER, {
      clientId: MQTT_CLIENT_ID,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 10000,
      
      // ─── สิ่งที่ต้องเพิ่มสำหรับ HiveMQ Cloud ───
      username: MQTT_USER,        // ใส่ username ที่มาจาก config ('BLE_Client')
      password: MQTT_PASSWORD,    // ใส่ password ที่มาจาก config ('Blec@168!')
      rejectUnauthorized: false,  // จำเป็นต้องใส่สำหรับ wss:// บน HiveMQ Cloud บนบราวเซอร์บางตัว
    })
    clientRef.current = client

    client.on('connect', () => {
      setMqttConnected(true)
      setMqttError(null)
      Object.values(TOPICS).forEach(t => client.subscribe(t))
      resetHbTimer()
    })
    client.on('disconnect', () => {
      setMqttConnected(false)
      setOfflineReason('Dashboard ขาดการเชื่อมต่อ MQTT Broker')
    })
    client.on('error', err => {
      setMqttError(err.message)
      setMqttConnected(false)
    })
    client.on('message', (topic, payload) => {
      try {
        const msg = JSON.parse(payload.toString())
        if (topic === TOPICS.SENSOR) {
          setSensorData(msg)
          setDeviceOnline(true)
          setOfflineReason('')
          resetHbTimer()
        }
        if (topic === TOPICS.STATUS) {
          const online = msg.status === 'online'
          setDeviceOnline(online)
          if (!online) setOfflineReason('บอร์ดแจ้งสถานะ Offline — WiFi หรือ MQTT หลุด')
          else { setOfflineReason(''); resetHbTimer() }
        }
        if (topic === TOPICS.HEARTBEAT) {
          setLastHeartbeat({ ...msg, receivedAt: Date.now() })
          setDeviceOnline(true)
          setOfflineReason('')
          resetHbTimer()
        }
      } catch (_) {}
    })

    return () => {
      if (hbTimerRef.current) clearTimeout(hbTimerRef.current)
      client.end()
    }
  }, [resetHbTimer])

  return { mqttConnected, deviceOnline, sensorData, lastHeartbeat, offlineReason, mqttError }
}