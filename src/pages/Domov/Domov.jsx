import { Helmet } from 'react-helmet-async'
import BookingForm from '../../components/BookingForm/BookingForm'
import styles from './Domov.module.css'

const services = [
  {
    title: 'Online konzultácia',
    desc: 'Riešenie správania a tréningu prostredníctvom video hovoru. Spoločne prejdeme konkrétne problémy, situácie z bežného dňa a nastavíme postup, ktorý viete okamžite aplikovať pri tréningu.',
    img: 'https://volnekridla.sk/wp-content/uploads/2026/02/Untitled-3-February-2026-13.46.44-2.webp',
  },
  {
    title: 'Osobná konzultácia',
    desc: 'Riešenie správania a tréningu prostredníctvom osobného stretnutia. Spoločne prejdeme konkrétne problémy, pozorujeme správanie papagája a nastavíme postup, ktorý budete aplikovať pri tréningu papagája.',
    img: 'https://volnekridla.sk/wp-content/uploads/2025/08/Layer-6.png',
  },
  {
    title: 'Kurz voľného lietania',
    desc: 'Kurz je určený pre majiteľov papagájov, ktorí nechcú riskovať ani trénovať metódou pokus–omyl. Naučíte sa systematicky budovať spoľahlivé privolanie a pripravovať papagája na situácie, v ktorých si mu môžete dovoliť slobodu.',
    img: 'https://volnekridla.sk/wp-content/uploads/2025/08/Layer-6.png',
  },
]

const pillars = [
  {
    title: 'Pozorovanie a pochopenie',
    desc: 'Sledujeme tempo papagája, pozorujeme jeho reč tela a na základe nej papagája počúvame a nenutíme ho do tréningu.',
  },
  {
    title: 'Budovanie dôvery',
    desc: 'Pomocou jemných krokov a pozitívneho prístupu vytvárame bezpečný priestor, v ktorom sa papagáj učí spolupracovať.',
  },
  {
    title: 'Tréning cez hru a motiváciu',
    desc: 'Každé učenie je založené na odmeňovaní, hre a radosti. Tak sa papagáj učí s chuťou a bez stresu.',
  },
]

const testimonials = [
  { name: 'Natália a Arny 🦜', quote: 'Osloviť Franku z @volne.kridla bolo jedným z najlepších rozhodnutí, aké som mohla urobiť. Odporúčam to každému, kto chce skutočne porozumieť svojmu operencovi.' },
  { name: 'Alenka a Noro 🦜', quote: 'Ahoj Franka chcem sa ti poďakovať za spoluprácu a za veľké množstvo rád ako pracovať s naším Norom 🦜 vďaka tebe je naša spolupráca na úplne inej úrovni.' },
  { name: 'Mirka a Lariska 🦜', quote: 'Franka bola prvý človek, ktorý mi otvoril dvere do sveta papagájov a ich tréningu. Keď som začínala, trpezlivo mi vysvetlila všetko od základov.' },
  { name: 'Feri, Danka a Zeri 🦜', quote: 'Voľné lietanie s našou Zeri je super skúsenosť. Ukazuje, že papagáj vie dôverovať a cítiť sa slobodne ale nedá sa to urobiť zo dňa na deň.' },
  { name: 'Henrieta a Patrik 🦜', quote: 'S výcvikovým procesom v tréningovej škole Voľné krídla som veľmi spokojná. Rovnako aj s prístupom aj dosiahnutými výsledkami.' },
  { name: 'Laura a AZU 🦜', quote: 'S konzultáciámi som bola veľmi spokojná. Hneď po prvej konzultácii sme nastavili správny jedálniček aj tréningy a už po krátkom čase sme videli výsledky.' },
  { name: 'Roman a Richie 🦜', quote: 'Najlepší hodnotiteľ je sám náš Richie, ktorý po podrobných a citlivých radách od Franky začal pekne napredovať v každom smere.' },
  { name: 'Natalia a Tori', quote: 'K celému príbehu Toriho sa ešte dostanem, no po rokoch strachu z ľudí a nevyhovujúcich podmienok, čo viedlo k jeho sebazraňovaniu, sme videli obrovský posun.' },
  { name: 'Miška & Arianka', quote: 'Chcela by som sa veľmi pekne poďakovať Franke za obrovskú pomoc s mojou Arou araraunou. Povedzme, že sme mali obdobie, keď sme nevedeli čo ďalej.' },
  { name: 'Ivanka & Dinko', quote: 'S Frankou trénujeme už mesiac a hneď od prvého rozhovoru mi bolo jasné, že som sa obrátila na tú správnu osobu. Jej rady sú praktické a vždy vysvetlí prečo.' },
  { name: 'Helenka & Maxík', quote: 'Rada by som sa podelila o skúsenosť s Frankou z @volne.kridla, ktorá sa venuje papagájom už 14 rokov. Posledného pol roka nám veľmi pomohla.' },
]

