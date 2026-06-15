// เปลี่ยน URL ให้ชี้ไปที่ Cloud Instance ของคุณ (พอร์ต WebSocket ของ HiveMQ Cloud ปกติคือ 8884)
export const MQTT_BROKER        = 'wss://d173ad09fc944559bf48254f06e28eb0.s1.eu.hivemq.cloud:8884/mqtt'
export const MQTT_CLIENT_ID     = `znt_dash_${Math.random().toString(16).slice(2,8)}`

// เพิ่มการตั้งค่า Username และ Password ในตัวแปรคอนฟิกของ MQTT Client (ตรงส่วนที่สร้าง client.connect)
export const MQTT_USER          = 'BLE_Client'
export const MQTT_PASSWORD      = 'Blec@168!'

export const TOPICS = {
  SENSOR:    'znt/eee10/sensors',
  STATUS:    'znt/eee10/status',
  HEARTBEAT: 'znt/eee10/heartbeat',
}

export const GAS_URL            = 'https://script.google.com/macros/s/AKfycbwF6kJ4L2_VR31e74pZ4NSpobWE8WKxJ46unnUbhHGKMavkypU__w6jNMMHt9tSQYpaBw/exec'
export const HEARTBEAT_TIMEOUT  = 60000
export const FIRMWARE_VERSION   = '1.0.0'
export const RT_BUFFER_MAX      = 300   // จุด real-time สูงสุดในกราฟ