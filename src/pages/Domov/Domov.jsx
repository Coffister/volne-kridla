import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import BookingForm from '../../components/BookingForm/BookingForm'
import styles from './Domov.module.css'
import wordmarkSvg from '../../assets/images/volne-kridla.svg'

const MARQUEE_ROW1 = [
  'Konzultácia výživy', 'Voľné lietanie', 'Target tréning',
  'Individuálny prístup', 'Tipy a triky', 'Rozsiahlá komunita',
  'Target tréning', 'Konzultácie výchovy',
]
const MARQUEE_ROW2 = [
  'Individuálny prístup', 'Tipy a triky', 'Konzultácie výchovy',
  'Target tréning', 'Konzultácia výživy', 'Voľné lietanie',
  'Rozsiahlá komunita', 'Target tréning',
]

const TABS = {
  letanie: {
    label: 'Voľné lietanie',
    heading: 'Kurz voľného lietania',
    body: 'Kurz je určený pre majiteľov papagájov, ktorí nechcú riskovať ani trénovať metódou pokus–omyl. Naučíte sa systematicky budovať spoľahlivé privolanie a pripravovať papagája na situácie, v ktorých si mu môžete dovoliť slobodu.',
    items: [
      'Systematické budovanie spoľahlivého privolania',
      'Príprava na vonkajšie prostredie a rušivé podnety',
      'Bezpečné a štruktúrované lekcie krok za krokom',
    ],
    href: '/volne-kridla',
  },
  trening: {
    label: 'Tréning',
    heading: 'Prečo učiť papagája lietať?',
    body: 'Hoci sú papagáje na let stvorené, nevedia ho prirodzene len tak robiť a robiť ho dobre v každom veku. Musia sa to naučiť a správne zvládnuť zručnosti. Letanie vonku je oveľa odlišné od lietania v interiéri (vietor, rozptyľovanie, dravce, preťaženie podnetmi atď.).',
    items: [
      'Tréning prispôsobený tempu papagája',
      'Vybudovanie dôvery a istoty pri lete',
      'Bezpečné nastavenie podmienok pre prvý let',
    ],
    href: '/volne-kridla',
  },
}

const TESTIMONIALS = [
  { name: 'Natália a Arny 🦜', quote: 'Osloviť Franku z @volne.kridla bolo jedným z najlepších rozhodnutí, aké som mohla urobiť. Odporúčam to každému, kto chce skutočne porozumieť svojmu operencovi.' },
  { name: 'Alenka a Noro 🦜', quote: 'Ahoj Franka chcem sa ti poďakovať za spoluprácu a za veľké množstvo rád ako pracovať s naším Norom. Vďaka tebe je naša spolupráca na úplne inej úrovni.' },
  { name: 'Mirka a Lariska 🦜', quote: 'Franka bola prvý človek, ktorý mi otvoril dvere do sveta papagájov a ich tréningu. Keď som začínala, trpezlivo mi vysvetlila všetko od základov.' },
  { name: 'Feri, Danka a Zeri 🦜', quote: 'Voľné lietanie s našou Zeri je super skúsenosť. Ukazuje, že papagáj vie dôverovať a cítiť sa slobodne ale nedá sa to urobiť zo dňa na deň.' },
  { name: 'Henrieta a Patrik 🦜', quote: 'S výcvikovým procesom v tréningovej škole Voľné krídla som veľmi spokojná. Rovnako aj s prístupom aj dosiahnutými výsledkami.' },
  { name: 'Laura a AZU 🦜', quote: 'S konzultáciámi som bola veľmi spokojná. Hneď po prvej konzultácii sme nastavili správny jedálniček aj tréningy a už po krátkom čase sme videli výsledky.' },
]

