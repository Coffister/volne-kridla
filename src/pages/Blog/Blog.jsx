import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import SectionHeader from '../../components/UI/SectionHeader'
import styles from './Blog.module.css'

const posts = [
  {
    slug: 'prvy-let-paramotorom',
    title: 'Prvý let paramotorom – čo čakať?',
    date: '2024-10-01',
    excerpt:
      'Pred prvým letom panuje vždy trocha nervozity. V tomto článku vám prezradím, čo vás čaká a ako sa najlepšie pripraviť.',
    category: 'Začiatočníci',
  },
  {
    slug: 'kde-lietat-na-slovensku',
    title: 'Najkrajšie miesta na lietanie na Slovensku',
    date: '2024-09-15',
    excerpt:
      'Slovensko ponúka úchvatné scenérie pre paramotorových pilotov. Tu je môj rebríček top lokalít.',
    category: 'Tipy',
  },
  {
    slug: 'bezpecnost-v-paramotorovom-lietani',
    title: 'Bezpečnosť v paramotorovom lietaní',
    date: '2024-08-20',
    excerpt:
      'Bezpečnosť je na prvom mieste. Aké sú základné pravidlá, ktoré by mal dodržiavať každý pilot?',
    category: 'Bezpečnosť',
  },
]

function PostCard({ post }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardImg} aria-hidden="true">
        <i className="fa-solid fa-newspaper" />
      </div>
      <div className={styles.cardBody}>
        <span className={styles.category}>{post.category}</span>
        <h3 className={styles.cardTitle}>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <time className={styles.date} dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('sk-SK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>
    </article>
  )
}

function PostDetail({ post }) {
  return (
    <article className={styles.postDetail}>
      <span className={styles.category}>{post.category}</span>
      <h1 className={styles.postTitle}>{post.title}</h1>
      <time className={styles.date} dateTime={post.date}>
        {new Date(post.date).toLocaleDateString('sk-SK', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
      <p className={styles.postContent}>{post.excerpt}</p>
      <p className={styles.migrationNote}>
        <i className="fa-solid fa-circle-info" aria-hidden="true" /> Plný obsah článku
        bude prenesený počas migrácie.
      </p>
      <Link to="/blog" className={styles.backLink}>
        ← Späť na blog
      </Link>
    </article>
  )
}

export default function Blog() {
  const { slug } = useParams()
  const post = slug ? posts.find((p) => p.slug === slug) : null

  const pageTitle = post
    ? `${post.title} | Blog | Voľné Krídla`
    : 'Blog | Voľné Krídla'
  const pageDesc = post
    ? post.excerpt
    : 'Blog o paramotorovom lietaní. Tipy, skúsenosti a novinky zo sveta paramotor.'

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
      </Helmet>

      {post ? (
        <section className={styles.postSection}>
          <div className={`container ${styles.postContainer}`}>
            <PostDetail post={post} />
          </div>
        </section>
      ) : (
        <>
          <section className={styles.pageHero}>
            <div className="container">
              <SectionHeader
                eyebrow="Blog"
                title="Zápisky z neba"
                subtitle="Články, tipy a príbehy z paramotorového lietania."
              />
            </div>
          </section>

          <section className={styles.listing}>
            <div className="container">
              <div className={styles.grid}>
                {posts.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}
