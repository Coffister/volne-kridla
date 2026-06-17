import { Helmet } from 'react-helmet-async'
import BookingForm from '../../components/BookingForm/BookingForm'
import styles from './OMne.module.css'

export default function OMne() {
  return (
    <>
      <Helmet>
        <title>O mne - Voľné Krídla</title>
        <meta name="description" content="Spoznajte Franku – špecialistku na voľné lietanie papagájov s viac ako 20-ročnými skúsenosťami." />
      </Helmet>

      {/* Intro */}
      <section className={styles.intro}>
        <div className={`container ${styles.introGrid}`}>
          <div className={styles.introText}>
            <p>
              S papagájmi žijem už viac než dvadsať rokov. Naučila som sa od nich tak veľa, najmä načúvať im, rešpektovať a čítať čo nám hovoria aj keď sú ticho. Moje skúsenosti nevychádzajú iba z kníh či kurzov ale predovšetkým z každodenného života s nimi.
            </p>
          </div>
          <div className={styles.introImg}>
            <img
              src="https://volnekridla.sk/wp-content/uploads/2025/09/IMG_0199-1.png"
              alt="Franka s papagájom"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Origin story */}
      <section className={styles.story}>
        <div className="container">
          <h1 className={styles.sectionTitle}>Kde to celé začalo?</h1>
          <p className={styles.bodyText}>
            Myšlienka venovať sa voľnému lietaniu mi napadla počas dovolenky na ostrove Tenerife v roku 2011. V jednom zooparku som впервые videla voľne lietajúce papagáje a bola som úplne uchvátená. Fascinovalo ma to natoľko, že hneď po návrate domov som sa do toho pustila s mojou prvou arou araraunou – Lolou.
          </p>
          <div className={styles.storyImgs}>
            <img src="https://volnekridla.sk/wp-content/uploads/2025/10/IMG_8043.webp" alt="Franka s papagájom na Tenerife" loading="lazy" />
            <img src="https://volnekridla.sk/wp-content/uploads/2025/10/obrazok_2025-10-09_210924895.png" alt="Začiatky voľného lietania" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Early days */}
      <section className={styles.early}>
        <div className="container">
          <h1 className={styles.sectionTitle}>Aké boli moje začiatky?</h1>
          <p className={styles.bodyText}>
            S papagájmi žijem už viac než dvadsať rokov. Moje skúsenosti nevychádzajú iba z kníh či kurzov ale aj z členstva v talianskej organizácii L'Associazione Pappagalli in Volo. A potom…to bola ona – <strong>Lola (Ara ararauna)</strong>.
          </p>
          <p className={styles.bodyText}>
            Dať do stredu nie výkon, ale vzťah. Nie účinok, ale ich podstatu. Nejde o to, že vám počas pár minút nadiktujem, čo máte robiť. Spolu si vysvetlíme, prečo veci fungujú tak, ako fungujú, aby ste tomu naozaj porozumeli. Mojím cieľom je, aby ste pochopili ako papagáj rozmýšľa a reaguje.
          </p>
        </div>
      </section>

      {/* Booking */}
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
