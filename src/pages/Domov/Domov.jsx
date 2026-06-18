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
    body: 'Kurz je určený pre majiteľov papagájov, ktorí nechcú riskovať ani trénovať metódou pokus–omyl. Naučíte sa systematicky budovať spoľahlivé privolanie a pripravovať papagája na situácie, v ktorých si mu môžete dovoliť slobodu.\n\nLetanie vonku je oveľa odlišné od lietania v interiéri (vietor, rozptyľovanie, dravce, preťaženie podnetmi atď.). A preto je veľmi dôležitý správne vedený tréning.',
    items: [
      { title: 'Malé kroky dokážu viac', desc: 'Nemôžme papagája ihneď vypustiť lietať, potrebuje si zvyknúť na nové prostredie, povely a traky' },
      { title: 'Trpezlivosť je kľúč k úspechu', desc: 'Prejdeme si postupne náročnosti tréningov, ako vyčítať kedy je papagáj pripravený na ďalší tréning' },
      { title: 'Bezpečnosť nadovšetko', desc: 'Naučím ťa kedy a za akých podmienok trénovať ale aj na čo si dávať pri tréningu a lietaní pozor' },
    ],
  },
  trening: {
    label: 'Tréning',
    heading: 'Prečo učiť papagája lietať?',
    body: 'Hoci sú papagáje na let stvorené, nevedia ho prirodzene len tak robiť a robiť ho dobre v každom veku. Musia sa to naučiť a správne zvládnuť zručnosti.\n\nLetanie vonku je oveľa odlišné od lietania v interiéri (vietor, rozptyľovanie, dravce, preťaženie podnetmi atď.). A preto je veľmi dôležitý správne vedený tréning.',
    items: [
      { title: 'Malé kroky dokážu viac', desc: 'Nemôžme papagája ihneď vypustiť lietať, potrebuje si zvyknúť na nové prostredie, povely a traky' },
      { title: 'Trpezlivosť je kľúč k úspechu', desc: 'Prejdeme si postupne náročnosti tréningov, ako vyčítať kedy je papagáj pripravený na ďalší tréning' },
      { title: 'Bezpečnosť nadovšetko', desc: 'Naučím ťa kedy a za akých podmienok trénovať ale aj na čo si dávať pri tréningu a lietaní pozor' },
    ],
  },
}

