import { useMemo, useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { calcSubject, getGrade } from '../useStore'
import styles from './ChartsPanel.module.css'

const TABS = ['Overview', 'Progress', 'Radar']

export default function ChartsPanel({ subjects, tasks, currentTerm }) {
  const [tab, setTab] = useState('Overview')

  const subjectScores = useMemo(() =>
    subjects.map(s => {
      const r = calcSubject(tasks, s.id, currentTerm)
      return { name: shortName(s.name), fullName: s.name, score: r ? parseFloat(r.score.toFixed(1)) : null, color: s.color }
    }).filter(s => s.score !== null),
  [subjects, tasks, currentTerm])

  const progressData = useMemo(() => {
    const terms = ['T1', 'T2', 'T3', 'T4']
    return terms.map(term => {
      const row = { term }
      subjects.forEach(s => {
        const r = calcSubject(tasks, s.id, term)
        row[shortName(s.name)] = r ? parseFloat(r.score.toFixed(1)) : null
      })
      return row
    }).filter(row => subjects.some(s => row[shortName(s.name)] !== null))
  }, [subjects, tasks])

  if (subjectScores.length === 0) return null

  return (
    <div className={`${styles.panel} fade-up-2`}>
      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.active : ''}`}
            onClick={() => setTab(t)}
          >{t}</button>
        ))}
      </div>

      <div className={styles.chartArea}>
        {tab === 'Overview' && <OverviewChart data={subjectScores} />}
        {tab === 'Progress' && <ProgressChart data={progressData} subjects={subjects} />}
        {tab === 'Radar' && <RadarChartView data={subjectScores} />}
      </div>
    </div>
  )
}

function OverviewChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-3)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function ProgressChart({ data, subjects }) {
  if (data.length < 2) return (
    <div className={styles.empty}>Add marks across multiple terms to see progress</div>
  )
  const colors = subjects.reduce((acc, s) => { acc[shortName(s.name)] = s.color; return acc }, {})
  const keys = subjects.map(s => shortName(s.name))
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="term" tick={{ fontSize: 12, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {keys.map(k => (
          <Line
            key={k}
            type="monotone"
            dataKey={k}
            stroke={colors[k]}
            strokeWidth={2}
            dot={{ r: 4, fill: colors[k] }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

function RadarChartView({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-2)', fontFamily: 'DM Sans' }} />
        <Radar dataKey="score" stroke="#378ADD" fill="#378ADD" fillOpacity={0.2} strokeWidth={2} />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border-strong)',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 13,
      color: 'var(--text)',
      fontFamily: 'DM Sans',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
    }}>
      {label && <div style={{ color: 'var(--text-2)', marginBottom: 4, fontSize: 11 }}>{label}</div>}
      {payload.map((p, i) => p.value !== null && (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || p.fill, display: 'inline-block' }} />
          <span style={{ color: 'var(--text-2)', fontSize: 12 }}>{p.name || p.dataKey}</span>
          <span style={{ fontFamily: 'DM Mono', fontWeight: 500 }}>{p.value}%</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{getGrade(p.value).label}</span>
        </div>
      ))}
    </div>
  )
}

function shortName(name) {
  const words = name.split(' ')
  if (words.length === 1) return name.slice(0, 6)
  return words.map(w => w[0].toUpperCase()).join('')
}
