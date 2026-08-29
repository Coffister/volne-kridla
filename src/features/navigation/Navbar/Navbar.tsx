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

// the "Voľné krídla" dropdown opener jumps to the top hero section of the page
const VK_HERO_ID = "hero";

type NavItem =
  | { label: string; to: string }
  | { label: string; id: string; offset?: number };

// single source of truth for nav order. The mobile menu renders this list
// verbatim as a flat set of links (no dropdown — nobody was opening it).
const NAV_ITEMS: NavItem[] = [
  { label: "Domov", to: "/" },
  { label: "O mne", to: "/o-mne" },
  { label: "Produkty", to: "/eshop" },
  { label: "Kurz voľného lietania", to: "/konzultacia?vetva=kurz" },
  { label: "Konzultácie", to: "/konzultacia" },
  { label: "O voľnom lietaní", id: VK_HERO_ID, offset: 0 },
  { label: "Tipy a triky", id: "tipy" },
  { label: "Target Tréning", id: "target" },
  { label: "Najčastejšie otázky", id: "otazky" },
  { label: "Fotogaléria", to: "/fotogaleria" },
];

const isSectionItem = (
  item: NavItem,
): item is Extract<NavItem, { id: string }> => "id" in item;

// on desktop the four Voľné krídla sections stay tucked into the dropdown
const VK_SECTIONS = NAV_ITEMS.filter(isSectionItem);

// clearance below the floating navbar
const SCROLL_OFFSET = -120;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const pendingSectionId = useRef<string | null>(null);

  const openMenu = () => {
    setIsMenuMounted(true);
    setIsMenuOpen(true);
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
    pendingSectionId.current = null;

    let waited = 0;
    let corrections = 0;
    const timers: number[] = [];

    // keep nudging: first wait for the section to mount, then re-scroll a few
    // more times to correct for layout shift as lazy images/sections below load
    const attempt = () => {
      const found = scrollToSection(id);

      if (!found && waited < 2000) {
        waited += 50;
        timers.push(window.setTimeout(attempt, 50));
        return;
      }
      if (found && corrections < 4) {
        corrections += 1;
        timers.push(window.setTimeout(attempt, 250));
      }
    };

    timers.push(window.setTimeout(attempt, 80));
    return () => timers.forEach((t) => window.clearTimeout(t));
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
            <Link to="/o-mne">O mne</Link>
            <Link to="/eshop">Produkty</Link>
            <Link to="/konzultacia?vetva=kurz">Kurz voľného lietania</Link>
            <Link to="/konzultacia">Konzultácie</Link>

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

            <Link to="/fotogaleria">Fotogaléria</Link>
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
                {NAV_ITEMS.map((item) =>
                  isSectionItem(item) ? (
                    <a
                      key={item.label}
                      href={`${VK_PATH}#${item.id}`}
                      onClick={(event) => handleSectionClick(event, item)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link key={item.label} to={item.to} onClick={closeMenu}>
                      {item.label}
                    </Link>
                  ),
                )}

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
