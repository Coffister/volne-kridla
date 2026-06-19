import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import BookingForm from '../../components/BookingForm/BookingForm'
import styles from './Domov.module.css'
import wordmarkSvg from '../../assets/images/volne-kridla.svg'
import heroImg1 from '../../assets/images/IMG_0199-3.webp'
import heroImg2 from '../../assets/images/IMG_0199-8.webp'
import heroImg3 from '../../assets/images/IMG_65981-1.webp'
import heroImg4 from '../../assets/images/IMG_0199-6.webp'
import heroImg5 from '../../assets/images/IMG_0199-7.webp'
import aboutVideoSrc from '../../assets/images/IMG_6530.mov'
import frankaImgSrc from '../../assets/images/o-volnych-kridlach-trening.webp'
import tImgNatalia from '../../assets/images/Obrazok-WhatsApp-2025-10-11-o-14.51.29_1fbbf514.webp'
import tImgAlenka from '../../assets/images/Obrazok-WhatsApp-2025-10-11-o-14.54.35_319c0d11.webp'
import tImgMirka from '../../assets/images/unnamed.webp'
import tImgHenrieta from '../../assets/images/IMG_0199-4-1.webp'
import tImgExtra1 from '../../assets/images/Obrazok-WhatsApp-2025-10-12-o-18.36.58_0edb0624.webp'
import tImgExtra2 from '../../assets/images/6796d7c0-ad9d-4134-b03c-0c46b93f56a4.webp'
import tImgRoman from '../../assets/images/Obrazok-WhatsApp-2025-10-17-o-11.14.36_15c8d8f1.webp'

const HERO_IMAGES = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5]

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
    heading: 'Prečo učiť papagája lietať?',
    body: 'Hoci sú papagáje na let stvorené, nevedia ho prirodzene len tak robiť a robiť ho dobre v každom veku. Musia sa to naučiť a správne zvládnuť zručnosti.\n\nLetanie vonku je oveľa odlišné od lietania v interiéri (vietor, rozptyľovanie, dravce, preťaženie podnetmi atď.). A preto je veľmi dôležitý správne vedený tréning.',
    items: [
      { title: 'Začni malými krokmi', desc: 'Najskôr si potrebuje zvyknúť na nové prostredie, traky a základné povely' },
      { title: 'Maj trpezlivosť', desc: 'Postupne zvyšujte náročnosť a vzdialenosť' },
      { title: 'Bezpečie a pokoj', desc: 'Tréning by sa mal vykonávať v tichej a bezpečnej oblasti (ideálne pole, ihrisko) bez rušenia.' },
    ],
    btnLabel: 'Viac o voľnom lete',
    btnHref: '/volne-kridla',
  },
  trening: {
    label: 'Tréning',
    heading: 'Nejde len o to aby „poslúchal"',
    body: 'Je to spôsob, ako spolu komunikovať, tráviť čas a posilniť puto medzi človekom a papagájom. Naučiť papagája priletieť na povel, otočiť sa, kývnuť alebo mávnuť krídlom je nielen zábavné, ale aj veľmi prospešné pre jeho psychickú pohodu.\n\nPapagáje sú inteligentné tvory, ktoré potrebujú mentálnu stimuláciu a práve tréning im dáva zmysel, aktivitu a pocit úspechu.',
    items: [
      { title: 'Pozorovanie a pochopenie', desc: 'Sledujeme tempo papagája, pozorujeme jeho reč tela a na základe nej papagája počúvame a nenutíme ho do tréningu' },
      { title: 'Budovanie dôvery', desc: 'Pomocou jemných krokov a pozitívneho prístupu vytvárame bezpečný priestor, v ktorom sa papagáj učí spolupracovať.' },
      { title: 'Tréning cez hru a motiváciu', desc: 'Každé učenie je založené na odmeňovaní, hre a radosti. Tak sa papagáj učí s chuťou a bez stresu.' },
    ],
    btnLabel: 'Viac o tréningu',
    btnHref: '/volne-kridla#target',
  },
}

