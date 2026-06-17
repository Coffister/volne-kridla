import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const volneKridlaDropdown = [
  { label: 'O voľnom lietaní', href: '/volne-kridla#about' },
  { label: 'Najčastejšie otázky', href: '/volne-kridla#faq' },
  { label: 'Tipy, triky a zaujímavosti', href: '/volne-kridla#tips' },
  { label: 'Target tréning', href: '/volne-kridla#target' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location])

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function scrollToForm(e) {
    e.preventDefault()
    const el = document.getElementById('contact-form')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Hlavná navigácia">
        <NavLink to="/" className={styles.logo} aria-label="Voľné Krídla – domov">
          <img
            src="https://volnekridla.sk/wp-content/uploads/2025/08/Volne-Kridla.svg"
            alt="Voľné Krídla"
            className={styles.logoImg}
          />
        </NavLink>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-expanded={menuOpen}
          aria-label="Otvoriť menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`${styles.navList} ${menuOpen ? styles.menuOpen : ''}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              Domov
            </NavLink>
          </li>

          <li className={styles.hasDropdown} ref={dropdownRef}>
            <button
              className={`${styles.link} ${styles.dropdownToggle} ${location.pathname === '/volne-kridla' ? styles.active : ''}`}
              onClick={() => setDropdownOpen((p) => !p)}
              aria-expanded={dropdownOpen}
            >
              Voľné krídla <i className="fa-solid fa-chevron-down" aria-hidden="true" />
            </button>
            <ul className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ''}`}>
              <li>
                <NavLink to="/volne-kridla" end className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                  Voľné krídla
                </NavLink>
              </li>
              {volneKridlaDropdown.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <NavLink to="/o-mne" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              O mne
            </NavLink>
          </li>
          <li>
            <NavLink to="/fotogaleria" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              Fotogaléria
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              Blog
            </NavLink>
          </li>
          <li>
            <a href="#contact-form" className={styles.ctaBtn} onClick={scrollToForm}>
              Začať lietať
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
