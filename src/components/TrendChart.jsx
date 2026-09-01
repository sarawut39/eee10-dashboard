import React, { useMemo } from 'react'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

const LINES = [
  { key:'wind',      name:'Wind Speed (m/s)', color:'#00d2ff', axis:'left'  },
  { key:'rpm',       name:'RPM',              color:'#a78bfa', axis:'left'  },
  { key:'ac_a',      name:'Current AC (A)',   color:'#f97316', axis:'right' },
  { key:'dc_v',      name:'Voltage DC (V)',   color:'#22c55e', axis:'right' },
  { key:'ac_pf',     name:'Power Factor (%)', color:'#fbbf24', axis:'right' },
  { key:'ac_v',      name:'AC Voltage (V)',   color:'#e879f9', axis:'right' },
  { key:'pzem3p_va', name:'Phase A (V)',      color:'#f59e0b', axis:'right' },
  { key:'pzem3p_vb', name:'Phase B (V)',      color:'#eab308', axis:'right' },
  { key:'pzem3p_vc', name:'Phase C (V)',      color:'#facc15', axis:'right' },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(13,13,31,.97)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: '.77rem',
      minWidth: 160,
    }}>
      <div style={{ color:'rgba(255,255,255,.4)', marginBottom:6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{
          display:'flex', justifyContent:'space-between', gap:16,
          color: p.color, marginBottom:2,
        }}>
          <span>{p.name}</span>
          <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function TrendChart({ data, title = 'All Signals' }) {
  const formatted = useMemo(() =>
    data.map(d => ({
      ...d,
      _time: d.ts
        ? new Date(typeof d.ts === 'number' && d.ts < 1e10 ? d.ts*1000 : d.ts)
            .toLocaleTimeString('th-TH', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
        : (d.time ?? ''),
    }))
  , [data])

  return (
    <div style={{
      background: 'rgba(255,255,255,.03)',
      border: '1px solid rgba(255,255,255,.07)',
      borderRadius: 18,
      padding: '20px 22px',
    }}>
      <div style={{
        fontSize: '.78rem', fontWeight:700,
        color: '#00d2ff', letterSpacing:'1.5px',
        textTransform:'uppercase', marginBottom:16,
        display:'flex', alignItems:'center', gap:8,
      }}>
        <span style={{ width:3,height:14,background:'#00d2ff',borderRadius:2,display:'inline-block',boxShadow:'0 0 6px #00d2ff' }}/>
        Trend — {title}
      </div>

      {data.length === 0 ? (
        <div style={{ textAlign:'center', color:'rgba(255,255,255,.2)', padding:'40px 0', fontSize:'.85rem' }}>
          รอข้อมูล...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={formatted} margin={{ top:4, right:8, left:15, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
            <XAxis
              dataKey="_time"
              tick={{ fill:'rgba(255,255,255,.25)', fontSize:10 }}
              interval="preserveStartEnd"
            />
            {/* แกนซ้าย: RPM, Power (ค่าใหญ่) */}
            <YAxis
              yAxisId="left"
              tick={{ fill:'rgba(255,255,255,.25)', fontSize:10 }}
              label={{ value:'m/s / RPM', angle:-90, position:'insideLeft', fill:'rgba(255,255,255,.3)', fontSize:16 }}
            />
            {/* แกนขวา: Wind, Current, PF */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 300]}
              ticks={[0, 40, 80, 120, 160, 200, 240, 280, 300]}
              allowDataOverflow
              // width={55}
              tick={{ fill:'rgba(255,255,255,.25)', fontSize:10 }}
              label={{ value:'A / DC / PF / V', angle:90, position:'insideRight', dx:-10, fill:'rgba(255,255,255,.3)', fontSize:16 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize:'.73rem', paddingTop:10 }}
              formatter={v => <span style={{ color:'rgba(255,255,255,.5)' }}>{v}</span>}
            />
            {LINES.map(l => (
              <Line key={l.key}
                yAxisId={l.axis}
                type="monotone"
                dataKey={l.key}
                name={l.name}
                stroke={l.color}
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r:3, strokeWidth:0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}