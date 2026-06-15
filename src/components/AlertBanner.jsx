import React from 'react'
import { WifiOff, AlertTriangle, RefreshCw } from 'lucide-react'

export default function AlertBanner({ deviceOnline, mqttConnected, offlineReason, mqttError }) {
  if (mqttConnected && deviceOnline !== false) return null

  const isMqttDown = !mqttConnected
  const color = isMqttDown ? '#ef4444' : '#f59e0b'
  const bg    = isMqttDown ? 'rgba(239,68,68,.08)' : 'rgba(245,158,11,.08)'
  const Icon  = isMqttDown ? WifiOff : AlertTriangle

  return (
    <div style={{
      display:'flex', alignItems:'flex-start', gap:12,
      background: bg,
      border: `1px solid ${color}33`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 12,
      padding: '14px 18px',
      marginBottom: 20,
      animation: 'fadeIn .3s ease',
    }}>
      <Icon size={18} color={color} style={{ flexShrink:0, marginTop:2 }} />
      <div>
        <div style={{ fontWeight:700, color, fontSize:'.9rem', marginBottom:4 }}>
          {isMqttDown ? '⚠️ Dashboard ขาดการเชื่อมต่อ' : '⚠️ ขาดการติดต่อกับบอร์ด EEE10'}
        </div>
        <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.55)', lineHeight:1.6 }}>
          {isMqttDown
            ? (mqttError || 'กำลังพยายามเชื่อมต่อใหม่อัตโนมัติ...')
            : offlineReason}
        </div>
        {!isMqttDown && (
          <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.35)', marginTop:4 }}>
            ตรวจสอบ: ไฟเลี้ยงบอร์ด → สัญญาณ WiFi → การตั้งค่า MQTT
          </div>
        )}
      </div>
      {isMqttDown && (
        <RefreshCw size={14} color={color} style={{ marginLeft:'auto', flexShrink:0, animation:'spin 1.5s linear infinite' }} />
      )}
    </div>
  )
}