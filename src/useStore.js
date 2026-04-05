import { useState, useCallback } from 'react'

const DEFAULT_SUBJECTS = [
  { id: 'eng',  name: 'English standard',    color: '#378ADD' },
  { id: 'math', name: 'Maths advanced',       color: '#1D9E75' },
  { id: 'ext',  name: 'Maths extension',      color: '#7F77DD' },
  { id: 'ec',   name: 'Enterprise computing', color: '#BA7517' },
  { id: 'se',   name: 'Software engineering', color: '#D85A30' },
  { id: 'art',  name: 'Art',                  color: '#D4537E' },
  { id: 'biz',  name: 'Business studies',     color: '#639922' },
]

const CUSTOM_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2']

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}

function persist(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function useStore() {
  const [subjects, setSubjectsRaw] = useState(() => {
    const saved = load('hsc_subjects_v1', null)
    return saved && saved.length > 0 ? saved : JSON.parse(JSON.stringify(DEFAULT_SUBJECTS))
  })
  const [tasks, setTasksRaw] = useState(() => {
    const saved = load('hsc_tasks_v2', {})
    const base = saved || {}
    DEFAULT_SUBJECTS.forEach(s => { if (!base[s.id]) base[s.id] = [] })
    return base
  })
  const [darkMode, setDarkModeRaw] = useState(() => load('hsc_darkmode', false))
  const [year, setYearRaw] = useState(() => load('hsc_year', 11))
  const [currentTerm, setCurrentTerm] = useState('all')
  const [expanded, setExpanded] = useState({})

  const setSubjects = useCallback((fn) => {
    setSubjectsRaw(prev => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      persist('hsc_subjects_v1', next)
      return next
    })
  }, [])

  const setTasks = useCallback((fn) => {
    setTasksRaw(prev => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      persist('hsc_tasks_v2', next)
      return next
    })
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkModeRaw(prev => {
      persist('hsc_darkmode', !prev)
      return !prev
    })
  }, [])

  const setYear = useCallback((y) => {
    setYearRaw(y)
    persist('hsc_year', y)
  }, [])

  const terms = year >= 11 ? ['all', 'T1', 'T2', 'T3'] : ['all', 'T1', 'T2', 'T3', 'T4']

  // Task actions
  const addTask = useCallback((sid) => {
    setTasks(prev => ({
      ...prev,
      [sid]: [...(prev[sid] || []), { task: 'New assessment', term: 'T1', mark: '', weight: '' }]
    }))
    setExpanded(prev => ({ ...prev, [sid]: true }))
  }, [setTasks])

  const deleteTask = useCallback((sid, idx) => {
    setTasks(prev => ({
      ...prev,
      [sid]: prev[sid].filter((_, i) => i !== idx)
    }))
  }, [setTasks])

  const updateTask = useCallback((sid, idx, field, val) => {
    setTasks(prev => {
      const updated = [...(prev[sid] || [])]
      updated[idx] = { ...updated[idx], [field]: val }
      return { ...prev, [sid]: updated }
    })
  }, [setTasks])

  // Subject actions
  const addSubject = useCallback((name) => {
    if (!name.trim()) return
    const id = 'custom_' + Date.now()
    const color = CUSTOM_COLORS[subjects.length % CUSTOM_COLORS.length]
    const newSubject = { id, name: name.trim(), color }
    setSubjects(prev => [...prev, newSubject])
    setTasks(prev => ({ ...prev, [id]: [] }))
  }, [subjects.length, setSubjects, setTasks])

  const deleteSubject = useCallback((id) => {
    setSubjects(prev => prev.filter(s => s.id !== id))
    setTasks(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [setSubjects, setTasks])

  const toggleExpand = useCallback((sid) => {
    setExpanded(prev => ({ ...prev, [sid]: !prev[sid] }))
  }, [])

  return {
    subjects, tasks, darkMode, year, currentTerm, expanded, terms,
    setCurrentTerm, setYear, toggleDarkMode,
    addTask, deleteTask, updateTask,
    addSubject, deleteSubject, toggleExpand,
  }
}

export function calcSubject(tasks, sid, currentTerm) {
  const allTasks = tasks[sid] || []
  const filtered = currentTerm === 'all' ? allTasks : allTasks.filter(t => t.term === currentTerm)
  let weightedSum = 0, totalWeight = 0
  filtered.forEach(t => {
    const m = parseFloat(t.mark)
    const w = parseFloat(t.weight)
    if (!isNaN(m) && !isNaN(w) && w > 0 && m >= 0 && m <= 100) {
      weightedSum += (m / 100) * w
      totalWeight += w
    }
  })
  if (totalWeight === 0) return null
  return { score: (weightedSum / totalWeight) * 100, totalWeight }
}

export function getGrade(pct) {
  if (pct >= 90) return { label: 'A+', bg: '#eaf3de', color: '#3b6d11' }
  if (pct >= 80) return { label: 'A',  bg: '#eaf3de', color: '#3b6d11' }
  if (pct >= 70) return { label: 'B',  bg: '#e6f1fb', color: '#185fa5' }
  if (pct >= 60) return { label: 'C',  bg: '#faeeda', color: '#854f0b' }
  if (pct >= 50) return { label: 'D',  bg: '#faece7', color: '#993c1d' }
  return               { label: 'E',  bg: '#fcebeb', color: '#a32d2d' }
}
