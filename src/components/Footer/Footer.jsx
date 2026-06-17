import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>Voľné Krídla</span>
          <p className={styles.tagline}>Sloboda pohybu, sloboda ducha.</p>
        </div>

        <nav className={styles.links} aria-label="Pätičková navigácia">
          <Link to="/">Domov</Link>
          <Link to="/volne-kridla">Voľné Krídla</Link>
          <Link to="/o-mne">O mne</Link>
          <Link to="/fotogaleria">Fotogaléria</Link>
          <Link to="/blog">Blog</Link>
        </nav>

        <div className={styles.social}>
          <a
            href="https://www.instagram.com/volnekridla.sk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fa-brands fa-instagram" aria-hidden="true" />
          </a>
          <a
            href="https://www.facebook.com/volnekridla.sk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fa-brands fa-facebook" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {currentYear} Voľné Krídla. Všetky práva vyhradené.</p>
      </div>
    </footer>
  )
}
