import { Helmet } from 'react-helmet-async'
import Button from '../../components/UI/Button'
import SectionHeader from '../../components/UI/SectionHeader'
import styles from './Domov.module.css'

export default function Domov() {
  return (
    <>
      <Helmet>
        <title>Domov | Voľné Krídla</title>
        <meta
          name="description"
          content="Voľné Krídla – paramotorové lety a kurzy v srdci Slovenska. Zažite slobodu leta."
        />
      </Helmet>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.heroEyebrow}>Paramotorové lety</span>
          <h1 className={styles.heroTitle}>
            Zažite slobodu
            <br />
            <span className={styles.heroAccent}>Voľných Krídel</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Kurzy, vyhliadkové lety a dobrodružstvo vo vzduchu. Pripojte sa k nám.
          </p>
          <div className={styles.heroCta}>
            <Button to="/volne-kridla" size="lg">
              Zistiť viac
            </Button>
            <Button to="/o-mne" variant="outline" size="lg">
              O mne
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className="container">
          <SectionHeader
            eyebrow="Čo ponúkame"
            title="Prečo Voľné Krídla?"
            subtitle="Profesionálny prístup, bezpečnosť a nezabudnuteľné zážitky – to sú naše priority."
            centered
          />
          <div className={styles.featureGrid}>
            {[
              {
                icon: 'fa-solid fa-wind',
                title: 'Kurzy létania',
                desc: 'Naučte sa lietať od základov s certifikovaným inštruktorom.',
              },
              {
                icon: 'fa-solid fa-eye',
                title: 'Vyhliadkové lety',
                desc: 'Objavte Slovensko z vtáčej perspektívy v bezpečných rukách.',
              },
              {
                icon: 'fa-solid fa-shield-halved',
                title: 'Bezpečnosť na prvom mieste',
                desc: 'Moderné vybavenie a prísne bezpečnostné protokoly.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className={styles.featureCard}>
                <i className={`${icon} ${styles.featureIcon}`} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <h2>Pripravení vzlietnuť?</h2>
          <p>Kontaktujte nás a dohodnite si termín letu alebo kurzu.</p>
          <Button to="/volne-kridla" variant="secondary" size="lg">
            Rezervovať
          </Button>
        </div>
      </section>
    </>
  )
}