export default function Domov() {
  return (
    <>
      <Helmet>
        <title>Domov - Voľné Krídla</title>
        <meta name="description" content="Spoznaj fascinujúci svet voľného lietania, buduj dôveru a preži spoločné dobrodružstvo so svojím opereným parťákom – bezpečne a s radosťou." />
      </Helmet>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <h2 className={styles.heroLabel}>Nielen škola pre papagáje</h2>
          <h4 className={styles.heroSub}>Tréning voľných krídel</h4>
          <h1 className={styles.heroTitle}>Dopraj svojmu operencovi voľnosť letu, ktorú si zaslúži.</h1>
          <p className={styles.heroQuote}>"Sloboda nie je len možnosť lietať, ale aj vedieť, kam sa vrátiť."</p>
          <a href="#contact-form" className={styles.heroCta} onClick={e => { e.preventDefault(); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Začať lietať
          </a>
        </div>
      </section>

      {/* Services */}
      <section className={styles.services}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Aký druh tréningu je pre vás vhodný?</h2>
          <div className={styles.serviceGrid}>
            {services.map((s) => (
              <div key={s.title} className={styles.serviceCard}>
                <img src={s.img} alt={s.title} className={styles.serviceImg} loading="lazy" />
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className={styles.why}>
        <div className="container">
          <h1 className={styles.sectionTitle}>Prečo učiť papagája lietať?</h1>
          <p className={styles.whyBody}>
            Hoci sú papagáje na let stvorené, nevedia ho prirodzene len tak robiť a robiť ho dobre v každom veku. Musia sa to naučiť a správne zvládnuť zručnosti. Letanie vonku je oveľa odlišné od lietania v interiéri (vietor, rozptyľovanie, dravce, preťaženie podnetmi atď.). A preto je veľmi dôležitý správne vedený tréning.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className={styles.steps}>
        <div className="container">
          <div className={styles.stepsGrid}>
            {[
              { num: '01', title: 'Začni malými krokmi', desc: 'Najskôr si potrebuje zvyknúť na nové prostredie, traky a základné povely.' },
              { num: '02', title: 'Maj trpezlivosť', desc: 'Postupne zvyšujte náročnosť a vzdialenosť.' },
              { num: '03', title: 'Bezpečie a pokoj', desc: 'Tréning by sa mal vykonávať v tichej a bezpečnej oblasti (ideálne pole, ihrisko) bez rušenia.' },
            ].map((s) => (
              <div key={s.num} className={styles.stepCard}>
                <span className={styles.stepNum}>{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training never ends */}
      <section className={styles.trainingBanner}>
        <div className="container">
          <h1>Tréning nikdy nekončí</h1>
        </div>
      </section>

      {/* Beyond obedience */}
      <section className={styles.beyond}>
        <div className="container">
          <h1 className={styles.sectionTitle}>Nejde len o to aby &quot;poslúchal&quot;</h1>
          <p className={styles.beyondBody}>
            Je to spôsob, ako spolu komunikovať, tráviť čas a posilniť puto medzi človekom a papagájom. Naučiť papagája priletieť na povel, otočiť sa, kývnuť alebo mávnuť krídlom je nielen zábavné, ale aj veľmi prospešné pre jeho psychickú pohodu. Papagáje sú inteligentné tvory, ktoré potrebujú mentálnu stimuláciu a práve tréning im dáva zmysel, aktivitu a pocit úspechu. Pre človeka je to zase nádherný spôsob, ako lepšie spoznať svojho opereného parťáka.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className={styles.pillars}>
        <div className="container">
          <div className={styles.pillarsGrid}>
            {pillars.map((p) => (
              <div key={p.title} className={styles.pillarCard}>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Franka */}
      <section className={styles.franka}>
        <div className="container">
          <p className={styles.frankaSub}>Kto vlastne som?</p>
          <h1 className={styles.frankaTitle}>Ahoj, volám sa</h1>
          <h1 className={styles.frankaName}>Franka</h1>
          <p className={styles.frankaBody}>
            a mojou vášňou sú tieto inteligentné operené tvory, venujem sa ich výchove no najmä tréningu voľného letu. Nejde o to, že vám počas pár minút nadiktujem, čo máte robiť. Spolu si vysvetlíme, prečo veci fungujú tak, ako fungujú, aby ste tomu naozaj porozumeli. Mojím cieľom je, aby ste pochopili ako papagáj rozmýšľa a reaguje.
          </p>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className={styles.instagram}>
        <div className="container">
          <h1>Sleduj každý náš let zblízka!</h1>
          <a
            href="https://www.instagram.com/volne.kridla"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.igBtn}
          >
            Začať sledovať
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Vidíš ich? Tí už spravili prvý krok.</h2>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t) => (
              <div key={t.name} className={styles.testimonialCard}>
                <p className={styles.testimonialQuote}>"{t.quote}"</p>
                <span className={styles.testimonialName}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className="container">
          <h1>Ty môžeš byť ďalší, kto dá svojmu papagájovi slobodu.</h1>
        </div>
      </section>

      {/* Booking Form */}
      <section className={styles.booking} id="contact-form">
        <div className="container">
          <h2 className={styles.sectionTitle}>Posledný krok k slobode</h2>
          <p className={styles.bookingDesc}>Objednávka konzultácie</p>
          <BookingForm />
        </div>
      </section>
    </>
  )
}
