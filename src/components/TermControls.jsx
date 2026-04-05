import styles from './TermControls.module.css'

export default function TermControls({ terms, currentTerm, onSelect, newSubject, onSubjectChange, onAddSubject }) {
  const handleKey = (e) => {
    if (e.key === 'Enter') onAddSubject()
  }
  return (
    <div className={`fade-up-2`}>
      <div className={styles.termRow}>
        {terms.map(t => (
          <button
            key={t}
            className={`${styles.btn} ${t === currentTerm ? styles.active : ''}`}
            onClick={() => onSelect(t)}
          >
            {t === 'all' ? 'All terms' : t}
          </button>
        ))}
      </div>
      <div className={styles.subjectRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="Add custom subject..."
          value={newSubject}
          onChange={e => onSubjectChange(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className={styles.addBtn} onClick={onAddSubject}>+ Add subject</button>
      </div>
    </div>
  )
}
