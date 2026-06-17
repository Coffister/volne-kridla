import { Helmet } from 'react-helmet-async'
import BookingForm from '../../components/BookingForm/BookingForm'
import SectionHeader from '../../components/UI/SectionHeader'
import styles from './VolneKridla.module.css'

const services = [
  {
    title: 'Tandemový let',
    price: 'od 80 €',
    duration: '20–30 min',
    desc: 'Vyhliadkový let s inštruktorom. Žiadna predchádzajúca skúsenosť nie je potrebná.',
    icon: 'fa-solid fa-person-falling-burst',
  },
  {
    title: 'Základný kurz',
    price: 'od 350 €',
    duration: '3 dni',
    desc: 'Naučte sa základy paramotorovej techniky a absolvujte prvé samostatné lety.',
    icon: 'fa-solid fa-graduation-cap',
  },
  {
    title: 'Pokročilý kurz',
    price: 'od 500 €',
    duration: '5 dní',
    desc: 'Pre pilotov s licenciou. Zdokonalte techniku a naučte sa akrobatické manévre.',
    icon: 'fa-solid fa-star',
  },
]

export default function VolneKridla() {
  return (
    <>
      <Helmet>
        <title>Voľné Krídla | Kurzy a lety</title>
        <meta
          name="description"
          content="Paramotorové kurzy a lety na Slovensku. Tandemové lety, základné a pokročilé kurzy. Rezervujte si miesto."
        />
      </Helmet>

      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className="container">
          <SectionHeader
            eyebrow="Naše služby"
            title="Voľné Krídla"
            subtitle="Paramotorové lety a kurzy šité na mieru. Vyberte si zážitok, ktorý vám sadne."
          />
        </div>
      </section>

      {/* Services */}
      <section className={styles.services}>
        <div className="container">
          <div className={styles.serviceGrid}>
            {services.map((s) => (
              <article key={s.title} className={styles.serviceCard}>
                <i className={`${s.icon} ${styles.serviceIcon}`} aria-hidden="true" />
                <h3>{s.title}</h3>
                <div className={styles.serviceMeta}>
                  <span className={styles.price}>{s.price}</span>
                  <span className={styles.duration}>
                    <i className="fa-regular fa-clock" aria-hidden="true" /> {s.duration}
                  </span>
                </div>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className={styles.booking} id="rezervacia">
        <div className="container">
          <SectionHeader
            eyebrow="Rezervácia"
            title="Napíšte nám"
            subtitle="Vyplňte formulár a my sa vám ozveme do 24 hodín."
          />
          <div className={styles.bookingContent}>
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  )
}
