import { Helmet } from 'react-helmet-async'
import BookingForm from '../../components/BookingForm/BookingForm'
import styles from './VolneKridla.module.css'

const benefits = [
  {
    title: 'Posilnenie dôvery',
    desc: 'Voľné lietanie umožňuje papagájovi spoznávať svet okolo seba, zatiaľ čo sa ti učí dôverovať.',
  },
  {
    title: 'Podpora fyzického zdravia',
    desc: 'Lietanie je prirodzený spôsob pohybu, ktorý udržuje svaly, kosti a kardiovaskulárny systém papagája v optimálnej kondícii.',
  },
  {
    title: 'Mentálna stimulácia a zábava',
    desc: 'Voľné lietanie poskytuje papagájovi nové podnety a zážitky, čím znižuje stres a zabraňuje nudeniu alebo nežiaducemu správaniu.',
  },
]

const clickerBenefits = [
  {
    title: 'Presnosť a rýchlosť odmeny',
    desc: 'Kliker umožňuje označiť presne ten moment, keď papagáj vykoná správne správanie. To je dôležité, pretože ak by si použil len odmenu (napr. pamlsky), môže dôjsť k oneskoreniu a papagáj nemusí pochopiť, čo presne urobil správne.',
  },
  {
    title: 'Konzistentnosť',
    desc: 'Zvuk klikera je vždy rovnaký a jednoznačný, na rozdiel od slovného pochválenia, ktoré môže mať rôzne tóny alebo emócie. Papagáj si rýchlo spojí kliknutie s odmenou a ľahšie pochopí, čo od neho chceš.',
  },
  {
    title: 'Zvyšuje motiváciu a rýchlosť učenia',
    desc: 'Keď papagáj pochopí princíp klikera, začne sa učiť nové triky rýchlejšie. Vie, že správne správanie vedie ku kliknutiu a následnej odmene, takže sa viac snaží.',
  },
  {
    title: 'Obmedzenie nežiaducich zvykov',
    desc: 'Keď používaš kliker, môžeš posilňovať iba žiaduce správanie a ignorovať alebo presmerovať nežiaduce správanie. Papagáj si tak zvykne robiť to, čo je správne, aby získal odmenu.',
  },
  {
    title: 'Funguje na všetkých papagájov',
    desc: 'Nezáleží na tom, či trénuješ malú andulku alebo veľkú aru – klikerový tréning je univerzálny a funguje na všetky druhy papagájov.',
  },
]

const targetBenefits = [
  {
    title: 'Buduje dôveru',
    desc: 'Papagáj sa učí, že tréning je bezpečný a zábavný, pretože je pre papagája zaujímavý a tak zabraňuje nude.',
  },
  {
    title: 'Pomáha pri výcviku lietania',
    desc: 'Dá sa využiť na trénovanie návratu na ruku alebo na miesto.',
  },
  {
    title: 'Zjednodušuje manipuláciu',
    desc: 'Ak potrebuješ papagája presunúť, vieš ho nasmerovať targetom na požadované miesto.',
  },
]