export default function Domov() {
  const [activeTab, setActiveTab] = useState('trening')
  const tab = TABS[activeTab]

  return (
    <>
      <Helmet>
        <title>Domov - Voľné Krídla</title>
        <meta name="description" content="Spoznaj fascinujúci svet voľného lietania, buduj dôveru a preži spoločné dobrodružstvo so svojím opereným parťákom – bezpečne a s radosťou." />
      </Helmet>

      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <clipPath id="squircle" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0 C 0.8289,0 1,0.1711 1,0.5 C 1,0.8289 0.8289,1 0.5,1 C 0.1711,1 0,0.8289 0,0.5 C 0,0.1711 0.1711,0 0.5,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <div className="container">
          <img src={wordmarkSvg} alt="Voľné krídla" className={styles.wordmark} />
          <span className={styles.heroTag}>Nielen škola pre papagáje</span>
          {/* Panel br: 40px | Padding: 8px | Image br = 40-8 = 32px */}
          <div className={styles.heroPanel}>
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <p className={styles.heroLabel}>Tréning voľného letu</p>
                <h1 className={styles.heroTitle}>
                  Dopraj svojmu operencovi voľnosť letu, ktorú si zaslúži
                </h1>
                <p className={styles.heroQuote}>
                  „Sloboda nie je len možnosť lietať, ale aj vedieť, kam sa vrátiť."
                </p>
                <div className={styles.heroBtns}>
                  <a
                    href="#kontakt"
                    className={styles.btnPrimary}
                    onClick={e => { e.preventDefault(); document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' }) }}
                  >
                    Začať lietať
                  </a>
                  <a href="/volne-kridla" className={styles.btnOutline}>Zistiť viac</a>
                </div>
              </div>
              <div className={styles.heroImgWrap}>
                <div className={styles.heroImg} role="img" aria-label="Papagáj vo voľnom lete" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <section className={styles.marquee} aria-hidden="true">
        {[MARQUEE_ROW1, MARQUEE_ROW2].map((row, ri) => (
          <div key={ri} className={styles.marqueeRow}>
            <div className={styles.marqueeTrack}>
              {[...row, ...row].map((label, i) => (
                <span key={i} className={styles.pill}>{label}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ─── O VOĽNÝCH KRÍDLACH ─── */}
      <section className={styles.about}>
        <div className="container">
          <header className={styles.secHead}>
            <h2 className={styles.secTitle}>O Voľných krídlach</h2>
            <p className={styles.secSub}>Aký druh tréningu je pre mňa vhodný?</p>
          </header>
          <div className={styles.aboutCard}>
            <div className={styles.tabs}>
              {Object.entries(TABS).map(([key, t]) => (
                <button
                  key={key}
                  className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutLeft}>
                <div className={styles.aboutImg} role="img" aria-label={tab.label} />
                <p className={styles.aboutImgLabel}>Tréning nikdy nekončí</p>
              </div>
              <div className={styles.aboutRight}>
                <h3 className={styles.aboutHeading}>{tab.heading}</h3>
                <p className={styles.aboutBody}>{tab.body}</p>
                <div className={styles.featureBox}>
                  {tab.items.map(item => (
                    <div key={item} className={styles.featureItem}>
                      <span className={styles.featureIcon} aria-hidden="true">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.aboutFooter}>
                  <span className={styles.aboutTag}>Čo vás naučím?</span>
                  <a
                    href="#kontakt"
                    className={styles.btnPrimary}
                    onClick={e => { e.preventDefault(); document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' }) }}
                  >
                    Potrebujem pomôcť
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FRANKA ─── */}
      <section className={styles.franka}>
        <div className="container">
          <span className={styles.floatTag}>Kto vlastne som?</span>
          <div className={styles.frankaGrid}>
            <div className={styles.frankaImgWrap}>
              <div className={styles.frankaImg} role="img" aria-label="Franka" />
            </div>
            <div className={styles.frankaContent}>
              <p className={styles.frankaSub}>Ahoj, volám sa</p>
              <h2 className={styles.frankaName}>Franka</h2>
              <p className={styles.frankaBody}>
                a mojou vášňou sú tieto inteligentné operené tvory, venujem sa ich výchove no najmä
                tréningu voľného letu. Nejde o to, že vám počas pár minút nadiktujem, čo máte robiť.
                Spolu si vysvetlíme, prečo veci fungujú tak, ako fungujú, aby ste tomu naozaj
                porozumeli. Mojím cieľom je, aby ste pochopili ako papagáj rozmýšľa a reaguje.
              </p>
              <a href="/o-mne" className={styles.btnOutline}>Zistiť o mne viac</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM ─── */}
      <section className={styles.instagram}>
        <div className="container">
          <h2 className={styles.igTitle}>Sleduj každý náš let zblízka!</h2>
          <p className={styles.igSub}>
            Na Instagrame ťa čakajú zákulisné momenty, tréningy aj tie najkrajšie zábery z voľného letu!
          </p>
          <a
            href="https://www.instagram.com/volne.kridla"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnIg}
          >
            Nahliadni do nášho sveta
          </a>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className={styles.testimonials}>
        <div className="container">
          <header className={styles.secHead}>
            <h2 className={styles.secTitleDark}>Vidíš ich? Tí už spravili prvý krok.</h2>
            <p className={styles.secSubDark}>Ty môžeš byť ďalší, kto dá svojmu papagájovi slobodu.</p>
          </header>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{ 0: { slidesPerView: 1 } }}
            className={styles.swiper}
          >
            {TESTIMONIALS.map(t => (
              <SwiperSlide key={t.name} className={styles.tCard}>
                <div className={styles.tBody}>
                  <p className={styles.tQuote}>„{t.quote}"</p>
                  <span className={styles.tName}>{t.name}</span>
                </div>
                <div className={styles.tImg} role="img" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ─── BOOKING ─── */}
      <section className={styles.booking} id="kontakt">
        <div className="container">
          <span className={styles.floatTagLight}>Posledný krok k slobode</span>
          <div className={styles.bookingPanel}>
            <div className={styles.bookingLeft}>
              <div className={styles.bookingImg} role="img" aria-label="Konzultácia" />
            </div>
            <div className={styles.bookingFormWrap}>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
