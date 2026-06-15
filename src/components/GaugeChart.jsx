import React from 'react'

export default function GaugeChart({
  value = 0, min = 0, max = 100,
  unit = '', label = '',
  color = '#00d2ff',
  size = 160,
  offline = false,
  decimals = null,   // ← เพิ่ม prop ใหม่ (null = auto)
}) {
  const cx = size / 2
  const cy = size * 0.62
  const r  = size * 0.38

  const polarToXY = (angleDeg, radius) => {
    const rad = (angleDeg - 180) * (Math.PI / 180)
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  const thick  = size * 0.09
  const rOuter = r
  const rInner = r - thick

  const arcPath = (aStart, aEnd) => {
    const s1 = polarToXY(aStart, rOuter)
    const e1 = polarToXY(aEnd,   rOuter)
    const s2 = polarToXY(aEnd,   rInner)
    const e2 = polarToXY(aStart, rInner)
    const large = (aEnd - aStart) > 180 ? 1 : 0
    return `M ${s1.x} ${s1.y}
            A ${rOuter} ${rOuter} 0 ${large} 1 ${e1.x} ${e1.y}
            L ${s2.x} ${s2.y}
            A ${rInner} ${rInner} 0 ${large} 0 ${e2.x} ${e2.y} Z`
  }

  // ── คำนวณทศนิยม ──
  const getDecimals = () => {
    if (decimals !== null) return decimals  // ถ้าระบุมาให้ใช้ตามนั้น
    return value < 10 ? 2 : 0              // auto: น้อยกว่า 10 → 2 ตำแหน่ง
  }

  const displayVal = offline
    ? '—'
    : (typeof value === 'number'
        ? value.toFixed(getDecimals())
        : '—')

  const pMinLabel = polarToXY(0,   rInner - 8)
  const pMaxLabel = polarToXY(180, rInner - 8)

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <svg width={size} height={size * 0.78} viewBox={`0 0 ${size} ${size * 0.78}`}>

        {/* Background arc */}
        <path d={arcPath(0, 180)} fill="rgba(255,255,255,.07)" />

        {/* Tick marks */}
        {[0, .25, .5, .75, 1].map((t, i) => {
          const angle = t * 180
          const p1 = polarToXY(angle, rOuter + 2)
          const p2 = polarToXY(angle, rOuter + 7)
          return (
            <line key={i}
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke="rgba(255,255,255,.2)"
              strokeWidth={1.5}
            />
          )
        })}

        {/* Min label */}
        <text
          x={pMinLabel.x}
          y={pMinLabel.y + size * 0.12}
          textAnchor="middle"
          fill="rgba(255,255,255,.35)"
          fontSize={size * 0.07}>
          {min}
        </text>

        {/* Max label */}
        <text
          x={pMaxLabel.x}
          y={pMaxLabel.y + size * 0.12}
          textAnchor="middle"
          fill="rgba(255,255,255,.35)"
          fontSize={size * 0.07}>
          {max}
        </text>

        {/* Value */}
        <text
          x={cx} y={cy - size * 0.04}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={offline ? 'rgba(255,255,255,.3)' : '#fff'}
          fontSize={size * 0.14}
          fontWeight="700"
          fontFamily="'Segoe UI', sans-serif">
          {displayVal}
        </text>

        {/* Unit */}
        <text
          x={cx} y={cy + size * 0.1}
          textAnchor="middle"
          fill="rgba(255,255,255,.4)"
          fontSize={size * 0.07}>
          {unit}
        </text>

      </svg>

      {/* Label */}
      <div style={{
        fontSize: '.78rem',
        color: 'rgba(255,255,255,.5)',
        fontWeight: 600,
        letterSpacing: '.5px',
        textAlign: 'center',
      }}>{label}</div>

    </div>
  )
}