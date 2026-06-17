import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

const navLinks = [
  { to: '/', label: 'Domov' },
  { to: '/volne-kridla', label: 'Voľné Krídla' },
  { to: '/o-mne', label: 'O mne' },
  { to: '/fotogaleria', label: 'Fotogaléria' },
  { to: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Hlavná navigácia">
        <div className={styles.logo}>
          <NavLink to="/" onClick={closeMenu}>
            Voľné Krídla
          </NavLink>
        </div>

        <button
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Otvoriť menu"
        >
          <span className={styles.hamburger} aria-hidden="true" />
        </button>

        <ul className={`${styles.navList} ${isOpen ? styles.isOpen : ''}`}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
