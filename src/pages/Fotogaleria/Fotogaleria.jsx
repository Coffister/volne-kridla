import { Helmet } from 'react-helmet-async'
import BookingForm from '../../components/BookingForm/BookingForm'
import styles from './Fotogaleria.module.css'

const photos = [
  { src: 'https://volnekridla.sk/wp-content/uploads/2025/09/Frame-29.png', alt: 'Voľné lietanie papagájov' },
  { src: 'https://volnekridla.sk/wp-content/uploads/2025/09/IMG_0199-2-1.png', alt: 'Tréning voľného letu' },
  { src: 'https://volnekridla.sk/wp-content/uploads/2025/09/Rectangle-638.webp', alt: 'Papagáj v lete' },
  { src: 'https://volnekridla.sk/wp-content/uploads/2025/09/Rectangle-637.png', alt: 'Voľné krídla' },
  { src: 'https://volnekridla.sk/wp-content/uploads/2025/08/Frame-16.png', alt: 'Tréning s papagájom' },
  { src: 'https://volnekridla.sk/wp-content/uploads/2025/08/obrazok_2025-08-28_124825479.png', alt: 'Papagáj na tréningu' },
  { src: 'https://volnekridla.sk/wp-content/uploads/2025/08/obrazok_2025-08-28_112425928.png', alt: 'Voľné lietanie' },
  { src: 'https://volnekridla.sk/wp-content/uploads/2025/10/Obrazok-WhatsApp-2025-10-17-o-11.14.36_15c8d8f1.webp', alt: 'Papagáj vo voľnej prírode' },
  { src: 'https://volnekridla.sk/wp-content/uploads/2025/10/obrazok_2025-10-14_232557454.png', alt: 'Tréningová session' },
]

export default function Fotogaleria() {
  return (
    <>
      <Helmet>
        <title>Fotogaléria - Voľné Krídla</title>
        <meta name="description" content="Fotogaléria voľného lietania papagájov. Spoločné zážitky z tréningu s Frankou." />
      </Helmet>

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Fotogaléria</h1>
          <h2 className={styles.subtitle}>Spoločné zážitky</h2>
        </div>
      </section>

      <section className={styles.gallery}>
        <div className="container">
          <div className={styles.grid}>
            {photos.map((p) => (
              <div key={p.src} className={styles.item}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.booking} id="contact-form">
        <div className="container">
          <h2 className={styles.bookingTitle}>Posledný krok k slobode</h2>
          <p className={styles.bookingDesc}>Objednávka konzultácie</p>
          <BookingForm />
        </div>
      </section>
    </>
  )
}
