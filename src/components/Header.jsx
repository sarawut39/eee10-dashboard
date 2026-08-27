import React from 'react'
import { Wifi, WifiOff, Radio } from 'lucide-react'

export default function Header({ version, mqttConnected, deviceOnline }) {
  const status = !mqttConnected
    ? { label:'MQTT หลุด',     color:'#ef4444', Icon: WifiOff }
    : deviceOnline === false
    ? { label:'บอร์ด Offline', color:'#f59e0b', Icon: WifiOff }
    : deviceOnline === true
    ? { label:'Online',        color:'#22c55e', Icon: Wifi }
    : { label:'รอข้อมูล...',   color:'#94a3b8', Icon: Radio }

  return (
    <header style={{
      background: 'linear-gradient(90deg,rgba(0,210,255,.08),rgba(123,47,247,.08))',
      borderBottom: '1px solid rgba(255,255,255,.07)',
      padding: '0 16px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
      overflow: 'hidden',
    }}>

      {/* ZNX Logo */}
      <div style={{
        width: 38, height: 38,
        background: 'linear-gradient(135deg,#00d2ff,#7b2ff7)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: '.85rem', color: '#fff',
        letterSpacing: '-1px',
        boxShadow: '0 0 16px rgba(0,210,255,.35)',
        flexShrink: 0,
      }}>ZNX</div>

      {/* Brand */}
      <div style={{ lineHeight: 1.2, flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '.85rem', color:'#fff' }}>Zynatix</div>
        <div style={{ fontSize: '.55rem', color:'rgba(255,255,255,.35)', letterSpacing:'2px', textTransform:'uppercase' }}>
          IOT SOLUTIONS
        </div>
      </div>

      {/* Divider */}
      <div style={{ width:1, height:32, background:'rgba(255,255,255,.1)', flexShrink:0 }} />

      {/* Device Name */}
      <span style={{
        fontSize: '0.72rem',
        fontWeight: 700,
        background: 'linear-gradient(90deg,#00d2ff,#a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        flexShrink: 1,
        minWidth: 0,
        lineHeight: 1.3,
      }}>ระบบตรวจวัดและแสดงผลกังหันลม</span>

      {/* Status pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: `${status.color}18`,
        border: `1px solid ${status.color}44`,
        borderRadius: 20,
        padding: '3px 8px',
        fontSize: '.65rem', fontWeight: 600,
        color: status.color,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}>
        <status.Icon size={11} />
        {status.label}
        {deviceOnline === true && (
          <span style={{
            width:5, height:5, borderRadius:'50%',
            background:'#22c55e',
            animation:'pulse 2s infinite',
            marginLeft:2,
          }}/>
        )}
      </div>

      {/* Version */}
      <span style={{
        marginLeft: 'auto',
        background: 'rgba(0,210,255,.1)',
        border: '1px solid rgba(0,210,255,.2)',
        color: '#00d2ff',
        padding: '3px 8px', borderRadius: 20,
        fontSize: '.6rem', fontWeight: 600,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}>v{version}</span>

    </header>
  )
}