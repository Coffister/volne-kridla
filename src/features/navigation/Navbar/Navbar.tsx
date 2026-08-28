import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Stack, Image } from "@/ui/primitives";
import Squircle from "@/ui/primitives/Squircle";
import Button from "@/ui/components/Button";
import ChevronDownIcon from "@/ui/icons/ChevronDownIcon";
import MenuIcon from "@/ui/icons/MenuIcon";
import CloseIcon from "@/ui/icons/CloseIcon";

import logo from "@/assets/logos/volnekridla-logo.svg";
import { getLenis } from "@/lib/scroll";

import styles from "./Navbar.module.css";

const VK_PATH = "/volne-kridla";

// the dropdown opener itself jumps to the top hero section of the page
const VK_HERO_ID = "hero";

// dropdown label -> id of the section it scrolls to on the Voľné krídla page.
// "O voľnom lietaní" points at the hero so the user always lands on it first
// (offset 0 — it sits at the very top of the page).
const VK_SECTIONS = [
  { label: "O voľnom lietaní", id: VK_HERO_ID, offset: 0 },
  { label: "Tipy, triky a zaujímavosti", id: "tipy" },
  { label: "Najčastejšie otázky", id: "otazky" },
  { label: "Target tréning", id: "target" },
] as const;

// clearance below the floating navbar
const SCROLL_OFFSET = -120;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMobileSubOpen, setIsMobileSubOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const pendingSectionId = useRef<string | null>(null);

  const openMenu = () => {
    setIsMenuMounted(true);
    setIsMenuOpen(true);
    setIsMobileSubOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = useCallback(
    (id: string, offset: number = SCROLL_OFFSET) => {
      const target = document.getElementById(id);
      if (!target) return false;

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return true;
    },
    [],
  );

  const goToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
    offset?: number,
  ) => {
    event.preventDefault();
    closeMenu();

    if (location.pathname === VK_PATH) {
      scrollToSection(id, offset);
    } else {
      // navigate to the page first, then scroll once the section is mounted
      pendingSectionId.current = id;
      navigate(VK_PATH);
    }
  };

  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    section: { id: string; offset?: number },
  ) => goToSection(event, section.id, section.offset);

  const handleHeroClick = (event: MouseEvent<HTMLAnchorElement>) =>
    goToSection(event, VK_HERO_ID, 0);

  // run a pending cross-page scroll after the Voľné krídla page has rendered
  useEffect(() => {
    if (location.pathname !== VK_PATH || !pendingSectionId.current) return;

    const id = pendingSectionId.current;
    let attempts = 0;
    let timer: number;

    const attempt = () => {
      if (scrollToSection(id) || attempts > 40) {
        pendingSectionId.current = null;
        return;
      }
      attempts += 1;
      timer = window.setTimeout(attempt, 50);
    };

    timer = window.setTimeout(attempt, 80);
    return () => window.clearTimeout(timer);
  }, [location.pathname, scrollToSection]);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;

    const handleScroll = (e: { velocity: number }) => {
      const el = document.querySelector<HTMLElement>(`.${styles.surface}`);
      if (!el) return;

      const squish = Math.min(Math.abs(e.velocity) * 0.02, 0.03);
      el.style.transform = `scale(${1 + squish}, ${1 - squish})`;
    };

    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll);
  }, []);

  return (
    <Box as="header" className={styles.navbar}>
      <Box className={`${styles.surface} ${isMenuOpen ? styles.surfaceOpen : ""}`}>
        <Stack
          direction="row"
          align="center"
          justify="space-between"
          className={styles.inner}
        >
          <Box className={styles.logoSlot}>
            <Image
              src={logo}
              alt="Volnekridla"
              className={styles.logo}
            />
          </Box>

          <Stack direction="row" align="center" gap="xs" className={styles.list}>
            <Link to="/">Domov</Link>

            <Box className={styles.dropdown}>
              <Link
                to={VK_PATH}
                className={styles.dropdownTrigger}
                onClick={handleHeroClick}
              >
                Voľné krídla
                <ChevronDownIcon />
              </Link>

              <Squircle
                radius="md"
                className={styles.dropdownMenu}
                style={{ position: "absolute" }}
              >
                <Stack direction="column" gap="xs">
                  {VK_SECTIONS.map((section) => (
                    <a
                      key={section.id}
                      href={`${VK_PATH}#${section.id}`}
                      onClick={(event) => handleSectionClick(event, section)}
                    >
                      {section.label}
                    </a>
                  ))}
                </Stack>
              </Squircle>
            </Box>

            <Link to="/o-mne">O mne</Link>
            <Link to="/fotogaleria">Fotogaléria</Link>
            <Link to="/eshop">Produkty</Link>
          </Stack>

          <Button variant="navbar" weight="medium" className={styles.cta}>
            Začať lietať
          </Button>

          <button
            type="button"
            className={styles.menuToggle}
            aria-label={isMenuOpen ? "Zavrieť menu" : "Otvoriť menu"}
            aria-expanded={isMenuOpen}
            onClick={() => (isMenuOpen ? closeMenu() : openMenu())}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </Stack>

        {isMenuMounted ? (
          <div
            className={`${styles.mobileMenuWrap} ${isMenuOpen ? styles.mobileMenuIn : styles.mobileMenuOut}`}
            onAnimationEnd={() => {
              if (!isMenuOpen) setIsMenuMounted(false);
            }}
          >
            <Squircle radius="md" className={styles.mobileMenu}>
              <Stack direction="column" gap="sm">
                <Link to="/" onClick={closeMenu}>Domov</Link>

                <Box>
                  <button
                    type="button"
                    className={styles.mobileSubTrigger}
                    aria-expanded={isMobileSubOpen}
                    onClick={() => setIsMobileSubOpen((open) => !open)}
                  >
                    Voľné krídla
                    <span className={isMobileSubOpen ? styles.chevronOpen : ""}>
                      <ChevronDownIcon />
                    </span>
                  </button>

                  {isMobileSubOpen ? (
                    <Stack direction="column" gap="sm" className={styles.mobileSubList}>
                      {VK_SECTIONS.map((section) => (
                        <a
                          key={section.id}
                          href={`${VK_PATH}#${section.id}`}
                          onClick={(event) => handleSectionClick(event, section)}
                        >
                          {section.label}
                        </a>
                      ))}
                    </Stack>
                  ) : null}
                </Box>

                <Link to="/o-mne" onClick={closeMenu}>O mne</Link>
                <Link to="/fotogaleria" onClick={closeMenu}>Fotogaléria</Link>
                <Link to="/eshop" onClick={closeMenu}>Produkty</Link>

                <Button variant="navbar" weight="medium" fullWidth onClick={closeMenu}>
                  Začať lietať
                </Button>
              </Stack>
            </Squircle>
          </div>
        ) : null}
      </Box>
    </Box>
  );
}
