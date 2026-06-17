import { Helmet } from 'react-helmet-async'
import Button from '../../components/UI/Button'
import SectionHeader from '../../components/UI/SectionHeader'
import styles from './OMne.module.css'

export default function OMne() {
  return (
    <>
      <Helmet>
        <title>O mne | Voľné Krídla</title>
        <meta
          name="description"
          content="Zoznámte sa s inštruktorom Voľných Krídel. Viac ako 10 rokov skúseností s paramotorom."
        />
      </Helmet>

      <section className={styles.pageHero}>
        <div className="container">
          <SectionHeader
            eyebrow="O mne"
            title="Kto som?"
          />
        </div>
      </section>

      <section className={styles.bio}>
        <div className={`container ${styles.bioGrid}`}>
          <div className={styles.bioImage}>
            {/* Placeholder – replace with actual photo */}
            <div className={styles.imagePlaceholder} aria-label="Foto inštruktora">
              <i className="fa-solid fa-user-tie" aria-hidden="true" />
            </div>
          </div>
          <div className={styles.bioText}>
            <h2>Váš inštruktor</h2>
            <p>
              Paramotorovému lietaniu sa venujem viac ako desať rokov. Odletel som stovky hodín
              nad slovenskou krajinou a objavil každý kút tejto krásnej krajiny z vtáčej
              perspektívy.
            </p>
            <p>
              Moja misia je jednoduchá: bezpečne vás doviesť do vzduchu a dať vám pocítiť
              absolútnu slobodu letu. Či ste začiatočník alebo skúsený pilot – vždy nájdeme
              spoločnú reč.
            </p>
            <div className={styles.stats}>
              {[
                { value: '10+', label: 'Rokov skúseností' },
                { value: '500+', label: 'Odletaných hodín' },
                { value: '200+', label: 'Spokojných pilotov' },
              ].map(({ value, label }) => (
                <div key={label} className={styles.stat}>
                  <span className={styles.statValue}>{value}</span>
                  <span className={styles.statLabel}>{label}</span>
                </div>
              ))}
            </div>
            <Button to="/volne-kridla#rezervacia" size="lg">
              Rezervovať let
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
