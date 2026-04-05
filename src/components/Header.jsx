import styles from './Header.module.css'

export default function Header({ darkMode, year, onToggleDark, onEditYear }) {
  return (
    <div className={`${styles.header} fade-up`}>
      <div className={styles.headerTop}>
        <div>
          <h1 className={styles.title}>HSC Marks Tracker</h1>
          <div className={styles.subtitle}>Track assessments, weights, and final marks</div>
        </div>
        <div className={styles.controls}>
          <button className={styles.darkBtn} onClick={onToggleDark} title="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span
            className={styles.yearBadge}
            onClick={onEditYear}
            title="Click to edit year"
          >
            Year {year}
          </span>
        </div>
      </div>
    </div>
  )
}
