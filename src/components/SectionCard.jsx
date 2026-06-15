import React from 'react'

export default function SectionCard({ title, accent = '#00d2ff', children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,.04)',
      border: '1px solid rgba(255,255,255,.07)',
      borderRadius: 18,
      padding: '20px 22px',
      ...style,
    }}>
      <div style={{
        fontSize: '.78rem',
        fontWeight: 700,
        color: accent,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        marginBottom: 18,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}