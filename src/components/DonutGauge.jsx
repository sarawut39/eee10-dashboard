import React from 'react'

/**
 * Donut / Radial full-circle gauge
 * สำหรับ Power Factor แบบในภาพ
 */
export default function DonutGauge({
  value = 0, max = 1,
  unit = '', label = '',
  color = '#ef4444',
  size = 140,
  offline = false,
}) {
  const cx = size / 2
  const cy = size / 2
  const r  = size * 0.38
  const stroke = size * 0.12
  const circumference = 2 * Math.PI * r
  const pct = Math.min(Math.max(value / max, 0), 1)
  const dashOffset = circumference * (1 - pct)

  const displayVal = offline ? '—'
    : (typeof value === 'number' ? value.toFixed(2) : '—')

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        {/* Background */}
        <circle cx={cx} cy={cy} r={r}
          fill="none"
          stroke="rgba(255,255,255,.08)"
          strokeWidth={stroke} />
        {/* Value */}
        {!offline && (
          <circle cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset .5s ease' }}
          />
        )}
        {/* Center text (rotate back) */}
        <text
          x={cx} y={cy}
          textAnchor="middle" dominantBaseline="middle"
          fill={offline ? 'rgba(255,255,255,.3)' : '#fff'}
          fontSize={size * 0.18}
          fontWeight="800"
          style={{ transform:`rotate(90deg)`, transformOrigin:`${cx}px ${cy}px` }}
          fontFamily="'Segoe UI', sans-serif"
        >{displayVal}</text>
        <text
          x={cx} y={cy + size * 0.15}
          textAnchor="middle"
          fill="rgba(255,255,255,.4)"
          fontSize={size * 0.09}
          style={{ transform:`rotate(90deg)`, transformOrigin:`${cx}px ${cy}px` }}
        >{unit}</text>
      </svg>
      <div style={{
        fontSize: '.78rem',
        color: 'rgba(255,255,255,.5)',
        fontWeight: 600,
        textAlign: 'center',
      }}>{label}</div>
    </div>
  )
}