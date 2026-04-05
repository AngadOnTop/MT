import { useMemo } from 'react'
import { calcSubject, getGrade } from '../useStore'
import styles from './SubjectBlock.module.css'

export default function SubjectBlock({ subject, tasks, currentTerm, expanded, onToggle, onAddTask, onDeleteTask, onUpdateTask, onDeleteSubject }) {
  const allTasks = tasks[subject.id] || []
  const visibleTasks = currentTerm === 'all' ? allTasks : allTasks.filter(t => t.term === currentTerm)
  const result = useMemo(() => calcSubject(tasks, subject.id, currentTerm), [tasks, subject.id, currentTerm])
  const score = result !== null ? result.score.toFixed(1) + '%' : '—'
  const barWidth = result !== null ? Math.min(result.score, 100).toFixed(1) : 0
  const grade = result !== null ? getGrade(result.score) : null

  return (
    <div className={styles.block}>
      {/* Header */}
      <div className={styles.header} onClick={onToggle} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onToggle()}>
        <div className={styles.dot} style={{ background: subject.color }} />
        <span className={styles.name}>{subject.name}</span>
        <span className={styles.score}>{score}</span>
        {grade && (
          <span className={styles.grade} style={{ background: grade.bg, color: grade.color }}>
            {grade.label}
          </span>
        )}
        <button
          className={styles.deleteSubj}
          onClick={e => { e.preventDefault(); e.stopPropagation(); onDeleteSubject(subject.id) }}
          onTouchEnd={e => { e.preventDefault(); e.stopPropagation(); onDeleteSubject(subject.id) }}
          type="button"
          title="Delete subject"
        >×</button>
        <span className={`${styles.arrow} ${expanded ? styles.arrowOpen : ''}`}>▶</span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressBar} style={{ background: subject.color, width: barWidth + '%' }} />
      </div>

      {/* Body */}
      {expanded && (
        <div className={styles.body}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '36%' }}>Task</th>
                <th style={{ width: '14%' }}>Term</th>
                <th style={{ width: '16%' }}>Mark %</th>
                <th style={{ width: '16%' }}>Weight %</th>
                <th style={{ width: '13%' }}>Weighted</th>
                <th style={{ width: '5%' }} />
              </tr>
            </thead>
            <tbody>
              {visibleTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>No tasks yet — click + add task below</td>
                </tr>
              ) : visibleTasks.map(t => {
                const realIdx = allTasks.indexOf(t)
                const m = parseFloat(t.mark)
                const w = parseFloat(t.weight)
                const weighted = (!isNaN(m) && !isNaN(w) && w > 0) ? ((m / 100) * w).toFixed(1) + '%' : '—'
                return (
                  <tr key={realIdx} className={styles.row}>
                    <td>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={t.task}
                        onChange={e => onUpdateTask(subject.id, realIdx, 'task', e.target.value)}
                      />
                    </td>
                    <td className={styles.center}>
                      <select
                        className={styles.termSelect}
                        value={t.term}
                        onChange={e => onUpdateTask(subject.id, realIdx, 'term', e.target.value)}
                      >
                        {['T1','T2','T3','T4'].map(tm => <option key={tm} value={tm}>{tm}</option>)}
                      </select>
                    </td>
                    <td className={styles.center}>
                      <input
                        type="number"
                        className={styles.numInput}
                        min={0} max={100}
                        value={t.mark}
                        placeholder="—"
                        onChange={e => onUpdateTask(subject.id, realIdx, 'mark', e.target.value)}
                      />
                    </td>
                    <td className={styles.center}>
                      <input
                        type="number"
                        className={styles.numInput}
                        min={0} max={100}
                        value={t.weight}
                        placeholder="—"
                        onChange={e => onUpdateTask(subject.id, realIdx, 'weight', e.target.value)}
                      />
                    </td>
                    <td className={`${styles.center} ${styles.weighted}`}>{weighted}</td>
                    <td className={styles.center}>
                      <button className={styles.delBtn} onClick={() => onDeleteTask(subject.id, realIdx)} title="Delete task">×</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className={styles.footer}>
            <button className={styles.addTaskBtn} onClick={() => onAddTask(subject.id)}>+ add task</button>
            <span className={styles.weightInfo}>
              {result ? `weight used: ${result.totalWeight.toFixed(0)}%` : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
