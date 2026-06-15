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
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      {/* ZNX Logo */}
      <div style={{
        width: 40, height: 40,
        background: 'linear-gradient(135deg,#00d2ff,#7b2ff7)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: '.95rem', color: '#fff',
        letterSpacing: '-1px',
        boxShadow: '0 0 16px rgba(0,210,255,.35)',
        flexShrink: 0,
        animation: 'glow 3s ease-in-out infinite',
      }}>ZNX</div>

      {/* Brand */}
      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontWeight: 700, fontSize: '.9rem', color:'#fff' }}>Zynatix</div>
        <div style={{ fontSize: '.58rem', color:'rgba(255,255,255,.35)', letterSpacing:'2px', textTransform:'uppercase' }}>
          IoT Solutions
        </div>
      </div>

      {/* Divider */}
      <div style={{ width:1, height:32, background:'rgba(255,255,255,.1)' }} />

      {/* Device Name */}
      <span style={{
        fontSize: '1rem',
        fontWeight: 800,
        background: 'linear-gradient(90deg,#00d2ff,#a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>ระบบตรวจวัดและแสดงผลกังหันลม</span>

      {/* Status pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: `${status.color}18`,
        border: `1px solid ${status.color}44`,
        borderRadius: 20,
        padding: '4px 12px',
        fontSize: '.72rem', fontWeight: 600,
        color: status.color,
      }}>
        <status.Icon size={12} />
        {status.label}
        {deviceOnline === true && (
          <span style={{
            width:6, height:6, borderRadius:'50%',
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
        padding: '3px 10px', borderRadius: 20,
        fontSize: '.65rem', fontWeight: 600, letterSpacing: '.5px',
      }}>v{version}</span>
    </header>
  )
}