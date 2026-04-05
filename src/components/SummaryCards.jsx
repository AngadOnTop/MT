import { useMemo } from 'react'
import { calcSubject, getGrade } from '../useStore'
import styles from './SummaryCards.module.css'

export default function SummaryCards({ subjects, tasks, currentTerm }) {
  const stats = useMemo(() => {
    let scores = [], countGood = 0, totalScore = 0, count = 0
    subjects.forEach(s => {
      const r = calcSubject(tasks, s.id, currentTerm)
      if (r !== null) {
        scores.push(r.score)
        totalScore += r.score
        count++
        if (r.score >= 80) countGood++
      }
    })
    const avg = count > 0 ? totalScore / count : null
    const best = scores.length ? Math.max(...scores) : null
    const totalAssessments = Object.values(tasks).flat().length
    return { avg, best, countGood, count, totalAssessments }
  }, [subjects, tasks, currentTerm])

  return (
    <div className={`${styles.grid} fade-up-1`}>
      <StatCard
        label="Overall average"
        value={stats.avg !== null ? stats.avg.toFixed(1) + '%' : '—'}
        sub={`${stats.count} subject${stats.count !== 1 ? 's' : ''} tracked`}
      />
      <StatCard
        label="Best subject"
        value={stats.best !== null ? stats.best.toFixed(1) + '%' : '—'}
        sub={stats.best !== null ? getGrade(stats.best).label + ' grade' : 'no data yet'}
      />
      <StatCard
        label="Scoring 80%+"
        value={stats.countGood}
        sub={`of ${stats.count} subject${stats.count !== 1 ? 's' : ''}`}
      />
      <StatCard
        label="Assessments"
        value={stats.totalAssessments}
        sub="total tasks entered"
      />
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      <div className={styles.sub}>{sub}</div>
    </div>
  )
}
