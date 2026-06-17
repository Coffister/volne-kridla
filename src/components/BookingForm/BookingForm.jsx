import { useState } from 'react'
import { useForm, ValidationError } from '@formspree/react'
import styles from './BookingForm.module.css'

const CONSULTATION_TYPES = [
  {
    id: 'online',
    label: 'Online konzultácia',
    desc: 'Riešenie správania a tréningu prostredníctvom video hovoru.',
  },
  {
    id: 'osobna',
    label: 'Osobná konzultácia',
    desc: 'Riešenie správania a tréningu prostredníctvom osobného stretnutia.',
  },
]

const PACKAGES = [
  { id: 'basic', label: 'Basic' },
  { id: 'premium', label: 'Premium' },
  { id: 'kurz', label: 'Kurz voľného lietania' },
]

export default function BookingForm({ formId = 'YOUR_FORMSPREE_ID' }) {
  const [step, setStep] = useState(1)
  const [consultType, setConsultType] = useState('')
  const [pkg, setPkg] = useState('')
  const [state, handleSubmit] = useForm(formId)

  if (state.succeeded) {
    return (
      <div className={styles.success}>
        <h3>Úspešne odoslanie formulára!</h3>
        <p>Ďakujem za vašu dôveru. Budem vás v krátkom čase kontaktovať telefonicky (zvyčajne do 48 hodín).</p>
      </div>
    )
  }

  return (
    <div className={styles.formWrap}>
      {/* Step indicators */}
      <div className={styles.steps}>
        {['Typ konzultácie', 'Balík', 'Kontakt'].map((s, i) => (
          <div key={s} className={`${styles.step} ${step === i + 1 ? styles.stepActive : ''} ${step > i + 1 ? styles.stepDone : ''}`}>
            <span className={styles.stepNum}>{i + 1}</span>
            <span className={styles.stepLabel}>{s}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="typ_konzultacie" value={consultType} />
        <input type="hidden" name="balik" value={pkg} />

        {/* Step 1 */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Vyberte spôsob konzultácie</h3>
            <div className={styles.typeCards}>
              {CONSULTATION_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.typeCard} ${consultType === t.id ? styles.typeCardActive : ''}`}
                  onClick={() => setConsultType(t.id)}
                >
                  <strong>{t.label}</strong>
                  <span>{t.desc}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.nextBtn}
              disabled={!consultType}
              onClick={() => setStep(2)}
            >
              Pokračovať
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Vyberte balík</h3>
            <div className={styles.pkgCards}>
              {PACKAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.pkgCard} ${pkg === p.id ? styles.pkgCardActive : ''}`}
                  onClick={() => setPkg(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className={styles.stepNav}>
              <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>Späť</button>
              <button type="button" className={styles.nextBtn} disabled={!pkg} onClick={() => setStep(3)}>Pokračovať</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Kontaktné údaje</h3>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="meno">Celé meno *</label>
                <input id="meno" name="meno" type="text" required placeholder="Vaše meno a priezvisko" />
                <ValidationError prefix="Meno" field="meno" errors={state.errors} />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">E-mail *</label>
                <input id="email" name="email" type="email" required placeholder="vas@email.sk" />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>
              <div className={styles.field}>
                <label htmlFor="telefon">Telefón</label>
                <input id="telefon" name="telefon" type="tel" placeholder="+421 900 000 000" />
              </div>
              <div className={styles.field}>
                <label htmlFor="papagaj">Meno a druh papagája</label>
                <input id="papagaj" name="papagaj" type="text" placeholder="napr. Lola, Ara ararauna" />
              </div>
              <div className={styles.field}>
                <label htmlFor="vek">Vek papagája</label>
                <input id="vek" name="vek" type="text" placeholder="napr. 3 roky" />
              </div>
              <div className={styles.field}>
                <label htmlFor="info">Čo vás trápi / čo chcete riešiť?</label>
                <textarea id="info" name="info" rows={4} placeholder="Opíšte problém alebo čo by ste chceli trénovať..." />
              </div>
            </div>
            <p className={styles.gdpr}>
              Odoslaním formulára beriete na vedomie, že poskytnuté osobné údaje (meno, kontaktné údaje a informácie uvedené v dotazníku) budú spracované výlučne za účelom kontaktovania.
            </p>
            <div className={styles.stepNav}>
              <button type="button" className={styles.backBtn} onClick={() => setStep(2)}>Späť</button>
              <button type="submit" className={styles.nextBtn} disabled={state.submitting}>
                {state.submitting ? 'Odosielam...' : 'Odoslať'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
