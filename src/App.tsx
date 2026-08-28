import { BrowserRouter, Routes, Route } from "react-router-dom";

import SiteLayout from "./layouts/SiteLayout";
import Home from "./pages/Home";
import VolneKridla from "./pages/VolneKridla";
import OMne from "./pages/OMne";
import Fotogaleria from "./pages/Fotogaleria";
import Placeholder from "./pages/Placeholder";
import Playground from "./pages/Playground";
import Cursor from "./ui/effects/Cursor";

function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <Routes>
        {/* standalone — not wrapped in the site chrome (navbar/footer) */}
        <Route path="/playground" element={<Playground />} />

        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/volne-kridla" element={<VolneKridla />} />
          <Route path="/o-mne" element={<OMne />} />
          <Route path="/fotogaleria" element={<Fotogaleria />} />
          <Route path="/eshop" element={<Placeholder title="E-shop" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
