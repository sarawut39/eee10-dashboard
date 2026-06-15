import React, { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar, CalendarRange, Search, Loader } from 'lucide-react'

export default function DatePickerPanel({ onFetchDay, onFetchRange, loading }) {
  const [mode,  setMode]  = useState('day')
  const [day,   setDay]   = useState(new Date())
  const [start, setStart] = useState(new Date())
  const [end,   setEnd]   = useState(new Date())

  return (
    <div style={{
      background:'rgba(255,255,255,.04)',
      border:'1px solid rgba(255,255,255,.07)',
      borderRadius:16, padding:'18px 20px',
      marginBottom:16,
    }}>
      <div style={{
        fontSize:'.78rem', fontWeight:700, color:'#a78bfa',
        letterSpacing:'1.5px', textTransform:'uppercase',
        marginBottom:14, display:'flex', alignItems:'center', gap:8,
      }}>
        <span style={{ width:3,height:14,background:'#a78bfa',borderRadius:2,display:'inline-block',boxShadow:'0 0 6px #a78bfa' }}/>
        ดูข้อมูลย้อนหลัง
      </div>

      {/* Toggle */}
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {[['day','รายวัน',<Calendar size={12}/>],['range','ช่วงวันที่',<CalendarRange size={12}/>]]
          .map(([id, label, icon]) => (
          <button key={id} onClick={() => setMode(id)} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer',
            fontSize:'.78rem', fontWeight:600, transition:'.15s',
            background: mode===id ? 'rgba(167,139,250,.2)' : 'rgba(255,255,255,.06)',
            color:       mode===id ? '#a78bfa'              : 'rgba(255,255,255,.4)',
            border:      mode===id ? '1px solid rgba(167,139,250,.35)' : '1px solid rgba(255,255,255,.08)',
          }}>{icon}{label}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:10, alignItems:'flex-end' }}>
        {mode === 'day' ? (
          <div style={{ flex:'1 1 140px' }}>
            <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.35)', marginBottom:6 }}>วันที่</div>
            <ReactDatePicker selected={day} onChange={setDay} dateFormat="dd/MM/yyyy" maxDate={new Date()} />
          </div>
        ) : (
          <>
            <div style={{ flex:'1 1 130px' }}>
              <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.35)', marginBottom:6 }}>เริ่มต้น</div>
              <ReactDatePicker selected={start} onChange={setStart} selectsStart startDate={start} endDate={end} dateFormat="dd/MM/yyyy" maxDate={new Date()} />
            </div>
            <div style={{ flex:'1 1 130px' }}>
              <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.35)', marginBottom:6 }}>สิ้นสุด</div>
              <ReactDatePicker selected={end} onChange={setEnd} selectsEnd startDate={start} endDate={end} minDate={start} dateFormat="dd/MM/yyyy" maxDate={new Date()} />
            </div>
          </>
        )}

        <button onClick={() => mode==='day' ? onFetchDay(day) : onFetchRange(start,end)}
          disabled={loading} style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'10px 18px', borderRadius:10, border:'none', cursor:'pointer',
          background:'linear-gradient(135deg,#a78bfa,#7b2ff7)',
          color:'#fff', fontWeight:700, fontSize:'.82rem',
          opacity: loading ? .6 : 1, flexShrink:0,
        }}>
          {loading
            ? <><Loader size={13} style={{ animation:'spin 1s linear infinite' }}/>กำลังโหลด</>
            : <><Search size={13}/>ค้นหา</>}
        </button>
      </div>
    </div>
  )
}