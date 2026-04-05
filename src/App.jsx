import { useState, useEffect } from 'react'
import { useStore } from './useStore'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import ChartsPanel from './components/ChartsPanel'
import TermControls from './components/TermControls'
import SubjectBlock from './components/SubjectBlock'
import styles from './App.module.css'

export default function App() {
  const {
    subjects, tasks, darkMode, year, currentTerm, expanded, terms,
    setCurrentTerm, setYear, toggleDarkMode,
    addTask, deleteTask, updateTask,
    addSubject, deleteSubject, toggleExpand,
  } = useStore()

  const [newSubject, setNewSubject] = useState('')

  // Apply dark mode to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-dark', darkMode)
  }, [darkMode])

  const handleEditYear = () => {
    const input = prompt('Enter year (10–12):', String(year))
    if (input === null) return
    const parsed = parseInt(input)
    if (parsed >= 10 && parsed <= 12) {
      setYear(parsed)
    } else {
      alert('Please enter a year between 10 and 12')
    }
  }

  const handleAddSubject = () => {
    if (!newSubject.trim()) return
    addSubject(newSubject)
    setNewSubject('')
  }

  return (
    <div className={styles.wrap}>
      <Header
        darkMode={darkMode}
        year={year}
        onToggleDark={toggleDarkMode}
        onEditYear={handleEditYear}
      />

      <SummaryCards
        subjects={subjects}
        tasks={tasks}
        currentTerm={currentTerm}
      />

      <ChartsPanel
        subjects={subjects}
        tasks={tasks}
        currentTerm={currentTerm}
      />

      <TermControls
        terms={terms}
        currentTerm={currentTerm}
        onSelect={setCurrentTerm}
        newSubject={newSubject}
        onSubjectChange={setNewSubject}
        onAddSubject={handleAddSubject}
      />

      <div className={`${styles.subjectList} fade-up-3`}>
        {subjects.map(s => (
          <SubjectBlock
            key={s.id}
            subject={s}
            tasks={tasks}
            currentTerm={currentTerm}
            expanded={!!expanded[s.id]}
            onToggle={() => toggleExpand(s.id)}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
            onDeleteSubject={deleteSubject}
          />
        ))}
      </div>
    </div>
  )
}
