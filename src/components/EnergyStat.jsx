import React from 'react'
import { Zap } from 'lucide-react'

export default function EnergyStat({
  value = 0,
  unit = 'kWh',
  label = 'พลังงานสะสม',
  color = '#fbbf24',
  offline = false,
  decimals = 2,
}) {
  const displayVal = offline
    ? '—'
    : (typeof value === 'number' ? value.toFixed(decimals) : '—')

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '10px 0 4px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40, height: 40,
        borderRadius: '50%',
        background: `${color}18`,
        border: `1px solid ${color}44`,
        marginBottom: 2,
      }}>
        <Zap size={18} color={offline ? 'rgba(255,255,255,.3)' : color} />
      </div>

      <div style={{
        fontSize: '1.6rem',
        fontWeight: 800,
        color: offline ? 'rgba(255,255,255,.3)' : '#fff',
        fontFamily: "'Segoe UI', sans-serif",
        lineHeight: 1.1,
      }}>
        {displayVal}
        <span style={{
          fontSize: '.8rem', fontWeight: 600,
          color: 'rgba(255,255,255,.4)', marginLeft: 4,
        }}>{unit}</span>
      </div>

      <div style={{
        fontSize: '.72rem',
        color: 'rgba(255,255,255,.5)',
        fontWeight: 600,
        letterSpacing: '.4px',
        textAlign: 'center',
      }}>{label}</div>
    </div>
  )
}