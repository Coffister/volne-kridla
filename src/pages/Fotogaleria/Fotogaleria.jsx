import { Helmet } from 'react-helmet-async'
import SectionHeader from '../../components/UI/SectionHeader'
import styles from './Fotogaleria.module.css'

const placeholderImages = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  alt: `Fotografia z letu ${i + 1}`,
}))

export default function Fotogaleria() {
  return (
    <>
      <Helmet>
        <title>Fotogaléria | Voľné Krídla</title>
        <meta
          name="description"
          content="Fotogaléria paramotorových letov a kurzov Voľné Krídla. Letecké fotografie Slovenska."
        />
      </Helmet>

      <section className={styles.pageHero}>
        <div className="container">
          <SectionHeader
            eyebrow="Galéria"
            title="Fotogaléria"
            subtitle="Pohľady zhora, ktoré berú dych. Každý let je jedinečný."
          />
        </div>
      </section>

      <section className={styles.gallery}>
        <div className="container">
          {/* Swiper will be wired in during migration */}
          <div className={styles.grid}>
            {placeholderImages.map(({ id, alt }) => (
              <div key={id} className={styles.gridItem}>
                <div className={styles.imgPlaceholder} role="img" aria-label={alt}>
                  <i className="fa-solid fa-image" aria-hidden="true" />
                  <span>{alt}</span>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.swipeNote}>
            <i className="fa-solid fa-circle-info" aria-hidden="true" /> Swiper.js
            karusel bude integrovaný počas migrácie obsahu.
          </p>
        </div>
      </section>
    </>
  )
}
