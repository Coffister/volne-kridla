import { Helmet } from 'react-helmet-async'
import BookingForm from '../../components/BookingForm/BookingForm'
import styles from './Blog.module.css'

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog - Voľné Krídla</title>
        <meta name="description" content="Blog o voľnom lietaní papagájov. Novinky, tipy a príbehy z tréningu." />
      </Helmet>

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Blog</h1>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.block}>
            <h2>Najnovší článok</h2>
            <p className={styles.empty}>Zatiaľ neexistuje žiaden článok</p>
          </div>
          <div className={styles.block}>
            <h2>Všetky články</h2>
            <p className={styles.empty}>Zatiaľ neexistuje žiaden článok</p>
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
