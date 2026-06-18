import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerInner}>
          <p className={styles.copyright}>© Voľné Krídla 2025</p>
          <p className={styles.designer}>Dizajn vytvoril Coffister</p>
        </div>
      </div>
    </footer>
  )
}
