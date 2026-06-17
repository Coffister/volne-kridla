import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
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
  const navRef = useRef(null)
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
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function scrollToForm(e) {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.getElementById('contact-form')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const isVolneKridlaActive = location.pathname === '/volne-kridla'

  return (
    <div className={styles.headerWrapper}>
      <header className={styles.header}>
        <nav
          ref={navRef}
          className={`${styles.nav} ${menuOpen ? styles.open : ''}`}
          aria-label="Hlavná navigácia"
        >
          <Link to="/" aria-label="Voľné Krídla – domov">
            <img
              src="https://volnekridla.sk/wp-content/uploads/2025/08/logo-border-stroke.webp"
              alt="Voľné Krídla"
              className={styles.logoImg}
            />
          </Link>

          <button
            className={`${styles.menuToggle} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            aria-controls="primary-navigation"
          >
            <span className={styles.bar} />
          </button>

          <div className={styles.navLinks} id="primary-navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              Domov
            </NavLink>

            <div
              ref={dropdownRef}
              className={`${styles.dropdown} ${dropdownOpen ? styles.open : ''}`}
            >
              <button
                className={`${styles.dropdownToggle} ${isVolneKridlaActive ? styles.dropdownToggleActive : ''}`}
                onClick={() => setDropdownOpen((p) => !p)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                Voľné krídla
              </button>
              <ul className={styles.dropdownMenu} role="menu">
                <li>
                  <NavLink
                    to="/volne-kridla"
                    end
                    className={styles.dropdownLink}
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    Voľné krídla
                  </NavLink>
                </li>
                {volneKridlaDropdown.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className={styles.dropdownLink}
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <NavLink
              to="/o-mne"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              O mne
            </NavLink>
            <NavLink
              to="/fotogaleria"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              Fotogaléria
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              Blog
            </NavLink>

            <a className={`${styles.cta} ${styles.ctaMobile}`} href="#contact-form" onClick={scrollToForm}>
              Začať lietať
            </a>
          </div>

          <a className={styles.cta} href="#contact-form" onClick={scrollToForm}>
            Začať lietať
          </a>
        </nav>
      </header>
    </div>
  )
}
