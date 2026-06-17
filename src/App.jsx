import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Domov from './pages/Domov/Domov'
import VolneKridla from './pages/VolneKridla/VolneKridla'
import OMne from './pages/OMne/OMne'
import Fotogaleria from './pages/Fotogaleria/Fotogaleria'
import Blog from './pages/Blog/Blog'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Domov />} />
          <Route path="/domov" element={<Domov />} />
          <Route path="/volne-kridla" element={<VolneKridla />} />
          <Route path="/o-mne" element={<OMne />} />
          <Route path="/fotogaleria" element={<Fotogaleria />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