const TESTIMONIALS = [
  { name: 'Natália a Arny 🦜', img: tImgNatalia, quote: 'Osloviť Franku z @volne.kridla bolo jedným z najlepších rozhodnutí, aké som mohla urobiť. Odporúčam to každému, kto chce skutočne porozumieť svojmu operencovi.' },
  { name: 'Alenka a Noro 🦜', img: tImgAlenka, quote: 'Ahoj Franka chcem sa ti poďakovať za spoluprácu a za veľké množstvo rád ako pracovať s naším Norom 🦜 vďaka tebe je odstavovanie od kašičky jednoduche a tvoje rady zaručene fungujú. Krásne nám to funguje aj s lietaním 🙏. Samozrejme ešte máme dlhu cestu pred sebou ale viem, že s tvojou pomocou a radami bude náš Noro patriť medzi papagáje čo si užívajú voľné krídla ❤' },
  { name: 'Mirka a Lariska 🦜', img: tImgMirka, quote: 'Franka bola prvý človek, ktorý mi otvoril dvere do sveta papagájov a ich tréningu. Keď som začínala, trpezlivo mi venovala veľa svojho času, vysvetľovala mi základy, ako s nimi fungovať, radila mi pri prvých krokoch a pomohla mi pochopiť, čo všetko obnáša free flight a vzťah s papagájom. Bola to pre mňa dôležitá štartovacia opora a som jej za to veľmi vďačná 🥹🙏🏼, pretože práve vďaka Franke som vôbec dostala odvahu a smer, odkiaľ začať. 🩷' },
  { name: 'Feri, Danka a Zeri 🦜', img: tImgExtra1, quote: 'Voľné lietanie s našou Zeri je super skúsenosť. Ukazuje, že papagáj vie dôverovať a cítiť sa slobodne ale nedá sa to nútiť. Všetko je o trpezlivosti, rešpekte a porozumení. Veľká vďaka Franke za skvelý prístup a tréning. ♥️ Všetko prebiehalo pokojne a radostne, a zároveň to naozaj ukazuje, aké je krásne byť v spojení s papagájom.' },
  { name: 'Henrieta a Patrik 🦜', img: tImgHenrieta, quote: 'S výcvikovým procesom v tréningovej škole Voľné krídla som veľmi spokojná. Rovnako aj s prístupom aj dosiahnutými výsledkami.' },
  { name: 'Laura a AZU 🦜', img: tImgExtra2, quote: 'S konzultáciámi som bola veľmi spokojná. Hneď po prvej konzultácii sme nastavili správny jedálniček aj tréningy a už po krátkom čase sme videli výsledky.' },
  { name: 'Roman a Richie 🦜', img: tImgRoman, quote: 'Veľmi som bol spokojný s tréningovým procesom. Franka má skvelý prístup a vie vysvetliť všetko zrozumiteľne. Náš Richie urobil obrovský pokrok.' },
]

export default function Domov() {
  const [activeTab, setActiveTab] = useState('letanie')
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
          <div className={styles.heroTagWrap}>
            <span className={styles.heroTag}>Nielen škola pre papagáje</span>
          </div>
          <div className={styles.heroPanel}>
            <div className={styles.heroContent}>
              <p className={styles.heroLabel}>Tréning voľných krídel</p>
              <h1 className={styles.heroTitle}>
                Dopraj svojmu operencovi voľnosť letu, ktorú si zaslúži.
              </h1>
              <p className={styles.heroQuote}>
                „Sloboda nie je len možnosť lietať, ale aj vedieť, kam sa vrátiť."
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
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop
                slidesPerView={1}
                className={styles.heroSwiper}
              >
                {HERO_IMAGES.map((src, i) => (
                  <SwiperSlide key={i}>
                    <div
                      className={styles.heroImg}
                      style={{ backgroundImage: `url(${src})` }}
                      role="img"
                      aria-label="Voľné lietanie"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
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
              <div className={styles.aboutLeft}>
                <p className={styles.aboutImgLabel}>Tréning nikdy nekončí</p>
                <video
                  className={styles.aboutVideo}
                  src={aboutVideoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="Tréning voľného letu"
                />
              </div>
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
                <a href={tab.btnHref} className={styles.btnCta}>
                  {tab.btnLabel}
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
              <p className={styles.frankaImgLabel}>Tréning papagája</p>
              <div
                className={styles.frankaImg}
                style={{ backgroundImage: `url(${frankaImgSrc})` }}
                role="img"
                aria-label="Tréning papagája"
              />
            </div>
            <div className={styles.frankaContent}>
              <p className={styles.frankaSub}>Ahoj, volám sa</p>
              <h2 className={styles.frankaName}>Franka</h2>
              <p className={styles.frankaBody}>
                a mojou vášňou sú tieto inteligentné operené tvory, venujem sa ich výchove no najmä
                tréningu voľného letu.
                <br /><br />
                Môj príbeh začal s prvým papagájom žakom, ktorého som vychovávala od mláďaťa, Cez
                jeho výchovu som pochopila, aká dôležitá je správna komunikácia a pochopenie
                prirodzených inštiktov papagájov. Postupne sa moja vášeň rozrástla na prácu s
                ďalšími operenými letcami od koreliek až po veľké ary.
                <br /><br />
                Ak chceš, aby aj tvoj papagáj zažil skutočnú slobodu, pridaj sa k nám.
              </p>
              <a href="/o-mne" className={styles.btnCta}>Zisti o mne viac</a>
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
              voľného lietania.
            </p>
            <a
              href="https://www.instagram.com/volne.kridla"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnIg}
            >
              Začni sledovať
            </a>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className={styles.testimonials}>
        <div className="container">
          <div className={styles.tHeader}>
            <h2 className={styles.secTitle}>Vidíš ich? Tí už spravili prvý krok.</h2>
            <div className={styles.sectionTagWrap}>
              <span className={styles.sectionTag}>Ty môžeš byť ďalší, kto dá svojmu papagájovi slobodu.</span>
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
                <div
                  className={styles.tImg}
                  style={t.img ? { backgroundImage: `url(${t.img})` } : undefined}
                  role="img"
                  aria-label={t.name}
                />
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
