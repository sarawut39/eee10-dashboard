import React, { useState, useEffect } from 'react'
import { FIRMWARE_VERSION, RT_BUFFER_MAX } from './config'
import { useMQTT }   from './hooks/useMQTT'
import { useSheets } from './hooks/useSheets'

import Header          from './components/Header'
import AlertBanner     from './components/AlertBanner'
import SectionCard     from './components/SectionCard'
import GaugeChart      from './components/GaugeChart'
import DonutGauge      from './components/DonutGauge'
import TrendChart      from './components/TrendChart'
import DatePickerPanel from './components/DatePickerPanel'
import EnergyStat from './components/EnergyStat'

export default function App() {
  const { mqttConnected, deviceOnline, sensorData,
          lastHeartbeat, offlineReason, mqttError } = useMQTT()
  const { historyData, loading, error: sheetError,
          fetchByDate, fetchByRange } = useSheets()

  const [rtBuffer,    setRtBuffer]    = useState([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (!sensorData) return
    setRtBuffer(prev => {
      const next = [...prev, sensorData]
      return next.length > RT_BUFFER_MAX ? next.slice(-RT_BUFFER_MAX) : next
    })
  }, [sensorData])

  const offline   = deviceOnline === false
  const d         = sensorData ?? {}
  const chartData = showHistory ? historyData : rtBuffer

  return (
    <div style={{ minHeight:'100vh', background:'#0d0d1f' }}>
      <Header
        version={FIRMWARE_VERSION}
        mqttConnected={mqttConnected}
        deviceOnline={deviceOnline}
      />

      <style>{`
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow   { 0%,100%{box-shadow:0 0 8px #00d2ff44} 50%{box-shadow:0 0 20px #00d2ffaa} }

        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
          main {
            padding: 12px 10px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1100px) {
          .main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>

      <main style={{ maxWidth:1280, margin:'0 auto', padding:'20px 16px' }}>

        {/* Alert */}
        <AlertBanner
          deviceOnline={deviceOnline}
          mqttConnected={mqttConnected}
          offlineReason={offlineReason}
          mqttError={mqttError}
        />

        {/* ── ROW 1: Responsive Grid ── */}
        <div
          className="main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 14,
            marginBottom: 14,
          }}
        >

          {/* ── Realtime Sensors ── */}
          <SectionCard title="Realtime — Sensors" accent="#00d2ff">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}>
              <div style={{ display:'flex', justifyContent:'space-around', width:'100%' }}>
                <GaugeChart
                  label="Wind Speed" unit="m/s"
                  value={d.wind ?? 0} min={0} max={25}
                  color="#00d2ff" size={145} offline={offline}
                />
                <GaugeChart
                  label="RPM" unit="rpm"
                  value={d.rpm ?? 0} min={0} max={3000}
                  color="#a78bfa" size={145} offline={offline}
                />
              </div>
              <GaugeChart
                label="Current (AC)" unit="A"
                value={d.ac_a ?? 0} min={0} max={50}
                color="#f97316" size={145} offline={offline}
              />
            </div>
          </SectionCard>

          {/* ── Power Input ── */}
          <SectionCard title="Power — Input" accent="#22c55e">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              paddingTop: 16,
              paddingBottom: 16,
            }}>
              <GaugeChart
                label="DC Voltage (Input)" unit="V"
                value={d.dc_v ?? 0} min={0} max={25}
                color="#22c55e" size={190}
                offline={offline}
                decimals={2}
              />
            </div>
          </SectionCard>

          {/* ── Power Input (3-Phase, Pre-Battery) ── */}
          <SectionCard title="Power — Input (3-Phase)" accent="#fbbf24">
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
              <div style={{ display:'flex', justifyContent:'space-around', width:'100%' }}>
                <GaugeChart
                  label="Phase A" unit="V"
                  value={d.pzem3p_va ?? 0} min={0} max={300}
                  color="#fbbf24" size={100} offline={offline}
                />
                <GaugeChart
                  label="Phase B" unit="V"
                  value={d.pzem3p_vb ?? 0} min={0} max={300}
                  color="#fbbf24" size={100} offline={offline}
                />
                <GaugeChart
                  label="Phase C" unit="V"
                  value={d.pzem3p_vc ?? 0} min={0} max={300}
                  color="#fbbf24" size={100} offline={offline}
                />
              </div>

              <div style={{ width:'100%', borderTop:'1px solid rgba(255,255,255,.07)', margin:'2px 0 0' }} />

              <EnergyStat
                value={d.pzem3p_totalEnergy ?? 0}
                unit="kWh"
                label="พลังงานสะสม (รวม 3 เฟส)"
                color="#fbbf24"
                offline={offline}
              />
            </div>
          </SectionCard>

          {/* ── Power Output ── */}
          <SectionCard title="Power — Output" accent="#f97316">
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flexWrap: 'nowrap',
              width: '100%',
              paddingTop: 16,
              paddingBottom: 16,
              gap: 8,
            }}>
              <DonutGauge
                label="Power Factor" unit="PF"
                value={d.ac_pf ?? 0} max={1}
                color="#ef4444" size={130} offline={offline}
              />
              <GaugeChart
                label="AC Voltage" unit="V"
                value={d.ac_v ?? 0} min={0} max={260}
                color="#00d2ff" size={160} offline={offline}
              />
            </div>
          </SectionCard>

        </div>

        {/* ── ROW 2: Trend Chart ── */}
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            {[
              [false, '📡 Real-time'],
              [true,  '🗂️ ข้อมูลย้อนหลัง'],
            ].map(([val, label]) => (
              <button key={String(val)} onClick={() => setShowHistory(val)} style={{
                padding:'7px 16px', borderRadius:8, border:'none', cursor:'pointer',
                fontSize:'.78rem', fontWeight:600, transition:'.15s',
                background: showHistory===val ? 'rgba(0,210,255,.15)' : 'rgba(255,255,255,.06)',
                color:       showHistory===val ? '#00d2ff'             : 'rgba(255,255,255,.4)',
                border:      showHistory===val
                  ? '1px solid rgba(0,210,255,.3)'
                  : '1px solid rgba(255,255,255,.08)',
              }}>{label}</button>
            ))}
          </div>

          {showHistory && (
            <DatePickerPanel
              onFetchDay={fetchByDate}
              onFetchRange={fetchByRange}
              loading={loading}
            />
          )}
          {sheetError && (
            <div style={{ color:'#f87171', fontSize:'.78rem', marginBottom:10 }}>
              ⚠️ {sheetError}
            </div>
          )}

          <TrendChart
            data={chartData}
            title={showHistory
              ? `ข้อมูลย้อนหลัง (${historyData.length} จุด)`
              : `${rtBuffer.length} จุดล่าสุด`}
          />
        </div>

      </main>
    </div>
  )
}