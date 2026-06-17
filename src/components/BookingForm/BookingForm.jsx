import { useForm, ValidationError } from '@formspree/react'
import styles from './BookingForm.module.css'

export default function BookingForm({ formId = 'YOUR_FORMSPREE_ID' }) {
  const [state, handleSubmit] = useForm(formId)

  if (state.succeeded) {
    return (
      <div className={styles.success}>
        <i className="fa-solid fa-circle-check" aria-hidden="true" />
        <p>Ďakujeme! Vaša správa bola odoslaná. Ozveme sa vám čo najskôr.</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name">Meno *</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Vaše meno"
            required
          />
          <ValidationError prefix="Meno" field="name" errors={state.errors} />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">E-mail *</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="vas@email.sk"
            required
          />
          <ValidationError prefix="E-mail" field="email" errors={state.errors} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Telefón</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="+421 900 000 000"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="message">Správa *</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Napíšte nám o čom chcete hovoriť..."
          required
        />
        <ValidationError prefix="Správa" field="message" errors={state.errors} />
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={state.submitting}
      >
        {state.submitting ? 'Odosielam...' : 'Odoslať správu'}
      </button>
    </form>
  )
}