const TESTIMONIALS = [
  { name: 'Natália a Arny 🦜', quote: 'Osloviť Franku z @volne.kridla bolo jedným z najlepších rozhodnutí, aké som mohla urobiť. Odporúčam to každému, kto chce skutočne porozumieť svojmu operencovi.' },
  { name: 'Alenka a Noro 🦜', quote: 'Ahoj Franka chcem sa ti poďakovať za spoluprácu a za veľké množstvo rád ako pracovať s naším Norom. Vďaka tebe je naša spolupráca na úplne inej úrovni.' },
  { name: 'Mirka a Lariska 🦜', quote: 'Franka bola prvý človek, ktorý mi otvoril dvere do sveta papagájov a ich tréningu. Keď som začínala, trpezlivo mi venovala veľa svojho času, vysvetľovala mi základy a pomohla mi pochopiť, čo všetko obnáša free flight a vzťah s papagájom.' },
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

      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <div className="container">
          <img src={wordmarkSvg} alt="Voľné krídla" className={styles.wordmark} />
          {/* Float tag sits flush against the panel top */}
          <div className={styles.heroTagWrap}>
            <span className={styles.heroTag}>Nielen škola pre papagáje</span>
          </div>
          {/* Panel br: 40px | image br: 32px (panel_br − panel_pad = 40−8 = 32) */}
          <div className={styles.heroPanel}>
            <div className={styles.heroContent}>
              <p className={styles.heroLabel}>Tréning voľného letu</p>
              <h1 className={styles.heroTitle}>
                Dopraj svojmu operencovi voľnosť letu, ktorú si zaslúži
              </h1>
              <p className={styles.heroQuote}>
                „Sloboda nieje len možnosť lietať, ale aj vedieť kam sa vrátiť."
              </p>
              <div className={styles.heroBtns}>
                <a
                  href="#kontakt"
                  className={styles.btnCta}
                  onClick={e => { e.preventDefault(); document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' }) }}
                >
                  Začať lietať
                </a>
                <a href="/volne-kridla" className={styles.btnGhost}>Zistiť viac</a>
              </div>
            </div>
            <div className={styles.heroImgWrap}>
              <div className={styles.heroImg} role="img" aria-label="Papagáj vo voľnom lete" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <section className={styles.marqueeSection} aria-hidden="true">
        <div className="container">
          <div className={styles.marqueeBox}>
            {[MARQUEE_ROW1, MARQUEE_ROW2].map((row, ri) => (
              <div key={ri} className={styles.marqueeRow}>
                <div className={styles.marqueeTrack}>
                  {[...row, ...row, ...row].map((label, i) => (
                    <span key={i} className={styles.pill}>{label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── O VOĽNÝCH KRÍDLACH ─── */}
      <section className={styles.about}>
        <div className="container">
          <div className={styles.aboutHeader}>
            <h2 className={styles.secTitle}>O Voľných krídlach</h2>
            <div className={styles.sectionTagWrap}>
              <span className={styles.sectionTag}>Aký druh tréningu je pre vás vhodný?</span>
            </div>
          </div>
          <div className={styles.aboutWrap}>
            {/* Tabs sit above the card, touching its top edge */}
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
            <div className={styles.aboutCard}>
              {/* Left: image + label */}
              <div className={styles.aboutLeft}>
                <p className={styles.aboutImgLabel}>Tréning nikdy nekončí</p>
                <div className={styles.aboutImg} role="img" aria-label={tab.label} />
              </div>
              {/* Right: cream content panel */}
              <div className={styles.aboutRight}>
                <h3 className={styles.aboutHeading}>{tab.heading}</h3>
                <p className={styles.aboutBody}>{tab.body}</p>
                <div className={styles.featureArea}>
                  <div className={styles.featureTagWrap}>
                    <span className={styles.featureTag}>Čo vás naučím?</span>
                  </div>
                  <div className={styles.featureBox}>
                    {tab.items.map(item => (
                      <div key={item.title} className={styles.featureItem}>
                        <div className={styles.featureIcon} />
                        <div className={styles.featureText}>
                          <strong className={styles.featureTitle}>{item.title}</strong>
                          <span className={styles.featureDesc}>{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <a
                  href="#kontakt"
                  className={styles.btnCta}
                  onClick={e => { e.preventDefault(); document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' }) }}
                >
                  Potrebujem pomôcť
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FRANKA ─── */}
      <section className={styles.franka}>
        <div className="container">
          <div className={styles.frankTagWrap}>
            <span className={styles.sectionTagAlt}>Kto vlastne som?</span>
          </div>
          <div className={styles.frankaCard}>
            <div className={styles.frankaImgWrap}>
              <div className={styles.frankaImg} role="img" aria-label="Franka" />
            </div>
            <div className={styles.frankaContent}>
              <p className={styles.frankaSub}>Ahoj, volám sa</p>
              <h2 className={styles.frankaName}>Franka</h2>
              <p className={styles.frankaBody}>
                a mojou vášňou sú tieto inteligentné operené tvory, venujem sa ich výchove no najmä
                tréningu voľného letu.
                <br /><br />
                Môj príbeh začal s prvým papagájom žakom, ktorého som vychovávala od mláďaťa. Cez
                jeho výchovu som pochopila, aká dôležitá je správna komunikácia a pochopenie
                prirodzených inštiktov papagájov. Postupne sa moja vášeň rozrástla na prácu s
                ďalšími operenými letcami od koreliek až po veľké ary.
                <br /><br />
                Ak chceš, aby aj tvoj papagáj zažil skutočnú slobodu, pridaj sa k nám.
              </p>
              <a href="/o-mne" className={styles.btnCta}>Zistiť o mne viac</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM ─── */}
      <section className={styles.instagram}>
        <div className={styles.igBg} aria-hidden="true" />
        <div className="container">
          <div className={styles.igContent}>
            <h2 className={styles.igTitle}>Sleduj každý náš let zblízka!</h2>
            <p className={styles.igSub}>
              Na Instagrame ťa čakajú zákulisné momenty, tréningy aj tie najkrajšie zábery z
              voľného letu!
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
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className={styles.testimonials}>
        <div className="container">
          <div className={styles.tHeader}>
            <h2 className={styles.secTitle}>Vidíš ich? Tí už spravili prvý krok</h2>
            <div className={styles.sectionTagWrap}>
              <span className={styles.sectionTag}>Ty môžeš byť ďalší, kto dá svojmu papagájovi slobodu</span>
            </div>
          </div>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={32}
            centeredSlides
            navigation
            pagination={{ clickable: true }}
            slidesPerView={1}
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
          <div className={styles.bookingTagWrap}>
            <span className={styles.sectionTagAlt}>Posledný krok k slobode</span>
          </div>
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