export default function VolneKridla() {
  return (
    <>
      <Helmet>
        <title>Voľné krídla - Voľné Krídla</title>
        <meta name="description" content="Všetko o voľnom lietaní papagájov – tréning, FAQ, tipy a target tréning. Kurzy a konzultácie s Frankou." />
      </Helmet>

      {/* Intro */}
      <section className={styles.intro} id="about">
        <div className="container">
          <p className={styles.introText}>
            Po viac než dvadsiatich rokoch každodenného života s papagájmi som sa naučila vnímať ich povahu, rešpektovať ich jedinečnosť a čítať to, čo nám hovoria, aj keď sú ticho.
          </p>
          <p className={styles.introText}>
            S papagájmi žijem už viac než dvadsať rokov. Naučila som sa od nich tak veľa, najmä načúvať im, rešpektovať a čítať čo nám hovoria aj keď sú ticho. Moje skúsenosti nevychádzajú iba z kníh či kurzov ale aj z členstva v talianskej organizácii L'Associazione Pappagalli in Volo.
          </p>
        </div>
      </section>

      {/* Why */}
      <section className={styles.why}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Prečo by som mal učiť papagája lietať?</h2>
          <p className={styles.bodyText}>
            Hoci sú papagáje na let stvorené, nevedia ho prirodzene len tak robiť a robiť ho dobre v každom veku. Musia sa to naučiť a správne zvládnuť zručnosti. Letanie vonku je oveľa odlišné od lietania v interiéri (vietor, rozptyľovanie, dravce, preťaženie podnetmi atď.). A preto je veľmi dôležitý správne vedený tréning.
          </p>
        </div>
      </section>

      {/* Free-flight training */}
      <section className={styles.training}>
        <div className="container">
          <h1 className={styles.sectionTitle}>Tréning voľného letu</h1>
          <p className={styles.bodyText}>
            Začnite s malými krokmi. Najprv naučte papagája, aby si zvykol na nové prostredie, na traky a aby si upevnil svoj vzťah s vami pred tým, ako ho pustíte do voľnej prírody.
          </p>
        </div>
      </section>

      {/* Rules */}
      <section className={styles.rules}>
        <div className="container">
          <h1 className={styles.sectionTitle}>Základné pravidlá ako postupovať pri tréningu na voľné lietanie:</h1>
          <div className={styles.rulesGrid}>
            {[
              { n: '01', t: 'Začni malými krokmi', d: 'Najskôr si potrebuje zvyknúť na nové prostredie, traky a základné povely.' },
              { n: '02', t: 'Maj trpezlivosť', d: 'Postupne zvyšujte náročnosť a vzdialenosť.' },
              { n: '03', t: 'Bezpečie a pokoj', d: 'Tréning by sa mal vykonávať v tichej a bezpečnej oblasti (ideálne pole, ihrisko) bez rušenia.' },
            ].map((r) => (
              <div key={r.n} className={styles.ruleCard}>
                <span className={styles.ruleNum}>{r.n}</span>
                <h3>{r.t}</h3>
                <p>{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={styles.benefits}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Výhody voľného lietania</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((b) => (
              <div key={b.title} className={styles.benefitCard}>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className={styles.tips} id="tips">
        <div className="container">
          <h2 className={styles.sectionTitle}>Tipy, triky a zaujímavosti</h2>
          <h3 className={styles.subTitle}>Kliker pri práci s papagájmi 🦜🚀</h3>
          <div className={styles.clickerList}>
            {clickerBenefits.map((c, i) => (
              <div key={c.title} className={styles.clickerItem}>
                <span className={styles.clickerNum}>{i + 1}</span>
                <div>
                  <strong>{c.title}</strong>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq} id="faq">
        <div className="container">
          <h2 className={styles.sectionTitle}>Najčastejšie otázky</h2>
          <div className={styles.faqItem}>
            <h3>Čo je to ten target tréning?</h3>
            <p>
              Je jedna zo základných tréningových metód pri výcviku papagájov. Ide o techniku, pri ktorej sa papagáj učí dotýkať sa určitého predmetu (targetu) zobákom alebo pazúrmi.
            </p>
          </div>
        </div>
      </section>

      {/* Target training */}
      <section className={styles.target} id="target">
        <div className="container">
          <h1 className={styles.sectionTitle}>Target tréning</h1>
          <p className={styles.bodyText}>
            <strong>Výber targetu:</strong> Najčastejšie sa používa palička s guľôčkou na konci (napr. aj čínska jedálenská palička alebo drevená špajdle).
          </p>
          <h2 className={styles.subTitle}>Ako prebieha target tréning?</h2>
          <p className={styles.bodyText}>
            Target tréning je jedna zo základných tréningových metód pri výcviku papagájov. Ide o techniku, pri ktorej sa papagáj učí dotýkať sa určitého predmetu (targetu) zobákom alebo pazúrmi.
          </p>
          <div className={styles.benefitsGrid} style={{ marginTop: 'var(--space-8)' }}>
            {targetBenefits.map((b) => (
              <div key={b.title} className={styles.benefitCard}>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
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
